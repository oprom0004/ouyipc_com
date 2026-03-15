import Link from 'next/link';
import Image from 'next/image';
import { GatewayTrigger } from '@/features/DownloadGateway/GatewayContext';
import siteConfig from '@/content/site-config.json';

export default function Footer() {
    const { brand, brandFull, tagline, primaryCta, footerNav, disclaimer } = siteConfig as any;

    return (
        <footer style={{ background: '#030710', borderTop: '1px solid rgba(37,99,235,0.1)' }} aria-labelledby="footer-heading">
            <h2 id="footer-heading" className="sr-only">Footer</h2>
            <div className="mx-auto max-w-7xl px-6 pb-12 pt-16 lg:px-8">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    {/* Brand */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                                <Image src="/logo.png" alt={`${brand} Logo`} width={28} height={28} className="object-contain invert opacity-90" />
                            </div>
                            <span className="text-white font-bold text-lg tracking-tight">{brandFull}</span>
                        </Link>
                        <p className="text-sm leading-6 text-slate-500 max-w-xs">
                            {tagline}
                        </p>
                        <GatewayTrigger
                            className="inline-flex px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5 btn-primary"
                        >
                            {primaryCta.label}
                        </GatewayTrigger>
                    </div>

                    {/* Links */}
                    <div className="mt-14 grid grid-cols-3 gap-8 xl:col-span-2 xl:mt-0">
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">下载与产品</h3>
                            <ul className="mt-5 space-y-3">
                                {footerNav.product.map((item: any) => (
                                    <li key={item.href}>
                                        <Link href={item.href} className="text-sm text-slate-500 hover:text-slate-200 transition-colors">
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">支持与帮助</h3>
                            <ul className="mt-5 space-y-3">
                                {footerNav.support.map((item: any) => (
                                    <li key={item.href}>
                                        <Link href={item.href} className="text-sm text-slate-500 hover:text-slate-200 transition-colors">
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">法律条款</h3>
                            <ul className="mt-5 space-y-3">
                                {[
                                    { name: '隐私政策', href: '#' },
                                    { name: '服务条款', href: '#' },
                                    { name: '风险提示', href: '#' },
                                ].map((item) => (
                                    <li key={item.name}>
                                        <a href={item.href} className="text-sm text-slate-500 hover:text-slate-200 transition-colors">
                                            {item.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div
                    className="mt-12 pt-8 flex flex-col gap-6"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
                >
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-slate-600">
                            &copy; {new Date().getFullYear()} {brand}(OKX)粉丝信息中心. All rights reserved.
                        </p>
                        <p className="text-xs text-slate-700">
                            数字资产交易存在风险，请理性投资。
                        </p>
                    </div>
                    {/* Disclaimer */}
                    <p className="text-[10px] leading-relaxed text-slate-800 border-t border-white/[0.02] pt-6">
                        {disclaimer}
                    </p>
                </div>
            </div>
        </footer>
    );
}
