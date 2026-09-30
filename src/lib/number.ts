/**
 * EmasKuy — locale-aware parsing and formatting for numeric text inputs.
 *
 * Inputs hold raw strings. They must round-trip through the active language:
 * `formatRaw` writes "2.407.123,46" (ID) / "2,407,123.46" (EN) and
 * `parseAmount` reads either back. Values written in the other locale
 * ("557.1" typed on an ID keyboard) are still read as decimals.
 */
import { formatNumber } from './gold';
import type { Lang } from './i18n';

const GROUP_SEP: Record<Lang, string> = { id: '.', en: ',' };

/**
 * Parse free-form numeric text. Accepts `Rp`, `$`, `%` and spaces (incl. NBSP).
 *
 * - Both `.` and `,` present → the last one is the decimal separator.
 * - One separator repeated → thousands grouping ("1.000.000").
 * - One separator once → thousands only when it is the language's grouping
 *   separator, exactly 3 digits follow and the integer part is 1–3 digits
 *   not starting with 0 ("1.000" in ID); otherwise it is a decimal ("557.1").
 *
 * Returns NaN for empty or malformed text.
 */
export function parseAmount(raw: string, lang: Lang): number {
  const s = raw.replace(/rp|\$|%|\s/gi, '');
  if (!/^-?[\d.,]+$/.test(s) || !/\d/.test(s)) return NaN;
  const negative = s.startsWith('-');
  const body = negative ? s.slice(1) : s;

  let intPart = body;
  let fracPart = '';
  let groupSep: string | null = null;

  const hasDot = body.includes('.');
  const hasComma = body.includes(',');
  if (hasDot && hasComma) {
    const dec = body.lastIndexOf('.') > body.lastIndexOf(',') ? '.' : ',';
    const decIdx = body.lastIndexOf(dec);
    if (body.indexOf(dec) !== decIdx) return NaN;
    intPart = body.slice(0, decIdx);
    fracPart = body.slice(decIdx + 1);
    groupSep = dec === '.' ? ',' : '.';
  } else if (hasDot || hasComma) {
    const sep = hasDot ? '.' : ',';
    const idx = body.indexOf(sep);
    if (body.lastIndexOf(sep) !== idx) {
      groupSep = sep;
    } else {
      const before = body.slice(0, idx);
      const after = body.slice(idx + 1);
      const isGrouping = sep === GROUP_SEP[lang] && after.length === 3 && /^[1-9]\d{0,2}$/.test(before);
      if (isGrouping) {
        groupSep = sep;
      } else {
        intPart = before;
        fracPart = after;
      }
    }
  }

  if (groupSep && intPart.includes(groupSep)) {
    const pattern = new RegExp(`^\\d{1,3}(\\${groupSep}\\d{3})+$`);
    if (!pattern.test(intPart)) return NaN;
    intPart = intPart.split(groupSep).join('');
  }
  if (!/^\d*$/.test(intPart) || !/^\d*$/.test(fracPart)) return NaN;
  if (!intPart && !fracPart) return NaN;

  const n = Number(`${intPart || '0'}.${fracPart || '0'}`);
  if (!Number.isFinite(n)) return NaN;
  return negative ? -n : n;
}

/** Format a number for an input field: grouped, no trailing zeros. */
export function formatRaw(value: number, lang: Lang, decimals = 2): string {
  return formatNumber(value, lang, { decimals, minDecimals: 0 });
}

/** Re-express raw input text written for one language in another. */
export function reformatRaw(raw: string, from: Lang, to: Lang, decimals = 2): string {
  const n = parseAmount(raw, from);
  return Number.isFinite(n) ? formatRaw(n, to, decimals) : raw;
}
