/**
 * Page: Kalkulator Target Emas — `/kalkulator/target`.
 * Monthly amount needed to own a number of grams by a date (reverse DCA),
 * with the same projection chart as the investment calculator.
 */
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Info } from 'lucide-react';
import { registerStrings, useI18n } from '@/lib/i18n';
import { pathFor } from '@/lib/routes';
import { useRouteMeta } from '@/hooks/useDocumentMeta';
import { useCalcCurrency, useGramPrice } from '@/hooks/useGramPrice';
import { simulate } from '@/lib/calc';
import { CURRENCY, formatMoney } from '@/lib/money';
import { formatNumber } from '@/lib/gold';
import type { PriceBasis } from '@/lib/gramPrice';
import { formatRaw, parseAmount } from '@/lib/number';
import { MAX_TARGET_MONTHS, computeTarget } from '@/lib/target';
import { buildResultText } from '@/lib/share';
import { WhatsAppButton } from '@/components/share/WhatsAppButton';
import { cn } from '@/lib/utils';
import { Panel } from '@/components/ui-atoms/Panel';
import { MoneyInput } from '@/components/ui-atoms/MoneyInput';
import { StatCard } from '@/components/ui-atoms/StatCard';
import { Slider } from '@/components/ui/slider';
import { CalcHeader } from '@/components/calculator/CalcHeader';
import { Field } from '@/components/calculator/Field';
import { PriceBasisField } from '@/components/calculator/PriceBasisField';
import { ProjectionChart } from '@/components/calculator/ProjectionChart';

registerStrings({
  'target.title': { id: 'Kalkulator Target Emas', en: 'Gold Savings Target' },
  'target.subtitle': {
    id: 'Ingin punya sekian gram emas untuk mahar, umrah, atau dana pendidikan? Hitung berapa yang perlu ditabung tiap bulan.',
    en: 'Want a certain amount of gold for a dowry, umrah or an education fund? Find out how much to save each month.',
  },
  'target.params': { id: 'Target Anda', en: 'Your target' },
  'target.presets': { id: 'Contoh target', en: 'Examples' },
  'target.preset.mahar': { id: 'Mahar', en: 'Dowry (mahar)' },
  'target.preset.umrah': { id: 'Umrah', en: 'Umrah' },
  'target.preset.emergency': { id: 'Dana darurat', en: 'Emergency fund' },
  'target.preset.education': { id: 'Pendidikan', en: 'Education' },
  'target.grams': { id: 'Target emas', en: 'Target' },
  'target.months': { id: 'Jangka waktu', en: 'Time frame' },
  'target.monthsUnit': { id: 'bulan', en: 'months' },
  'target.initial': { id: 'Tabungan yang sudah ada', en: 'Savings already set aside' },
  'target.growth': { id: 'Asumsi kenaikan harga per tahun', en: 'Assumed price growth per year' },
  'target.growthHelp': {
    id: 'Makin tinggi asumsinya, makin besar setoran yang dibutuhkan karena emas makin mahal.',
    en: 'A higher assumption means a bigger monthly amount, because gold gets dearer.',
  },
  'target.result': { id: 'Rencana Tabungan', en: 'Savings Plan' },
  'target.monthly': { id: 'Perlu ditabung per bulan', en: 'Save each month' },
  'target.alreadyMet': { id: 'Tabungan Anda sudah cukup untuk target ini.', en: 'Your savings already cover this target.' },
  'target.totalPaid': { id: 'Total setoran', en: 'Total paid in' },
  'target.futurePrice': { id: 'Perkiraan harga per gram nanti', en: 'Projected price per gram' },
  'target.chart': { id: 'Nilai emas vs total setoran', en: 'Gold value vs money paid in' },
  'target.note': {
    id: 'Harga emas tidak naik dengan pasti setiap tahun. Tinjau ulang rencana secara berkala dengan harga terbaru.',
    en: 'Gold prices do not rise at a fixed rate. Revisit your plan regularly with the latest price.',
  },
});

const PRESETS = [
  { key: 'mahar', grams: 10, months: 12 },
  { key: 'umrah', grams: 15, months: 36 },
  { key: 'emergency', grams: 25, months: 24 },
  { key: 'education', grams: 50, months: 60 },
] as const;

const sliderGold =
  '[&_[data-slot=slider-track]]:bg-bg3 [&_[data-slot=slider-range]]:bg-gold ' +
  '[&_[data-slot=slider-thumb]]:size-[18px] [&_[data-slot=slider-thumb]]:bg-gold ' +
  '[&_[data-slot=slider-thumb]]:border-goldbright';

