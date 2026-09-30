/**
 * Section 2 — Interactive chart panel (design home.md §2).
 * lightweight-charts v5: area/line/candles, crosshair tooltip, last-price
 * dashed line, fullscreen overlay, draw-in animation, unit conversion.
 *
 * Only real data is drawn: 1H/24H use prices this browser actually observed
 * (candles are built from those ticks); daily timeframes use NBP fixings
 * converted at same-day ECB rates, ending at the live price. New prices
 * update the last point in place so the user's zoom survives every poll.
 */
import { useEffect, useEffectEvent, useMemo, useRef, useState } from 'react';
import {
  AreaSeries,
  CandlestickSeries,
  ColorType,
  createChart,
  CrosshairMode,
  LineSeries,
  LineStyle,
  TickMarkType,
  type IChartApi,
  type IPriceLine,
  type ISeriesApi,
  type MouseEventParams,
  type Time,
  type UTCTimestamp,
} from 'lightweight-charts';
import { AreaChart, CandlestickChart, LineChart, Maximize2, Minimize2 } from 'lucide-react';
import { registerStrings, useI18n } from '@/lib/i18n';
import { useTheme, chartPalette, type ChartPalette } from '@/hooks/useTheme';
import { useDisplay, type Display } from '@/hooks/useDisplay';
import { useDisplayHistory } from '@/hooks/useDisplayHistory';
import { useGoldPrice } from '@/hooks/useGoldPrice';
import { toCandles, mergeTick, type Candle, type Pt } from '@/lib/chartData';
import { CURRENCY, rateOf } from '@/lib/money';
import { formatClockZone } from '@/lib/time';
import { cn, fill } from '@/lib/utils';
import { Badge } from '../ui-atoms/Badge';
import { SegToggle } from '../ui-atoms/SegToggle';

registerStrings({
  'home.chart.timeframe': { id: 'Rentang waktu', en: 'Timeframe' },
  'home.chart.type.line': { id: 'Grafik garis', en: 'Line chart' },
  'home.chart.type.area': { id: 'Grafik area', en: 'Area chart' },
  'home.chart.type.candles': { id: 'Grafik candle', en: 'Candlestick chart' },
  'home.chart.candlesIntraday': {
    id: 'Candle hanya untuk 1H/24H: data harian hanya punya satu harga per hari',
    en: 'Candles are for 1H/24H only: daily data has one price per day',
  },
  'home.chart.fullscreen': { id: 'Layar penuh', en: 'Fullscreen' },
  'home.chart.exitFullscreen': { id: 'Keluar layar penuh', en: 'Exit fullscreen' },
  'home.chart.collecting': {
    id: 'Mengumpulkan harga live: {n} titik terpantau. Grafik 1H/24H hanya memakai harga yang benar-benar tercatat di browser ini, jadi butuh beberapa menit.',
    en: 'Collecting live prices: {n} points observed. 1H/24H only use prices actually recorded in this browser, so it takes a few minutes.',
  },
  'home.chart.collectingSince': { id: 'sejak {time}', en: 'since {time}' },
  'home.chart.viewDaily': { id: 'Lihat grafik 30 hari', en: 'View 30-day chart' },
  'home.chart.noHistory': {
    id: 'Histori harian belum bisa dimuat. Coba lagi sebentar lagi.',
    en: 'Daily history could not be loaded. Please try again shortly.',
  },
});

type TF = '1H' | '24H' | '7D' | '30D' | '90D' | '1Y' | 'ALL';
type ChartType = 'line' | 'area' | 'candles';
type AnySeries = ISeriesApi<'Area'> | ISeriesApi<'Line'> | ISeriesApi<'Candlestick'>;

const TIMEFRAMES: TF[] = ['1H', '24H', '7D', '30D', '90D', '1Y', 'ALL'];
const DAY_MS = 24 * 60 * 60 * 1000;
const INTRADAY_MS: Partial<Record<TF, number>> = { '1H': 60 * 60 * 1000, '24H': DAY_MS };
/** Candle bucket per intraday timeframe (polls arrive every 30 s). */
const BUCKET_MS: Partial<Record<TF, number>> = { '1H': 2 * 60 * 1000, '24H': 30 * 60 * 1000 };
const TF_DAYS: Partial<Record<TF, number>> = { '7D': 9, '30D': 33, '90D': 95, '1Y': 370 };

