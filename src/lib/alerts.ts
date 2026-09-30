/**
 * EmasKuy — Price Alerts storage layer.
 *
 * Alerts are persisted to localStorage under `emaskuy.alerts.v2` as a JSON
 * array. Each alert keeps the currency and weight unit it was set in. The
 * first load converts v1 alerts (`emaskuy.alerts`, USD/oz or IDR/gram) and
 * leaves the old key in place. Storage failures never throw; saves report
 * whether they stuck.
 */
import {
  isCurrency,
  isWeightUnit,
  pricePer,
  type Currency,
  type Rates,
  type WeightUnit,
} from './money';
import { readJson, writeJson } from './storage';

export interface PriceAlert {
  id: string;
  metal: 'XAU';
  currency: Currency;
  weight: WeightUnit;
  direction: 'above' | 'below';
  target: number;
  createdAt: number;
  triggeredAt?: number;
}

export const ALERTS_KEY = 'emaskuy.alerts.v2';
export const LEGACY_ALERTS_KEY = 'emaskuy.alerts';
export const MAX_ALERTS = 10;

type Raw = Record<string, unknown>;

const isRaw = (v: unknown): v is Raw => typeof v === 'object' && v !== null;

/** Fields shared by v1 and v2, or null when invalid. */
function common(a: Raw) {
  const ok =
    typeof a.id === 'string' &&
    (a.direction === 'above' || a.direction === 'below') &&
    typeof a.target === 'number' &&
    Number.isFinite(a.target) &&
    a.target > 0;
  if (!ok) return null;
  return {
    id: a.id as string,
    direction: a.direction as PriceAlert['direction'],
    target: a.target as number,
    createdAt: typeof a.createdAt === 'number' ? a.createdAt : 0,
    ...(typeof a.triggeredAt === 'number' ? { triggeredAt: a.triggeredAt } : {}),
  };
}

export function normalizeAlert(v: unknown): PriceAlert | null {
  if (!isRaw(v) || !isCurrency(v.currency) || !isWeightUnit(v.weight)) return null;
  const base = common(v);
  return base && { ...base, metal: 'XAU', currency: v.currency, weight: v.weight };
}

const V1_UNITS: Record<string, { currency: Currency; weight: WeightUnit }> = {
  'usd-oz': { currency: 'USD', weight: 'ozt' },
  'idr-gr': { currency: 'IDR', weight: 'g' },
};

/** v1 stored `unit: 'usd-oz' | 'idr-gr'`. */
export function migrateV1Alert(v: unknown): PriceAlert | null {
  if (!isRaw(v) || typeof v.unit !== 'string' || !V1_UNITS[v.unit]) return null;
  const base = common(v);
  return base && { ...base, metal: 'XAU', ...V1_UNITS[v.unit] };
}

export function loadAlerts(): PriceAlert[] {
  const saved = readJson<unknown>(ALERTS_KEY);
  if (Array.isArray(saved)) return saved.flatMap((a) => normalizeAlert(a) ?? []);
  const legacy = readJson<unknown>(LEGACY_ALERTS_KEY);
  if (!Array.isArray(legacy)) return [];
  const migrated = legacy.flatMap((a) => migrateV1Alert(a) ?? []).slice(0, MAX_ALERTS);
  writeJson(ALERTS_KEY, migrated);
  return migrated;
}

/** Returns false when the browser refused the write (storage full or blocked). */
export function saveAlerts(list: PriceAlert[]): boolean {
  return writeJson(ALERTS_KEY, list.slice(0, MAX_ALERTS));
}

/** The live gold price in the alert's own currency and weight; 0 when unknown. */
export function alertPrice(a: PriceAlert, usdPerOz: number, rates: Rates): number {
  return pricePer(usdPerOz, a.currency, a.weight, rates);
}

export function alertHit(a: PriceAlert, current: number): boolean {
  if (current <= 0) return false;
  return a.direction === 'above' ? current >= a.target : current <= a.target;
}
