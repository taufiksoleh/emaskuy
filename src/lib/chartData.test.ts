import { describe, expect, it } from 'vitest';
import { mergeTick, toCandles } from './chartData';

const MIN = 60_000;

describe('toCandles', () => {
  it('builds OHLC per bucket and skips empty buckets', () => {
    const candles = toCandles(
      [
        { t: 0, v: 10 },
        { t: 30_000, v: 12 },
        { t: 60_000, v: 9 },
        { t: 5 * MIN, v: 11 },
      ],
      2 * MIN,
    );
    expect(candles).toEqual([
      { time: 0, open: 10, high: 12, low: 9, close: 9 },
      { time: 240, open: 11, high: 11, low: 11, close: 11 },
    ]);
  });

  it('ignores ticks older than the last candle', () => {
    const candles = toCandles([{ t: 10 * MIN, v: 1 }], MIN);
    expect(mergeTick(candles, { t: 0, v: 2 }, MIN)).toBeNull();
    expect(candles).toHaveLength(1);
  });
});
