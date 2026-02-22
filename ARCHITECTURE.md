# ouyijiaoyisuo.org 网站架构文档

> ⚠️ **AI 代理必读规则（新会话启动时强制执行）**
> 1. 在开始任何代码修改前，先读完本文件（ARCHITECTURE.md）
> 2. 在任何涉及内容修改或部署准备的任务中，同时读取 `SEO_CHECKLIST.md`
> 3. 部署前必须运行 `npm run deploy`，不得跳过 SEO 验证

> 版本：2026-02  

> 技术栈：Next.js 13 · TypeScript · Tailwind CSS · 静态导出（SSG）  
> 部署平台：Cloudflare Pages

---

## 一、核心设计哲学

### 1.1 内容与代码完全分离

网站的所有页面内容（TDK、H1、正文、FAQ）均存储在 `src/content/zh-CN/` 目录下的 JSON 文件中。React 组件只负责渲染，完全不包含业务文案。

```
src/
  app/          ← 路由引擎（代码，极少改动）
  components/   ← UI 组件（代码，极少改动）
  content/
    zh-CN/      ← 页面内容（数据，AI 可自动生成）
    site-config.json  ← 全站配置（品牌、导航链接）
  lib/
    content.ts  ← 内容读取工具函数
```

**意义**：换品牌、换关键词、换文案时，只改 JSON 文件，代码层零触碰。

---

### 1.2 文件夹结构即 URL 结构（零约定路由）

`src/content/zh-CN/` 下的文件路径直接映射为页面 URL，没有任何额外配置。

```
src/content/zh-CN/
  ouyi-app.json           → /ouyi-app
  ouyi-app/
    ios.json              → /ouyi-app/ios
    android.json          → /ouyi-app/android
  ouyi-zhuce.json         → /ouyi-zhuce
  ouyi-wallet.json        → /ouyi-wallet
  ouyi-pc.json            → /ouyi-pc
  ouyi-web.json           → /ouyi-web
  ouyi-jiaoyisuo.json     → /ouyi-jiaoyisuo
  ouyi-xiazai.json        → /ouyi-xiazai
  okb.json                → /okb
  homepage.json           → / （首页，由 src/app/page.tsx 单独读取）
```

**规则只有一条**：文件放在哪里，URL 就是哪里。

**层级表达**：将 `ouyi-app/ios.json` 放入 `ouyi-app/` 子目录，即可自动生成 `/ouyi-app/ios` 这个 URL。新建子页只需新建文件，不改任何代码。

---

### 1.3 site-config.json：全站导航的唯一真相来源

`src/content/site-config.json` 是全站所有导航链接的单一来源。

```json
{
  "brand": "欧意",
  "brandFull": "欧意(OKX)",
  "domain": "https://ouyijiaoyisuo.org",
  "tagline": "...",
  "primaryCta": { "label": "进入欧意官网", "href": "/ouyi-zhuce" },
  "nav": [...],       ← Header 菜单栏读取
  "footerNav": {...}, ← Footer 链接读取
  "quickLinks": {...} ← 首页快速入口参考
}
```

`Header.tsx`、`Footer.tsx` 均从此文件读取，**不包含任何硬编码链接**。

**换品牌时的操作**：AI 脚本只需更新 `site-config.json` 中的 `brand`、`nav` 里的 href 前缀，Header 和 Footer 自动跟随变化。

---

## 二、路由引擎

### 2.1 首页（`/`）

由 `src/app/page.tsx` 单独处理，固定读取 `homepage.json`。

首页的组件结构（`PageHero` + `QuickLinks` + Features + FAQ）与内页不同，因此独立维护。这不是 hardcode，而是有意的架构分层——首页是代码决策，内页是数据决策。

### 2.2 所有内页（`/ouyi-app`、`/ouyi-app/ios` 等）

由 `src/app/[...slug]/page.tsx`（catch-all 动态路由）统一处理。

**`generateStaticParams`**：在构建时递归扫描 `src/content/zh-CN/` 所有 JSON 文件，生成全量静态页面列表。新增 JSON 文件无需改代码，构建时自动被扫描进来。

