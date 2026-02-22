import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'src/content/zh-CN');

// 读取 site-config.json（放在最前面，其他函数依赖它）
export function getSiteConfig() {
    const filePath = path.join(process.cwd(), 'src/content/site-config.json');
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// 模板变量替换：{year} → 当前年份，{brand} → 站点品牌名
function processTemplate(raw: string): string {
    const year = new Date().getFullYear().toString();
    const brand: string = getSiteConfig().brand;
    return raw
        .replace(/\{year\}/g, year)
        .replace(/\{brand\}/g, brand);
}

// 原有函数保留：首页 page.tsx 用 getPageContent('homepage') 读取
export function getPageContent(pageName: string) {
    const filePath = path.join(CONTENT_DIR, `${pageName}.json`);
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(processTemplate(raw));
}

// 由 slug 数组精确定位文件路径
// ['ouyi-app']       → src/content/zh-CN/ouyi-app.json
// ['ouyi-app', 'ios'] → src/content/zh-CN/ouyi-app/ios.json
export function getPageContentBySlug(slugParts: string[]) {
    const filePath = path.join(CONTENT_DIR, ...slugParts) + '.json';
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(processTemplate(raw));
}

// 递归扫描 content 目录，返回所有 JSON 文件对应的 slug 数组
export function getAllContentSlugs(): string[][] {
    const slugs: string[][] = [];

    function scan(dir: string, prefix: string[]) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            if (entry.isDirectory()) {
                scan(path.join(dir, entry.name), [...prefix, entry.name]);
            } else if (entry.isFile() && entry.name.endsWith('.json')) {
                const name = entry.name.replace('.json', '');
                slugs.push([...prefix, name]);
            }
        }
    }

    scan(CONTENT_DIR, []);
    return slugs;
}

// 自动构建面包屑：逐级读取 navLabel
export function buildBreadcrumbs(slugParts: string[]): { label: string; href: string }[] {
    const crumbs: { label: string; href: string }[] = [{ label: '首页', href: '/' }];

    for (let i = 0; i < slugParts.length; i++) {
        const partialPath = slugParts.slice(0, i + 1);
        let label = partialPath[partialPath.length - 1]; // 默认用 slug 本身
        try {
            const content = getPageContentBySlug(partialPath);
            label = content.navLabel
                || content.metadata?.title?.split('|')[0]?.trim()
                || label;
        } catch { /* 读不到就用 slug 文字 */ }

        crumbs.push({
            label,
            href: '/' + partialPath.join('/')
        });
    }

    return crumbs;
}

export function getCurrentYear() {
    return new Date().getFullYear();
}
