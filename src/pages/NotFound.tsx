/**
 * Page: 404 — any path without a route. Marked noindex.
 */
import { Link } from 'react-router';
import { ArrowLeft, SearchX } from 'lucide-react';
import { registerStrings, useI18n } from '@/lib/i18n';
import { pathFor } from '@/lib/routes';
import { useRouteMeta } from '@/hooks/useDocumentMeta';

registerStrings({
  'notFound.title': { id: 'Halaman tidak ditemukan', en: 'Page not found' },
  'notFound.body': {
    id: 'Tautan ini mungkin salah ketik atau halamannya sudah dipindah.',
    en: 'The link may be mistyped, or the page has moved.',
  },
  'notFound.home': { id: 'Ke harga emas hari ini', en: "See today's gold price" },
  'notFound.analysis': { id: 'Baca analisis', en: 'Read the analysis' },
});

export default function NotFound() {
  const { lang, t } = useI18n();
  useRouteMeta('notFound');

  return (
    <section className="mx-auto flex max-w-[720px] flex-col items-center px-4 py-24 text-center">
      <SearchX className="h-10 w-10 text-t3" aria-hidden />
      <h1 className="mt-4 font-display text-3xl font-bold tracking-[-0.02em] text-t1">{t('notFound.title')}</h1>
      <p className="mt-3 text-sm text-t2">{t('notFound.body')}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          to={pathFor('home', lang)}
          className="inline-flex items-center gap-2 rounded-lg bg-gold px-4 py-2.5 font-display text-sm font-semibold text-bg0"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {t('notFound.home')}
        </Link>
        <Link
          to={pathFor('analysis', lang)}
          className="rounded-lg border border-hairline bg-bg2 px-4 py-2.5 font-display text-sm font-medium text-t2 transition-colors hover:border-goldline hover:text-gold"
        >
          {t('notFound.analysis')}
        </Link>
      </div>
    </section>
  );
}
