/**
 * Section 1 — Hero price band: main price panel (glow) + 2×2 quick stats.
 */
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { registerStrings, useI18n } from '@/lib/i18n';
import { antamOneGram, useAntam } from '@/lib/antam';
import { useDisplay } from '@/hooks/useDisplay';
import { useDisplayHistory } from '@/hooks/useDisplayHistory';
import { useGoldPrice, useXauChange } from '@/hooks/useGoldPrice';
import { pointAtOrBefore, sliceSince } from '@/lib/history';
import { CURRENCY, WEIGHT, rateOf } from '@/lib/money';
import { formatClockZone } from '@/lib/time';
import { buildDailyPriceText, formatShareDate } from '@/lib/share';
import type { ShareCardModel } from '@/lib/shareCard';
import { formatPct, formatUsd, formatIdr, formatNumber, formatDateOnly, xauUsdToIdrGram } from '@/lib/gold';
import { cn, fill } from '@/lib/utils';
import { DisplayPicker } from '../DisplayPicker';
import { Badge } from '../ui-atoms/Badge';
import { DeltaChip } from '../ui-atoms/DeltaChip';
import { StatCard, useCountUp } from '../ui-atoms/StatCard';
import { Sparkline } from '../ui-atoms/Sparkline';
import { ShareDialog } from '../share/ShareDialog';

