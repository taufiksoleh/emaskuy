/**
 * EmasKuy — clock times labelled with Indonesian time zones.
 *
 * Indonesia spans WIB (UTC+7), WITA (UTC+8) and WIT (UTC+9); readers expect
 * those names, not "GMT+7". Other zones get a UTC offset label.
 */
import type { Lang } from './i18n';

const ZONE_NAMES: Record<string, string> = {
  'Asia/Jakarta': 'WIB',
  'Asia/Pontianak': 'WIB',
  'Asia/Makassar': 'WITA',
  'Asia/Ujung_Pandang': 'WITA',
  'Asia/Jayapura': 'WIT',
};

export function deviceTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

/** "WIB" / "WITA" / "WIT", else "UTC+8", "UTC−5:30"-style offsets. */
export function zoneLabel(tz: string = deviceTimeZone(), at: number = Date.now()): string {
  if (ZONE_NAMES[tz]) return ZONE_NAMES[tz];
  try {
    const name = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'shortOffset' })
      .formatToParts(at)
      .find((p) => p.type === 'timeZoneName')?.value;
    if (name) return /^GMT(\+0)?$/.test(name) ? 'UTC' : name.replace('GMT', 'UTC');
  } catch {
    /* unknown zone */
  }
  return 'UTC';
}

/** "09.15" (ID) / "09:15" (EN), 24-hour, optionally with seconds. */
export function formatClock(ts: number, lang: Lang, opts: { tz?: string; seconds?: boolean } = {}): string {
  return new Intl.DateTimeFormat(lang === 'id' ? 'id-ID' : 'en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: opts.seconds ? '2-digit' : undefined,
    hour12: false,
    timeZone: opts.tz,
  }).format(ts);
}

/** "09.15 WIB" — in the device zone unless `tz` is given. */
export function formatClockZone(ts: number, lang: Lang, opts: { tz?: string; seconds?: boolean } = {}): string {
  const tz = opts.tz ?? deviceTimeZone();
  return `${formatClock(ts, lang, { ...opts, tz })} ${zoneLabel(tz, ts)}`;
}
