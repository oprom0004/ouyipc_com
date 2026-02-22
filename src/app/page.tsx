import { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { QuickLinks } from '@/components/QuickLinks';
import { getPageContent } from '@/lib/content';
import { HelpCircle, ChevronRight } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
    const homepage = getPageContent('homepage');
    return {
        title: homepage.metadata.title,
        description: homepage.metadata.description,
        alternates: {
            canonical: 'https://ouyijiaoyisuo.org/',
        },
    };
}

export default function HomePage() {
    // 在函数体内读取，避免模块级别缓存导致JSON更新不热加载
    const homepage = getPageContent('homepage');
    // Feature card accent colors
    const featureAccents = ['#3b82f6', '#06b6d4', '#8b5cf6', '#f59e0b'];

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'WebSite',
                    name: homepage.jsonLd.name,
                    url: homepage.jsonLd.url,
                    description: homepage.jsonLd.description,
                })
            }} />

            <PageHero
                title={homepage.hero.title}
                subtitle={homepage.hero.subtitle}
                cta={homepage.hero.cta}
                ctaHref="/ouyi-zhuce"
                useGateway={true}
            />

            {/* ── Intro ──────────────────────────────── */}
            <section style={{ background: 'var(--bg-surface)' }} className="py-14">
                <div className="max-w-4xl mx-auto px-5">
                    <h2 className="section-title mb-6 text-2xl">{homepage.intro.title}</h2>
                    <div
                        className="p-6 rounded-2xl text-slate-300 space-y-4 content-area text-sm md:text-base"
                        style={{
                            background: 'rgba(37,99,235,0.04)',
                            border: '1px solid rgba(37,99,235,0.12)',
                        }}
                    >
                        {homepage.intro.content.map((p, i) => (
                            <p key={i} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: p }} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Quick Links ────────────────────────── */}
            <QuickLinks />

            {/* ── Features ──────────────────────────── */}
            <section style={{ background: 'var(--bg-surface)' }} className="py-14">
                <div className="max-w-5xl mx-auto px-5">
                    <h2 className="section-title mb-8 text-2xl">{homepage.features.title}</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {homepage.features.items.map((feature: { title: string; description: string }, index: number) => {
                            const accent = featureAccents[index % featureAccents.length];
                            return (
                                <div
                                    key={index}
                                    className="glass relative p-6 rounded-2xl group overflow-hidden"
                                >
                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                                        style={{ background: `radial-gradient(ellipse at 20% 30%, ${accent}10 0%, transparent 65%)` }}
                                    />
                                    <div className="flex items-start gap-3 mb-3">
                                        <div
                                            className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                                            style={{ background: accent }}
                                        />
                                        <h3
                                            className="font-bold text-base transition-colors"
                                            style={{ color: accent + 'dd' }}
                                        >
                                            {feature.title}
                                        </h3>
                                    </div>
                                    <p
                                        className="text-sm text-slate-400 leading-relaxed pl-5 content-area relative z-10"
                                        dangerouslySetInnerHTML={{ __html: feature.description }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── Section 3 (optional eco section) ─── */}
            {homepage.section3 && (
                <section style={{ background: 'var(--bg-base)' }} className="py-14">
                    <div className="max-w-4xl mx-auto px-5">
                        <h2 className="section-title mb-6 text-2xl">{homepage.section3.title}</h2>
                        <p
                            className="text-slate-400 text-sm md:text-base leading-relaxed content-area"
                            dangerouslySetInnerHTML={{ __html: homepage.section3.content }}
                        />
                    </div>
                </section>
            )}

            {/* ── FAQ ───────────────────────────────── */}
            <section style={{ background: 'var(--bg-surface)' }} className="py-14">
                <div className="max-w-4xl mx-auto px-5">
                    <h2 className="section-title mb-8 text-2xl">{homepage.faq.title}</h2>
                    <div className="space-y-3">
                        {homepage.faq.items.map((faq, index) => (
                            <details
                                key={index}
                                className="group rounded-2xl overflow-hidden"
                                style={{
                                    background: 'rgba(255,255,255,0.02)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                }}
                            >
                                <summary
                                    className="flex items-center justify-between px-6 py-5 cursor-pointer gap-4 list-none"
                                    style={{}}
                                >
                                    <div className="flex items-start gap-3">
                                        <HelpCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-white font-semibold text-sm leading-relaxed">{faq.question}</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-600 flex-shrink-0 group-open:rotate-90 transition-transform duration-200" />
                                </summary>
                                <div
                                    className="px-6 pb-5 text-sm text-slate-400 leading-relaxed ml-7 content-area"
                                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                                />
                            </details>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
