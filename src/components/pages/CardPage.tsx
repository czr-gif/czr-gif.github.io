'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { CardItem, CardPageConfig } from '@/types/page';

const markdownComponents = {
    p: ({ children }: React.ComponentProps<'p'>) => <p className="mb-3 last:mb-0">{children}</p>,
    ul: ({ children }: React.ComponentProps<'ul'>) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
    ol: ({ children }: React.ComponentProps<'ol'>) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
    li: ({ children }: React.ComponentProps<'li'>) => <li className="mb-1">{children}</li>,
    a: ({ ...props }) => (
        <a
            {...props}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
        />
    ),
    blockquote: ({ children }: React.ComponentProps<'blockquote'>) => (
        <blockquote className="border-l-4 border-accent/50 pl-4 italic my-4 text-neutral-600 dark:text-neutral-500">
            {children}
        </blockquote>
    ),
    strong: ({ children }: React.ComponentProps<'strong'>) => <strong className="font-semibold text-primary">{children}</strong>,
    em: ({ children }: React.ComponentProps<'em'>) => <em className="italic">{children}</em>,
    code: ({ children }: React.ComponentProps<'code'>) => (
        <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[0.95em]">{children}</code>
    ),
};

function CardItemBlock({
    item,
    index,
    embedded,
}: {
    item: CardItem;
    index: number;
    embedded: boolean;
}) {
    const imageSources = item.images && item.images.length > 0
        ? item.images
        : item.image
            ? [item.image]
            : [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * index }}
            className={`bg-white dark:bg-neutral-900 ${embedded ? "p-4" : "p-6"} rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-all duration-200 hover:scale-[1.01]`}
        >
            <div className="flex justify-between items-start mb-2 gap-4">
                <h3 className={`${embedded ? "text-lg" : "text-xl"} font-semibold text-primary`}>{item.title}</h3>
                {item.date && (
                    <span className="text-sm text-neutral-500 font-medium bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded shrink-0">
                        {item.date}
                    </span>
                )}
            </div>
            {item.subtitle && (
                <p className={`${embedded ? "text-sm" : "text-base"} text-accent font-medium mb-3`}>{item.subtitle}</p>
            )}
            {item.content && (
                <div className={`${embedded ? "text-sm" : "text-base"} text-neutral-600 dark:text-neutral-500 leading-relaxed`}>
                    <ReactMarkdown components={markdownComponents}>
                        {item.content}
                    </ReactMarkdown>
                </div>
            )}
            {imageSources.length > 0 && (
                <div className={`mt-4 grid gap-3 ${imageSources.length === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
                    {imageSources.map((src, imageIndex) => (
                        <div
                            key={`${item.title}-image-${imageIndex}`}
                            className="relative overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 aspect-[4/3]"
                        >
                            <Image
                                src={src}
                                alt={`${item.title} photo ${imageIndex + 1}`}
                                fill
                                className="object-cover"
                                sizes={imageSources.length === 1 ? "(min-width: 1024px) 768px, 100vw" : "(min-width: 1024px) 384px, 100vw"}
                            />
                        </div>
                    ))}
                </div>
            )}
            {item.tags && (
                <div className="flex flex-wrap gap-2 mt-4">
                    {item.tags.map(tag => (
                        <span key={tag} className="text-xs text-neutral-500 bg-neutral-50 dark:bg-neutral-800/50 px-2 py-1 rounded border border-neutral-100 dark:border-neutral-800">
                            {tag}
                        </span>
                    ))}
                </div>
            )}
        </motion.div>
    );
}

export default function CardPage({ config, embedded = false }: { config: CardPageConfig; embedded?: boolean }) {
    const useTwoColumnLayout = config.layout === 'two-column' && config.columns && config.columns.length > 0;
    const useSectionedLayout = config.layout === 'sectioned' && config.columns && config.columns.length > 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className={embedded ? "mb-4" : "mb-8"}>
                <h1 className={`${embedded ? "text-2xl" : "text-4xl"} font-serif font-bold text-primary mb-4`}>{config.title}</h1>
                {config.description && (
                    <div className={`${embedded ? "text-base" : "text-lg"} text-neutral-600 dark:text-neutral-500 max-w-2xl leading-relaxed`}>
                        <ReactMarkdown components={markdownComponents}>
                            {config.description}
                        </ReactMarkdown>
                    </div>
                )}
            </div>

            {useTwoColumnLayout ? (
                <div className={`grid grid-cols-1 lg:grid-cols-2 ${embedded ? "gap-4" : "gap-8"}`}>
                    {config.columns!.map((column, columnIndex) => (
                        <div key={column.title} className="space-y-4">
                            <div className={embedded ? "mb-2" : "mb-4"}>
                                <h2 className={`${embedded ? "text-xl" : "text-2xl"} font-serif font-semibold text-primary`}>
                                    {column.title}
                                </h2>
                                {column.description && (
                                    <div className={`${embedded ? "text-sm" : "text-base"} text-neutral-600 dark:text-neutral-500 leading-relaxed mt-2`}>
                                        <ReactMarkdown components={markdownComponents}>
                                            {column.description}
                                        </ReactMarkdown>
                                    </div>
                                )}
                            </div>
                            <div className={`grid ${embedded ? "gap-4" : "gap-6"}`}>
                                {column.items.map((item, itemIndex) => (
                                    <CardItemBlock
                                        key={`${column.title}-${item.title}-${itemIndex}`}
                                        item={item}
                                        index={columnIndex * 10 + itemIndex}
                                        embedded={embedded}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : useSectionedLayout ? (
                <div className={embedded ? "space-y-8" : "space-y-12"}>
                    {config.columns!.map((column, columnIndex) => (
                        <section
                            key={column.title}
                            className={columnIndex === 0 ? "" : "pt-8 border-t border-neutral-200 dark:border-neutral-800"}
                        >
                            <div className={embedded ? "mb-4" : "mb-6"}>
                                <h2 className={`${embedded ? "text-xl" : "text-2xl"} font-serif font-semibold text-primary`}>
                                    {column.title}
                                </h2>
                                {column.description && (
                                    <div className={`${embedded ? "text-sm" : "text-base"} text-neutral-600 dark:text-neutral-500 leading-relaxed mt-2`}>
                                        <ReactMarkdown components={markdownComponents}>
                                            {column.description}
                                        </ReactMarkdown>
                                    </div>
                                )}
                            </div>
                            <div className={`grid ${embedded ? "gap-4" : "gap-6"}`}>
                                {column.items.map((item, itemIndex) => (
                                    <CardItemBlock
                                        key={`${column.title}-${item.title}-${itemIndex}`}
                                        item={item}
                                        index={columnIndex * 10 + itemIndex}
                                        embedded={embedded}
                                    />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            ) : (
                <div className={`grid ${embedded ? "gap-4" : "gap-6"}`}>
                    {(config.items || []).map((item, index) => (
                        <CardItemBlock
                            key={`${item.title}-${index}`}
                            item={item}
                            index={index}
                            embedded={embedded}
                        />
                    ))}
                </div>
            )}
        </motion.div>
    );
}
