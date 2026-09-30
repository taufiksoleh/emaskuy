/**
 * EmasKuy — savings target in grams ("reverse DCA").
 *
 * "I want G grams in N months": the monthly amount A such that the
 * purchases of simulate() in DCA mode add up to G grams. Month m (1..N)
 * buys A / (p0·(1+r)^m·(1+s)) grams, so
 *   A = (G·p0·(1+s) − initial) / Σ_{m=1..N} (1+r)^−m
 * with r the monthly growth and s the buy spread.
 */
import { monthlyRate } from './calc';

export interface TargetInput {
  targetGrams: number;
  months: number;
  /** Assumed annual price growth, percent */
  growthPct: number;
  /** Buy spread, percent */
  spreadPct: number;
  /** Price per gram today */
  pricePerGram: number;
  /** Amount already set aside, spent at month 0 */
  initial: number;
}

export interface TargetResult {
  /** Required monthly amount (0 when already met) */
  monthly: number;
  alreadyMet: boolean;
  totalPaid: number;
  /** Price per gram after N months at the assumed growth */
  futurePrice: number;
  months: number;
}

export const MAX_TARGET_MONTHS = 360;

export function computeTarget(inp: TargetInput): TargetResult {
  const months = Math.min(MAX_TARGET_MONTHS, Math.max(1, Math.round(inp.months) || 1));
  const r = monthlyRate(Math.min(20, Math.max(0, inp.growthPct)));
  const s = Math.max(0, inp.spreadPct) / 100;
  const price = Math.max(0, inp.pricePerGram);
  const initial = Math.max(0, inp.initial);
  const futurePrice = price * Math.pow(1 + r, months);

  const need = Math.max(0, inp.targetGrams) * price * (1 + s) - initial;
  if (need <= 0 || price === 0) {
    return { monthly: 0, alreadyMet: need <= 0 && price > 0, totalPaid: initial, futurePrice, months };
  }
  const annuity = r === 0 ? months : (1 - Math.pow(1 + r, -months)) / r;
  const monthly = need / annuity;
  return { monthly, alreadyMet: false, totalPaid: initial + monthly * months, futurePrice, months };
}
