/**
 * EmasKuy — currencies, weight units and money formatting.
 *
 * Gold is quoted in USD per troy ounce. A display price converts that to one
 * currency per one weight unit: `pricePer(usdPerOz, 'MYR', 'g', rates)`.
 * `rates` hold units of each currency per 1 USD: ECB reference rates from
 * Frankfurter, plus the fixed pegs of the Saudi riyal and the UAE dirham.
 */
import { TROY_OZ_GRAMS, formatNumber, type FormatOpts } from './gold';
import type { Lang } from './strings';

export const CURRENCIES = [
  'IDR',
  'USD',
  'MYR',
  'SGD',
  'HKD',
  'JPY',
  'KRW',
  'CNY',
  'THB',
  'PHP',
  'INR',
  'SAR',
  'AED',
  'EUR',
  'GBP',
  'AUD',
] as const;
export type Currency = (typeof CURRENCIES)[number];

interface CurrencyMeta {
  symbol: string;
  decimals: number;
  /** Letter symbols get a space before the amount: "SAR 1,234.50". */
  spaced?: boolean;
  name: { id: string; en: string };
}

export const CURRENCY: Record<Currency, CurrencyMeta> = {
  IDR: { symbol: 'Rp', decimals: 0, name: { id: 'Rupiah Indonesia', en: 'Indonesian rupiah' } },
  USD: { symbol: '$', decimals: 2, name: { id: 'Dolar AS', en: 'US dollar' } },
  MYR: { symbol: 'RM', decimals: 2, name: { id: 'Ringgit Malaysia', en: 'Malaysian ringgit' } },
  SGD: { symbol: 'S$', decimals: 2, name: { id: 'Dolar Singapura', en: 'Singapore dollar' } },
  HKD: { symbol: 'HK$', decimals: 2, name: { id: 'Dolar Hong Kong', en: 'Hong Kong dollar' } },
  JPY: { symbol: '¥', decimals: 0, name: { id: 'Yen Jepang', en: 'Japanese yen' } },
  KRW: { symbol: '₩', decimals: 0, name: { id: 'Won Korea', en: 'South Korean won' } },
  CNY: { symbol: 'CN¥', decimals: 2, name: { id: 'Yuan Tiongkok', en: 'Chinese yuan' } },
  THB: { symbol: '฿', decimals: 2, name: { id: 'Baht Thailand', en: 'Thai baht' } },
  PHP: { symbol: '₱', decimals: 2, name: { id: 'Peso Filipina', en: 'Philippine peso' } },
  INR: { symbol: '₹', decimals: 2, name: { id: 'Rupee India', en: 'Indian rupee' } },
  SAR: { symbol: 'SAR', decimals: 2, spaced: true, name: { id: 'Riyal Saudi', en: 'Saudi riyal' } },
  AED: { symbol: 'AED', decimals: 2, spaced: true, name: { id: 'Dirham UEA', en: 'UAE dirham' } },
  EUR: { symbol: '€', decimals: 2, name: { id: 'Euro', en: 'Euro' } },
  GBP: { symbol: '£', decimals: 2, name: { id: 'Pound sterling', en: 'Pound sterling' } },
  AUD: { symbol: 'A$', decimals: 2, name: { id: 'Dolar Australia', en: 'Australian dollar' } },
};

/** Currencies fixed to the dollar; the ECB doesn't publish them. */
export const PEGGED: Partial<Record<Currency, number>> = { SAR: 3.75, AED: 3.6725 };

/** Currencies the ECB publishes against the dollar (one Frankfurter request). */
export const ECB_CURRENCIES = CURRENCIES.filter((c) => c !== 'USD' && PEGGED[c] === undefined);

export const isCurrency = (v: unknown): v is Currency => typeof v === 'string' && (CURRENCIES as readonly string[]).includes(v);

export const WEIGHT_UNITS = ['g', 'ozt', 'kg', 'tola', 'tael', 'mayam'] as const;
export type WeightUnit = (typeof WEIGHT_UNITS)[number];

interface WeightMeta {
  grams: number;
  short: string;
  name: { id: string; en: string };
  /** Where a regional unit is used */
  region?: { id: string; en: string };
  /** Regional units whose exact weight varies; values show "≈". */
  approx?: boolean;
}

