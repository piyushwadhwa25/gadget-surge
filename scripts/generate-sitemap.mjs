import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_URL = 'https://www.gadgetsurge.com';
const TODAY = new Date().toISOString().split('T')[0];

const routes = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/tools', priority: '0.9', changefreq: 'weekly' },
  { path: '/about', priority: '0.6', changefreq: 'monthly' },
  { path: '/contact', priority: '0.6', changefreq: 'monthly' },
  { path: '/pricing', priority: '0.6', changefreq: 'monthly' },
  { path: '/category/developer-tools', priority: '0.8', changefreq: 'weekly' },
  { path: '/category/image-tools', priority: '0.8', changefreq: 'weekly' },
  { path: '/category/text-tools', priority: '0.8', changefreq: 'weekly' },
  { path: '/category/document-tools', priority: '0.7', changefreq: 'weekly' },
  { path: '/category/calculators', priority: '0.7', changefreq: 'weekly' },
  { path: '/tools/json-formatter', priority: '0.9', changefreq: 'weekly' },
  { path: '/tools/base64-encoder', priority: '0.9', changefreq: 'weekly' },
  { path: '/tools/base64-decoder', priority: '0.9', changefreq: 'weekly' },
  { path: '/tools/regex-tester', priority: '0.9', changefreq: 'weekly' },
  { path: '/tools/uuid-generator', priority: '0.9', changefreq: 'weekly' },
  { path: '/tools/timestamp-converter', priority: '0.8', changefreq: 'weekly' },
  { path: '/tools/csv-to-json', priority: '0.8', changefreq: 'weekly' },
  { path: '/tools/json-to-csv', priority: '0.8', changefreq: 'weekly' },
  { path: '/tools/url-encoder', priority: '0.8', changefreq: 'weekly' },
  { path: '/tools/url-decoder', priority: '0.8', changefreq: 'weekly' },
  { path: '/tools/jwt-decoder', priority: '0.8', changefreq: 'weekly' },
  { path: '/tools/markdown-to-html', priority: '0.8', changefreq: 'weekly' },
  { path: '/tools/html-formatter', priority: '0.8', changefreq: 'weekly' },
  { path: '/tools/sql-formatter', priority: '0.8', changefreq: 'weekly' },
  { path: '/tools/color-converter', priority: '0.8', changefreq: 'weekly' },
  { path: '/tools/word-counter', priority: '0.8', changefreq: 'weekly' },
  { path: '/tools/character-counter', priority: '0.7', changefreq: 'weekly' },
  { path: '/tools/sentence-counter', priority: '0.7', changefreq: 'weekly' },
  { path: '/tools/paragraph-counter', priority: '0.7', changefreq: 'weekly' },
  { path: '/tools/case-converter', priority: '0.8', changefreq: 'weekly' },
  { path: '/tools/remove-extra-spaces', priority: '0.7', changefreq: 'weekly' },
  { path: '/tools/remove-line-breaks', priority: '0.7', changefreq: 'weekly' },
  { path: '/tools/text-sorter', priority: '0.7', changefreq: 'weekly' },
  { path: '/tools/duplicate-line-remover', priority: '0.7', changefreq: 'weekly' },
  { path: '/tools/reverse-text', priority: '0.7', changefreq: 'weekly' },
  { path: '/tools/slug-generator', priority: '0.7', changefreq: 'weekly' },
  { path: '/tools/lorem-ipsum-generator', priority: '0.7', changefreq: 'weekly' },
  { path: '/tools/random-password-generator', priority: '0.8', changefreq: 'weekly' },
  { path: '/tools/random-username-generator', priority: '0.7', changefreq: 'weekly' },
  { path: '/tools/text-to-list', priority: '0.7', changefreq: 'weekly' },
  { path: '/tools/image-resizer', priority: '0.9', changefreq: 'weekly' },
  { path: '/tools/image-cropper', priority: '0.8', changefreq: 'weekly' },
  { path: '/tools/image-rotator', priority: '0.7', changefreq: 'weekly' },
  { path: '/tools/image-flipper', priority: '0.7', changefreq: 'weekly' },
  { path: '/tools/image-to-png', priority: '0.8', changefreq: 'weekly' },
  { path: '/tools/image-to-jpg', priority: '0.8', changefreq: 'weekly' },
  { path: '/tools/png-to-webp', priority: '0.8', changefreq: 'weekly' },
  { path: '/tools/webp-to-png', priority: '0.7', changefreq: 'weekly' },
  { path: '/tools/image-compressor', priority: '0.9', changefreq: 'weekly' },
  { path: '/tools/image-color-picker', priority: '0.8', changefreq: 'weekly' },
  { path: '/tools/image-dimensions-checker', priority: '0.7', changefreq: 'weekly' },
  { path: '/tools/image-to-base64', priority: '0.7', changefreq: 'weekly' },
  { path: '/tools/base64-to-image', priority: '0.7', changefreq: 'weekly' },
  { path: '/tools/favicon-generator', priority: '0.8', changefreq: 'weekly' },
  { path: '/tools/image-format-info', priority: '0.7', changefreq: 'weekly' },
  { path: '/tools/pdf-merger', priority: '0.9', changefreq: 'weekly' },
  { path: '/tools/pdf-page-remover', priority: '0.8', changefreq: 'weekly' },
  { path: '/tools/pdf-splitter', priority: '0.9', changefreq: 'weekly' },
  { path: '/tools/unix-timestamp-converter', priority: '0.9', changefreq: 'weekly' },
  { path: '/tools/cron-expression-calculator', priority: '0.8', changefreq: 'weekly' },
  { path: '/tools/color-contrast-checker', priority: '0.8', changefreq: 'weekly' },
  { path: '/tools/data-size-converter', priority: '0.8', changefreq: 'weekly' },
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(r => `  <url>
    <loc>${BASE_URL}${r.path}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

writeFileSync(resolve(__dirname, '../public/sitemap.xml'), xml.trim());
console.log(`Wrote public/sitemap.xml with ${routes.length} URLs`);
