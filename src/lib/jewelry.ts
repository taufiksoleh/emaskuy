/**
 * EmasKuy — jewelry gold value (emas perhiasan).
 *
 * Jewelry is sold by karat or by "kadar" (purity %). The gold inside is
 * worth weight × purity × the pure-gold price; shops buy back below that
 * (potongan), which the deduction models.
 */

/** Standard purities by karat, as stamped (750 = 18K). 24K jewelry is 99.9%. */
export const KARAT_PURITY: { karat: number; pct: number }[] = [
  { karat: 24, pct: 99.9 },
  { karat: 23, pct: 95.8 },
  { karat: 22, pct: 91.6 },
  { karat: 21, pct: 87.5 },
  { karat: 20, pct: 83.3 },
  { karat: 18, pct: 75 },
  { karat: 17, pct: 70.8 },
  { karat: 16, pct: 66.7 },
  { karat: 14, pct: 58.5 },
  { karat: 10, pct: 41.7 },
  { karat: 9, pct: 37.5 },
  { karat: 8, pct: 33.3 },
];

/** Purities Indonesian shops quote directly ("kadar 70%", "emas muda"). */
export const COMMON_KADAR_PCT = [37.5, 70, 75, 91.6];

export interface JewelryInput {
  weightGrams: number;
  /** Purity in percent, 0–100 */
  kadarPct: number;
  /** Pure-gold price per gram */
  pricePerGram: number;
  /** Shop's buy-back deduction, percent of the gold value */
  deductionPct: number;
}

export interface JewelryResult {
  pureGrams: number;
  /** Purity expressed in karat (kadar × 24) */
  karat: number;
  /** Value of the gold content */
  value: number;
  /** Expected buy-back after the deduction */
  sellBack: number;
  /** Gold value per gram of jewelry */
  perGram: number;
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, Number.isFinite(v) ? v : min));

export function computeJewelry(inp: JewelryInput): JewelryResult {
  const weight = clamp(inp.weightGrams, 0, Infinity);
  const kadar = clamp(inp.kadarPct, 0, 100) / 100;
  const price = clamp(inp.pricePerGram, 0, Infinity);
  const deduction = clamp(inp.deductionPct, 0, 100) / 100;
  const pureGrams = weight * kadar;
  const value = pureGrams * price;
  return {
    pureGrams,
    karat: kadar * 24,
    value,
    sellBack: value * (1 - deduction),
    perGram: kadar * price,
  };
}
