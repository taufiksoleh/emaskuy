/**
 * EmasKuy — data layer (design.md §10).
 *
 * Sources:
 *  - Live metal prices:  https://api.gold-api.com/price/{XAU|XAG|XPT|XPD}  (poll 30s)
 *  - Exchange rates:     https://api.frankfurter.dev/v1/latest?base=USD (ECB reference rates)
 *  - Daily history:      https://api.nbp.pl/api/cenyzlota/... (PLN/g fixings), converted
 *                        with same-day ECB rates from Frankfurter (see history.ts)
 *
 * Live fetches fall back to the last good response in localStorage and report
 * a status: 'live' | 'cached' | 'offline'. History fetchers throw; the
 * history store owns their caching.
 */
import { ECB_CURRENCIES, PEGGED, type Currency, type Rates } from './money';
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

export interface FxRates {
  /** Units of each currency per 1 USD: ECB reference rates plus the SAR/AED pegs */
  rates: Rates;
  /** The same for each business day of the last ~10 days (for yesterday's close) */
  recent: Record<string, Rates>;
  /** ECB reference date of `rates`, YYYY-MM-DD */
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
const FX_CACHE = 'fx.usd';

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

export function cachedFx(): FxRates | null {
  const fx = cacheGet<FxRates>(FX_CACHE)?.value;
  if (fx?.rates?.IDR) return { ...fx, recent: fx.recent ?? {}, status: 'cached' };
  // Before multi-currency only USD→IDR was cached.
  const legacy = cacheGet<{ rate?: number; date?: string; updatedAt?: number }>('fx.usdidr')?.value;
  if (legacy?.rate && legacy.rate > 0) {
    const rates = { ...PEGGED, IDR: legacy.rate };
    const date = legacy.date ?? '';
    return { rates, recent: date ? { [date]: rates } : {}, date, updatedAt: legacy.updatedAt ?? 0, status: 'cached' };
  }
  return null;
}

export async function fetchAllMetals(): Promise<MetalQuote[]> {
  const symbols: MetalSymbol[] = ['XAU', 'XAG', 'XPT', 'XPD'];
  return Promise.all(symbols.map((s) => fetchMetal(s)));
}

/* ------------------------------------------------------------------ */
/* frankfurter.dev: every supported currency per USD, one request      */
/* ------------------------------------------------------------------ */

/**
 * The last ~10 days of rates in one request: the newest day is today's
 * rate, earlier days give the rate at yesterday's close in any currency.
 */
export async function fetchFx(): Promise<FxRates> {
  try {
    const start = new Date(Date.now() - 10 * 86_400_000).toISOString().slice(0, 10);
    const data = await fetchJson<{ rates?: Record<string, Record<string, number>> }>(
      `https://api.frankfurter.dev/v1/${start}..?base=USD&symbols=${ECB_CURRENCIES.join(',')}`,
    );
    const recent: Record<string, Rates> = {};
    for (const [date, day] of Object.entries(data.rates ?? {})) {
      const rates: Rates = { ...PEGGED };
      for (const c of ECB_CURRENCIES) {
        const r = Number(day[c]);
        if (Number.isFinite(r) && r > 0) rates[c] = r;
      }
      recent[date] = rates;
    }
    const date = Object.keys(recent).sort().pop();
    if (!date || !recent[date].IDR) throw new Error('invalid FX rates');
    const fx: FxRates = { rates: recent[date], recent, date, updatedAt: Date.now(), status: 'live' };
    cacheSet(FX_CACHE, fx);
    return fx;
  } catch {
    return cachedFx() ?? { rates: { ...PEGGED }, recent: {}, date: '', updatedAt: 0, status: 'offline' };
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

/** Daily ECB rates of `currency` per 1 USD from `start` to today, keyed by date. */
export async function fetchUsdFxSeries(currency: Currency, start: string): Promise<Record<string, number>> {
  const data = await fetchJson<{ rates?: Record<string, Record<string, number>> }>(
    `https://api.frankfurter.dev/v1/${start}..?base=USD&symbols=${currency}`,
  );
  const out: Record<string, number> = {};
  for (const [date, r] of Object.entries(data.rates ?? {})) {
    const v = Number(r[currency]);
    if (Number.isFinite(v) && v > 0) out[date] = v;
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
