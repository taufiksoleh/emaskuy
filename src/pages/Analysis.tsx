/**
 * Analisis Pasar — article index (analysis.md §1–§5).
 * Header cascade, sticky filter bar (category SegToggle + live debounced
 * search), featured story with scroll parallax, re-flowing article grid,
 * newsletter CTA. Framer Motion only (no GSAP on this page).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Search, SearchX } from 'lucide-react';
import { registerStrings, useI18n } from '@/lib/i18n';
import { sortedArticles, type ArticleCategory } from '@/data/articles';
import { formatDate } from '@/lib/gold';
import { ArticleCard } from '@/components/ui-atoms/ArticleCard';
import { SegToggle } from '@/components/ui-atoms/SegToggle';
import { Badge } from '@/components/ui-atoms/Badge';
import { MiniLivePrice } from '@/components/analysis/MiniLivePrice';
import { Newsletter } from '@/components/analysis/Newsletter';

registerStrings({
  'ana.label': { id: 'Analisis Pasar', en: 'Market Analysis' },
  'ana.h1': { id: 'Wawasan yang menggerakkan keputusan', en: 'Insights that move decisions' },
  'ana.sub': {
    id: 'Analisis mendalam tentang tren harga emas, kebijakan bank sentral, dan strategi investasi — diperbarui setiap minggu.',
    en: 'Deep analysis of gold price trends, central-bank policy, and investment strategy — updated weekly.',
  },
  'ana.all': { id: 'Semua', en: 'All' },
  'ana.search': { id: 'Cari artikel…', en: 'Search articles…' },
  'ana.count': { id: 'artikel', en: 'articles' },
  'ana.featured': { id: 'Unggulan', en: 'Featured' },
  'ana.read': { id: 'Baca Analisis', en: 'Read Analysis' },
  'ana.empty': { id: 'Tidak ada artikel ditemukan', en: 'No articles found' },
  'ana.reset': { id: 'Atur ulang filter', en: 'Reset filters' },
});

type Filter = ArticleCategory | 'all';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function Analysis() {
  const { lang, t } = useI18n();
  const [filter, setFilter] = useState<Filter>('all');
  const [rawQuery, setRawQuery] = useState('');
  const [query, setQuery] = useState('');

  // 200ms debounce for the live search
  useEffect(() => {
    const id = setTimeout(() => setQuery(rawQuery.trim().toLowerCase()), 200);
    return () => clearTimeout(id);
  }, [rawQuery]);

  const all = useMemo(() => sortedArticles(), []);
  const featured = all[0];

  const filtered = useMemo(
    () =>
      all.filter((a) => {
        if (filter !== 'all' && a.category !== filter) return false;
        if (!query) return true;
        const hay =
          `${a.title.id} ${a.title.en} ${a.excerpt.id} ${a.excerpt.en}`.toLowerCase();
        return hay.includes(query);
      }),
    [all, filter, query],
  );
  // The featured story keeps its own slot when it matches; grid gets the rest.
  const showFeatured = filtered.some((a) => a.slug === featured.slug) && !query;
  const gridArticles = showFeatured ? filtered.slice(1) : filtered;

  const featuredRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: featuredRef,
    offset: ['start end', 'end start'],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  const meta = `${formatDate(featured.publishedAt, lang)} · ${featured.readMinutes} ${
    lang === 'id' ? 'mnt baca' : 'min read'
  } · ${featured.author[lang]}`;

  return (
    <div className="mx-auto max-w-[1440px] px-4 md:px-6">
      {/* Section 1 — header */}
      <div className="flex flex-wrap items-end justify-between gap-4 pb-6 pt-10">
        <div className="max-w-[640px]">
          {[
            <div key="l" className="label-micro text-gold">{t('ana.label')}</div>,
            <h1
              key="h"
              className="mt-3 font-display text-[40px] font-bold leading-[1.1] tracking-[-0.02em] text-t1"
            >
              {t('ana.h1')}
            </h1>,
            <p key="p" className="mt-3 text-sm leading-[1.5] text-t2">
              {t('ana.sub')}
            </p>,
          ].map((node, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.09, duration: 0.45, ease: EASE }}
            >
              {node}
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.27, duration: 0.45, ease: EASE }}
        >
          <MiniLivePrice />
        </motion.div>
      </div>

      {/* Section 2 — sticky filter bar */}
      <div className="sticky top-16 z-40 -mx-4 border-b border-hairline bg-bg0/85 px-4 py-3 backdrop-blur-[12px] md:-mx-6 md:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="max-w-full overflow-x-auto">
            <SegToggle<Filter>
              ariaLabel={t('ana.label')}
              value={filter}
              onChange={setFilter}
              options={[
                { value: 'all', label: t('ana.all') },
                { value: 'market', label: t('article.cat.market') },
                { value: 'macro', label: t('article.cat.macro') },
                { value: 'strategy', label: t('article.cat.strategy') },
                { value: 'compare', label: t('article.cat.compare') },
              ]}
            />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden font-mono text-[13px] tabular text-t3 sm:inline">
              {filtered.length} {t('ana.count')}
            </span>
            <label className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-t3" />
              <input
                value={rawQuery}
                onChange={(e) => setRawQuery(e.target.value)}
                placeholder={t('ana.search')}
                className="w-[180px] rounded-lg border border-hairline bg-bg3 py-2 pl-8 pr-3 font-mono text-[13px] text-t1 placeholder:text-t3 focus:border-gold/60 focus:outline-none sm:w-[260px]"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Section 3 — featured article with scroll parallax */}
      {showFeatured && (
        <div className="py-6" ref={featuredRef}>
          <Link
            to={`/analisis/${featured.slug}`}
            className="group grid overflow-hidden rounded-[10px] border border-hairline bg-bg1 transition-[border-color,background-color] duration-200 hover:border-goldline hover:bg-bg2 lg:grid-cols-12"
          >
            <div className="relative aspect-video overflow-hidden lg:col-span-7 lg:aspect-auto lg:min-h-[360px]">
              <motion.img
                src={featured.image}
                alt={featured.title[lang]}
                style={{ y: parallaxY }}
                className="absolute inset-0 h-[calc(100%+40px)] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
            </div>
            <div className="flex flex-col justify-center p-5 md:p-8 lg:col-span-5">
              <div className="flex items-center gap-2">
                <span className="label-micro rounded-md bg-bg3 px-2 py-1 text-gold">
                  {t(`article.cat.${featured.category}`)}
                </span>
                <Badge variant="cached" className="border-goldline text-gold">
                  {t('ana.featured')}
                </Badge>
              </div>
              <h2 className="mt-4 font-display text-[28px] font-semibold leading-[1.2] tracking-[-0.02em] text-t1 transition-colors duration-200 group-hover:text-gold">
                {featured.title[lang]}
              </h2>
              <p className="mt-3 line-clamp-3 text-sm leading-[1.5] text-t2">
                {featured.excerpt[lang]}
              </p>
              <div className="mt-4 font-mono text-[13px] tabular text-t3">{meta}</div>
              <div className="mt-6">
                <span className="inline-flex items-center gap-2 rounded-lg border border-hairline px-4 py-2.5 font-display text-sm font-medium text-t1 transition-colors duration-150 group-hover:border-goldline group-hover:text-gold">
                  {t('ana.read')}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Section 4 — article grid with layout re-flow */}
      {gridArticles.length > 0 ? (
        <motion.div layout className="grid gap-4 py-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {gridArticles.map((a, i) => (
              <motion.div
                key={a.slug}
                layout
                initial={{ y: 24, opacity: 0, scale: 0.98 }}
                whileInView={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                transition={{ delay: Math.min(i, 6) * 0.07, duration: 0.45, ease: EASE }}
                viewport={{ once: true, amount: 0.15 }}
              >
                <ArticleCard article={a} variant="featured" className="h-full" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center py-20 text-center"
        >
          <SearchX className="h-12 w-12 text-golddim" />
          <p className="mt-4 font-display text-lg font-medium text-t1">{t('ana.empty')}</p>
          <button
            onClick={() => {
              setRawQuery('');
              setQuery('');
              setFilter('all');
            }}
            className="mt-4 cursor-pointer rounded-lg border border-hairline bg-bg2 px-4 py-2 text-sm text-t2 transition-colors hover:border-goldline hover:text-gold"
          >
            {t('ana.reset')}
          </button>
        </motion.div>
      )}

      {/* Section 5 — newsletter CTA */}
      <div className="py-10">
        <Newsletter />
      </div>
    </div>
  );
}
