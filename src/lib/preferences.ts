/**
 * EmasKuy — small saved preferences. The page language comes from the URL
 * (routes.ts); the display currency and weight live in display.ts.
 */

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
