/**
 * EmasKuy — translation registry, usable outside React (share texts,
 * build-time prerendering). Components read it through useI18n().t.
 */

export type Lang = 'id' | 'en';

export interface StringEntry {
  id: string;
  en: string;
}

type Dict = Record<string, StringEntry>;

const registry: Dict = {};

/** Register translation keys (idempotent per key). Call at module scope. */
export function registerStrings(entries: Dict): void {
  for (const k of Object.keys(entries)) {
    if (!(k in registry)) registry[k] = entries[k];
  }
}

/** Translate a registered key. Falls back to the key itself when missing. */
export function translate(key: string, lang: Lang): string {
  return registry[key]?.[lang] ?? key;
}
