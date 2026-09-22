/**
 * ScenarioLab — Section 4: compare 3 growth presets (5% / 8% / 12%) using
 * the user's current amounts, duration and buy price. Preset chips toggle
 * lines on the comparison chart; a compact table shows final values, the
 * best one gets a gold left border.
 */
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { simulate, fmtMoney, type CalcCurrency, type CalcInputs } from '@/lib/calc';
import { cn } from '@/lib/utils';
import { Panel } from '../ui-atoms/Panel';
import { useCountUp } from '../ui-atoms/StatCard';
import { ScenarioChart } from './ScenarioChart';

const PRESETS = [
  { id: 'conservative', growth: 5, color: 'var(--info)', labelKey: 'calc.compare.conservative' },
  { id: 'moderate', growth: 8, color: 'var(--gold)', labelKey: 'calc.compare.moderate' },
  { id: 'aggressive', growth: 12, color: 'var(--up)', labelKey: 'calc.compare.aggressive' },
] as const;

function FinalValue({ v, currency }: { v: number; currency: CalcCurrency }) {
  const { lang } = useI18n();
  const shown = useCountUp(v, 700);
  return <>{fmtMoney(shown, currency, lang)}</>;
}

export function ScenarioLab({ base, currency }: { base: CalcInputs; currency: CalcCurrency }) {
  const { t } = useI18n();
  const [active, setActive] = useState<string[]>(['moderate']);

  const rows = useMemo(
    () =>
      PRESETS.map((p) => {
        const res = simulate({ ...base, growthPct: p.growth });
        return { ...p, res };
      }),
    [base],
  );

  const chartSeries = useMemo(
    () =>
      rows
        .filter((r) => active.includes(r.id))
        .map((r) => ({
          id: r.id,
          label: t(r.labelKey),
          color: r.color,
          values: r.res.monthly.filter((_, m) => m % 12 === 0).map((p) => p.value),
        })),
    [rows, active, t],
  );

  const bestId = useMemo(() => {
    let best = rows[0];
    for (const r of rows) if (r.res.finalValue > best.res.finalValue) best = r;
    return best.id;
  }, [rows]);

  const toggle = (id: string) =>
    setActive((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));

  return (
    <Panel title={t('calc.compare.title')}>
      <div className="flex flex-col gap-4">
        {/* preset chips / legend toggles */}
        <div className="flex flex-wrap gap-2">
          {rows.map((r) => {
            const on = active.includes(r.id);
            return (
              <button
                key={r.id}
                onClick={() => toggle(r.id)}
                aria-pressed={on}
                className={cn(
                  'flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-xs transition-all duration-200',
                  on
                    ? 'border-goldline bg-bg2 text-t1'
                    : 'border-hairline bg-bg1 text-t3 opacity-60 hover:opacity-100',
                )}
              >
                <span
                  className="h-2 w-2 rounded-full transition-opacity duration-200"
                  style={{ backgroundColor: r.color, opacity: on ? 1 : 0.3 }}
                />
                {t(r.labelKey)}
              </button>
            );
          })}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
          <ScenarioChart series={chartSeries} years={base.years} currency={currency} />
        </motion.div>

        {/* compact table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px]">
            <thead>
              <tr className="border-b border-hairline">
                <th className="label-micro py-1.5 text-left">{t('calc.compare.scenario')}</th>
                <th className="label-micro py-1.5 text-right">{t('calc.compare.final')}</th>
                <th className="label-micro py-1.5 text-right">{t('calc.compare.profit')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className={cn(
                    'border-b border-hairline/60 last:border-0',
                    r.id === bestId && 'border-l-2 border-l-gold',
                  )}
                >
                  <td className="py-2.5 pl-2">
                    <span className="flex items-center gap-2 font-display text-sm font-medium text-t1">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: r.color }} />
                      {t(r.labelKey)}
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-mono text-[13px] tabular text-t1">
                    <FinalValue v={r.res.finalValue} currency={currency} />
                  </td>
                  <td
                    className="py-2.5 text-right font-mono text-[13px] tabular"
                    style={{ color: r.res.profit >= 0 ? 'var(--up)' : 'var(--down)' }}
                  >
                    {r.res.profit >= 0 ? '+' : ''}
                    <FinalValue v={r.res.profit} currency={currency} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Panel>
  );
}
