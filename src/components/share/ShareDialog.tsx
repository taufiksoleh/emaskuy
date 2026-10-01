/**
 * ShareDialog — share a price, the AI insight or an article as a WhatsApp
 * message or as an image card: square for chats, 4:5 for the Instagram
 * feed, 9:16 for WhatsApp status and stories. The cards are drawn when the
 * dialog opens, so the share button can call navigator.share straight from
 * the click (Safari rejects it after async work).
 */
import { useEffect, useState } from 'react';
import { Copy, Download, Image as ImageIcon, Loader2, Share2, X } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { copyText } from '@/lib/clipboard';
import { registerStrings, useI18n } from '@/lib/i18n';
import {
  CARD_FORMATS,
  canShareFiles,
  renderShareCard,
  shareOrDownload,
  type CardFormat,
  type ShareCard,
} from '@/lib/shareCard';
import { cn } from '@/lib/utils';
import { SegToggle } from '../ui-atoms/SegToggle';
import { WhatsAppButton } from './WhatsAppButton';

registerStrings({
  'share.open': { id: 'Bagikan', en: 'Share' },
  'share.title': { id: 'Bagikan harga emas', en: 'Share the gold price' },
  'share.desc': {
    id: 'Kirim sebagai pesan WhatsApp, atau bagikan gambarnya ke chat, feed Instagram, status, dan story.',
    en: 'Send it as a WhatsApp message, or share the image to chats, the Instagram feed, status and stories.',
  },
  'share.format': { id: 'Format gambar', en: 'Image format' },
  'share.square': { id: 'Chat 1:1', en: 'Chat 1:1' },
  'share.portrait': { id: 'Feed 4:5', en: 'Feed 4:5' },
  'share.story': { id: 'Story 9:16', en: 'Story 9:16' },
  'share.imageButton': { id: 'Bagikan gambar', en: 'Share as image' },
  'share.image': { id: 'Bagikan gambar', en: 'Share image' },
  'share.download': { id: 'Unduh gambar', en: 'Download image' },
  'share.copy': { id: 'Salin teks', en: 'Copy text' },
  'share.copied': { id: 'Teks disalin', en: 'Text copied' },
  'share.copyFailed': { id: 'Gagal menyalin teks', en: 'Could not copy the text' },
  'share.downloaded': { id: 'Gambar diunduh', en: 'Image downloaded' },
  'share.renderFailed': { id: 'Gambar gagal dibuat', en: 'Could not create the image' },
  'share.close': { id: 'Tutup', en: 'Close' },
  'share.preview': { id: 'Pratinjau gambar', en: 'Image preview' },
});

export interface ShareSnapshot {
  card: ShareCard;
  /** WhatsApp message, also the caption when the image is shared */
  text: string;
}

type Cards = Record<CardFormat, { blob: Blob; url: string }>;

const PREVIEW_BOX: Record<CardFormat, string> = {
  square: 'aspect-square max-w-[320px]',
  portrait: 'aspect-[4/5] max-w-[280px]',
  story: 'aspect-[9/16] max-w-[220px]',
};

