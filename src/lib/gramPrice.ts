/**
 * EmasKuy — the pure-gold price per gram the calculators work with.
 *
 * Kept separate from the calculators so later sources (Antam, buyback,
 * other currencies) only change this resolver.
 */
import { convertMoney, pricePer, type Currency, type Rates } from './money';

/** Where the price per gram comes from. */
export type PriceBasis = 'spot' | 'antam' | 'buyback' | 'manual';

export interface GramPriceInputs {
  /** Live spot, USD per troy ounce */
  xauUsd: number;
  /** Units of each currency per USD */
  rates: Rates;
  currency: Currency;
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
    return convertMoney(idr, 'IDR', inp.currency, inp.rates);
  }
  const spot = pricePer(inp.xauUsd, inp.currency, 'g', inp.rates);
  return spot > 0 ? spot : null;
}
