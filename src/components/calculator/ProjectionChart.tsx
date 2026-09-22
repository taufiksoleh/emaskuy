/**
 * ProjectionChart — morphing SVG area chart: projected value (gold area)
 * vs total invested (dashed --info line, steps up monthly in DCA mode).
 * Shaded band between the lines: gold 8% where value > invested, red 8%
 * where below. Crosshair + tooltip. Morphs (800ms easeInOutCubic) toward
 * new data on every parameter change instead of a full redraw.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { formatNumber } from '@/lib/gold';
import { fmtMoney, fmtMoneyCompact, type CalcCurrency, type SeriesPoint } from '@/lib/calc';

const GOLD = 'var(--gold)';
const UP = 'var(--up)';
const DOWN = 'var(--down)';
const INFO = 'var(--info)';
const PAD = { top: 12, right: 10, bottom: 22, left: 52 };

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

/** Tween an array of series points toward a new target. */
function useTweenSeries(target: SeriesPoint[], duration = 800): SeriesPoint[] {
  const [display, setDisplay] = useState<SeriesPoint[]>(target);
  const curRef = useRef<SeriesPoint[]>(target);
  const rafRef = useRef(0);

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const from = curRef.current;
    if (reduced || !from.length) {
      curRef.current = target;
      setDisplay(target);
      return;
    }
    // resample `from` onto the target's month grid
    const fromAt = (m: number): SeriesPoint => {
      if (m >= from.length - 1) return from[from.length - 1];
      return from[Math.round(m)] ?? from[from.length - 1];
    };
    const start = performance.now();
    cancelAnimationFrame(rafRef.current);
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const e = easeInOutCubic(p);
      const next = target.map((tp) => {
        const fp = fromAt(tp.m);
        return {
          m: tp.m,
          value: fp.value + (tp.value - fp.value) * e,
          invested: fp.invested + (tp.invested - fp.invested) * e,
        };
      });
      curRef.current = next;
      setDisplay(next);
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return display;
}

interface XYPt {
  x: number;
  y: number;
  vY: number;
  iY: number;
  v: number; // value
  i: number; // invested
  m: number;
}

