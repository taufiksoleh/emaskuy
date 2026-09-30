/**
 * usePortfolio — the stored portfolio, shared by every component and kept
 * in sync across open tabs through `storage` events.
 */
import { useSyncExternalStore } from 'react';
import { PORTFOLIO_KEY, loadHoldings, saveHoldings, type Holding } from '@/lib/portfolio';

let holdings: Holding[] | null = null;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

function snapshot(): Holding[] {
  if (holdings === null) holdings = loadHoldings();
  return holdings;
}

function onStorage(e: StorageEvent) {
  if (e.key !== PORTFOLIO_KEY) return;
  holdings = loadHoldings();
  emit();
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  if (listeners.size === 1) window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(cb);
    if (listeners.size === 0) window.removeEventListener('storage', onStorage);
  };
}

/** Persist and publish a new list; false (and no change) when saving fails. */
export function commitHoldings(next: Holding[]): boolean {
  if (!saveHoldings(next)) return false;
  holdings = next;
  emit();
  return true;
}

export function usePortfolio(): Holding[] {
  return useSyncExternalStore(subscribe, snapshot);
}
