'use client';

import Link from 'next/link';
import { ArrowRight, Download, ChevronRight } from 'lucide-react';
import { GatewayTrigger } from '@/features/DownloadGateway/GatewayContext';
import siteConfig from '@/content/site-config.json';

interface BreadcrumbItem {
    label: string;
    href: string;
}

interface PageHeroProps {
    title: string;
    subtitle: string;
    cta?: string;
    ctaHref?: string;
    secondaryCta?: string;
    secondaryCtaHref?: string;
    useGateway?: boolean;
    breadcrumbs?: BreadcrumbItem[];
}

export function PageHero({
    title,
    subtitle,
    cta = siteConfig.hero.defaultCta,
    ctaHref = "#",
    secondaryCta,
    secondaryCtaHref,
    useGateway = false,
    breadcrumbs
}: PageHeroProps) {
    return (
        <div className="relative isolate overflow-hidden pt-32 pb-16 lg:pt-44 lg:pb-20" style={{ background: 'var(--bg-base)' }}>
            {/* Ambient orbs */}
            <div
                className="orb w-[600px] h-[600px] -top-40 left-1/2 -translate-x-1/2 opacity-30"
                style={{ background: 'radial-gradient(circle, #1d4ed8 0%, transparent 70%)' }}
            />
            <div
                className="orb w-[400px] h-[400px] top-20 -right-20 opacity-15"
                style={{ background: 'radial-gradient(circle, #0891b2 0%, transparent 70%)' }}
            />
            <div
                className="orb w-[300px] h-[300px] bottom-0 left-10 opacity-10"
                style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }}
            />

            {/* Grid overlay */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                }}
            />

            <div className="relative z-10 mx-auto max-w-4xl px-6 lg:px-8 text-center">
                {/* Breadcrumbs */}
                {breadcrumbs && (
                    <nav className="flex justify-center mb-8" aria-label="Breadcrumb">
                        <ol className="flex items-center gap-2 text-xs text-slate-500">
                            {breadcrumbs.map((item, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-700" />}
                                    <Link
                                        href={item.href}
                                        className="hover:text-blue-400 transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ol>
                    </nav>
                )}

                {/* Badge */}
                <div className="flex justify-center mb-6">
                    <span
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium text-blue-300"
                        style={{ background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.25)' }}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse inline-block" />
                        {siteConfig.hero.badgeText}
                    </span>
                </div>

                {/* H1 */}
                <h1
                    className="text-5xl md:text-7xl font-black tracking-tight pb-3 leading-tight flex flex-col items-center gap-2"
                >
                    <span style={{
                        background: 'linear-gradient(135deg, #ffffff 0%, #bfdbfe 55%, #67e8f9 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>
                        {title.split(' - ')[0]}
                    </span>
                    {title.includes(' - ') && (
                        <span className="text-2xl md:text-4xl block mt-2 font-bold opacity-80" style={{
                            background: 'linear-gradient(135deg, #ffffff 0%, #bfdbfe 80%, #67e8f9 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>
                            {title.split(' - ')[1]}
                        </span>
                    )}
                </h1>

                {/* Subtitle */}
                <p
                    className="mt-5 text-base md:text-lg leading-relaxed text-slate-400 max-w-2xl mx-auto content-area"
                    dangerouslySetInnerHTML={{ __html: subtitle }}
                />

                {/* CTA Buttons */}
                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                    {useGateway ? (
                        <GatewayTrigger
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold text-white transition-all btn-primary"
                        >
                            {cta} <Download className="w-4 h-4" />
                        </GatewayTrigger>
                    ) : (
                        <Link
                            href={ctaHref}
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold text-white transition-all hover:-translate-y-0.5"
                            style={{
                                background: 'linear-gradient(135deg, #2563eb, #0891b2)',
                                boxShadow: '0 0 24px rgba(37,99,235,0.4)',
                            }}
                        >
                            {cta} <ArrowRight className="w-4 h-4" />
                        </Link>
                    )}

                    {secondaryCta && secondaryCtaHref && (
                        <Link
                            href={secondaryCtaHref}
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold text-slate-300 hover:text-white transition-all hover:-translate-y-0.5"
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                            }}
                        >
                            {secondaryCta} <ChevronRight className="w-4 h-4" />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