export function ShareDialog({
  build,
  filename,
  className,
  disabled,
  title,
  description,
  trigger = 'button',
}: {
  /** Called on open, so the card shows the data at that moment */
  build: () => ShareSnapshot;
  filename: string;
  className?: string;
  /** Shown but inactive, e.g. until there is a price to share. */
  disabled?: boolean;
  /** Dialog heading; defaults to sharing the gold price */
  title?: string;
  description?: string;
  /** "button": small labelled button; "icon": square icon button for share rows */
  trigger?: 'button' | 'icon';
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [snap, setSnap] = useState<ShareSnapshot | null>(null);
  const [cards, setCards] = useState<Cards | null>(null);
  const [failed, setFailed] = useState(false);
  const [format, setFormat] = useState<CardFormat>('square');
  const [fileShare] = useState(canShareFiles);

  useEffect(() => {
    if (!snap) return;
    let cancelled = false;
    let made: Cards | null = null;
    Promise.all(CARD_FORMATS.map((f) => renderShareCard(snap.card, f)))
      .then((blobs) => {
        if (cancelled) return;
        made = Object.fromEntries(
          CARD_FORMATS.map((f, i) => [f, { blob: blobs[i], url: URL.createObjectURL(blobs[i]) }]),
        ) as Cards;
        setCards(made);
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
      if (made) Object.values(made).forEach((c) => URL.revokeObjectURL(c.url));
    };
  }, [snap]);

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    setCards(null);
    setFailed(false);
    setSnap(next ? build() : null);
  };

  const shareImage = async () => {
    if (!cards || !snap) return;
    const outcome = await shareOrDownload(cards[format].blob, `${filename}-${format}.png`, snap.text);
    if (outcome === 'downloaded') toast.success(t('share.downloaded'));
  };

  const copy = async () => {
    if (!snap) return;
    if (await copyText(snap.text)) toast.success(t('share.copied'));
    else toast.error(t('share.copyFailed'));
  };

  const action =
    'flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-hairline bg-bg2 px-3 py-2 font-display text-sm font-medium text-t1 transition-colors hover:border-goldline hover:text-gold disabled:cursor-wait disabled:opacity-50';

  return (
    <>
      {trigger === 'icon' ? (
        <button
          type="button"
          disabled={disabled}
          onClick={() => onOpenChange(true)}
          aria-label={t('share.imageButton')}
          title={t('share.imageButton')}
          className={cn(
            'cursor-pointer rounded-lg border border-hairline bg-bg2 p-2 text-t2 transition-colors hover:border-goldline hover:text-gold disabled:cursor-default disabled:opacity-50',
            className,
          )}
        >
          <ImageIcon className="h-4 w-4" aria-hidden />
        </button>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => onOpenChange(true)}
          className={cn(
            'flex cursor-pointer items-center gap-1.5 rounded-md border border-hairline bg-bg2 px-2 py-1.5 font-display text-xs font-medium text-t2 transition-colors hover:border-goldline hover:text-gold disabled:cursor-default disabled:opacity-50 disabled:hover:border-hairline disabled:hover:text-t2',
            className,
          )}
        >
          <Share2 className="h-3.5 w-3.5" aria-hidden />
          {t('share.open')}
        </button>
      )}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="z-[100] max-h-[92dvh] gap-4 overflow-y-auto border-goldline bg-bg1 p-5 text-t1 sm:max-w-md"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <DialogTitle className="font-display text-lg font-semibold text-t1">{title ?? t('share.title')}</DialogTitle>
              <DialogDescription className="mt-1 text-sm text-t2">{description ?? t('share.desc')}</DialogDescription>
            </div>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label={t('share.close')}
              className="cursor-pointer rounded-md p-1 text-t3 transition-colors hover:text-t1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {snap && <WhatsAppButton text={snap.text} className="w-full py-2.5" />}

          <SegToggle
            ariaLabel={t('share.format')}
            className="w-full [&>button]:flex-1"
            value={format}
            onChange={setFormat}
            options={CARD_FORMATS.map((f) => ({ value: f, label: t(`share.${f}`) }))}
          />

          <div
            className={cn(
              'mx-auto flex w-full items-center justify-center overflow-hidden rounded-lg border border-hairline bg-bg0',
              PREVIEW_BOX[format],
            )}
          >
            {cards ? (
              <img src={cards[format].url} alt={t('share.preview')} className="h-full w-full object-contain" />
            ) : failed ? (
              <p className="px-4 text-center text-sm text-down">{t('share.renderFailed')}</p>
            ) : (
              <Loader2 className="h-6 w-6 animate-spin text-t3" aria-hidden />
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={shareImage} disabled={!cards} className={action}>
              {fileShare ? <Share2 className="h-4 w-4" aria-hidden /> : <Download className="h-4 w-4" aria-hidden />}
              {fileShare ? t('share.image') : t('share.download')}
            </button>
            <button type="button" onClick={copy} disabled={!snap} className={action}>
              <Copy className="h-4 w-4" aria-hidden />
              {t('share.copy')}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
