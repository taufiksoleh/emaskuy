/**
 * EmasKuy — price card images for WhatsApp chats and status (Canvas 2D).
 *
 * Square 1080×1080 for chats and feeds, 1080×1920 for WhatsApp status and
 * stories. Always drawn in the dark brand palette so shared cards look the
 * same whichever theme the sender uses.
 */

export type CardFormat = 'square' | 'story';

export const CARD_SIZE: Record<CardFormat, [number, number]> = {
  square: [1080, 1080],
  story: [1080, 1920],
};

export interface ShareCardModel {
  /** e.g. "Harga Emas Hari Ini" */
  title: string;
  /** e.g. "Rab, 30 Sep 2026 · 09.15 WIB" */
  dateLine: string;
  price: string;
  /** e.g. "per gram" */
  unit: string;
  change: { text: string; up: boolean } | null;
  /** Secondary facts, one per line */
  lines: string[];
  /** Recent daily values for the story sparkline */
  spark: number[];
  /** Caption above the sparkline, e.g. "30 hari terakhir" */
  sparkLabel: string;
  footer: string;
}

const P = {
  bg: '#0a0b0e',
  panel: '#101218',
  line: '#242938',
  gold: '#f5b93e',
  goldBright: '#ffd975',
  goldDeep: '#c98a1b',
  text1: '#f2f4f8',
  text2: '#9aa3b2',
  text3: '#808a9b',
  up: '#22c55e',
  down: '#ef4444',
};

/** The single path of public/logo.svg (viewBox 74.523 × 80). */
const LOGO_PATH =
  'M0 0 L16.0 0 L16.0 80.0 L0 80.0 Z M0 0 L64.0 0 L64.0 16.0 L0 16.0 Z M0 64.0 L64.0 64.0 L64.0 80.0 L0 80.0 Z M1.863 51.153 L54.499 45.432 L52.773 29.525 L0.137 35.247 Z M73.523 35.358 L54.994 50.207 L52.278 24.751 Z';

const FONTS = {
  display: '"Space Grotesk", "Inter", system-ui, sans-serif',
  body: '"Inter", system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
};

/** Largest size (step 2) at which `measure(size)` fits `maxWidth`. */
export function fitFontSize(measure: (size: number) => number, maxWidth: number, max: number, min: number): number {
  let size = max;
  while (size > min && measure(size) > maxWidth) size -= 2;
  return Math.max(min, size);
}

/** Wait for the web fonts the card uses, but never more than `timeoutMs`. */
async function fontsReady(sample: string, timeoutMs = 3000): Promise<void> {
  if (typeof document === 'undefined' || !document.fonts) return;
  const loads = [
    `700 120px ${FONTS.mono}`,
    `500 32px ${FONTS.mono}`,
    `600 32px ${FONTS.body}`,
    `700 44px ${FONTS.display}`,
  ].map((font) => document.fonts.load(font, sample).catch(() => []));
  await Promise.race([Promise.all(loads), new Promise((r) => setTimeout(r, timeoutMs))]);
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
  else ctx.rect(x, y, w, h);
}

function drawSpark(ctx: CanvasRenderingContext2D, values: number[], x: number, y: number, w: number, h: number) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const px = (i: number) => x + (i / (values.length - 1)) * w;
  const py = (v: number) => y + h - ((v - min) / span) * h;

  const fill = ctx.createLinearGradient(0, y, 0, y + h);
  fill.addColorStop(0, 'rgba(245,185,62,0.28)');
  fill.addColorStop(1, 'rgba(245,185,62,0)');
  ctx.beginPath();
  values.forEach((v, i) => (i === 0 ? ctx.moveTo(px(i), py(v)) : ctx.lineTo(px(i), py(v))));
  ctx.lineTo(px(values.length - 1), y + h);
  ctx.lineTo(px(0), y + h);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();

  ctx.beginPath();
  values.forEach((v, i) => (i === 0 ? ctx.moveTo(px(i), py(v)) : ctx.lineTo(px(i), py(v))));
  ctx.strokeStyle = P.gold;
  ctx.lineWidth = 5;
  ctx.lineJoin = 'round';
  ctx.stroke();

  const last = values[values.length - 1];
  ctx.beginPath();
  ctx.arc(px(values.length - 1), py(last), 11, 0, Math.PI * 2);
  ctx.fillStyle = P.goldBright;
  ctx.fill();
}

