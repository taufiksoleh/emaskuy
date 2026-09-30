/**
 * Runs `fn` once the app's first screen has been painted: two animation
 * frames, then a task, so it lands after the frame that shows the initial
 * render. Later calls run at once. Without frames (a hidden tab) it runs
 * after `fallbackMs`. Returns a cancel function.
 *
 * Network requests that aren't needed for the first screen start here, so
 * they don't compete with it for bandwidth and main-thread time.
 */
let painted = false;

export function afterFirstPaint(fn: () => void, fallbackMs = 300): () => void {
  if (painted || typeof requestAnimationFrame === 'undefined') {
    fn();
    return () => {};
  }
  let done = false;
  let frame = 0;
  let task: ReturnType<typeof setTimeout> | undefined;
  const run = () => {
    if (done) return;
    done = true;
    clearTimeout(fallback);
    fn();
  };
  const fallback = setTimeout(run, fallbackMs);
  frame = requestAnimationFrame(() => {
    frame = requestAnimationFrame(() => {
      task = setTimeout(() => {
        painted = true;
        run();
      }, 0);
    });
  });
  return () => {
    done = true;
    cancelAnimationFrame(frame);
    clearTimeout(task);
    clearTimeout(fallback);
  };
}
