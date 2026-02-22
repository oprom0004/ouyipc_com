/**
 * generate-sitemap.js
 * postbuild 钩子：自动根据 src/content/zh-CN/ 目录结构生成 sitemap.xml
 * 运行：node scripts/generate-sitemap.js
 */

const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'out');
const CONTENT_DIR = path.join(__dirname, '..', 'src', 'content', 'zh-CN');
const CONFIG_PATH = path.join(__dirname, '..', 'src', 'content', 'site-config.json');

const siteConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
const domain = siteConfig.domain.replace(/\/$/, ''); // 去掉末尾斜杠

// 递归扫描内容目录，返回所有 slug 数组
function getAllSlugs(dir, prefix = []) {
    const slugs = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        if (entry.isDirectory()) {
            slugs.push(...getAllSlugs(path.join(dir, entry.name), [...prefix, entry.name]));
        } else if (entry.name.endsWith('.json')) {
            const name = entry.name.replace('.json', '');
            slugs.push([...prefix, name]);
        }
    }
    return slugs;
}

// 根据 slug 深度和类型指定优先级
function getPriority(slug) {
    if (slug.length === 1) {
        if (['ouyi-app', 'ouyi-zhuce'].includes(slug[0])) return '0.9';
        return '0.8';
    }
    return '0.7';
}

function getChangefreq(slug) {
    if (slug.length === 1 && ['ouyi-app', 'ouyi-zhuce'].includes(slug[0])) return 'weekly';
    if (slug[0] === 'homepage') return 'daily';
    return 'weekly';
}

// 生成 sitemap.xml 内容
function generateSitemap() {
    const allSlugs = getAllSlugs(CONTENT_DIR);
    const today = new Date().toISOString().split('T')[0];

    const urls = [];

    // 首页
    urls.push(`  <url>
    <loc>${domain}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`);

    // 所有内页（跳过 homepage）
    for (const slug of allSlugs) {
        if (slug.length === 1 && slug[0] === 'homepage') continue;
        const urlPath = slug.join('/');
        urls.push(`  <url>
    <loc>${domain}/${urlPath}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${getChangefreq(slug)}</changefreq>
    <priority>${getPriority(slug)}</priority>
  </url>`);
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;
}

// 写入 out/sitemap.xml
if (!fs.existsSync(OUT_DIR)) {
    console.error('❌ out/ 目录不存在，请先运行 npm run build');
    process.exit(1);
}

const content = generateSitemap();
const outPath = path.join(OUT_DIR, 'sitemap.xml');
fs.writeFileSync(outPath, content, 'utf8');
console.log(`✅ sitemap.xml 已生成：${outPath}`);
console.log(`   收录 URL 总数：${content.match(/<url>/g)?.length || 0}`);

// 同步更新 public/sitemap.xml（开发环境可用）
const publicPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(publicPath, content, 'utf8');
console.log(`✅ public/sitemap.xml 已同步更新`);
