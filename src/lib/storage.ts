/**
 * EmasKuy — safe localStorage access.
 *
 * Every write reports success. When the quota is full, disposable caches are
 * pruned tier by tier (oldest-format caches first) before retrying, so user
 * data (portfolio, alerts, preferences) is never lost to cached API data.
 */

export interface KV {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  key(index: number): string | null;
  readonly length: number;
}

export function getStorage(): KV | null {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : null;
  } catch {
    return null;
  }
}

/** Disposable keys, in the order they are sacrificed when storage is full. */
const PRUNE_TIERS: Array<(key: string) => boolean> = [
  (k) => k.startsWith('emaskuy.cache.nbp.'),
  (k) => k === 'emaskuy.cache.hist.all',
  (k) => k.startsWith('emaskuy.cache.'),
  (k) => k.startsWith('emaskuy.ticks.') && k !== 'emaskuy.ticks.xau',
  (k) => k === 'emaskuy.ticks.xau',
];

function keysOf(store: KV): string[] {
  const out: string[] = [];
  for (let i = 0; i < store.length; i++) {
    const k = store.key(i);
    if (k !== null) out.push(k);
  }
  return out;
}

function removeWhere(store: KV, match: (key: string) => boolean, keep?: string): number {
  let removed = 0;
  for (const k of keysOf(store)) {
    if (k === keep || !match(k)) continue;
    try {
      store.removeItem(k);
      removed++;
    } catch {
      /* ignore */
    }
  }
  return removed;
}

/** Remove every disposable cache entry except `keep`. Returns the count removed. */
export function pruneCache(store: KV, keep?: string): number {
  return PRUNE_TIERS.reduce((n, tier) => n + removeWhere(store, tier, keep), 0);
}

export function readJson<T>(key: string, store: KV | null = getStorage()): T | null {
  if (!store) return null;
  try {
    const raw = store.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

/** Write JSON; on quota errors prune caches tier by tier and retry. */
export function writeJson(key: string, value: unknown, store: KV | null = getStorage()): boolean {
  if (!store) return false;
  let text: string;
  try {
    text = JSON.stringify(value);
  } catch {
    return false;
  }
  const trySet = () => {
    try {
      store.setItem(key, text);
      return true;
    } catch {
      return false;
    }
  };
  if (trySet()) return true;
  for (const tier of PRUNE_TIERS) {
    if (removeWhere(store, tier, key) > 0 && trySet()) return true;
  }
  return false;
}

export function removeKey(key: string, store: KV | null = getStorage()): void {
  try {
    store?.removeItem(key);
  } catch {
    /* ignore */
  }
}

const VERSION_KEY = 'emaskuy.storage.v';
const VERSION = 2;

/**
 * One-time cleanup: v1 cached a ~200 KB NBP series per day under
 * `emaskuy.cache.nbp.*` and never deleted it, and the old newsletter form
 * kept the raw email address. Safe to call on every start.
 */
export function migrateStorage(store: KV | null = getStorage()): void {
  if (!store) return;
  try {
    if (Number(store.getItem(VERSION_KEY)) >= VERSION) return;
    removeWhere(store, (k) => k.startsWith('emaskuy.cache.nbp.') || k === 'emaskuy.newsletter');
    store.setItem(VERSION_KEY, String(VERSION));
  } catch {
    /* ignore */
  }
}
