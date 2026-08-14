"use client";

import Link from "next/link";
import { useConfig } from "../context/ConfigContext";

interface FooterProps {
  locale?: 'zh' | 'hant';
}

export default function Footer({ locale = 'zh' }: FooterProps) {
  const { config } = useConfig();
  const isHant = locale === 'hant';
  const prefix = isHant ? "/hant" : "";

  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 text-zinc-500 py-12 md:py-16 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-zinc-900">
          
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-white text-black font-extrabold flex items-center justify-center font-mono text-[10px] select-none">
                OKX
              </span>
              <span className="font-display font-black text-white text-sm">ouyipc.com</span>
            </div>
            <p className="max-w-md text-zinc-500 leading-normal">
              {isHant 
                ? "本站為 OKX / 歐意用戶整理的非官方粉絲指南網站，提供訪問入口整理、客戶端下載指引與常見使用教程。本站不隸屬於 OKX 平台。"
                : "本站为 OKX / 欧易用户整理的非官方粉丝指南网站，提供访问入口整理、客户端下载指引与常见使用教程。本站不隶属于 OKX 平台。"}
            </p>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h4 className="text-zinc-400 font-semibold text-xs">{isHant ? "快速導航" : "快速导航"}</h4>
            <ul className="space-y-2">
              <li><Link href={`${prefix}/`} className="hover:text-zinc-300 transition">{isHant ? "安全入口" : "安全入口"}</Link></li>
              <li><Link href={`${prefix}/zhuce/`} className="hover:text-zinc-300 transition">{isHant ? "查看訪問入口" : "查看访问入口"}</Link></li>
              <li><Link href={`${prefix}/denglu/`} className="hover:text-zinc-300 transition">{isHant ? "安全登錄" : "安全登录"}</Link></li>
              <li><Link href={`${prefix}/xiazai/`} className="hover:text-zinc-300 transition">{isHant ? "下載指引" : "下载指引"}</Link></li>
              <li><Link href={`${prefix}/privacy-policy/`} className="hover:text-zinc-300 transition">{isHant ? "隱私說明" : "隐私说明"}</Link></li>
              <li><Link href={`${prefix}/#directory`} className="hover:text-zinc-300 transition">{isHant ? "教程中心" : "教程中心"}</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="text-zinc-400 font-semibold text-xs">{isHant ? "熱門專題" : "热门专题"}</h4>
            <ul className="grid grid-cols-2 gap-x-2 gap-y-2">
              <li><Link href={`${prefix}/app/`} className="hover:text-zinc-300 transition">{isHant ? "手機APP" : "手机APP"}</Link></li>
              <li><Link href={`${prefix}/diannao/`} className="hover:text-zinc-300 transition">{isHant ? "電腦版" : "电脑版"}</Link></li>
              <li><Link href={`${prefix}/anzhuangbao/`} className="hover:text-zinc-300 transition">{isHant ? "安裝包" : "安装包"}</Link></li>
              <li><Link href={`${prefix}/pingguo/`} className="hover:text-zinc-300 transition">{isHant ? "蘋果安裝" : "苹果安装"}</Link></li>
              <li><Link href={`${prefix}/wangye/`} className="hover:text-zinc-300 transition">{isHant ? "網頁版" : "网页版"}</Link></li>
              <li><Link href={`${prefix}/anzhuo/`} className="hover:text-zinc-300 transition">{isHant ? "安卓下載" : "安卓下载"}</Link></li>
              <li><Link href={`${prefix}/guanwang/`} className="hover:text-zinc-300 transition">{isHant ? "安全通道" : "安全通道"}</Link></li>
              <li><Link href={`${prefix}/zhongwen/`} className="hover:text-zinc-300 transition">{isHant ? "中文版" : "中文版"}</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="text-zinc-400 font-semibold text-xs">{isHant ? "友情連結" : "友情链接"}</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://oyweb.net/" target="_blank" rel="noopener" className="text-emerald-400 font-bold hover:underline transition">
                  {isHant ? "歐易web 官方網頁版 (oyweb.net)" : "欧易web 官方网页版 (oyweb.net)"}
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="p-4 bg-zinc-900/40 border border-zinc-900/60 rounded-xl space-y-2">
          <p className="leading-relaxed text-[11px] text-zinc-650">
            {isHant 
              ? "數字資產投資（加密貨幣/合約槓桿）含有高波動與高風險。本站 ouyipc.com 僅作為第三方獨立信息與粉絲指南頁提供內容整理，不提供交易、登錄、充值、提現、託管或帳戶服務，也不會要求您在本站輸入帳號密碼、驗證碼、助記詞或資金信息。市場有風險，請自行判斷。"
              : "数字资产投资（加密货币/合约杠杆）含有高波动与高风险。本站 ouyipc.com 仅作为第三方独立信息与粉丝指南页提供内容整理，不提供交易、登录、充值、提现、托管或账户服务，也不会要求您在本站输入账号密码、验证码、助记词或资金信息。市场有风险，请自行判断。"}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-600">
          <div>
            <p>
              © {new Date().getFullYear()}{" "}
              <span>ouyipc.com</span>. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 
              <span>{isHant ? "SSL 256 位銀行級信源加密保護" : "SSL 256 位银行级信源加密保护"}</span>
            </span>
          </div>

        </div>

      </div>
    </footer>
  );
}
