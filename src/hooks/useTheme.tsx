/**
 * useTheme — light/dark theme context (dark is the brand default).
 *
 * Persists to localStorage (`emaskuy.theme`), applies via
 * `document.documentElement.dataset.theme`. index.html carries a tiny
 * inline script that applies the saved theme before first paint, so there
 * is no flash of the wrong theme on reload.
 *
 * Also exposes `chartPalette(theme)`: concrete color strings for
 * lightweight-charts (canvas rendering cannot resolve CSS variables).
 */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { registerStrings } from '@/lib/i18n';

registerStrings({
  'theme.toLight': { id: 'Mode Terang', en: 'Light mode' },
  'theme.toDark': { id: 'Mode Gelap', en: 'Dark mode' },
});

export type Theme = 'dark' | 'light';

const THEME_KEY = 'emaskuy.theme';

function detectTheme(): Theme {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    /* ignore */
  }
  // Dark is the brand identity default.
  return 'dark';
}

export interface ThemeValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeValue | null>(null);

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const t = detectTheme();
    // Sync with the inline script / correct it before first React paint.
    if (typeof document !== 'undefined') applyTheme(t);
    return t;
  });

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    applyTheme(t);
    try {
      localStorage.setItem(THEME_KEY, t);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  const value = useMemo(() => ({ theme, toggleTheme, setTheme }), [theme, toggleTheme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}

/** Concrete chart colors — mirrors the CSS tokens of the active theme. */
export interface ChartPalette {
  gold: string;
  goldDim: string;
  up: string;
  down: string;
  axisText: string;
  gridLine: string;
  areaTop: string;
  areaBottom: string;
}

export function chartPalette(theme: Theme): ChartPalette {
  if (theme === 'light') {
    return {
      gold: '#9A6A08',
      goldDim: '#8A6D2F',
      up: '#15803D',
      down: '#DC2626',
      axisText: '#6B7383',
      gridLine: 'rgba(74, 82, 97, 0.18)',
      areaTop: 'rgba(154, 106, 8, 0.18)',
      areaBottom: 'rgba(154, 106, 8, 0)',
    };
  }
  return {
    gold: '#F5B93E',
    goldDim: '#8A6D2F',
    up: '#22C55E',
    down: '#EF4444',
    axisText: '#5B6474',
    gridLine: 'rgba(36, 41, 56, 0.6)',
    areaTop: 'rgba(245, 185, 62, 0.22)',
    areaBottom: 'rgba(245, 185, 62, 0)',
  };
}
