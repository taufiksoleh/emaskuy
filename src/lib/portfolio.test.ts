import { describe, expect, it } from 'vitest';
import {
  hasBuyback,
  holdingValue,
  LEGACY_PORTFOLIO_KEY,
  PORTFOLIO_KEY,
  loadHoldings,
  normalizeHolding,
  pureGrams,
  saveHoldings,
  summarize,
  type Holding,
} from './portfolio';
import type { KV } from './storage';

function memoryStore(seed: Record<string, string> = {}): KV & { data: Map<string, string> } {
  const data = new Map(Object.entries(seed));
  return {
    data,
    get length() {
      return data.size;
    },
    key: (i) => [...data.keys()][i] ?? null,
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => void data.set(k, v),
    removeItem: (k) => void data.delete(k),
  };
}

const bar: Holding = {
  id: 'a',
  type: 'antam',
  grams: 10,
  kadarPct: 100,
  buyPricePerGram: 2_500_000,
  currency: 'IDR',
  date: '2026-09-01',
  updatedAt: 1,
};

describe('normalizeHolding', () => {
  it('reads the v1 shape as an untyped item', () => {
    expect(normalizeHolding({ id: 'x', grams: 5, buyPriceIdrPerGram: 2_580_000, date: '2026-09-30' })).toEqual({
      id: 'x',
      type: 'lainnya',
      grams: 5,
      kadarPct: 100,
      buyPricePerGram: 2_580_000,
      currency: 'IDR',
      date: '2026-09-30',
      note: undefined,
      updatedAt: 0,
    });
  });

  it('keeps purity only for jewelry', () => {
    expect(normalizeHolding({ ...bar, type: 'perhiasan', kadarPct: 75 })?.kadarPct).toBe(75);
    expect(normalizeHolding({ ...bar, kadarPct: 75 })?.kadarPct).toBe(100);
    expect(normalizeHolding({ ...bar, type: 'perhiasan', kadarPct: 150 })?.kadarPct).toBe(100);
  });

  it('rejects unusable rows', () => {
    for (const raw of [null, 'x', { ...bar, id: '' }, { ...bar, grams: 0 }, { ...bar, buyPricePerGram: -1 }]) {
      expect(normalizeHolding(raw)).toBeNull();
    }
  });
});

describe('storage', () => {
  it('migrates the v1 list and leaves it in place', () => {
    const v1 = JSON.stringify([{ id: 'x', grams: 5, buyPriceIdrPerGram: 2_580_000, date: '2026-09-30' }]);
    const store = memoryStore({ [LEGACY_PORTFOLIO_KEY]: v1 });
    const loaded = loadHoldings(store);
    expect(loaded).toHaveLength(1);
    expect(store.data.get(LEGACY_PORTFOLIO_KEY)).toBe(v1);
    expect(JSON.parse(store.data.get(PORTFOLIO_KEY)!).v).toBe(2);
  });

  it('prefers v2 once it exists, even when empty', () => {
    const store = memoryStore({ [LEGACY_PORTFOLIO_KEY]: JSON.stringify([bar]) });
    saveHoldings([], store);
    expect(loadHoldings(store)).toEqual([]);
  });
});

describe('summary', () => {
  it('counts jewelry by its pure gold', () => {
    const ring: Holding = { ...bar, id: 'r', type: 'perhiasan', grams: 10, kadarPct: 75, buyPricePerGram: 1_900_000 };
    expect(pureGrams(ring)).toBe(7.5);
    expect(summarize([bar, ring])).toEqual({
      totalGrams: 17.5,
      investGrams: 10,
      jewelryGrams: 7.5,
      totalInvested: 25_000_000 + 19_000_000,
    });
  });
});

describe('holdingValue', () => {
  const ring: Holding = { ...bar, id: 'r', type: 'perhiasan', grams: 10, kadarPct: 75 };
  const digital: Holding = { ...bar, id: 'd', type: 'digital', grams: 2 };

  it('values bars at buyback when chosen', () => {
    expect(holdingValue(bar, 'buyback', 2_400_000, 2_375_000)).toBe(10 * 2_375_000);
    expect(holdingValue(bar, 'spot', 2_400_000, 2_375_000)).toBe(10 * 2_400_000);
  });

  it('keeps jewelry and digital gold at spot × purity', () => {
    expect(holdingValue(ring, 'buyback', 2_400_000, 2_375_000)).toBe(7.5 * 2_400_000);
    expect(holdingValue(digital, 'buyback', 2_400_000, 2_375_000)).toBe(2 * 2_400_000);
  });

  it('falls back to spot without a buyback price', () => {
    expect(holdingValue(bar, 'buyback', 2_400_000, 0)).toBe(10 * 2_400_000);
  });
});

describe('holdings in other currencies', () => {
  it('keeps a supported purchase currency and defaults to rupiah', () => {
    expect(normalizeHolding({ ...bar, currency: 'MYR' })?.currency).toBe('MYR');
    expect(normalizeHolding({ ...bar, currency: 'XYZ' })?.currency).toBe('IDR');
    expect(normalizeHolding({ id: 'v1', grams: 1, buyPriceIdrPerGram: 2_000_000 })?.currency).toBe('IDR');
  });

  it('values only rupiah bars at the (rupiah) buyback', () => {
    const myrBar: Holding = { ...bar, currency: 'MYR', buyPricePerGram: 540 };
    expect(hasBuyback(bar)).toBe(true);
    expect(hasBuyback(myrBar)).toBe(false);
    expect(holdingValue(myrBar, 'buyback', 553, 2_375_000)).toBe(5530);
  });

  it('totals the invested money through a converter, or not at all', () => {
    const myrBar: Holding = { ...bar, id: 'm', currency: 'MYR', grams: 1, buyPricePerGram: 540 };
    const toIdr = (amount: number, from: string) => (from === 'MYR' ? amount * 4400 : amount);
    expect(summarize([bar, myrBar], toIdr).totalInvested).toBe(25_000_000 + 540 * 4400);
    expect(summarize([bar, myrBar], (a, from) => (from === 'MYR' ? null : a)).totalInvested).toBeNull();
  });
});
