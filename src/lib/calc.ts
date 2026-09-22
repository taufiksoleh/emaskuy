/**
 * GoldLens — pure investment-simulation math + calculator i18n strings.
 *
 * Model (calculator.md §2):
 * - Buy price = live gold price per gram in the selected currency.
 * - Buy spread (%) models the dealer buy-sell margin: each purchase buys
 *   grams at price * (1 + spread).
 * - Gold price appreciates at the assumed annual growth rate, compounded
 *   monthly: r_m = (1 + r_a)^(1/12) - 1.
 * - Lump-sum: one purchase at month 0. DCA: purchase at every month.
 * - Portfolio value at month m = grams accumulated * price(m).
 */
import { formatIdr, formatUsd } from '@/lib/gold';
import { registerStrings, type Lang } from '@/lib/i18n';

export type CalcMode = 'lump' | 'dca';
export type CalcCurrency = 'idr' | 'usd';

export interface CalcInputs {
  mode: CalcMode;
  /** Initial investment, in selected currency */
  initial: number;
  /** Monthly contribution (DCA), in selected currency */
  monthly: number;
  /** Duration in years, 1..30 */
  years: number;
  /** Assumed annual growth, percent 0..20 */
  growthPct: number;
  /** Buy price per gram, in selected currency */
  buyPrice: number;
  /** Buy spread fee, percent */
  spreadPct: number;
}

export interface YearRow {
  year: number;
  invested: number;
  value: number;
  profit: number;
  grams: number;
}

/** Monthly series point used by the projection chart. */
export interface SeriesPoint {
  /** months since start */
  m: number;
  invested: number;
  value: number;
}

export interface CalcResult {
  finalValue: number;
  totalInvested: number;
  profit: number;
  /** profit / totalInvested * 100 */
  profitPct: number;
  grams: number;
  effectiveBuyPrice: number;
  yearly: YearRow[];
  monthly: SeriesPoint[];
}

/** Monthly compounding rate from an annual growth rate. */
export function monthlyRate(annualPct: number): number {
  return Math.pow(1 + annualPct / 100, 1 / 12) - 1;
}

export function simulate(inp: CalcInputs): CalcResult {
  const months = Math.max(1, Math.round(clamp(inp.years, 1, 30) * 12));
  const r = monthlyRate(clamp(inp.growthPct, 0, 20));
  const spread = Math.max(0, inp.spreadPct) / 100;
  const p0 = Math.max(0, inp.buyPrice);
  const effPrice0 = p0 * (1 + spread);

  const monthlyPts: SeriesPoint[] = [];
  const yearly: YearRow[] = [];
  let grams = 0;
  let invested = 0;

  for (let m = 0; m <= months; m++) {
    // contribution at the start of month m
    let add = 0;
    if (m === 0) add += Math.max(0, inp.initial);
    if (inp.mode === 'dca' && m >= 1) add += Math.max(0, inp.monthly);
    const price = p0 * Math.pow(1 + r, m);
    if (add > 0 && price > 0) {
      grams += add / (price * (1 + spread));
      invested += add;
    }
    const value = grams * price;
    monthlyPts.push({ m, invested, value });
    if (m > 0 && m % 12 === 0) {
      yearly.push({
        year: m / 12,
        invested,
        value,
        profit: value - invested,
        grams,
      });
    }
  }

  const last = monthlyPts[monthlyPts.length - 1];
  const totalInvested = last.invested;
  const finalValue = last.value;
  const profit = finalValue - totalInvested;
  const profitPct = totalInvested > 0 ? (profit / totalInvested) * 100 : 0;

  return {
    finalValue,
    totalInvested,
    profit,
    profitPct,
    grams,
    effectiveBuyPrice: effPrice0,
    yearly,
    monthly: monthlyPts,
  };
}

/** Future value of a lump sum (no spread) — helper for scenario lab. */
export function lumpFv(principal: number, annualPct: number, years: number): number {
  return principal * Math.pow(1 + annualPct / 100, years);
}

export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

