/**
 * StatCard — label + Data-LG value + delta chip + optional sparkline
 * (design.md §9). Value counts up from 0 on first paint (900ms easeOutExpo).
 */
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { DeltaChip } from './DeltaChip';

export interface StatCardProps {
  label: React.ReactNode;
  /** Numeric value — rendered with `format` after a count-up tween. */
  value: number;
  /** Formats the (tweened) numeric value for display. */
  format: (v: number) => string;
  /** Signed delta %; renders a DeltaChip when provided */
  delta?: number;
  deltaPrefix?: string;
  sub?: React.ReactNode;
  /** Inline sparkline node (e.g. <Sparkline/>) rendered right of the value */
  sparkline?: React.ReactNode;
  className?: string;
  /** Skip the initial count-up (e.g. prefers-reduced-motion handled internally) */
  disableCountUp?: boolean;
}

function easeOutExpo(x: number): number {
  return x >= 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

export function useCountUp(target: number, duration = 900, disabled = false): number {
  const [display, setDisplay] = useState(disabled ? target : 0);
  const fromRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const reduced =
      disabled || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      fromRef.current = target;
      setDisplay(target);
      return;
    }
    const from = fromRef.current;
    const start = performance.now();
    cancelAnimationFrame(rafRef.current);
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const v = from + (target - from) * easeOutExpo(p);
      setDisplay(v);
      if (p < 1) rafRef.current = requestAnimationFrame(step);
      else fromRef.current = target;
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, disabled]);

  return display;
}

export function StatCard({
  label,
  value,
  format,
  delta,
  deltaPrefix,
  sub,
  sparkline,
  className,
  disableCountUp,
}: StatCardProps) {
  const shown = useCountUp(value, 900, disableCountUp);
  return (
    <div
      className={cn(
        'rounded-[10px] border border-hairline bg-bg1 p-4 transition-[border-color,background-color] duration-150 hover:border-goldline hover:bg-bg2 md:p-5',
        className,
      )}
    >
      <div className="label-micro">{label}</div>
      <div className="mt-2 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <div className="font-mono text-[24px] font-semibold leading-[1.1] tabular text-t1 md:text-[28px]">
            {format(shown)}
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            {delta !== undefined && <DeltaChip value={delta} prefix={deltaPrefix} size="sm" />}
            {sub && <span className="text-xs text-t3">{sub}</span>}
          </div>
        </div>
        {sparkline && <div className="shrink-0">{sparkline}</div>}
      </div>
    </div>
  );
}
