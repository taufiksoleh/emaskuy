/**
 * EmasKuy — saved language/unit preferences and their first-visit defaults.
 */
import type { Unit } from './gold';
import type { Lang } from './i18n';

export const LANG_KEY = 'emaskuy.lang';
export const UNIT_KEY = 'emaskuy.unit';

export function readPref(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writePref(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

/** True once the visitor has picked a language (or dismissed the prompt). */
export function hasSavedLang(): boolean {
  const saved = readPref(LANG_KEY);
  return saved === 'id' || saved === 'en';
}

/**
 * Indonesian unless the visitor chose otherwise. The browser language is
 * NOT used: crawlers render with en-US, and auto-switching served English
 * text on Indonesian pages. English readers get a prompt instead
 * (LangSuggest).
 */
export function detectLang(): Lang {
  return readPref(LANG_KEY) === 'en' ? 'en' : 'id';
}

const INDONESIAN_ZONES = ['Asia/Jakarta', 'Asia/Pontianak', 'Asia/Makassar', 'Asia/Jayapura'];

function inIndonesia(): boolean {
  try {
    return INDONESIAN_ZONES.includes(Intl.DateTimeFormat().resolvedOptions().timeZone);
  } catch {
    return false;
  }
}

/** Saved unit, else rupiah per gram for Indonesian readers, else USD/oz. */
export function detectUnit(lang: Lang): Unit {
  const saved = readPref(UNIT_KEY);
  if (saved === 'usd-oz' || saved === 'idr-gr') return saved;
  return lang === 'id' || inIndonesia() ? 'idr-gr' : 'usd-oz';
}
