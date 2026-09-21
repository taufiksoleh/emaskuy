/**
 * SegToggle — segmented control with sliding indicator (design.md §9).
 * bg3 container, active segment gold text on bg2 with 1px gold border,
 * indicator animated via framer-motion layoutId (250ms spring).
 */
import { motion } from 'framer-motion';
import { useId } from 'react';
import { cn } from '@/lib/utils';

export interface SegToggleOption<T extends string = string> {
  value: T;
  label: React.ReactNode;
}

export interface SegToggleProps<T extends string = string> {
  options: SegToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: 'sm' | 'md';
  className?: string;
  ariaLabel?: string;
}

export function SegToggle<T extends string = string>({
  options,
  value,
  onChange,
  size = 'md',
  className,
  ariaLabel,
}: SegToggleProps<T>) {
  const id = useId();
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        'inline-flex items-center gap-0.5 rounded-lg bg-bg3 p-0.5',
        className,
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              'relative cursor-pointer rounded-md font-mono font-medium transition-colors duration-150',
              size === 'sm' ? 'px-2 py-1 text-[11px]' : 'px-3 py-1.5 text-xs',
              active ? 'text-gold' : 'text-t3 hover:text-t2',
            )}
          >
            {active && (
              <motion.span
                layoutId={`seg-${id}`}
                transition={{ type: 'spring', stiffness: 500, damping: 38, duration: 0.25 }}
                className="absolute inset-0 rounded-md border border-gold/60 bg-bg2"
              />
            )}
            <span className="relative z-10 whitespace-nowrap">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
