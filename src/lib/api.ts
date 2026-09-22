/**
 * EmasKuy — data layer (design.md §10).
 *
 * Sources:
 *  - Live metal prices:  https://api.gold-api.com/price/{XAU|XAG|XPT|XPD}  (poll 30s)
 *  - USD→IDR rate:       https://api.frankfurter.dev/v1/latest?base=USD&symbols=IDR
 *  - Daily history:      https://api.nbp.pl/api/cenyzlota/... (PLN/g, normalized to live XAU/USD)
 *
 * Every fetch is wrapped in try/catch with a localStorage cache fallback and
 * reports a status: 'live' | 'cached' | 'offline'.
 */

export type DataStatus = 'live' | 'cached' | 'offline';

export type MetalSymbol = 'XAU' | 'XAG' | 'XPT' | 'XPD';

export interface MetalQuote {
  symbol: MetalSymbol;
  /** USD per troy ounce */
  price: number;
  /** Previous close, USD per troy ounce (may equal price when unknown) */
  prevClose: number;
  /** 24h change in percent */
  changePct: number;
  /** Absolute 24h change, USD */
  change: number;
  updatedAt: number;
  status: DataStatus;
}

export interface FxRate {
  base: 'USD';
  symbol: 'IDR';
  rate: number;
  date: string;
  updatedAt: number;
  status: DataStatus;
}

export interface DailyPoint {
  /** unix ms (UTC day) */
  t: number;
  /** close price, normalized to live XAU/USD */
  close: number;
  /** raw NBP value (PLN per gram) */
  raw: number;
}

export interface DailySeries {
  points: DailyPoint[];
  status: DataStatus;
}

const FETCH_TIMEOUT_MS = 9000;

async function fetchJson<T>(url: string): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

/* ------------------------------------------------------------------ */
/* localStorage cache                                                  */
/* ------------------------------------------------------------------ */

const CACHE_PREFIX = 'emaskuy.cache.';

function cacheSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ at: Date.now(), value }));
  } catch {
    /* storage full / unavailable — non-fatal */
  }
}

function cacheGet<T>(key: string): { at: number; value: T } | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    return JSON.parse(raw) as { at: number; value: T };
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* gold-api.com                                                        */
/* ------------------------------------------------------------------ */

interface GoldApiResponse {
  name?: string;
  price?: number;
  symbol?: string;
  metal?: string;
  currency?: string;
  updatedAt?: string;
  updatedAtReadable?: string;
  prev_close_price?: number;
  open_price?: number;
  ch?: number;
  chp?: number;
  ask?: number;
  bid?: number;
}

export async function fetchMetal(symbol: MetalSymbol): Promise<MetalQuote> {
  const cacheKey = `metal.${symbol}`;
  try {
    const data = await fetchJson<GoldApiResponse>(`https://api.gold-api.com/price/${symbol}`);
    const price = Number(data.price);
    if (!Number.isFinite(price) || price <= 0) throw new Error('invalid price');
    const prevClose =
      Number.isFinite(Number(data.prev_close_price)) && Number(data.prev_close_price) > 0
        ? Number(data.prev_close_price)
        : price;
    const change = Number.isFinite(Number(data.ch)) ? Number(data.ch) : price - prevClose;
    const changePct = Number.isFinite(Number(data.chp))
      ? Number(data.chp)
      : prevClose > 0
        ? ((price - prevClose) / prevClose) * 100
        : 0;
    const quote: MetalQuote = {
      symbol,
      price,
      prevClose,
      change,
      changePct,
      updatedAt: data.updatedAt ? Date.parse(data.updatedAt) : Date.now(),
      status: 'live',
    };
    cacheSet(cacheKey, quote);
    return quote;
  } catch {
    const cached = cacheGet<MetalQuote>(cacheKey);
    if (cached) return { ...cached.value, status: 'cached' };
    return {
      symbol,
      price: 0,
      prevClose: 0,
      change: 0,
      changePct: 0,
      updatedAt: 0,
      status: 'offline',
    };
  }
}

export async function fetchAllMetals(): Promise<MetalQuote[]> {
  const symbols: MetalSymbol[] = ['XAU', 'XAG', 'XPT', 'XPD'];
  return Promise.all(symbols.map((s) => fetchMetal(s)));
}

