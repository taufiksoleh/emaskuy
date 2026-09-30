/**
 * EmasKuy — URLs of the responsive image copies made by scripts/images.mjs.
 */
import { withBase } from './utils';

export const IMG_WIDTHS = [480, 960, 1440] as const;

const nameOf = (src: string) => /\/([\w-]+)\.(?:png|jpe?g)$/i.exec(src)?.[1] ?? null;

/** WebP srcset for a public/ image, or null for other sources. */
export function webpSrcSet(src: string): string | null {
  const name = nameOf(src);
  return name ? IMG_WIDTHS.map((w) => `${withBase(`/_img/${name}-${w}.webp`)} ${w}w`).join(', ') : null;
}

/** 1200×630 JPEG for link previews, e.g. og:image. */
export function ogImagePath(src: string): string | null {
  const name = nameOf(src);
  return name ? `/_img/og/${name}.jpg` : null;
}
