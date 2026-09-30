/**
 * EmasKuy — accurate daily gold history.
 *
 * NBP publishes one gold fixing per business day in PLN per gram. Each
 * fixing is converted with the SAME DAY's ECB rates (Frankfurter, base PLN),
 * so every point carries a real USD/oz and IDR/gram value for its own date.
 * (Rescaling the PLN series by one constant, as v1 did, bakes USD/PLN moves
 * into the USD chart and converts all rupiah history at today's rate.)
 *
 * The store fetches the last year in 2 requests, re-checks at most every 30
 * minutes, dedupes concurrent loads and keeps ONE cache key per window.
 */
import type { DataStatus, FxSeries, NbpEntry } from './api';
import { TROY_OZ_GRAMS, isoDateUtc, type Unit } from './gold';
import { readJson, writeJson, type KV } from './storage';

export type HistoryWindow = '1y' | 'all';

export interface HistoryPoint {
  /** Fixing date, YYYY-MM-DD */
  date: string;
  /** Unix ms of the date at 00:00 UTC */
  t: number;
  /** USD per troy ounce */
  usd: number;
  /** IDR per gram */
  idr: number;
}

export interface HistorySnapshot {
  points: HistoryPoint[];
  status: DataStatus;
  loading: boolean;
  /** Latest NBP fixing date seen, YYYY-MM-DD */
  asOf: string | null;
}

const DAY_MS = 24 * 60 * 60 * 1000;

const dayDiff = (from: string, to: string) =>
  Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY_MS);

const validFx = (r: FxSeries[string] | undefined): r is { USD: number; IDR: number } =>
  !!r && Number.isFinite(r.USD) && Number.isFinite(r.IDR) && r.USD! > 0 && r.IDR! > 0;

/**
 * Convert NBP fixings with the ECB rate of the same date. When a date has no
 * rate (ECB holiday) the latest earlier rate is carried forward, never a
 * later one, for at most `maxCarryDays`. Fixings newer than the last rate are
 * dropped as provisional: NBP publishes around noon Warsaw time, ECB at 16:00.
 */
export function joinNbpWithFx(nbp: NbpEntry[], fx: FxSeries, maxCarryDays = 7): HistoryPoint[] {
  const fxDates = Object.keys(fx)
    .filter((d) => validFx(fx[d]))
    .sort();
  if (fxDates.length === 0) return [];
  const lastFx = fxDates[fxDates.length - 1];
  const fixings = nbp
    .filter((e) => typeof e.data === 'string' && Number.isFinite(e.cena) && e.cena > 0)
    .sort((a, b) => a.data.localeCompare(b.data));

  const out: HistoryPoint[] = [];
  let j = -1;
  for (const e of fixings) {
    if (e.data > lastFx) break;
    while (j + 1 < fxDates.length && fxDates[j + 1] <= e.data) j++;
    if (j < 0) continue;
    if (dayDiff(fxDates[j], e.data) > maxCarryDays) continue;
    if (out.length > 0 && out[out.length - 1].date === e.data) continue;
    const rate = fx[fxDates[j]] as { USD: number; IDR: number };
    out.push({
      date: e.data,
      t: Date.parse(`${e.data}T00:00:00Z`),
      usd: e.cena * rate.USD * TROY_OZ_GRAMS,
      idr: e.cena * rate.IDR,
    });
  }
  return out;
}

/** The latest point dated strictly before `isoDay` (the previous close). */
export function prevCloseBefore(points: HistoryPoint[], isoDay: string): HistoryPoint | null {
  for (let i = points.length - 1; i >= 0; i--) {
    if (points[i].date < isoDay) return points[i];
  }
  return null;
}

/** The latest point at or before `ms`. */
export function pointAtOrBefore(points: HistoryPoint[], ms: number): HistoryPoint | null {
  for (let i = points.length - 1; i >= 0; i--) {
    if (points[i].t <= ms) return points[i];
  }
  return null;
}

export function sliceSince(points: HistoryPoint[], sinceMs: number): HistoryPoint[] {
  return points.filter((p) => p.t >= sinceMs);
}

export function unitValue(p: HistoryPoint, unit: Unit): number {
  return unit === 'idr-gr' ? p.idr : p.usd;
}

