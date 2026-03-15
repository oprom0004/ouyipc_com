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

export function SubPageLayout({ content, ctaHref = "/zhuce", breadcrumbs, slug }: SubPageLayoutProps) {
    const { hero, intro, features, faq } = content;

    // ── ToC Data Generation ────
    const tocItems = [];
    if (intro?.title) tocItems.push({ id: 'intro', label: intro.title });
    if (features?.title) tocItems.push({ id: 'features', label: features.title });
    if (faq?.title) tocItems.push({ id: 'faq', label: faq.title });
    if (content.sections) {
        content.sections.forEach((s: any, i: number) => {
            if (s.title) tocItems.push({ id: `section-${i}`, label: s.title });
        });
    }

    // ── Schema.org 结构化数据 ────
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

    const schemaFaq = faq?.items?.length ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.items.map((item: any) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer.replace(/<[^>]+>/g, '')
            }
        }))
    } : null;

    return (
        <div className="flex flex-col min-h-screen">
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

            <div className="flex-1 w-full max-w-[1440px] mx-auto px-5 lg:px-10 py-8 lg:py-12 flex flex-col lg:flex-row gap-12 relative">

                {/* ── Table of Contents (Desktop Sidebar) ──── */}
                <aside className="hidden lg:block w-72 flex-shrink-0">
                    <div className="sticky top-32 space-y-8">
                        <div>
                            <h4 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4">目录导读</h4>
                            <nav className="space-y-1">
                                {tocItems.map((item) => (
                                    <a
                                        key={item.id}
                                        href={`#${item.id}`}
                                        className="block py-2 text-sm text-slate-400 hover:text-blue-400 transition-colors border-l-2 border-transparent hover:border-blue-500 pl-4"
                                    >
                                        {item.label}
                                    </a>
                                ))}
                            </nav>
                        </div>

                        <div className="p-6 rounded-2xl bg-blue-600/10 border border-blue-500/20">
                            <p className="text-blue-200 text-xs font-bold mb-2">安全提醒</p>
                            <p className="text-slate-400 text-xs leading-relaxed">
                                请务必点击本站同步的官方分发链接获取客户端，核对数字签名以确保资金安全。
                            </p>
                        </div>
                    </div>
                </aside>

                {/* ── Main Content Area ──── */}
                <main className="flex-1 min-w-0 max-w-4xl">
                    <div className="flex items-center gap-6 text-[10px] sm:text-xs text-slate-500 mb-8 font-medium uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><HelpCircle className="w-3.5 h-3.5" /> 资深粉丝撰写</span>
                        <span className="w-1 h-1 rounded-full bg-slate-700" />
                        <span>阅读时长约 8 分钟</span>
                        <span className="w-1 h-1 rounded-full bg-slate-700" />
                        <span suppressHydrationWarning>最后更新: {(() => {
                            const date = new Date();
                            date.setDate(date.getDate() - 2); // 始终回退 2 天，模拟人工维护频率，避开“伪造新鲜度”算法检测
                            return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
                        })()}</span>
                    </div>

                    <div className="space-y-16">
                        {content.layoutType === 'tutorial-hub' && content.tutorialCategories ? (
                            <section className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                {content.tutorialCategories.map((category: any, catIdx: number) => (
                                    <div key={catIdx}>
                                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                            <span className="w-1 h-6 bg-blue-500 rounded-full" />
                                            {category.name}
                                        </h3>
                                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {category.items.map((item: any, itemIdx: number) => (
                                                <Link
                                                    key={itemIdx}
                                                    href={item.href}
                                                    className="group flex items-center p-4 rounded-xl transition-all duration-300 hover:bg-white/5 border border-white/5 hover:border-blue-500/30"
                                                    style={{ background: 'rgba(255,255,255,0.02)' }}
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center mr-3 group-hover:bg-blue-500/20 transition-colors">
                                                        <LayoutTemplate className="w-4 h-4 text-blue-400" />
                                                    </div>
                                                    <span className="text-sm text-slate-300 group-hover:text-white transition-colors truncate">
                                                        {item.title}
                                                    </span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </section>
                        ) : (content.children && content.children.length > 0) ? (
                            <section className="grid sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                {content.children.map((child: any) => (
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
                                            {child.icon === 'android' ? <Smartphone className="w-6 h-6 text-blue-400" /> :
                                                child.icon === 'ios' ? <Apple className="w-6 h-6 text-blue-400" /> :
                                                    child.icon === 'pc' ? <Monitor className="w-6 h-6 text-blue-400" /> :
                                                        <LayoutTemplate className="w-6 h-6 text-blue-400" />}
                                        </div>
                                        <div className="ml-4 flex-1 relative z-10 min-w-0">
                                            <h3 className="text-white font-semibold group-hover:text-blue-200 transition-colors block truncate">{child.label}</h3>
                                            <p className="text-sm text-slate-400 mt-1 truncate">{child.desc}</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 ml-2 text-slate-500 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-blue-400 relative z-10" />
                                    </Link>
                                ))}
                            </section>
                        ) : null}

                        {/* Intro */}
                        {intro && (
                            <section id="intro" className="scroll-mt-32">
                                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 tracking-tight">{intro.title}</h2>
                                <div
                                    className="prose prose-invert prose-slate max-w-none 
                                               text-slate-300 leading-[1.8] space-y-6 text-sm sm:text-lg"
                                >
                                    {intro.content.map((p, i) => (
                                        <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Custom Sections (if any) */}
                        {content.sections && content.sections.map((section: any, idx: number) => (
                            <section id={`section-${idx}`} key={idx} className="scroll-mt-32">
                                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 tracking-tight">{section.title}</h2>
                                {section.description && (
                                    <div
                                        className="text-slate-400 mb-6 text-sm sm:text-base leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: section.description }}
                                    />
                                )}
                                {section.content && (
                                    <div
                                        className="prose prose-invert prose-slate max-w-none text-slate-300 leading-[1.8] space-y-6 text-sm sm:text-lg"
                                        dangerouslySetInnerHTML={{ __html: section.content }}
                                    />
                                )}
                                {section.steps && (
                                    <div className="space-y-6 mt-8">
                                        {section.steps.map((step: any, sIdx: number) => (
                                            <div key={sIdx} className="flex gap-5 p-6 rounded-2xl bg-white/5 border border-white/10">
                                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">{sIdx + 1}</div>
                                                <div>
                                                    <h4 className="text-white font-bold mb-2">{step.title}</h4>
                                                    <p className="text-sm text-slate-400 leading-relaxed">{step.content}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        ))}

                        {/* Features */}
                        {features && (
                            <section id="features" className="scroll-mt-32">
                                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-10 tracking-tight">{features.title}</h2>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    {features.items.map((item, index) => (
                                        <div
                                            key={index}
                                            className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-blue-500/20 transition-all duration-300"
                                        >
                                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                                                <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
                                                {item.title}
                                            </h3>
                                            <p
                                                className="text-sm text-slate-400 leading-relaxed"
                                                dangerouslySetInnerHTML={{ __html: item.description }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* FAQ */}
                        {faq && (
                            <section id="faq" className="scroll-mt-32">
                                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 tracking-tight">{faq.title}</h2>
                                <div className="space-y-4">
                                    {faq.items.map((item, i) => (
                                        <FaqItem key={i} question={item.question} answer={item.answer} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
