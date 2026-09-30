/**
 * True once the first screen has painted and the browser is idle (or after
 * `timeout` ms). Below-the-fold parts that pull large chunks (the price
 * chart, the article previews) wait for this, so they don't compete with the
 * first paint.
 */
import { useEffect, useState } from 'react';
import { afterFirstPaint } from '@/lib/afterPaint';

export function useIdleAfterPaint(timeout = 2000): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const done = () => setReady(true);
    let cancelIdle = () => {};
    const cancelPaint = afterFirstPaint(() => {
      if (typeof window.requestIdleCallback === 'function') {
        const id = window.requestIdleCallback(done, { timeout });
        cancelIdle = () => window.cancelIdleCallback(id);
      } else {
        const id = window.setTimeout(done, 50);
        cancelIdle = () => window.clearTimeout(id);
      }
    });
    return () => {
      cancelPaint();
      cancelIdle();
    };
  }, [timeout]);

  return ready;
}