```typescript
// 伪代码逻辑
function generateStaticParams() {
  return 递归扫描所有 .json 文件
    .过滤掉 homepage.json
    .map(路径 => slug数组)
}
```

**页面渲染**：`GenericPage` 组件根据 `params.slug` 精确读取对应 JSON，传给 `SubPageLayout` 渲染。

### 2.3 为什么没有 `templates` 文件夹？（排版哲学）

在早期的设计中，构思过使用 `templates` 目录来做页面分类映射（例如 `DownloadTemplate.tsx`、`ArticleTemplate.tsx`）。但在最终落地的架构中，这一概念被彻底移除。

**设计决策：所有的“模板”本质上也就是“布局组件（Layout Component）”**。

- **极简乐高模式**：全站 90% 的内页共用 `src/components/SubPageLayout.tsx`。它预置了 `hero`、`children`（子页入口卡片）、`seoArticle`、`faq` 等所有积木块。JSON 中有哪块数据就只渲染哪块。
- **未来扩展**：如果需要一种完全剥离当前视觉风格的全新排版（例如纯白底黑字的极简新闻页），只需在 `src/components/` 目录下新建一个 `ArticleLayout.tsx`，在对应 JSON 中加入 `"templateType": "article"`，路由引擎通过一个简易的 `switch` 分发即可。

统一将所有视觉框架放至 `components` 下管理，消除了“某个模块究竟算组件还是算模板”的心智负担。

---

## 三、内容 JSON 结构规范

每个页面 JSON 包含以下标准字段：

```json
{
  "navLabel": "APP下载",       ← 面包屑显示的短标签（必填）
  "children": [...],           ← 子页入口卡片（有子页的父页填写）
  "templateType": "default",   ← 页面模板类型（默认 default）
  "metadata": {
    "title": "...",            ← <title> 标签（TDK 中的 T）
    "description": "..."       ← meta description（TDK 中的 D）
  },
  "hero": {
    "title": "...",            ← 页面 H1（最重要的 SEO 权重区）
    "subtitle": "...",
    "cta": "按钮文案",
    "useGateway": true         ← true=弹出下载网关，false=直接链接
  },
  "intro": { "title": "H2标题", "content": ["段落..."] },
  "seoArticle": {              ← 长文内容（教程、步骤等）
    "title": "文章标题",
    "sections": [
      { "heading": "H3标题", "content": "<html>内容</html>" }
    ]
  },
  "features": {
    "title": "功能区标题",
    "items": [{ "title": "...", "description": "..." }]
  },
  "faq": {
    "title": "FAQ标题",
    "items": [{ "question": "...", "answer": "..." }]
  }
}
```

---

## 四、模板变量系统

所有 JSON 文件支持以下占位符，读取时由 `processTemplate()` 函数自动替换。

| 占位符 | 替换为 | 示例 |
|--------|--------|------|
| `{year}` | 当前构建年份 | `2026` |
| `{brand}` | `site-config.json` 中的 `brand` 字段 | `欧意` |

**在 JSON 中的写法：**
```json
"title": "{brand}APP下载 | {brand}(OKX)安卓/iOS最新官方安装包 {year}"
```

**效果**：每次构建自动生成正确年份，换品牌时无需批量改 JSON。

---

## 五、面包屑导航（自动化）

面包屑由 `buildBreadcrumbs(slugParts)` 函数自动生成，无需任何配置。

**算法**：对 slug 从左到右逐级读取对应 JSON 的 `navLabel` 字段，拼接为面包屑链：

```
访问 /ouyi-app/ios
→ 读 ouyi-app.json    → navLabel: "APP下载"
→ 读 ouyi-app/ios.json → navLabel: "iOS指引"
→ 输出: 首页 > APP下载 > iOS指引
```

支持任意深度的嵌套，新增层级无需改代码。

---

## 六、子页入口导航

### 少量固定子页（推荐 `children` 字段）

