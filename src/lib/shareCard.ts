/**
 * EmasKuy — share card images (Canvas 2D) for WhatsApp, Instagram and TikTok.
 *
 * Three kinds of card: today's price, the AI insight, and an article.
 * Each comes in four formats: square 1080×1080 for chats, portrait
 * 1080×1350 for the Instagram feed, 1080×1920 for WhatsApp status and
 * stories, and 1080×1920 for TikTok with its content kept clear of the
 * app's buttons and caption. Always drawn in the dark brand palette so
 * shared cards look the same whichever theme the sender uses.
 */

export type CardFormat = 'square' | 'portrait' | 'story' | 'tiktok';

/** In the order the share dialog offers them. */
export const CARD_FORMATS: CardFormat[] = ['square', 'portrait', 'story', 'tiktok'];

export const CARD_SIZE: Record<CardFormat, [number, number]> = {
  square: [1080, 1080],
  portrait: [1080, 1350],
  story: [1080, 1920],
  tiktok: [1080, 1920],
};

/** Distance from each canvas edge to the card's content. */
export interface CardArea {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

/** Outer padding of every card. */
const PAD = 96;

/**
 * Content margins per format. TikTok lays its tabs over the top, its like,
 * comment and share buttons down the right, and the caption and music over
 * the bottom, so the content stays inside the area those leave free.
 */
export const CARD_AREA: Record<CardFormat, CardArea> = {
  square: { left: PAD, right: PAD, top: PAD, bottom: PAD },
  portrait: { left: PAD, right: PAD, top: PAD, bottom: PAD },
  story: { left: PAD, right: PAD, top: PAD, bottom: PAD },
  tiktok: { left: PAD, right: 176, top: 200, bottom: 480 },
};

/** Today's price card. */
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

export type CardTone = 'up' | 'down' | 'gold';

/** The daily AI insight. */
export interface InsightCardModel {
  /** e.g. "AI Insight Emas" */
  title: string;
  dateLine: string;
  /** e.g. "Sentimen: Netral" */
  sentiment: { label: string; tone: CardTone };
  bullets: string[];
  /** Shown when not every bullet fits, e.g. "Baca lengkapnya di emaskuy.com" */
  more: string;
  footer: string;
}

/** An analysis article. */
export interface ArticleCardModel {
  /** e.g. "Harga & Tren" */
  category: string;
  title: string;
  excerpt: string;
  /** e.g. "1 Okt 2026 · 6 mnt baca" */
  meta: string;
  /** Same-origin cover image URL; the card falls back to a gold glow without it */
  image: string | null;
  footer: string;
}

export type ShareCard =
  | { kind: 'price'; model: ShareCardModel }
  | { kind: 'insight'; model: InsightCardModel }
  | { kind: 'article'; model: ArticleCardModel };

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

const TONE: Record<CardTone, { color: string; fill: string }> = {
  up: { color: P.up, fill: 'rgba(34,197,94,0.14)' },
  down: { color: P.down, fill: 'rgba(239,68,68,0.14)' },
  gold: { color: P.gold, fill: 'rgba(245,185,62,0.12)' },
};

/** The single path of public/logo.svg (viewBox 74.523 × 80). */
const LOGO_PATH =
  'M0 0 L16.0 0 L16.0 80.0 L0 80.0 Z M0 0 L64.0 0 L64.0 16.0 L0 16.0 Z M0 64.0 L64.0 64.0 L64.0 80.0 L0 80.0 Z M1.863 51.153 L54.499 45.432 L52.773 29.525 L0.137 35.247 Z M73.523 35.358 L54.994 50.207 L52.278 24.751 Z';

const FONTS = {
  display: '"Space Grotesk Variable", "Space Grotesk", system-ui, sans-serif',
  body: '"Inter Variable", "Inter", system-ui, sans-serif',
  mono: '"JetBrains Mono Variable", "JetBrains Mono", ui-monospace, monospace',
};

/** Frame inset and corner radius. */
const FRAME = 40;
/** Space the footer (rule, site name, note) takes above the bottom padding. */
const FOOTER_H = 70;

type Measure = (text: string) => number;

/** Largest size (step 2) at which `measure(size)` fits `maxWidth`. */
export function fitFontSize(measure: (size: number) => number, maxWidth: number, max: number, min: number): number {
  let size = max;
  while (size > min && measure(size) > maxWidth) size -= 2;
  return Math.max(min, size);
}

/** Greedy word wrap. A single word wider than the line is broken by characters. */
export function wrapLines(text: string, maxWidth: number, measure: Measure): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const next = line ? `${line} ${word}` : word;
    if (measure(next) <= maxWidth) {
      line = next;
      continue;
    }
    if (line) lines.push(line);
    if (measure(word) <= maxWidth) {
      line = word;
      continue;
    }
    let chunk = '';
    for (const ch of word) {
      if (chunk && measure(chunk + ch) > maxWidth) {
        lines.push(chunk);
        chunk = ch;
      } else chunk += ch;
    }
    line = chunk;
  }
  if (line) lines.push(line);
  return lines;
}

