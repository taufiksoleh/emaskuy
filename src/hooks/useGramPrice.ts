/**
 * useGramPrice — the price per gram of pure gold for the calculators, live
 * or typed, in the currency of the navbar display unit.
 */
import type { DataStatus } from '@/lib/api';
import type { CalcCurrency } from '@/lib/calc';
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
  const { gold, usdIdr, status } = useGoldPrice();
  const perGram = resolveGramPrice(basis, { xauUsd: gold?.price ?? 0, usdIdr, currency, manual });
  return { perGram, status: basis === 'manual' ? 'live' : status };
}
