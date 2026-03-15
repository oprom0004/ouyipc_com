'use client';

import Link from 'next/link';
import {
    Smartphone, Apple, Monitor, Wallet,
    Globe, Download, UserPlus, Coins, Building2, ChevronRight,
} from 'lucide-react';

const sections = [
    {
        title: '安卓版',
        icon: Smartphone,
        links: [
            { href: '/app/anzhuo', label: '欧易安卓版', sub: '官方正版 · 极速安装', icon: Download, accent: '#22c55e' },
        ],
    },
    {
        title: '苹果 iOS',
        icon: Apple,
        links: [
            { href: '/app/ios', label: 'iOS下载指引', sub: '海外Apple ID · 快速获取', icon: Apple, accent: '#a78bfa' },
        ],
    },
    {
        title: '欧易平台 · 下载中心',
        href: '/xiazai',
        icon: Download,
        links: [
            { href: '/web', label: '网页版登录', sub: '浏览器直达 · 免安装', icon: Globe, accent: '#38bdf8' },
            { href: '/xiazai', label: '电脑客户端', sub: 'Windows / macOS', icon: Monitor, accent: '#60a5fa' },
            { href: '/qianbao', label: 'Web3钱包', sub: '去中心化 · 多链聚合', icon: Wallet, accent: '#f59e0b' },
            { href: '/zhuce', label: '注册领奖励', sub: '新手专享 · 先领后投', icon: UserPlus, accent: '#34d399' },
            { href: '/okb', label: 'OKB生态', sub: '平台币 · X Layer', icon: Coins, accent: '#fb923c' },
            { href: '/jiaoyisuo', label: '交易所入口', sub: '平台介绍 · 官方入口直达', icon: Building2, accent: '#94a3b8' },
        ],
    },
];

export function QuickLinks() {
    return (
        <section className="py-14" style={{ background: 'var(--bg-surface)' }}>
            <div className="max-w-5xl mx-auto px-5">
                <h2 className="section-title text-2xl font-bold mb-8">欧易快速入口</h2>

                <div className="space-y-8">
                    {sections.map((section) => {
                        const SectionIcon = section.icon;
                        return (
                            <div key={section.title}>
                                {/* Section label */}
                                <div className="flex items-center gap-2 mb-4">
                                    <SectionIcon className="w-4 h-4 text-blue-400" />
                                    {section.href ? (
                                        <Link
                                            href={section.href}
                                            className="text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-blue-400 transition-colors"
                                        >
                                            {section.title} →
                                        </Link>
                                    ) : (
                                        <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                                            {section.title}
                                        </h3>
                                    )}
                                </div>

                                {/* Links grid */}
                                <div className={`grid gap-3 ${section.links.length > 2 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
                                    {section.links.map((link) => {
                                        const Icon = link.icon;
                                        return (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                className="glass relative flex items-center gap-4 p-4 rounded-2xl group overflow-hidden shine-border"
                                                style={{ position: 'relative' }}
                                            >
                                                {/* Accent glow */}
                                                <div
                                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                                                    style={{ background: `radial-gradient(ellipse at 20% 50%, ${link.accent}14 0%, transparent 60%)` }}
                                                />

                                                <div
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                                                    style={{ background: `${link.accent}18`, border: `1px solid ${link.accent}30` }}
                                                >
                                                    <Icon className="w-5 h-5 transition-colors duration-300" style={{ color: link.accent }} />
                                                </div>

                                                <div className="flex-1 min-w-0 relative z-10">
                                                    <span className="text-white font-semibold text-sm block group-hover:text-blue-100 transition-colors">
                                                        {link.label}
                                                    </span>
                                                    <span className="text-xs text-slate-500 mt-0.5 block">{link.sub}</span>
                                                </div>

                                                <ChevronRight
                                                    className="w-4 h-4 flex-shrink-0 transition-all duration-300 group-hover:translate-x-0.5 relative z-10"
                                                    style={{ color: link.accent + '80' }}
                                                />
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
