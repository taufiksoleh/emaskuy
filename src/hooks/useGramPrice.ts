/**
 * useGramPrice — the price per gram of gold for the calculators (live spot,
 * Antam's selling or buyback price, or typed) in the currency of the navbar
 * display unit.
 */
import type { DataStatus } from '@/lib/api';
import type { CalcCurrency } from '@/lib/calc';
import { antamOneGram, staleness, useAntam } from '@/lib/antam';
import { resolveGramPrice, type PriceBasis } from '@/lib/gramPrice';
import { useI18n } from '@/lib/i18n';
import { useGoldPrice } from './useGoldPrice';

/** Rupiah when prices are shown per gram in IDR, else dollars. */
export function useCalcCurrency(): CalcCurrency {
  const { unit } = useI18n();
  return unit === 'idr-gr' ? 'idr' : 'usd';
}

export function useGramPrice(
  basis: PriceBasis,
  currency: CalcCurrency,
  manual: number,
): { perGram: number | null; status: DataStatus } {
  const { gold, usdIdr, status, lastUpdated } = useGoldPrice();
  const antam = useAntam();
  const perGram = resolveGramPrice(basis, {
    xauUsd: gold?.price ?? 0,
    usdIdr,
    currency,
    manual,
    antam: { sellPerGram: antamOneGram(antam), buybackPerGram: antam.antam.buybackPerGram },
  });
  if (basis === 'spot') return { perGram, status };
  // Antam prices are daily: current while fresh, "cached" once they age.
  const fresh = staleness(antam, lastUpdated || undefined).level === 'fresh';
  return { perGram, status: fresh ? 'live' : 'cached' };
}
