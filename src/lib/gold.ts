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

/** Put the minus sign before the currency symbol, and never print "-Rp0". */
function withSign(value: number, format: (abs: number) => string): string {
  const text = format(Math.abs(value));
  return value < 0 && /[1-9]/.test(text) ? `-${text}` : text;
}

/** USD with `$` prefix: EN `$1,234.56` / ID `$1.234,56`, negative `-$5` */
export function formatUsd(value: number, lang: Lang, opts: FormatOpts = {}): string {
  return withSign(value, (v) => `$${formatNumber(v, lang, { decimals: 2, ...opts })}`);
}

/** IDR with `Rp` prefix: ID `Rp1.234.567` / EN `Rp1,234,567`, negative `-Rp5` */
export function formatIdr(value: number, lang: Lang, opts: FormatOpts = {}): string {
  return withSign(value, (v) => `Rp${formatNumber(v, lang, { decimals: 0, ...opts })}`);
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

/**
 * Time as HH:MM:SS in the DEVICE's local timezone (no suffix — the device's
 * own clock is the reference, so a label would be redundant).
 */
export function formatTimeLocal(ts: number): string {
  const d = new Date(ts);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

const MONTHS_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** `21 Sep 2026` in both locales (month name localized) */
export function formatDate(ts: number, lang: Lang): string {
  const d = new Date(ts);
  const months = lang === 'id' ? MONTHS_ID : MONTHS_EN;
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Parse `YYYY-MM-DD` as a local calendar date. `Date.parse` reads date-only
 * strings as UTC midnight, which shows the previous day west of UTC.
 */
export function parseLocalDate(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Format a `YYYY-MM-DD` calendar date without timezone shifts. */
export function formatDateOnly(iso: string, lang: Lang): string {
  const d = parseLocalDate(iso);
  return d ? formatDate(d.getTime(), lang) : iso;
}

/** `YYYY-MM-DD` of a timestamp in the device's time zone (default: today). */
export function isoDateLocal(ms: number = Date.now()): string {
  const d = new Date(ms);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** `YYYY-MM-DD` of a timestamp in UTC. */
export function isoDateUtc(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

/** Whole calendar days from a date (ISO date or timestamp) to today, ≥ 0. */
export function ageInDays(when: string | number, now = Date.now()): number {
  const d = typeof when === 'string' ? parseLocalDate(when) : new Date(when);
  if (!d || Number.isNaN(d.getTime())) return 0;
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const today = new Date(now);
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  return Math.max(0, Math.round((todayStart - start) / 86_400_000));
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
