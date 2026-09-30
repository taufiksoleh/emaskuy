import { describe, expect, it, vi } from 'vitest';
import type { FxSeries, NbpEntry } from './api';
import {
  HISTORY_KEYS,
  RECHECK_MS,
  createHistoryStore,
  historyValue,
  joinNbpWithFx,
  mergeByDate,
  needsFxSeries,
  prevCloseBefore,
  type HistoryDeps,
} from './history';
import type { KV } from './storage';

function memoryStore(): KV & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return {
    data,
    get length() {
      return data.size;
    },
    key: (i) => [...data.keys()][i] ?? null,
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => void data.set(k, v),
    removeItem: (k) => void data.delete(k),
  };
}

describe('joinNbpWithFx', () => {
  it('converts a PLN fixing with the same-day ECB rates', () => {
    // Verified 29 Sep 2026: gold-api live spot was $4,146.2.
    const [p] = joinNbpWithFx(
      [{ data: '2026-09-29', cena: 512.64 }],
      { '2026-09-29': { USD: 0.26012, IDR: 4661.76 } },
    );
    expect(p.usd).toBeCloseTo(4147.6, 1);
    expect(p.idr).toBeCloseTo(2389805, -1);
    expect(p.t).toBe(Date.parse('2026-09-29T00:00:00Z'));
  });

  it('carries the previous rate forward over an ECB holiday, never backward', () => {
    const points = joinNbpWithFx(
      [
        { data: '2026-04-02', cena: 100 },
        { data: '2026-04-03', cena: 100 }, // Good Friday: no ECB rate
        { data: '2026-04-06', cena: 100 },
      ],
      {
        '2026-04-02': { USD: 0.25, IDR: 4000 },
        '2026-04-06': { USD: 0.3, IDR: 5000 },
      },
    );
    expect(points.map((p) => p.idr)).toEqual([400000, 400000, 500000]);
  });

  it('skips fixings before the first rate and beyond the carry limit', () => {
    const points = joinNbpWithFx(
      [
        { data: '2026-01-01', cena: 100 },
        { data: '2026-01-05', cena: 100 },
        { data: '2026-01-20', cena: 100 },
      ],
      { '2026-01-05': { USD: 0.25, IDR: 4000 }, '2026-01-30': { USD: 0.25, IDR: 4000 } },
      7,
    );
    expect(points.map((p) => p.date)).toEqual(['2026-01-05']);
  });

  it('drops fixings newer than the last rate (ECB publishes later than NBP)', () => {
    const points = joinNbpWithFx(
      [
        { data: '2026-09-29', cena: 100 },
        { data: '2026-09-30', cena: 101 },
      ],
      { '2026-09-29': { USD: 0.25, IDR: 4000 } },
    );
    expect(points.map((p) => p.date)).toEqual(['2026-09-29']);
  });

  it('ignores invalid rows', () => {
    expect(
      joinNbpWithFx(
        [{ data: '2026-09-29', cena: NaN }],
        { '2026-09-29': { USD: 0.25, IDR: 4000 } },
      ),
    ).toEqual([]);
    expect(joinNbpWithFx([{ data: '2026-09-29', cena: 100 }], { '2026-09-29': { USD: 0.25 } })).toEqual([]);
  });
});

describe('series helpers', () => {
  const pts = joinNbpWithFx(
    [
      { data: '2026-09-25', cena: 100 },
      { data: '2026-09-28', cena: 101 },
      { data: '2026-09-29', cena: 102 },
    ],
    {
      '2026-09-25': { USD: 0.25, IDR: 4000 },
      '2026-09-28': { USD: 0.25, IDR: 4000 },
      '2026-09-29': { USD: 0.25, IDR: 4000 },
    },
  );

  it('finds the previous close strictly before a day', () => {
    expect(prevCloseBefore(pts, '2026-09-29')?.date).toBe('2026-09-28');
    expect(prevCloseBefore(pts, '2026-09-30')?.date).toBe('2026-09-29');
    expect(prevCloseBefore(pts, '2026-09-25')).toBeNull();
  });

  it('merges by date with the second series winning', () => {
    const newer = pts.slice(2).map((p) => ({ ...p, idr: 1 }));
    const merged = mergeByDate(pts, newer);
    expect(merged).toHaveLength(3);
    expect(merged[2].idr).toBe(1);
  });
});

/* ------------------------------------------------------------------ */

const DAY = 24 * 60 * 60 * 1000;

function fakeDeps(start = Date.parse('2026-09-30T08:00:00Z')) {
  let now = start;
  let latest = '2026-09-29';
  const fixings = (): NbpEntry[] => {
    const out: NbpEntry[] = [];
    for (let t = Date.parse(`${latest}T00:00:00Z`) - 360 * DAY; t <= Date.parse(`${latest}T00:00:00Z`); t += DAY) {
      out.push({ data: new Date(t).toISOString().slice(0, 10), cena: 500 });
    }
    return out;
  };
  const rates = (): FxSeries =>
    Object.fromEntries(fixings().map((e) => [e.data, { USD: 0.26, IDR: 4600 }]));
  const deps = {
    nbpLast: vi.fn(async (n: number) => fixings().slice(-n)),
    nbpRange: vi.fn(async (s: string, e: string) => fixings().filter((f) => f.data >= s && f.data <= e)),
    fxSeries: vi.fn(async () => rates()),
    storage: memoryStore(),
    now: () => now,
  } satisfies HistoryDeps;
  return {
    deps,
    advance: (ms: number) => void (now += ms),
    publish: (day: string) => void (latest = day),
  };
}

