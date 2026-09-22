import { Routes, Route } from 'react-router';
import { Toaster } from 'sonner';
import { I18nProvider } from '@/lib/i18n';
import { ThemeProvider, useTheme } from '@/hooks/useTheme';
import { Layout } from '@/components/Layout';
import Home from '@/pages/Home';
import Analysis from '@/pages/Analysis';
import Article from '@/pages/Article';
import CalculatorPage from '@/pages/Calculator';
import About from '@/pages/About';

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
  return (
    <I18nProvider>
      <ThemeProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analisis" element={<Analysis />} />
            <Route path="/analisis/:slug" element={<Article />} />
            <Route path="/kalkulator" element={<CalculatorPage />} />
            <Route path="/tentang" element={<About />} />
          </Routes>
        </Layout>
        <ThemedToaster />
      </ThemeProvider>
    </I18nProvider>
  );
}
