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
import { type CalcMode, type CalcPresets } from '@/lib/calc';
import { CURRENCY, type Currency } from '@/lib/money';
import { formatRaw, parseAmount } from '@/lib/number';
import { cn } from '@/lib/utils';
import { MoneyInput } from '../ui-atoms/MoneyInput';
import { Panel } from '../ui-atoms/Panel';
import { SegToggle } from '../ui-atoms/SegToggle';
import { Slider } from '../ui/slider';

function chipLabel(v: number, currency: Currency, lang: 'id' | 'en'): string {
  if (currency === 'IDR') {
    if (v >= 1_000_000) return `${formatNumber(v / 1_000_000, lang, { decimals: 0 })}jt`;
    return `${formatNumber(v / 1_000, lang, { decimals: 0 })}rb`;
  }
  const [div, suffix] = v >= 1e6 ? [1e6, 'M'] : v >= 1e3 ? [1e3, 'k'] : [1, ''];
  return `${CURRENCY[currency].symbol}${formatNumber(v / div, lang, { decimals: 1, minDecimals: 0 })}${suffix}`;
}

const sliderGold =
  '[&_[data-slot=slider-track]]:bg-bg3 [&_[data-slot=slider-range]]:bg-gold ' +
  '[&_[data-slot=slider-thumb]]:size-[18px] [&_[data-slot=slider-thumb]]:bg-gold ' +
  '[&_[data-slot=slider-thumb]]:border-goldbright [&_[data-slot=slider-thumb]]:shadow-[0_0_10px_rgba(245,185,62,0.45)]';

export interface InputsPanelProps {
  mode: CalcMode;
  onMode: (m: CalcMode) => void;
  currency: Currency;
  /** The two currencies the toggle switches between */
  currencies: [Currency, Currency];
  onCurrency: (c: Currency) => void;
  chips: CalcPresets['chips'];
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

export function InputsPanel(p: InputsPanelProps) {
  const { lang, t } = useI18n();
  const [spinning, setSpinning] = useState(false);

  const initialInvalid = Number.isNaN(parseAmount(p.initialRaw, lang));
  const monthlyInvalid = Number.isNaN(parseAmount(p.monthlyRaw, lang));
  const buyInvalid = Number.isNaN(parseAmount(p.buyRaw, lang));
  const spreadInvalid = Number.isNaN(parseAmount(p.spreadRaw, lang));

  const chips = p.chips;
  const symbol = CURRENCY[p.currency].symbol;
  const moneyDecimals = CURRENCY[p.currency].decimals;

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
            ariaLabel={t('calc.mode')}
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
            ariaLabel={t('calc.currency')}
            className="w-full [&>button]:flex-1"
            value={p.currency}
            onChange={p.onCurrency}
            options={[
              { value: p.currencies[0], label: p.currencies[0] },
              { value: p.currencies[1], label: p.currencies[1] },
            ]}
          />
        </motion.div>

        {/* Initial */}
        <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className={field}>
          <label className={label} htmlFor="calc-initial">{t('calc.initial')}</label>
          <MoneyInput
            id="calc-initial"
            value={p.initialRaw}
            onChange={p.onInitial}
            prefix={symbol}
            decimals={moneyDecimals}
            invalid={initialInvalid}
          />
          {initialInvalid && <span className={err}>{t('calc.invalid')}</span>}
          <div className="flex flex-wrap gap-1.5">
            {chips.initial.map((v) => (
              <button
                key={v}
                onClick={() => p.onInitial(formatRaw(v, lang, moneyDecimals))}
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
            <label className={label} htmlFor="calc-monthly">{t('calc.monthly')}</label>
            <MoneyInput
              id="calc-monthly"
              value={p.monthlyRaw}
              onChange={p.onMonthly}
              prefix={symbol}
              decimals={moneyDecimals}
              invalid={monthlyInvalid}
            />
            {monthlyInvalid && <span className={err}>{t('calc.invalid')}</span>}
            <div className="flex flex-wrap gap-1.5">
              {chips.monthly.map((v) => (
                <button
                  key={v}
                  onClick={() => p.onMonthly(formatRaw(v, lang, moneyDecimals))}
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
            <label className={label} htmlFor="calc-buy">{t('calc.buyPrice')}</label>
            <button
              onClick={() => {
                p.onResync();
                setSpinning(true);
                setTimeout(() => setSpinning(false), 450);
              }}
              aria-label={t('calc.resync')}
              className="cursor-pointer rounded-md border border-hairline bg-bg2 p-1.5 text-t2 transition-colors hover:border-goldline hover:text-gold"
            >
              <RefreshCw className={cn('h-3.5 w-3.5', spinning && 'spin-once')} />
            </button>
          </div>
          <MoneyInput
            id="calc-buy"
            value={p.buyRaw}
            onChange={p.onBuy}
            prefix={symbol}
            decimals={moneyDecimals}
            invalid={buyInvalid}
          />
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
          <label className={label} htmlFor="calc-spread">{t('calc.spread')}</label>
          <MoneyInput
            id="calc-spread"
            value={p.spreadRaw}
            onChange={p.onSpread}
            suffix="%"
            invalid={spreadInvalid}
          />
          {spreadInvalid && <span className={err}>{t('calc.invalid')}</span>}
          <span className={help}>{t('calc.spreadHelp')}</span>
        </motion.div>
      </motion.div>
    </Panel>
  );
}
