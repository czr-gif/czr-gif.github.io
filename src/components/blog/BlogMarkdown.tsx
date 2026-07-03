'use client';

import ReactMarkdown from 'react-markdown';

interface BlogMarkdownProps {
  content: string;
}

export default function BlogMarkdown({ content }: BlogMarkdownProps) {
  return (
    <div className="text-neutral-700 dark:text-neutral-600 leading-relaxed">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-serif font-bold text-primary mt-10 mb-4">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-serif font-bold text-primary mt-10 mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold text-primary mt-8 mb-3">
              {children}
            </h3>
          ),
          p: ({ children }) => <p className="mb-5 last:mb-0">{children}</p>,
          ul: ({ children }) => <ul className="list-disc mb-5 space-y-2 pl-6">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal mb-5 space-y-2 pl-6">{children}</ol>,
          li: ({ children }) => <li className="pl-1">{children}</li>,
          a: ({ ...props }) => (
            <a
              {...props}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent font-medium transition-colors duration-200 hover:text-accent-dark"
            />
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-accent/50 pl-4 italic my-6 text-neutral-600 dark:text-neutral-500">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="rounded bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 text-sm text-primary">
              {children}
            </code>
          ),
          strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
          em: ({ children }) => <em className="italic text-neutral-600 dark:text-neutral-500">{children}</em>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
