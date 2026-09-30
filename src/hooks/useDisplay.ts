/**
 * useDisplay — the currency and weight unit prices are shown in, with the
 * live exchange rates and helpers to convert and format:
 *
 * ```ts
 * const d = useDisplay();
 * d.format(d.price(gold.price)); // "Rp2.405.371" or "RM553.20" or "$4,147.60"
 * ```
 */
import { useMemo, useSyncExternalStore } from 'react';
import { getDisplayPrefs, saveDisplayPrefs, subscribeDisplay } from '@/lib/display';
import type { FormatOpts } from '@/lib/gold';
import { useI18n } from '@/lib/i18n';
import {
  WEIGHT,
  defaultCurrency,
  defaultWeight,
  deviceTimeZone,
  formatMoney,
  formatMoneyCompact,
  pricePer,
  unitLabel,
  type Currency,
  type Rates,
  type WeightUnit,
} from '@/lib/money';
import { useGoldPrice } from './useGoldPrice';

export interface Display {
  currency: Currency;
  weight: WeightUnit;
  /** False while the currency still follows the time zone and language */
  chosen: boolean;
  /** Picks a currency with its usual weight unit (troy ounce for USD, else gram). */
  setCurrency: (currency: Currency) => void;
  setWeight: (weight: WeightUnit) => void;
  rates: Rates;
  /** A USD-per-ounce price in the display currency per display weight; 0 when unknown */
  price: (usdPerOz: number) => number;
  /** Money in the display currency: "Rp2.405.371", "$4,147.60" */
  format: (value: number, opts?: FormatOpts) => string;
  /** Short money for chart axes: "Rp2,4 jt", "$4.1k" */
  formatCompact: (value: number) => string;
  /** "IDR/gr", "USD/oz" */
  label: string;
  /** "≈" for regional units whose weight varies, else "" */
  approx: string;
}

let zone: string | null = null;
const timeZone = () => (zone ??= deviceTimeZone());

export function useDisplay(): Display {
  const { lang } = useI18n();
  const saved = useSyncExternalStore(subscribeDisplay, getDisplayPrefs, () => null);
  const { rates } = useGoldPrice();
  const currency = saved?.currency ?? defaultCurrency(timeZone(), lang);
  const weight = saved?.weight ?? defaultWeight(currency);

  return useMemo<Display>(
    () => ({
      currency,
      weight,
      chosen: saved !== null,
      setCurrency: (c) => saveDisplayPrefs({ currency: c, weight: defaultWeight(c) }),
      setWeight: (w) => saveDisplayPrefs({ currency, weight: w }),
      rates,
      price: (usdPerOz) => pricePer(usdPerOz, currency, weight, rates),
      format: (value, opts) => formatMoney(value, currency, lang, opts),
      formatCompact: (value) => formatMoneyCompact(value, currency, lang),
      label: unitLabel(currency, weight),
      approx: WEIGHT[weight].approx ? '≈' : '',
    }),
    [currency, weight, saved, rates, lang],
  );
}
