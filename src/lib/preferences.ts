/**
 * EmasKuy — saved preferences and the first-visit language. The display
 * currency and weight live in display.ts.
 */
import type { Lang } from './i18n';

export const LANG_KEY = 'emaskuy.lang';

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
