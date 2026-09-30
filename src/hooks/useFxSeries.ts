/**
 * useFxSeries — daily ECB rates of one currency per USD, to draw history in
 * currencies other than USD and IDR (those come with the NBP history). One
 * request per currency and window per session; the ALL window, once loaded,
 * also serves the 1-year one.
 */
import { useEffect, useSyncExternalStore } from 'react';
import { fetchUsdFxSeries } from '@/lib/api';
import type { HistoryWindow } from '@/lib/history';
import { dailyRateLookup, type Currency, type RateOn } from '@/lib/money';

const series = new Map<string, RateOn>();
const pending = new Set<string>();
const failed = new Set<string>();
const listeners = new Set<() => void>();
let version = 0;

function emit() {
  version++;
  for (const l of listeners) l();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

const startOf = (range: HistoryWindow) =>
  range === 'all' ? '2013-01-01' : new Date(Date.now() - 400 * 86_400_000).toISOString().slice(0, 10);

function load(currency: Currency, range: HistoryWindow) {
  const key = `${currency}:${range}`;
  if (series.has(key) || pending.has(key)) return;
  pending.add(key);
  failed.delete(key);
  fetchUsdFxSeries(currency, startOf(range))
    .then((byDate) => series.set(key, dailyRateLookup(byDate)))
    .catch(() => failed.add(key))
    .finally(() => {
      pending.delete(key);
      emit();
    });
}

export function useFxSeries(currency: Currency, range: HistoryWindow, enabled: boolean): { on: RateOn | null; error: boolean } {
  useSyncExternalStore(subscribe, () => version);
  useEffect(() => {
    if (enabled) load(currency, range);
  }, [currency, range, enabled]);
  if (!enabled) return { on: null, error: false };
  const on = series.get(`${currency}:all`) ?? series.get(`${currency}:${range}`) ?? null;
  return { on, error: !on && failed.has(`${currency}:${range}`) };
}