describe('history store', () => {
  it('dedupes concurrent loads: one NBP and one FX request', async () => {
    const { deps } = fakeDeps();
    const store = createHistoryStore(deps);
    await Promise.all([store.load('1y'), store.load('1y'), store.load('1y')]);
    expect(deps.nbpLast).toHaveBeenCalledTimes(1);
    expect(deps.fxSeries).toHaveBeenCalledTimes(1);
    const snap = store.get('1y');
    expect(snap.status).toBe('live');
    expect(snap.asOf).toBe('2026-09-29');
    expect(snap.points).toHaveLength(255);
  });

  it('makes no request within the re-check window, even after a reload', async () => {
    const { deps, advance } = fakeDeps();
    await createHistoryStore(deps).load('1y');
    advance(RECHECK_MS - 1000);
    const reloaded = createHistoryStore(deps);
    expect(reloaded.get('1y').points.length).toBeGreaterThan(0);
    await reloaded.load('1y');
    expect(deps.nbpLast).toHaveBeenCalledTimes(1);
  });

  it('probes once after the window and refetches only when NBP has a new day', async () => {
    const { deps, advance, publish } = fakeDeps();
    const store = createHistoryStore(deps);
    await store.load('1y');

    advance(RECHECK_MS + 1000);
    await store.load('1y');
    expect(deps.nbpLast).toHaveBeenLastCalledWith(1);
    expect(deps.fxSeries).toHaveBeenCalledTimes(1);

    advance(RECHECK_MS + 1000);
    publish('2026-09-30');
    await store.load('1y');
    expect(deps.fxSeries).toHaveBeenCalledTimes(2);
    expect(store.get('1y').asOf).toBe('2026-09-30');
    // one key per window, overwritten in place
    const keys = [...deps.storage.data.keys()];
    expect(keys.filter((k) => k.startsWith('emaskuy.cache.hist.'))).toEqual([HISTORY_KEYS['1y']]);
  });

  it('keeps cached points and reports "cached" when the network fails', async () => {
    const { deps, advance } = fakeDeps();
    const store = createHistoryStore(deps);
    await store.load('1y');
    advance(RECHECK_MS + 1000);
    deps.nbpLast.mockRejectedValueOnce(new Error('offline'));
    await store.load('1y');
    expect(store.get('1y').status).toBe('cached');
    expect(store.get('1y').points.length).toBeGreaterThan(0);
  });

  it('builds the ALL archive once and merges the fresh year into it', async () => {
    const { deps } = fakeDeps();
    const store = createHistoryStore(deps);
    await store.load('all');
    expect(deps.nbpRange).toHaveBeenCalledTimes(1);
    const all = store.get('all').points;
    expect(all[all.length - 1].date).toBe('2026-09-29');
    expect(deps.storage.data.has(HISTORY_KEYS.all)).toBe(true);

    await createHistoryStore(deps).load('all');
    expect(deps.nbpRange).toHaveBeenCalledTimes(1);
  });
});

describe('historyValue', () => {
  const p = { date: '2026-09-29', t: Date.parse('2026-09-29T00:00:00Z'), usd: 4147.6, idr: 2_389_805 };
  const OZ = 31.1034768;

  it('reads USD and IDR from the point itself, in any weight', () => {
    expect(historyValue(p, 'USD', 'ozt')).toBeCloseTo(4147.6, 9);
    expect(historyValue(p, 'USD', 'g')).toBeCloseTo(4147.6 / OZ, 9);
    expect(historyValue(p, 'IDR', 'g')).toBe(2_389_805);
    expect(historyValue(p, 'IDR', 'ozt')).toBeCloseTo(2_389_805 * OZ, 6);
  });

  it("uses that day's rate for other currencies, and the peg for SAR/AED", () => {
    const fxOn = (date: string) => (date === '2026-09-29' ? 4.081 : 0);
    expect(historyValue(p, 'MYR', 'g', fxOn)).toBeCloseTo((4147.6 / OZ) * 4.081, 9);
    expect(historyValue(p, 'MYR', 'g')).toBe(0);
    expect(historyValue({ ...p, date: '2026-09-30' }, 'MYR', 'g', fxOn)).toBe(0);
    expect(historyValue(p, 'SAR', 'tola')).toBeCloseTo((4147.6 / OZ) * 11.6638038 * 3.75, 9);
  });

  it('knows which currencies need a separate rate series', () => {
    expect(['USD', 'IDR', 'SAR', 'AED', 'MYR', 'EUR'].filter((c) => needsFxSeries(c as 'USD'))).toEqual(['MYR', 'EUR']);
  });
});