/** Draw the card and encode it as PNG. */
export async function renderShareCard(model: ShareCardModel, format: CardFormat): Promise<Blob> {
  await fontsReady(model.price + model.title);
  const [w, h] = CARD_SIZE[format];
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');
  const story = format === 'story';
  const pad = 96;

  // Background, gold glow and frame
  ctx.fillStyle = P.bg;
  ctx.fillRect(0, 0, w, h);
  const glow = ctx.createRadialGradient(w * 0.15, 0, 0, w * 0.15, 0, w);
  glow.addColorStop(0, 'rgba(245,185,62,0.20)');
  glow.addColorStop(1, 'rgba(245,185,62,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);
  roundedRect(ctx, 40, 40, w - 80, h - 80, 40);
  ctx.strokeStyle = 'rgba(245,185,62,0.35)';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Brand
  ctx.save();
  ctx.translate(pad, pad);
  ctx.scale(0.8, 0.8);
  ctx.fillStyle = P.gold;
  ctx.fill(new Path2D(LOGO_PATH));
  ctx.restore();
  ctx.textBaseline = 'middle';
  ctx.fillStyle = P.text1;
  ctx.font = `700 44px ${FONTS.display}`;
  ctx.fillText('EmasKuy', pad + 86, pad + 34);

  // Title and date
  ctx.textBaseline = 'alphabetic';
  let y = story ? 480 : 330;
  ctx.fillStyle = P.gold;
  ctx.font = `600 34px ${FONTS.body}`;
  ctx.fillText(model.title.toUpperCase(), pad, y);
  y += 58;
  ctx.fillStyle = P.text3;
  ctx.font = `500 32px ${FONTS.mono}`;
  ctx.fillText(model.dateLine, pad, y);

  // Price, sized to fit the width
  const maxWidth = w - pad * 2;
  const size = fitFontSize(
    (s) => {
      ctx.font = `700 ${s}px ${FONTS.mono}`;
      return ctx.measureText(model.price).width;
    },
    maxWidth,
    story ? 180 : 168,
    72,
  );
  y += size + 40;
  ctx.font = `700 ${size}px ${FONTS.mono}`;
  const priceFill = ctx.createLinearGradient(0, y - size, 0, y);
  priceFill.addColorStop(0, P.goldBright);
  priceFill.addColorStop(0.55, P.gold);
  priceFill.addColorStop(1, P.goldDeep);
  ctx.fillStyle = priceFill;
  ctx.fillText(model.price, pad, y);
  y += 64;
  ctx.fillStyle = P.text2;
  ctx.font = `500 36px ${FONTS.body}`;
  ctx.fillText(model.unit, pad, y);

  // Change pill
  if (model.change) {
    y += 48;
    ctx.font = `600 34px ${FONTS.mono}`;
    const tw = ctx.measureText(model.change.text).width;
    const color = model.change.up ? P.up : P.down;
    roundedRect(ctx, pad, y, tw + 56, 68, 34);
    ctx.fillStyle = model.change.up ? 'rgba(34,197,94,0.14)' : 'rgba(239,68,68,0.14)';
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.textBaseline = 'middle';
    ctx.fillText(model.change.text, pad + 28, y + 36);
    ctx.textBaseline = 'alphabetic';
    y += 68;
  }

  // Secondary facts
  y += 36;
  ctx.font = `500 34px ${FONTS.mono}`;
  for (const line of model.lines) {
    y += 56;
    ctx.fillStyle = P.text1;
    ctx.fillText(line, pad, y, maxWidth);
  }

  // Story: 30-day sparkline
  if (story && model.spark.length > 1) {
    const top = Math.max(y + 150, 1180);
    ctx.fillStyle = P.text3;
    ctx.font = `500 30px ${FONTS.body}`;
    ctx.fillText(model.sparkLabel, pad, top - 36);
    drawSpark(ctx, model.spark, pad, top, maxWidth, 380);
  }

  // Footer
  ctx.fillStyle = P.line;
  ctx.fillRect(pad, h - pad - 70, maxWidth, 2);
  ctx.fillStyle = P.gold;
  ctx.font = `600 34px ${FONTS.body}`;
  ctx.fillText('emaskuy.com', pad, h - pad);
  ctx.fillStyle = P.text3;
  ctx.font = `500 26px ${FONTS.body}`;
  ctx.textAlign = 'right';
  ctx.fillText(model.footer, w - pad, h - pad, maxWidth - 260);
  ctx.textAlign = 'left';

  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('PNG encoding failed'))), 'image/png'),
  );
}

export type ShareOutcome = 'shared' | 'cancelled' | 'downloaded';

/** Web Share with the image where supported (Android, iOS), else download. */
export async function shareOrDownload(blob: Blob, filename: string, text: string): Promise<ShareOutcome> {
  const file = new File([blob], filename, { type: 'image/png' });
  if (typeof navigator !== 'undefined' && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], text });
      return 'shared';
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return 'cancelled';
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  return 'downloaded';
}

/** True when this browser can share image files (phones, mostly). */
export function canShareFiles(): boolean {
  try {
    const probe = new File([new Uint8Array(1)], 'probe.png', { type: 'image/png' });
    return typeof navigator !== 'undefined' && !!navigator.canShare?.({ files: [probe] });
  } catch {
    return false;
  }
}
