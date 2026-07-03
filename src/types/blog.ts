export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  summary?: string;
  tags?: string[];
  source: string;
  draft?: boolean;
}

export interface BlogIndexConfig {
  title: string;
  description?: string;
  posts: BlogPostMeta[];
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}
