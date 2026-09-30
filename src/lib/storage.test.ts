import { describe, expect, it } from 'vitest';
import { migrateStorage, pruneCache, readJson, writeJson, type KV } from './storage';

/** In-memory storage that throws once its total size would exceed `limit`. */
function memoryStore(limit = Infinity, seed: Record<string, string> = {}): KV & { data: Map<string, string> } {
  const data = new Map(Object.entries(seed));
  const size = () => [...data].reduce((n, [k, v]) => n + k.length + v.length, 0);
  return {
    data,
    get length() {
      return data.size;
    },
    key: (i) => [...data.keys()][i] ?? null,
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => {
      const prev = data.get(k);
      data.set(k, v);
      if (size() > limit) {
        if (prev === undefined) data.delete(k);
        else data.set(k, prev);
        throw new Error('QuotaExceededError');
      }
    },
    removeItem: (k) => {
      data.delete(k);
    },
  };
}

const big = (n: number) => 'x'.repeat(n);

describe('writeJson', () => {
  it('round-trips JSON', () => {
    const store = memoryStore();
    expect(writeJson('emaskuy.portfolio', [{ id: 'a' }], store)).toBe(true);
    expect(readJson('emaskuy.portfolio', store)).toEqual([{ id: 'a' }]);
  });

  it('prunes caches, oldest tier first, to fit user data', () => {
    const store = memoryStore(1000, {
      'emaskuy.cache.nbp.all.2026-09-01': big(400),
      'emaskuy.cache.hist.all': big(300),
      'emaskuy.alerts': '[]',
      'emaskuy.lang': 'id',
    });
    expect(writeJson('emaskuy.portfolio', big(300), store)).toBe(true);
    // Removing the legacy NBP cache was enough: newer caches survive.
    expect(store.data.has('emaskuy.cache.nbp.all.2026-09-01')).toBe(false);
    expect(store.data.has('emaskuy.cache.hist.all')).toBe(true);
    expect(store.data.get('emaskuy.alerts')).toBe('[]');
    expect(store.data.get('emaskuy.lang')).toBe('id');
  });

  it('never deletes user keys and reports failure when nothing helps', () => {
    const store = memoryStore(200, { 'emaskuy.alerts': big(150) });
    expect(writeJson('emaskuy.portfolio', big(100), store)).toBe(false);
    expect(store.data.get('emaskuy.alerts')).toBe(big(150));
  });

  it('returns false without storage', () => {
    expect(writeJson('k', 1, null)).toBe(false);
    expect(readJson('k', null)).toBeNull();
  });
});

describe('pruneCache', () => {
  it('keeps the key being written and all user data', () => {
    const store = memoryStore(Infinity, {
      'emaskuy.cache.hist.1y': '1',
      'emaskuy.cache.metal.XAU': '2',
      'emaskuy.ticks.xau': '3',
      'emaskuy.portfolio': '4',
      'emaskuy.theme': 'dark',
    });
    expect(pruneCache(store, 'emaskuy.cache.hist.1y')).toBe(2);
    expect([...store.data.keys()].sort()).toEqual([
      'emaskuy.cache.hist.1y',
      'emaskuy.portfolio',
      'emaskuy.theme',
    ]);
  });
});

describe('migrateStorage', () => {
  it('drops the legacy per-day NBP caches and the stored email, once', () => {
    const store = memoryStore(Infinity, {
      'emaskuy.cache.nbp.all.2026-09-01': 'x',
      'emaskuy.cache.nbp.daily.370': 'x',
      'emaskuy.newsletter': 'someone@example.com',
      'emaskuy.cache.metal.XAU': 'keep',
      'emaskuy.portfolio': 'keep',
    });
    migrateStorage(store);
    expect([...store.data.keys()].sort()).toEqual([
      'emaskuy.cache.metal.XAU',
      'emaskuy.portfolio',
      'emaskuy.storage.v',
    ]);
    store.setItem('emaskuy.newsletter', 'again');
    migrateStorage(store);
    expect(store.data.has('emaskuy.newsletter')).toBe(true);
  });
});
