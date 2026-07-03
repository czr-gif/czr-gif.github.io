import { getMarkdownContent, getTomlContent } from '@/lib/content';
import type { BlogIndexConfig, BlogPost, BlogPostMeta } from '@/types/blog';

const BLOG_CONFIG_FILE = 'blog.toml';

function comparePostsByDate(a: BlogPostMeta, b: BlogPostMeta): number {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

function getVisiblePosts(posts: BlogPostMeta[] = []): BlogPostMeta[] {
  return posts
    .filter((post) => !post.draft)
    .sort(comparePostsByDate);
}

export function getBlogIndex(locale?: string): BlogIndexConfig | null {
  const config = getTomlContent<BlogIndexConfig>(BLOG_CONFIG_FILE, locale);

  if (!config) {
    return null;
  }

  return {
    ...config,
    posts: getVisiblePosts(config.posts),
  };
}

export function getBlogPost(slug: string, locale?: string): BlogPost | null {
  const index = getBlogIndex(locale);
  const post = index?.posts.find((item) => item.slug === slug);

  if (!post) {
    return null;
  }

  return {
    ...post,
    content: getMarkdownContent(post.source, locale),
  };
}

export function getBlogSlugs(locales: string[]): string[] {
  const slugs = new Set<string>();

  for (const locale of locales) {
    const index = getBlogIndex(locale);
    index?.posts.forEach((post) => slugs.add(post.slug));
  }

  const fallbackIndex = getBlogIndex();
  fallbackIndex?.posts.forEach((post) => slugs.add(post.slug));

  return Array.from(slugs);
}
