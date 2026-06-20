/** SEO title/description per /tools/:slug — kept in one module for ToolPage + parity with prerender script. */
export const toolSeoMetaMap: Record<string, { title: string; description: string }> = {
  "json-formatter": {
    title: "JSON Formatter & Validator — Free Online Tool | GadgetSurge",
    description: "Free online JSON formatter, validator, and beautifier. Paste your JSON to instantly format, validate, and prettify it. Supports minification and error detection.",
  },
  "base64-encoder": {
    title: "Base64 Encoder — Free Online Text to Base64 | GadgetSurge",
    description: "Free online Base64 encoder. Convert any text or string to Base64 instantly in your browser. No data sent to server. Fast and privacy-safe.",
  },
  "base64-decoder": {
    title: "Base64 Decoder — Free Online Base64 to Text | GadgetSurge",
    description: "Free online Base64 decoder. Convert Base64 encoded strings back to plain text instantly. Supports standard and URL-safe Base64. Runs in your browser.",
  },
  "regex-tester": {
    title: "Regex Tester — Free Online Regular Expression Tester | GadgetSurge",
    description: "Free online regex tester and debugger. Test regular expressions against sample text with real-time match highlighting. Supports flags: g, i, m, s.",
  },
  "uuid-generator": {
    title: "UUID Generator — Free Online UUID v4 Generator | GadgetSurge",
    description: "Free online UUID generator. Generate RFC 4122 UUID v4 identifiers instantly using cryptographically secure random values. Bulk generation supported.",
  },
  "timestamp-converter": {
    title: "Timestamp Converter — Unix Timestamp to Date | GadgetSurge",
    description: "Free online Unix timestamp converter. Convert between Unix timestamps and human-readable dates instantly. Supports milliseconds, seconds, and UTC/local time.",
  },
  "csv-to-json": {
    title: "CSV to JSON Converter — Free Online Tool | GadgetSurge",
    description: "Free online CSV to JSON converter. Paste your CSV data and instantly convert it to formatted JSON. Supports headers, custom delimiters, and file download.",
  },
  "json-to-csv": {
    title: "JSON to CSV Converter — Free Online Tool | GadgetSurge",
    description: "Free online JSON to CSV converter. Convert JSON arrays to CSV format instantly. Supports nested objects, custom delimiters, and file download.",
  },
  "url-encoder": {
    title: "URL Encoder — Free Online URL Encoding Tool | GadgetSurge",
    description: "Free online URL encoder. Percent-encode special characters in URLs and query strings instantly. Essential for API development and web scraping.",
  },
  "url-decoder": {
    title: "URL Decoder — Free Online URL Decoding Tool | GadgetSurge",
    description: "Free online URL decoder. Convert percent-encoded URLs back to readable text instantly. Decode query strings, path components, and encoded characters.",
  },
  "jwt-decoder": {
    title: "JWT Decoder — Free Online JSON Web Token Decoder | GadgetSurge",
    description: "Free online JWT decoder. Decode and inspect JSON Web Token headers, payloads, and signatures without a secret key. Useful for debugging auth flows.",
  },
  "markdown-to-html": {
    title: "Markdown to HTML Converter — Free Online Tool | GadgetSurge",
    description: "Free online Markdown to HTML converter. Paste Markdown and instantly preview the rendered HTML output. Supports GitHub Flavored Markdown (GFM).",
  },
  "html-formatter": {
    title: "HTML Formatter & Beautifier — Free Online Tool | GadgetSurge",
    description: "Free online HTML formatter and beautifier. Paste minified or messy HTML and instantly format it with proper indentation for readability.",
  },
  "sql-formatter": {
    title: "SQL Formatter & Beautifier — Free Online Tool | GadgetSurge",
    description: "Free online SQL formatter and beautifier. Format messy SQL queries with proper indentation and line breaks. Supports MySQL, PostgreSQL, and standard SQL.",
  },
  "color-converter": {
    title: "Color Converter — HEX, RGB, HSL & More | GadgetSurge",
    description: "Free online color converter. Convert between HEX, RGB, HSL, HSV, and CMYK color formats instantly. Perfect for web design and CSS development.",
  },
  "word-counter": {
    title: "Word Counter — Free Online Word & Character Count | GadgetSurge",
    description: "Free online word counter. Count words, characters, sentences, and paragraphs instantly. Also shows reading time and keyword density.",
  },
  "character-counter": {
    title: "Character Counter — Free Online Character Count Tool | GadgetSurge",
    description: "Free online character counter. Count characters with and without spaces instantly. Useful for Twitter, meta descriptions, SMS, and character-limited fields.",
  },
  "sentence-counter": {
    title: "Sentence Counter — Free Online Sentence Count Tool | GadgetSurge",
    description: "Free online sentence counter. Count the number of sentences in any text instantly. Useful for writing analysis, readability checks, and content editing.",
  },
  "paragraph-counter": {
    title: "Paragraph Counter — Free Online Paragraph Count Tool | GadgetSurge",
    description: "Free online paragraph counter. Count the number of paragraphs in any text instantly. Useful for document formatting and content structure analysis.",
  },
  "case-converter": {
    title: "Case Converter — UPPER, lower, Title, camelCase | GadgetSurge",
    description: "Free online text case converter. Convert text to UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case, and more instantly.",
  },
  "remove-extra-spaces": {
    title: "Remove Extra Spaces — Free Online Whitespace Cleaner | GadgetSurge",
    description: "Free online tool to remove extra spaces from text. Strip leading, trailing, and duplicate whitespace from any text instantly.",
  },
  "remove-line-breaks": {
    title: "Remove Line Breaks — Free Online Tool | GadgetSurge",
    description: "Free online tool to remove line breaks from text. Convert multi-line text to a single line or replace line breaks with spaces or custom characters.",
  },
  "text-sorter": {
    title: "Text Sorter — Sort Lines Alphabetically Online | GadgetSurge",
    description: "Free online text sorter. Sort lines of text alphabetically, reverse alphabetically, by length, or randomly. Supports case-sensitive and case-insensitive sorting.",
  },
  "duplicate-line-remover": {
    title: "Duplicate Line Remover — Free Online Tool | GadgetSurge",
    description: "Free online duplicate line remover. Paste text and instantly remove all duplicate lines. Supports case-sensitive and case-insensitive matching.",
  },
  "reverse-text": {
    title: "Reverse Text Generator — Free Online Tool | GadgetSurge",
    description: "Free online text reverser. Reverse any text, sentence, or word order instantly. Useful for puzzles, encodings, and fun creative writing.",
  },
  "slug-generator": {
    title: "Slug Generator — Free URL Slug Creator Online | GadgetSurge",
    description: "Free online URL slug generator. Convert any text or title into a clean, SEO-friendly URL slug. Removes special characters, spaces, and converts to lowercase.",
  },
  "lorem-ipsum-generator": {
    title: "Lorem Ipsum Generator — Free Placeholder Text | GadgetSurge",
    description: "Free online Lorem Ipsum generator. Generate placeholder text by paragraphs, sentences, or words. Used for UI mockups, design prototypes, and content placeholders.",
  },
  "random-password-generator": {
    title: "Password Generator — Free Secure Random Password | GadgetSurge",
    description: "Free online password generator. Create strong, random passwords with custom length and character sets. Runs entirely in your browser — passwords never leave your device.",
  },
  "random-username-generator": {
    title: "Username Generator — Free Random Username Creator | GadgetSurge",
    description: "Free online username generator. Create unique, random usernames for accounts, games, and platforms. Customise length and style instantly.",
  },
  "text-to-list": {
    title: "Text to List Converter — Free Online Tool | GadgetSurge",
    description: "Free online text to list converter. Convert plain text into bulleted, numbered, or comma-separated lists instantly. Useful for formatting content.",
  },
  "image-resizer": {
    title: "Image Resizer — Free Online Image Resize Tool | GadgetSurge",
    description: "Free online image resizer. Resize images to exact dimensions or by percentage. Supports PNG, JPG, WebP. All processing runs in your browser — no upload required.",
  },
  "image-cropper": {
    title: "Image Cropper — Free Online Image Crop Tool | GadgetSurge",
    description: "Free online image cropper. Crop images to custom dimensions or aspect ratios. Supports PNG, JPG, WebP. Runs in your browser with no server upload.",
  },
  "image-rotator": {
    title: "Image Rotator — Free Online Image Rotation Tool | GadgetSurge",
    description: "Free online image rotator. Rotate images 90°, 180°, or 270° clockwise or counter-clockwise. Supports PNG, JPG, and WebP. No upload required.",
  },
  "image-flipper": {
    title: "Image Flipper — Free Online Horizontal & Vertical Flip | GadgetSurge",
    description: "Free online image flipper. Flip images horizontally or vertically instantly. Supports PNG, JPG, and WebP. All processing runs locally in your browser.",
  },
  "image-to-png": {
    title: "Image to PNG Converter — Free Online Tool | GadgetSurge",
    description: "Free online image to PNG converter. Convert JPG, WebP, GIF, and other formats to PNG instantly. Preserves transparency. Runs in your browser.",
  },
  "image-to-jpg": {
    title: "Image to JPG Converter — Free Online Tool | GadgetSurge",
    description: "Free online image to JPG converter. Convert PNG, WebP, GIF, and other formats to JPG with custom quality settings. No upload required.",
  },
  "png-to-webp": {
    title: "PNG to WebP Converter — Free Online Tool | GadgetSurge",
    description: "Free online PNG to WebP converter. Convert PNG images to WebP format for smaller file sizes and faster web performance. Runs entirely in your browser.",
  },
  "webp-to-png": {
    title: "WebP to PNG Converter — Free Online Tool | GadgetSurge",
    description: "Free online WebP to PNG converter. Convert WebP images to PNG format for broader compatibility. Runs in your browser with no server upload.",
  },
  "image-compressor": {
    title: "Image Compressor — Free Online Image Compression Tool | GadgetSurge",
    description: "Free online image compressor. Reduce image file size without losing quality. Supports PNG, JPG, and WebP. All compression runs locally in your browser.",
  },
  "image-color-picker": {
    title: "Image Color Picker — Free Online HEX & RGB Color Picker | GadgetSurge",
    description: "Free online image color picker. Upload any image and click to pick colors. Returns HEX, RGB, and HSL values instantly. No server upload required.",
  },
  "image-dimensions-checker": {
    title: "Image Dimensions Checker — Free Online Tool | GadgetSurge",
    description: "Free online image dimensions checker. Upload an image to instantly see its width, height, file size, resolution, and format. No data sent to server.",
  },
  "image-to-base64": {
    title: "Image to Base64 Converter — Free Online Tool | GadgetSurge",
    description: "Free online image to Base64 converter. Convert PNG, JPG, or WebP images to Base64 encoded strings for use in CSS, HTML, or JSON APIs. Runs in your browser.",
  },
  "base64-to-image": {
    title: "Base64 to Image Converter — Free Online Tool | GadgetSurge",
    description: "Free online Base64 to image converter. Paste a Base64 encoded image string and instantly preview and download the decoded image. No server upload.",
  },
  "favicon-generator": {
    title: "Favicon Generator — Free Online Favicon Creator | GadgetSurge",
    description: "Free online favicon generator. Upload an image and generate favicon files in all required sizes (16x16, 32x32, 48x48, 64x64). Download as ICO or PNG.",
  },
  "image-format-info": {
    title: "Image Format Info — Free Online Image Metadata Viewer | GadgetSurge",
    description: "Free online image format info tool. Upload any image to see its format, dimensions, file size, colour depth, and metadata. Runs entirely in your browser.",
  },
  "pdf-merger": {
    title: "PDF Merger — Combine PDF Files Online Free | GadgetSurge",
    description: "Free online PDF merger. Combine multiple PDF files into one document, reorder before merging. Runs entirely in your browser — no upload required.",
  },
  "pdf-page-remover": {
    title: "PDF Page Remover — Delete PDF Pages Online Free | GadgetSurge",
    description: "Free online PDF page remover. Select pages to delete by number or range. Download the edited PDF instantly. 100% client-side processing.",
  },
  "pdf-splitter": {
    title: "PDF Splitter — Split PDF Files Online Free | GadgetSurge",
    description: "Free online PDF splitter. Split PDFs every N pages or by custom page ranges. Download separate files instantly. Runs in your browser.",
  },
  "unix-timestamp-converter": {
    title: "Unix Timestamp Converter — Epoch to Date Online Free | GadgetSurge",
    description: "Convert Unix timestamps (seconds or milliseconds) to ISO 8601, UTC, local time, and relative time. Free online epoch converter.",
  },
  "cron-expression-calculator": {
    title: "Cron Expression Calculator — Parse Cron Online Free | GadgetSurge",
    description: "Parse standard 5-field cron expressions into human-readable schedules. See the next 5 run times. Free online cron calculator.",
  },
  "color-contrast-checker": {
    title: "Color Contrast Calculator — WCAG Ratio Checker Free | GadgetSurge",
    description: "Calculate WCAG contrast ratio between two hex colors. Check AA and AAA pass/fail for normal and large text. Free accessibility checker.",
  },
  "data-size-converter": {
    title: "Data Size Converter — Bytes, KB, MB, GB Online Free | GadgetSurge",
    description: "Convert storage units between binary (KiB, MiB, GiB) and decimal (KB, MB, GB) systems. Free online data size converter.",
  },
};

export const toolSeoFallbackMeta = {
  title: "Free Online Tool — GadgetSurge",
  description: "Free browser-based utility. No signup required. Runs entirely in your browser.",
} as const;
