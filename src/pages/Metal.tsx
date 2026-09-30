/**
 * Page: Harga Perak / Platinum / Paladium — `/logam/:metal`
 * (`/en/metals/:metal`). The live price in the display currency and
 * weight, the change since this browser's first price of the day, a chart
 * of the prices recorded in this browser, gold ratios and a converter.
 *
 * gold-api.com's free tier gives only the live price: no previous close and
 * no history for these metals, and the page says so.
 */
import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { Info } from 'lucide-react';
import { DisplayPicker } from '@/components/DisplayPicker';
import { Badge } from '@/components/ui-atoms/Badge';
import { DeltaChip } from '@/components/ui-atoms/DeltaChip';
import { MoneyInput } from '@/components/ui-atoms/MoneyInput';
import { MultiLineChart } from '@/components/ui-atoms/MultiLineChart';
import { Panel } from '@/components/ui-atoms/Panel';
import { StatCard } from '@/components/ui-atoms/StatCard';
import { useDisplay } from '@/hooks/useDisplay';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useGoldPrice } from '@/hooks/useGoldPrice';
import { formatNumber, formatUsd } from '@/lib/gold';
import { registerStrings, useI18n } from '@/lib/i18n';
import { WEIGHT, pricePer, type WeightUnit } from '@/lib/money';
import { parseAmount } from '@/lib/number';
import { METAL_PAGES, metalFromSlug, metalPath, pathFor, type MetalPageSymbol } from '@/lib/routes';
import { metalHead, metalName } from '@/lib/seo';
import { formatClockZone } from '@/lib/time';
import { cn, fill } from '@/lib/utils';
import NotFound from './NotFound';

registerStrings({
  'metal.label': { id: 'Logam mulia', en: 'Precious metals' },
  'metal.h1': { id: 'Harga {metal} Hari Ini', en: '{metal} Price Today' },
  'metal.since': { id: 'sejak {time}', en: 'since {time}' },
  'metal.24h': { id: '24 jam', en: '24h' },
  'metal.perOzUsd': { id: 'Per troy ounce (USD)', en: 'Per troy ounce (USD)' },
  'metal.perGram': { id: 'Per gram ({cur})', en: 'Per gram ({cur})' },
  'metal.ratio': { id: 'Rasio emas/{metal}', en: 'Gold/{metal} ratio' },
  'metal.ratioSub': { id: '{n} {metal} setara 1 emas', en: '{n} oz of {metal} buy 1 oz of gold' },
  'metal.range': { id: 'Rentang tercatat', en: 'Recorded range' },
  'metal.chart': { id: 'Harga tercatat di browser ini', en: 'Prices recorded in this browser' },
  'metal.collecting': {
    id: 'Grafik terisi dari harga yang tercatat selama situs terbuka di browser ini (maksimal 24 jam). Buka lagi nanti untuk melihat pergerakannya.',
    en: 'The chart fills with prices recorded while the site is open in this browser (up to 24 hours). Come back later to see it move.',
  },
  'metal.converter': { id: 'Konverter', en: 'Converter' },
  'metal.amount': { id: 'Berat', en: 'Weight' },
  'metal.others': { id: 'Logam lain', en: 'Other metals' },
  'metal.gold': { id: 'Emas', en: 'Gold' },
  'metal.note': {
    id: 'Harga live dari gold-api.com, diperbarui tiap 30 detik. Sumber gratis ini tidak memberi harga penutupan kemarin atau histori panjang untuk logam selain emas, jadi perubahan dihitung dari harga pertama yang tercatat di browser ini dalam 24 jam terakhir.',
    en: 'Live prices from gold-api.com, refreshed every 30 seconds. This free source has no previous close or long history for metals other than gold, so the change is measured from the first price this browser recorded in the last 24 hours.',
  },
});

const CONVERTER_UNITS: WeightUnit[] = ['g', 'ozt', 'kg'];

export default function MetalPage() {
  const { slug } = useParams<{ slug: string }>();
  const { lang } = useI18n();
  const symbol = metalFromSlug(slug, lang);
  return symbol ? <MetalView symbol={symbol} /> : <NotFound />;
}

