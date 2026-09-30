/**
 * Img — a public/ image served as responsive WebP (built by
 * scripts/images.mjs), with the original file as the fallback.
 * WebpSource is the <source> alone, for wrapping an animated motion.img.
 */
import type { ImgHTMLAttributes, Ref } from 'react';
import { webpSrcSet } from '@/lib/img';

export function WebpSource({ src, sizes }: { src: string; sizes: string }) {
  const srcSet = webpSrcSet(src);
  return srcSet ? <source type="image/webp" srcSet={srcSet} sizes={sizes} /> : null;
}

export function Img({
  src,
  sizes,
  ref,
  ...rest
}: ImgHTMLAttributes<HTMLImageElement> & { src: string; sizes: string; ref?: Ref<HTMLImageElement> }) {
  return (
    // display: contents keeps the <img> laid out as a direct child
    <picture className="contents">
      <WebpSource src={src} sizes={sizes} />
      <img ref={ref} src={src} {...rest} />
    </picture>
  );
}
