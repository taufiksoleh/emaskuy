/**
 * Section 3 — Market stats grid: 4 StatCards + multi-metal table +
 * quick converter (design home.md §3).
 */
import { useMemo, useState } from 'react';
import { Reveal } from '../ui-atoms/Reveal';
import { ArrowLeftRight } from 'lucide-react';
import { Link } from 'react-router';
import { registerStrings, useI18n } from '@/lib/i18n';
import { useDisplay } from '@/hooks/useDisplay';
import { useDisplayHistory } from '@/hooks/useDisplayHistory';
import { useGoldPrice } from '@/hooks/useGoldPrice';
import { sliceSince } from '@/lib/history';
import { parseAmount } from '@/lib/number';
import { TROY_OZ_GRAMS, formatDate, formatDateOnly, formatNumber, formatUsd } from '@/lib/gold';
import { CURRENCY, formatMoney, pricePer } from '@/lib/money';
import { metalPath } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { DeltaChip } from '../ui-atoms/DeltaChip';
import { Panel } from '../ui-atoms/Panel';
import { StatCard } from '../ui-atoms/StatCard';
import { Sparkline } from '../ui-atoms/Sparkline';

registerStrings({
  'home.conv.swap': { id: 'Balik arah konversi', en: 'Swap direction' },
});

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
        {metals.map((m, i) => {
          const cells = (
            <>
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
            </>
          );
          const row = 'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-150 md:px-6';
          return (
            <Reveal key={m.symbol} x={-8} y={0} amount={0.3} duration={0.3} delay={i * 0.04}>
              {m.symbol === 'XAU' ? (
                <div className={row}>{cells}</div>
              ) : (
                <Link to={metalPath(m.symbol, lang)} className={`${row} hover:bg-bg2`}>
                  {cells}
                </Link>
              )}
            </Reveal>
          );
        })}
      </div>
    </Panel>
  );
}

type ConvUnit = 'oz' | 'gr' | 'kg';

function QuickConverter() {
  const { lang, t } = useI18n();
  const d = useDisplay();
  const { gold, rates } = useGoldPrice();
  const [amount, setAmount] = useState('10');
  const [unit, setUnit] = useState<ConvUnit>('gr');
  const [moneyToGold, setMoneyToGold] = useState(false);
  const [flip, setFlip] = useState(0);

  const xau = gold?.price ?? 0;
  const gramsPerUnit: Record<ConvUnit, number> = { oz: TROY_OZ_GRAMS, gr: 1, kg: 1000 };
  const parsed = parseAmount(amount, lang);
  const amt = Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  // Second output currency: the display currency, or rupiah for dollar users.
  const local = d.currency === 'USD' ? 'IDR' : d.currency;

  // gold→money: grams in → USD and local out. money→gold: display currency in → grams/oz out.
  const grams = amt * gramsPerUnit[unit];
  const outUsd = (grams / TROY_OZ_GRAMS) * xau;
  const outLocal = grams * pricePer(xau, local, 'g', rates);
  const perGramIn = pricePer(xau, d.currency, 'g', rates);
  const inGrams = perGramIn > 0 ? amt / perGramIn : 0;

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
          <span className="rounded-lg border border-hairline bg-bg3 px-3 py-2.5 font-mono text-sm text-t2">{d.currency}</span>
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
          aria-label={t('home.conv.swap')}
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
            <div className="mt-3 label-micro">{local}</div>
            <div className="mt-1 font-mono text-2xl font-semibold tabular text-t1 md:text-3xl">
              {formatMoney(outLocal, local, lang)}
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

interface Extreme {
  value: number;
  /** YYYY-MM-DD of a daily fixing, or null for the live price */
  date: string | null;
}

export function StatsGrid() {
  const { lang, t } = useI18n();
  const d = useDisplay();
  const { metals, gold, lastUpdated } = useGoldPrice();
  const history = useDisplayHistory('1y');
  const live = gold && gold.price > 0 ? d.price(gold.price) : 0;

  const stats = useMemo(() => {
    const pts = history.points;
    if (pts.length < 30) return null;
    const refNow = lastUpdated || pts[pts.length - 1].t;
    const year = sliceSince(pts, refNow - 365 * 24 * 60 * 60 * 1000);
    let hi: Extreme = { value: year[0].v, date: year[0].date };
    let lo = hi;
    for (const p of year) {
      if (p.v > hi.value) hi = { value: p.v, date: p.date };
      if (p.v < lo.value) lo = { value: p.v, date: p.date };
    }
    if (live > 0 && live > hi.value) hi = { value: live, date: null };
    if (live > 0 && live < lo.value) lo = { value: live, date: null };
    const last30 = pts.slice(-31).map((p) => p.v);
    const returns: number[] = [];
    for (let i = 1; i < last30.length; i++) {
      returns.push(Math.log(last30[i] / last30[i - 1]));
    }
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((a, r) => a + (r - mean) ** 2, 0) / returns.length;
    const vol30 = Math.sqrt(variance) * Math.sqrt(252) * 100;
    return { hi, lo, vol30, returns, refNow };
  }, [history.points, live, lastUpdated]);

  const fmtPrice = (v: number) => d.format(v, { decimals: Math.min(CURRENCY[d.currency].decimals, v >= 1000 ? 0 : 2) });
  const reached = (e: Extreme, refNow: number) =>
    `${t('home.stats.reached')} ${e.date ? formatDateOnly(e.date, lang) : formatDate(refNow, lang)}`;

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
            value={stats?.hi.value ?? 0}
            format={(v) => (v > 0 ? fmtPrice(v) : '—')}
            sub={stats ? reached(stats.hi, stats.refNow) : undefined}
          />,
          <StatCard
            key="lo"
            label={t('home.stats.low52')}
            value={stats?.lo.value ?? 0}
            format={(v) => (v > 0 ? fmtPrice(v) : '—')}
            sub={stats ? reached(stats.lo, stats.refNow) : undefined}
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
          <Reveal key={i} delay={i * 0.07}>
            {card}
          </Reveal>
        ))}
      </div>

      {/* Row B — 2 panels */}
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Reveal >
          <MultiMetalTable />
        </Reveal>
        <Reveal delay={0.07}>
          <QuickConverter />
        </Reveal>
      </div>
    </section>
  );
}