const sec = (ms: number) => Math.floor(ms / 1000) as UTCTimestamp;

/** Axis labels: whole units from 1,000 up (`$4,148`, `Rp2.405.371`), else cents (`RM553.20`). */
function fmtAxis(v: number, d: Display): string {
  return d.format(v, { decimals: Math.min(CURRENCY[d.currency].decimals, Math.abs(v) >= 1000 ? 0 : 2) });
}

/** One value per second, ascending: lightweight-charts rejects duplicates. */
function toLineData(pts: Pt[]) {
  const out: { time: UTCTimestamp; value: number }[] = [];
  for (const p of pts) {
    const time = sec(p.t);
    const last = out[out.length - 1];
    if (last && last.time === time) last.value = p.v;
    else if (!last || time > last.time) out.push({ time, value: p.v });
  }
  return out;
}

const toCandleData = (candles: Candle[]) => candles.map((c) => ({ ...c, time: c.time as UTCTimestamp }));

function createSeries(chart: IChartApi, type: ChartType, palette: ChartPalette): AnySeries {
  if (type === 'candles') {
    return chart.addSeries(CandlestickSeries, {
      upColor: palette.up,
      downColor: palette.down,
      borderUpColor: palette.up,
      borderDownColor: palette.down,
      wickUpColor: palette.up,
      wickDownColor: palette.down,
      lastValueVisible: false,
      priceLineVisible: false,
    });
  }
  if (type === 'line') {
    return chart.addSeries(LineSeries, { color: palette.gold, lineWidth: 2, priceLineVisible: false, lastValueVisible: false });
  }
  return chart.addSeries(AreaSeries, {
    lineColor: palette.gold,
    lineWidth: 2,
    topColor: palette.areaTop,
    bottomColor: palette.areaBottom,
    priceLineVisible: false,
    lastValueVisible: false,
  });
}

