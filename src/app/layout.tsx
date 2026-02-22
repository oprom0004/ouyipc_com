import { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Providers } from './providers';
import BackToTop from '@/components/BackToTop';
import MobileStickyFooter from '@/components/MobileStickyFooter';
import { GatewayTrigger } from '@/features/DownloadGateway/GatewayContext';



export const metadata: Metadata = {
  metadataBase: new URL('https://theokex.com'),
  alternates: {
    canonical: '/',
  },
  title: {
    template: '%s | OKX网址',
    default: 'OKEX官方网站入口 | 欧易交易所APP下载(2026最新版)',
  },
  description: '2026最新OKEX官方网址入口。提供OKEX (欧易)交易所电脑版客户端、APP下载(Android/iOS)及Web3钱包使用指引。全球领先的数字资产交易平台，安全稳定。',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://theokex.com',
    siteName: 'OKEX官方网址',
    title: 'OKEX官方网站入口 | 欧易交易所APP下载(2026最新版)',
    description: '2026最新OKEX官方网址入口。提供OKEX (欧易)交易所电脑版客户端、APP下载(Android/iOS)及Web3钱包使用指引。',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
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
