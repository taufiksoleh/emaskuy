/**
 * InputsPanel — calculator parameters: mode, currency, amounts with quick
 * chips, duration & growth sliders, live-synced buy price, spread. All
 * changes are live (parent debounces 150ms before recalc).
 */
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import type { DataStatus } from '@/lib/api';
import { formatNumber } from '@/lib/gold';
import { parseAmount, type CalcCurrency, type CalcMode } from '@/lib/calc';
import { cn } from '@/lib/utils';
import { Panel } from '../ui-atoms/Panel';
import { SegToggle } from '../ui-atoms/SegToggle';
import { Slider } from '../ui/slider';

const CHIPS: Record<CalcCurrency, { initial: number[]; monthly: number[] }> = {
  idr: { initial: [1_000_000, 5_000_000, 10_000_000, 50_000_000], monthly: [250_000, 500_000, 1_000_000, 2_000_000] },
  usd: { initial: [100, 500, 1000, 5000], monthly: [25, 50, 100, 250] },
};

function chipLabel(v: number, currency: CalcCurrency, lang: 'id' | 'en'): string {
  if (currency === 'idr') {
    if (v >= 1_000_000) return `${formatNumber(v / 1_000_000, lang, { decimals: 0 })}jt`;
    return `${formatNumber(v / 1_000, lang, { decimals: 0 })}rb`;
  }
  return v >= 1000 ? `$${v / 1000}k` : `$${v}`;
}

const sliderGold =
  '[&_[data-slot=slider-track]]:bg-bg3 [&_[data-slot=slider-range]]:bg-gold ' +
  '[&_[data-slot=slider-thumb]]:size-[18px] [&_[data-slot=slider-thumb]]:bg-gold ' +
  '[&_[data-slot=slider-thumb]]:border-goldbright [&_[data-slot=slider-thumb]]:shadow-[0_0_10px_rgba(245,185,62,0.45)]';

export interface InputsPanelProps {
  mode: CalcMode;
  onMode: (m: CalcMode) => void;
  currency: CalcCurrency;
  onCurrency: (c: CalcCurrency) => void;
  initialRaw: string;
  onInitial: (s: string) => void;
  monthlyRaw: string;
  onMonthly: (s: string) => void;
  years: number;
  onYears: (y: number) => void;
  growth: number;
  onGrowth: (g: number) => void;
  buyRaw: string;
  onBuy: (s: string) => void;
  spreadRaw: string;
  onSpread: (s: string) => void;
  priceStatus: DataStatus;
  priceSynced: boolean;
  onResync: () => void;
}

function MoneyInput({
  raw,
  onChange,
  currency,
  invalid,
}: {
  raw: string;
  onChange: (s: string) => void;
  currency: CalcCurrency;
  invalid: boolean;
}) {
  return (
    <div
      className={cn(
        'flex items-center rounded-lg border bg-bg3 transition-colors focus-within:ring-2 focus-within:ring-gold/40',
        invalid ? 'border-down' : 'border-hairline',
      )}
    >
      <span className="pl-3 font-mono text-sm text-t3">{currency === 'idr' ? 'Rp' : '$'}</span>
      <input
        inputMode="decimal"
        value={raw}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent px-2 py-2.5 text-right font-mono text-sm tabular text-t1 outline-none"
        aria-invalid={invalid}
      />
    </div>
  );
}