/** Merge two date-sorted series; `b` wins on the same date. */
export function mergeByDate(a: HistoryPoint[], b: HistoryPoint[]): HistoryPoint[] {
  const byDate = new Map<string, HistoryPoint>();
  for (const p of a) byDate.set(p.date, p);
  for (const p of b) byDate.set(p.date, p);
  return [...byDate.values()].sort((x, y) => x.date.localeCompare(y.date));
}

/* ------------------------------------------------------------------ */
/* Store                                                               */
/* ------------------------------------------------------------------ */

type Packed = [date: string, usd: number, idr: number];

interface Cached1y {
  v: 1;
  asOf: string;
  checkedAt: number;
  /** False while the newest fixing still waits for its ECB rate. */
  complete: boolean;
  points: Packed[];
}

interface CachedAll {
  v: 1;
  points: Packed[];
}

export const HISTORY_KEYS = {
  '1y': 'emaskuy.cache.hist.1y',
  all: 'emaskuy.cache.hist.all',
} as const;

/** How often the 1-year window is re-checked against NBP. */
export const RECHECK_MS = 30 * 60 * 1000;
/** First NBP fixing; FX starts a little earlier so it can carry forward. */
const NBP_EARLIEST = '2013-01-02';
const FX_EARLIEST = '2012-12-20';

const pack = (points: HistoryPoint[]): Packed[] =>
  points.map((p) => [p.date, Math.round(p.usd * 100) / 100, Math.round(p.idr)]);

const unpack = (rows: unknown): HistoryPoint[] =>
  Array.isArray(rows)
    ? rows
        .filter(
          (r): r is Packed =>
            Array.isArray(r) &&
            typeof r[0] === 'string' &&
            Number.isFinite(r[1]) &&
            Number.isFinite(r[2]),
        )
        .map(([date, usd, idr]) => ({ date, t: Date.parse(`${date}T00:00:00Z`), usd, idr }))
    : [];

export interface HistoryDeps {
  nbpLast: (n: number) => Promise<NbpEntry[]>;
  nbpRange: (start: string, end: string) => Promise<NbpEntry[]>;
  fxSeries: (start: string, end?: string) => Promise<FxSeries>;
  storage: KV | null;
  now: () => number;
}

export interface HistoryStore {
  get(w: HistoryWindow): HistorySnapshot;
  subscribe(cb: () => void): () => void;
  load(w: HistoryWindow): Promise<void>;
}

/** Before the first load finishes, consumers render a skeleton. */
const EMPTY: HistorySnapshot = { points: [], status: 'offline', loading: true, asOf: null };

