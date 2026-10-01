/**
 * SpeechBubble — kotak berbingkai dengan ekor kecil di kiri atas, dipakai
 * AI Insight untuk "ucapan" maskot. Ekornya persegi yang diputar 45° lewat
 * ::before dengan border dan warna latar yang sama, jadi otomatis ikut tema.
 */
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function SpeechBubble({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      className={cn(
        'relative rounded-2xl border border-goldline bg-bg2 p-4 md:p-5',
        "before:absolute before:-top-[7px] before:left-7 before:h-3 before:w-3 before:rotate-45 before:border-l before:border-t before:border-goldline before:bg-bg2 before:content-[''] md:before:left-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