function MetalView({ symbol }: { symbol: MetalPageSymbol }) {
  const { lang, t } = useI18n();
  const d = useDisplay();
  const { metals, metalTicks, rates, status } = useGoldPrice();
  const [amountRaw, setAmountRaw] = useState('10');
  const [convUnit, setConvUnit] = useState<WeightUnit>('g');
  useDocumentMeta(metalHead(symbol, lang));

  const name = metalName(symbol, lang);
  const quote = metals.find((m) => m.symbol === symbol);
  const gold = metals.find((m) => m.symbol === 'XAU');
  const usd = quote && quote.price > 0 ? quote.price : 0;
  const shown = d.price(usd);
  const fmt = (v: number) => `${d.approx}${d.format(v)}`;
  const ratio = gold && gold.price > 0 && usd > 0 ? gold.price / usd : 0;

  const ticks = metalTicks[symbol];
  const points = ticks.map((tk) => ({ t: tk.t, v: d.price(tk.p) }));
  const values = points.map((p) => p.v).filter((v) => v > 0);
  const since = quote?.apiChange ? t('metal.24h') : quote?.changeSince ? fill(t('metal.since'), { time: formatClockZone(quote.changeSince, lang) }) : '';

  const amount = parseAmount(amountRaw, lang);
  const grams = Number.isFinite(amount) && amount > 0 ? amount * WEIGHT[convUnit].grams : 0;
  const perGramLocal = pricePer(usd, d.currency, 'g', rates);

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-12 md:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4 pb-6 pt-10">
        <div>
          <div className="label-micro text-gold">{t('metal.label')}</div>
          <h1 className="mt-3 font-display text-[40px] font-bold leading-[1.1] tracking-[-0.02em] text-t1">
            {fill(t('metal.h1'), { metal: name })}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={status === 'live' ? 'live' : status === 'cached' ? 'cached' : 'offline'} />
          <DisplayPicker />
        </div>
      </div>

      <Panel glow>
        <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
          <div className="font-mono text-[44px] font-bold leading-none tabular text-gold md:text-[64px]">
            {shown > 0 ? fmt(shown) : '—'}
          </div>
          <div className="flex items-center gap-2 pb-1">
            {quote && usd > 0 && <DeltaChip value={quote.changePct} size="lg" />}
            {since && <span className="text-sm text-t3">{since}</span>}
          </div>
        </div>
        <p className="mt-3 font-mono text-[13px] text-t3">
          {symbol}/USD · {d.label}
        </p>
      </Panel>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label={t('metal.perOzUsd')} value={usd} format={(v) => (v > 0 ? formatUsd(v, lang) : '—')} />
        <StatCard
          label={fill(t('metal.perGram'), { cur: d.currency })}
          value={perGramLocal}
          format={(v) => (v > 0 ? d.format(v) : '—')}
        />
        <StatCard
          label={fill(t('metal.ratio'), { metal: name.toLowerCase() })}
          value={ratio}
          format={(v) => (v > 0 ? formatNumber(v, lang, { decimals: 1 }) : '—')}
          sub={ratio > 0 ? fill(t('metal.ratioSub'), { n: formatNumber(ratio, lang, { decimals: 1 }), metal: name.toLowerCase() }) : undefined}
        />
        <StatCard
          label={t('metal.range')}
          value={values.length > 1 ? Math.max(...values) : 0}
          format={() => (values.length > 1 ? `${fmt(Math.min(...values))} – ${fmt(Math.max(...values))}` : '—')}
          disableCountUp
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Panel title={t('metal.chart')} className="lg:col-span-8">
          {points.length > 1 ? (
            <MultiLineChart
              ariaLabel={t('metal.chart')}
              formatY={(v) => d.format(v, { decimals: v >= 1000 ? 0 : 2 })}
              formatX={(ms) => formatClockZone(ms, lang)}
              series={[{ key: symbol, label: `${name} · ${d.label}`, color: 'var(--gold)', points }]}
            />
          ) : (
            <p className="py-8 text-center text-sm text-t3">{t('metal.collecting')}</p>
          )}
        </Panel>

        <Panel title={t('metal.converter')} className="lg:col-span-4">
          <label className="label-micro" htmlFor="metal-amount">
            {t('metal.amount')}
          </label>
          <div className="mt-2 flex gap-2">
            <MoneyInput id="metal-amount" value={amountRaw} onChange={setAmountRaw} decimals={4} className="min-w-0 flex-1" />
            <div className="flex overflow-hidden rounded-lg bg-bg3 p-0.5" role="group" aria-label={t('metal.amount')}>
              {CONVERTER_UNITS.map((u) => (
                <button
                  key={u}
                  type="button"
                  aria-pressed={convUnit === u}
                  onClick={() => setConvUnit(u)}
                  className={cn(
                    'cursor-pointer rounded-md px-2.5 py-2 font-mono text-xs font-medium transition-colors',
                    convUnit === u ? 'bg-bg2 text-gold ring-1 ring-gold/60' : 'text-t3 hover:text-t2',
                  )}
                >
                  {WEIGHT[u].short}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 rounded-lg border border-hairline bg-bg2 p-4">
            <div className="label-micro">{d.currency}</div>
            <div className="mt-1 font-mono text-2xl font-semibold tabular text-gold">
              {grams > 0 && perGramLocal > 0 ? d.format(grams * perGramLocal) : '—'}
            </div>
            {d.currency !== 'USD' && (
              <>
                <div className="mt-3 label-micro">USD</div>
                <div className="mt-1 font-mono text-lg tabular text-t1">
                  {grams > 0 && usd > 0 ? formatUsd((grams / WEIGHT.ozt.grams) * usd, lang) : '—'}
                </div>
              </>
            )}
          </div>
        </Panel>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="label-micro">{t('metal.others')}</span>
        <Link to={pathFor('home', lang)} className="rounded-lg border border-hairline bg-bg2 px-3 py-1.5 text-sm text-t2 hover:border-goldline hover:text-gold">
          {t('metal.gold')}
        </Link>
        {METAL_PAGES.filter((s) => s !== symbol).map((s) => (
          <Link
            key={s}
            to={metalPath(s, lang)}
            className="rounded-lg border border-hairline bg-bg2 px-3 py-1.5 text-sm text-t2 hover:border-goldline hover:text-gold"
          >
            {metalName(s, lang)}
          </Link>
        ))}
      </div>

      <p className="mt-6 flex max-w-3xl items-start gap-2 text-xs leading-relaxed text-t3">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
        {t('metal.note')}
      </p>
    </div>
  );
}
