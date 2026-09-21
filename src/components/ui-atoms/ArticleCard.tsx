/**
 * ArticleCard — thumbnail 16:9, category chip, title, excerpt, meta row.
 * Hover: thumbnail scale 1.04 + gold border, 250ms (design.md §9).
 *
 * Two layouts: `featured` (vertical, large) and `compact` (horizontal,
 * 160px thumb left + text right).
 */
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/gold';
import { useI18n } from '@/lib/i18n';
import type { Article } from '@/data/articles';

export interface ArticleCardProps {
  article: Article;
  variant?: 'featured' | 'compact';
  className?: string;
}

export function ArticleCard({ article, variant = 'featured', className }: ArticleCardProps) {
  const { lang, t } = useI18n();
  const title = article.title[lang];
  const excerpt = article.excerpt[lang];
  const category = t(`article.cat.${article.category}`);
  const meta = `${formatDate(article.publishedAt, lang)} · ${article.readMinutes} ${
    lang === 'id' ? 'mnt baca' : 'min read'
  }`;

  const thumb = (
    <div
      className={cn(
        'relative overflow-hidden',
        variant === 'featured' ? 'aspect-video w-full' : 'h-full w-40 shrink-0',
      )}
    >
      <img
        src={article.image}
        alt={title}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
      />
      <span className="label-micro absolute left-3 top-3 rounded-md bg-bg0/80 px-2 py-1 text-gold backdrop-blur-sm">
        {category}
      </span>
    </div>
  );

  const body = (
    <div className={cn('flex min-w-0 flex-col', variant === 'featured' ? 'p-4 md:p-5' : 'p-3 md:p-4')}>
      <h3
        className={cn(
          'font-display font-semibold leading-[1.3] tracking-[-0.02em] text-t1 transition-colors duration-200 group-hover:text-gold',
          variant === 'featured' ? 'text-xl' : 'text-base',
        )}
      >
        {title}
      </h3>
      <p
        className={cn(
          'mt-2 text-sm leading-[1.5] text-t2',
          variant === 'featured' ? 'line-clamp-2' : 'line-clamp-2',
        )}
      >
        {excerpt}
      </p>
      <div className="mt-3 font-mono text-[13px] tabular text-t3">{meta}</div>
    </div>
  );

  return (
    <Link
      to={`/analisis?slug=${article.slug}`}
      className={cn(
        'group block overflow-hidden rounded-[10px] border border-hairline bg-bg1 transition-[border-color,background-color] duration-[250ms] hover:border-goldline hover:bg-bg2',
        variant === 'compact' && 'flex',
        className,
      )}
    >
      {thumb}
      {body}
    </Link>
  );
}
