import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ALERTS_KEY,
  LEGACY_ALERTS_KEY,
  alertHit,
  alertPrice,
  checkAlerts,
  loadAlerts,
  migrateV1Alert,
  normalizeAlert,
  type PriceAlert,
} from './alerts';

function memoryStorage(seed: Record<string, string> = {}) {
  const data = new Map(Object.entries(seed));
  return {
    data,
    get length() {
      return data.size;
    },
    key: (i: number) => [...data.keys()][i] ?? null,
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  };
}

const v1 = { id: 'a1', unit: 'idr-gr', direction: 'above', target: 2_500_000, createdAt: 5 };

describe('alert migration', () => {
  it('maps v1 units to a currency and weight', () => {
    expect(migrateV1Alert(v1)).toEqual({
      id: 'a1',
      metal: 'XAU',
      currency: 'IDR',
      weight: 'g',
      direction: 'above',
      target: 2_500_000,
      createdAt: 5,
    });
    expect(migrateV1Alert({ ...v1, unit: 'usd-oz', triggeredAt: 9 })).toMatchObject({ currency: 'USD', weight: 'ozt', triggeredAt: 9 });
  });

  it('drops alerts it cannot read', () => {
    expect(migrateV1Alert({ ...v1, unit: 'eur-kg' })).toBeNull();
    expect(migrateV1Alert({ ...v1, target: -1 })).toBeNull();
    expect(normalizeAlert({ ...v1, currency: 'XYZ', weight: 'g' })).toBeNull();
    expect(normalizeAlert({ ...v1, currency: 'MYR', weight: 'tola' })).toMatchObject({ currency: 'MYR', weight: 'tola' });
  });

  describe('loadAlerts', () => {
    let storage: ReturnType<typeof memoryStorage>;
    beforeEach(() => {
      storage = memoryStorage({ [LEGACY_ALERTS_KEY]: JSON.stringify([v1, { junk: true }]) });
      vi.stubGlobal('localStorage', storage);
    });
    afterEach(() => vi.unstubAllGlobals());

    it('migrates v1 once and keeps the old key', () => {
      const first = loadAlerts();
      expect(first).toHaveLength(1);
      expect(JSON.parse(storage.data.get(ALERTS_KEY)!)).toEqual(first);
      expect(storage.data.has(LEGACY_ALERTS_KEY)).toBe(true);

      storage.data.set(LEGACY_ALERTS_KEY, '[]');
      expect(loadAlerts()).toEqual(first);
    });
  });
});

describe('alert checks', () => {
  const alert: PriceAlert = { ...migrateV1Alert(v1)!, currency: 'MYR', weight: 'g', target: 550 };

  it('prices gold in the alert currency and weight', () => {
    expect(alertPrice(alert, 4147.6, { MYR: 4.081 })).toBeCloseTo((4147.6 / 31.1034768) * 4.081, 6);
    expect(alertPrice(alert, 4147.6, {})).toBe(0);
  });

  it('fires above or below the target, never without a price', () => {
    expect(alertHit(alert, 550)).toBe(true);
    expect(alertHit(alert, 549.9)).toBe(false);
    expect(alertHit({ ...alert, direction: 'below' }, 549.9)).toBe(true);
    expect(alertHit({ ...alert, direction: 'below' }, 0)).toBe(false);
  });
});

describe('checkAlerts', () => {
  const base = migrateV1Alert(v1)!;
  const above: PriceAlert = { ...base, id: 'up', currency: 'USD', weight: 'ozt', direction: 'above', target: 4100 };
  const below: PriceAlert = { ...base, id: 'down', currency: 'USD', weight: 'ozt', direction: 'below', target: 4000 };

  it('fires the alerts the price crossed, once', () => {
    const { next, fired } = checkAlerts([above, below], 4147.6, {}, 99);
    expect(fired.map((a) => a.id)).toEqual(['up']);
    expect(next.find((a) => a.id === 'up')?.triggeredAt).toBe(99);
    expect(next.find((a) => a.id === 'down')?.triggeredAt).toBeUndefined();
    expect(checkAlerts(next, 4200, {}, 100).fired).toEqual([]);
  });

  it('returns the same list when nothing fires', () => {
    const list = [above, below];
    expect(checkAlerts(list, 4050, {}, 1).next).toBe(list);
  });

  it('compares in each alert’s own currency', () => {
    const idr: PriceAlert = { ...above, id: 'idr', currency: 'IDR', weight: 'g', target: 2_400_000 };
    expect(checkAlerts([idr], 4147.6, { IDR: 17_921.7 }, 1).fired).toHaveLength(0);
    expect(checkAlerts([idr], 4200, { IDR: 17_921.7 }, 1).fired).toHaveLength(1);
  });
});
