/**
 * EmasKuy — portfolio holdings, stored in this browser only.
 *
 * v2 (`emaskuy.portfolio.v2`) adds the product type, purity (for jewelry)
 * and an update time used when merging backups. The v1 list under
 * `emaskuy.portfolio` is migrated on first load and left in place, so
 * rolling back never loses data.
 */
import { getStorage, readJson, writeJson, type KV } from './storage';

export type ProductType = 'antam' | 'ubs' | 'galeri24' | 'lotus' | 'digital' | 'perhiasan' | 'lainnya';

export const PRODUCT_TYPES: ProductType[] = ['antam', 'ubs', 'galeri24', 'lotus', 'digital', 'perhiasan', 'lainnya'];

export interface Holding {
  id: string;
  type: ProductType;
  /** Weight of the item (jewelry: gross weight) */
  grams: number;
  /** Purity in percent; 100 for bars and digital gold */
  kadarPct: number;
  /** Price paid per gram of the item */
  buyPricePerGram: number;
  currency: 'IDR';
  /** Purchase date, YYYY-MM-DD */
  date: string;
  note?: string;
  /** Unix ms of the last edit; the newer copy wins when merging backups */
  updatedAt: number;
}

export const PORTFOLIO_KEY = 'emaskuy.portfolio.v2';
export const LEGACY_PORTFOLIO_KEY = 'emaskuy.portfolio';
export const MAX_HOLDINGS = 1000;

interface StoredV2 {
  v: 2;
  holdings: Holding[];
}

const isDate = (s: unknown): s is string => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s);
const positive = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n) && n > 0;

/**
 * Validate one holding from storage or a backup. Accepts the v1 shape
 * ({ grams, buyPriceIdrPerGram, date }) as an untyped item. Returns null
 * when it can't be used.
 */
export function normalizeHolding(raw: unknown): Holding | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const price = r.buyPricePerGram ?? r.buyPriceIdrPerGram;
  if (typeof r.id !== 'string' || !r.id || !positive(r.grams) || !positive(price)) return null;
  const type = PRODUCT_TYPES.includes(r.type as ProductType) ? (r.type as ProductType) : 'lainnya';
  const kadar = type === 'perhiasan' && positive(r.kadarPct) && r.kadarPct <= 100 ? r.kadarPct : 100;
  return {
    id: r.id.slice(0, 100),
    type,
    grams: r.grams,
    kadarPct: kadar,
    buyPricePerGram: price,
    currency: 'IDR',
    date: isDate(r.date) ? r.date : new Date().toISOString().slice(0, 10),
    note: typeof r.note === 'string' && r.note.trim() ? r.note.trim().slice(0, 200) : undefined,
    updatedAt: typeof r.updatedAt === 'number' && Number.isFinite(r.updatedAt) ? r.updatedAt : 0,
  };
}

export function normalizeList(list: unknown): Holding[] {
  if (!Array.isArray(list)) return [];
  return list
    .slice(0, MAX_HOLDINGS)
    .map(normalizeHolding)
    .filter((h): h is Holding => h !== null);
}

export function loadHoldings(store: KV | null = getStorage()): Holding[] {
  const stored = readJson<StoredV2>(PORTFOLIO_KEY, store);
  if (stored && stored.v === 2) return normalizeList(stored.holdings);
  const legacy = normalizeList(readJson<unknown>(LEGACY_PORTFOLIO_KEY, store));
  if (legacy.length > 0) saveHoldings(legacy, store);
  return legacy;
}

/** Returns false when the browser refused the write (storage full or blocked). */
export function saveHoldings(list: Holding[], store: KV | null = getStorage()): boolean {
  const payload: StoredV2 = { v: 2, holdings: list.slice(0, MAX_HOLDINGS) };
  return writeJson(PORTFOLIO_KEY, payload, store);
}

export function newHoldingId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/** Grams of pure gold in a holding. */
export const pureGrams = (h: Holding) => (h.grams * h.kadarPct) / 100;

export interface PortfolioSummary {
  /** Pure gold across all holdings */
  totalGrams: number;
  /** Pure gold in bars, coins and digital gold */
  investGrams: number;
  /** Pure gold in jewelry */
  jewelryGrams: number;
  totalInvested: number;
}

export function summarize(holdings: Holding[]): PortfolioSummary {
  return holdings.reduce<PortfolioSummary>(
    (acc, h) => {
      const pure = pureGrams(h);
      return {
        totalGrams: acc.totalGrams + pure,
        investGrams: acc.investGrams + (h.type === 'perhiasan' ? 0 : pure),
        jewelryGrams: acc.jewelryGrams + (h.type === 'perhiasan' ? pure : 0),
        totalInvested: acc.totalInvested + h.grams * h.buyPricePerGram,
      };
    },
    { totalGrams: 0, investGrams: 0, jewelryGrams: 0, totalInvested: 0 },
  );
}
