/**
 * Section 3 — Market stats grid: 4 StatCards + multi-metal table +
 * quick converter (design home.md §3).
 */
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight } from 'lucide-react';
import { toast } from 'sonner';
import { useI18n } from '@/lib/i18n';
import { useGoldPrice } from '@/hooks/useGoldPrice';
import { useDailySeries } from '@/hooks/useDailySeries';
import {
  TROY_OZ_GRAMS,
  formatDate,
  formatIdr,
  formatNumber,
  formatUsd,
} from '@/lib/gold';
import { cn } from '@/lib/utils';
import { DeltaChip } from '../ui-atoms/DeltaChip';
import { Panel } from '../ui-atoms/Panel';
import { StatCard } from '../ui-atoms/StatCard';
import { Sparkline } from '../ui-atoms/Sparkline';

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];
const METAL_NAME_KEYS = { XAU: 'common.gold', XAG: 'common.silver', XPT: 'common.platinum', XPD: 'common.palladium' } as const;

function MultiMetalTable() {
  const { lang, t } = useI18n();
  const { metals } = useGoldPrice();

  return (
    <Panel title={t('home.metals.title')} className="h-full" bodyClassName="px-0 py-0 md:px-0 md:py-0 !pt-0">
      <div className="mt-3 divide-y divide-hairline">
        {metals.length === 0 &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 md:px-6">
              <div className="skeleton-shimmer h-8 w-full rounded" />
            </div>
          ))}
        {metals.map((m, i) => (
          <motion.button
            key={m.symbol}
            initial={{ x: -8, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.3, ease, delay: i * 0.04 }}
            onClick={() => {
              if (m.symbol !== 'XAU') toast(t('common.comingSoon'), { description: `${m.symbol}/USD` });
            }}
            className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors duration-150 hover:bg-bg2 md:px-6"
          >
            <span className="rounded-md border border-goldline bg-bg3 px-2 py-1 font-mono text-xs font-semibold tabular text-gold">
              {m.symbol}
            </span>
            <span className="min-w-16 text-sm text-t2">{t(METAL_NAME_KEYS[m.symbol])}</span>
            <span className="ml-auto font-mono text-sm font-medium tabular text-t1">
              {m.price > 0 ? formatUsd(m.price, lang, { decimals: 2 }) : '—'}
            </span>
            {m.price > 0 ? (
              <DeltaChip value={m.changePct} size="sm" className="w-24 justify-center" />
            ) : (
              <span className="w-24 text-center font-mono text-xs text-t3">—</span>
            )}
          </motion.button>
        ))}
      </div>
    </Panel>
  );
}

type ConvUnit = 'oz' | 'gr' | 'kg';

function QuickConverter() {
  const { lang, t } = useI18n();
  const { gold, usdIdr } = useGoldPrice();
  const [amount, setAmount] = useState('10');
  const [unit, setUnit] = useState<ConvUnit>('gr');
  const [moneyToGold, setMoneyToGold] = useState(false);
  const [flip, setFlip] = useState(0);

  const xau = gold?.price ?? 0;
  const gramsPerUnit: Record<ConvUnit, number> = { oz: TROY_OZ_GRAMS, gr: 1, kg: 1000 };
  const amt = parseFloat(amount.replace(',', '.')) || 0;
  const pricePerGramIdr = xau > 0 && usdIdr > 0 ? (xau / TROY_OZ_GRAMS) * usdIdr : 0;

  // gold→money: grams in → USD/IDR out. money→gold: IDR in → grams/oz out.
  const grams = amt * gramsPerUnit[unit];
  const outUsd = (grams / TROY_OZ_GRAMS) * xau;
  const outIdr = grams * pricePerGramIdr;
  const inGrams = pricePerGramIdr > 0 ? amt / pricePerGramIdr : 0;

  return (
    <Panel title={t('home.conv.title')} className="h-full">
      <div className="flex items-center gap-2">
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/[^0-9.,]/g, ''))}
          inputMode="decimal"
          aria-label={t('home.conv.amount')}
          className="min-w-0 flex-1 rounded-lg border border-hairline bg-bg3 px-3 py-2.5 font-mono text-lg tabular text-t1 outline-none transition-shadow focus:ring-2 focus:ring-gold/40"
        />
        {moneyToGold ? (
          <span className="rounded-lg border border-hairline bg-bg3 px-3 py-2.5 font-mono text-sm text-t2">IDR</span>
        ) : (
          <div className="flex overflow-hidden rounded-lg bg-bg3 p-0.5">
            {(['gr', 'oz', 'kg'] as ConvUnit[]).map((u) => (
              <button
                key={u}
                onClick={() => setUnit(u)}
                className={cn(
                  'cursor-pointer rounded-md px-2.5 py-2 font-mono text-xs font-medium transition-colors',
                  unit === u ? 'bg-bg2 text-gold ring-1 ring-gold/60' : 'text-t3 hover:text-t2',
                )}
              >
                {u}
              </button>
            ))}
          </div>
        )}
        <button
          onClick={() => {
            setMoneyToGold((v) => !v);
            setFlip((f) => f + 1);
          }}
          aria-label="Swap direction"
          className="cursor-pointer rounded-lg border border-hairline bg-bg2 p-2.5 text-t3 transition-colors hover:border-goldline hover:text-gold"
        >
          <ArrowLeftRight
            className="h-4 w-4 transition-transform duration-300"
            style={{ transform: `rotate(${flip * 180}deg)` }}
          />
        </button>
      </div>

      <div className="mt-4 rounded-lg border border-hairline bg-bg2 p-4">
        {!moneyToGold ? (
          <>
            <div className="label-micro">USD</div>
            <div className="mt-1 font-mono text-2xl font-semibold tabular text-gold md:text-3xl">
              {formatUsd(outUsd, lang)}
            </div>
            <div className="mt-3 label-micro">IDR</div>
            <div className="mt-1 font-mono text-2xl font-semibold tabular text-t1 md:text-3xl">
              {formatIdr(outIdr, lang)}
            </div>
          </>
        ) : (
          <>
            <div className="label-micro">{t('home.conv.youGet')}</div>
            <div className="mt-1 font-mono text-2xl font-semibold tabular text-gold md:text-3xl">
              {formatNumber(inGrams, lang, { decimals: 4 })} gr
            </div>
            <div className="mt-1 font-mono text-sm tabular text-t2">
              ≈ {formatNumber(inGrams / TROY_OZ_GRAMS, lang, { decimals: 4 })} oz
            </div>
          </>
        )}
      </div>
      <p className="mt-3 font-mono text-xs tabular text-t3">{t('home.conv.note')}</p>
    </Panel>
  );
}