/** Keep at most `max` lines; the last kept line ends in an ellipsis that fits. */
export function clampLines(lines: string[], max: number, maxWidth: number, measure: Measure): string[] {
  if (max <= 0) return [];
  if (lines.length <= max) return lines;
  const kept = lines.slice(0, max);
  let last = kept[max - 1];
  while (last && measure(`${last}…`) > maxWidth) {
    const cut = last.lastIndexOf(' ');
    last = cut > 0 ? last.slice(0, cut) : last.slice(0, -1);
  }
  kept[max - 1] = `${last.replace(/[\s,.;:–-]+$/, '')}…`;
  return kept;
}

export interface ParagraphFit {
  size: number;
  /** Wrapped lines per paragraph that is drawn (later ones may be dropped) */
  blocks: string[][];
  /** True when text had to be cut to fit */
  clipped: boolean;
}

/**
 * Lay out paragraphs (e.g. bullets) in a box: the largest font size, from
 * `max` down to `min` in steps of 2, at which every paragraph fits. If even
 * `min` is too big, keeps the paragraphs that fit at `min` and cuts the next
 * one short with an ellipsis.
 */
export function fitParagraphs(
  paragraphs: string[],
  maxWidth: number,
  maxHeight: number,
  sizes: { max: number; min: number },
  measureAt: (size: number) => Measure,
  spacing: { lineHeight: number; gap: number },
): ParagraphFit {
  const heightOf = (blocks: string[][], size: number) =>
    blocks.reduce((sum, b) => sum + b.length * size * spacing.lineHeight, 0) +
    Math.max(0, blocks.length - 1) * size * spacing.gap;

  for (let size = sizes.max; size >= sizes.min; size -= 2) {
    const blocks = paragraphs.map((p) => wrapLines(p, maxWidth, measureAt(size)));
    if (heightOf(blocks, size) <= maxHeight) return { size, blocks, clipped: false };
  }

  const size = sizes.min;
  const measure = measureAt(size);
  const lineH = size * spacing.lineHeight;
  const blocks: string[][] = [];
  let used = 0;
  for (const p of paragraphs) {
    const lines = wrapLines(p, maxWidth, measure);
    const gap = blocks.length ? size * spacing.gap : 0;
    const room = Math.floor((maxHeight - used - gap) / lineH);
    if (room >= lines.length) {
      blocks.push(lines);
      used += gap + lines.length * lineH;
      continue;
    }
    if (room >= 2) blocks.push(clampLines(lines, room, maxWidth, measure));
    break;
  }
  return { size, blocks, clipped: true };
}

/** Wait for the web fonts the card uses, but never more than `timeoutMs`. */
async function fontsReady(sample: string, timeoutMs = 3000): Promise<void> {
  if (typeof document === 'undefined' || !document.fonts) return;
  const loads = [
    `700 120px ${FONTS.mono}`,
    `500 32px ${FONTS.mono}`,
    `500 32px ${FONTS.body}`,
    `600 32px ${FONTS.body}`,
    `700 44px ${FONTS.display}`,
  ].map((font) => document.fonts.load(font, sample).catch(() => []));
  await Promise.race([Promise.all(loads), new Promise((r) => setTimeout(r, timeoutMs))]);
}

