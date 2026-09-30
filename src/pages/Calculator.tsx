/**
 * Page: Kalkulator Investasi / Investment Calculator — `/kalkulator`
 * (design calculator.md). Native scroll, no Lenis. Live recalculation,
 * morphing projection chart, yearly breakdown, scenario comparison lab.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { pathFor } from '@/lib/routes';
import { useDisplay } from '@/hooks/useDisplay';
import { useGoldPrice } from '@/hooks/useGoldPrice';
import { useRouteMeta } from '@/hooks/useDocumentMeta';
import { formatNumber } from '@/lib/gold';
import { calcPresets, clamp, simulate, type CalcInputs, type CalcMode } from '@/lib/calc';
import { CURRENCY, convertMoney, formatMoney, pricePer, type Currency } from '@/lib/money';
import { formatRaw, parseAmount, reformatRaw } from '@/lib/number';
import { buildResultText } from '@/lib/share';
import { Panel } from '@/components/ui-atoms/Panel';
import { CalcHeader } from '@/components/calculator/CalcHeader';
import { InputsPanel } from '@/components/calculator/InputsPanel';
import { ResultsPanel } from '@/components/calculator/ResultsPanel';
import { EduCards } from '@/components/calculator/EduCards';
import { ScenarioLab } from '@/components/calculator/ScenarioLab';

const moneyDecimals = (c: Currency) => CURRENCY[c].decimals;

export default function CalculatorPage() {
  const { lang, t } = useI18n();
  useRouteMeta('calculator');
  const display = useDisplay();
  const { gold, rates, status } = useGoldPrice();

  const [mode, setMode] = useState<CalcMode>('lump');
  const [currency, setCurrency] = useState<Currency>(display.currency);
  const presets = calcPresets(currency, rates);
  // Amounts follow the currency's presets (which need today's rate) until the visitor types one.
  const [initialTyped, setInitialRaw] = useState<string | null>(null);
  const [monthlyTyped, setMonthlyRaw] = useState<string | null>(null);
  const initialRaw = initialTyped ?? formatRaw(presets.initial, lang, moneyDecimals(currency));
  const monthlyRaw = monthlyTyped ?? formatRaw(presets.monthly, lang, moneyDecimals(currency));
  const [years, setYears] = useState(10);
  const [growth, setGrowth] = useState(8);
  const [buyRaw, setBuyRaw] = useState('');
  const [spreadRaw, setSpreadRaw] = useState('2');
  const [priceSynced, setPriceSynced] = useState(true);

  const liveGram = pricePer(gold?.price ?? 0, currency, 'g', rates);
  // The toggle pairs a local currency with USD.
  const localCurrency: Currency = currency !== 'USD' ? currency : display.currency !== 'USD' ? display.currency : 'IDR';

  // Sync buy price from live while the user hasn't overridden it.
  useEffect(() => {
    if (priceSynced && liveGram > 0) {
      setBuyRaw(formatRaw(liveGram, lang, moneyDecimals(currency)));
    }
  }, [liveGram, priceSynced, lang, currency]);

  // Language switch: re-express typed values in the new number format
  // (a synced buy price is re-synced by the effect above instead).
  const prevLang = useRef(lang);
  useEffect(() => {
    if (prevLang.current === lang) return;
    const from = prevLang.current;
    prevLang.current = lang;
    const dec = moneyDecimals(currency);
    setInitialRaw((s) => (s === null ? null : reformatRaw(s, from, lang, dec)));
    setMonthlyRaw((s) => (s === null ? null : reformatRaw(s, from, lang, dec)));
    setSpreadRaw((s) => reformatRaw(s, from, lang, 2));
    if (!priceSynced) setBuyRaw((s) => reformatRaw(s, from, lang, dec));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  // Currency toggle: convert amounts at today's rate. Toggling straight
  // back restores the exact values typed before (no rounding drift).
  const lastToggle = useRef<{ from: Currency; before: string[]; after: string[] } | null>(null);
  const switchCurrency = (next: Currency) => {
    if (next === currency) return;
    // A synced buy price follows the live price in the new currency, so only
    // a manual one is converted.
    const before = priceSynced ? [initialRaw, monthlyRaw] : [initialRaw, monthlyRaw, buyRaw];
    const undo = lastToggle.current;
    lastToggle.current = null;
    let after: string[];
    if (
      undo &&
      undo.from === next &&
      undo.after.length === before.length &&
      undo.after.every((raw, i) => raw === before[i])
    ) {
      after = undo.before;
    } else if (convertMoney(1, currency, next, rates) !== null) {
      const conv = (raw: string): string => {
        const n = parseAmount(raw, lang);
        const v = Number.isFinite(n) ? convertMoney(n, currency, next, rates) : null;
        return v === null ? raw : formatRaw(v, lang, moneyDecimals(next));
      };
      after = before.map(conv);
      lastToggle.current = { from: currency, before, after };
    } else {
      // No exchange rate: start from the new currency's presets rather than
      // relabel rupiah amounts as dollars, and re-sync the buy price.
      setCurrency(next);
      setInitialRaw(null);
      setMonthlyRaw(null);
      setPriceSynced(true);
      setBuyRaw('');
      return;
    }
    setCurrency(next);
    setInitialRaw(after[0]);
    setMonthlyRaw(after[1]);
    if (after.length > 2) setBuyRaw(after[2]);
  };

  // Debounced numeric inputs (150ms) → live recalc.
  const [debounced, setDebounced] = useState<CalcInputs | null>(null);
  const inputs: CalcInputs | null = useMemo(() => {
    const initial = parseAmount(initialRaw, lang);
    const monthly = parseAmount(monthlyRaw, lang);
    const buy = parseAmount(buyRaw, lang);
    const spread = parseAmount(spreadRaw, lang);
    if ([initial, monthly, buy, spread].some(Number.isNaN)) return null;
    return {
      mode,
      initial: Math.max(0, initial),
      monthly: Math.max(0, monthly),
      years: clamp(years, 1, 30),
      growthPct: clamp(growth, 0, 20),
      buyPrice: Math.max(0, buy),
      spreadPct: clamp(spread, 0, 100),
    };
  }, [mode, initialRaw, monthlyRaw, buyRaw, spreadRaw, years, growth, lang]);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(inputs), 150);
    return () => clearTimeout(id);
  }, [inputs]);

  const result = useMemo(() => (debounced ? simulate(debounced) : null), [debounced]);

  const summaryText = useMemo(() => {
    if (!debounced || !result) return '';
    const money = (v: number) => formatMoney(v, currency, lang);
    const modeLabel = debounced.mode === 'lump' ? t('calc.mode.lump') : t('calc.mode.dca');
    const lines = [
      `EmasKuy — ${t('calc.results')}`,
      `${t('calc.mode')}: ${modeLabel} (${currency})`,
      `${t('calc.initial')}: ${money(debounced.initial)}`,
      ...(debounced.mode === 'dca'
        ? [`${t('calc.monthly')}: ${money(debounced.monthly)}`]
        : []),
      `${t('calc.duration')}: ${debounced.years} ${t('calc.yearsUnit')} · ${t('calc.growth')}: ${formatNumber(debounced.growthPct, lang, { decimals: 1 })}%`,
      `${t('calc.buyPrice')}: ${money(debounced.buyPrice)}/gr`,
      `${t('calc.totalInvested')}: ${money(result.totalInvested)}`,
      `${t('calc.finalValue')}: ${money(result.finalValue)} (${formatNumber(result.profitPct, lang, { decimals: 1 })}%)`,
      `${t('calc.goldEq')}: ${formatNumber(result.grams, lang, { decimals: 2 })} gr`,
      t('calc.disclaimer'),
    ];
    return lines.join('\n');
  }, [debounced, result, currency, lang, t]);

  const shareText = useMemo(() => {
    if (!debounced || !result) return '';
    const money = (v: number) => formatMoney(v, currency, lang);
    const mode = debounced.mode === 'lump' ? t('calc.mode.lump') : t('calc.mode.dca');
    return buildResultText(
      t('calc.label'),
      [
        [t('calc.mode'), debounced.mode === 'dca' ? `${mode}, ${money(debounced.monthly)}${t('calc.perMonth')}` : mode],
        [t('calc.initial'), money(debounced.initial)],
        [t('calc.duration'), `${debounced.years} ${t('calc.yearsUnit')} · ${formatNumber(debounced.growthPct, lang, { decimals: 1 })}%${t('calc.perYear')}`],
        [t('calc.finalValue'), `${money(result.finalValue)} (${formatNumber(result.profitPct, lang, { decimals: 1 })}%)`, true],
        [t('calc.goldEq'), `${formatNumber(result.grams, lang, { decimals: 2 })} gr`],
      ],
      pathFor('calculator', lang),
      t,
    );
  }, [debounced, result, currency, lang, t]);

  const reset = () => {
    const dec = moneyDecimals(currency);
    setMode('lump');
    setInitialRaw(null);
    setMonthlyRaw(null);
    setYears(10);
    setGrowth(8);
    setSpreadRaw('2');
    setPriceSynced(true);
    if (liveGram > 0) setBuyRaw(formatRaw(liveGram, lang, dec));
  };

  const resync = () => {
    setPriceSynced(true);
    if (liveGram > 0) setBuyRaw(formatRaw(liveGram, lang, moneyDecimals(currency)));
  };

  return (
    <>
      <CalcHeader title={t('calc.title')} subtitle={t('calc.subtitle')} />

      {/* Section 2 — app */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="grid grid-cols-1 gap-4 py-4 lg:grid-cols-12"
      >
        {/* mobile: results first */}
        <div className="order-1 min-w-0 lg:order-2 lg:col-span-7">
          {result ? (
            <ResultsPanel
              result={result}
              currency={currency}
              years={debounced?.years ?? years}
              summaryText={summaryText}
              shareText={shareText}
              onReset={reset}
            />
          ) : (
            // Placeholder until the live price arrives, so the results don't push the form down.
            <div aria-hidden className="skeleton-shimmer h-[900px] rounded-[10px] lg:h-[1000px]" />
          )}
        </div>
        <div className="order-2 min-w-0 lg:order-1 lg:col-span-5">
          <InputsPanel
            mode={mode}
            onMode={setMode}
            currency={currency}
            currencies={[localCurrency, 'USD']}
            onCurrency={switchCurrency}
            chips={presets.chips}
            initialRaw={initialRaw}
            onInitial={setInitialRaw}
            monthlyRaw={monthlyRaw}
            onMonthly={setMonthlyRaw}
            years={years}
            onYears={setYears}
            growth={growth}
            onGrowth={setGrowth}
            buyRaw={buyRaw}
            onBuy={(s) => {
              setBuyRaw(s);
              setPriceSynced(false);
            }}
            spreadRaw={spreadRaw}
            onSpread={setSpreadRaw}
            priceStatus={status}
            priceSynced={priceSynced}
            onResync={resync}
          />
        </div>
      </motion.div>

      {/* Section 3 — DCA explainer */}
      <div className="py-10">
        <EduCards />
      </div>

      {/* Section 4 — scenario comparison */}
      <div className="mb-8 py-10">
        {debounced && <ScenarioLab base={debounced} currency={currency} />}
      </div>

      {/* Section 5 — disclaimer */}
      <Panel className="mb-12">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-t3" />
          <p className="text-sm leading-[1.5] text-t3">{t('calc.disclaimer')}</p>
        </div>
      </Panel>
    </>
  );
}
