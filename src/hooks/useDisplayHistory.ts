/**
 * useDisplayHistory — daily gold history in the display currency and
 * weight, each day valued at that day's exchange rate.
 */
import { useMemo } from 'react';
import type { DataStatus } from '@/lib/api';
import { historyValue, needsFxSeries, type HistoryWindow } from '@/lib/history';
import { useDisplay } from './useDisplay';
import { useFxSeries } from './useFxSeries';
import { useHistory } from './useHistory';

export interface DisplayPoint {
  /** YYYY-MM-DD */
  date: string;
  /** Unix ms of the date at 00:00 UTC */
  t: number;
  /** Price in the display currency per display weight */
  v: number;
}

export function useDisplayHistory(
  range: HistoryWindow,
  enabled = true,
): { points: DisplayPoint[]; loading: boolean; status: DataStatus } {
  const { currency, weight } = useDisplay();
  const history = useHistory(range, enabled);
  const needsFx = needsFxSeries(currency);
  const fx = useFxSeries(currency, range, enabled && needsFx);

  const points = useMemo(() => {
    if (needsFx && !fx.on) return [];
    const on = fx.on ?? undefined;
    return history.points.flatMap((p) => {
      const v = historyValue(p, currency, weight, on);
      return v > 0 ? [{ date: p.date, t: p.t, v }] : [];
    });
  }, [history.points, currency, weight, needsFx, fx.on]);

  const waitingFx = needsFx && !fx.on && !fx.error;
  return {
    points,
    loading: history.loading || waitingFx,
    status: fx.error ? 'offline' : history.status,
  };
}
