import { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Providers } from './providers';
import BackToTop from '@/components/BackToTop';
import MobileStickyFooter from '@/components/MobileStickyFooter';
import { GatewayTrigger } from '@/features/DownloadGateway/GatewayContext';



export const metadata: Metadata = {
  metadataBase: new URL('https://ouyipc.com'),
  alternates: {
    canonical: '/',
  },
  title: {
    template: '%s - 欧易(OKX)官方入口',
    default: '欧易OKX下载中心 | 欧易交易所网页版/APP/电脑版官方下载',
  },
  description: '欧易(OKX)官方中文入口，为您提供欧易交易所电脑客户端下载、手机端APP官方下载网址、网页版登录直达及Web3钱包使用指南。安全稳定，资深粉丝实时同步。',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://ouyipc.com',
    siteName: '欧易(OKX)下载中心',
    title: '欧易OKX下载中心 | 欧易交易所网页版/APP/电脑版官方下载',
    description: '欧易(OKX)官方中文入口，为您提供欧易交易所电脑版及手机版最新官方下载链接。',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased font-sans" suppressHydrationWarning>
        <Providers>
          <Header />
          <main className="min-h-screen bg-[#0f172a]">
            {children}
          </main>
          <Footer />
          <BackToTop />
          <MobileStickyFooter>
            <GatewayTrigger className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center transition-colors shadow-lg">
              访问 OKX 官网
            </GatewayTrigger>
          </MobileStickyFooter>
        </Providers>
      </body>
    </html>
  );
}
