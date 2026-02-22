# SEO 部署清单

> ⚠️ **AI 代理注意：每次开新会话前必须先读 ARCHITECTURE.md，再读本文件。**
> 本文件是部署拦截机制的补充说明，`validate:seo` 脚本会自动检查大部分项目。

---

## 自动检查项（`npm run validate:seo` 自动验证，失败则阻断部署）

- [ ] `out/sitemap.xml` 是否存在（由 `postbuild` 自动生成）
- [ ] `out/robots.txt` 是否存在
- [ ] `out/404.html` 是否存在
- [ ] `robots.txt` 是否包含正确域名和 Sitemap 声明
- [ ] `sitemap.xml` 是否包含首页 URL
- [ ] `sitemap.xml` 是否使用了正确域名（非 theokex.com 等旧域名）
- [ ] 所有页面 HTML 是否有 `<link rel="canonical">`
- [ ] 所有页面 HTML 是否有 `<meta name="description">`
- [ ] 404 页面是否有 `noindex` 指令

---

## 人工检查项（需要人工或 AI 判断，脚本无法自动检测）

### 内容质量
- [ ] 每个页面的 H1（`hero.title`）是否包含页面主关键词"欧意"？
- [ ] `metadata.title` 格式是否符合：`{主词} | {副词} {year}` 规范？
- [ ] FAQ 的 question 是否模拟真实搜索词（而非"问题1"这类占位符）？
- [ ] 正文是否直接切入主题（非"随着区块链的发展..."这类开场）？

### 导航完整性
- [ ] `site-config.json` 中的所有 href 是否与 `src/content/zh-CN/` 目录下的文件路径完全对应？
- [ ] Header 的 nav 和 Footer 的 footerNav 是否均从 `site-config.json` 读取（无硬编码链接）？
- [ ] 内页的 `children` 字段（如 ouyi-app.json）是否与实际子页文件一致？

### 结构化数据
- [ ] `SubPageLayout` 自动嵌入了 `WebPage` + `FAQPage` schema（代码层保障，无需手动）
- [ ] 首页的 `WebSite` schema 是否在 `src/app/page.tsx` 中（已实现）

### 其他
- [ ] `navLabel` 字段是否在所有新增 JSON 中填写？
- [ ] 新增页面是否有 `{year}` 和 `{brand}` 占位符（而非硬编码年份和品牌名）？
- [ ] Cloudflare Pages 的构建命令是否设置为 `npm run deploy`（而非单独 `npm run build`）？

---

## 部署前必跑命令

```bash
# 完整部署流程（构建 + 自动生成 sitemap + SEO 验证）
npm run deploy

# 单独验证（不重新构建，仅检查 out/ 目录）
npm run validate:seo
```

---

## 站群裂变时的额外检查

- [ ] `site-config.json` 中的 `domain` 是否已更新为新域名？
- [ ] `site-config.json` 中的 `brand` 是否已更新为新品牌词？
- [ ] `SubPageLayout.tsx` 中 `domain` 常量是否已更新（或改为读取 site-config）？
- [ ] `not-found.tsx` 链接是否指向新站的正确路径？
- [ ] `robots.txt` 中的域名是否已更新？

---

## 文件职责速查

| 脚本 | 触发时机 | 作用 |
|------|----------|------|
| `scripts/generate-sitemap.js` | `npm run build` 完成后（postbuild 钩子）自动触发 | 生成最新 sitemap.xml |
| `scripts/validate-seo.js` | `npm run validate:seo` 或 `npm run deploy` | 检查 SEO 完整性，失败则退出 |
| `npm run deploy` | 手动部署前 | build + sitemap + validate 全流程 |
