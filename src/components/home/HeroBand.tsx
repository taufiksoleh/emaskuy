/**
 * Section 1 — Hero price band: main price panel (glow) + 2×2 quick stats.
 */
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useGoldPrice } from '@/hooks/useGoldPrice';
import { useDailySeries } from '@/hooks/useDailySeries';
import {
  convertPrice,
  formatPct,
  formatTimeUtc,
  formatUnitPrice,
  formatUsd,
  formatIdr,
  formatNumber,
  xauUsdToIdrGram,
} from '@/lib/gold';
import { cn } from '@/lib/utils';
import { Badge } from '../ui-atoms/Badge';
import { DeltaChip } from '../ui-atoms/DeltaChip';
import { SegToggle } from '../ui-atoms/SegToggle';
import { StatCard, useCountUp } from '../ui-atoms/StatCard';
import { Sparkline } from '../ui-atoms/Sparkline';

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export function HeroBand() {
  const { lang, t, unit, setUnit } = useI18n();
  const { gold, usdIdr, status, lastUpdated, refetch, refetching, ticks, loading } = useGoldPrice();
  const daily = useDailySeries(35);

  const price = gold?.price ?? 0;
  const display = convertPrice(price, usdIdr, unit);
  const shown = useCountUp(display, 900);

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

  // 24h range from ticks (fallback: last daily points)
  let rangeLow = 0;
  let rangeHigh = 0;
  if (ticks.length > 1) {
    const ps = ticks.map((tk) => tk.p);
    rangeLow = Math.min(...ps);
    rangeHigh = Math.max(...ps);
  } else if (daily.points.length > 1) {
    const last2 = daily.points.slice(-2).map((p) => p.close);
    rangeLow = Math.min(...last2);
    rangeHigh = Math.max(...last2);
  }

  // 30d change + sparkline from daily series (NBP = business days only)
  const dailyPts = daily.points;
  let change30: number | undefined;
  if (dailyPts.length >= 2) {
    const last = dailyPts[dailyPts.length - 1];
    const anchor =
      [...dailyPts].reverse().find((p) => p.t <= last.t - 29 * 24 * 60 * 60 * 1000) ?? dailyPts[0];
    if (anchor.close > 0) change30 = ((last.close - anchor.close) / anchor.close) * 100;
  }
  const spark30 = dailyPts.slice(-30).map((p) => p.close);

  const gramIdr = price > 0 && usdIdr > 0 ? xauUsdToIdrGram(price, usdIdr) : 0;
  const convDelta = gold?.changePct ?? 0;

  return (
    <section
      className="relative overflow-hidden pt-8 pb-6"
      style={{
        backgroundImage:
          'radial-gradient(600px 200px at 30% 0%, rgba(245,185,62,0.08), transparent 70%)',
      }}
    >
      <div
        className="hero-texture pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: 'url(/home-hero-texture.png)', backgroundSize: '1920px 600px' }}
        aria-hidden
      />
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
            <span className="label-micro">{t('home.hero.label')}</span>
            <Badge variant={status === 'live' ? 'live' : status === 'cached' ? 'cached' : 'offline'} />
            <div className="ml-auto">
              <SegToggle
                ariaLabel="Price unit"
                value={unit}
                onChange={setUnit}
                options={[
                  { value: 'usd-oz', label: 'USD/oz' },
                  { value: 'idr-gr', label: 'IDR/gr' },
                ]}
              />
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
                className="text-gold-gradient font-mono font-bold tabular leading-none"
                style={{ fontSize: 'clamp(56px, 7vw, 96px)' }}
              >
                {price > 0 ? formatUnitPrice(shown, unit, lang) : '—'}
              </div>
            )}
          </div>

          {/* Row 3: delta + range */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {gold && (
              <DeltaChip
                value={convDelta}
                prefix={
                  unit === 'usd-oz'
                    ? `${formatUsd(Math.abs(gold.change), lang, { decimals: 2 })} · `
                    : ''
                }
                size="lg"
              />
            )}
            <span className="text-sm text-t3">{t('home.hero.today')}</span>
            {rangeLow > 0 && (
              <span className="label-micro">
                R:{' '}
                <span className="font-mono text-t2">
                  {unit === 'usd-oz'
                    ? `${formatUsd(rangeLow, lang)} – ${formatUsd(rangeHigh, lang)}`
                    : `${formatIdr(xauUsdToIdrGram(rangeLow, usdIdr || 1), lang)} – ${formatIdr(xauUsdToIdrGram(rangeHigh, usdIdr || 1), lang)}`}
                </span>
              </span>
            )}
          </div>

          {/* Row 4: meta + refresh */}
          <div className="mt-4 flex items-center gap-2 border-t border-hairline pt-4 font-mono text-[13px] tabular text-t3">
            <span>
              {unit === 'usd-oz' ? t('home.hero.perOz') : t('home.hero.perGram')} · {t('home.hero.source')}: gold-api.com
              {lastUpdated > 0 && (
                <>
                  {' '}
                  · {t('home.hero.updated')} {formatTimeUtc(lastUpdated)}
                </>
              )}
            </span>
            <button
              onClick={() => refetch()}
              aria-label={t('home.hero.refresh')}
              className="ml-auto cursor-pointer rounded-md border border-hairline bg-bg2 p-1.5 text-t3 transition-all duration-150 hover:border-goldline hover:text-gold active:scale-[0.97]"
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
              delta={convDelta}
            />
          </motion.div>
          <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.45, ease, delay: 0.16 }}>
            <StatCard
              className="h-full"
              label={t('home.stats.usdIdr')}
              value={usdIdr}
              format={(v) => (v > 0 ? formatNumber(v, lang, { decimals: 0 }) : '—')}
              sub={t('home.stats.fxSource')}
            />
          </motion.div>
          <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.45, ease, delay: 0.24 }}>
            <StatCard
              className="h-full"
              label={t('home.stats.change24')}
              value={gold?.changePct ?? 0}
              format={(v) => formatPct(v, lang)}
              sub={
                gold && (
                  <span style={{ color: (gold.changePct ?? 0) >= 0 ? 'var(--up)' : 'var(--down)' }}>
                    {formatUsd(Math.abs(gold.change), lang)}
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
