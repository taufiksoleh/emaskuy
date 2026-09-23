/**
 * EmasKuy — Portfolio holdings persisted in localStorage only.
 * Data never leaves the browser (key: `emaskuy.portfolio`).
 */

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
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Holding[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (h) =>
        h &&
        typeof h.id === 'string' &&
        Number.isFinite(h.grams) &&
        Number.isFinite(h.buyPriceIdrPerGram),
    );
  } catch {
    return [];
  }
}

export function saveHoldings(list: Holding[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* non-fatal */
  }
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
