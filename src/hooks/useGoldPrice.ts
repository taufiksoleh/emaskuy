/**
 * GoldLens — shared live-price store + hook (design.md §10, home.md §0–§1).
 *
 * Implemented as a module-level singleton store (one poller for the whole
 * app) consumed through `useGoldPrice()` — safe to call from Navbar, Home and
 * any page component without duplicate network polling.
 *
 * ```ts
 * const { gold, metals, usdIdr, status, ticks, refetch, refetching } = useGoldPrice();
 * ```
 */
import { useSyncExternalStore } from 'react';
import {
  fetchAllMetals,
  fetchNbpDaily,
  fetchUsdIdr,
  type DataStatus,
  type MetalQuote,
} from '@/lib/api';

export interface Tick {
  /** unix ms */
  t: number;
  /** XAU price USD/oz */
  p: number;
}

export interface GoldPriceState {
  /** All four metals (XAU, XAG, XPT, XPD) */
  metals: MetalQuote[];
  /** Convenience accessor for XAU (may be null before first load) */
  gold: MetalQuote | null;
  /** USD→IDR rate (0 when offline with no cache) */
  usdIdr: number;
  /** Combined data status (worst of metals/fx) */
  status: DataStatus;
  /** True until the very first fetch resolves */
  loading: boolean;
  /** True while a fetch round is in flight */
  refetching: boolean;
  lastUpdated: number;
  /** Accumulated intraday ticks (localStorage-persisted, ≤24h window) */
  ticks: Tick[];
  /** Trigger a manual refresh round */
  refetch: () => void;
}

export const POLL_INTERVAL_MS = 30_000;
const TICKS_KEY = 'goldlens.ticks.xau';
const TICK_WINDOW_MS = 24 * 60 * 60 * 1000;
const TICK_MAX = 4000;

/* ---------------------------------------------------------------- */
/* singleton store                                                   */
/* ---------------------------------------------------------------- */

function loadTicks(): Tick[] {
  try {
    const raw = localStorage.getItem(TICKS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Tick[];
    const cutoff = Date.now() - TICK_WINDOW_MS;
    return Array.isArray(parsed) ? parsed.filter((tk) => tk.t > cutoff) : [];
  } catch {
    return [];
  }
}

function persistTicks(ticks: Tick[]): void {
  try {
    localStorage.setItem(TICKS_KEY, JSON.stringify(ticks.slice(-TICK_MAX)));
  } catch {
    /* non-fatal */
  }
}

let state: GoldPriceState = {
  metals: [],
  gold: null,
  usdIdr: 0,
  status: 'offline',
  loading: true,
  refetching: false,
  lastUpdated: 0,
  ticks: loadTicks(),
  refetch: () => void pollNow(),
};

const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function setState(patch: Partial<GoldPriceState>) {
  state = { ...state, ...patch };
  emit();
}

function worstStatus(a: DataStatus, b: DataStatus): DataStatus {
  const rank: Record<DataStatus, number> = { live: 0, cached: 1, offline: 2 };
  return rank[a] >= rank[b] ? a : b;
}

/* ---- 24h change derivation ---------------------------------------- */
/* gold-api.com's free tier omits prev-close for metals. For XAU we    */
/* derive 24h % from NBP's last two daily closes (scale-invariant).    */
/* For other metals we fall back to a session baseline.                */

const BASE_KEY = 'goldlens.sessionbase';

function loadBase(): Record<string, { p: number; at: number }> {
  try {
    const raw = localStorage.getItem(BASE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, { p: number; at: number }>;
    // discard baselines older than 26h
    const cutoff = Date.now() - 26 * 60 * 60 * 1000;
    return Object.fromEntries(Object.entries(parsed).filter(([, v]) => v.at > cutoff));
  } catch {
    return {};
  }
}

let sessionBase = loadBase();

async function enrichChanges(metals: MetalQuote[]): Promise<MetalQuote[]> {
  const now = Date.now();
  const out = metals.map((m) => ({ ...m }));
  const xau = out.find((m) => m.symbol === 'XAU');
  // XAU: NBP-derived 24h change when the API reports none
  if (xau && xau.price > 0 && xau.changePct === 0) {
    try {
      const d = await fetchNbpDaily(3);
      const pts = d.points;
      if (pts.length >= 2) {
        const prev = pts[pts.length - 2].raw;
        const last = pts[pts.length - 1].raw;
        if (prev > 0) {
          xau.changePct = ((last - prev) / prev) * 100;
          xau.change = (xau.price * xau.changePct) / 100;
          xau.prevClose = xau.price - xau.change;
        }
      }
    } catch {
      /* keep zeros */
    }
  }
  // Other metals: session baseline fallback
  for (const m of out) {
    if (m.price <= 0) continue;
    const base = sessionBase[m.symbol];
    if (!base) {
      sessionBase[m.symbol] = { p: m.price, at: now };
      if (m.symbol !== 'XAU' && m.changePct === 0) {
        m.changePct = 0;
        m.change = 0;
      }
    } else if (m.changePct === 0 && base.p > 0) {
      m.changePct = ((m.price - base.p) / base.p) * 100;
      m.change = m.price - base.p;
      m.prevClose = base.p;
    }
  }
  try {
    localStorage.setItem(BASE_KEY, JSON.stringify(sessionBase));
  } catch {
    /* non-fatal */
  }
  return out;
}

let inFlight = false;
let started = false;

async function pollNow(): Promise<void> {
  if (inFlight) return;
  inFlight = true;
  setState({ refetching: true });
  try {
    const [metalsRaw, fx] = await Promise.all([fetchAllMetals(), fetchUsdIdr()]);
    const metals = await enrichChanges(metalsRaw);
    const gold = metals.find((m) => m.symbol === 'XAU') ?? null;
    let ticks = state.ticks;
    if (gold && gold.price > 0) {
      const last = ticks[ticks.length - 1];
      // Append a tick on every poll round (dedupe identical timestamps).
      if (!last || gold.updatedAt > last.t) {
        ticks = [...ticks, { t: gold.updatedAt || Date.now(), p: gold.price }].filter(
          (tk) => tk.t > Date.now() - TICK_WINDOW_MS,
        );
        ticks = ticks.slice(-TICK_MAX);
        persistTicks(ticks);
      }
    }
    let status: DataStatus = 'live';
    for (const m of metals) status = worstStatus(status, m.status);
    status = worstStatus(status, fx.status);
    setState({
      metals,
      gold,
      usdIdr: fx.rate,
      status,
      loading: false,
      refetching: false,
      lastUpdated: Date.now(),
      ticks,
    });
  } catch {
    setState({ loading: false, refetching: false, status: 'offline' });
  } finally {
    inFlight = false;
  }
}

function ensureStarted() {
  if (started) return;
  started = true;
  void pollNow();
  setInterval(() => void pollNow(), POLL_INTERVAL_MS);
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  ensureStarted();
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot(): GoldPriceState {
  return state;
}

/** Shared live gold-price hook. One poller app-wide. */
export function useGoldPrice(): GoldPriceState {
  return useSyncExternalStore(subscribe, getSnapshot);
}
