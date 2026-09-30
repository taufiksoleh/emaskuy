/**
 * EmasKuy — Antam (Logam Mulia) retail prices.
 *
 * src/content/antam.json is written daily by the content agent and checked
 * in CI (scripts/validate-content.mjs). `sell` is the price of a whole bar;
 * buyback is quoted per gram. Only sizes the source actually quoted appear.
 */
import raw from '@/content/antam.json';
import { pointAtOrBefore, type HistoryPoint } from './history';
import { todayInWib } from './time';

export interface AntamSize {
  grams: number;
  /** Price of one bar */
  sell: number;
}

export interface BrandQuote {
  sellPerGram: number;
  buybackPerGram: number;
}

export interface AntamData {
  schemaVersion: number;
  /** Date the prices apply to, YYYY-MM-DD (WIB) */
  priceDate: string;
  /** When the file was written, ISO with +07:00 */
  updatedAt: string;
  source: { name: string; url: string };
  note: { id: string; en: string };
  antam: { buybackPerGram: number; sizes: AntamSize[] };
  others?: { galeri24?: BrandQuote; ubs?: BrandQuote };
  history: { date: string; sell1g: number; buyback: number | null }[];
}

// Typed at build time: `tsc` fails if the JSON drifts from AntamData.
const DATA: AntamData = raw;

/** Seam for a future runtime refresh; today the data ships with the build. */
export function useAntam(): AntamData {
  return DATA;
}

export function antamData(): AntamData {
  return DATA;
}

/** Price of a 1-gram bar (falls back to the latest history entry). */
export function antamOneGram(d: AntamData): number {
  return d.antam.sizes.find((s) => s.grams === 1)?.sell ?? d.history[d.history.length - 1]?.sell1g ?? 0;
}

export interface AntamRow {
  grams: number;
  sell: number;
  perGram: number;
  /** Premium of the per-gram price over spot, percent (null without spot) */
  vsSpotPct: number | null;
  /** What Antam pays back for the bar */
  buybackTotal: number;
  /** Sell–buyback gap as a share of the sell price, percent */
  spreadPct: number;
}

export function antamRows(d: AntamData, spotPerGram: number | null): AntamRow[] {
  return [...d.antam.sizes]
    .sort((a, b) => a.grams - b.grams)
    .map((s) => {
      const perGram = s.sell / s.grams;
      const buybackTotal = d.antam.buybackPerGram * s.grams;
      return {
        grams: s.grams,
        sell: s.sell,
        perGram,
        vsSpotPct: spotPerGram && spotPerGram > 0 ? (perGram / spotPerGram - 1) * 100 : null,
        buybackTotal,
        spreadPct: ((s.sell - buybackTotal) / s.sell) * 100,
      };
    });
}

export type OtherBrand = 'galeri24' | 'ubs';
export const OTHER_BRANDS: OtherBrand[] = ['galeri24', 'ubs'];

/** Buyback per gram for a bar of `brand`: its own quote when the file has one, else Antam's. */
export function buybackPerGramFor(d: AntamData, brand: string): number {
  const own = brand === 'galeri24' || brand === 'ubs' ? d.others?.[brand]?.buybackPerGram : undefined;
  return own ?? d.antam.buybackPerGram;
}

export interface BrandRow {
  brand: 'antam' | OtherBrand;
  sellPerGram: number;
  buybackPerGram: number;
  /** Sell–buyback gap as a share of the sell price, percent */
  spreadPct: number;
}

/** Antam's 1 g bar next to the other brands the file quotes; empty when it quotes none. */
export function brandRows(d: AntamData): BrandRow[] {
  const others = OTHER_BRANDS.flatMap((brand) => {
    const q = d.others?.[brand];
    return q ? [{ brand, ...q }] : [];
  });
  if (others.length === 0) return [];
  const antam = { brand: 'antam' as const, sellPerGram: antamOneGram(d), buybackPerGram: d.antam.buybackPerGram };
  return [antam, ...others].map((q) => ({ ...q, spreadPct: ((q.sellPerGram - q.buybackPerGram) / q.sellPerGram) * 100 }));
}

export type StalenessLevel = 'fresh' | 'aging' | 'stale';

const DAY_MS = 86_400_000;
const dayNumber = (iso: string) => Math.floor(Date.parse(`${iso}T00:00:00Z`) / DAY_MS);

/** Calendar days since `priceDate`, counted in WIB like the prices. */
export function staleness(d: AntamData, now: number = Date.now()): { ageDays: number; level: StalenessLevel } {
  const ageDays = Math.max(0, dayNumber(todayInWib(now)) - dayNumber(d.priceDate));
  return { ageDays, level: ageDays <= 1 ? 'fresh' : ageDays <= 3 ? 'aging' : 'stale' };
}

export interface AntamHistoryRow {
  date: string;
  t: number;
  sell1g: number;
  buyback: number | null;
  /** Spot rupiah per gram on that day (daily fixing), when known */
  spot: number | null;
}

/** Antam history joined with the spot rupiah price of the same (or last earlier) day. */
export function historyWithSpot(d: AntamData, spot: HistoryPoint[]): AntamHistoryRow[] {
  return d.history.map((h) => {
    const t = Date.parse(`${h.date}T00:00:00Z`);
    return { ...h, t, spot: pointAtOrBefore(spot, t)?.idr ?? null };
  });
}
