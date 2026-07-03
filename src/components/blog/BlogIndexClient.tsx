'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useLocaleStore } from '@/lib/stores/localeStore';
import type { BlogIndexConfig } from '@/types/blog';

interface BlogIndexClientProps {
  dataByLocale: Record<string, BlogIndexConfig>;
  defaultLocale: string;
}

function formatPostDate(date: string, locale: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(parsed);
}

export default function BlogIndexClient({ dataByLocale, defaultLocale }: BlogIndexClientProps) {
  const locale = useLocaleStore((state) => state.locale);
  const fallback = dataByLocale[defaultLocale] || Object.values(dataByLocale)[0];
  const data = dataByLocale[locale] || fallback;

  if (!data) {
    return null;
  }

  const readLabel = locale === 'zh' ? '阅读全文' : 'Read post';
  const emptyLabel = locale === 'zh'
    ? '这里还没有文章。'
    : 'No posts yet.';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-serif font-bold text-primary mb-4">{data.title}</h1>
        {data.description && (
          <p className="text-lg text-neutral-600 dark:text-neutral-500 max-w-2xl">
            {data.description}
          </p>
        )}
      </motion.header>

      {data.posts.length === 0 ? (
        <p className="text-neutral-600 dark:text-neutral-500">{emptyLabel}</p>
      ) : (
        <div className="space-y-5">
          {data.posts.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              className="card-bg rounded-lg border border-neutral-200 dark:border-neutral-700 p-5 sm:p-6 transition-all duration-200 hover:border-accent/60 hover:shadow-md"
            >
              <div className="flex flex-col gap-3">
                <time className="text-sm text-neutral-500" dateTime={post.date}>
                  {formatPostDate(post.date, locale)}
                </time>
                <div>
                  <h2 className="text-2xl font-serif font-bold text-primary mb-2">
                    <Link href={`/blog/${post.slug}`} className="hover:text-accent transition-colors duration-200">
                      {post.title}
                    </Link>
                  </h2>
                  {post.summary && (
                    <p className="text-neutral-600 dark:text-neutral-500 leading-relaxed">
                      {post.summary}
                    </p>
                  )}
                </div>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent-dark dark:text-accent"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 self-start text-sm font-medium text-accent transition-colors duration-200 hover:text-accent-dark"
                >
                  {readLabel}
                  <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}