export const WEIGHT: Record<WeightUnit, WeightMeta> = {
  g: { grams: 1, short: 'gr', name: { id: 'gram', en: 'gram' } },
  ozt: { grams: TROY_OZ_GRAMS, short: 'oz', name: { id: 'troy ounce', en: 'troy ounce' } },
  kg: { grams: 1000, short: 'kg', name: { id: 'kilogram', en: 'kilogram' } },
  tola: {
    grams: 11.6638038,
    short: 'tola',
    name: { id: 'tola', en: 'tola' },
    region: { id: 'India, Timur Tengah', en: 'India, Middle East' },
  },
  tael: { grams: 37.429, short: 'tael', name: { id: 'tael', en: 'tael' }, region: { id: 'Hong Kong', en: 'Hong Kong' } },
  mayam: { grams: 3.33, short: 'mayam', approx: true, name: { id: 'mayam', en: 'mayam' }, region: { id: 'Aceh', en: 'Aceh' } },
};

export const isWeightUnit = (v: unknown): v is WeightUnit =>
  typeof v === 'string' && (WEIGHT_UNITS as readonly string[]).includes(v);

/** Units of each currency per 1 USD. */
export type Rates = Partial<Record<Currency, number>>;

/** Units of `currency` per dollar, or 0 when unknown. */
export function rateOf(currency: Currency, rates: Rates): number {
  if (currency === 'USD') return 1;
  const r = rates[currency] ?? PEGGED[currency] ?? 0;
  return Number.isFinite(r) && r > 0 ? r : 0;
}

/** The rate of `currency` on `date`, or on the closest earlier day within a week; 0 if none. */
export function rateOnOrBefore(byDate: Record<string, Rates>, date: string, currency: Currency): number {
  if (currency === 'USD') return 1;
  const peg = PEGGED[currency];
  if (peg) return peg;
  const day = Object.keys(byDate)
    .filter((d) => d <= date)
    .sort()
    .pop();
  if (!day || Date.parse(date) - Date.parse(day) > 7 * 86_400_000) return 0;
  return rateOf(currency, byDate[day]);
}

/** Rate on `date`, or on the closest earlier day within a week; 0 when unknown. */
export type RateOn = (date: string) => number;

/** A fast RateOn over one currency's daily rates keyed by YYYY-MM-DD. */
export function dailyRateLookup(byDate: Record<string, number>): RateOn {
  const dates = Object.keys(byDate).sort();
  return (date) => {
    let lo = 0;
    let hi = dates.length - 1;
    let found = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (dates[mid] <= date) {
        found = mid;
        lo = mid + 1;
      } else hi = mid - 1;
    }
    if (found < 0) return 0;
    const day = dates[found];
    return Date.parse(date) - Date.parse(day) > 7 * 86_400_000 ? 0 : byDate[day];
  };
}

/** Gold price in `currency` per `weight`, or 0 when the price or rate is unknown. */
export function pricePer(usdPerOz: number, currency: Currency, weight: WeightUnit, rates: Rates): number {
  const rate = rateOf(currency, rates);
  return usdPerOz > 0 && rate > 0 ? (usdPerOz / TROY_OZ_GRAMS) * WEIGHT[weight].grams * rate : 0;
}

/** An amount converted between currencies at today's rates, or null. */
export function convertMoney(amount: number, from: Currency, to: Currency, rates: Rates): number | null {
  if (from === to) return amount;
  const a = rateOf(from, rates);
  const b = rateOf(to, rates);
  return a > 0 && b > 0 ? (amount / a) * b : null;
}

/** `Rp2.580.000`, `$4,147.60`, `RM1.234,50` (separators follow the UI language), `-€5.00`. */
export function formatMoney(value: number, currency: Currency, lang: Lang, opts: FormatOpts = {}): string {
  const meta = CURRENCY[currency];
  const decimals = opts.decimals ?? meta.decimals;
  const number = formatNumber(Math.abs(value), lang, { decimals, minDecimals: opts.minDecimals ?? decimals });
  const text = `${meta.symbol}${meta.spaced ? '\u00a0' : ''}${number}`;
  return value < 0 && /[1-9]/.test(text) ? `-${text}` : text;
}

