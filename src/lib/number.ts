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
const DECIMAL_SEP: Record<Lang, string> = { id: ',', en: '.' };

/** The thousands and decimal separators `formatWhileTyping` writes for `lang`. */
export function separatorsFor(lang: Lang): { group: string; decimal: string } {
  return { group: GROUP_SEP[lang], decimal: DECIMAL_SEP[lang] };
}

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

/**
 * Reshape text as the user types it, so the thousands grouping is visible
 * before the field ever loses focus. Only the active language's own
 * separators are recognized — a stray group separator, the other
 * language's decimal mark, or any other character is dropped rather than
 * guessed at, so the field always redraws as one unambiguous shape
 * (unlike `parseAmount`, which has to guess intent from free-form text
 * written elsewhere). The fraction is capped at `decimals` digits so
 * typing past the field's precision has no effect, matching what blur
 * would round to anyway.
 */
export function formatWhileTyping(raw: string, lang: Lang, decimals: number): string {
  const groupSep = GROUP_SEP[lang];
  const decSep = DECIMAL_SEP[lang];
  const negative = raw.trimStart().startsWith('-');

  let intPart = '';
  let fracPart = '';
  let sawDecimal = false;
  for (const ch of raw) {
    if (ch >= '0' && ch <= '9') {
      if (sawDecimal) {
        if (fracPart.length < decimals) fracPart += ch;
      } else {
        intPart += ch;
      }
    } else if (ch === decSep && !sawDecimal && decimals > 0) {
      sawDecimal = true;
    }
  }
  if (intPart.length > 1) intPart = intPart.replace(/^0+/, '') || '0';

  let result = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, groupSep);
  if (sawDecimal) result += decSep + fracPart;
  if (negative && (intPart || fracPart)) result = `-${result}`;
  return result;
}

/** Re-express raw input text written for one language in another. */
export function reformatRaw(raw: string, from: Lang, to: Lang, decimals = 2): string {
  const n = parseAmount(raw, from);
  return Number.isFinite(n) ? formatRaw(n, to, decimals) : raw;
}
