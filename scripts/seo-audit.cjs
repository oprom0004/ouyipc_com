const fs = require('fs');
const path = require('path');

// Target directory paths
const APP_DIR = path.join(process.cwd(), 'src/app');
const COMPONENTS_DIR = path.join(process.cwd(), 'src/components');
const CONTENT_DIR = path.join(process.cwd(), 'src/content');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

console.log('\n🔍 Running Complete SEO Audit for Next.js (Optimized V3)\n');

const results = {
    pass: 0,
    warning: 0,
    error: 0,
    checks: []
};

// Helper functions
function checkFile(filePath) {
    return fs.existsSync(path.join(process.cwd(), filePath));
}

function readFile(filePath) {
    try {
        return fs.readFileSync(path.join(process.cwd(), filePath), 'utf-8');
    } catch {
        return null;
    }
}

function addCheck(name, status, message) {
    results.checks.push({ name, status, message });
    results[status]++;

    const icon = status === 'pass' ? '✅' : status === 'warning' ? '⚠️' : '❌';
    console.log(`${icon} ${name}: ${message}`);
}

// Helper to recursively scan directory
function scanDir(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.next' && file !== 'dist') {
                scanDir(filePath, fileList);
            }
        } else if (/\.(tsx|ts|js|jsx)$/.test(file)) {
            fileList.push(filePath);
        }
    });
    return fileList;
}

const allFiles = [...scanDir(APP_DIR), ...scanDir(COMPONENTS_DIR), ...scanDir(CONTENT_DIR)];

// 1. Check 404 Page (src/app/not-found.tsx)
console.log('📄 Checking 404 Page...\n');
if (checkFile('src/app/not-found.tsx')) {
    const content = readFile('src/app/not-found.tsx');
    const hasNoIndex = /robots:\s*\{[^}]*index:\s*false/i.test(content);
    if (!hasNoIndex) {
        addCheck('404 Page', 'warning', 'Missing noindex in metadata (Recommended)');
    } else {
        addCheck('404 Page', 'pass', 'Properly configured with noindex');
    }
} else {
    addCheck('404 Page', 'warning', 'not-found.tsx recommended (using Next.js default currently)');
}

// 2. Check External CSS (src/app/layout.tsx)
console.log('\n🎨 Checking External CSS...\n');
const layoutContent = readFile('src/app/layout.tsx');
if (layoutContent) {
    const hasGoogleFonts = /fonts\.googleapis\.com/i.test(layoutContent) || /next\/font\/google/.test(layoutContent);
    const hasChinaCDN = /fonts\.(font\.im|loli\.net|geekzu\.org)/i.test(layoutContent);

    if (hasGoogleFonts) {
        addCheck('External CSS', 'warning', 'Using Google Fonts (slow in China, consider local fonts)');
    } else if (hasChinaCDN) {
        addCheck('External CSS', 'pass', 'Using China-friendly CDN for fonts');
    } else {
        addCheck('External CSS', 'pass', 'No external CSS dependencies / System fonts used');
    }
} else {
    addCheck('External CSS', 'error', 'Could not read src/app/layout.tsx');
}

// 3. Scan for External Images
console.log('\n🖼️  Checking External Images...\n');
const externalImages = [];

