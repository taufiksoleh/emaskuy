import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// afterPaint keeps "has the first screen painted" in module state, so each
// test loads a fresh copy.
describe('afterFirstPaint', () => {
  let frames: Array<() => void> = [];
  const nextFrame = () => {
    const due = frames;
    frames = [];
    due.forEach((cb) => cb());
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.resetModules();
    frames = [];
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => frames.push(() => cb(0)));
    vi.stubGlobal('cancelAnimationFrame', () => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('runs after two frames and a task, and at once after that', async () => {
    const { afterFirstPaint } = await import('./afterPaint');
    const first = vi.fn();
    afterFirstPaint(first);
    nextFrame();
    nextFrame();
    expect(first).not.toHaveBeenCalled();
    vi.advanceTimersByTime(0);
    expect(first).toHaveBeenCalledTimes(1);

    const later = vi.fn();
    afterFirstPaint(later);
    expect(later).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(1000);
    expect(first).toHaveBeenCalledTimes(1);
  });

  it('falls back to a timeout when no frames come (hidden tab)', async () => {
    const { afterFirstPaint } = await import('./afterPaint');
    const fn = vi.fn();
    afterFirstPaint(fn, 300);
    vi.advanceTimersByTime(299);
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
    nextFrame();
    nextFrame();
    vi.advanceTimersByTime(0);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('can be cancelled', async () => {
    const { afterFirstPaint } = await import('./afterPaint');
    const fn = vi.fn();
    afterFirstPaint(fn)();
    nextFrame();
    nextFrame();
    vi.advanceTimersByTime(1000);
    expect(fn).not.toHaveBeenCalled();
  });

  it('runs at once where there are no frames (tests, prerender)', async () => {
    vi.unstubAllGlobals();
    const { afterFirstPaint } = await import('./afterPaint');
    const fn = vi.fn();
    afterFirstPaint(fn);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
