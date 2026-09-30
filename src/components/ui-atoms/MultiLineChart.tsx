/**
 * MultiLineChart — a few series on one shared y-scale (unlike Sparkline,
 * which normalizes each series on its own). Gaps (null) break the line;
 * single points show as dots.
 */
import { useEffect, useId, useRef, useState } from 'react';

export interface ChartSeries {
  key: string;
  label: string;
  color: string;
  dashed?: boolean;
  points: { t: number; v: number | null }[];
}

export function MultiLineChart({
  series,
  height = 200,
  formatY,
  formatX,
  ariaLabel,
}: {
  series: ChartSeries[];
  height?: number;
  formatY: (v: number) => string;
  formatX: (t: number) => string;
  ariaLabel: string;
}) {
  const id = useId();
  const figureRef = useRef<HTMLElement>(null);
  // Drawn at its rendered width, so labels keep their size from phone to desktop.
  const [width, setWidth] = useState(600);
  const all = series.flatMap((s) => s.points.filter((p) => p.v !== null).map((p) => ({ t: p.t, v: p.v as number })));
  const hasData = all.length > 0;
  useEffect(() => {
    const el = figureRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.max(240, Math.round(entry.contentRect.width))));
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasData]);
  if (!hasData) return null;

  const pad = { top: 10, right: 12, bottom: 22, left: 64 };

  const tMin = Math.min(...all.map((p) => p.t));
  const tMax = Math.max(...all.map((p) => p.t));
  const vMinRaw = Math.min(...all.map((p) => p.v));
  const vMaxRaw = Math.max(...all.map((p) => p.v));
  const margin = (vMaxRaw - vMinRaw || vMaxRaw * 0.02) * 0.15;
  const vMin = vMinRaw - margin;
  const vMax = vMaxRaw + margin;
  const x = (t: number) => pad.left + ((t - tMin) / (tMax - tMin || 1)) * (width - pad.left - pad.right);
  const y = (v: number) => pad.top + (1 - (v - vMin) / (vMax - vMin || 1)) * (height - pad.top - pad.bottom);

  const ticks = [0, 0.5, 1].map((f) => vMin + f * (vMax - vMin));
  const xTicks = [tMin, tMax];

  /** Split a series into continuous runs at nulls. */
  const runs = (s: ChartSeries) => {
    const out: { t: number; v: number }[][] = [[]];
    for (const p of s.points) {
      if (p.v === null) out.push([]);
      else out[out.length - 1].push({ t: p.t, v: p.v });
    }
    return out.filter((r) => r.length > 0);
  };

  return (
    <figure ref={figureRef} className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-labelledby={`${id}-title`}>
        <title id={`${id}-title`}>{ariaLabel}</title>
        {ticks.map((v, i) => (
          <g key={i}>
            <line x1={pad.left} x2={width - pad.right} y1={y(v)} y2={y(v)} stroke="var(--line)" strokeDasharray="2 4" />
            <text x={pad.left - 8} y={y(v) + 3} textAnchor="end" fontSize={10} fill="var(--text-3)" fontFamily="JetBrains Mono Variable, JetBrains Mono, monospace">
              {formatY(v)}
            </text>
          </g>
        ))}
        {xTicks.map((t, i) => (
          <text
            key={i}
            x={x(t)}
            y={height - 6}
            textAnchor={i === 0 ? 'start' : 'end'}
            fontSize={10}
            fill="var(--text-3)"
            fontFamily="JetBrains Mono Variable, JetBrains Mono, monospace"
          >
            {formatX(t)}
          </text>
        ))}
        {series.map((s) =>
          runs(s).map((run, i) =>
            run.length === 1 ? (
              <circle key={`${s.key}-${i}`} cx={x(run[0].t)} cy={y(run[0].v)} r={4} fill={s.color} />
            ) : (
              <polyline
                key={`${s.key}-${i}`}
                points={run.map((p) => `${x(p.t)},${y(p.v)}`).join(' ')}
                fill="none"
                stroke={s.color}
                strokeWidth={2}
                strokeDasharray={s.dashed ? '5 4' : undefined}
                strokeLinejoin="round"
              />
            ),
          ),
        )}
      </svg>
      <figcaption className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-t3">
        {series.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-4" style={{ backgroundColor: s.color }} />
            {s.label}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
