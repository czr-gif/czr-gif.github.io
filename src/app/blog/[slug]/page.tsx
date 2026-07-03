import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import BlogPostClient from '@/components/blog/BlogPostClient';
import { getBlogPost, getBlogSlugs } from '@/lib/blog';
import { getConfig } from '@/lib/config';
import { getRuntimeI18nConfig } from '@/lib/i18n/config';
import type { BlogPost } from '@/types/blog';

export function generateStaticParams() {
  const baseConfig = getConfig();
  const runtimeI18n = getRuntimeI18nConfig(baseConfig.i18n);
  const targetLocales = runtimeI18n.enabled ? runtimeI18n.locales : [runtimeI18n.defaultLocale];

  return getBlogSlugs(targetLocales).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.summary,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const baseConfig = getConfig();
  const runtimeI18n = getRuntimeI18nConfig(baseConfig.i18n);
  const targetLocales = runtimeI18n.enabled ? runtimeI18n.locales : [runtimeI18n.defaultLocale];
  const dataByLocale: Record<string, BlogPost> = {};

  for (const locale of targetLocales) {
    const localizedPost = getBlogPost(slug, locale);
    if (localizedPost) {
      dataByLocale[locale] = localizedPost;
    }
  }

  const defaultPost = getBlogPost(slug);
  if (defaultPost) {
    dataByLocale[runtimeI18n.defaultLocale] = dataByLocale[runtimeI18n.defaultLocale] || defaultPost;
  }

  if (Object.keys(dataByLocale).length === 0) {
    notFound();
  }

  return <BlogPostClient dataByLocale={dataByLocale} defaultLocale={runtimeI18n.defaultLocale} />;
}