export function ChartPanel() {
  const { lang, t } = useI18n();
  const d = useDisplay();
  const { theme } = useTheme();
  const palette = useMemo(() => chartPalette(theme), [theme]);
  const { gold, ticks, rates, lastUpdated, status: liveStatus } = useGoldPrice();

  const [tf, setTf] = useState<TF>('30D');
  const [type, setType] = useState<ChartType>('area');
  const [fs, setFs] = useState(false);
  const [hover, setHover] = useState<{ x: number; y: number; width: number; pt: Pt; delta: number } | null>(null);
  const [dotPos, setDotPos] = useState<{ x: number; y: number } | null>(null);
  const [rebuildNonce, setRebuildNonce] = useState(0);

  const intraday = tf === '1H' || tf === '24H';
  const effType: ChartType = type === 'candles' && !intraday ? 'area' : type;
  const oneYear = useDisplayHistory('1y');
  const allTime = useDisplayHistory('all', tf === 'ALL');
  const daily = tf === 'ALL' ? allTime : oneYear;

  const wrapRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<AnySeries | null>(null);
  const seriesKeyRef = useRef('');
  const priceLineRef = useRef<IPriceLine | null>(null);
  const ptsRef = useRef<Pt[]>([]);
  const candlesRef = useRef<Candle[]>([]);
  /** Time slot of the live point appended to daily data (null: none). */
  const liveSlotRef = useRef<UTCTimestamp | null>(null);
  const intradayRef = useRef(intraday);
  const animKeyRef = useRef('');
  const fittedTfRef = useRef<TF | null>(null);
  const animatingRef = useRef(false);
  const rafRef = useRef(0);

  /* Intraday readiness, measured against the last poll (not Date.now()). */
  const windowMs = INTRADAY_MS[tf] ?? 0;
  const refNow = lastUpdated || ticks[ticks.length - 1]?.t || 0;
  const windowTicks = intraday ? ticks.filter((tk) => tk.t > refNow - windowMs) : [];
  const collecting = intraday && windowTicks.length < 2;

  const updateDot = () => {
    const chart = chartRef.current;
    const series = seriesRef.current;
    const last = ptsRef.current[ptsRef.current.length - 1];
    if (!chart || !series || !last || !intradayRef.current) {
      setDotPos(null);
      return;
    }
    const x = chart.timeScale().timeToCoordinate(sec(last.t));
    const y = series.priceToCoordinate(last.v);
    setDotPos(x !== null && y !== null ? { x, y } : null);
  };

  /* ---------- chart lifecycle ---------- */
  const onCrosshair = useEffectEvent((param: MouseEventParams<Time>) => {
    const series = seriesRef.current;
    if (!param.point || !series || param.time === undefined) {
      setHover(null);
      return;
    }
    const sd = param.seriesData.get(series) as { value?: number; close?: number } | undefined;
    const v = sd?.value ?? sd?.close;
    if (v === undefined) {
      setHover(null);
      return;
    }
    const pts = ptsRef.current;
    const time = param.time as number;
    const idx = pts.findIndex((p) => sec(p.t) >= time);
    const prev = idx > 0 ? pts[idx - 1] : pts[0];
    setHover({
      x: param.point.x,
      y: param.point.y,
      width: wrapRef.current?.clientWidth ?? 300,
      pt: { t: time * 1000, v },
      delta: prev ? v - prev.v : 0,
    });
  });

  const onRangeChange = useEffectEvent(() => updateDot());

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const chart = createChart(el, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        fontFamily: '"JetBrains Mono Variable", "JetBrains Mono", monospace',
        fontSize: 11,
      },
      grid: { vertLines: { visible: false } },
      rightPriceScale: { borderVisible: false },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
        secondsVisible: false,
        // Intraday labels in the device's own time (matching the tooltip);
        // daily points sit at 00:00 UTC of their fixing date.
        tickMarkFormatter: (time: Time, kind: TickMarkType, locale: string) => {
          const d = new Date((time as number) * 1000);
          const timeZone = intradayRef.current ? undefined : 'UTC';
          if (kind === TickMarkType.Year) return d.toLocaleDateString(locale, { year: 'numeric', timeZone });
          if (kind === TickMarkType.Month) return d.toLocaleDateString(locale, { month: 'short', timeZone });
          if (kind === TickMarkType.DayOfMonth) return d.toLocaleDateString(locale, { day: 'numeric', month: 'short', timeZone });
          return d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
        },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { width: 1, style: LineStyle.Solid, labelVisible: false },
        horzLine: { width: 1, style: LineStyle.Solid, labelVisible: false },
      },
    });
    chartRef.current = chart;
    const crosshair = (p: MouseEventParams<Time>) => onCrosshair(p);
    const range = () => onRangeChange();
    chart.subscribeCrosshairMove(crosshair);
    chart.timeScale().subscribeVisibleLogicalRangeChange(range);
    return () => {
      chart.unsubscribeCrosshairMove(crosshair);
      chart.timeScale().unsubscribeVisibleLogicalRangeChange(range);
      cancelAnimationFrame(rafRef.current);
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
      priceLineRef.current = null;
      seriesKeyRef.current = '';
    };
  }, []);

  /* theme colors */
  useEffect(() => {
    chartRef.current?.applyOptions({
      layout: { textColor: palette.axisText },
      grid: { horzLines: { color: palette.gridLine } },
      crosshair: {
        vertLine: { color: palette.goldDim },
        horzLine: { color: palette.goldDim },
      },
    });
  }, [palette]);

  const toUnit = (usdPerOz: number) => d.price(usdPerOz);

  const setPriceLine = (series: AnySeries, price: number | undefined) => {
    if (priceLineRef.current) {
      try {
        series.removePriceLine(priceLineRef.current);
      } catch {
        /* series was replaced */
      }
      priceLineRef.current = null;
    }
    if (price === undefined) return;
    priceLineRef.current = series.createPriceLine({
      price,
      color: palette.gold,
      lineWidth: 1,
      lineStyle: LineStyle.Dashed,
      axisLabelVisible: true,
      title: '',
    });
  };

  /* ---------- full rebuild: timeframe, unit, type, source data ---------- */
  const rebuild = useEffectEvent(() => {
    const chart = chartRef.current;
    if (!chart) return;
    intradayRef.current = intraday;

    const seriesKey = `${effType}|${theme}`;
    if (!seriesRef.current || seriesKeyRef.current !== seriesKey) {
      if (seriesRef.current) chart.removeSeries(seriesRef.current);
      priceLineRef.current = null;
      seriesRef.current = createSeries(chart, effType, palette);
      seriesKeyRef.current = seriesKey;
    }
    const series = seriesRef.current;
    chart.applyOptions({
      localization: {
        locale: lang === 'id' ? 'id-ID' : 'en-US',
        priceFormatter: (v: number) => fmtAxis(v, d),
      },
    });

    const now = Date.now();
    let pts: Pt[];
    liveSlotRef.current = null;
    if (intraday) {
      const cutoff = now - (INTRADAY_MS[tf] ?? DAY_MS);
      pts = ticks
        .filter((tk) => tk.t > cutoff)
        .map((tk) => ({ t: tk.t, v: toUnit(tk.p) }))
        .filter((p) => p.v > 0);
      // A single point draws a flat axis full of identical labels; keep the
      // chart empty behind the "collecting" overlay until there are two.
      if (pts.length < 2) pts = [];
    } else {
      const days = TF_DAYS[tf];
      const cutoff = days === undefined ? -Infinity : now - days * DAY_MS;
      pts = daily.points.filter((p) => p.t > cutoff).map((p) => ({ t: p.t, v: p.v }));
      const live = toUnit(gold?.price ?? 0);
      const lastT = pts[pts.length - 1]?.t ?? Infinity;
      if (pts.length > 0 && live > 0 && now > lastT) {
        pts.push({ t: now, v: live });
        liveSlotRef.current = sec(now);
      }
    }

    const prevLen = ptsRef.current.length;
    const range = chart.timeScale().getVisibleLogicalRange();
    const showedAll = !range || (range.from <= 0.5 && range.to >= prevLen - 1.5);
    const refit = fittedTfRef.current !== tf || showedAll;
    fittedTfRef.current = tf;
    ptsRef.current = pts;

    const lineData = toLineData(pts);
    candlesRef.current = effType === 'candles' ? toCandles(pts, BUCKET_MS[tf] ?? DAY_MS) : [];

    const finish = () => {
      animatingRef.current = false;
      if (effType === 'candles') (series as ISeriesApi<'Candlestick'>).setData(toCandleData(candlesRef.current));
      else (series as ISeriesApi<'Area'>).setData(lineData);
      if (refit) chart.timeScale().fitContent();
      else if (range) chart.timeScale().setVisibleLogicalRange(range);
      setPriceLine(series, pts[pts.length - 1]?.v);
      updateDot();
    };

    const animKey = `${tf}|${effType}|${d.label}`;
    const animate =
      animKeyRef.current !== animKey &&
      effType !== 'candles' &&
      lineData.length > 8 &&
      !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    animKeyRef.current = animKey;

    cancelAnimationFrame(rafRef.current);
    if (!animate) {
      finish();
      return;
    }
    animatingRef.current = true;
    const start = performance.now();
    const step = (frame: number) => {
      const p = Math.min(1, (frame - start) / 1200);
      const n = Math.max(2, Math.floor(lineData.length * (1 - Math.pow(1 - p, 3))));
      (series as ISeriesApi<'Area'>).setData(lineData.slice(0, n));
      if (p < 1) rafRef.current = requestAnimationFrame(step);
      else finish();
    };
    rafRef.current = requestAnimationFrame(step);
  });

  // Ticks are in USD/oz: redraw them when the display currency's rate moves.
  const intradayFx = intraday ? rateOf(d.currency, rates) : 0;
  useEffect(() => {
    rebuild();
  }, [tf, d.label, effType, daily.points, rebuildNonce, lang, theme, intradayFx, collecting]);

  /* ---------- live tick: update in place ---------- */
  const applyTick = useEffectEvent(() => {
    const series = seriesRef.current;
    if (animatingRef.current || !series || !gold || gold.price <= 0) return;
    const v = toUnit(gold.price);
    if (v <= 0) return;
    const pts = ptsRef.current;

    if (collecting) return;
    if (!intraday) {
      if (pts.length === 0) return;
      if (liveSlotRef.current === null) {
        const slot = sec(Date.now());
        if (slot <= sec(pts[pts.length - 1].t)) return;
        liveSlotRef.current = slot;
        pts.push({ t: slot * 1000, v });
      } else {
        pts[pts.length - 1] = { t: liveSlotRef.current * 1000, v };
      }
      (series as ISeriesApi<'Area'>).update({ time: liveSlotRef.current, value: v });
    } else {
      const tick = { t: gold.updatedAt || Date.now(), v };
      const last = pts[pts.length - 1];
      if (last && sec(tick.t) <= sec(last.t)) return;
      pts.push(tick);
      if (effType === 'candles') {
        const candle = mergeTick(candlesRef.current, tick, BUCKET_MS[tf] ?? DAY_MS);
        if (candle) (series as ISeriesApi<'Candlestick'>).update({ ...candle, time: candle.time as UTCTimestamp });
      } else {
        (series as ISeriesApi<'Area'>).update({ time: sec(tick.t), value: v });
      }
      // Slide the window: once the oldest point falls well outside it, rebuild.
      const windowSpan = INTRADAY_MS[tf] ?? DAY_MS;
      if (pts[0].t < Date.now() - windowSpan * 1.2) setRebuildNonce((n) => n + 1);
    }
    priceLineRef.current?.applyOptions({ price: v });
    if (!priceLineRef.current) setPriceLine(series, v);
    updateDot();
  });

  useEffect(() => {
    applyTick();
  }, [gold?.updatedAt, gold?.price, rates]);

  /* Esc closes fullscreen */
  useEffect(() => {
    if (!fs) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setFs(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [fs]);

  const hoverDate = (tMs: number) => {
    const d = new Date(tMs);
    const locale = lang === 'id' ? 'id-ID' : 'en-US';
    return intraday
      ? d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
      : d.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  };

  const seriesStatus = intraday ? liveStatus : daily.status;
  const showSkeleton = intraday ? !gold && liveStatus !== 'offline' : daily.loading && daily.points.length === 0;
  const noHistory = !intraday && !daily.loading && daily.points.length === 0;
  const firstTick = windowTicks[0];

  const typeButtons: { v: ChartType; Icon: typeof LineChart; label: string }[] = [
    { v: 'line', Icon: LineChart, label: t('home.chart.type.line') },
    { v: 'area', Icon: AreaChart, label: t('home.chart.type.area') },
    { v: 'candles', Icon: CandlestickChart, label: t('home.chart.type.candles') },
  ];

  const controls = (
    <div className="flex flex-wrap items-center gap-2">
      <SegToggle
        ariaLabel={t('home.chart.timeframe')}
        size="sm"
        value={tf}
        onChange={setTf}
        options={TIMEFRAMES.map((x) => ({ value: x, label: x }))}
      />
      <div className="inline-flex items-center gap-0.5 rounded-lg bg-bg3 p-0.5">
        {typeButtons.map(({ v, Icon, label }) => {
          const disabled = v === 'candles' && !intraday;
          return (
            <button
              key={v}
              onClick={() => setType(v)}
              disabled={disabled}
              aria-label={label}
              aria-pressed={effType === v}
              title={disabled ? t('home.chart.candlesIntraday') : label}
              className={cn(
                'cursor-pointer rounded-md p-1.5 transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40',
                effType === v ? 'bg-bg2 text-gold ring-1 ring-gold/60' : 'text-t3 hover:text-t2',
              )}
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}
      </div>
      <button
        onClick={() => setFs((v) => !v)}
        aria-label={fs ? t('home.chart.exitFullscreen') : t('home.chart.fullscreen')}
        className="cursor-pointer rounded-lg border border-hairline bg-bg2 p-2 text-t3 transition-colors hover:border-goldline hover:text-gold"
      >
        {fs ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
      </button>
    </div>
  );

  const chartBody = (
    <div className="relative">
      <div
        ref={wrapRef}
        className={cn('w-full cursor-crosshair', fs ? 'h-[calc(100dvh-220px)]' : 'h-[300px] md:h-[420px]')}
      />
      {showSkeleton && (
        <div className="absolute inset-0 flex flex-col justify-end gap-2 p-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="skeleton-shimmer h-3 rounded" style={{ width: `${92 - i * 5}%` }} />
          ))}
        </div>
      )}
      {!showSkeleton && collecting && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-bg1/90 px-6 text-center">
          <p className="max-w-md text-sm leading-relaxed text-t2">
            {fill(t('home.chart.collecting'), { n: windowTicks.length })}
            {firstTick && <> ({fill(t('home.chart.collectingSince'), { time: formatClockZone(firstTick.t, lang) })})</>}
          </p>
          <button
            onClick={() => setTf('30D')}
            className="cursor-pointer rounded-lg border border-goldline bg-bg2 px-3 py-1.5 font-display text-sm font-medium text-gold transition-colors hover:bg-bg3"
          >
            {t('home.chart.viewDaily')}
          </button>
        </div>
      )}
      {noHistory && (
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
          <p className="max-w-sm text-sm text-t3">{t('home.chart.noHistory')}</p>
        </div>
      )}
      {hover && (
        <div
          className="pointer-events-none absolute z-10 rounded-lg border border-gold/60 bg-bg3 px-3 py-2 font-mono text-xs tabular shadow-lg"
          style={{
            left: Math.min(Math.max(hover.x + 12, 8), hover.width - 170),
            top: Math.max(hover.y - 56, 8),
          }}
        >
          <div className="text-t3">{hoverDate(hover.pt.t)}</div>
          <div className="mt-0.5 text-sm font-semibold text-gold">
            {d.format(hover.pt.v)}
          </div>
          <div style={{ color: hover.delta >= 0 ? 'var(--up)' : 'var(--down)' }}>
            {hover.delta >= 0 ? '▲' : '▼'}{' '}
            {d.format(Math.abs(hover.delta))}
          </div>
        </div>
      )}
      {dotPos && !collecting && (
        <div
          className="pointer-events-none absolute z-10 h-2 w-2 -translate-x-1 -translate-y-1 rounded-full bg-gold chart-dot-pulse"
          style={{ left: dotPos.x, top: dotPos.y }}
        />
      )}
    </div>
  );

  const footnote = (
    <div className="border-t border-hairline px-4 py-3 font-mono text-[13px] leading-[1.4] tabular text-t3 md:px-6">
      {t('home.chart.footnote')}
    </div>
  );

  const panelContent = (
    <>
      <header className="flex flex-wrap items-center justify-between gap-3 px-4 pt-4 md:px-6 md:pt-5">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-xl font-semibold leading-[1.3] tracking-[-0.02em] text-t1">
            {t('home.chart.title')}
          </h2>
          {!showSkeleton && seriesStatus === 'cached' && <Badge variant="cached" />}
          {!showSkeleton && seriesStatus === 'offline' && <Badge variant="offline" />}
        </div>
        {controls}
      </header>
      <div className="px-2 py-4 md:px-4">{chartBody}</div>
      {footnote}
    </>
  );

  /* Render panelContent exactly ONCE — the same DOM node goes fullscreen via
     classes, so the lightweight-charts instance (bound to wrapRef) is never
     unmounted/remounted when toggling fullscreen. */
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-4 md:px-6">
      {fs && (
        <div
          className="fixed inset-0 z-[80] bg-bg0/90 backdrop-blur-sm"
          onClick={() => setFs(false)}
          aria-hidden
        />
      )}
      <div
        className={cn(
          'rounded-[10px] border border-hairline bg-bg1',
          fs &&
            'fixed inset-3 z-[90] overflow-y-auto border-goldline shadow-2xl transition-all duration-300 md:inset-6',
        )}
      >
        {panelContent}
      </div>
    </section>
  );
}
