/**
 * EmasKuy — conversions & locale-aware formatters (design.md §8, §10).
 */
import type { Lang } from './i18n';

export const TROY_OZ_GRAMS = 31.1034768;

export type Unit = 'usd-oz' | 'idr-gr';

export function ozToGrams(oz: number): number {
  return oz * TROY_OZ_GRAMS;
}

export function gramsToOz(g: number): number {
  return g / TROY_OZ_GRAMS;
}

/** Convert a USD-per-ounce price into the display unit value. */
export function convertPrice(usdPerOz: number, usdIdr: number | null, unit: Unit): number {
  if (unit === 'idr-gr') {
    return (usdPerOz / TROY_OZ_GRAMS) * (usdIdr ?? 0);
  }
  return usdPerOz;
}

/** XAU USD/oz -> IDR per gram */
export function xauUsdToIdrGram(xauUsd: number, usdIdr: number): number {
  return (xauUsd / TROY_OZ_GRAMS) * usdIdr;
}

const localeOf = (lang: Lang) => (lang === 'id' ? 'id-ID' : 'en-US');

export interface FormatOpts {
  decimals?: number;
  minDecimals?: number;
}

export function formatNumber(value: number, lang: Lang, opts: FormatOpts = {}): string {
  const { decimals = 2, minDecimals } = opts;
  return new Intl.NumberFormat(localeOf(lang), {
    minimumFractionDigits: minDecimals ?? decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/** USD with `$` prefix: EN `$1,234.56` / ID `$1.234,56` */
export function formatUsd(value: number, lang: Lang, opts: FormatOpts = {}): string {
  return `$${formatNumber(value, lang, { decimals: 2, ...opts })}`;
}

/** IDR with `Rp` prefix: ID `Rp 1.234.567` / EN `Rp 1,234,567` */
export function formatIdr(value: number, lang: Lang, opts: FormatOpts = {}): string {
  return `Rp${formatNumber(value, lang, { decimals: 0, ...opts })}`;
}

/** Format a value already expressed in a display unit. */
export function formatUnitPrice(value: number, unit: Unit, lang: Lang): string {
  return unit === 'idr-gr' ? formatIdr(value, lang) : formatUsd(value, lang);
}

/** Signed percent: `+0,42%` / `+0.42%` */
export function formatPct(value: number, lang: Lang, signed = true): string {
  const sign = value > 0 ? '+' : value < 0 ? '-' : '';
  const abs = formatNumber(Math.abs(value), lang, { decimals: 2 });
  return `${signed ? sign : ''}${abs}%`;
}

/** Time as HH:MM:SS UTC (design meta line) */
export function formatTimeUtc(ts: number): string {
  const d = new Date(ts);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())} UTC`;
}

const MONTHS_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** `21 Sep 2026` in both locales (month name localized) */
export function formatDate(ts: number, lang: Lang): string {
  const d = new Date(ts);
  const months = lang === 'id' ? MONTHS_ID : MONTHS_EN;
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

/** "Diperbarui 12 dtk lalu" / "Updated 12s ago" */
export function formatAgo(ts: number, lang: Lang, now = Date.now()): string {
  const s = Math.max(0, Math.round((now - ts) / 1000));
  if (s < 60) return lang === 'id' ? `Diperbarui ${s} dtk lalu` : `Updated ${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return lang === 'id' ? `Diperbarui ${m} mnt lalu` : `Updated ${m}m ago`;
  const h = Math.floor(m / 60);
  return lang === 'id' ? `Diperbarui ${h} jam lalu` : `Updated ${h}h ago`;
}
