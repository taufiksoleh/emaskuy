/**
 * Sparkline — tiny SVG line (no axes), gold stroke, optional draw-in.
 */
import { useId } from 'react';

export interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  /** stroke color — defaults to gold */
  color?: string;
  drawIn?: boolean;
  className?: string;
}

export function Sparkline({
  data,
  width = 72,
  height = 24,
  color = 'var(--gold)',
  drawIn = true,
  className,
}: SparklineProps) {
  const id = useId();
  if (data.length < 2) return <div style={{ width, height }} className={className} />;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const points = data
    .map((v, i) => `${(i * stepX).toFixed(1)},${(height - 2 - ((v - min) / range) * (height - 4)).toFixed(1)}`)
    .join(' ');
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className} aria-hidden>
      <defs>
        <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${height} ${points} ${width},${height}`} fill={`url(#spark-${id})`} />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        style={
          drawIn
            ? { strokeDasharray: width * 2, strokeDashoffset: width * 2, animation: 'spark-draw 800ms ease-out forwards' }
            : undefined
        }
      />
      <style>{`@keyframes spark-draw { to { stroke-dashoffset: 0; } }`}</style>
    </svg>
  );
}
