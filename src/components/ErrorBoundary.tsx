/**
 * ErrorBoundary — keeps a render crash from blanking the whole app.
 *
 * App.tsx uses two: an outer one with a static bilingual fallback (no hooks,
 * since the providers themselves may be what failed) and an inner one
 * around the routes that resets when the path changes.
 */
import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  fallback: (reset: () => void) => ReactNode;
  /** Clear the error when this value changes (e.g. the route path). */
  resetKey?: string;
  children: ReactNode;
}

interface State {
  error: Error | null;
  resetKey?: string;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, resetKey: this.props.resetKey };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  static getDerivedStateFromProps(props: Props, state: State): Partial<State> | null {
    if (props.resetKey !== state.resetKey) return { error: null, resetKey: props.resetKey };
    return null;
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('EmasKuy render error', error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    return this.state.error ? this.props.fallback(this.reset) : this.props.children;
  }
}

/** Last-resort screen when the providers themselves crashed. */
export function AppCrashFallback() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-bg0 px-6 text-center text-t1">
      <p className="font-display text-2xl font-semibold">Terjadi kesalahan · Something went wrong</p>
      <p className="max-w-md text-sm text-t2">
        Muat ulang halaman untuk mencoba lagi. · Reload the page to try again.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="cursor-pointer rounded-lg bg-gold px-5 py-2.5 font-display text-sm font-semibold text-bg0"
      >
        Muat ulang · Reload
      </button>
    </div>
  );
}
