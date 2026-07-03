'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import BlogMarkdown from '@/components/blog/BlogMarkdown';
import { useLocaleStore } from '@/lib/stores/localeStore';
import type { BlogPost } from '@/types/blog';

interface BlogPostClientProps {
  dataByLocale: Record<string, BlogPost>;
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

export default function BlogPostClient({ dataByLocale, defaultLocale }: BlogPostClientProps) {
  const locale = useLocaleStore((state) => state.locale);
  const fallback = dataByLocale[defaultLocale] || Object.values(dataByLocale)[0];
  const post = dataByLocale[locale] || fallback;

  if (!post) {
    return null;
  }

  const backLabel = locale === 'zh' ? '返回博客' : 'Back to blog';

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 mb-8 text-sm font-medium text-neutral-600 dark:text-neutral-500 transition-colors duration-200 hover:text-accent"
        >
          <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
          {backLabel}
        </Link>

        <header className="mb-8">
          <time className="text-sm text-neutral-500" dateTime={post.date}>
            {formatPostDate(post.date, locale)}
          </time>
          <h1 className="text-4xl font-serif font-bold text-primary mt-3 mb-4">
            {post.title}
          </h1>
          {post.summary && (
            <p className="text-lg text-neutral-600 dark:text-neutral-500 leading-relaxed">
              {post.summary}
            </p>
          )}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
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
        </header>

        <BlogMarkdown content={post.content} />
      </motion.div>
    </article>
  );
}
