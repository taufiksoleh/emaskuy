import { Link, Routes, Route, useLocation } from 'react-router';
import { Toaster } from 'sonner';
import { I18nProvider, registerStrings, useI18n } from '@/lib/i18n';
import { ThemeProvider, useTheme } from '@/hooks/useTheme';
import { Layout } from '@/components/Layout';
import { AppCrashFallback, ErrorBoundary } from '@/components/ErrorBoundary';
import { ScrollToTop } from '@/components/ScrollToTop';
import Home from '@/pages/Home';
import Analysis from '@/pages/Analysis';
import Article from '@/pages/Article';
import CalculatorPage from '@/pages/Calculator';
import CalculatorHub from '@/pages/calculator/CalculatorHub';
import ZakatPage from '@/pages/calculator/Zakat';
import PerhiasanPage from '@/pages/calculator/Perhiasan';
import TargetPage from '@/pages/calculator/Target';
import Portfolio from '@/pages/Portfolio';
import About from '@/pages/About';
import NotFound from '@/pages/NotFound';

registerStrings({
  'error.title': { id: 'Bagian ini gagal dimuat', en: 'This part failed to load' },
  'error.body': {
    id: 'Terjadi kesalahan saat menampilkan halaman. Coba muat ulang.',
    en: 'Something went wrong while showing this page. Try reloading.',
  },
  'error.reload': { id: 'Muat ulang', en: 'Reload' },
  'error.home': { id: 'Ke beranda', en: 'Go home' },
});

function RouteErrorFallback() {
  const { t } = useI18n();
  return (
    <div className="mx-auto flex max-w-[720px] flex-col items-center px-4 py-24 text-center" role="alert">
      <p className="font-display text-2xl font-semibold text-t1">{t('error.title')}</p>
      <p className="mt-3 text-sm text-t2">{t('error.body')}</p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => window.location.reload()}
          className="cursor-pointer rounded-lg bg-gold px-4 py-2.5 font-display text-sm font-semibold text-bg0"
        >
          {t('error.reload')}
        </button>
        <Link
          to="/"
          className="rounded-lg border border-hairline bg-bg2 px-4 py-2.5 font-display text-sm font-medium text-t2"
        >
          {t('error.home')}
        </Link>
      </div>
    </div>
  );
}

function ThemedToaster() {
  const { theme } = useTheme();
  return (
    <Toaster
      theme={theme}
      position="bottom-right"
      toastOptions={{
        style: {
          background: 'var(--bg-2)',
          border: '1px solid var(--line-gold)',
          color: 'var(--text-1)',
          fontFamily: '"JetBrains Mono", monospace',
        },
      }}
    />
  );
}

export default function App() {
  const { pathname } = useLocation();
  return (
    <ErrorBoundary fallback={() => <AppCrashFallback />}>
      <I18nProvider>
        <ThemeProvider>
          <ScrollToTop />
          <Layout>
            <ErrorBoundary resetKey={pathname} fallback={() => <RouteErrorFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/analisis" element={<Analysis />} />
                <Route path="/analisis/:slug" element={<Article />} />
                <Route path="/kalkulator" element={<CalculatorHub />}>
                  <Route index element={<CalculatorPage />} />
                  <Route path="zakat" element={<ZakatPage />} />
                  <Route path="perhiasan" element={<PerhiasanPage />} />
                  <Route path="target" element={<TargetPage />} />
                </Route>
                <Route path="/portofolio" element={<Portfolio />} />
                <Route path="/tentang" element={<About />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ErrorBoundary>
          </Layout>
          <ThemedToaster />
        </ThemeProvider>
      </I18nProvider>
    </ErrorBoundary>
  );
}
