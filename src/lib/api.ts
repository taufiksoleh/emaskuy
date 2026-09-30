/**
 * EmasKuy — data layer (design.md §10).
 *
 * Sources:
 *  - Live metal prices:  https://api.gold-api.com/price/{XAU|XAG|XPT|XPD}  (poll 30s)
 *  - USD→IDR rate:       https://api.frankfurter.dev/v1/latest?base=USD&symbols=IDR
 *  - Daily history:      https://api.nbp.pl/api/cenyzlota/... (PLN/g fixings), converted
 *                        with same-day ECB rates from Frankfurter (see history.ts)
 *
 * Live fetches fall back to the last good response in localStorage and report
 * a status: 'live' | 'cached' | 'offline'. History fetchers throw; the
 * history store owns their caching.
 */
import { readJson, writeJson } from './storage';

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
  /** True when the API itself reported the change (the free tier doesn't). */
  apiChange: boolean;
  updatedAt: number;
  status: DataStatus;
}

export interface FxRate {
  base: 'USD';
  symbol: 'IDR';
  rate: number;
  /** ECB reference date, YYYY-MM-DD */
  date: string;
  updatedAt: number;
  status: DataStatus;
}

/** One NBP gold fixing: PLN per gram of fine gold. */
export interface NbpEntry {
  data: string;
  cena: number;
}

/** Frankfurter timeseries rates keyed by date: 1 PLN in USD and IDR. */
export type FxSeries = Record<string, { USD?: number; IDR?: number }>;

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
  writeJson(CACHE_PREFIX + key, { at: Date.now(), value });
}

function cacheGet<T>(key: string): { at: number; value: T } | null {
  return readJson<{ at: number; value: T }>(CACHE_PREFIX + key);
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
    const hasPrev = Number.isFinite(Number(data.prev_close_price)) && Number(data.prev_close_price) > 0;
    const hasChp = Number.isFinite(Number(data.chp));
    const prevClose = hasPrev ? Number(data.prev_close_price) : price;
    const change = Number.isFinite(Number(data.ch)) ? Number(data.ch) : price - prevClose;
    const changePct = hasChp
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
      apiChange: hasPrev || hasChp,
      updatedAt: data.updatedAt ? Date.parse(data.updatedAt) : Date.now(),
      status: 'live',
    };
    cacheSet(cacheKey, quote);
    return quote;
  } catch {
    const cached = cacheGet<MetalQuote>(cacheKey);
    // Entries cached before `apiChange` existed lack the field.
    if (cached) return { ...cached.value, apiChange: cached.value.apiChange ?? false, status: 'cached' };
    return {
      symbol,
      price: 0,
      prevClose: 0,
      change: 0,
      changePct: 0,
      apiChange: false,
      updatedAt: 0,
      status: 'offline',
    };
  }
}

/** Last good quotes from localStorage, for an instant first paint. */
export function cachedMetals(): MetalQuote[] {
  const symbols: MetalSymbol[] = ['XAU', 'XAG', 'XPT', 'XPD'];
  return symbols.flatMap((s) => {
    const q = cacheGet<MetalQuote>(`metal.${s}`)?.value;
    return q && q.price > 0 ? [{ ...q, apiChange: q.apiChange ?? false, status: 'cached' as const }] : [];
  });
}

export function cachedUsdIdr(): FxRate | null {
  const fx = cacheGet<FxRate>('fx.usdidr')?.value;
  return fx && fx.rate > 0 ? { ...fx, status: 'cached' } : null;
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
/* History: NBP gold fixings + Frankfurter PLN timeseries              */
/* ------------------------------------------------------------------ */

const DAY_MS = 24 * 60 * 60 * 1000;
/** NBP rejects ranges longer than ~93 days and `last/N` above 255. */
const NBP_MAX_RANGE_DAYS = 93;
const NBP_MAX_LAST = 255;

const isoDay = (t: number) => new Date(t).toISOString().slice(0, 10);

/** The latest `n` NBP fixings (n ≤ 255 ≈ one year) in one request. */
export async function fetchNbpLast(n: number): Promise<NbpEntry[]> {
  const count = Math.min(NBP_MAX_LAST, Math.max(1, Math.floor(n)));
  return fetchJson<NbpEntry[]>(`https://api.nbp.pl/api/cenyzlota/last/${count}/?format=json`);
}

/**
 * NBP fixings for [start, end] (YYYY-MM-DD), chunked at the API's 93-day
 * limit and fetched 6 at a time. Only used for the one-off ALL archive.
 */
export async function fetchNbpRange(start: string, end: string): Promise<NbpEntry[]> {
  const endMs = Date.parse(`${end}T00:00:00Z`);
  const ranges: Array<[number, number]> = [];
  let cursor = Date.parse(`${start}T00:00:00Z`);
  while (cursor <= endMs) {
    const chunkEnd = Math.min(cursor + (NBP_MAX_RANGE_DAYS - 1) * DAY_MS, endMs);
    ranges.push([cursor, chunkEnd]);
    cursor = chunkEnd + DAY_MS;
  }
  const out: NbpEntry[] = [];
  const CONCURRENCY = 6;
  for (let i = 0; i < ranges.length; i += CONCURRENCY) {
    const batch = await Promise.all(
      ranges
        .slice(i, i + CONCURRENCY)
        .map(([s, e]) =>
          fetchJson<NbpEntry[]>(
            `https://api.nbp.pl/api/cenyzlota/${isoDay(s)}/${isoDay(e)}/?format=json`,
          ).catch((err: unknown) => {
            // NBP answers 404 for a range with no fixings (e.g. a short
            // weekend-only tail chunk).
            if (err instanceof Error && err.message.startsWith('HTTP 404')) return [];
            throw err;
          }),
        ),
    );
    for (const chunk of batch) out.push(...chunk);
  }
  return out;
}

/** Daily ECB rates for 1 PLN in USD and IDR from `start` (to `end`, or today). */
export async function fetchFxSeries(start: string, end?: string): Promise<FxSeries> {
  const data = await fetchJson<{ rates?: FxSeries }>(
    `https://api.frankfurter.dev/v1/${start}..${end ?? ''}?base=PLN&symbols=USD,IDR`,
  );
  return data.rates ?? {};
}