function linePath(pts: XYPt[], key: 'vY' | 'iY'): string {
  return pts
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p[key].toFixed(1)}`)
    .join(' ');
}

export function ProjectionChart({
  points,
  years,
  currency,
}: {
  points: SeriesPoint[];
  years: number;
  currency: CalcCurrency;
}) {
  const { lang, t } = useI18n();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(640);
  const height = 300;
  const [hover, setHover] = useState<number | null>(null);

  const display = useTweenSeries(points, 800);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const innerW = Math.max(10, width - PAD.left - PAD.right);
  const innerH = Math.max(10, height - PAD.top - PAD.bottom);

  const { pts, maxV, minV } = useMemo(() => {
    let max = 0;
    let min = Infinity;
    for (const p of display) {
      max = Math.max(max, p.value, p.invested);
      min = Math.min(min, p.value, p.invested);
    }
    if (max <= 0) max = 1;
    if (!Number.isFinite(min)) min = 0;
    min = Math.min(0, min); // pin baseline at 0 unless profits go negative
    const n = Math.max(1, display.length - 1);
    const map = (v: number) => PAD.top + innerH - ((v - min) / (max - min)) * innerH;
    const mapped: XYPt[] = display.map((p, idx) => ({
      x: PAD.left + (idx / n) * innerW,
      y: map(p.value),
      vY: map(p.value),
      iY: map(p.invested),
      v: p.value,
      i: p.invested,
      m: p.m,
    }));
    return { pts: mapped, maxV: max, minV: min };
  }, [display, innerW, innerH]);

  /** Area path under the value line. */
  const areaPath = useMemo(() => {
    if (pts.length < 2) return '';
    const base = PAD.top + innerH;
    return `${linePath(pts, 'vY')} L${pts[pts.length - 1].x.toFixed(1)},${base} L${pts[0].x.toFixed(1)},${base} Z`;
  }, [pts, innerH]);

  const valueLine = useMemo(() => linePath(pts, 'vY'), [pts]);
  const investedLine = useMemo(() => linePath(pts, 'iY'), [pts]);

  /** Band between value & invested, split at sign crossings. */
  const bands = useMemo(() => {
    const out: { d: string; positive: boolean }[] = [];
    if (pts.length < 2) return out;
    let seg: XYPt[] = [pts[0]];
    let segSign = pts[0].v >= pts[0].i;
    const flush = (end: XYPt) => {
      seg.push(end);
      if (seg.length >= 2) {
        const fwd = seg.map((p) => `L${p.x.toFixed(1)},${p.vY.toFixed(1)}`).join(' ');
        const bwd = [...seg].reverse().map((p) => `L${p.x.toFixed(1)},${p.iY.toFixed(1)}`).join(' ');
        out.push({ d: `M${seg[0].x.toFixed(1)},${seg[0].vY.toFixed(1)} ${fwd} ${bwd} Z`, positive: segSign });
      }
      seg = [end];
    };
    for (let k = 1; k < pts.length; k++) {
      const a = pts[k - 1];
      const b = pts[k];
      const sign = b.v >= b.i;
      if (sign !== segSign) {
        // interpolate crossing
        const da = a.v - a.i;
        const db = b.v - b.i;
        const f = da / (da - db || 1e-9);
        const cross: XYPt = {
          x: a.x + (b.x - a.x) * f,
          y: 0,
          vY: a.vY + (b.vY - a.vY) * f,
          iY: a.iY + (b.iY - a.iY) * f,
          v: a.v + (b.v - a.v) * f,
          i: a.i + (b.i - a.i) * f,
          m: a.m + (b.m - a.m) * f,
        };
        flush(cross);
        segSign = sign;
      }
      if (k === pts.length - 1) flush(b);
      else seg.push(b);
    }
    return out;
  }, [pts]);

  const yTicks = useMemo(() => {
    const ticks: { y: number; label: string }[] = [];
    for (let k = 0; k <= 4; k++) {
      const v = minV + ((maxV - minV) * k) / 4;
      ticks.push({
        y: PAD.top + innerH - (innerH * k) / 4,
        label: fmtMoneyCompact(v, currency, lang),
      });
    }
    return ticks;
  }, [minV, maxV, innerH, currency, lang]);

  const xTicks = useMemo(() => {
    const ticks: { x: number; label: string }[] = [];
    const step = Math.max(1, Math.round(years / 6));
    for (let yr = 0; yr <= years; yr += step) {
      const idx = Math.min(pts.length - 1, Math.round((yr / years) * (pts.length - 1)));
      if (pts[idx]) ticks.push({ x: pts[idx].x, label: `${yr}` });
    }
    return ticks;
  }, [pts, years]);

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const n = pts.length - 1;
    if (n <= 0) return;
    const idx = Math.round(((x - PAD.left) / innerW) * n);
    setHover(Math.max(0, Math.min(n, idx)));
  };

  const hp = hover !== null ? pts[hover] : null;

  return (
    <div ref={wrapRef} className="relative w-full select-none">
      <div className="mb-2 flex flex-wrap items-center gap-3 px-1">
        <span className="flex items-center gap-1.5 text-xs text-t2">
          <span className="h-0.5 w-4 rounded-full" style={{ backgroundColor: GOLD }} />
          {t('calc.legend.value')}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-t2">
          <span className="h-0 w-4 border-t-2 border-dashed" style={{ borderColor: INFO }} />
          {t('calc.legend.invested')}
        </span>
      </div>
      <svg
        width={width}
        height={height}
        className="block cursor-crosshair"
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id="calc-area-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={GOLD} stopOpacity={0.22} />
            <stop offset="90%" stopColor={GOLD} stopOpacity={0} />
          </linearGradient>
        </defs>
        {/* gridlines */}
        {yTicks.map((tk, i) => (
          <g key={i}>
            <line x1={PAD.left} x2={width - PAD.right} y1={tk.y} y2={tk.y} stroke="var(--line)" strokeWidth={1} strokeDasharray="2 4" />
            <text x={PAD.left - 8} y={tk.y + 3} textAnchor="end" fontSize={10} fill="var(--text-3)" fontFamily="JetBrains Mono, monospace">
              {tk.label}
            </text>
          </g>
        ))}
        {xTicks.map((tk, i) => (
          <text key={i} x={tk.x} y={height - 6} textAnchor="middle" fontSize={10} fill="var(--text-3)" fontFamily="JetBrains Mono, monospace">
            {tk.label}
          </text>
        ))}
        {/* band between lines */}
        {bands.map((b, i) => (
          <path key={i} d={b.d} fill={b.positive ? GOLD : DOWN} opacity={0.08} />
        ))}
        {/* area under value */}
        {areaPath && <path d={areaPath} fill="url(#calc-area-fill)" />}
        {/* invested dashed */}
        <path d={investedLine} fill="none" stroke={INFO} strokeWidth={1.5} strokeDasharray="5 4" />
        {/* value line */}
        <path d={valueLine} fill="none" stroke={GOLD} strokeWidth={2} strokeLinejoin="round" />
        {/* last point */}
        {pts.length > 1 && (
          <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].vY} r={3.5} fill={GOLD} />
        )}
        {/* crosshair */}
        {hp && (
          <g>
            <line x1={hp.x} x2={hp.x} y1={PAD.top} y2={PAD.top + innerH} stroke={GOLD} strokeWidth={1} opacity={0.5} />
            <circle cx={hp.x} cy={hp.vY} r={4} fill={GOLD} stroke="var(--bg-0)" strokeWidth={2} />
            <circle cx={hp.x} cy={hp.iY} r={3.5} fill={INFO} stroke="var(--bg-0)" strokeWidth={2} />
          </g>
        )}
      </svg>
      {/* tooltip */}
      {hp && (
        <div
          className="pointer-events-none absolute z-10 rounded-lg border px-3 py-2 font-mono text-xs tabular"
          style={{
            left: Math.min(Math.max(hp.x, 90), width - 170),
            top: 24,
            transform: 'translateX(-50%)',
            background: 'var(--bg-3)',
            borderColor: 'var(--gold-dim)',
          }}
        >
          <div className="mb-1 font-display text-[11px] font-semibold uppercase tracking-[0.12em] text-t3">
            {t('calc.tooltip.year')} {formatNumber(hp.m / 12, lang, { decimals: 1 })}
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-t2">{t('calc.tooltip.value')}</span>
            <span className="text-gold">{fmtMoney(hp.v, currency, lang)}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-t2">{t('calc.tooltip.invested')}</span>
            <span className="text-t1">{fmtMoney(hp.i, currency, lang)}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-t2">{t('calc.tooltip.profit')}</span>
            <span style={{ color: hp.v - hp.i >= 0 ? UP : DOWN }}>
              {fmtMoney(hp.v - hp.i, currency, lang)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