export function InputsPanel(p: InputsPanelProps) {
  const { lang, t } = useI18n();
  const [spinning, setSpinning] = useState(false);

  const initialInvalid = Number.isNaN(parseAmount(p.initialRaw, lang));
  const monthlyInvalid = Number.isNaN(parseAmount(p.monthlyRaw, lang));
  const buyInvalid = Number.isNaN(parseAmount(p.buyRaw, lang));
  const spreadInvalid = Number.isNaN(parseAmount(p.spreadRaw, lang));

  const chips = CHIPS[p.currency];

  const field = 'flex flex-col gap-1.5';
  const label = 'label-micro';
  const help = 'text-[11px] leading-snug text-t3';
  const err = 'text-[11px] text-down';

  return (
    <Panel title={t('calc.params')} className="h-fit">
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
        className="flex flex-col gap-5"
      >
        {/* Mode */}
        <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className={field}>
          <span className={label}>{t('calc.mode')}</span>
          <SegToggle
            ariaLabel="Mode"
            className="w-full [&>button]:flex-1"
            value={p.mode}
            onChange={p.onMode}
            options={[
              { value: 'lump', label: t('calc.mode.lump') },
              { value: 'dca', label: t('calc.mode.dca') },
            ]}
          />
        </motion.div>

        {/* Currency */}
        <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className={field}>
          <span className={label}>{t('calc.currency')}</span>
          <SegToggle
            ariaLabel="Currency"
            className="w-full [&>button]:flex-1"
            value={p.currency}
            onChange={p.onCurrency}
            options={[
              { value: 'idr', label: 'IDR' },
              { value: 'usd', label: 'USD' },
            ]}
          />
        </motion.div>

        {/* Initial */}
        <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className={field}>
          <span className={label}>{t('calc.initial')}</span>
          <MoneyInput raw={p.initialRaw} onChange={p.onInitial} currency={p.currency} invalid={initialInvalid} />
          {initialInvalid && <span className={err}>{t('calc.invalid')}</span>}
          <div className="flex flex-wrap gap-1.5">
            {chips.initial.map((v) => (
              <button
                key={v}
                onClick={() => p.onInitial(String(v))}
                className="cursor-pointer rounded-md border border-hairline bg-bg2 px-2 py-1 font-mono text-[11px] tabular text-t2 transition-colors hover:border-goldline hover:text-gold"
              >
                {chipLabel(v, p.currency, lang)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Monthly (DCA) */}
        {p.mode === 'dca' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(field, 'overflow-hidden')}
          >
            <span className={label}>{t('calc.monthly')}</span>
            <MoneyInput raw={p.monthlyRaw} onChange={p.onMonthly} currency={p.currency} invalid={monthlyInvalid} />
            {monthlyInvalid && <span className={err}>{t('calc.invalid')}</span>}
            <div className="flex flex-wrap gap-1.5">
              {chips.monthly.map((v) => (
                <button
                  key={v}
                  onClick={() => p.onMonthly(String(v))}
                  className="cursor-pointer rounded-md border border-hairline bg-bg2 px-2 py-1 font-mono text-[11px] tabular text-t2 transition-colors hover:border-goldline hover:text-gold"
                >
                  {chipLabel(v, p.currency, lang)}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Duration */}
        <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className={field}>
          <div className="flex items-center justify-between">
            <span className={label}>{t('calc.duration')}</span>
            <span className="font-mono text-lg font-medium tabular text-gold">
              {p.years} {p.years === 1 ? t('calc.yearUnit') : t('calc.yearsUnit')}
            </span>
          </div>
          <Slider
            value={[p.years]}
            min={1}
            max={30}
            step={1}
            onValueChange={([v]) => p.onYears(v)}
            className={sliderGold}
          />
        </motion.div>

        {/* Growth */}
        <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className={field}>
          <div className="flex items-center justify-between">
            <span className={label}>{t('calc.growth')}</span>
            <span className="font-mono text-lg font-medium tabular text-gold">
              {formatNumber(p.growth, lang, { decimals: 1 })}%
            </span>
          </div>
          <Slider
            value={[p.growth]}
            min={0}
            max={20}
            step={0.5}
            onValueChange={([v]) => p.onGrowth(v)}
            className={sliderGold}
          />
          <span className={help}>{t('calc.growthHelp')}</span>
        </motion.div>

        {/* Buy price */}
        <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className={field}>
          <div className="flex items-center justify-between">
            <span className={label}>{t('calc.buyPrice')}</span>
            <button
              onClick={() => {
                p.onResync();
                setSpinning(true);
                setTimeout(() => setSpinning(false), 450);
              }}
              aria-label="Re-sync to live price"
              className="cursor-pointer rounded-md border border-hairline bg-bg2 p-1.5 text-t2 transition-colors hover:border-goldline hover:text-gold"
            >
              <RefreshCw className={cn('h-3.5 w-3.5', spinning && 'spin-once')} />
            </button>
          </div>
          <MoneyInput raw={p.buyRaw} onChange={p.onBuy} currency={p.currency} invalid={buyInvalid} />
          {buyInvalid && <span className={err}>{t('calc.invalid')}</span>}
          <span className={cn(help, 'flex items-center gap-1.5')}>
            <span
              className={cn('h-1.5 w-1.5 rounded-full', p.priceStatus === 'live' && 'status-pulse')}
              style={{
                backgroundColor:
                  p.priceStatus === 'live'
                    ? 'var(--up)'
                    : p.priceStatus === 'cached'
                      ? 'var(--gold)'
                      : 'var(--down)',
              }}
            />
            {p.priceSynced
              ? t('calc.syncedLive')
              : t('calc.manualPrice')}
          </span>
        </motion.div>

        {/* Spread */}
        <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className={field}>
          <span className={label}>{t('calc.spread')}</span>
          <div
            className={cn(
              'flex items-center rounded-lg border bg-bg3 transition-colors focus-within:ring-2 focus-within:ring-gold/40',
              spreadInvalid ? 'border-down' : 'border-hairline',
            )}
          >
            <input
              inputMode="decimal"
              value={p.spreadRaw}
              onChange={(e) => p.onSpread(e.target.value)}
              className="w-full bg-transparent px-3 py-2.5 text-right font-mono text-sm tabular text-t1 outline-none"
              aria-invalid={spreadInvalid}
            />
            <span className="pr-3 font-mono text-sm text-t3">%</span>
          </div>
          {spreadInvalid && <span className={err}>{t('calc.invalid')}</span>}
          <span className={help}>{t('calc.spreadHelp')}</span>
        </motion.div>
      </motion.div>
    </Panel>
  );
}
