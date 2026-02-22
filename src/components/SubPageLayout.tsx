'use client';

import { PageHero } from '@/components/PageHero';
import { SubPageContent } from '@/features/SEOContent/types';
import { HelpCircle, ChevronDown, ChevronRight, Smartphone, Apple, Monitor, LayoutTemplate } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface SubPageLayoutProps {
    content: SubPageContent;
    ctaHref?: string;
    breadcrumbs?: { label: string; href: string }[];
    slug?: string[];
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div
            className="rounded-2xl overflow-hidden transition-all duration-200"
            style={{
                background: open ? 'rgba(37,99,235,0.06)' : 'rgba(255,255,255,0.02)',
                border: open ? '1px solid rgba(37,99,235,0.25)' : '1px solid rgba(255,255,255,0.06)',
            }}
        >
            <button
                className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
                onClick={() => setOpen(!open)}
            >
                <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-white font-semibold text-sm leading-relaxed">{question}</span>
                </div>
                <ChevronDown
                    className={`w-4 h-4 flex-shrink-0 text-slate-500 transition-transform duration-200 ${open ? 'rotate-180 text-blue-400' : ''}`}
                />
            </button>
            {open && (
                <div
                    className="px-6 pb-5 text-sm text-slate-400 leading-relaxed ml-8 content-area"
                    dangerouslySetInnerHTML={{ __html: answer }}
                />
            )}
        </div>
    );
}

export function SubPageLayout({ content, ctaHref = "/ouyi-zhuce", breadcrumbs, slug }: SubPageLayoutProps) {
    const { hero, intro, features, faq } = content;

    // ── Schema.org 结构化数据（自动生成，无需手动配置）────
    const domain = 'https://ouyijiaoyisuo.org';
    const pagePath = slug ? `/${slug.join('/')}/` : '/';
    const schemaWebPage = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: content.metadata?.title || hero.title,
        description: content.metadata?.description || '',
        url: `${domain}${pagePath}`,
        inLanguage: 'zh-CN',
        breadcrumb: breadcrumbs ? {
            '@type': 'BreadcrumbList',
            itemListElement: breadcrumbs.map((item, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: item.label,
                item: `${domain}${item.href}`,
            })),
        } : undefined,
    };

    // FAQPage schema（若页面有 FAQ）
    const schemaFaq = faq?.items?.length ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.items.map((item: { question: string; answer: string }) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer.replace(/<[^>]+>/g, ''), // 去掉 HTML 标签
            },
        })),
    } : null;

    return (
        <>
            {/* Schema.org 结构化数据 */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaWebPage) }}
            />
            {schemaFaq && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq) }}
                />
            )}
            <PageHero
                title={hero.title}
                subtitle={hero.subtitle}
                cta={hero.cta}
                ctaHref={hero.ctaHref || ctaHref}
                secondaryCta={hero.secondaryCta}
                secondaryCtaHref={hero.secondaryCtaHref}
                useGateway={hero.useGateway !== undefined ? hero.useGateway : true}
                breadcrumbs={breadcrumbs}
            />

            <div className="py-16" style={{ background: 'var(--bg-surface)' }}>
                <div className="max-w-4xl mx-auto px-5 space-y-16">

                    {/* Children sub-page entries */}
                    {content.children && content.children.length > 0 && (
                        <section className="grid sm:grid-cols-2 gap-4">
                            {content.children.map((child) => {
                                let Icon = LayoutTemplate;
                                if (child.icon === 'android') Icon = Smartphone;
                                else if (child.icon === 'ios') Icon = Apple;
                                else if (child.icon === 'pc') Icon = Monitor;

                                return (
                                    <Link
                                        key={child.href}
                                        href={child.href}
                                        className="group relative flex items-center p-5 rounded-2xl shine-border overflow-hidden"
                                        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                                    >
                                        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 relative z-10"
                                            style={{ background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)' }}
                                        >
                                            <Icon className="w-6 h-6 text-blue-400" />
                                        </div>

                                        <div className="ml-4 flex-1 relative z-10 min-w-0">
                                            <h3 className="text-white font-semibold group-hover:text-blue-200 transition-colors block truncate">{child.label}</h3>
                                            <p className="text-sm text-slate-400 mt-1 truncate">{child.desc}</p>
                                        </div>

                                        <ChevronRight className="w-5 h-5 ml-2 text-slate-500 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-blue-400 relative z-10" />
                                    </Link>
                                );
                            })}
                        </section>
                    )}

                    {/* Intro */}
                    {intro && (
                        <section>
                            <h2 className="section-title mb-6">{intro.title}</h2>
                            <div
                                className="p-6 rounded-2xl text-slate-300 space-y-4 content-area"
                                style={{
                                    background: 'rgba(37,99,235,0.04)',
                                    border: '1px solid rgba(37,99,235,0.12)',
                                }}
                            >
                                {intro.content.map((p, i) => (
                                    <p key={i} className="leading-relaxed text-sm md:text-base" dangerouslySetInnerHTML={{ __html: p }} />
                                ))}
                            </div>
                        </section>
                    )}


                    {/* SEO Article */}

                    {content.seoArticle && (
                        <article className="space-y-12">
                            {content.seoArticle.title && (
                                <h2 className="section-title">{content.seoArticle.title}</h2>
                            )}
                            {content.seoArticle.sections.map((section, idx) => (
                                <section key={idx} className="space-y-4">
                                    {section.heading && (
                                        <h3 className="text-lg font-bold text-white flex items-center gap-3">
                                            <span
                                                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-blue-300 flex-shrink-0"
                                                style={{ background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(37,99,235,0.3)' }}
                                            >
                                                {idx + 1}
                                            </span>
                                            <span>{section.heading.replace(/^[一二三四五六七八九十]+、/, '')}</span>
                                        </h3>
                                    )}
                                    <div
                                        className="text-slate-300 text-sm md:text-base leading-relaxed content-area
                                                   [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-2
                                                   [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-2
                                                   [&>strong]:text-blue-300 [&_li]:text-slate-300 [&_li]:leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: section.content }}
                                    />
                                </section>
                            ))}
                        </article>
                    )}

                    {/* Features */}
                    {features && (
                        <section>
                            <h2 className="section-title mb-8">{features.title}</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {features.items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="glass p-6 rounded-2xl group transition-all duration-300 hover:-translate-y-0.5"
                                    >
                                        <div className="flex items-start gap-3 mb-3">
                                            <div
                                                className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                                                style={{ background: 'linear-gradient(135deg, #2563eb, #06b6d4)' }}
                                            />
                                            <h3 className="text-base font-bold text-white group-hover:text-blue-200 transition-colors">
                                                {item.title}
                                            </h3>
                                        </div>
                                        <p
                                            className="text-sm text-slate-400 leading-relaxed pl-5 content-area"
                                            dangerouslySetInnerHTML={{ __html: item.description }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* FAQ — accordion */}
                    {faq && (
                        <section>
                            <h2 className="section-title mb-6">{faq.title}</h2>
                            <div className="space-y-3">
                                {faq.items.map((item, i) => (
                                    <FaqItem key={i} question={item.question} answer={item.answer} />
                                ))}
                            </div>
                        </section>
                    )}

                </div>
            </div>
        </>
    );
}