export default function TargetPage() {
  const { lang, t } = useI18n();
  useRouteMeta('calcTarget');
  const currency = useCalcCurrency();

  const [gramsRaw, setGramsRaw] = useState(() => formatRaw(10, lang, 2));
  const [months, setMonths] = useState(12);
  const [initialRaw, setInitialRaw] = useState('');
  const [growth, setGrowth] = useState(8);
  const [spreadRaw, setSpreadRaw] = useState('2');
  const [basis, setBasis] = useState<PriceBasis>('spot');
  const [manualRaw, setManualRaw] = useState('');

  const num = (raw: string) => {
    const n = parseAmount(raw, lang);
    return Number.isFinite(n) && n > 0 ? n : 0;
  };
  const targetGrams = num(gramsRaw);
  const initial = num(initialRaw);
  const spread = num(spreadRaw);
  const { perGram, status } = useGramPrice(basis, currency, num(manualRaw));

  const plan = computeTarget({
    targetGrams,
    months,
    growthPct: growth,
    spreadPct: spread,
    pricePerGram: perGram ?? 0,
    initial,
  });
  const projection = useMemo(
    () =>
      perGram !== null && targetGrams > 0
        ? simulate({
            mode: 'dca',
            initial,
            monthly: plan.monthly,
            years: 1,
            months,
            growthPct: growth,
            buyPrice: perGram,
            spreadPct: spread,
          })
        : null,
    [perGram, targetGrams, initial, plan.monthly, months, growth, spread],
  );

  const money = (v: number) => (perGram !== null ? formatMoney(v, currency, lang) : '—');
  const activePreset = PRESETS.find((p) => p.grams === targetGrams && p.months === months)?.key;

  return (
    <>
      <CalcHeader title={t('target.title')} subtitle={t('target.subtitle')} />
      <div className="grid grid-cols-1 gap-4 pb-12 lg:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="order-1 min-w-0 lg:order-2 lg:col-span-7"
        >
          <Panel glow title={t('target.result')}>
            <div className="flex flex-col gap-5">
              {plan.alreadyMet ? (
                <p className="flex items-center gap-2 font-display text-lg font-semibold text-up">
                  <CheckCircle2 className="h-5 w-5" aria-hidden />
                  {t('target.alreadyMet')}
                </p>
              ) : (
                <div>
                  <div className="label-micro">{t('target.monthly')}</div>
                  <div className="text-gold-gradient mt-1 break-all font-mono text-[32px] font-bold leading-none tabular md:text-[48px]">
                    {money(plan.monthly)}
                  </div>
                  <p className="mt-2 font-mono text-sm tabular text-t2">
                    × {months} {t('target.monthsUnit')}
                  </p>
                </div>
              )}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <StatCard
                  label={t('target.totalPaid')}
                  value={plan.totalPaid}
                  format={money}
                  sub={`→ ${formatNumber(targetGrams, lang, { decimals: 2, minDecimals: 0 })} gr`}
                />
                <StatCard label={t('target.futurePrice')} value={plan.futurePrice} format={money} />
              </div>
              {projection && (
                <div>
                  <div className="label-micro mb-2">{t('target.chart')}</div>
                  <ProjectionChart points={projection.monthly} years={months / 12} currency={currency} />
                </div>
              )}
              <p className="flex gap-2 text-[12px] leading-relaxed text-t3">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                {t('target.note')}
              </p>
              {perGram !== null && targetGrams > 0 && (
                <WhatsAppButton
                  className="self-start"
                  text={buildResultText(
                    t('target.title'),
                    [
                      [t('target.grams'), `${formatNumber(targetGrams, lang, { decimals: 2, minDecimals: 0 })} gr · ${months} ${t('target.monthsUnit')}`],
                      [t('target.monthly'), money(plan.monthly), true],
                      [t('target.totalPaid'), money(plan.totalPaid)],
                    ],
                    pathFor('calcTarget', lang),
                    t,
                  )}
                />
              )}
            </div>
          </Panel>
        </motion.div>

        <div className="order-2 min-w-0 lg:order-1 lg:col-span-5">
          <Panel title={t('target.params')} className="h-fit">
            <div className="flex flex-col gap-5">
              <Field label={t('target.presets')}>
                <div className="flex flex-wrap gap-1.5">
                  {PRESETS.map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => {
                        setGramsRaw(formatRaw(p.grams, lang, 2));
                        setMonths(p.months);
                      }}
                      aria-pressed={activePreset === p.key}
                      className={cn(
                        'cursor-pointer rounded-md border px-2.5 py-1 text-[12px] transition-colors',
                        activePreset === p.key
                          ? 'border-goldline bg-bg2 text-gold'
                          : 'border-hairline bg-bg2 text-t2 hover:border-goldline hover:text-gold',
                      )}
                    >
                      {t(`target.preset.${p.key}`)} · {p.grams} gr
                    </button>
                  ))}
                </div>
              </Field>
              <Field label={t('target.grams')} htmlFor="target-grams">
                <MoneyInput id="target-grams" value={gramsRaw} onChange={setGramsRaw} suffix="gr" decimals={2} />
              </Field>
              <Field
                label={t('target.months')}
                aside={
                  <span className="font-mono text-lg font-medium tabular text-gold">
                    {months} {t('target.monthsUnit')}
                  </span>
                }
              >
                <Slider
                  value={[months]}
                  min={1}
                  max={Math.min(120, MAX_TARGET_MONTHS)}
                  step={1}
                  onValueChange={([v]) => setMonths(v)}
                  className={sliderGold}
                />
              </Field>
              <Field label={t('target.initial')} htmlFor="target-initial">
                <MoneyInput
                  id="target-initial"
                  value={initialRaw}
                  onChange={setInitialRaw}
                  prefix={CURRENCY[currency].symbol}
                  decimals={CURRENCY[currency].decimals}
                  placeholder="0"
                />
              </Field>
              <Field
                label={t('target.growth')}
                help={t('target.growthHelp')}
                aside={
                  <span className="font-mono text-lg font-medium tabular text-gold">
                    {formatNumber(growth, lang, { decimals: 1 })}%
                  </span>
                }
              >
                <Slider
                  value={[growth]}
                  min={0}
                  max={20}
                  step={0.5}
                  onValueChange={([v]) => setGrowth(v)}
                  className={sliderGold}
                />
              </Field>
              <Field label={t('calc.spread')} htmlFor="target-spread" help={t('calc.spreadHelp')}>
                <MoneyInput id="target-spread" value={spreadRaw} onChange={setSpreadRaw} suffix="%" decimals={2} />
              </Field>
              <PriceBasisField
                basis={basis}
                onBasis={setBasis}
                manualRaw={manualRaw}
                onManual={setManualRaw}
                currency={currency}
                perGram={perGram}
                status={status}
              />
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
