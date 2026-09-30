/**
 * EmasKuy — WhatsApp-ready text for sharing prices and calculator results.
 *
 * WhatsApp renders *bold* and _italic_ and previews links on its own, so
 * messages are short lines with the key number in bold and one link.
 */
import { formatDateOnly, formatIdr, formatPct, formatUsd } from './gold';
import type { Lang } from './i18n';
import { registerStrings } from './i18n';
import { SITE_URL } from './seo';
import { formatClockZone } from './time';

registerStrings({
  'share.daily.title': { id: 'Harga Emas Hari Ini', en: 'Gold Price Today' },
  'share.daily.spot': { id: 'Emas spot', en: 'Spot gold' },
  'share.daily.24h': { id: '24 jam', en: '24h' },
  'share.daily.live': { id: 'Pantau harga live', en: 'Live prices' },
  'share.try': { id: 'Hitung sendiri', en: 'Try it yourself' },
  'share.buyback': { id: 'Buyback Antam', en: 'Antam buyback' },
  'share.disclaimer': { id: 'Bukan saran investasi', en: 'Not investment advice' },
});

type Translate = (key: string) => string;

export function waLink(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

/** "Rab, 30 Sep 2026 · 09.15 WIB" in the device's time zone. */
export function formatShareDate(ts: number, lang: Lang, tz?: string): string {
  const date = new Intl.DateTimeFormat(lang === 'id' ? 'id-ID' : 'en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: tz,
  }).format(ts);
  return `${date} · ${formatClockZone(ts, lang, { tz })}`;
}

export interface DailyPriceInput {
  at: number;
  lang: Lang;
  idrPerGram: number | null;
  usdPerOz: number | null;
  /** Change of the rupiah price since the previous close, percent */
  changePct: number | null;
  antam: { price: number; buyback: number | null; date: string } | null;
  /** Time zone for the date line (defaults to the device's) */
  tz?: string;
}

export function buildDailyPriceText(inp: DailyPriceInput, t: Translate): string {
  const { lang } = inp;
  const lines = [`*${t('share.daily.title')}*`, formatShareDate(inp.at, lang, inp.tz), ''];
  if (inp.idrPerGram && inp.idrPerGram > 0) {
    const change =
      inp.changePct !== null && Number.isFinite(inp.changePct)
        ? ` (${inp.changePct >= 0 ? '▲' : '▼'} ${formatPct(inp.changePct, lang)} ${t('share.daily.24h')})`
        : '';
    lines.push(`• ${t('share.daily.spot')}: *${formatIdr(inp.idrPerGram, lang)}*/gram${change}`);
  }
  if (inp.usdPerOz && inp.usdPerOz > 0) lines.push(`• XAU/USD: ${formatUsd(inp.usdPerOz, lang)}/oz`);
  if (inp.antam && inp.antam.price > 0) {
    lines.push(`• Antam 1 gr: *${formatIdr(inp.antam.price, lang)}* (${formatDateOnly(inp.antam.date, lang)})`);
    if (inp.antam.buyback && inp.antam.buyback > 0) {
      lines.push(`• ${t('share.buyback')}: ${formatIdr(inp.antam.buyback, lang)}/gram`);
    }
  }
  lines.push('', `${t('share.daily.live')}: ${SITE_URL}/`, `_${t('share.disclaimer')}_`);
  return lines.join('\n');
}

/**
 * A calculator result as a WhatsApp message: bold title, one fact per line
 * (`[label, value]`, value in bold when marked), then a link to redo it.
 */
export function buildResultText(
  title: string,
  rows: Array<[label: string, value: string, bold?: boolean]>,
  path: string,
  t: Translate,
): string {
  return [
    `*${title}*`,
    ...rows.map(([label, value, bold]) => `• ${label}: ${bold ? `*${value}*` : value}`),
    '',
    `${t('share.try')}: ${SITE_URL}${path}`,
    `_${t('share.disclaimer')}_`,
  ].join('\n');
}
