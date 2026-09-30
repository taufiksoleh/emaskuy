/**
 * EmasKuy — the visitor's display currency and weight unit.
 *
 * Saved under `emaskuy.display.v1` once the visitor picks one; until then
 * the defaults follow their time zone and the site language (useDisplay).
 * The first read migrates the old `emaskuy.unit` toggle (USD/oz or
 * IDR/gram) and leaves that key in place.
 */
import { isCurrency, isWeightUnit, type Currency, type WeightUnit } from './money';
import { readPref } from './preferences';
import { readJson, writeJson } from './storage';

export interface DisplayPrefs {
  currency: Currency;
  weight: WeightUnit;
}

export const DISPLAY_KEY = 'emaskuy.display.v1';
const LEGACY_UNIT_KEY = 'emaskuy.unit';

/** The saved choice, or null while the visitor hasn't picked one. */
export function loadDisplayPrefs(): DisplayPrefs | null {
  const saved = readJson<Partial<DisplayPrefs>>(DISPLAY_KEY);
  if (saved && isCurrency(saved.currency) && isWeightUnit(saved.weight)) {
    return { currency: saved.currency, weight: saved.weight };
  }
  const legacy = readPref(LEGACY_UNIT_KEY);
  if (legacy !== 'usd-oz' && legacy !== 'idr-gr') return null;
  const migrated: DisplayPrefs = legacy === 'usd-oz' ? { currency: 'USD', weight: 'ozt' } : { currency: 'IDR', weight: 'g' };
  writeJson(DISPLAY_KEY, migrated);
  return migrated;
}

let saved: DisplayPrefs | null | undefined;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function onStorage(e: StorageEvent) {
  if (e.key !== DISPLAY_KEY) return;
  saved = loadDisplayPrefs();
  emit();
}

export function subscribeDisplay(cb: () => void): () => void {
  if (listeners.size === 0 && typeof window !== 'undefined') window.addEventListener('storage', onStorage);
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
    if (listeners.size === 0 && typeof window !== 'undefined') window.removeEventListener('storage', onStorage);
  };
}

export function getDisplayPrefs(): DisplayPrefs | null {
  if (saved === undefined) saved = loadDisplayPrefs();
  return saved;
}

/** Applies the choice for this session even if the browser refuses to store it. */
export function saveDisplayPrefs(next: DisplayPrefs): boolean {
  saved = next;
  emit();
  return writeJson(DISPLAY_KEY, next);
}