/** Format a money amount in the calculator's selected currency, locale-aware. */
export function fmtMoney(v: number, currency: CalcCurrency, lang: Lang, decimals?: number): string {
  if (currency === 'idr') return formatIdr(v, lang, decimals !== undefined ? { decimals } : {});
  return formatUsd(v, lang, decimals !== undefined ? { decimals } : {});
}

/** Compact money for chart axes: Rp 187 jt / $1.2k */
export function fmtMoneyCompact(v: number, currency: CalcCurrency, lang: Lang): string {
  const abs = Math.abs(v);
  const decSep = lang === 'id' ? ',' : '.';
  const fix = (n: number) => {
    const s = n >= 100 ? Math.round(n).toString() : n.toFixed(1);
    return lang === 'id' ? s.replace('.', decSep) : s;
  };
  if (currency === 'idr') {
    if (abs >= 1e9) return `Rp${fix(v / 1e9)} ${lang === 'id' ? 'M' : 'B'}`;
    if (abs >= 1e6) return `Rp${fix(v / 1e6)} ${lang === 'id' ? 'jt' : 'M'}`;
    if (abs >= 1e3) return `Rp${fix(v / 1e3)} rb`;
    return `Rp${Math.round(v)}`;
  }
  if (abs >= 1e6) return `$${fix(v / 1e6)}M`;
  if (abs >= 1e3) return `$${fix(v / 1e3)}k`;
  return `$${Math.round(v)}`;
}

/** Parse a free-form numeric input (accepts both ID and EN separators). */
export function parseAmount(raw: string, lang: Lang): number {
  const clean = raw.replace(/[^\d.,-]/g, '');
  if (!clean) return NaN;
  let s = clean;
  if (lang === 'id') {
    // 1.234.567,89
    s = s.replace(/\./g, '').replace(',', '.');
  } else {
    s = s.replace(/,/g, '');
  }
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
}

/* ------------------------------------------------------------------ */
/* i18n strings (registered at module scope)                           */
/* ------------------------------------------------------------------ */

