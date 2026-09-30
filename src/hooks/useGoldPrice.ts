/**
 * EmasKuy — shared live-price store + hook (design.md §10, home.md §0–§1).
 *
 * Implemented as a module-level singleton store (one poller for the whole
 * app) consumed through `useGoldPrice()` — safe to call from Navbar, Home and
 * any page component without duplicate network polling. The poller pauses
 * while the tab is hidden.
 *
 * ```ts
 * const { gold, metals, usdIdr, rates, status, ticks, refetch, refetching } = useGoldPrice();
 * ```
 */
import { useSyncExternalStore } from 'react';
import {
  cachedFx,
  cachedMetals,
  fetchAllMetals,
  fetchFx,
  type DataStatus,
  type FxRates,
  type MetalQuote,
} from '@/lib/api';
import { TROY_OZ_GRAMS, isoDateUtc } from '@/lib/gold';
import { PEGGED, WEIGHT, pricePer, rateOnOrBefore, type Currency, type Rates, type WeightUnit } from '@/lib/money';
import { prevCloseBefore, type HistoryPoint } from '@/lib/history';
import { readJson, writeJson } from '@/lib/storage';
import { afterFirstPaint } from '@/lib/afterPaint';
import { historyStore } from './useHistory';

export interface Tick {
  /** unix ms */
  t: number;
  /** Price, USD/oz */
  p: number;
}

export type OtherMetal = 'XAG' | 'XPT' | 'XPD';
export const OTHER_METALS: OtherMetal[] = ['XAG', 'XPT', 'XPD'];

export interface GoldPriceState {
  /** All four metals (XAU, XAG, XPT, XPD) */
  metals: MetalQuote[];
  /** Convenience accessor for XAU (may be null before first load) */
  gold: MetalQuote | null;
  /** USD→IDR rate (0 when offline with no cache) */
  usdIdr: number;
  /** Units of each currency per USD (pegs only when offline with no cache) */
  rates: Rates;
  /** Latest ECB reference rates, with the last ~10 days */
  fx: FxRates | null;
  /** Previous daily close (NBP fixing at same-day ECB rates) */
  prevClose: HistoryPoint | null;
  /** Combined data status (worst of metals/fx) */
  status: DataStatus;
  /** True until the very first fetch resolves */
  loading: boolean;
  /** True while a fetch round is in flight */
  refetching: boolean;
  lastUpdated: number;
  /** Accumulated intraday gold ticks (localStorage-persisted, ≤24h window) */
  ticks: Tick[];
  /** The same for silver, platinum and palladium, one per 2 minutes */
  metalTicks: Record<OtherMetal, Tick[]>;
  /** Trigger a manual refresh round */
  refetch: () => void;
}

export const POLL_INTERVAL_MS = 30_000;
/** ECB publishes once a day, so the rate is re-fetched at most this often. */
const FX_REFRESH_MS = 30 * 60 * 1000;
const TICKS_KEY = 'emaskuy.ticks.xau';
const TICK_WINDOW_MS = 24 * 60 * 60 * 1000;
const TICK_MAX = 4000;
/** Other metals keep a tick per 2 minutes: enough for a day's chart at a fifth of the storage. */
const METAL_TICK_SPACING_MS = 2 * 60 * 1000;
const metalTicksKey = (s: OtherMetal) => `emaskuy.ticks.${s.toLowerCase()}`;

/* ---------------------------------------------------------------- */
/* singleton store                                                   */
/* ---------------------------------------------------------------- */

function loadTicks(key: string = TICKS_KEY): Tick[] {
  const parsed = readJson<Tick[]>(key);
  const cutoff = Date.now() - TICK_WINDOW_MS;
  return Array.isArray(parsed) ? parsed.filter((tk) => tk && tk.t > cutoff && tk.p > 0) : [];
}

function loadMetalTicks(): Record<OtherMetal, Tick[]> {
  return { XAG: loadTicks(metalTicksKey('XAG')), XPT: loadTicks(metalTicksKey('XPT')), XPD: loadTicks(metalTicksKey('XPD')) };
}

/** `list` plus a tick at `t`, or null when the last one is less than `spacing` older. */
function withTick(list: Tick[], t: number, p: number, spacing: number): Tick[] | null {
  const last = list[list.length - 1];
  if (last && t - last.t < spacing) return null;
  return [...list, { t, p }].filter((tk) => tk.t > Date.now() - TICK_WINDOW_MS).slice(-TICK_MAX);
}

