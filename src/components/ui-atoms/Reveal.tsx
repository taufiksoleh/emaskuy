/**
 * Reveal — fades and slides its content in once it scrolls into view: a CSS
 * transition started by an IntersectionObserver (styles in index.css).
 * The home page and the shared chrome use this instead of framer-motion's
 * `whileInView`, which keeps the animation library out of the main bundle.
 * prefers-reduced-motion shows the content at once.
 */
import { useEffect, useRef, useState, type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface RevealProps extends HTMLAttributes<HTMLElement> {
  as?: 'div' | 'li' | 'span' | 'footer';
  /** Starting offset in px; the content slides back to 0. */
  x?: number;
  y?: number;
  /** Seconds. */
  delay?: number;
  duration?: number;
  /** Share of the element that must be visible to start, 0–1. */
  amount?: number;
}

export function Reveal({
  as = 'div',
  x = 0,
  y = 24,
  delay = 0,
  duration = 0.45,
  amount = 0.15,
  className,
  style,
  children,
  ...rest
}: RevealProps) {
  // Typed as a div; `as` only changes the tag, never the props used here.
  const ref = useRef<HTMLDivElement>(null);
  // Without IntersectionObserver (very old browsers) the content just shows.
  const [shown, setShown] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: amount },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [amount]);

  const Tag = as as 'div';
  return (
    <Tag
      {...rest}
      ref={ref}
      className={cn('reveal', shown && 'is-revealed', className)}
      style={
        {
          '--reveal-x': `${x}px`,
          '--reveal-y': `${y}px`,
          transitionDuration: `${duration}s`,
          transitionDelay: delay > 0 ? `${delay}s` : undefined,
          ...style,
        } as CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
