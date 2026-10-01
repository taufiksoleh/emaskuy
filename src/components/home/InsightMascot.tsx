/**
 * Kuy — maskot EmasKuy: koin emas bersayap yang melayang di atas AI Insight
 * dan "mengucapkan" isinya lewat SpeechBubble. SVG inline, jadi tanpa aset
 * gambar dan tajam di semua ukuran. Animasinya (melayang, mengepak, kerlip)
 * adalah CSS keyframe di index.css dan mati saat prefers-reduced-motion.
 * Warna koin memakai gradasi emas brand yang tetap di tema gelap maupun
 * terang (seperti tombol CTA), supaya tidak jadi coklat kusam saat `--gold`
 * berubah di tema terang. Ekspresinya mengikuti sentimen insight.
 */
import { useId } from 'react';
import type { InsightSentiment } from '@/lib/aiInsight';
import { cn } from '@/lib/utils';

const INK = '#1a1305';

/** Alis dan mulut per sentimen, dalam koordinat viewBox 96×96. */
const FACE: Record<InsightSentiment, { brows: string; mouth: string }> = {
  bullish: { brows: 'M34 40q5.5-6 10-1M52 39q4.5-5 10 1', mouth: 'M39 56q9 9 18 0' },
  neutral: { brows: 'M35 40q5-3 10 0M51 40q5-3 10 0', mouth: 'M42 58q6 4.5 12 0' },
  bearish: { brows: 'M35 41q5-2 10-3M51 38q5-1 10 3', mouth: 'M42 60q6-4 12 0' },
};

/** Bintang empat sudut berpusat di (cx, cy) dengan jari-jari luar r. */
function star(cx: number, cy: number, r: number): string {
  const i = r * 0.38;
  return (
    `M${cx} ${cy - r}L${cx + i} ${cy - i}L${cx + r} ${cy}L${cx + i} ${cy + i}` +
    `L${cx} ${cy + r}L${cx - i} ${cy + i}L${cx - r} ${cy}L${cx - i} ${cy - i}Z`
  );
}

interface InsightMascotProps {
  sentiment: InsightSentiment;
  className?: string;
}

export function InsightMascot({ sentiment, className }: InsightMascotProps) {
  // Id gradien harus unik per instance; tanda baca dari useId dibuang agar
  // aman dipakai di dalam url(#…).
  const uid = 'kuy' + useId().replace(/\W/g, '');
  const coin = `${uid}-coin`;
  const rim = `${uid}-rim`;
  const face = FACE[sentiment];

  return (
    <svg
      viewBox="0 0 96 96"
      className={cn('h-full w-full overflow-visible', className)}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={coin} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd975" />
          <stop offset="0.45" stopColor="#f5b93e" />
          <stop offset="1" stopColor="#c98a1b" />
        </linearGradient>
        <linearGradient id={rim} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c98a1b" />
          <stop offset="1" stopColor="#8a5a10" />
        </linearGradient>
      </defs>

      {/* Bayangan di "tanah": tidak ikut melayang, hanya mengecil saat koin naik */}
      <ellipse className="mascot-shadow" cx="48" cy="91" rx="17" ry="3.5" fill="var(--gold)" opacity="0.22" />

      <g className="mascot-float">
        {/* Sayap digambar sebelum koin supaya pangkalnya tersembunyi di baliknya */}
        <g className="mascot-wing-l">
          <path
            d="M30 46C24 30 4 28 2 40C0 50 12 60 30 58Z"
            fill="#ffd975"
            stroke="#c98a1b"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M8 40c6 2 12 6 18 10M6 47c6 1 13 3 20 6" fill="none" stroke="#c98a1b" strokeWidth="1" opacity="0.6" />
        </g>
        <g className="mascot-wing-r">
          <path
            d="M66 46C72 30 92 28 94 40C96 50 84 60 66 58Z"
            fill="#ffd975"
            stroke="#c98a1b"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M88 40c-6 2-12 6-18 10M90 47c-6 1-13 3-20 6" fill="none" stroke="#c98a1b" strokeWidth="1" opacity="0.6" />
        </g>

        {/* Koin */}
        <circle cx="48" cy="50" r="26" fill={`url(#${coin})`} stroke={`url(#${rim})`} strokeWidth="3" />
        <circle cx="48" cy="50" r="21" fill="none" stroke="#c98a1b" strokeWidth="1.25" opacity="0.55" />
        <path d="M30 40a21 21 0 0 1 10-12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />

        {/* Wajah */}
        <circle cx="34" cy="54" r="2.8" fill="#e5733a" opacity="0.3" />
        <circle cx="62" cy="54" r="2.8" fill="#e5733a" opacity="0.3" />
        <path d={face.brows} fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
        <circle cx="39" cy="47" r="3.2" fill={INK} />
        <circle cx="57" cy="47" r="3.2" fill={INK} />
        <circle cx="40.2" cy="45.8" r="1" fill="#fff" />
        <circle cx="58.2" cy="45.8" r="1" fill="#fff" />
        <path d={face.mouth} fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* Kerlip: --gold-bright tetap terlihat di tema terang */}
      <path className="mascot-sparkle" d={star(13, 20, 5)} fill="var(--gold-bright)" />
      <path className="mascot-sparkle" style={{ animationDelay: '0.8s' }} d={star(84, 14, 6.5)} fill="var(--gold-bright)" />
      <path className="mascot-sparkle" style={{ animationDelay: '1.6s' }} d={star(88, 70, 4)} fill="var(--gold-bright)" />
    </svg>
  );
}
