/**
 * EmasKuy — pure helpers for the home price chart.
 */

export interface Pt {
  /** unix ms */
  t: number;
  v: number;
}

export interface Candle {
  /** bucket start, unix seconds */
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

/**
 * OHLC candles from observed ticks in fixed time buckets. Buckets without a
 * tick are skipped rather than invented.
 */
export function toCandles(pts: Pt[], bucketMs: number): Candle[] {
  const out: Candle[] = [];
  for (const p of pts) mergeTick(out, p, bucketMs);
  return out;
}

/**
 * Fold one tick into the candle list (mutates `candles`). Returns the candle
 * that changed, or null when the tick is older than the last candle.
 */
export function mergeTick(candles: Candle[], p: Pt, bucketMs: number): Candle | null {
  const time = Math.floor(p.t / bucketMs) * (bucketMs / 1000);
  const last = candles[candles.length - 1];
  if (last && time < last.time) return null;
  if (last && time === last.time) {
    last.high = Math.max(last.high, p.v);
    last.low = Math.min(last.low, p.v);
    last.close = p.v;
    return last;
  }
  const candle = { time, open: p.v, high: p.v, low: p.v, close: p.v };
  candles.push(candle);
  return candle;
}
