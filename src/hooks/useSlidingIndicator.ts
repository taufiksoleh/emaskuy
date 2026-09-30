/**
 * One indicator that slides to the selected item of a nav bar or segmented
 * control: the child matching `selector` (e.g. `[aria-current="page"]`),
 * measured from the DOM. The container must be `position: relative`.
 * Returns null while nothing is selected. `moved` is false for the first
 * placement, so the indicator appears in place and only slides afterwards.
 */
import { useLayoutEffect, useRef, useState } from 'react';

/** Class for the indicator once it has been placed (so it slides, but doesn't fly in); see index.css. */
export const SLIDE_CLASS = 'slide-indicator';

export interface IndicatorBox {
  x: number;
  y: number;
  w: number;
  h: number;
  moved: boolean;
}

/** `selected` is whatever identifies the selection (a value or the path); a change re-measures. */
export function useSlidingIndicator<T extends HTMLElement>(selector: string, selected: unknown) {
  const ref = useRef<T>(null);
  const [box, setBox] = useState<IndicatorBox | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const item = el.querySelector<HTMLElement>(selector);
      setBox((prev) => {
        if (!item) return null;
        const next = { x: item.offsetLeft, y: item.offsetTop, w: item.offsetWidth, h: item.offsetHeight };
        if (prev && prev.x === next.x && prev.y === next.y && prev.w === next.w && prev.h === next.h) return prev;
        return { ...next, moved: prev !== null };
      });
    };
    measure();
    // Web fonts and language switches change item widths.
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    for (const child of Array.from(el.children)) ro.observe(child);
    return () => ro.disconnect();
  }, [selector, selected]);

  return { ref, box };
}
