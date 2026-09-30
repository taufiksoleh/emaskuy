/**
 * WhatsAppButton — opens WhatsApp (app or web) with a prepared message.
 */
import { MessageCircle } from 'lucide-react';
import { registerStrings, useI18n } from '@/lib/i18n';
import { waLink } from '@/lib/share';
import { cn } from '@/lib/utils';

registerStrings({
  'share.whatsapp': { id: 'Kirim ke WhatsApp', en: 'Send on WhatsApp' },
});

export function WhatsAppButton({ text, label, className }: { text: string; label?: string; className?: string }) {
  const { t } = useI18n();
  return (
    <a
      href={waLink(text)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'flex items-center justify-center gap-2 rounded-lg border border-up/40 bg-up/10 px-4 py-2 font-display text-sm font-medium text-up transition-colors hover:bg-up/15 active:scale-[0.97]',
        className,
      )}
    >
      <MessageCircle className="h-4 w-4" aria-hidden />
      {label ?? t('share.whatsapp')}
    </a>
  );
}