/** Load a same-origin image, or null when it fails or takes too long. */
function loadImage(src: string, timeoutMs = 5000): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    const timer = setTimeout(() => resolve(null), timeoutMs);
    img.onload = () => {
      clearTimeout(timer);
      resolve(img);
    };
    img.onerror = () => {
      clearTimeout(timer);
      resolve(null);
    };
    img.src = src;
  });
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number | [number, number, number, number],
) {
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
  else ctx.rect(x, y, w, h);
}

function measurer(ctx: CanvasRenderingContext2D, font: (size: number) => string) {
  return (size: number): Measure =>
    (text: string) => {
      ctx.font = font(size);
      return ctx.measureText(text).width;
    };
}

function drawBackground(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = P.bg;
  ctx.fillRect(0, 0, w, h);
  const glow = ctx.createRadialGradient(w * 0.15, 0, 0, w * 0.15, 0, w);
  glow.addColorStop(0, 'rgba(245,185,62,0.20)');
  glow.addColorStop(1, 'rgba(245,185,62,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);
}

function drawFrame(ctx: CanvasRenderingContext2D, w: number, h: number) {
  roundedRect(ctx, FRAME, FRAME, w - FRAME * 2, h - FRAME * 2, FRAME);
  ctx.strokeStyle = 'rgba(245,185,62,0.35)';
  ctx.lineWidth = 3;
  ctx.stroke();
}

function drawBrand(ctx: CanvasRenderingContext2D, a: CardArea) {
  ctx.save();
  ctx.translate(a.left, a.top);
  ctx.scale(0.8, 0.8);
  ctx.fillStyle = P.gold;
  ctx.fill(new Path2D(LOGO_PATH));
  ctx.restore();
  ctx.textBaseline = 'middle';
  ctx.fillStyle = P.text1;
  ctx.font = `700 44px ${FONTS.display}`;
  ctx.fillText('EmasKuy', a.left + 86, a.top + 34);
  ctx.textBaseline = 'alphabetic';
}

function drawFooter(ctx: CanvasRenderingContext2D, w: number, h: number, a: CardArea, note: string) {
  const maxWidth = w - a.left - a.right;
  ctx.fillStyle = P.line;
  ctx.fillRect(a.left, h - a.bottom - FOOTER_H, maxWidth, 2);
  ctx.fillStyle = P.gold;
  ctx.font = `600 34px ${FONTS.body}`;
  ctx.fillText('emaskuy.com', a.left, h - a.bottom);
  ctx.fillStyle = P.text3;
  ctx.font = `500 26px ${FONTS.body}`;
  ctx.textAlign = 'right';
  ctx.fillText(note, w - a.right, h - a.bottom, maxWidth - 260);
  ctx.textAlign = 'left';
}

/** A rounded pill with centred text; returns its width. */
function drawPill(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  tone: CardTone,
  opts: { font: string; height: number; align?: 'left' | 'right' },
): number {
  ctx.font = opts.font;
  const width = ctx.measureText(text).width + 56;
  const left = opts.align === 'right' ? x - width : x;
  roundedRect(ctx, left, y, width, opts.height, opts.height / 2);
  ctx.fillStyle = TONE[tone].fill;
  ctx.fill();
  ctx.strokeStyle = TONE[tone].color;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = TONE[tone].color;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, left + 28, y + opts.height / 2 + 2);
  ctx.textBaseline = 'alphabetic';
  return width;
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

/* ------------------------------------------------------------------ */
/* Price                                                              */
/* ------------------------------------------------------------------ */

const PRICE_TOP: Record<CardFormat, number> = { square: 330, portrait: 420, story: 480, tiktok: 470 };

function drawPriceCard(ctx: CanvasRenderingContext2D, model: ShareCardModel, format: CardFormat, w: number, h: number) {
  const a = CARD_AREA[format];
  drawBackground(ctx, w, h);
  drawFrame(ctx, w, h);
  drawBrand(ctx, a);

  // Title and date
  let y = PRICE_TOP[format];
  ctx.fillStyle = P.gold;
  ctx.font = `600 34px ${FONTS.body}`;
  ctx.fillText(model.title.toUpperCase(), a.left, y);
  y += 58;
  ctx.fillStyle = P.text3;
  ctx.font = `500 32px ${FONTS.mono}`;
  ctx.fillText(model.dateLine, a.left, y);

  // Price, sized to fit the width
  const maxWidth = w - a.left - a.right;
  const size = fitFontSize(
    (s) => {
      ctx.font = `700 ${s}px ${FONTS.mono}`;
      return ctx.measureText(model.price).width;
    },
    maxWidth,
    format === 'square' ? 168 : 180,
    72,
  );
  y += size + 40;
  ctx.font = `700 ${size}px ${FONTS.mono}`;
  const priceFill = ctx.createLinearGradient(0, y - size, 0, y);
  priceFill.addColorStop(0, P.goldBright);
  priceFill.addColorStop(0.55, P.gold);
  priceFill.addColorStop(1, P.goldDeep);
  ctx.fillStyle = priceFill;
  ctx.fillText(model.price, a.left, y);
  y += 64;
  ctx.fillStyle = P.text2;
  ctx.font = `500 36px ${FONTS.body}`;
  ctx.fillText(model.unit, a.left, y);

  // Change pill
  if (model.change) {
    y += 48;
    drawPill(ctx, model.change.text, a.left, y, model.change.up ? 'up' : 'down', {
      font: `600 34px ${FONTS.mono}`,
      height: 68,
    });
    y += 68;
  }

  // Secondary facts
  y += 36;
  ctx.font = `500 34px ${FONTS.mono}`;
  for (const line of model.lines) {
    y += 56;
    ctx.fillStyle = P.text1;
    ctx.fillText(line, a.left, y, maxWidth);
  }

  // Tall formats: 30-day sparkline, in whatever height is left (TikTok)
  if ((format === 'story' || format === 'tiktok') && model.spark.length > 1) {
    const top = format === 'story' ? Math.max(y + 150, 1180) : y + 130;
    const height = format === 'story' ? 380 : Math.min(320, h - a.bottom - FOOTER_H - 60 - top);
    if (height >= 140) {
      ctx.fillStyle = P.text3;
      ctx.font = `500 30px ${FONTS.body}`;
      ctx.fillText(model.sparkLabel, a.left, top - 36);
      drawSpark(ctx, model.spark, a.left, top, maxWidth, height);
    }
  }

  drawFooter(ctx, w, h, a, model.footer);
}

/* ------------------------------------------------------------------ */
/* AI insight                                                         */
/* ------------------------------------------------------------------ */

const INSIGHT_TOP: Record<CardFormat, number> = { square: 250, portrait: 290, story: 400, tiktok: 400 };
const INSIGHT_TEXT: Record<CardFormat, { max: number; min: number }> = {
  square: { max: 34, min: 30 },
  portrait: { max: 38, min: 30 },
  story: { max: 46, min: 32 },
  tiktok: { max: 40, min: 30 },
};

function drawInsightCard(ctx: CanvasRenderingContext2D, model: InsightCardModel, format: CardFormat, w: number, h: number) {
  const a = CARD_AREA[format];
  drawBackground(ctx, w, h);
  drawFrame(ctx, w, h);
  drawBrand(ctx, a);
  const maxWidth = w - a.left - a.right;

  // Title and sentiment on one row, date under them
  let y = INSIGHT_TOP[format];
  ctx.fillStyle = P.gold;
  ctx.font = `600 34px ${FONTS.body}`;
  ctx.fillText(model.title.toUpperCase(), a.left, y);
  drawPill(ctx, model.sentiment.label, w - a.right, y - 44, model.sentiment.tone, {
    font: `600 30px ${FONTS.body}`,
    height: 60,
    align: 'right',
  });
  y += 56;
  ctx.fillStyle = P.text3;
  ctx.font = `500 30px ${FONTS.mono}`;
  ctx.fillText(model.dateLine, a.left, y);
  y += 40;
  ctx.fillStyle = P.line;
  ctx.fillRect(a.left, y, maxWidth, 2);
  y += 40;

  // Bullets, as large as the space allows
  const indent = 40;
  const textWidth = maxWidth - indent;
  const lineHeight = 1.42;
  const bottom = h - a.bottom - FOOTER_H - 48;
  const moreH = 64;
  const font = (s: number) => `500 ${s}px ${FONTS.body}`;
  const spacing = { lineHeight, gap: 0.75 };
  let fit = fitParagraphs(model.bullets, textWidth, bottom - y, INSIGHT_TEXT[format], measurer(ctx, font), spacing);
  if (fit.clipped) {
    fit = fitParagraphs(model.bullets, textWidth, bottom - y - moreH, INSIGHT_TEXT[format], measurer(ctx, font), spacing);
  }

  const lineH = fit.size * lineHeight;
  ctx.font = font(fit.size);
  fit.blocks.forEach((lines, i) => {
    if (i > 0) y += fit.size * spacing.gap;
    ctx.fillStyle = P.gold;
    ctx.beginPath();
    ctx.arc(a.left + 9, y + lineH / 2 - 1, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = P.text1;
    ctx.textBaseline = 'middle';
    for (const line of lines) {
      ctx.fillText(line, a.left + indent, y + lineH / 2);
      y += lineH;
    }
    ctx.textBaseline = 'alphabetic';
  });

  if (fit.clipped) {
    ctx.fillStyle = P.gold;
    ctx.font = `600 30px ${FONTS.body}`;
    ctx.fillText(model.more, a.left + indent, y + 52, textWidth);
  }

  drawFooter(ctx, w, h, a, model.footer);
}

/* ------------------------------------------------------------------ */
/* Article                                                            */
/* ------------------------------------------------------------------ */

const ARTICLE_LAYOUT: Record<
  CardFormat,
  { image: number; title: { max: number; min: number; lines: number }; excerpt: number }
> = {
  square: { image: 440, title: { max: 64, min: 46, lines: 3 }, excerpt: 30 },
  portrait: { image: 580, title: { max: 68, min: 48, lines: 4 }, excerpt: 32 },
  story: { image: 860, title: { max: 76, min: 52, lines: 5 }, excerpt: 36 },
  tiktok: { image: 760, title: { max: 66, min: 48, lines: 4 }, excerpt: 32 },
};

/** Draw `img` to cover the box, cropping the overflow evenly. */
function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const sw = w / scale;
  const sh = h / scale;
  ctx.drawImage(img, (img.naturalWidth - sw) / 2, (img.naturalHeight - sh) / 2, sw, sh, x, y, w, h);
}

function drawArticleCard(
  ctx: CanvasRenderingContext2D,
  model: ArticleCardModel,
  img: HTMLImageElement | null,
  format: CardFormat,
  w: number,
  h: number,
) {
  const layout = ARTICLE_LAYOUT[format];
  const a = CARD_AREA[format];
  drawBackground(ctx, w, h);
  const maxWidth = w - a.left - a.right;

  // Cover image inside the frame's top, fading into the background
  const boxW = w - FRAME * 2;
  const imgBottom = FRAME + layout.image;
  if (img) {
    // Drawn on its own layer whose bottom fades to transparent, so the image
    // melts into the background glow instead of ending in a seam.
    const layer = document.createElement('canvas');
    layer.width = boxW;
    layer.height = layout.image;
    const lctx = layer.getContext('2d');
    if (lctx) {
      drawCover(lctx, img, 0, 0, boxW, layout.image);
      const top = lctx.createLinearGradient(0, 0, 0, 260);
      top.addColorStop(0, 'rgba(10,11,14,0.85)');
      top.addColorStop(1, 'rgba(10,11,14,0)');
      lctx.fillStyle = top;
      lctx.fillRect(0, 0, boxW, 260);
      lctx.globalCompositeOperation = 'destination-in';
      const fade = lctx.createLinearGradient(0, layout.image - 280, 0, layout.image);
      fade.addColorStop(0, 'rgba(0,0,0,1)');
      fade.addColorStop(1, 'rgba(0,0,0,0)');
      lctx.fillStyle = fade;
      lctx.fillRect(0, 0, boxW, layout.image);
      ctx.save();
      roundedRect(ctx, FRAME, FRAME, boxW, layout.image, [FRAME, FRAME, 0, 0]);
      ctx.clip();
      ctx.drawImage(layer, FRAME, FRAME);
      ctx.restore();
    }
  }
  drawFrame(ctx, w, h);
  drawBrand(ctx, a);

  // Category and meta
  let y = imgBottom + 40;
  ctx.fillStyle = P.gold;
  ctx.font = `600 30px ${FONTS.body}`;
  ctx.fillText(model.category.toUpperCase(), a.left, y);
  ctx.fillStyle = P.text3;
  ctx.font = `500 26px ${FONTS.mono}`;
  ctx.textAlign = 'right';
  ctx.fillText(model.meta, w - a.right, y, maxWidth / 2);
  ctx.textAlign = 'left';

  // Title: the largest size that fits its line budget
  const titleFont = (s: number) => `700 ${s}px ${FONTS.display}`;
  const titleAt = measurer(ctx, titleFont);
  let size = layout.title.max;
  let lines = wrapLines(model.title, maxWidth, titleAt(size));
  while (lines.length > layout.title.lines && size > layout.title.min) {
    size -= 2;
    lines = wrapLines(model.title, maxWidth, titleAt(size));
  }
  lines = clampLines(lines, layout.title.lines, maxWidth, titleAt(size));
  const titleLineH = size * 1.14;
  y += 28;
  ctx.font = titleFont(size);
  ctx.fillStyle = P.text1;
  for (const line of lines) {
    y += titleLineH;
    ctx.fillText(line, a.left, y);
  }

  // Excerpt in whatever room is left
  const excerptSize = layout.excerpt;
  const excerptLineH = excerptSize * 1.45;
  const bottom = h - a.bottom - FOOTER_H - 40;
  y += 30;
  const room = Math.floor((bottom - y) / excerptLineH);
  const excerptFont = (s: number) => `500 ${s}px ${FONTS.body}`;
  const measure = measurer(ctx, excerptFont)(excerptSize);
  const excerpt = clampLines(wrapLines(model.excerpt, maxWidth, measure), room, maxWidth, measure);
  ctx.font = excerptFont(excerptSize);
  ctx.fillStyle = P.text2;
  for (const line of excerpt) {
    y += excerptLineH;
    ctx.fillText(line, a.left, y);
  }

  drawFooter(ctx, w, h, a, model.footer);
}

/* ------------------------------------------------------------------ */

function sampleText(card: ShareCard): string {
  switch (card.kind) {
    case 'price':
      return card.model.price + card.model.title;
    case 'insight':
      return card.model.title + card.model.bullets.join(' ');
    case 'article':
      return card.model.title + card.model.excerpt;
  }
}

/** Draw the card and encode it as PNG. */
export async function renderShareCard(card: ShareCard, format: CardFormat): Promise<Blob> {
  const [img] = await Promise.all([
    card.kind === 'article' && card.model.image ? loadImage(card.model.image) : Promise.resolve(null),
    fontsReady(sampleText(card)),
  ]);
  const [w, h] = CARD_SIZE[format];
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');

  if (card.kind === 'price') drawPriceCard(ctx, card.model, format, w, h);
  else if (card.kind === 'insight') drawInsightCard(ctx, card.model, format, w, h);
  else drawArticleCard(ctx, card.model, img, format, w, h);

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
