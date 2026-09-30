/**
 * useGramPrice — the price per gram of gold for the calculators (live spot,
 * Antam's selling or buyback price, or typed) in the currency of the navbar
 * display unit.
 */
import type { DataStatus } from '@/lib/api';
import { antamOneGram, staleness, useAntam } from '@/lib/antam';
import { resolveGramPrice, type PriceBasis } from '@/lib/gramPrice';
import type { Currency } from '@/lib/money';
import { useDisplay } from './useDisplay';
import { useGoldPrice } from './useGoldPrice';

/** Calculators work per gram in the display currency. */
export function useCalcCurrency(): Currency {
  return useDisplay().currency;
}

export function useGramPrice(
  basis: PriceBasis,
  currency: Currency,
  manual: number,
): { perGram: number | null; status: DataStatus } {
  const { gold, rates, status, lastUpdated } = useGoldPrice();
  const antam = useAntam();
  const perGram = resolveGramPrice(basis, {
    xauUsd: gold?.price ?? 0,
    rates,
    currency,
    manual,
    antam: { sellPerGram: antamOneGram(antam), buybackPerGram: antam.antam.buybackPerGram },
  });
  if (basis === 'spot') return { perGram, status };
  // Antam prices are daily: current while fresh, "cached" once they age.
  const fresh = staleness(antam, lastUpdated || undefined).level === 'fresh';
  return { perGram, status: fresh ? 'live' : 'cached' };
}
