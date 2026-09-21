/**
 * Section 2 — Interactive chart panel (design home.md §2).
 * lightweight-charts v5: area/line/candles, crosshair tooltip, last-price
 * dashed line, fullscreen overlay, draw-in animation, unit conversion.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AreaSeries,
  CandlestickSeries,
  ColorType,
  createChart,
  CrosshairMode,
  LineSeries,
  LineStyle,
  type IChartApi,
  type ISeriesApi,
  type MouseEventParams,
  type Time,
  type UTCTimestamp,
} from 'lightweight-charts';
import { AreaChart, CandlestickChart, LineChart, Maximize2, Minimize2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useGoldPrice, type Tick } from '@/hooks/useGoldPrice';
import { useDailySeries } from '@/hooks/useDailySeries';
import type { DailyPoint } from '@/lib/api';
import { TROY_OZ_GRAMS, formatIdr, formatUsd } from '@/lib/gold';
import { cn } from '@/lib/utils';
import { Badge } from '../ui-atoms/Badge';
import { SegToggle } from '../ui-atoms/SegToggle';

type TF = '1H' | '24H' | '7D' | '30D' | '90D' | '1Y';
type ChartType = 'line' | 'area' | 'candles';

const TIMEFRAMES: TF[] = ['1H', '24H', '7D', '30D', '90D', '1Y'];
const TF_DAYS: Record<TF, number> = { '1H': 0, '24H': 0, '7D': 9, '30D': 33, '90D': 95, '1Y': 370 };
const GOLD = '#F5B93E';
const GOLD_DIM = '#8A6D2F';
const UP = '#22C55E';
const DOWN = '#EF4444';

interface Pt {
  t: number; // unix ms
  v: number;
}

/* Deterministic PRNG for synthesized intraday series */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Synthesize an intraday walk between anchor closes, pinned to live price. */
function synthesize(fromMs: number, toMs: number, startV: number, endV: number, stepMs: number, seed: number): Pt[] {
  const n = Math.max(2, Math.floor((toMs - fromMs) / stepMs));
  const rnd = mulberry32(seed);
  const pts: Pt[] = [];
  let v = startV;
  for (let i = 0; i < n; i++) {
    const t = fromMs + i * stepMs;
    const drift = (endV - startV) / n;
    v += drift + (rnd() - 0.5) * Math.abs(endV) * 0.0009;
    pts.push({ t, v });
  }
  pts.push({ t: toMs, v: endV });
  return pts;
}

function buildSeries(
  tf: TF,
  ticks: Tick[],
  daily: DailyPoint[],
  livePrice: number,
): Pt[] {
  const now = Date.now();
  if (tf === '1H' || tf === '24H') {
    const windowMs = tf === '1H' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
    const minPts = tf === '1H' ? 10 : 16;
    const inWindow = ticks.filter((tk) => tk.t > now - windowMs);
    if (inWindow.length >= minPts) return inWindow.map((tk) => ({ t: tk.t, v: tk.p }));
    // First visit / sparse ticks: synthesize from daily anchors.
    const anchor = daily.length > 0 ? daily[daily.length - 1].close : livePrice;
    const seed = Math.floor(now / 60000) % 100000;
    return synthesize(now - windowMs, now, anchor, livePrice, tf === '1H' ? 60_000 : 300_000, seed);
  }
  const days = TF_DAYS[tf];
  const cutoff = now - days * 24 * 60 * 60 * 1000;
  const pts = daily.filter((p) => p.t > cutoff).map((p) => ({ t: p.t, v: p.close }));
  // Pin the last point to the live price so chart ends at the real value.
  if (pts.length > 0 && livePrice > 0) pts.push({ t: now, v: livePrice });
  return pts;
}

function bucketCandles(pts: Pt[], buckets: number): { time: UTCTimestamp; open: number; high: number; low: number; close: number }[] {
  if (pts.length < 2) return [];
  const span = pts[pts.length - 1].t - pts[0].t || 1;
  const size = span / buckets;
  const out: { time: UTCTimestamp; open: number; high: number; low: number; close: number }[] = [];
  for (let b = 0; b < buckets; b++) {
    const lo = pts[0].t + b * size;
    const hi = lo + size;
    const inside = pts.filter((p) => p.t >= lo && p.t < hi);
    const ref = inside.length > 0 ? inside : [pts.reduce((a, c) => (Math.abs(c.t - lo) < Math.abs(a.t - lo) ? c : a))];
    const open = ref[0].v;
    const close = ref[ref.length - 1].v;
    out.push({
      time: Math.floor(lo / 1000) as UTCTimestamp,
      open,
      high: Math.max(open, close, ...ref.map((p) => p.v)),
      low: Math.min(open, close, ...ref.map((p) => p.v)),
      close,
    });
  }
  return out;
}