/** Short amounts for chart axes: `Rp187 jt` (ID) / `Rp187 M` (EN), `$1.2k`, `₩3.4M`. */
export function formatMoneyCompact(value: number, currency: Currency, lang: Lang): string {
  const abs = Math.abs(value);
  const fix = (n: number) => {
    const s = n >= 100 ? Math.round(n).toString() : n.toFixed(1);
    return lang === 'id' ? s.replace('.', ',') : s;
  };
  const { symbol, spaced } = CURRENCY[currency];
  const sym = spaced ? `${symbol} ` : symbol;
  let text: string;
  if (currency === 'IDR') {
    // Rupiah reads as words in Indonesian: rb (ribu), jt (juta), M (miliar).
    const [b, m, k] = lang === 'id' ? ['M', 'jt', 'rb'] : ['B', 'M', 'k'];
    if (abs >= 1e9) text = `${sym}${fix(abs / 1e9)} ${b}`;
    else if (abs >= 1e6) text = `${sym}${fix(abs / 1e6)} ${m}`;
    else if (abs >= 1e3) text = `${sym}${fix(abs / 1e3)} ${k}`;
    else text = `${sym}${Math.round(abs)}`;
  } else if (abs >= 1e9) text = `${sym}${fix(abs / 1e9)}B`;
  else if (abs >= 1e6) text = `${sym}${fix(abs / 1e6)}M`;
  else if (abs >= 1e3) text = `${sym}${fix(abs / 1e3)}k`;
  else text = `${sym}${Math.round(abs)}`;
  return value < 0 && /[1-9]/.test(text) ? `-${text}` : text;
}

/** The nearest 1, 2 or 5 × 10ⁿ on a log scale: 408 → 500, 2,040 → 2,000, 75,000 → 100,000. */
export function niceRound(v: number): number {
  if (!(v > 0)) return 0;
  const exp = Math.floor(Math.log10(v));
  const candidates = [1, 2, 5, 10].map((m) => m * 10 ** exp);
  return candidates.reduce((best, c) => (Math.abs(Math.log(v / c)) < Math.abs(Math.log(v / best)) ? c : best));
}

/** `IDR/gr`, `USD/oz`, `HKD/tael` */
export function unitLabel(currency: Currency, weight: WeightUnit): string {
  return `${currency}/${WEIGHT[weight].short}`;
}

/* ------------------------------------------------------------------ */
/* First-visit defaults                                                */
/* ------------------------------------------------------------------ */

const ZONE_CURRENCY: Record<string, Currency> = {
  'Asia/Jakarta': 'IDR',
  'Asia/Pontianak': 'IDR',
  'Asia/Makassar': 'IDR',
  'Asia/Jayapura': 'IDR',
  'Asia/Kuala_Lumpur': 'MYR',
  'Asia/Kuching': 'MYR',
  'Asia/Singapore': 'SGD',
  'Asia/Hong_Kong': 'HKD',
  'Asia/Macau': 'HKD',
  'Asia/Tokyo': 'JPY',
  'Asia/Seoul': 'KRW',
  'Asia/Shanghai': 'CNY',
  'Asia/Bangkok': 'THB',
  'Asia/Manila': 'PHP',
  'Asia/Kolkata': 'INR',
  'Asia/Calcutta': 'INR',
  'Asia/Riyadh': 'SAR',
  'Asia/Dubai': 'AED',
  'Europe/London': 'GBP',
};

const EURO_ZONES = new Set(
  [
    'Amsterdam', 'Athens', 'Berlin', 'Bratislava', 'Brussels', 'Dublin', 'Helsinki', 'Lisbon', 'Ljubljana',
    'Luxembourg', 'Madrid', 'Malta', 'Monaco', 'Nicosia', 'Paris', 'Riga', 'Rome', 'Tallinn', 'Vienna',
    'Vilnius', 'Zagreb',
  ].map((city) => `Europe/${city}`),
);

/** The visitor's currency from their time zone, else by site language. */
export function defaultCurrency(timeZone: string, lang: Lang): Currency {
  const byZone = ZONE_CURRENCY[timeZone];
  if (byZone) return byZone;
  if (EURO_ZONES.has(timeZone)) return 'EUR';
  if (timeZone.startsWith('Australia/')) return 'AUD';
  return lang === 'id' ? 'IDR' : 'USD';
}

/** Dollar prices are quoted per troy ounce; local currencies per gram. */
export function defaultWeight(currency: Currency): WeightUnit {
  return currency === 'USD' ? 'ozt' : 'g';
}

export function deviceTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
  } catch {
    return '';
  }
}
