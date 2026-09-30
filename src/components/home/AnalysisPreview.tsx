/**
 * Section 4 — Latest analysis preview: featured card + 2 compact cards.
 */
import { Link } from 'react-router';
import { Reveal } from '../ui-atoms/Reveal';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { pathFor } from '@/lib/routes';
import { sortedArticles } from '@/data/articles';
import { ArticleCard } from '../ui-atoms/ArticleCard';


export function AnalysisPreview() {
  const { lang, t } = useI18n();
  const [featured, ...rest] = sortedArticles();

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-8 md:px-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-[28px] font-semibold leading-[1.2] tracking-[-0.02em] text-t1">
          {t('home.analysis.title')}
        </h2>
        <Link
          to={pathFor('analysis', lang)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-hairline px-4 py-2 font-display text-sm font-medium text-t1 transition-colors duration-150 hover:border-goldline hover:text-gold"
        >
          {t('home.analysis.viewAll')}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Reveal y={32} amount={0.2} duration={0.5} className="xl:col-span-5">
          {featured && <ArticleCard article={featured} variant="featured" className="h-full" />}
        </Reveal>
        <div className="flex flex-col gap-4 xl:col-span-7">
          {rest.slice(0, 2).map((a, i) => (
            <Reveal key={a.slug} amount={0.2} delay={0.1 + i * 0.1}>
              <ArticleCard article={a} variant="compact" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
