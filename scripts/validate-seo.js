/**
 * validate-seo.js
 * 构建后 SEO 验证脚本：检查所有关键 SEO 要素是否就位
 * 运行：node scripts/validate-seo.js
 * 若有问题以非零退出码退出（CI/CD 将阻断部署）
 */

const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'out');
const CONFIG_PATH = path.join(__dirname, '..', 'src', 'content', 'site-config.json');
const siteConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
const domain = siteConfig.domain.replace(/\/$/, '');

let errors = 0;
let warnings = 0;

function ok(msg) { console.log(`  ✅ ${msg}`); }
function warn(msg) { console.warn(`  ⚠️  ${msg}`); warnings++; }
function fail(msg) { console.error(`  ❌ ${msg}`); errors++; }

console.log('\n🔍 SEO 验证开始...\n');

// ── 1. 关键文件存在性检查 ─────────────────────────────────
console.log('【1】关键文件检查');

const requiredFiles = [
    ['out/sitemap.xml', 'sitemap.xml'],
    ['out/robots.txt', 'robots.txt'],
    ['out/404.html', '404 错误页'],
];
for (const [rel, label] of requiredFiles) {
    const fullPath = path.join(__dirname, '..', rel);
    if (fs.existsSync(fullPath)) {
        ok(`${label} 存在`);
    } else {
        fail(`${label} 不存在（${rel}）`);
    }
}

// ── 2. robots.txt 内容检查 ────────────────────────────────
console.log('\n【2】robots.txt 内容检查');
const robotsPath = path.join(OUT_DIR, 'robots.txt');
if (fs.existsSync(robotsPath)) {
    const robots = fs.readFileSync(robotsPath, 'utf8');
    if (robots.includes('Sitemap:')) {
        ok('robots.txt 包含 Sitemap 声明');
    } else {
        fail('robots.txt 缺少 Sitemap 声明');
    }
    if (robots.includes(domain)) {
        ok(`robots.txt 域名正确（${domain}）`);
    } else {
        warn(`robots.txt 中的域名可能不正确（期望包含 ${domain}）`);
    }
}

// ── 3. sitemap.xml 内容检查 ───────────────────────────────
console.log('\n【3】sitemap.xml 内容检查');
const sitemapPath = path.join(OUT_DIR, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
    const sitemap = fs.readFileSync(sitemapPath, 'utf8');
    const urlCount = (sitemap.match(/<url>/g) || []).length;
    const hasHomepage = sitemap.includes(`${domain}/</loc>`);
    const hasWrongDomain = sitemap.includes('theokex.com') || sitemap.includes('xuuaph.cn');

    if (urlCount > 0) ok(`sitemap.xml 包含 ${urlCount} 个 URL`);
    else fail('sitemap.xml 没有 URL');

    if (hasHomepage) ok('首页 URL 存在于 sitemap');
    else fail('首页 URL 不在 sitemap 中');

    if (hasWrongDomain) fail('sitemap 中包含错误域名（theokex.com 或其他）');
    else ok('sitemap 域名正确');
}

// ── 4. HTML 页面 SEO 要素抽查 ─────────────────────────────
console.log('\n【4】HTML 页面 SEO 要素抽查');

function getHtmlFiles(dir, files = []) {
    if (!fs.existsSync(dir)) return files;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) getHtmlFiles(fullPath, files);
        else if (entry.name === 'index.html') files.push(fullPath);
    }
    return files;
}

const htmlFiles = getHtmlFiles(OUT_DIR);
let missingCanonical = 0;
let missingDescription = 0;
let missingTitle = 0;

for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8');
    const relPath = path.relative(OUT_DIR, file);
    if (!html.includes('<link rel="canonical"')) missingCanonical++;
    if (!html.includes('<meta name="description"')) missingDescription++;
    if (!html.match(/<title>[^<]{5,}/)) missingTitle++;
}

if (missingCanonical === 0) ok(`所有 ${htmlFiles.length} 个页面都有 canonical 标签`);
else fail(`${missingCanonical} 个页面缺少 canonical 标签`);

if (missingDescription === 0) ok('所有页面都有 meta description');
else fail(`${missingDescription} 个页面缺少 meta description`);

if (missingTitle === 0) ok('所有页面都有 <title> 标签');
else fail(`${missingTitle} 个页面缺少 <title> 标签`);

// ── 5. 404 页面 noindex 检查 ──────────────────────────────
console.log('\n【5】404 页面检查');
const notFoundPath = path.join(OUT_DIR, '404.html');
if (fs.existsSync(notFoundPath)) {
    const html404 = fs.readFileSync(notFoundPath, 'utf8');
    if (html404.includes('noindex') || html404.includes('none')) {
        ok('404 页面包含 noindex 指令');
    } else {
        fail('404 页面缺少 noindex 指令（会被搜索引擎收录）');
    }
}

// ── 汇总 ──────────────────────────────────────────────────
console.log('\n─────────────────────────────────────');
console.log(`📊 验证结果：${errors} 个错误，${warnings} 个警告`);

if (errors > 0) {
    console.error(`\n🚫 SEO 验证失败，请修复上述错误后再部署。`);
    process.exit(1);
} else if (warnings > 0) {
    console.warn(`\n✅ 验证通过（有 ${warnings} 个警告，建议关注）。`);
} else {
    console.log(`\n✅ 所有 SEO 检查通过，可以部署。`);
}
