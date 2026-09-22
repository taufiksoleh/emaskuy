/**
 * ResultsPanel — hero result (gold gradient, count-tween), stat trio,
 * morphing projection chart, collapsible yearly breakdown, copy/reset.
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Copy, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useI18n } from '@/lib/i18n';
import { formatNumber, gramsToOz } from '@/lib/gold';
import { fmtMoney, type CalcCurrency, type CalcResult } from '@/lib/calc';
import { cn } from '@/lib/utils';
import { Panel } from '../ui-atoms/Panel';
import { StatCard, useCountUp } from '../ui-atoms/StatCard';
import { DeltaChip } from '../ui-atoms/DeltaChip';
import { ProjectionChart } from './ProjectionChart';

export interface ResultsPanelProps {
  result: CalcResult;
  currency: CalcCurrency;
  years: number;
  summaryText: string;
  onReset: () => void;
}

function YearTable({ result, currency }: { result: CalcResult; currency: CalcCurrency }) {
  const { lang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const rows = result.yearly;
  const collapsedRows = rows.length <= 7 ? rows : [...rows.slice(0, 3), ...rows.slice(-3)];

  const renderRow = (r: (typeof rows)[number], i: number) => (
    <motion.tr
      key={r.year}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: open ? i * 0.03 : 0, duration: 0.25 }}
      className="border-b border-hairline/60 last:border-0"
    >
      <td className="py-2 pr-3 font-mono text-[13px] tabular text-t3">{r.year}</td>
      <td className="py-2 px-3 text-right font-mono text-[13px] tabular text-t2">
        {fmtMoney(r.invested, currency, lang)}
      </td>
      <td className="py-2 px-3 text-right font-mono text-[13px] tabular text-t1">
        {fmtMoney(r.value, currency, lang)}
      </td>
      <td
        className="py-2 pl-3 text-right font-mono text-[13px] tabular"
        style={{ color: r.profit >= 0 ? 'var(--up)' : 'var(--down)' }}
      >
        {r.profit >= 0 ? '+' : ''}
        {fmtMoney(r.profit, currency, lang)}
      </td>
    </motion.tr>
  );

  return (
    <div className="rounded-lg border border-hairline">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left"
        aria-expanded={open}
      >
        <span className="font-display text-sm font-semibold text-t1">{t('calc.breakdown')}</span>
        <ChevronDown
          className={cn('h-4 w-4 text-t2 transition-transform duration-200', open && 'rotate-180')}
        />
      </button>
      <div className="px-4 pb-3">
        <table className="w-full">
          <thead>
            <tr className="border-b border-hairline">
              <th className="label-micro py-1.5 pr-3 text-left">{t('calc.col.year')}</th>
              <th className="label-micro py-1.5 px-3 text-right">{t('calc.col.invested')}</th>
              <th className="label-micro py-1.5 px-3 text-right">{t('calc.col.value')}</th>
              <th className="label-micro py-1.5 pl-3 text-right">{t('calc.col.profit')}</th>
            </tr>
          </thead>
          <tbody>
            {open ? (
              rows.map(renderRow)
            ) : rows.length <= 7 ? (
              collapsedRows.map(renderRow)
            ) : (
              <>
                {rows.slice(0, 3).map(renderRow)}
                <tr>
                  <td colSpan={4} className="py-1 text-center font-mono text-xs text-t3">
                    ⋯
                  </td>
                </tr>
                {rows.slice(-3).map(renderRow)}
              </>
            )}
          </tbody>
        </table>
        {!open && rows.length > 7 && (
          <div className="pointer-events-none -mt-8 h-8 bg-gradient-to-t from-bg1 to-transparent" />
        )}
      </div>
    </div>
  );
}

function ProfitCard({ label, value, format }: { label: string; value: number; format: (v: number) => string }) {
  const shown = useCountUp(value, 900);
  return (
    <div className="rounded-[10px] border border-hairline bg-bg1 p-4 transition-[border-color,background-color] duration-150 hover:border-goldline hover:bg-bg2 md:p-5">
      <div className="label-micro">{label}</div>
      <div
        className="mt-2 font-mono text-[24px] font-semibold leading-[1.1] tabular md:text-[28px]"
        style={{ color: value >= 0 ? 'var(--up)' : 'var(--down)' }}
      >
        {format(shown)}
      </div>
    </div>
  );
}

export function ResultsPanel({ result, currency, years, summaryText, onReset }: ResultsPanelProps) {
  const { lang, t } = useI18n();
  const hero = useCountUp(result.finalValue, 400);
  const money = (v: number) => fmtMoney(v, currency, lang);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      toast.success(t('calc.copied'));
    } catch {
      toast.success(t('calc.copied'));
    }
  };

  return (
    <Panel glow title={t('calc.results')}>
      <div className="flex flex-col gap-6">
        {/* Hero result */}
        <div>
          <div className="label-micro">{t('calc.finalValue')}</div>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <span className="text-gold-gradient font-mono text-[40px] font-bold leading-none tabular md:text-[56px]">
              {money(hero)}
            </span>
            <DeltaChip value={result.profitPct} size="lg" />
          </div>
        </div>

        {/* Stat trio */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard label={t('calc.totalInvested')} value={result.totalInvested} format={money} />
          <ProfitCard label={t('calc.estProfit')} value={result.profit} format={money} />
          <StatCard
            label={t('calc.goldEq')}
            value={result.grams}
            format={(v) => `${formatNumber(v, lang, { decimals: 2 })} gr`}
            sub={`${formatNumber(gramsToOz(result.grams), lang, { decimals: 2 })} oz`}
          />
        </div>

        {/* Chart */}
        <div>
          <div className="label-micro mb-2">{t('calc.chartTitle')}</div>
          <ProjectionChart points={result.monthly} years={years} currency={currency} />
        </div>

        {/* Yearly breakdown */}
        <YearTable result={result} currency={currency} />

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={copy}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-hairline bg-bg2 px-4 py-2 font-display text-sm font-medium text-t1 transition-all duration-150 hover:border-goldline hover:text-gold active:scale-[0.97]"
          >
            <Copy className="h-4 w-4" />
            {t('calc.copy')}
          </button>
          <button
            onClick={onReset}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-hairline bg-bg2 px-4 py-2 font-display text-sm font-medium text-t1 transition-all duration-150 hover:border-goldline hover:text-gold active:scale-[0.97]"
          >
            <RotateCcw className="h-4 w-4" />
            {t('calc.reset')}
          </button>
        </div>
      </div>
    </Panel>
  );
}

export const resultsPanelMotion = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] as const } },
};
