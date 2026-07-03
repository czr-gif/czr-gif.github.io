import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import BlogIndexClient from '@/components/blog/BlogIndexClient';
import { getBlogIndex } from '@/lib/blog';
import { getConfig } from '@/lib/config';
import { getRuntimeI18nConfig } from '@/lib/i18n/config';
import type { BlogIndexConfig } from '@/types/blog';

export async function generateMetadata(): Promise<Metadata> {
  const blog = getBlogIndex();

  return {
    title: blog?.title || 'Blog',
    description: blog?.description,
  };
}

export default function BlogIndexPage() {
  const baseConfig = getConfig();
  const runtimeI18n = getRuntimeI18nConfig(baseConfig.i18n);
  const targetLocales = runtimeI18n.enabled ? runtimeI18n.locales : [runtimeI18n.defaultLocale];
  const dataByLocale: Record<string, BlogIndexConfig> = {};

  for (const locale of targetLocales) {
    const localizedIndex = getBlogIndex(locale);
    if (localizedIndex) {
      dataByLocale[locale] = localizedIndex;
    }
  }

  const defaultIndex = getBlogIndex();
  if (defaultIndex) {
    dataByLocale[runtimeI18n.defaultLocale] = dataByLocale[runtimeI18n.defaultLocale] || defaultIndex;
  }

  if (Object.keys(dataByLocale).length === 0) {
    notFound();
  }

  return <BlogIndexClient dataByLocale={dataByLocale} defaultLocale={runtimeI18n.defaultLocale} />;
}