function currentPrevClose(): HistoryPoint | null {
  return prevCloseBefore(historyStore.get('1y').points, isoDateUtc(Date.now()));
}

/** Returning visitors see the last known price at once, marked as cached. */
function bootState(): Pick<
  GoldPriceState,
  'metals' | 'gold' | 'usdIdr' | 'rates' | 'fx' | 'prevClose' | 'status' | 'loading'
> {
  const prevClose = currentPrevClose();
  const metals = applyXauChange(cachedMetals(), prevClose);
  const gold = metals.find((m) => m.symbol === 'XAU') ?? null;
  const fx = cachedFx();
  const ready = gold !== null && fx !== null;
  return {
    metals,
    gold,
    usdIdr: fx?.rates.IDR ?? 0,
    rates: fx?.rates ?? { ...PEGGED },
    fx,
    prevClose,
    status: ready ? 'cached' : 'offline',
    loading: !ready,
  };
}

let state: GoldPriceState = {
  ...bootState(),
  refetching: false,
  lastUpdated: 0,
  ticks: loadTicks(),
  metalTicks: loadMetalTicks(),
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
/* gold-api.com's free tier omits prev-close. XAU compares the live     */
/* price with the previous daily close in USD; other metals fall back   */
/* to the first price this browser saw in the last 26 hours.            */

const BASE_KEY = 'emaskuy.sessionbase';

function loadBase(): Record<string, { p: number; at: number }> {
  const parsed = readJson<Record<string, { p: number; at: number }>>(BASE_KEY) ?? {};
  const cutoff = Date.now() - 26 * 60 * 60 * 1000;
  return Object.fromEntries(Object.entries(parsed).filter(([, v]) => v && v.at > cutoff));
}

const sessionBase = loadBase();

function applyXauChange(metals: MetalQuote[], prev: HistoryPoint | null): MetalQuote[] {
  return metals.map((m) => {
    if (m.symbol !== 'XAU' || m.apiChange || m.price <= 0 || !prev || prev.usd <= 0) return m;
    const change = m.price - prev.usd;
    return { ...m, prevClose: prev.usd, change, changePct: (change / prev.usd) * 100 };
  });
}

function applySessionBaseline(metals: MetalQuote[]): MetalQuote[] {
  const now = Date.now();
  const out = metals.map((m) => {
    if (m.symbol === 'XAU' || m.apiChange || m.price <= 0) return m;
    const base = sessionBase[m.symbol];
    if (!base) {
      sessionBase[m.symbol] = { p: m.price, at: now };
      return { ...m, changeSince: now };
    }
    if (base.p <= 0) return m;
    return {
      ...m,
      prevClose: base.p,
      change: m.price - base.p,
      changePct: ((m.price - base.p) / base.p) * 100,
      changeSince: base.at,
    };
  });
  writeJson(BASE_KEY, sessionBase);
  return out;
}

/* Re-derive the XAU change whenever the daily history updates. */
historyStore.subscribe(() => {
  const prevClose = currentPrevClose();
  if (prevClose === state.prevClose) return;
  const metals = applyXauChange(state.metals, prevClose);
  setState({ prevClose, metals, gold: metals.find((m) => m.symbol === 'XAU') ?? null });
});

let inFlight = false;
let started = false;
let timer: ReturnType<typeof setInterval> | null = null;
let fxFetchedAt = 0;

async function pollNow(): Promise<void> {
  if (inFlight) return;
  inFlight = true;
  setState({ refetching: true });
  void historyStore.load('1y');
  try {
    const needFx = !state.fx || state.fx.status !== 'live' || Date.now() - fxFetchedAt > FX_REFRESH_MS;
    const [metalsRaw, fx] = await Promise.all([
      fetchAllMetals(),
      needFx ? fetchFx() : Promise.resolve(state.fx as FxRates),
    ]);
    if (needFx && fx.status === 'live') fxFetchedAt = Date.now();
    const metals = applyXauChange(applySessionBaseline(metalsRaw), state.prevClose);
    const gold = metals.find((m) => m.symbol === 'XAU') ?? null;
    let ticks = state.ticks;
    if (gold && gold.price > 0 && gold.status === 'live') {
      // A tick on every poll round (dedupe identical timestamps).
      const next = withTick(ticks, gold.updatedAt || Date.now(), gold.price, 1);
      if (next) {
        ticks = next;
        writeJson(TICKS_KEY, ticks);
      }
    }
    const metalTicks = { ...state.metalTicks };
    for (const m of metals) {
      if (m.symbol === 'XAU' || m.price <= 0 || m.status !== 'live') continue;
      const next = withTick(metalTicks[m.symbol], m.updatedAt || Date.now(), m.price, METAL_TICK_SPACING_MS);
      if (next) {
        metalTicks[m.symbol] = next;
        writeJson(metalTicksKey(m.symbol), next);
      }
    }
    let status: DataStatus = 'live';
    for (const m of metals) status = worstStatus(status, m.status);
    status = worstStatus(status, fx.status);
    setState({
      metals,
      gold,
      usdIdr: fx.rates.IDR ?? 0,
      rates: fx.rates,
      fx,
      status,
      loading: false,
      refetching: false,
      lastUpdated: Date.now(),
      ticks,
      metalTicks,
    });
  } catch {
    setState({ loading: false, refetching: false, status: 'offline' });
  } finally {
    inFlight = false;
  }
}

/** While price alerts are armed, hidden tabs still check once a minute (browsers allow that). */
const BACKGROUND_POLL_MS = 60_000;
let backgroundPolling = false;

function startTimer(ms: number = POLL_INTERVAL_MS) {
  if (timer === null) timer = setInterval(() => void pollNow(), ms);
}

function stopTimer() {
  if (timer !== null) {
    clearInterval(timer);
    timer = null;
  }
}

/* Hidden tabs don't poll, unless an alert is waiting: saves data quota and battery on phones. */
function onVisibilityChange() {
  stopTimer();
  if (document.hidden) {
    if (backgroundPolling) startTimer(BACKGROUND_POLL_MS);
    return;
  }
  if (Date.now() - state.lastUpdated >= POLL_INTERVAL_MS) void pollNow();
  startTimer();
}

/** Keep polling (slowly) in a hidden tab, for price alerts. */
export function setBackgroundPolling(on: boolean): void {
  if (backgroundPolling === on) return;
  backgroundPolling = on;
  if (started && typeof document !== 'undefined' && document.hidden) {
    stopTimer();
    if (on) startTimer(BACKGROUND_POLL_MS);
  }
}

function ensureStarted() {
  if (started) return;
  started = true;
  // Cached prices (or skeletons) show first; the first request waits until
  // that screen has painted.
  afterFirstPaint(() => void pollNow());
  if (typeof document === 'undefined') {
    startTimer();
    return;
  }
  document.addEventListener('visibilitychange', onVisibilityChange);
  if (!document.hidden) startTimer();
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

/** For code outside React (the price-alert watcher). Starts the poller. */
export { subscribe as subscribeGoldPrice, getSnapshot as getGoldPrice };

/** Shared live gold-price hook. One poller app-wide. */
export function useGoldPrice(): GoldPriceState {
  return useSyncExternalStore(subscribe, getSnapshot);
}

/**
 * Gold's change since the previous daily close in `currency` per `weight`.
 * Outside USD it includes the currency's own move against the dollar: the
 * close is valued at that day's exchange rate.
 */
export function useXauChange(currency: Currency, weight: WeightUnit): { pct: number; abs: number } {
  const { gold, rates, fx, prevClose } = useGoldPrice();
  if (!gold || gold.price <= 0) return { pct: 0, abs: 0 };
  const grams = WEIGHT[weight].grams;
  if (currency === 'USD') return { pct: gold.changePct, abs: (gold.change / TROY_OZ_GRAMS) * grams };
  const now = pricePer(gold.price, currency, 'g', rates);
  let prev = 0;
  if (prevClose && currency === 'IDR') prev = prevClose.idr;
  else if (prevClose && fx) prev = (prevClose.usd / TROY_OZ_GRAMS) * rateOnOrBefore(fx.recent, prevClose.date, currency);
  if (now <= 0 || prev <= 0) return { pct: gold.changePct, abs: 0 };
  return { pct: (now / prev - 1) * 100, abs: (now - prev) * grams };
}
