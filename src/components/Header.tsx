'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useCallback, useRef, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { GatewayTrigger } from '@/features/DownloadGateway/GatewayContext';
import siteConfig from '@/content/site-config.json';

type NavChild = { label: string; href: string };
type NavItem = { label: string; href: string; children?: NavChild[] };

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [scrolled, setScrolled] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);
    const closeMenu = useCallback(() => { setIsMenuOpen(false); setOpenDropdown(null); }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navItems: NavItem[] = siteConfig.nav;
    const primaryCta = siteConfig.primaryCta;
    const brand = siteConfig.brand;

    return (
        <header
            className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
            style={{
                background: scrolled
                    ? 'rgba(4, 8, 15, 0.85)'
                    : 'rgba(4, 8, 15, 0.6)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderBottom: scrolled
                    ? '1px solid rgba(37, 99, 235, 0.2)'
                    : '1px solid rgba(255,255,255,0.04)',
                boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.4)' : 'none',
            }}
        >
            <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5" onClick={closeMenu}>
                    <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                        <Image src="/logo.png" alt={`${brand} Logo`} width={28} height={28} className="object-contain invert opacity-90" />
                    </div>
                    <span className="font-bold text-lg text-white tracking-tight">{brand}</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-1" ref={dropdownRef}>
                    {navItems.map((item) =>
                        item.children ? (
                            <div
                                key={item.href}
                                className="relative"
                                onMouseEnter={() => setOpenDropdown(item.label)}
                                onMouseLeave={() => setOpenDropdown(null)}
                            >
                                <Link
                                    href={item.href}
                                    className="flex items-center gap-0.5 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors"
                                    style={{ color: openDropdown === item.label ? '#e2e8f0' : '#94a3b8' }}
                                >
                                    {item.label}
                                    <ChevronDown
                                        className={`w-3.5 h-3.5 ml-0.5 transition-transform duration-200 ${openDropdown === item.label ? 'rotate-180 text-blue-400' : 'text-slate-500'}`}
                                    />
                                </Link>
                                {openDropdown === item.label && (
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-48">
                                        <div
                                            className="rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                                            style={{
                                                background: 'rgba(10,20,40,0.96)',
                                                border: '1px solid rgba(37,99,235,0.3)',
                                                backdropFilter: 'blur(24px)',
                                            }}
                                        >
                                            {item.children.map((child) => (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    className="block px-5 py-3.5 text-sm text-slate-300 hover:text-white hover:bg-blue-600/20 transition-all border-b border-white/[0.03] last:border-0"
                                                    onClick={() => setOpenDropdown(null)}
                                                >
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="px-3.5 py-2 text-sm font-medium text-slate-400 hover:text-white rounded-lg transition-colors"
                            >
                                {item.label}
                            </Link>
                        )
                    )}
                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-3">
                    <GatewayTrigger className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                        访问官网 <span className="text-blue-400">→</span>
                    </GatewayTrigger>
                    <GatewayTrigger
                        className="btn-primary px-5 py-2 rounded-lg text-sm font-semibold"
                        style={{ background: 'linear-gradient(135deg, #2563eb, #0891b2)' }}
                    >
                        立即注册
                    </GatewayTrigger>
                </div>

                {/* Mobile Button */}
                <button
                    className="md:hidden p-2 rounded-lg transition-colors text-slate-300 hover:text-white"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div
                    className="md:hidden"
                    style={{
                        background: 'rgba(4,8,15,0.97)',
                        borderTop: '1px solid rgba(37,99,235,0.2)',
                    }}
                >
                    <nav className="flex flex-col p-4 gap-1">
                        {navItems.map((item) =>
                            item.children ? (
                                <div key={item.href}>
                                    <div className="flex items-center">
                                        <Link
                                            href={item.href}
                                            className="flex-1 px-4 py-3 text-base font-medium text-slate-300 hover:text-white rounded-xl transition-colors"
                                            onClick={closeMenu}
                                        >
                                            {item.label}
                                        </Link>
                                        <button
                                            onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                                            className="p-3 text-slate-400 hover:text-white transition-colors"
                                        >
                                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openDropdown === item.label ? 'rotate-180' : ''}`} />
                                        </button>
                                    </div>
                                    {openDropdown === item.label && (
                                        <div className="ml-4 mt-1 pl-4 space-y-1" style={{ borderLeft: '2px solid rgba(37,99,235,0.3)' }}>
                                            {item.children.map((child) => (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    className="block px-4 py-2.5 text-sm text-slate-400 hover:text-white rounded-lg transition-colors"
                                                    onClick={closeMenu}
                                                >
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="block px-4 py-3 text-base font-medium text-slate-300 hover:text-white rounded-xl transition-colors"
                                    onClick={closeMenu}
                                >
                                    {item.label}
                                </Link>
                            )
                        )}
                        <div className="pt-4 mt-2 grid grid-cols-2 gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                            <GatewayTrigger className="py-3 rounded-xl text-center text-sm font-medium text-white transition-colors [background:rgba(37,99,235,0.15)] [border:1px_solid_rgba(37,99,235,0.3)]">
                                访问官网
                            </GatewayTrigger>
                            <GatewayTrigger
                                className="btn-primary py-3 rounded-xl text-center text-sm font-semibold text-white"
                                style={{ background: 'linear-gradient(135deg, #2563eb, #0891b2)' }}
                                onClick={closeMenu}
                            >
                                立即注册
                            </GatewayTrigger>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
