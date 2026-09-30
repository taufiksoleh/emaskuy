/**
 * EmasKuy — zakat on gold (zakat emas).
 *
 * Nisab is 85 grams of pure gold and the rate 2.5%, due once the gold has
 * been held for a lunar year (haul) — the figures BAZNAS uses. Jewelry
 * counts by its pure-gold content. Scholars differ on jewelry that is worn
 * (the Hanafi school counts it; most others don't, within normal use), so
 * worn jewelry is only included when the user opts in.
 */

export const NISAB_GRAMS = 85;
export const ZAKAT_RATE = 0.025;

export interface ZakatInput {
  /** Bars, coins and digital gold, in grams of pure gold */
  investGrams: number;
  jewelry: {
    grams: number;
    /** Purity 0–1 (18K = 0.75) */
    kadar: number;
    worn: boolean;
  };
  /** Count worn jewelry too */
  includeWorn: boolean;
  /** Held for a full lunar year */
  haulMet: boolean;
  /** Price per gram of pure gold; null when unknown (offline) */
  pricePerGram: number | null;
}

export type ZakatReason = 'below-nisab' | 'haul-not-met' | 'due';

export interface ZakatResult {
  pureGrams: number;
  jewelryPureGrams: number;
  due: boolean;
  reason: ZakatReason;
  /** Grams still needed to reach nisab (0 once reached) */
  shortfallGrams: number;
  /** Share of nisab reached, 0–1 */
  progress: number;
  zakatGrams: number;
  zakatValue: number | null;
  nisabValue: number | null;
  totalValue: number | null;
}

const nonNegative = (v: number) => (Number.isFinite(v) && v > 0 ? v : 0);

export function computeZakat(inp: ZakatInput): ZakatResult {
  const { jewelry } = inp;
  const counted = !jewelry.worn || inp.includeWorn;
  const kadar = Math.min(1, nonNegative(jewelry.kadar));
  const jewelryPureGrams = counted ? nonNegative(jewelry.grams) * kadar : 0;
  const pureGrams = nonNegative(inp.investGrams) + jewelryPureGrams;

  // Tolerate float noise: 84.99999999 from unit conversions still counts.
  const meetsNisab = pureGrams >= NISAB_GRAMS - 1e-9;
  const due = meetsNisab && inp.haulMet;
  const reason: ZakatReason = !meetsNisab ? 'below-nisab' : !inp.haulMet ? 'haul-not-met' : 'due';
  const zakatGrams = due ? pureGrams * ZAKAT_RATE : 0;
  const price = inp.pricePerGram && inp.pricePerGram > 0 ? inp.pricePerGram : null;

  return {
    pureGrams,
    jewelryPureGrams,
    due,
    reason,
    shortfallGrams: meetsNisab ? 0 : NISAB_GRAMS - pureGrams,
    progress: Math.min(1, pureGrams / NISAB_GRAMS),
    zakatGrams,
    zakatValue: price === null ? null : zakatGrams * price,
    nisabValue: price === null ? null : NISAB_GRAMS * price,
    totalValue: price === null ? null : pureGrams * price,
  };
}