function scanForExternalImages(filePath) {
    const content = readFile(filePath);
    if (!content) return [];

    const findings = [];
    const patterns = [
        /src=["']https?:\/\/[^"']+\.(jpg|jpeg|png|gif|webp|svg|ico)[^"']*["']/gi,
        /https?:\/\/(s2\.coinmarketcap\.com|picsum\.photos|unsplash\.com)[^\s"'`<>]*/gi,
    ];

    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim().startsWith('//') || line.trim().startsWith('/*')) continue;

        patterns.forEach(pattern => {
            const matches = [...line.matchAll(pattern)];
            matches.forEach(match => {
                let url = match[0];
                if (url.includes('src=')) {
                    url = url.match(/https?:\/\/[^\s"'`]+/)?.[0] || url;
                }
                findings.push({
                    file: path.basename(filePath),
                    line: i + 1,
                    url: url
                });
            });
        });
    }
    return findings;
}

allFiles.forEach(absolutePath => {
    const relativePath = path.relative(process.cwd(), absolutePath);
    externalImages.push(...scanForExternalImages(relativePath));
});

if (externalImages.length === 0) {
    addCheck('External Images', 'pass', 'No external image dependencies found');
} else {
    const domains = [...new Set(externalImages.map(img => {
        try { return new URL(img.url.replace(/["']/g, '')).hostname; } catch { return 'unknown'; }
    }))];
    addCheck('External Images', 'warning', `Found ${externalImages.length} external image(s) from: ${domains.join(', ')}`);
}

// ✨ NEW: 4. Check Hardcoded Dates
console.log('\n📅 Checking Hardcoded Dates...\n');
// Format: YYYY-MM-DD or YYYY/MM/DD — look for static date strings in content files
const hardcodedDatePattern = /['"`>]\s*\d{4}[-\/](0[1-9]|1[0-2])[-\/](0[1-9]|[12]\d|3[01])\s*['"`<]/;
const dateInContentFiles = [];

allFiles.forEach(absolutePath => {
    const relativePath = path.relative(process.cwd(), absolutePath);
    const content = readFile(relativePath);
    if (!content) return;

    const lines = content.split('\n');
    lines.forEach((line, idx) => {
        // Skip comments and dynamic date expressions (TODAY, new Date, etc.)
        if (line.trim().startsWith('//') || line.trim().startsWith('*')) return;
        if (/TODAY|new Date|toISOString|toLocaleDateString|getFullYear/i.test(line)) return;

        if (hardcodedDatePattern.test(line)) {
            const match = line.match(/\d{4}[-\/](0[1-9]|1[0-2])[-\/](0[1-9]|[12]\d|3[01])/);
            if (match) {
                console.log(`   🔸 Hardcoded date "${match[0]}" in ${path.basename(absolutePath)}:${idx + 1}`);
                dateInContentFiles.push({ file: path.basename(absolutePath), line: idx + 1, date: match[0] });
            }
        }
    });
});

if (dateInContentFiles.length === 0) {
    addCheck('Hardcoded Dates', 'pass', 'No hardcoded dates found in content files');
} else {
    addCheck('Hardcoded Dates', 'warning', `Found ${dateInContentFiles.length} hardcoded date(s) — consider using dynamic date`);
}


// 5. Check Meta Tags & Canonical
console.log('\n🏷️  Checking Meta Tags & Canonical...\n');
if (layoutContent) {
    const hasMetadataBase = /metadataBase:/i.test(layoutContent);

    if (hasMetadataBase) {
        addCheck('metadataBase', 'pass', 'metadataBase configured in Root Layout');
    } else {
        addCheck('metadataBase', 'error', 'Missing metadataBase in layout.tsx — canonical URLs will be relative only');
    }

    // ✨ Per-page canonical self-reference check
    // Risk: if layout.tsx sets alternates: { canonical: '/' } and inner pages don't override,
    // ALL inner pages will output canonical pointing to homepage — severe SEO damage.
    const pageFiles = allFiles.filter(f => f.endsWith('page.tsx'));
    const layoutHasCanonical = /alternates\s*:[\s\S]*?canonical\s*:/i.test(layoutContent);
    const pagesWithoutCanonical = [];

    pageFiles.forEach(file => {
        const content = readFile(path.relative(process.cwd(), file));
        if (!content) return;
        // Skip redirect pages and noindex pages — they don't need canonical
        if (/redirect\s*\(/.test(content)) return;
        if (/robots\s*:[\s\S]*?index\s*:\s*false/i.test(content)) return;

        const hasOwnCanonical = /alternates\s*:[\s\S]*?canonical\s*:/i.test(content);
        if (!hasOwnCanonical) {
            pagesWithoutCanonical.push(path.relative(process.cwd(), file));
        }
    });

    if (pagesWithoutCanonical.length === 0) {
        addCheck('Per-page Canonical', 'pass', `All ${pageFiles.length} page(s) have self-referencing canonical`);
    } else if (layoutHasCanonical) {
        // Layout has a canonical (e.g. '/') — inner pages without override will inherit it → points to homepage!
        pagesWithoutCanonical.forEach(f => console.log(`   🔸 Missing canonical: ${f}`));
        addCheck('Per-page Canonical', 'error',
            `${pagesWithoutCanonical.length} inner page(s) missing canonical — will inherit layout's '/' → canonical points to homepage!`);
    } else {
        // Layout has no canonical — Next.js auto-infers from URL (safe, but explicit is better)
        pagesWithoutCanonical.forEach(f => console.log(`   🔸 No explicit canonical: ${f}`));
        addCheck('Per-page Canonical', 'warning',
            `${pagesWithoutCanonical.length} page(s) rely on auto-inferred canonical (safe, but consider explicit self-reference)`);
    }

    const checks = {
        title: /title:/i.test(layoutContent),
        description: /description:/i.test(layoutContent),
    };
    const missing = Object.entries(checks).filter(([, found]) => !found).map(([tag]) => tag);

    if (missing.length === 0) {
        addCheck('Meta Tags', 'pass', 'Global Title and Description configured');
    } else {
        addCheck('Meta Tags', 'warning', `Missing in Root Layout: ${missing.join(', ')}`);
    }
}


// ✨ NEW: 6. Check Favicon / Icons
console.log('\n🖼️  Checking Favicon & Icons...\n');
const hasFaviconIco = checkFile('public/favicon.ico') || checkFile('src/app/favicon.ico');
const hasAppleIcon = checkFile('public/apple-icon.png') || checkFile('src/app/apple-icon.png');
const hasIconInLayout = layoutContent && /icons:/i.test(layoutContent);

if (hasFaviconIco && (hasAppleIcon || hasIconInLayout)) {
    addCheck('Favicon & Icons', 'pass', 'favicon.ico + apple icon configured');
} else if (hasFaviconIco) {
    addCheck('Favicon & Icons', 'warning', 'favicon.ico found but missing apple-icon or icons config in layout');
} else {
    addCheck('Favicon & Icons', 'error', 'No favicon found (public/favicon.ico or app/favicon.ico)');
}

// 7. Check Robots & Sitemap
console.log('\n🤖 Checking Robots & Sitemap...\n');
const hasPublicRobots = checkFile('public/robots.txt');
const hasAppRobots = checkFile('src/app/robots.ts');

if (hasPublicRobots || hasAppRobots) {
    const source = hasPublicRobots ? 'static (public/robots.txt)' : 'dynamic (app/robots.ts)';
    addCheck('Robots.txt', 'pass', `Configured via ${source}`);
} else {
    addCheck('Robots.txt', 'warning', 'No robots.txt found');
}

const hasPublicSitemap = checkFile('public/sitemap.xml');
const hasAppSitemap = checkFile('src/app/sitemap.ts');

if (hasPublicSitemap || hasAppSitemap) {
    const source = hasPublicSitemap ? 'static (public/sitemap.xml)' : 'dynamic (app/sitemap.ts)';
    addCheck('Sitemap', 'pass', `Configured via ${source}`);
} else {
    addCheck('Sitemap', 'warning', 'No sitemap found');
}

// 8. Check Schema.org
console.log('\n📋 Checking Schema.org...\n');
let schemaCount = 0;
allFiles.filter(f => f.endsWith('page.tsx')).forEach(file => {
    const content = readFile(path.relative(process.cwd(), file));
    if (content && (/@context.*schema\.org/i.test(content) || /application\/ld\+json/i.test(content))) {
        schemaCount++;
    }
});
if (schemaCount > 0) {
    addCheck('Schema.org', 'pass', `Structured data found in ${schemaCount} page(s)`);
} else {
    addCheck('Schema.org', 'warning', 'No Schema.org markup found');
}

// 9. Check Image Optimization
console.log('\n🖼️  Checking Image Optimization...\n');
let unoptimizedImgCount = 0;
let optimizedCount = 0;

function checkImageUsage(filePath) {
    const relativePath = path.relative(process.cwd(), filePath);
    const content = readFile(relativePath);
    if (!content) return;

    if (content.includes('next/image')) optimizedCount++;

    const imgMatches = content.match(/<img[^>]+src=/gi);
    if (imgMatches) {
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
            if (/<img[^>]+src=/i.test(line)) {
                if (line.includes('${') || line.includes('BASE_PATH') || line.includes('process.env')) {
                    // Considered manually optimized
                } else {
                    if (!line.includes('lucide-react')) {
                        console.log(`   🔸 Potential unoptimized <img> in ${path.basename(filePath)}:${idx + 1}`);
                        unoptimizedImgCount++;
                    }
                }
            }
        });
    }
}

allFiles.forEach(file => checkImageUsage(file));

if (unoptimizedImgCount === 0) {
    addCheck('Image Optimization', 'pass', 'All images optimized (next/image or manual handling)');
} else {
    addCheck('Image Optimization', 'warning', `Found ${unoptimizedImgCount} unoptimized <img> tag(s)`);
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 SEO Audit Summary\n');
console.log(`Total Checks: ${results.checks.length}`);
console.log(`✅ Pass: ${results.pass}`);
console.log(`⚠️  Warnings: ${results.warning}`);
console.log(`❌ Errors: ${results.error}`);

const score = Math.round((results.pass / results.checks.length) * 100);
console.log(`\n📈 SEO Score: ${score}/100\n`);
