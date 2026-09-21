/**
 * Panel — header row (title + optional actions) + body; optional `glow`
 * variant with gold radial top-glow (design.md §9).
 */
import { cn } from '@/lib/utils';

export interface PanelProps {
  title?: React.ReactNode;
  actions?: React.ReactNode;
  glow?: boolean;
  interactive?: boolean;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}

export function Panel({
  title,
  actions,
  glow = false,
  interactive = false,
  className,
  bodyClassName,
  children,
}: PanelProps) {
  return (
    <section
      className={cn(
        'rounded-[10px] border border-hairline bg-bg1 transition-[border-color,background-color] duration-150',
        glow && 'panel-glow',
        interactive && 'hover:border-goldline hover:bg-bg2 cursor-pointer',
        className,
      )}
    >
      {(title || actions) && (
        <header className="flex items-center justify-between gap-3 px-4 pt-4 md:px-6 md:pt-5">
          {typeof title === 'string' ? (
            <h3 className="font-display text-xl font-semibold leading-[1.3] tracking-[-0.02em] text-t1">
              {title}
            </h3>
          ) : (
            title
          )}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={cn('px-4 py-4 md:px-6 md:py-5', bodyClassName)}>{children}</div>
    </section>
  );
}