适用于 2~5 个核心子页（如 APP 页下的 iOS/Android）。

在父页 JSON 中声明：
```json
"children": [
  { "label": "安卓APK下载", "desc": "华为/小米全系兼容", "href": "/ouyi-app/android", "icon": "android" },
  { "label": "苹果iOS指引", "desc": "App Store · TestFlight", "href": "/ouyi-app/ios", "icon": "ios" }
]
```

### 大量动态子页（推荐 `templateType: "hub"` + 文件系统自动扫描）

适用于新闻、教程等大量同质子页。父页设置 `templateType: "hub"`，引擎自动扫描子目录并渲染列表。

> ⚠️ Hub 模板暂未实现，待具体需求时开发。

---

## 七、SEO 策略

### 关键词矩阵（以 ouyijiaoyisuo.org 为例）

| 类型 | 词 |
|------|-----|
| 主词（H1/Title 核心） | 欧意 |
| 同义词（正文自然散布） | OKX、殴易、OKEX、欧易、易欧 |
| 长尾词（FAQ/H3） | 欧意APP下载、欧意注册、欧意官网访问等 |

### 内容写作原则

- 第一句话直接回答用户问题（不写"随着区块链的发展..."）
- FAQ 的问题模拟真实搜索词
- H1 必须包含主词
- Title 格式：`{主Keyword} | {副Keyword}({辅助词}) {year}`

---

## 八、扩展：站群裂变流程

当需要为新品牌（如"殴易"、"欧信"等）建立新站时，操作步骤：

```bash
# 1. 复制本项目或克隆模板
# 2. 运行 AI 内容生成脚本
npm run generate:seo -- --brand="殴易" --prefix="ouyi" --domain="ouyicex.org"
# 脚本负责：
#   a. 生成所有内容 JSON（使用新品牌的关键词和文案）
#   b. 更新 site-config.json（brand、nav href 前缀）
#   c. 占位符 {brand} 自动替换为新品牌名
# 3. 构建并部署
npm run build && deploy to Cloudflare Pages
```

整个过程代码层零改动，只通过数据驱动生成新站。

---

## 九、关键文件索引

| 文件 | 职责 |
|------|------|
| `src/content/site-config.json` | 全站品牌、导航、CTA 配置 |
| `src/content/zh-CN/*.json` | 各页面内容数据 |
| `src/lib/content.ts` | 内容读取、模板变量替换、面包屑构建、路由扫描 |
| `src/app/page.tsx` | 首页（`/`）路由与渲染 |
| `src/app/[...slug]/page.tsx` | 所有内页的动态路由引擎 |
| `src/components/Header.tsx` | 导航栏（从 site-config 读取） |
| `src/components/Footer.tsx` | 页脚（从 site-config 读取） |
| `src/components/QuickLinks.tsx` | 首页快速入口组件 |
| `src/components/SubPageLayout.tsx` | 内页通用布局模板 |
| `src/components/PageHero.tsx` | Hero 区组件（H1 所在） |
| `next.config.js` | Next.js 配置（output: 'export' 静态导出） |

---

## 十、待办 / 未来计划

- [ ] **Hub 模板**：实现 `templateType: "hub"` 的极简子页列表渲染组件
- [x] **`children` 卡片渲染**：在 `SubPageLayout` 中提到了 Hero 区下方，提高首屏转化率
- [x] **sitemap.xml 自动化**：已通过 `postbuild` 脚本实现
- [x] **SEO 验证拦截**：部署前前置执行 `scripts/validate-seo.js`，缺失核心元素强制拦截
- [ ] **AI 内容生成脚本**：完善 `scripts/generate-content.js`，对接 DeepSeek/OpenAI API
- [ ] **`site-config.json` 自动生成**：脚本在生成内容 JSON 时同步写入 site-config
- [ ] **GitHub Actions 自动化**：定时触发内容生成 + 构建 + 部署到 Cloudflare Pages
- [ ] **`_redirects` 文件**（如需）：旧 URL 收录后的 301 跳转配置