export function createHistoryStore(deps: HistoryDeps): HistoryStore {
  const snaps: Record<HistoryWindow, HistorySnapshot> = { '1y': EMPTY, all: EMPTY };
  const listeners = new Set<() => void>();
  const inflight = new Map<HistoryWindow, Promise<void>>();

  let hydrated = false;
  let meta: { asOf: string; checkedAt: number; complete: boolean } | null = null;
  let oneYear: HistoryPoint[] = [];
  let archive: HistoryPoint[] | null = null;

  const emit = () => listeners.forEach((l) => l());

  const set = (w: HistoryWindow, patch: Partial<HistorySnapshot>) => {
    const prev = snaps[w];
    const next = { ...prev, ...patch };
    if (
      next.points === prev.points &&
      next.status === prev.status &&
      next.loading === prev.loading &&
      next.asOf === prev.asOf
    ) {
      return;
    }
    snaps[w] = next;
    emit();
  };

  const hydrate = () => {
    if (hydrated) return;
    hydrated = true;
    const c = readJson<Cached1y>(HISTORY_KEYS['1y'], deps.storage);
    if (!c || c.v !== 1) return;
    const points = unpack(c.points);
    if (points.length === 0) return;
    oneYear = points;
    meta = { asOf: c.asOf, checkedAt: c.checkedAt, complete: c.complete };
    snaps['1y'] = { points, status: 'cached', loading: false, asOf: c.asOf };
  };

  const persistOneYear = () => {
    if (!meta) return;
    const payload: Cached1y = { v: 1, ...meta, points: pack(oneYear) };
    writeJson(HISTORY_KEYS['1y'], payload, deps.storage);
  };

  const readArchive = (): HistoryPoint[] | null => {
    if (archive) return archive;
    const c = readJson<CachedAll>(HISTORY_KEYS.all, deps.storage);
    const points = c && c.v === 1 ? unpack(c.points) : [];
    archive = points.length > 0 ? points : null;
    return archive;
  };

  const writeArchive = (points: HistoryPoint[]) => {
    archive = points;
    const payload: CachedAll = { v: 1, points: pack(points) };
    writeJson(HISTORY_KEYS.all, payload, deps.storage);
  };

  /** Keep a stored archive contiguous by folding each fresh year into it. */
  const extendArchive = () => {
    const current = readArchive();
    if (!current || oneYear.length === 0) return;
    const merged = mergeByDate(current, oneYear);
    writeArchive(merged);
    if (snaps.all.points.length > 0) set('all', { points: merged, asOf: meta?.asOf ?? null });
  };

  async function loadOneYear(): Promise<void> {
    hydrate();
    const now = deps.now();
    if (meta && oneYear.length > 0 && now - meta.checkedAt < RECHECK_MS) {
      set('1y', { status: 'live', loading: false });
      return;
    }
    set('1y', { loading: oneYear.length === 0 });
    try {
      if (meta && oneYear.length > 0 && meta.complete) {
        const probe = await deps.nbpLast(1);
        const latest = probe[probe.length - 1]?.data;
        if (latest && latest === meta.asOf) {
          meta = { ...meta, checkedAt: now };
          persistOneYear();
          set('1y', { status: 'live', loading: false });
          return;
        }
      }
      const [nbp, fx] = await Promise.all([
        deps.nbpLast(255),
        deps.fxSeries(isoDateUtc(now - 400 * DAY_MS)),
      ]);
      const points = joinNbpWithFx(nbp, fx);
      if (points.length === 0) throw new Error('empty history');
      const asOf = nbp.reduce((max, e) => (e.data > max ? e.data : max), points[points.length - 1].date);
      oneYear = points;
      meta = { asOf, checkedAt: now, complete: points[points.length - 1].date === asOf };
      persistOneYear();
      set('1y', { points, status: 'live', loading: false, asOf });
      extendArchive();
    } catch {
      set('1y', { status: oneYear.length > 0 ? 'cached' : 'offline', loading: false });
    }
  }

  async function loadAll(): Promise<void> {
    await load('1y');
    if (oneYear.length === 0) {
      set('all', { status: 'offline', loading: false });
      return;
    }
    let base = readArchive();
    const firstDay = oneYear[0].date;
    // A stored archive must reach the start of the 1-year window; after a
    // long absence the gap is refetched in full (rare, ~54 NBP requests).
    if (!base || base[base.length - 1].date < firstDay) {
      set('all', { loading: true });
      try {
        const [nbp, fx] = await Promise.all([
          deps.nbpRange(NBP_EARLIEST, firstDay),
          deps.fxSeries(FX_EARLIEST, firstDay),
        ]);
        const points = joinNbpWithFx(nbp, fx);
        if (points.length === 0) throw new Error('empty archive');
        base = points;
      } catch {
        set('all', { status: snaps.all.points.length > 0 ? 'cached' : 'offline', loading: false });
        return;
      }
    }
    const merged = mergeByDate(base, oneYear);
    const stored = archive;
    const unchanged =
      stored !== null &&
      stored.length === merged.length &&
      stored[stored.length - 1].date === merged[merged.length - 1].date;
    if (unchanged) archive = merged;
    else writeArchive(merged);
    set('all', { points: merged, status: snaps['1y'].status, loading: false, asOf: meta?.asOf ?? null });
  }

  function load(w: HistoryWindow): Promise<void> {
    const running = inflight.get(w);
    if (running) return running;
    const task = (w === '1y' ? loadOneYear() : loadAll()).finally(() => inflight.delete(w));
    inflight.set(w, task);
    return task;
  }

  return {
    get: (w) => {
      if (w === '1y') hydrate();
      return snaps[w];
    },
    subscribe: (cb) => {
      listeners.add(cb);
      return () => {
        listeners.delete(cb);
      };
    },
    load,
  };
}
