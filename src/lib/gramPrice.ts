/**
 * EmasKuy — the pure-gold price per gram the calculators work with.
 *
 * Kept separate from the calculators so later sources (Antam, buyback,
 * other currencies) only change this resolver.
 */
import type { CalcCurrency } from './calc';
import { TROY_OZ_GRAMS, xauUsdToIdrGram } from './gold';

/** Where the price per gram comes from. */
export type PriceBasis = 'spot' | 'antam' | 'buyback' | 'manual';

export interface GramPriceInputs {
  /** Live spot, USD per troy ounce */
  xauUsd: number;
  usdIdr: number;
  currency: CalcCurrency;
  /** User-typed price per gram (manual basis) */
  manual: number;
  /** Antam prices in rupiah per gram */
  antam?: { sellPerGram: number; buybackPerGram: number };
}

/** Price per gram in `currency`, or null when it can't be known. */
export function resolveGramPrice(basis: PriceBasis, inp: GramPriceInputs): number | null {
  if (basis === 'manual') return Number.isFinite(inp.manual) && inp.manual > 0 ? inp.manual : null;
  if (basis === 'antam' || basis === 'buyback') {
    const idr = basis === 'antam' ? inp.antam?.sellPerGram : inp.antam?.buybackPerGram;
    if (!idr || idr <= 0) return null;
    if (inp.currency === 'idr') return idr;
    return inp.usdIdr > 0 ? idr / inp.usdIdr : null;
  }
  if (!(inp.xauUsd > 0)) return null;
  if (inp.currency === 'usd') return inp.xauUsd / TROY_OZ_GRAMS;
  return inp.usdIdr > 0 ? xauUsdToIdrGram(inp.xauUsd, inp.usdIdr) : null;
}
