# 多站点/站群前端架构设计指南 (Build-time Multi-tenant)

本文档记录了基于 Next.js 纯静态导出 (`output: 'export'`) 的“一码多站”架构方案，旨在实现**一套代码库，通过配置驱动生成多个不同 UI 和内容的前端站点**（如 `ouyijiaoyisuo.org`、`oyiguangwang.com` 等），适用于站群建设或白标产品矩阵。

---

## 核心架构思想：配置驱动 UI (Config-driven UI)

由于项目采用纯静态导出方案，无法在用户访问时动态判断域名来返回不同内容。因此，必须在**打包构建（Build-time）阶段**，注入环境变量（如 `SITE_ID=oyiguangwang.com`），让构建工具根据对应站点的独立配置组装 HTML 和资源。

该架构的终极目标是：**添加新站点时“零新增代码（Zero new TSX/CSS）”，仅需复制并修改 JSON 配置文件。**

---

## 什么是“前端组件脱水 (De-hardcoding)”？

实现多站点底层的第一步，是找出目前代码库中被“Hardcode（硬编码）”的部分，并将它们剥离到外部 JSON 配置文件中管理。**理想状态下的 React 组件应当是“只负责 UI 呈现规律，绝不包含具体的业务汉字、品牌标识或特定的固定超链接”。**

**常见需要剥离的 Hardcode 现象示例（以 `PageHero.tsx` 为例）：**

### 1. 写死的品牌文字和引导语
在 UI 呈现中直接键入固定的中文或品牌信息，这会导致打包别的站点时发生严重的“穿帮”。
*   **不良示范（原代码）**：
    ```tsx
    <span className="text-blue-300">
      欧意 · 官方中文入口    // <--- 典型的 Hardcode 汉字
    </span>
    ```
*   **改造思路**：
    ```tsx
    // 假设 config 已经通过读取 JSON 拿到了
    <span className="text-blue-300">
      {config.heroConfig.badgeText}  // <--- 动态化
    </span>
    ```

### 2. 具有特定语义的参数默认值（Default Props）
尽管采用了基于 `props` 传入参数的设计，但在定义函数的默认参数时，仍预设了与特定品牌/业务诉求绑定的文案。
*   **不良示范（原代码）**：
    ```tsx
    export function PageHero({
        cta = "立即下载",     // <--- 强绑定的默认文案
        ctaHref = "#", 
        // ...
    })
    ```
*   **改造思路**：
    组件不再设立具有具体业务含义的默认值，这些应交由 `site-config.json` 的上层页面（如 `page.tsx`）统一下发。如果下发为空，组件采取无此 DOM 的缺省渲染逻辑，或提供一个极为中立的占位（如 `"Button"`）。

### 3. 其他潜伏的硬编码灾区
构建站群前，需要全局排查以下可能写死的地方：
*   **布局与导航**：直接在 `layout.tsx` 编写的 `<title>` 标签或 meta 描述，以及 Footer 中写死的版权年份（`Copyright © 2024 欧意`）。
*   **静态资源引用**：组件中指向 public 资源的绝对路径图片链接，例如 `<img src="/okx-logo.png" />`，应改为读取配置中的 `config.assets.logoPath`。
*   **社交媒体与外部链接**：直接写死在按钮上的官方微博/Twitter 跳转链接。

在第一阶段“抽离文案”完成后，所有纯粹的展现组件都将转变为无状态的“渲染引擎”。

---

## 推荐的目录组织结构

**原则**：代码组件与具体站点的业务数据/文案/主题必须**严格物理隔离**。绝不将 UI 组件代码（`.tsx`）放入特定站点的工作目录下。

