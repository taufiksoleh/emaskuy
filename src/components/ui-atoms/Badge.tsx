/**
 * Badge — Label style + dot; variants live/cached/offline (design.md §9).
 */
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n';

export type BadgeVariant = 'live' | 'cached' | 'offline' | 'info' | 'neutral';

const dotColor: Record<BadgeVariant, string> = {
  live: 'var(--up)',
  cached: 'var(--gold)',
  offline: 'var(--down)',
  info: 'var(--info)',
  neutral: 'var(--text-3)',
};

export function Badge({
  variant = 'live',
  children,
  className,
}: {
  variant?: BadgeVariant;
  children?: React.ReactNode;
  className?: string;
}) {
  const { t } = useI18n();
  const label =
    children ??
    (variant === 'live' ? t('common.live') : variant === 'cached' ? t('common.cached') : t('common.offline'));
  return (
    <span
      className={cn(
        'label-micro inline-flex items-center gap-1.5 rounded-full border border-hairline bg-bg2 px-2 py-0.5',
        className,
      )}
    >
      <span
        className={cn('h-2 w-2 rounded-full', variant === 'live' && 'status-pulse')}
        style={{ backgroundColor: dotColor[variant] }}
      />
      {label}
    </span>
  );
}
