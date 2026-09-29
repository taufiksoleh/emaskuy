/**
 * Page: Kalkulator Investasi / Investment Calculator — `/kalkulator`
 * (design calculator.md). Native scroll, no Lenis. Live recalculation,
 * morphing projection chart, yearly breakdown, scenario comparison lab.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useGoldPrice } from '@/hooks/useGoldPrice';
import { TROY_OZ_GRAMS, xauUsdToIdrGram, formatNumber, formatUnitPrice, convertPrice } from '@/lib/gold';
import {
  clamp,
  fmtMoney,
  parseAmount,
  simulate,
  type CalcCurrency,
  type CalcInputs,
  type CalcMode,
} from '@/lib/calc';
import { Panel } from '@/components/ui-atoms/Panel';
import { Badge } from '@/components/ui-atoms/Badge';
import { InputsPanel } from '@/components/calculator/InputsPanel';
import { ResultsPanel } from '@/components/calculator/ResultsPanel';
import { EduCards } from '@/components/calculator/EduCards';
import { ScenarioLab } from '@/components/calculator/ScenarioLab';

const DEFAULTS: Record<CalcCurrency, { initial: number; monthly: number }> = {
  idr: { initial: 10_000_000, monthly: 1_000_000 },
  usd: { initial: 500, monthly: 100 },
};

/** Live buy price per gram in the given currency (0 when unavailable). */
function liveGramPrice(
  xauUsd: number | undefined,
  usdIdr: number,
  currency: CalcCurrency,
): number {
  if (!xauUsd || xauUsd <= 0) return 0;
  if (currency === 'usd') return xauUsd / TROY_OZ_GRAMS;
  if (usdIdr <= 0) return 0;
  return xauUsdToIdrGram(xauUsd, usdIdr);
}

export default function CalculatorPage() {
  const { lang, t, unit } = useI18n();
  const { gold, usdIdr, status } = useGoldPrice();

  const [mode, setMode] = useState<CalcMode>('lump');
  const [currency, setCurrency] = useState<CalcCurrency>(unit === 'idr-gr' ? 'idr' : 'usd');
  const [initialRaw, setInitialRaw] = useState(String(DEFAULTS[currency].initial));
  const [monthlyRaw, setMonthlyRaw] = useState(String(DEFAULTS[currency].monthly));
  const [years, setYears] = useState(10);
  const [growth, setGrowth] = useState(8);
  const [buyRaw, setBuyRaw] = useState('');
  const [spreadRaw, setSpreadRaw] = useState('2');
  const [priceSynced, setPriceSynced] = useState(true);

  const livePrice = gold?.price ?? 0;
  const liveGram = liveGramPrice(livePrice, usdIdr, currency);

  // Sync buy price from live while the user hasn't overridden it.
  useEffect(() => {
    if (priceSynced && liveGram > 0) {
      setBuyRaw(
        formatNumber(liveGram, lang, {
          decimals: currency === 'idr' ? 0 : 2,
          minDecimals: 0,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveGram, priceSynced]);

  // Currency toggle: convert amounts via the USD/IDR rate when possible.
  const prevCurrency = useRef(currency);
  useEffect(() => {
    if (prevCurrency.current === currency) return;
    const from = prevCurrency.current;
    prevCurrency.current = currency;
    const rate = usdIdr > 0 ? usdIdr : null;
    const conv = (raw: string): string => {
      const n = parseAmount(raw, lang);
      if (!Number.isFinite(n)) return raw;
      let v = n;
      if (rate) v = from === 'idr' ? n / rate : n * rate;
      return String(Math.round(v * 100) / 100);
    };
    setInitialRaw((s) => conv(s));
    setMonthlyRaw((s) => conv(s));
    if (!priceSynced && liveGram > 0) {
      // manual price: convert numerically
      setBuyRaw((s) => conv(s));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

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
    const money = (v: number) => fmtMoney(v, currency, lang);
    const modeLabel = debounced.mode === 'lump' ? t('calc.mode.lump') : t('calc.mode.dca');
    const lines = [
      `EmasKuy — ${t('calc.results')}`,
      `${t('calc.mode')}: ${modeLabel} (${currency.toUpperCase()})`,
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

  const reset = () => {
    setMode('lump');
    setInitialRaw(String(DEFAULTS[currency].initial));
    setMonthlyRaw(String(DEFAULTS[currency].monthly));
    setYears(10);
    setGrowth(8);
    setSpreadRaw('2');
    setPriceSynced(true);
    if (liveGram > 0) setBuyRaw(String(Math.round(liveGram * 100) / 100));
  };

  const resync = () => {
    setPriceSynced(true);
    if (liveGram > 0) setBuyRaw(String(Math.round(liveGram * 100) / 100));
  };

  const statusVariant = status === 'live' ? 'live' : status === 'cached' ? 'cached' : 'offline';

  return (
    <div className="mx-auto max-w-[1440px] px-4 md:px-6">
      {/* Section 1 — header */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
        className="flex flex-wrap items-end justify-between gap-4 pb-6 pt-10"
      >
        <div className="max-w-2xl">
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } }}
            className="label-micro !text-gold"
          >
            {t('calc.label')}
          </motion.div>
          <motion.h1
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } }}
            className="mt-2 font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-t1 md:text-[40px]"
          >
            {t('calc.title')}
          </motion.h1>
          <motion.p
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } }}
            className="mt-3 text-sm leading-[1.5] text-t2"
          >
            {t('calc.subtitle')}
          </motion.p>
        </div>
        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } }}
          className="flex items-center gap-2"
        >
          {gold && (
            <span className="rounded-lg border border-hairline bg-bg2 px-3 py-1.5 font-mono text-sm tabular text-gold">
              {formatUnitPrice(convertPrice(gold.price, usdIdr, unit), unit, lang)}
            </span>
          )}
          <Badge variant={statusVariant} />
        </motion.div>
      </motion.div>

      {/* Section 2 — app */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="grid grid-cols-1 gap-4 py-4 lg:grid-cols-12"
      >
        {/* mobile: results first */}
        <div className="order-1 min-w-0 lg:order-2 lg:col-span-7">
          {result && (
            <ResultsPanel
              result={result}
              currency={currency}
              years={debounced?.years ?? years}
              summaryText={summaryText}
              onReset={reset}
            />
          )}
        </div>
        <div className="order-2 min-w-0 lg:order-1 lg:col-span-5">
          <InputsPanel
            mode={mode}
            onMode={setMode}
            currency={currency}
            onCurrency={setCurrency}
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
    </div>
  );
}
