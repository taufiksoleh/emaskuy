/**
 * useDailySeries — NBP daily gold closes normalized to live XAU/USD.
 * Used by the home chart (7D–1Y) and market stats (52w high/low, volatility).
 */
import { useEffect, useState } from 'react';
import { fetchNbpAll, fetchNbpDaily, type DailySeries } from '@/lib/api';
import { useGoldPrice } from './useGoldPrice';

export function useDailySeries(days: number): DailySeries & { loading: boolean } {
  const { gold } = useGoldPrice();
  const liveXau = gold && gold.price > 0 ? gold.price : undefined;
  const [series, setSeries] = useState<DailySeries>({ points: [], status: 'offline' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchNbpDaily(days, liveXau)
      .then((s) => {
        if (!cancelled) {
          setSeries(s);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // refetch once we have a live anchor for normalization
  }, [days, liveXau]);

  return { ...series, loading };
}

/**
 * useAllTimeSeries — full NBP history (2013→now), fetched ON DEMAND only
 * when `enabled` is true (i.e. the user picked the ALL timeframe). Cached
 * per data-day in localStorage, so repeat views cost one tiny probe request.
 */
export function useAllTimeSeries(enabled: boolean): DailySeries & { loading: boolean } {
  const { gold } = useGoldPrice();
  const liveXau = gold && gold.price > 0 ? gold.price : undefined;
  const [series, setSeries] = useState<DailySeries>({ points: [], status: 'offline' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    setLoading(true);
    fetchNbpAll(liveXau)
      .then((s) => {
        if (!cancelled) {
          setSeries(s);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [enabled, liveXau]);

  return { ...series, loading };
}
