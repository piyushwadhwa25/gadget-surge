import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

if (process.env.SKIP_PRERENDER === '1') {
  console.log('SKIP_PRERENDER=1 — skipping');
  process.exit(0);
}

const BASE_URL = 'https://www.gadgetsurge.com';

const routeMeta = {
  '/': {
    title: 'GadgetSurge — Free Online Tools for Developers, Creators & Everyday Tasks',
    description: 'A growing collection of free browser-based utilities. JSON formatter, Base64 encoder, regex tester, UUID generator, image tools, and more. No signup required.',
    canonical: `${BASE_URL}/`,
  },
  '/tools': {
    title: 'All Free Online Tools — GadgetSurge',
    description: 'Browse all free online tools at GadgetSurge. Developer utilities, text tools, image converters, and everyday calculators. No signup, no login, runs in your browser.',
    canonical: `${BASE_URL}/tools`,
  },
  '/category/developer-tools': {
    title: 'Free Developer Tools Online — JSON, Base64, UUID, Regex & More | GadgetSurge',
    description: 'Free online developer tools including JSON formatter, Base64 encoder/decoder, UUID generator, regex tester, JWT decoder, timestamp converter, and more.',
    canonical: `${BASE_URL}/category/developer-tools`,
  },
  '/category/image-tools': {
    title: 'Free Online Image Tools — Resize, Convert, Compress & More | GadgetSurge',
    description: 'Free browser-based image tools. Resize, crop, rotate, compress, and convert images between formats (PNG, JPG, WebP). No upload to server — runs in your browser.',
    canonical: `${BASE_URL}/category/image-tools`,
  },
  '/category/text-tools': {
    title: 'Free Online Text Tools — Word Counter, Case Converter & More | GadgetSurge',
    description: 'Free text utilities including word counter, character counter, case converter, duplicate line remover, text sorter, lorem ipsum generator, and more.',
    canonical: `${BASE_URL}/category/text-tools`,
  },
  '/category/document-tools': {
    title: 'Free Online Document Tools — Markdown, HTML, SQL | GadgetSurge',
    description: 'Free document conversion and formatting tools. Convert Markdown to HTML, format SQL queries, format HTML, and more. All tools run in your browser.',
    canonical: `${BASE_URL}/category/document-tools`,
  },
  '/category/calculators': {
    title: 'Free Online Calculators — GadgetSurge',
    description: 'Free online calculators for everyday tasks. All calculators run directly in your browser with no signup required.',
    canonical: `${BASE_URL}/category/calculators`,
  },
  '/tools/json-formatter': { title: 'JSON Formatter & Validator — Free Online Tool | GadgetSurge', description: 'Free online JSON formatter, validator, and beautifier. Paste your JSON to instantly format, validate, and prettify it. Supports minification and error detection.', canonical: `${BASE_URL}/tools/json-formatter` },
  '/tools/base64-encoder': { title: 'Base64 Encoder — Free Online Text to Base64 | GadgetSurge', description: 'Free online Base64 encoder. Convert any text or string to Base64 instantly in your browser. No data sent to server. Fast and privacy-safe.', canonical: `${BASE_URL}/tools/base64-encoder` },
  '/tools/base64-decoder': { title: 'Base64 Decoder — Free Online Base64 to Text | GadgetSurge', description: 'Free online Base64 decoder. Convert Base64 encoded strings back to plain text instantly. Supports standard and URL-safe Base64. Runs in your browser.', canonical: `${BASE_URL}/tools/base64-decoder` },
  '/tools/regex-tester': { title: 'Regex Tester — Free Online Regular Expression Tester | GadgetSurge', description: 'Free online regex tester and debugger. Test regular expressions against sample text with real-time match highlighting. Supports flags: g, i, m, s.', canonical: `${BASE_URL}/tools/regex-tester` },
  '/tools/uuid-generator': { title: 'UUID Generator — Free Online UUID v4 Generator | GadgetSurge', description: 'Free online UUID generator. Generate RFC 4122 UUID v4 identifiers instantly using cryptographically secure random values. Bulk generation supported.', canonical: `${BASE_URL}/tools/uuid-generator` },
  '/tools/timestamp-converter': { title: 'Timestamp Converter — Unix Timestamp to Date | GadgetSurge', description: 'Free online Unix timestamp converter. Convert between Unix timestamps and human-readable dates instantly. Supports milliseconds, seconds, and UTC/local time.', canonical: `${BASE_URL}/tools/timestamp-converter` },
  '/tools/csv-to-json': { title: 'CSV to JSON Converter — Free Online Tool | GadgetSurge', description: 'Free online CSV to JSON converter. Paste your CSV data and instantly convert it to formatted JSON. Supports headers, custom delimiters, and file download.', canonical: `${BASE_URL}/tools/csv-to-json` },
  '/tools/json-to-csv': { title: 'JSON to CSV Converter — Free Online Tool | GadgetSurge', description: 'Free online JSON to CSV converter. Convert JSON arrays to CSV format instantly. Supports nested objects, custom delimiters, and file download.', canonical: `${BASE_URL}/tools/json-to-csv` },
  '/tools/url-encoder': { title: 'URL Encoder — Free Online URL Encoding Tool | GadgetSurge', description: 'Free online URL encoder. Percent-encode special characters in URLs and query strings instantly. Essential for API development and web scraping.', canonical: `${BASE_URL}/tools/url-encoder` },
  '/tools/url-decoder': { title: 'URL Decoder — Free Online URL Decoding Tool | GadgetSurge', description: 'Free online URL decoder. Convert percent-encoded URLs back to readable text instantly. Decode query strings, path components, and encoded characters.', canonical: `${BASE_URL}/tools/url-decoder` },
  '/tools/jwt-decoder': { title: 'JWT Decoder — Free Online JSON Web Token Decoder | GadgetSurge', description: 'Free online JWT decoder. Decode and inspect JSON Web Token headers, payloads, and signatures without a secret key. Useful for debugging auth flows.', canonical: `${BASE_URL}/tools/jwt-decoder` },
  '/tools/markdown-to-html': { title: 'Markdown to HTML Converter — Free Online Tool | GadgetSurge', description: 'Free online Markdown to HTML converter. Paste Markdown and instantly preview the rendered HTML output. Supports GitHub Flavored Markdown (GFM).', canonical: `${BASE_URL}/tools/markdown-to-html` },
  '/tools/html-formatter': { title: 'HTML Formatter & Beautifier — Free Online Tool | GadgetSurge', description: 'Free online HTML formatter and beautifier. Paste minified or messy HTML and instantly format it with proper indentation for readability.', canonical: `${BASE_URL}/tools/html-formatter` },
  '/tools/sql-formatter': { title: 'SQL Formatter & Beautifier — Free Online Tool | GadgetSurge', description: 'Free online SQL formatter and beautifier. Format messy SQL queries with proper indentation and line breaks. Supports MySQL, PostgreSQL, and standard SQL.', canonical: `${BASE_URL}/tools/sql-formatter` },
  '/tools/color-converter': { title: 'Color Converter — HEX, RGB, HSL & More | GadgetSurge', description: 'Free online color converter. Convert between HEX, RGB, HSL, HSV, and CMYK color formats instantly. Perfect for web design and CSS development.', canonical: `${BASE_URL}/tools/color-converter` },
  '/tools/word-counter': { title: 'Word Counter — Free Online Word & Character Count | GadgetSurge', description: 'Free online word counter. Count words, characters, sentences, and paragraphs instantly. Also shows reading time and keyword density.', canonical: `${BASE_URL}/tools/word-counter` },
  '/tools/character-counter': { title: 'Character Counter — Free Online Character Count Tool | GadgetSurge', description: 'Free online character counter. Count characters with and without spaces instantly. Useful for Twitter, meta descriptions, SMS, and character-limited fields.', canonical: `${BASE_URL}/tools/character-counter` },
  '/tools/sentence-counter': { title: 'Sentence Counter — Free Online Sentence Count Tool | GadgetSurge', description: 'Free online sentence counter. Count the number of sentences in any text instantly. Useful for writing analysis, readability checks, and content editing.', canonical: `${BASE_URL}/tools/sentence-counter` },
  '/tools/paragraph-counter': { title: 'Paragraph Counter — Free Online Paragraph Count Tool | GadgetSurge', description: 'Free online paragraph counter. Count the number of paragraphs in any text instantly. Useful for document formatting and content structure analysis.', canonical: `${BASE_URL}/tools/paragraph-counter` },
  '/tools/case-converter': { title: 'Case Converter — UPPER, lower, Title, camelCase | GadgetSurge', description: 'Free online text case converter. Convert text to UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case, and more instantly.', canonical: `${BASE_URL}/tools/case-converter` },
  '/tools/remove-extra-spaces': { title: 'Remove Extra Spaces — Free Online Whitespace Cleaner | GadgetSurge', description: 'Free online tool to remove extra spaces from text. Strip leading, trailing, and duplicate whitespace from any text instantly.', canonical: `${BASE_URL}/tools/remove-extra-spaces` },
  '/tools/remove-line-breaks': { title: 'Remove Line Breaks — Free Online Tool | GadgetSurge', description: 'Free online tool to remove line breaks from text. Convert multi-line text to a single line or replace line breaks with spaces or custom characters.', canonical: `${BASE_URL}/tools/remove-line-breaks` },
  '/tools/text-sorter': { title: 'Text Sorter — Sort Lines Alphabetically Online | GadgetSurge', description: 'Free online text sorter. Sort lines of text alphabetically, reverse alphabetically, by length, or randomly. Supports case-sensitive and case-insensitive sorting.', canonical: `${BASE_URL}/tools/text-sorter` },
  '/tools/duplicate-line-remover': { title: 'Duplicate Line Remover — Free Online Tool | GadgetSurge', description: 'Free online duplicate line remover. Paste text and instantly remove all duplicate lines. Supports case-sensitive and case-insensitive matching.', canonical: `${BASE_URL}/tools/duplicate-line-remover` },
  '/tools/reverse-text': { title: 'Reverse Text Generator — Free Online Tool | GadgetSurge', description: 'Free online text reverser. Reverse any text, sentence, or word order instantly. Useful for puzzles, encodings, and fun creative writing.', canonical: `${BASE_URL}/tools/reverse-text` },
  '/tools/slug-generator': { title: 'Slug Generator — Free URL Slug Creator Online | GadgetSurge', description: 'Free online URL slug generator. Convert any text or title into a clean, SEO-friendly URL slug. Removes special characters, spaces, and converts to lowercase.', canonical: `${BASE_URL}/tools/slug-generator` },
  '/tools/lorem-ipsum-generator': { title: 'Lorem Ipsum Generator — Free Placeholder Text | GadgetSurge', description: 'Free online Lorem Ipsum generator. Generate placeholder text by paragraphs, sentences, or words. Used for UI mockups, design prototypes, and content placeholders.', canonical: `${BASE_URL}/tools/lorem-ipsum-generator` },
  '/tools/random-password-generator': { title: 'Password Generator — Free Secure Random Password | GadgetSurge', description: 'Free online password generator. Create strong, random passwords with custom length and character sets. Runs entirely in your browser — passwords never leave your device.', canonical: `${BASE_URL}/tools/random-password-generator` },
  '/tools/random-username-generator': { title: 'Username Generator — Free Random Username Creator | GadgetSurge', description: 'Free online username generator. Create unique, random usernames for accounts, games, and platforms. Customise length and style instantly.', canonical: `${BASE_URL}/tools/random-username-generator` },
  '/tools/text-to-list': { title: 'Text to List Converter — Free Online Tool | GadgetSurge', description: 'Free online text to list converter. Convert plain text into bulleted, numbered, or comma-separated lists instantly. Useful for formatting content.', canonical: `${BASE_URL}/tools/text-to-list` },
  '/tools/image-resizer': { title: 'Image Resizer — Free Online Image Resize Tool | GadgetSurge', description: 'Free online image resizer. Resize images to exact dimensions or by percentage. Supports PNG, JPG, WebP. All processing runs in your browser — no upload required.', canonical: `${BASE_URL}/tools/image-resizer` },
  '/tools/image-cropper': { title: 'Image Cropper — Free Online Image Crop Tool | GadgetSurge', description: 'Free online image cropper. Crop images to custom dimensions or aspect ratios. Supports PNG, JPG, WebP. Runs in your browser with no server upload.', canonical: `${BASE_URL}/tools/image-cropper` },
  '/tools/image-rotator': { title: 'Image Rotator — Free Online Image Rotation Tool | GadgetSurge', description: 'Free online image rotator. Rotate images 90°, 180°, or 270° clockwise or counter-clockwise. Supports PNG, JPG, and WebP. No upload required.', canonical: `${BASE_URL}/tools/image-rotator` },
  '/tools/image-flipper': { title: 'Image Flipper — Free Online Horizontal & Vertical Flip | GadgetSurge', description: 'Free online image flipper. Flip images horizontally or vertically instantly. Supports PNG, JPG, and WebP. All processing runs locally in your browser.', canonical: `${BASE_URL}/tools/image-flipper` },
  '/tools/image-to-png': { title: 'Image to PNG Converter — Free Online Tool | GadgetSurge', description: 'Free online image to PNG converter. Convert JPG, WebP, GIF, and other formats to PNG instantly. Preserves transparency. Runs in your browser.', canonical: `${BASE_URL}/tools/image-to-png` },
  '/tools/image-to-jpg': { title: 'Image to JPG Converter — Free Online Tool | GadgetSurge', description: 'Free online image to JPG converter. Convert PNG, WebP, GIF, and other formats to JPG with custom quality settings. No upload required.', canonical: `${BASE_URL}/tools/image-to-jpg` },
  '/tools/png-to-webp': { title: 'PNG to WebP Converter — Free Online Tool | GadgetSurge', description: 'Free online PNG to WebP converter. Convert PNG images to WebP format for smaller file sizes and faster web performance. Runs entirely in your browser.', canonical: `${BASE_URL}/tools/png-to-webp` },
  '/tools/webp-to-png': { title: 'WebP to PNG Converter — Free Online Tool | GadgetSurge', description: 'Free online WebP to PNG converter. Convert WebP images to PNG format for broader compatibility. Runs in your browser with no server upload.', canonical: `${BASE_URL}/tools/webp-to-png` },
  '/tools/image-compressor': { title: 'Image Compressor — Free Online Image Compression Tool | GadgetSurge', description: 'Free online image compressor. Reduce image file size without losing quality. Supports PNG, JPG, and WebP. All compression runs locally in your browser.', canonical: `${BASE_URL}/tools/image-compressor` },
  '/tools/image-color-picker': { title: 'Image Color Picker — Free Online HEX & RGB Color Picker | GadgetSurge', description: 'Free online image color picker. Upload any image and click to pick colors. Returns HEX, RGB, and HSL values instantly. No server upload required.', canonical: `${BASE_URL}/tools/image-color-picker` },
  '/tools/image-dimensions-checker': { title: 'Image Dimensions Checker — Free Online Tool | GadgetSurge', description: 'Free online image dimensions checker. Upload an image to instantly see its width, height, file size, resolution, and format. No data sent to server.', canonical: `${BASE_URL}/tools/image-dimensions-checker` },
  '/tools/image-to-base64': { title: 'Image to Base64 Converter — Free Online Tool | GadgetSurge', description: 'Free online image to Base64 converter. Convert PNG, JPG, or WebP images to Base64 encoded strings for use in CSS, HTML, or JSON APIs. Runs in your browser.', canonical: `${BASE_URL}/tools/image-to-base64` },
  '/tools/base64-to-image': { title: 'Base64 to Image Converter — Free Online Tool | GadgetSurge', description: 'Free online Base64 to image converter. Paste a Base64 encoded image string and instantly preview and download the decoded image. No server upload.', canonical: `${BASE_URL}/tools/base64-to-image` },
  '/tools/favicon-generator': { title: 'Favicon Generator — Free Online Favicon Creator | GadgetSurge', description: 'Free online favicon generator. Upload an image and generate favicon files in all required sizes (16x16, 32x32, 48x48, 64x64). Download as ICO or PNG.', canonical: `${BASE_URL}/tools/favicon-generator` },
  '/tools/image-format-info': { title: 'Image Format Info — Free Online Image Metadata Viewer | GadgetSurge', description: 'Free online image format info tool. Upload any image to see its format, dimensions, file size, colour depth, and metadata. Runs entirely in your browser.', canonical: `${BASE_URL}/tools/image-format-info` },
};