registerStrings({
  'calc.label': { id: 'Kalkulator Investasi', en: 'Investment Calculator' },
  'calc.title': { id: 'Simulasikan masa depan emas Anda', en: "Simulate your gold's future" },
  'calc.subtitle': {
    id: 'Harga beli otomatis memakai harga emas live. Atur skenario lump-sum atau cicilan rutin (DCA), lalu lihat proyeksi nilai investasi Anda.',
    en: 'Buy price automatically uses the live gold price. Set a lump-sum or recurring (DCA) scenario and see your investment projection.',
  },
  'calc.params': { id: 'Parameter', en: 'Parameters' },
  'calc.mode': { id: 'Mode investasi', en: 'Investment mode' },
  'calc.mode.lump': { id: 'Lump Sum', en: 'Lump Sum' },
  'calc.mode.dca': { id: 'DCA (Berkala)', en: 'DCA (Recurring)' },
  'calc.currency': { id: 'Mata uang', en: 'Currency' },
  'calc.initial': { id: 'Investasi awal', en: 'Initial investment' },
  'calc.monthly': { id: 'Cicilan bulanan', en: 'Monthly contribution' },
  'calc.duration': { id: 'Durasi', en: 'Duration' },
  'calc.yearsUnit': { id: 'tahun', en: 'years' },
  'calc.yearUnit': { id: 'tahun', en: 'year' },
  'calc.growth': { id: 'Asumsi kenaikan tahunan', en: 'Assumed annual growth' },
  'calc.growthHelp': {
    id: 'Rata-rata historis emas ±8%/thn (20 thn terakhir)',
    en: 'Historical gold average ≈8%/yr (last 20 yrs)',
  },
  'calc.buyPrice': { id: 'Harga beli per gram', en: 'Buy price per gram' },
  'calc.syncedLive': { id: 'Terhubung ke harga live', en: 'Synced to live price' },
  'calc.manualPrice': { id: 'Harga manual — klik ikon untuk sinkron ulang', en: 'Manual price — click icon to re-sync' },
  'calc.spread': { id: 'Spread/biaya beli (%)', en: 'Buy spread fee (%)' },
  'calc.spreadHelp': {
    id: 'Selisih harga beli-jual toko emas',
    en: 'Typical dealer buy-sell spread',
  },
  'calc.invalid': { id: 'Nilai tidak valid', en: 'Invalid value' },
  'calc.results': { id: 'Hasil Proyeksi', en: 'Projection Results' },
  'calc.finalValue': { id: 'Estimasi nilai akhir', en: 'Estimated final value' },
  'calc.totalInvested': { id: 'Total investasi', en: 'Total invested' },
  'calc.estProfit': { id: 'Estimasi keuntungan', en: 'Estimated profit' },
  'calc.goldEq': { id: 'Setara emas', en: 'Gold equivalent' },
  'calc.chartTitle': { id: 'Proyeksi nilai vs investasi', en: 'Projected value vs invested' },
  'calc.legend.value': { id: 'Nilai proyeksi', en: 'Projected value' },
  'calc.legend.invested': { id: 'Total investasi', en: 'Total invested' },
  'calc.tooltip.year': { id: 'Tahun', en: 'Year' },
  'calc.tooltip.value': { id: 'Nilai', en: 'Value' },
  'calc.tooltip.invested': { id: 'Investasi', en: 'Invested' },
  'calc.tooltip.profit': { id: 'Untung', en: 'Profit' },
  'calc.breakdown': { id: 'Rincian per Tahun', en: 'Yearly Breakdown' },
  'calc.col.year': { id: 'Tahun', en: 'Year' },
  'calc.col.invested': { id: 'Investasi', en: 'Invested' },
  'calc.col.value': { id: 'Nilai', en: 'Value' },
  'calc.col.profit': { id: 'Untung', en: 'Profit' },
  'calc.copy': { id: 'Salin Ringkasan', en: 'Copy Summary' },
  'calc.copied': { id: 'Tersalin!', en: 'Copied!' },
  'calc.reset': { id: 'Atur Ulang', en: 'Reset' },
  'calc.edu1.title': { id: 'Apa itu DCA?', en: 'What is DCA?' },
  'calc.edu1.body': {
    id: 'Investasi rutin dengan jumlah tetap setiap bulan, sehingga harga beli Anda ter-rata-rata (average) mengikuti naik-turun pasar.',
    en: 'Investing a fixed amount on a regular schedule, so your entry price averages out across market ups and downs.',
  },
  'calc.edu2.title': { id: 'Lump-sum vs DCA', en: 'Lump-sum vs DCA' },
  'calc.edu2.body': {
    id: 'Lump-sum unggul saat pasar naik terus; DCA lebih tenang saat pasar bergejolak karena membeli lebih banyak saat harga turun.',
    en: 'Lump-sum wins in steadily rising markets; DCA is steadier in volatile markets because you buy more when prices dip.',
  },
  'calc.edu3.title': { id: 'Risiko & asumsi', en: 'Risks & assumptions' },
  'calc.edu3.body': {
    id: 'Proyeksi bukan jaminan; harga emas bisa turun. Simulasi memakai asumsi pertumbuhan tetap dan mengabaikan inflasi serta pajak.',
    en: 'Projections are not guarantees; gold prices can fall. The simulation assumes fixed growth and ignores inflation and taxes.',
  },
  'calc.compare.title': { id: 'Bandingkan Skenario', en: 'Compare Scenarios' },
  'calc.compare.conservative': { id: 'Konservatif 5%', en: 'Conservative 5%' },
  'calc.compare.moderate': { id: 'Moderat 8%', en: 'Moderate 8%' },
  'calc.compare.aggressive': { id: 'Agresif 12%', en: 'Aggressive 12%' },
  'calc.compare.scenario': { id: 'Skenario', en: 'Scenario' },
  'calc.compare.final': { id: 'Nilai akhir', en: 'Final value' },
  'calc.compare.profit': { id: 'Untung', en: 'Profit' },
  'calc.disclaimer': {
    id: 'Kalkulator ini adalah simulasi edukatif berdasarkan asumsi pertumbuhan tetap. Kinerja masa lalu tidak menjamin hasil masa depan. Bukan nasihat keuangan.',
    en: 'This calculator is an educational simulation based on fixed-growth assumptions. Past performance does not guarantee future results. Not financial advice.',
  },
});
