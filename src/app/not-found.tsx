import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: '404 - 页面未找到',
    robots: {
        index: false,
        follow: false,
    },
};

export default function NotFound() {
    return (
        <div className="grid min-h-screen place-items-center bg-[#0f172a] px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center">
                <p className="text-base font-semibold text-blue-600">404</p>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">页面未找到</h1>
                <p className="mt-6 text-base leading-7 text-slate-400">抱歉，未找到您要访问的页面。</p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link
                        href="/"
                        className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                        返回欧易首页
                    </Link>
                    <Link href="/ouyi-app" className="text-sm font-semibold text-white hover:text-blue-400">
                        下载欧易APP <span aria-hidden="true">&rarr;</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
