/**
 * ScenarioChart — compact multi-line SVG for the scenario lab: up to 3
 * growth-rate lines (gold / --info / --up). Lines draw in 900ms when a
 * scenario is activated and fade 250ms when toggled off via legend chips.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { fmtMoneyCompact, type CalcCurrency } from '@/lib/calc';

const PAD = { top: 10, right: 10, bottom: 20, left: 48 };

export interface ScenarioSeries {
  id: string;
  label: string;
  color: string;
  /** yearly values (index 0 = year 0) */
  values: number[];
}

function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}

export function ScenarioChart({
  series,
  years,
  currency,
}: {
  series: ScenarioSeries[];
  years: number;
  currency: CalcCurrency;
}) {
  const { lang } = useI18n();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const height = 220;
  const [progress, setProgress] = useState(1);
  const keyRef = useRef('');

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  // draw-in whenever the set of active series changes
  const activeKey = series.map((s) => s.id).join(',');
  useEffect(() => {
    if (keyRef.current === activeKey) return;
    keyRef.current = activeKey;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setProgress(1);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / 900);
      setProgress(easeOutCubic(p));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [activeKey]);

  const innerW = Math.max(10, width - PAD.left - PAD.right);
  const innerH = Math.max(10, height - PAD.top - PAD.bottom);

  const maxV = useMemo(() => {
    let m = 1;
    for (const s of series) for (const v of s.values) m = Math.max(m, v);
    return m;
  }, [series]);

  const toXY = (v: number, idx: number, n: number) => ({
    x: PAD.left + (idx / Math.max(1, n - 1)) * innerW,
    y: PAD.top + innerH - (v / maxV) * innerH,
  });

  const yTicks = useMemo(() => {
    return [0, 1, 2, 3].map((k) => {
      const v = (maxV * k) / 3;
      return {
        y: PAD.top + innerH - (innerH * k) / 3,
        label: fmtMoneyCompact(v, currency, lang),
      };
    });
  }, [maxV, innerH, currency, lang]);

  return (
    <div ref={wrapRef} className="w-full select-none">
      <svg width={width} height={height} className="block max-w-full" style={{ display: width > 0 ? undefined : 'none' }}>
        {yTicks.map((tk, i) => (
          <g key={i}>
            <line x1={PAD.left} x2={width - PAD.right} y1={tk.y} y2={tk.y} stroke="var(--line)" strokeWidth={1} strokeDasharray="2 4" />
            <text x={PAD.left - 8} y={tk.y + 3} textAnchor="end" fontSize={10} fill="var(--text-3)" fontFamily="JetBrains Mono, monospace">
              {tk.label}
            </text>
          </g>
        ))}
        {[0, Math.round(years / 2), years].map((yr) => (
          <text
            key={yr}
            x={PAD.left + (yr / Math.max(1, years)) * innerW}
            y={height - 5}
            textAnchor="middle"
            fontSize={10}
            fill="var(--text-3)"
            fontFamily="JetBrains Mono, monospace"
          >
            {yr}
          </text>
        ))}
        {series.map((s) => {
          const n = s.values.length;
          const upto = Math.max(2, Math.ceil(n * progress));
          const d = s.values
            .slice(0, upto)
            .map((v, idx) => {
              const { x, y } = toXY(v, idx, n);
              return `${idx === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
            })
            .join(' ');
          return (
            <path
              key={s.id}
              d={d}
              fill="none"
              stroke={s.color}
              strokeWidth={2}
              strokeLinejoin="round"
              style={{ transition: 'opacity 250ms' }}
            />
          );
        })}
      </svg>
    </div>
  );
}
