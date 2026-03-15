import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SubPageLayout } from '@/components/SubPageLayout';
import { getPageContentBySlug, getAllContentSlugs, buildBreadcrumbs } from '@/lib/content';

export function generateMetadata({ params }: { params: { slug: string[] } }): Metadata {
    try {
        const content = getPageContentBySlug(params.slug);
        return {
            title: content.metadata?.title || '欧易',
            description: content.metadata?.description || '',
            alternates: {
                canonical: `https://ouyipc.com/${params.slug.join('/')}/`,
            },
        };
    } catch {
        return {};
    }
}

// 递归扫描所有 JSON 文件，文件路径即 slug，无任何特殊处理
export function generateStaticParams() {
    const allSlugs = getAllContentSlugs();
    return allSlugs
        .filter(parts => !(parts.length === 1 && parts[0] === 'homepage'))
        .map(slug => ({ slug }));
}

export default function GenericPage({ params }: { params: { slug: string[] } }) {
    let content;
    try {
        content = getPageContentBySlug(params.slug);
    } catch {
        notFound();
    }

    // 面包屑：自动沿路径读取每级 JSON 的 navLabel 构建
    const breadcrumbs = buildBreadcrumbs(params.slug);

    return (
        <SubPageLayout
            content={content}
            ctaHref="/ouyi-zhuce"
            breadcrumbs={breadcrumbs}
            slug={params.slug}
        />
    );
}