```text
项目根目录/
├── src/                          <-- 【代码库】所有站点共享的核心代码（零 Hardcode）
│   ├── components/               <--  UI 组件积木库
│   │   ├── heroes/               <-- 各种布局风格的 Hero (HeroStyleA, HeroStyleB)
│   │   ├── layout/               <-- 各种风格的导航栏、页脚
│   │   └── shared/               <-- 通用原子组件（按钮、弹窗等）
│   ├── app/                      <-- Next.js 页面级路由组件
│   └── utils/                    
│       └── getSiteConfig.ts      <-- 根据环境变量读取对应站点配置的工具函数
│
├── sites-config/                 <-- 【配置与数据池】按站点划分，仅存放配置文件，绝无业务代码
│   ├── ouyijiaoyisuo.org/
│   │   ├── content/              <-- 该站点的独有文章、多语言 JSON
│   │   ├── public/               <-- 该站点独有的图片素材 (logo, favicon 等)
│   │   └── site-config.json      <-- 【核心】该站点的中心化配置文件
│   ├── oyiguangwang.com/
│   │   ├── content/
│   │   ├── public/
│   │   └── site-config.json
│   └── ...
│
├── package.json
└── next.config.js
```

---

## 实现细节：低 Hardcode 的底层逻辑

### 1. 中心化配置文件 (`site-config.json`)
此文件是每个站点的“灵魂”，控制着 SEO、主题色、文案以及**布局挂载点**。

```json
{
  "siteId": "oyiguangwang.com",
  "seo": {
    "title": "欧易官网 - 全球领先的数字资产交易平台",
    "description": "欧易(OKX)官方网站...",
    "keywords": "欧易, oyiguangwang"
  },
  "theme": {
    "primaryColor": "#ffaa00",
    "fontFamily": "Inter"
  },
  "layout": {
    "headerStyle": "minimal",        // 决定引入哪种导航形态
    "heroComponent": "HeroStyleB",   // 决定主页使用哪种 Hero 布局
    "footerStyle": "standard"
  },
  "content": {
    "heroBadgeText": "欧易 · 官方中文入口",
    "heroTitle": "开启您的数字资产之旅",
    "downloadLink": "https://..."
  }
}
```

### 2. 代码路由层：动态组件分发（工厂模式）
在 `src/app/page.tsx` 中，不再硬编码具体的页面结构，而是通过读取 JSON 配置，从组件库中“按需映射”渲染组件。

```tsx
// 概念示例：
import { siteConfig } from '@/utils/getSiteConfig';
import HeroStyleA from '@/components/heroes/HeroStyleA';
import HeroStyleB from '@/components/heroes/HeroStyleB';

// 组件映射注册表
const ComponentRegistry = {
  HeroStyleA: HeroStyleA,
  HeroStyleB: HeroStyleB,
};

export default function HomePage() {
  // config 根据环境变量 SITE_ID 从 sites-config 中读取
  const config = siteConfig(); 
  
  // 按照配置中的字符串决定渲染哪个实体的 React 组件
  const ActiveHero = ComponentRegistry[config.layout.heroComponent] || ComponentRegistry['HeroStyleA'];

  return (
    <main style={{ '--site-primary': config.theme.primaryColor }}>
      {/* 将 JSON 中的文案毫无保留地透传给木偶组件 */}
      <ActiveHero 
        badgeText={config.content.heroBadgeText}
        title={config.content.heroTitle} 
        primaryBtnLink={config.content.downloadLink} 
      />
    </main>
  );
}
```

### 3. 多站点编译流控制 (`package.json`)
通过不同的构建脚本，注入环境变量，指引 Next.js 读取正确的配置流和输出目录。

```json
"scripts": {
  "build:ouyi": "SITE_ID=ouyijiaoyisuo.org next build",
  "build:guangwang": "SITE_ID=oyiguangwang.com next build",
  "build:all": "npm run build:ouyi && npm run build:guangwang"
}
```

---

## 阶段改造建议 (Roadmap)
考虑到当前项目（`ouyijiaoyisuo.org`）已经有部分硬编码的逻辑，若要向此架构平移，建议分阶段进行：
1. **第一阶段（抽离文案脱水）**：排查目前 `src` 中写死的中文文案、超链接等，统一迁移至外部 JSON 管理；UI 组件转为纯粹的展示层组件接受 `props` 传参，消除带有倾向性的默认业务文案。
2. **第二阶段（目录重组）**：建立 `sites-config/` 结构，将特有配置和通用代码进行物理分离；构建系统引入 `SITE_ID` 环境变量判定逻辑；配置静态图片等资源的统一分发管理。
3. **第三阶段（多UI演化）**：抽取“布局插槽”，允许在 JSON 中配置不同的 UI 组件组合方案，正式实现配置驱动的“百变站群”。
