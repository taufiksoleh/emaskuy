/**
 * EmasKuy — Price Alerts storage layer.
 *
 * Alerts are persisted to localStorage under `emaskuy.alerts` as a JSON
 * array. Storage failures never throw; saves report whether they stuck.
 */
import { readJson, writeJson } from './storage';

export interface PriceAlert {
  id: string;
  unit: 'usd-oz' | 'idr-gr';
  direction: 'above' | 'below';
  target: number;
  createdAt: number;
  triggeredAt?: number;
}

export const ALERTS_KEY = 'emaskuy.alerts';
export const MAX_ALERTS = 10;

export function loadAlerts(): PriceAlert[] {
  const parsed = readJson<PriceAlert[]>(ALERTS_KEY);
  if (!Array.isArray(parsed)) return [];
  return parsed.filter(
    (a) =>
      a &&
      typeof a.id === 'string' &&
      (a.unit === 'usd-oz' || a.unit === 'idr-gr') &&
      (a.direction === 'above' || a.direction === 'below') &&
      typeof a.target === 'number' &&
      Number.isFinite(a.target),
  );
}

/** Returns false when the browser refused the write (storage full or blocked). */
export function saveAlerts(list: PriceAlert[]): boolean {
  return writeJson(ALERTS_KEY, list.slice(0, MAX_ALERTS));
}