/* ------------------------------------------------------------------ */
/* frankfurter.dev (USD→IDR)                                           */
/* ------------------------------------------------------------------ */

interface FrankfurterResponse {
  amount?: number;
  base?: string;
  date?: string;
  rates?: { IDR?: number };
}

export async function fetchUsdIdr(): Promise<FxRate> {
  const cacheKey = 'fx.usdidr';
  try {
    const data = await fetchJson<FrankfurterResponse>(
      'https://api.frankfurter.dev/v1/latest?base=USD&symbols=IDR',
    );
    const rate = Number(data.rates?.IDR);
    if (!Number.isFinite(rate) || rate <= 0) throw new Error('invalid FX rate');
    const fx: FxRate = {
      base: 'USD',
      symbol: 'IDR',
      rate,
      date: data.date ?? '',
      updatedAt: Date.now(),
      status: 'live',
    };
    cacheSet(cacheKey, fx);
    return fx;
  } catch {
    const cached = cacheGet<FxRate>(cacheKey);
    if (cached) return { ...cached.value, status: 'cached' };
    return {
      base: 'USD',
      symbol: 'IDR',
      rate: 0,
      date: '',
      updatedAt: 0,
      status: 'offline',
    };
  }
}

/* ------------------------------------------------------------------ */
/* NBP daily gold (PLN per gram), normalized to live XAU/USD           */
/* ------------------------------------------------------------------ */

interface NbpEntry {
  data: string; // YYYY-MM-DD
  cena: number; // PLN per gram
}

const DAY_MS = 24 * 60 * 60 * 1000;
const NBP_MAX_RANGE_DAYS = 93;

const fmtDate = (t: number) => new Date(t).toISOString().slice(0, 10);

/**
 * Fetch daily gold closes covering the last `days` calendar days.
 * NBP range endpoints accept at most ~93 days per call, so longer windows
 * are fetched as multiple sequential range calls and merged.
 * When `liveXauUsd` is provided, the whole series is rescaled so its last
 * point equals the live XAU/USD price (design.md §10 normalization).
 */
export async function fetchNbpDaily(days: number, liveXauUsd?: number): Promise<DailySeries> {
  const cacheKey = `nbp.daily.${days}`;
  try {
    const end = Date.now();
    const start = end - days * DAY_MS;
    const ranges: Array<[number, number]> = [];
    let cursor = start;
    while (cursor < end) {
      const chunkEnd = Math.min(cursor + (NBP_MAX_RANGE_DAYS - 1) * DAY_MS, end);
      ranges.push([cursor, chunkEnd]);
      cursor = chunkEnd + DAY_MS;
    }
    const chunks = await Promise.all(
      ranges.map(([s, e]) =>
        fetchJson<NbpEntry[]>(
          `https://api.nbp.pl/api/cenyzlota/${fmtDate(s)}/${fmtDate(e)}/?format=json`,
        ),
      ),
    );
    const byDate = new Map<string, number>();
    for (const chunk of chunks) {
      for (const entry of chunk) {
        if (Number.isFinite(entry.cena)) byDate.set(entry.data, entry.cena);
      }
    }
    if (byDate.size === 0) throw new Error('empty NBP series');
    const sorted = [...byDate.entries()].sort((a, b) => a[0].localeCompare(b[0]));
    const lastRaw = sorted[sorted.length - 1][1];
    // Normalize: NBP gives PLN/g — rescale so the last point equals live XAU/USD.
    const scale =
      liveXauUsd && Number.isFinite(liveXauUsd) && liveXauUsd > 0 && lastRaw > 0
        ? liveXauUsd / lastRaw
        : 1;
    const points: DailyPoint[] = sorted.map(([date, raw]) => ({
      t: Date.parse(`${date}T00:00:00Z`),
      raw,
      close: raw * scale,
    }));
    const series: DailySeries = { points, status: 'live' };
    cacheSet(cacheKey, series);
    return series;
  } catch {
    const cached = cacheGet<DailySeries>(cacheKey);
    if (cached) return { ...cached.value, status: 'cached' };
    return { points: [], status: 'offline' };
  }
}
