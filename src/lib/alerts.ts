/**
 * EmasKuy — Price Alerts storage layer.
 *
 * Alerts are persisted to localStorage under `emaskuy.alerts` as a JSON
 * array. All storage access is wrapped in try/catch so the feature never
 * breaks in private-mode / storage-denied environments.
 */

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
  try {
    const raw = localStorage.getItem(ALERTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PriceAlert[];
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
  } catch {
    return [];
  }
}

export function saveAlerts(list: PriceAlert[]): void {
  try {
    localStorage.setItem(ALERTS_KEY, JSON.stringify(list.slice(0, MAX_ALERTS)));
  } catch {
    /* non-fatal */
  }
}
