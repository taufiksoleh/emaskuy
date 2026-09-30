/**
 * ShareDialog — share today's price as a WhatsApp message or as an image
 * card (chat square or status/story). The cards are drawn when the dialog
 * opens, so the share button can call navigator.share straight from the
 * click (Safari rejects it after async work).
 */
import { useEffect, useState } from 'react';
import { Copy, Download, Loader2, Share2, X } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { copyText } from '@/lib/clipboard';
import { registerStrings, useI18n } from '@/lib/i18n';
import {
  canShareFiles,
  renderShareCard,
  shareOrDownload,
  type CardFormat,
  type ShareCardModel,
} from '@/lib/shareCard';
import { cn } from '@/lib/utils';
import { SegToggle } from '../ui-atoms/SegToggle';
import { WhatsAppButton } from './WhatsAppButton';

registerStrings({
  'share.open': { id: 'Bagikan', en: 'Share' },
  'share.title': { id: 'Bagikan harga emas', en: 'Share the gold price' },
  'share.desc': {
    id: 'Kirim sebagai pesan WhatsApp, atau bagikan gambarnya ke chat dan status.',
    en: 'Send it as a WhatsApp message, or share the image to chats and status.',
  },
  'share.format': { id: 'Format gambar', en: 'Image format' },
  'share.square': { id: 'Chat', en: 'Chat' },
  'share.story': { id: 'Status / Story', en: 'Status / Story' },
  'share.image': { id: 'Bagikan gambar', en: 'Share image' },
  'share.download': { id: 'Unduh gambar', en: 'Download image' },
  'share.copy': { id: 'Salin teks', en: 'Copy text' },
  'share.copied': { id: 'Teks disalin', en: 'Text copied' },
  'share.copyFailed': { id: 'Gagal menyalin teks', en: 'Could not copy the text' },
  'share.downloaded': { id: 'Gambar diunduh', en: 'Image downloaded' },
  'share.renderFailed': { id: 'Gambar gagal dibuat', en: 'Could not create the image' },
  'share.close': { id: 'Tutup', en: 'Close' },
  'share.preview': { id: 'Pratinjau kartu harga', en: 'Price card preview' },
});

interface Snapshot {
  model: ShareCardModel;
  text: string;
}

type Cards = Record<CardFormat, { blob: Blob; url: string }>;

export function ShareDialog({
  build,
  filename,
  className,
}: {
  /** Called on open, so the card shows the price at that moment */
  build: () => Snapshot;
  filename: string;
  className?: string;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [snap, setSnap] = useState<Snapshot | null>(null);
  const [cards, setCards] = useState<Cards | null>(null);
  const [failed, setFailed] = useState(false);
  const [format, setFormat] = useState<CardFormat>('square');
  const [fileShare] = useState(canShareFiles);

  useEffect(() => {
    if (!snap) return;
    let cancelled = false;
    let made: Cards | null = null;
    Promise.all([renderShareCard(snap.model, 'square'), renderShareCard(snap.model, 'story')])
      .then(([square, story]) => {
        if (cancelled) return;
        made = {
          square: { blob: square, url: URL.createObjectURL(square) },
          story: { blob: story, url: URL.createObjectURL(story) },
        };
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
    'flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-hairline bg-bg2 px-4 py-2 font-display text-sm font-medium text-t1 transition-colors hover:border-goldline hover:text-gold disabled:cursor-wait disabled:opacity-50';

  return (
    <>
      <button
        type="button"
        onClick={() => onOpenChange(true)}
        className={cn(
          'flex cursor-pointer items-center gap-1.5 rounded-md border border-hairline bg-bg2 px-2 py-1.5 font-display text-xs font-medium text-t2 transition-colors hover:border-goldline hover:text-gold',
          className,
        )}
      >
        <Share2 className="h-3.5 w-3.5" aria-hidden />
        {t('share.open')}
      </button>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="z-[100] max-h-[92dvh] gap-4 overflow-y-auto border-goldline bg-bg1 p-5 text-t1 sm:max-w-md"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <DialogTitle className="font-display text-lg font-semibold text-t1">{t('share.title')}</DialogTitle>
              <DialogDescription className="mt-1 text-sm text-t2">{t('share.desc')}</DialogDescription>
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
            options={[
              { value: 'square', label: t('share.square') },
              { value: 'story', label: t('share.story') },
            ]}
          />

          <div
            className={cn(
              'mx-auto flex w-full items-center justify-center overflow-hidden rounded-lg border border-hairline bg-bg0',
              format === 'square' ? 'aspect-square max-w-[320px]' : 'aspect-[9/16] max-w-[220px]',
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
