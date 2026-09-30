/**
 * useHistory — daily gold history (USD/oz + IDR/gram per day) from the
 * app-wide history store. Components share one fetch per window; `enabled`
 * lets the ALL archive load only when the user asks for it.
 */
import { useEffect, useSyncExternalStore } from 'react';
import { fetchFxSeries, fetchNbpLast, fetchNbpRange } from '@/lib/api';
import { createHistoryStore, type HistorySnapshot, type HistoryWindow } from '@/lib/history';
import { getStorage } from '@/lib/storage';

export const historyStore = createHistoryStore({
  nbpLast: fetchNbpLast,
  nbpRange: fetchNbpRange,
  fxSeries: fetchFxSeries,
  storage: getStorage(),
  now: () => Date.now(),
});

export function useHistory(range: HistoryWindow, enabled = true): HistorySnapshot {
  const snap = useSyncExternalStore(historyStore.subscribe, () => historyStore.get(range));
  useEffect(() => {
    if (enabled) void historyStore.load(range);
  }, [range, enabled]);
  return snap;
}