const defaultMeta = {
  title: 'GadgetSurge — Free Online Tools for Developers, Creators & Everyday Tasks',
  description: 'Free browser-based utilities. JSON formatter, Base64 encoder, image tools, text tools, and more. No signup required.',
};

function escapeAttr(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function injectMeta(html, route) {
  const meta = routeMeta[route] ?? { ...defaultMeta, canonical: `${BASE_URL}${route}` };
  const title = escapeAttr(meta.title);
  const description = escapeAttr(meta.description);
  const canonical = meta.canonical;

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);

  if (html.includes('name="description"')) {
    html = html.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${description}"`);
  } else {
    html = html.replace('</head>', `<meta name="description" content="${description}" />\n</head>`);
  }

  if (html.includes('rel="canonical"')) {
    html = html.replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${canonical}"`);
  } else {
    html = html.replace('</head>', `<link rel="canonical" href="${canonical}" />\n</head>`);
  }

  if (html.includes('og:title')) {
    html = html.replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${title}"`);
  } else {
    html = html.replace('</head>', `<meta property="og:title" content="${title}" />\n</head>`);
  }

  if (html.includes('og:description')) {
    html = html.replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${description}"`);
  } else {
    html = html.replace('</head>', `<meta property="og:description" content="${description}" />\n</head>`);
  }

  if (html.includes('og:url')) {
    html = html.replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${canonical}"`);
  } else {
    html = html.replace('</head>', `<meta property="og:url" content="${canonical}" />\n</head>`);
  }

  if (!html.includes('og:type')) {
    html = html.replace('</head>', `<meta property="og:type" content="website" />\n</head>`);
  }
  if (!html.includes('og:site_name')) {
    html = html.replace('</head>', `<meta property="og:site_name" content="GadgetSurge" />\n</head>`);
  }

  return html;
}

const distDir = resolve(__dirname, '../dist');
const template = readFileSync(resolve(distDir, 'index.html'), 'utf-8');

const routes = Object.keys(routeMeta);

// Overwrite root index.html
writeFileSync(resolve(distDir, 'index.html'), injectMeta(template, '/'));
console.log('Updated: dist/index.html');

// Write per-route shells
for (const route of routes) {
  if (route === '/') continue;
  const dir = resolve(distDir, route.slice(1));
  mkdirSync(dir, { recursive: true });
  writeFileSync(resolve(dir, 'index.html'), injectMeta(template, route));
  console.log(`Generated: dist${route}/index.html`);
}

console.log(`\nDone: ${routes.length} routes`);
