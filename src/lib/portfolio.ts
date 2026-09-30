/**
 * EmasKuy — Portfolio holdings persisted in localStorage only.
 * Data never leaves the browser (key: `emaskuy.portfolio`).
 */
import { readJson, writeJson } from './storage';

export interface Holding {
  id: string;
  grams: number;
  /** Buy price per gram in IDR */
  buyPriceIdrPerGram: number;
  /** ISO date string (yyyy-mm-dd) */
  date: string;
  note?: string;
}

const STORAGE_KEY = 'emaskuy.portfolio';

export function loadHoldings(): Holding[] {
  const parsed = readJson<Holding[]>(STORAGE_KEY);
  if (!Array.isArray(parsed)) return [];
  return parsed.filter(
    (h) =>
      h &&
      typeof h.id === 'string' &&
      Number.isFinite(h.grams) &&
      Number.isFinite(h.buyPriceIdrPerGram),
  );
}

/** Returns false when the browser refused the write (storage full or blocked). */
export function saveHoldings(list: Holding[]): boolean {
  return writeJson(STORAGE_KEY, list);
}

export interface PortfolioSummary {
  totalGrams: number;
  totalInvested: number;
}

export function summarize(holdings: Holding[]): PortfolioSummary {
  return holdings.reduce<PortfolioSummary>(
    (acc, h) => ({
      totalGrams: acc.totalGrams + h.grams,
      totalInvested: acc.totalInvested + h.grams * h.buyPriceIdrPerGram,
    }),
    { totalGrams: 0, totalInvested: 0 },
  );
}
