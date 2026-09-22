/**
 * LiveCallout — inline data panel inside the article reader.
 * A StatCard trio whose values come live from useGoldPrice()/useDailySeries();
 * which trio renders is keyed by the article's `callout` field.
 */
import { useMemo } from 'react';
import { Activity } from 'lucide-react';
import { useGoldPrice } from '@/hooks/useGoldPrice';
import { useDailySeries } from '@/hooks/useDailySeries';
import { useI18n, registerStrings } from '@/lib/i18n';
import { formatUsd, formatIdr, formatNumber, xauUsdToIdrGram } from '@/lib/gold';
import { StatCard } from '@/components/ui-atoms/StatCard';
import type { ArticleCallout } from '@/data/articles';

registerStrings({
  'callout.live': { id: 'Data pasar live', en: 'Live market data' },
  'callout.spot': { id: 'Harga Spot XAU/USD', en: 'XAU/USD Spot Price' },
  'callout.spotIdr': { id: 'Emas per Gram (IDR)', en: 'Gold per Gram (IDR)' },
  'callout.change24h': { id: 'Perubahan 24 Jam', en: '24h Change' },
  'callout.change30d': { id: 'Perubahan 30 Hari', en: '30-Day Change' },
  'callout.usdidr': { id: 'Kurs USD/IDR', en: 'USD/IDR Rate' },
  'callout.silver': { id: 'Harga Spot XAG/USD', en: 'XAG/USD Spot Price' },
  'callout.ratio': { id: 'Rasio Emas/Perak', en: 'Gold/Silver Ratio' },
});

export function LiveCallout({ kind }: { kind: ArticleCallout }) {
  const { lang, t } = useI18n();
  const { gold, metals, usdIdr } = useGoldPrice();
  const { points } = useDailySeries(kind === 'dca' || kind === 'compare' ? 31 : 2);

  const price = gold?.price ?? 0;
  const chg24 = gold?.changePct ?? 0;
  const idrGram = usdIdr > 0 ? xauUsdToIdrGram(price, usdIdr) : 0;
  const silver = metals.find((m) => m.symbol === 'XAG')?.price ?? 0;
  const ratio = price > 0 && silver > 0 ? price / silver : 0;

  const chg30 = useMemo(() => {
    if (points.length < 2) return 0;
    const first = points[0].close;
    const last = points[points.length - 1].close;
    return first > 0 ? ((last - first) / first) * 100 : 0;
  }, [points]);

  type Spec = { label: string; value: number; format: (v: number) => string; delta?: number };
  const usd = (v: number) => formatUsd(v, lang);
  const pctFmt = (v: number) => `${formatNumber(v, lang)}%`;

  const specs: Record<ArticleCallout, Spec[]> = {
    rally: [
      { label: t('callout.spot'), value: price, format: usd, delta: chg24 },
      { label: t('callout.spotIdr'), value: idrGram, format: (v) => formatIdr(v, lang) },
      { label: t('callout.change24h'), value: chg24, format: pctFmt, delta: chg24 },
    ],
    rates: [
      { label: t('callout.spot'), value: price, format: usd, delta: chg24 },
      { label: t('callout.usdidr'), value: usdIdr, format: (v) => formatNumber(v, lang, { decimals: 0 }) },
      { label: t('callout.change24h'), value: chg24, format: pctFmt, delta: chg24 },
    ],
    dca: [
      { label: t('callout.spotIdr'), value: idrGram, format: (v) => formatIdr(v, lang) },
      { label: t('callout.change30d'), value: chg30, format: pctFmt, delta: chg30 },
      { label: t('callout.change24h'), value: chg24, format: pctFmt, delta: chg24 },
    ],
    reserves: [
      { label: t('callout.spot'), value: price, format: usd, delta: chg24 },
      { label: t('callout.usdidr'), value: usdIdr, format: (v) => formatNumber(v, lang, { decimals: 0 }) },
      { label: t('callout.spotIdr'), value: idrGram, format: (v) => formatIdr(v, lang) },
    ],
    compare: [
      { label: t('callout.spot'), value: price, format: usd, delta: chg24 },
      { label: t('callout.change30d'), value: chg30, format: pctFmt, delta: chg30 },
      { label: t('callout.spotIdr'), value: idrGram, format: (v) => formatIdr(v, lang) },
    ],
    ratio: [
      { label: t('callout.ratio'), value: ratio, format: (v) => formatNumber(v, lang, { decimals: 1 }) },
      { label: t('callout.spot'), value: price, format: usd, delta: chg24 },
      { label: t('callout.silver'), value: silver, format: usd },
    ],
  };

  return (
    <div className="my-8 rounded-[10px] border border-goldline bg-bg1 p-4 panel-glow md:p-5">
      <div className="label-micro flex items-center gap-2 text-golddim">
        <Activity className="h-3.5 w-3.5" />
        {t('callout.live')}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {specs[kind].map((s) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            format={s.format}
            delta={s.delta}
            disableCountUp={false}
          />
        ))}
      </div>
    </div>
  );
}