registerStrings({
  'share.perGram': { id: 'per gram · emas murni', en: 'per gram · pure gold' },
  'share.perOz': { id: 'per troy ounce', en: 'per troy ounce' },
  'share.perUnit': { id: 'per {unit} · emas murni', en: 'per {unit} · pure gold' },
  'home.stats.usdRate': { id: 'Kurs USD/{cur}', en: 'USD/{cur} Rate' },
  'share.gramLine': { id: 'Emas per gram', en: 'Gold per gram' },
  'share.last30': { id: '30 hari terakhir', en: 'Last 30 days' },
});

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export function HeroBand() {
  const { lang, t } = useI18n();
  const d = useDisplay();
  const { gold, usdIdr, rates, status, lastUpdated, refetch, refetching, ticks, loading } = useGoldPrice();
  const history = useDisplayHistory('1y');
  const change = useXauChange(d.currency, d.weight);
  const gramChange = useXauChange('IDR', 'g');
  const antam = useAntam();
  const antamGram = antamOneGram(antam);

  const price = gold?.price ?? 0;
  const display = d.price(price);
  const shown = useCountUp(display, 900);
  const fmt = (v: number) => `${d.approx}${d.format(v)}`;

  // Auto-fit the big numeral: estimate width from the FINAL string
  // (tabular chars ≈ 0.64em) so sizing never depends on the count-up
  // animation frame. IDR/gr strings are much longer than USD/oz, so a
  // fixed clamp() overflows on small screens.
  const numRef = useRef<HTMLDivElement>(null);
  const finalText = display > 0 ? fmt(display) : '—';
  useEffect(() => {
    const el = numRef.current;
    if (!el) return;
    const fit = () => {
      const max = window.innerWidth >= 1280 ? 96 : window.innerWidth >= 768 ? 76 : 52;
      const est = finalText.length * 0.64;
      const size = el.clientWidth > 0 ? Math.floor(el.clientWidth / est) : max;
      el.style.fontSize = `${Math.max(26, Math.min(max, size))}px`;
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [finalText]);

  // tick-flash on the big numeral
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);
  const prevRef = useRef<number | null>(null);
  useEffect(() => {
    if (prevRef.current !== null && price !== prevRef.current && price > 0) {
      setFlash(price > prevRef.current ? 'up' : 'down');
      const timer = setTimeout(() => setFlash(null), 650);
      return () => clearTimeout(timer);
    }
    if (price > 0) prevRef.current = price;
  }, [price]);

  // 24h range: only prices this browser actually observed (ticks keep 24h)
  let rangeLow = 0;
  let rangeHigh = 0;
  if (ticks.length > 1) {
    const ps = ticks.map((tk) => tk.p);
    rangeLow = Math.min(...ps);
    rangeHigh = Math.max(...ps);
  }

  // 30d change + sparkline in the display unit, ending at the live price
  const points = history.points;
  const refNow = lastUpdated || (points.length > 0 ? points[points.length - 1].t : 0);
  let change30: number | undefined;
  const anchor = pointAtOrBefore(points, refNow - 30 * 24 * 60 * 60 * 1000);
  if (anchor && display > 0 && anchor.v > 0) change30 = ((display - anchor.v) / anchor.v) * 100;
  const spark30 = [
    ...sliceSince(points, refNow - 30 * 24 * 60 * 60 * 1000).map((p) => p.v),
    ...(display > 0 ? [display] : []),
  ];

  // Second quick stat: the dollar rate of the display currency (rupiah for dollar users)
  const fxCurrency = d.currency === 'USD' ? 'IDR' : d.currency;
  const fxRate = rateOf(fxCurrency, rates);
  const perUnit =
    d.weight === 'g' ? t('share.perGram') : d.weight === 'ozt' ? t('share.perOz') : fill(t('share.perUnit'), { unit: WEIGHT[d.weight].name[lang] });

  const gramIdr = price > 0 && usdIdr > 0 ? xauUsdToIdrGram(price, usdIdr) : 0;

  // Snapshot for sharing, taken when the share dialog opens.
  const buildShare = () => {
    const at = Date.now();
    const text = buildDailyPriceText(
      {
        at,
        lang,
        idrPerGram: gramIdr > 0 ? gramIdr : null,
        usdPerOz: price > 0 ? price : null,
        changePct: gramIdr > 0 ? gramChange.pct : null,
        antam: { price: antamGram, buyback: antam.antam.buybackPerGram, date: antam.priceDate },
      },
      t,
    );
    const lines = [
      ...(d.currency === 'USD' && d.weight === 'ozt' ? [] : [`XAU/USD   ${formatUsd(price, lang)}/oz`]),
      ...(d.currency === 'IDR' && d.weight === 'g' ? [] : [`${t('share.gramLine')}   ${formatIdr(gramIdr, lang)}`]),
      `Antam 1 gr   ${formatIdr(antamGram, lang)} (${formatDateOnly(antam.priceDate, lang)})`,
    ];
    const model: ShareCardModel = {
      title: t('share.daily.title'),
      dateLine: formatShareDate(at, lang),
      price: fmt(display),
      unit: perUnit,
      change: gold
        ? { text: `${change.pct >= 0 ? '▲' : '▼'} ${formatPct(change.pct, lang)} · ${t('share.daily.24h')}`, up: change.pct >= 0 }
        : null,
      lines,
      spark: spark30,
      sparkLabel: t('share.last30'),
      footer: t('share.disclaimer'),
    };
    return { model, text };
  };
  const formatAbs = (v: number) => d.format(v);

  return (
    <section
      className="relative overflow-hidden pt-8 pb-6"
      style={{
        backgroundImage:
          'radial-gradient(600px 200px at 30% 0%, rgba(245,185,62,0.08), transparent 70%)',
      }}
    >
      <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 gap-4 px-4 md:px-6 xl:grid-cols-12">
        {/* Main price panel (7 cols, glow) */}
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, ease }}
          className="panel-glow rounded-[10px] border border-hairline bg-bg1 p-5 md:p-6 xl:col-span-7"
        >
          {/* Row 1 */}
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="label-micro">{t('home.hero.label')}</h1>
            <Badge variant={status === 'live' ? 'live' : status === 'cached' ? 'cached' : 'offline'} />
            <div className="ml-auto">
              <DisplayPicker />
            </div>
          </div>

          {/* Row 2: the number */}
          <div
            className={cn(
              'mt-3 rounded-lg px-1 -mx-1',
              flash === 'up' && 'tick-up',
              flash === 'down' && 'tick-down',
            )}
          >
            {loading ? (
              <div className="skeleton-shimmer h-16 w-72 rounded-lg md:h-24" />
            ) : (
              <div
                ref={numRef}
                className="text-gold-gradient font-mono font-bold tabular leading-none whitespace-nowrap"
              >
                {display > 0 ? fmt(shown) : '—'}
              </div>
            )}
          </div>

          {/* Row 3: delta + range */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {gold && (
              <DeltaChip
                value={change.pct}
                prefix={change.abs !== 0 ? `${formatAbs(Math.abs(change.abs))} · ` : ''}
                size="lg"
              />
            )}
            <span className="text-sm text-t3">{t('home.hero.today')}</span>
            {rangeLow > 0 && display > 0 && (
              <span className="label-micro">
                {t('home.hero.range')}:{' '}
                <span className="font-mono text-t2">
                  {fmt(d.price(rangeLow))} – {fmt(d.price(rangeHigh))}
                </span>
              </span>
            )}
          </div>

          {/* Row 4: meta + refresh */}
          <div className="mt-4 flex items-center gap-2 border-t border-hairline pt-4 font-mono text-[13px] tabular text-t3">
            <span className="min-w-0 flex-1 leading-relaxed">
              {CURRENCY[d.currency].name[lang]}, {perUnit} · {t('home.hero.source')}: gold-api.com
              {lastUpdated > 0 && (
                <>
                  {' '}
                  · {t('home.hero.updated')} {formatClockZone(lastUpdated, lang, { seconds: true })}
                </>
              )}
            </span>
            {price > 0 && <ShareDialog build={buildShare} filename="harga-emas-emaskuy" className="ml-auto" />}
            <button
              onClick={() => refetch()}
              aria-label={t('home.hero.refresh')}
              className="cursor-pointer rounded-md border border-hairline bg-bg2 p-1.5 text-t3 transition-all duration-150 hover:border-goldline hover:text-gold active:scale-[0.97]"
            >
              <RefreshCw className={cn('h-3.5 w-3.5', refetching && 'spin-once')} />
            </button>
          </div>
        </motion.div>

        {/* Quick stats (5 cols, 2×2) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:col-span-5">
          <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.45, ease, delay: 0.08 }}>
            <StatCard
              className="h-full"
              label={t('home.stats.gramIdr')}
              value={gramIdr}
              format={(v) => (v > 0 ? formatIdr(v, lang) : '—')}
              delta={gramChange.pct}
            />
          </motion.div>
          <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.45, ease, delay: 0.16 }}>
            <StatCard
              className="h-full"
              label={fill(t('home.stats.usdRate'), { cur: fxCurrency })}
              value={fxRate}
              format={(v) => (v > 0 ? formatNumber(v, lang, { decimals: v >= 100 ? 0 : 4 }) : '—')}
              sub={t('home.stats.fxSource')}
            />
          </motion.div>
          <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.45, ease, delay: 0.24 }}>
            <StatCard
              className="h-full"
              label={t('home.stats.change24')}
              value={change.pct}
              format={(v) => formatPct(v, lang)}
              sub={
                gold &&
                change.abs !== 0 && (
                  <span style={{ color: change.pct >= 0 ? 'var(--up)' : 'var(--down)' }}>
                    {formatAbs(Math.abs(change.abs))}
                  </span>
                )
              }
            />
          </motion.div>
          <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.45, ease, delay: 0.32 }}>
            <StatCard
              className="h-full"
              label={t('home.stats.change30')}
              value={change30 ?? 0}
              format={(v) => formatPct(v, lang)}
              sparkline={spark30.length > 1 ? <Sparkline data={spark30} width={72} height={24} /> : undefined}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