function fmtAxis(v: number, unit: 'usd-oz' | 'idr-gr'): string {
  return unit === 'idr-gr' ? `Rp${Math.round(v).toLocaleString('id-ID')}` : `$${v.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

export function ChartPanel() {
  const { lang, t, unit } = useI18n();
  const { gold, ticks, status: liveStatus } = useGoldPrice();
  const daily = useDailySeries(370);

  const [tf, setTf] = useState<TF>('30D');
  const [type, setType] = useState<ChartType>('area');
  const [fs, setFs] = useState(false);
  const [hover, setHover] = useState<{ x: number; y: number; pt: Pt; delta: number } | null>(null);
  const [dotPos, setDotPos] = useState<{ x: number; y: number } | null>(null);

  const wrapRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Area'> | ISeriesApi<'Line'> | ISeriesApi<'Candlestick'> | null>(null);
  const priceLineRef = useRef<ReturnType<ISeriesApi<'Area'>['createPriceLine']> | null>(null);
  const animKeyRef = useRef('');
  const rafRef = useRef(0);

  const livePrice = gold?.price ?? 0;
  const { usdIdr } = useGoldPrice();
  const conv = useMemo(
    () => (v: number) => (unit === 'idr-gr' && usdIdr > 0 ? (v / TROY_OZ_GRAMS) * usdIdr : v),
    [unit, usdIdr],
  );

  const intraday = tf === '1H' || tf === '24H';
  const seriesStatus = intraday ? liveStatus : daily.status;

  const rawPts = useMemo(
    () => buildSeries(tf, ticks, daily.points, livePrice),
    [tf, ticks, daily.points, livePrice],
  );

  const pts = useMemo(
    () => rawPts.map((p) => ({ t: p.t, v: conv(p.v) })),
    [rawPts, conv],
  );

  const dataLine = useMemo(
    () => pts.map((p) => ({ time: Math.floor(p.t / 1000) as UTCTimestamp, value: p.v })),
    [pts],
  );
  const dataCandles = useMemo(() => bucketCandles(pts, tf === '1H' ? 36 : tf === '24H' ? 48 : 72), [pts, tf]);

  /* ---------- chart lifecycle ---------- */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const chart = createChart(el, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#5B6474',
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 11,
      },
      localization: { locale: lang === 'id' ? 'id-ID' : 'en-US' },
      grid: {
        horzLines: { color: 'rgba(36, 41, 56, 0.6)' },
        vertLines: { visible: false },
      },
      rightPriceScale: { borderVisible: false },
      timeScale: { borderVisible: false, timeVisible: true, secondsVisible: false },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: GOLD_DIM, width: 1, style: LineStyle.Solid, labelVisible: false },
        horzLine: { color: GOLD_DIM, width: 1, style: LineStyle.Solid, labelVisible: false },
      },
    });
    chartRef.current = chart;
    return () => {
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  /* crosshair tooltip */
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    const handler = (param: MouseEventParams<Time>) => {
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
      const tMs = (param.time as number) * 1000;
      const idx = pts.findIndex((p) => Math.floor(p.t / 1000) >= (param.time as number));
      const prev = idx > 0 ? pts[idx - 1] : pts[0];
      setHover({ x: param.point.x, y: param.point.y, pt: { t: tMs, v }, delta: prev ? v - prev.v : 0 });
    };
    chart.subscribeCrosshairMove(handler);
    return () => chart.unsubscribeCrosshairMove(handler);
  }, [pts]);

  /* series + data */
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart || pts.length === 0) return;

    const animKey = `${tf}-${type}-${unit}`;
    const shouldAnimate = animKeyRef.current !== animKey;
    animKeyRef.current = animKey;

    // (re)create series of the requested type
    if (seriesRef.current) chart.removeSeries(seriesRef.current);
    let series: ISeriesApi<'Area'> | ISeriesApi<'Line'> | ISeriesApi<'Candlestick'>;
    if (type === 'candles') {
      series = chart.addSeries(CandlestickSeries, {
        upColor: UP,
        downColor: DOWN,
        borderUpColor: UP,
        borderDownColor: DOWN,
        wickUpColor: UP,
        wickDownColor: DOWN,
        lastValueVisible: false,
      });
    } else if (type === 'line') {
      series = chart.addSeries(LineSeries, { color: GOLD, lineWidth: 2, priceLineVisible: false, lastValueVisible: false });
    } else {
      series = chart.addSeries(AreaSeries, {
        lineColor: GOLD,
        lineWidth: 2,
        topColor: 'rgba(245,185,62,0.22)',
        bottomColor: 'rgba(245,185,62,0)',
        priceLineVisible: false,
        lastValueVisible: false,
      });
    }
    seriesRef.current = series;
    chart.applyOptions({
      localization: {
        locale: lang === 'id' ? 'id-ID' : 'en-US',
        priceFormatter: (v: number) => fmtAxis(v, unit),
      },
    });

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const setAll = () => {
      if (type === 'candles') (series as ISeriesApi<'Candlestick'>).setData(dataCandles);
      else (series as ISeriesApi<'Area'>).setData(dataLine);
      chart.timeScale().fitContent();
      // last-price dashed line
      if (priceLineRef.current) {
        try {
          series.removePriceLine(priceLineRef.current);
        } catch {
          /* noop */
        }
      }
      const last = pts[pts.length - 1];
      if (last) {
        priceLineRef.current = series.createPriceLine({
          price: last.v,
          color: GOLD,
          lineWidth: 1,
          lineStyle: LineStyle.Dashed,
          axisLabelVisible: true,
          title: '',
        });
        // live dot at the last point (intraday modes)
        if (intraday) {
          const x = chart.timeScale().timeToCoordinate(Math.floor(last.t / 1000) as UTCTimestamp);
          const y = series.priceToCoordinate(last.v);
          setDotPos(x !== null && y !== null ? { x, y } : null);
        } else {
          setDotPos(null);
        }
      }
    };

    cancelAnimationFrame(rafRef.current);
    if (shouldAnimate && !reduced && type !== 'candles' && dataLine.length > 8) {
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / 1200);
        const e = 1 - Math.pow(1 - p, 3);
        const n = Math.max(2, Math.floor(dataLine.length * e));
        (series as ISeriesApi<'Area'>).setData(dataLine.slice(0, n));
        if (p < 1) rafRef.current = requestAnimationFrame(step);
        else setAll();
      };
      rafRef.current = requestAnimationFrame(step);
    } else {
      setAll();
    }
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pts, dataCandles, dataLine, type, tf, unit, lang]);

  /* Esc closes fullscreen */
  useEffect(() => {
    if (!fs) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setFs(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [fs]);

  const hoverDate = (tMs: number) => {
    const d = new Date(tMs);
    return intraday
      ? d.toLocaleTimeString(lang === 'id' ? 'id-ID' : 'en-US', { hour: '2-digit', minute: '2-digit' })
      : d.toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const controls = (
    <div className="flex flex-wrap items-center gap-2">
      <SegToggle
        ariaLabel="Timeframe"
        size="sm"
        value={tf}
        onChange={setTf}
        options={TIMEFRAMES.map((x) => ({ value: x, label: x }))}
      />
      <div className="inline-flex items-center gap-0.5 rounded-lg bg-bg3 p-0.5">
        {(
          [
            { v: 'line' as ChartType, Icon: LineChart },
            { v: 'area' as ChartType, Icon: AreaChart },
            { v: 'candles' as ChartType, Icon: CandlestickChart },
          ]
        ).map(({ v, Icon }) => (
          <button
            key={v}
            onClick={() => setType(v)}
            aria-label={v}
            className={cn(
              'cursor-pointer rounded-md p-1.5 transition-colors duration-150',
              type === v ? 'bg-bg2 text-gold ring-1 ring-gold/60' : 'text-t3 hover:text-t2',
            )}
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
      </div>
      <button
        onClick={() => setFs((v) => !v)}
        aria-label="Fullscreen"
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
      {pts.length === 0 && (
        <div className="absolute inset-0 flex flex-col justify-end gap-2 p-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="skeleton-shimmer h-3 rounded" style={{ width: `${92 - i * 5}%` }} />
          ))}
        </div>
      )}
      {hover && (
        <div
          className="pointer-events-none absolute z-10 rounded-lg border border-gold/60 bg-bg3 px-3 py-2 font-mono text-xs tabular shadow-lg"
          style={{
            left: Math.min(Math.max(hover.x + 12, 8), (wrapRef.current?.clientWidth ?? 300) - 170),
            top: Math.max(hover.y - 56, 8),
          }}
        >
          <div className="text-t3">{hoverDate(hover.pt.t)}</div>
          <div className="mt-0.5 text-sm font-semibold text-gold">
            {unit === 'idr-gr' ? formatIdr(hover.pt.v, lang) : formatUsd(hover.pt.v, lang)}
          </div>
          <div style={{ color: hover.delta >= 0 ? UP : DOWN }}>
            {hover.delta >= 0 ? '▲' : '▼'}{' '}
            {unit === 'idr-gr' ? formatIdr(Math.abs(hover.delta), lang) : formatUsd(Math.abs(hover.delta), lang)}
          </div>
        </div>
      )}
      {dotPos && (
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
          <h3 className="font-display text-xl font-semibold leading-[1.3] tracking-[-0.02em] text-t1">
            {t('home.chart.title')}
          </h3>
          {seriesStatus === 'cached' && <Badge variant="cached" />}
          {seriesStatus === 'offline' && <Badge variant="offline" />}
        </div>
        {controls}
      </header>
      <div className="px-2 py-4 md:px-4">{chartBody}</div>
      {footnote}
    </>
  );

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-4 md:px-6">
      <div className="rounded-[10px] border border-hairline bg-bg1">{panelContent}</div>

      {fs && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-bg0/90 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setFs(false);
          }}
        >
          <div className="w-full max-w-[1400px] rounded-[10px] border border-goldline bg-bg1 shadow-2xl transition-all duration-300">
            {panelContent}
          </div>
        </div>
      )}
    </section>
  );
}