export function StatsGrid() {
  const { lang, t } = useI18n();
  const { metals } = useGoldPrice();
  const daily = useDailySeries(370);

  const stats = useMemo(() => {
    const pts = daily.points;
    if (pts.length < 30) return null;
    const year = pts.slice(-260);
    let hi = year[0];
    let lo = year[0];
    for (const p of year) {
      if (p.close > hi.close) hi = p;
      if (p.close < lo.close) lo = p;
    }
    const last30 = pts.slice(-31);
    const returns: number[] = [];
    for (let i = 1; i < last30.length; i++) {
      returns.push(Math.log(last30[i].close / last30[i - 1].close));
    }
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((a, r) => a + (r - mean) ** 2, 0) / returns.length;
    const vol30 = Math.sqrt(variance) * Math.sqrt(252) * 100;
    return { hi, lo, vol30, returns };
  }, [daily.points]);

  const xau = metals.find((m) => m.symbol === 'XAU');
  const xag = metals.find((m) => m.symbol === 'XAG');
  const ratio = xau && xag && xag.price > 0 ? xau.price / xag.price : 0;
  const ratioDelta = xau && xag ? xau.changePct - xag.changePct : 0;

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-4 md:px-6">
      {/* Row A — 4 stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          <StatCard
            key="hi"
            label={t('home.stats.high52')}
            value={stats?.hi.close ?? 0}
            format={(v) => (v > 0 ? formatUsd(v, lang, { decimals: 0 }) : '—')}
            sub={stats ? `${t('home.stats.reached')} ${formatDate(stats.hi.t, lang)}` : undefined}
          />,
          <StatCard
            key="lo"
            label={t('home.stats.low52')}
            value={stats?.lo.close ?? 0}
            format={(v) => (v > 0 ? formatUsd(v, lang, { decimals: 0 }) : '—')}
            sub={stats ? `${t('home.stats.reached')} ${formatDate(stats.lo.t, lang)}` : undefined}
          />,
          <StatCard
            key="ratio"
            label={t('home.stats.ratio')}
            value={ratio}
            format={(v) => (v > 0 ? formatNumber(v, lang, { decimals: 1 }) : '—')}
            delta={ratioDelta}
            sub={t('home.stats.ratioAvg')}
          />,
          <StatCard
            key="vol"
            label={t('home.stats.vol30')}
            value={stats?.vol30 ?? 0}
            format={(v) => (v > 0 ? `${formatNumber(v, lang, { decimals: 1 })}%` : '—')}
            sparkline={
              stats && stats.returns.length > 1 ? (
                <Sparkline data={stats.returns} width={72} height={24} color="var(--info)" drawIn={false} />
              ) : undefined
            }
          />,
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ y: 24, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, ease, delay: i * 0.07 }}
          >
            {card}
          </motion.div>
        ))}
      </div>

      {/* Row B — 2 panels */}
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45, ease }}
        >
          <MultiMetalTable />
        </motion.div>
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45, ease, delay: 0.07 }}
        >
          <QuickConverter />
        </motion.div>
      </div>
    </section>
  );
}
