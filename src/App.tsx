import { lazy, Suspense } from 'react';
import { MotionConfig } from 'framer-motion';
import { Link, Routes, Route, useLocation } from 'react-router';
import { Toaster } from 'sonner';
import { I18nProvider, registerStrings, useI18n } from '@/lib/i18n';
import { ThemeProvider, useTheme } from '@/hooks/useTheme';
import { Layout } from '@/components/Layout';
import { AppCrashFallback, ErrorBoundary } from '@/components/ErrorBoundary';
import { ScrollToTop } from '@/components/ScrollToTop';
import Home from '@/pages/Home';

// Home is the landing page and ships in the main bundle; every other page
// (and its heavy libraries: GSAP, Lenis, the calculators) loads on demand.
const Analysis = lazy(() => import('@/pages/Analysis'));
const Article = lazy(() => import('@/pages/Article'));
const CalculatorHub = lazy(() => import('@/pages/calculator/CalculatorHub'));
const CalculatorPage = lazy(() => import('@/pages/Calculator'));
const ZakatPage = lazy(() => import('@/pages/calculator/Zakat'));
const PerhiasanPage = lazy(() => import('@/pages/calculator/Perhiasan'));
const TargetPage = lazy(() => import('@/pages/calculator/Target'));
const Portfolio = lazy(() => import('@/pages/Portfolio'));
const About = lazy(() => import('@/pages/About'));
const NotFound = lazy(() => import('@/pages/NotFound'));

function PageFallback() {
  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-10 md:px-6" aria-busy="true">
      <div className="skeleton-shimmer h-10 w-2/3 max-w-md rounded-lg" />
      <div className="skeleton-shimmer h-4 w-full max-w-xl rounded" />
      <div className="skeleton-shimmer mt-4 h-64 w-full rounded-[10px]" />
    </div>
  );
}

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
          fontFamily: '"JetBrains Mono Variable", "JetBrains Mono", monospace',
        },
      }}
    />
  );
}

export default function App() {
  const { pathname } = useLocation();
  return (
    <ErrorBoundary fallback={() => <AppCrashFallback />}>
      <MotionConfig reducedMotion="user">
      <I18nProvider>
        <ThemeProvider>
          <ScrollToTop />
          <Layout>
            <ErrorBoundary resetKey={pathname} fallback={() => <RouteErrorFallback />}>
              <Suspense fallback={<PageFallback />}>
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
              </Suspense>
            </ErrorBoundary>
          </Layout>
          <ThemedToaster />
        </ThemeProvider>
      </I18nProvider>
      </MotionConfig>
    </ErrorBoundary>
  );
}
