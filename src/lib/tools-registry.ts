export interface FaqItem {
  question: string;
  answer: string;
}

export interface ToolConfig {
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  description: string;
  keywords: string[];
  seoTitle: string;
  metaDescription: string;
  introText: string;
  exampleInput: string;
  exampleOutput: string;
  faqItems: FaqItem[];
  relatedToolSlugs: string[];
  type: 'standard' | 'custom';
  useCases: string[];
  featured?: boolean;
  popular?: boolean;
}

export interface CategoryConfig {
  name: string;
  slug: string;
  description: string;
  introText: string;
  comingSoon?: boolean;
}

export const categories: CategoryConfig[] = [
  {
    name: 'Developer Tools',
    slug: 'developer-tools',
    description: 'Essential tools for software developers and engineers.',
    introText: 'A collection of free browser-based developer tools to help you format, encode, decode, convert, and validate data. All tools run entirely in your browser — no data is sent to any server.',
  },
  {
    name: 'Image Tools',
    slug: 'image-tools',
    description: 'Tools for image conversion, resizing, and optimization.',
    introText: 'A collection of free browser-based image tools. Resize, crop, convert, compress, and inspect images — all processing happens entirely in your browser for complete privacy.',
  },
  {
    name: 'Text Tools',
    slug: 'text-tools',
    description: 'Tools for text manipulation, formatting, counting, and generation.',
    introText: 'A collection of free browser-based text utilities. Count words, convert case, generate passwords, clean up text, and more — all running entirely in your browser with no data sent to any server.',
  },
  {
    name: 'Document Tools',
    slug: 'document-tools',
    description: 'Tools for document conversion and processing.',
    introText: 'Document tools coming soon.',
    comingSoon: true,
  },
  {
    name: 'Calculators',
    slug: 'calculators',
    description: 'Useful online calculators for everyday tasks.',
    introText: 'Calculators coming soon.',
    comingSoon: true,
  },
];

export const tools: ToolConfig[] = [
  {
    name: 'JSON Formatter & Validator',
    slug: 'json-formatter',
    category: 'Developer Tools',
    categorySlug: 'developer-tools',
    description: 'Format, beautify, and validate JSON data with syntax highlighting.',
    keywords: ['json', 'formatter', 'validator', 'beautify', 'pretty print'],
    seoTitle: 'JSON Formatter & Validator Online — Free JSON Beautifier',
    metaDescription: 'Format, validate, and beautify JSON data online for free. Paste your JSON and get pretty-printed output instantly. No signup required.',
    introText: 'This free online JSON formatter and validator lets you paste raw JSON and instantly get a beautifully formatted, indented result. It also validates your JSON and shows clear error messages if the syntax is invalid.',
    exampleInput: '{"name":"John","age":30,"hobbies":["reading","coding"],"address":{"city":"NYC"}}',
    exampleOutput: '{\n  "name": "John",\n  "age": 30,\n  "hobbies": [\n    "reading",\n    "coding"\n  ],\n  "address": {\n    "city": "NYC"\n  }\n}',
    faqItems: [
      { question: 'What is JSON formatting?', answer: 'JSON formatting (or beautifying) adds proper indentation and line breaks to compressed JSON data, making it easier to read and debug.' },
      { question: 'Does this tool validate JSON?', answer: 'Yes. If your JSON has syntax errors, the tool will display a clear error message showing what went wrong.' },
      { question: 'Is my data safe?', answer: 'Absolutely. All processing happens in your browser. No data is ever sent to a server.' },
    ],
    relatedToolSlugs: ['json-to-csv', 'csv-to-json', 'jwt-decoder'],
    type: 'standard',
    useCases: ['Debugging API responses', 'Formatting configuration files', 'Validating JSON payloads before sending requests'],
    featured: true,
    popular: true,
  },
  {
    name: 'Base64 Encoder',
    slug: 'base64-encoder',
    category: 'Developer Tools',
    categorySlug: 'developer-tools',
    description: 'Encode text or data into Base64 format instantly.',
    keywords: ['base64', 'encoder', 'encode', 'convert'],
    seoTitle: 'Base64 Encoder Online — Encode Text to Base64 Free',
    metaDescription: 'Encode any text into Base64 format instantly in your browser. Free online Base64 encoder with no signup required.',
    introText: 'Convert plain text into Base64 encoded format. Base64 encoding is commonly used for embedding data in URLs, emails, and API payloads.',
    exampleInput: 'Hello, World! This is a test.',
    exampleOutput: 'SGVsbG8sIFdvcmxkISBUaGlzIGlzIGEgdGVzdC4=',
    faqItems: [
      { question: 'What is Base64 encoding?', answer: 'Base64 is a binary-to-text encoding scheme that converts binary data into ASCII characters, commonly used for data transfer.' },
      { question: 'Can I encode files?', answer: 'This tool encodes text input. For file encoding, convert the file to text first.' },
      { question: 'Is Base64 encryption?', answer: 'No. Base64 is encoding, not encryption. It can be easily decoded by anyone.' },
    ],
    relatedToolSlugs: ['base64-decoder', 'url-encoder', 'jwt-decoder'],
    type: 'standard',
    useCases: ['Encoding data for URLs', 'Embedding images in HTML/CSS', 'Encoding API authentication tokens'],
    featured: true,
  },
  {
    name: 'Base64 Decoder',
    slug: 'base64-decoder',
    category: 'Developer Tools',
    categorySlug: 'developer-tools',
    description: 'Decode Base64 encoded text back to readable format.',
    keywords: ['base64', 'decoder', 'decode', 'convert'],
    seoTitle: 'Base64 Decoder Online — Decode Base64 to Text Free',
    metaDescription: 'Decode Base64 encoded strings back to readable text instantly. Free online Base64 decoder — no signup needed.',
    introText: 'Paste Base64 encoded text and instantly decode it back to readable format. Useful for inspecting encoded API responses, tokens, and embedded data.',
    exampleInput: 'SGVsbG8sIFdvcmxkISBUaGlzIGlzIGEgdGVzdC4=',
    exampleOutput: 'Hello, World! This is a test.',
    faqItems: [
      { question: 'What is Base64 decoding?', answer: 'Base64 decoding converts Base64 encoded ASCII text back into its original binary or text form.' },
      { question: 'Why does decoding fail?', answer: 'Decoding fails if the input is not valid Base64. Ensure there are no extra spaces or invalid characters.' },
      { question: 'Can I decode Base64 images?', answer: 'This tool decodes Base64 to text. For image data, the decoded output will show raw binary data.' },
    ],
    relatedToolSlugs: ['base64-encoder', 'url-decoder', 'jwt-decoder'],
    type: 'standard',
    useCases: ['Inspecting encoded API responses', 'Decoding email attachments', 'Reading encoded configuration values'],
  },
  {
    name: 'Regex Tester',
    slug: 'regex-tester',
    category: 'Developer Tools',
    categorySlug: 'developer-tools',
    description: 'Test regular expressions with live matching and highlighting.',
    keywords: ['regex', 'regular expression', 'tester', 'pattern matching'],
    seoTitle: 'Regex Tester Online — Test Regular Expressions Free',
    metaDescription: 'Test and debug regular expressions with live matching and highlighting. Free online regex tester — no signup required.',
    introText: 'Enter a regex pattern and test string to see all matches highlighted in real time. Supports JavaScript regex syntax with configurable flags.',
    exampleInput: 'Pattern: \\b\\w+@\\w+\\.\\w+\\b\nText: Contact us at hello@example.com or support@test.org',
    exampleOutput: 'Matches found: 2\n1. hello@example.com (index 17)\n2. support@test.org (index 40)',
    faqItems: [
      { question: 'What regex syntax is supported?', answer: 'This tool uses JavaScript regex syntax, which supports most standard regex features including groups, lookaheads, and quantifiers.' },
      { question: 'What are regex flags?', answer: 'Flags modify regex behavior: g (global), i (case-insensitive), m (multiline), s (dotAll), u (unicode).' },
      { question: 'Why is my regex not matching?', answer: 'Check for unescaped special characters and ensure your flags are set correctly. JavaScript regex may differ from other flavors.' },
    ],
    relatedToolSlugs: ['json-formatter', 'url-encoder', 'markdown-to-html'],
    type: 'custom',
    useCases: ['Validating email or URL patterns', 'Extracting data from text', 'Building search and replace patterns'],
    featured: true,
    popular: true,
  },
  {
    name: 'UUID Generator',
    slug: 'uuid-generator',
    category: 'Developer Tools',
    categorySlug: 'developer-tools',
    description: 'Generate random UUID v4 values for your projects.',
    keywords: ['uuid', 'guid', 'generator', 'random', 'unique id'],
    seoTitle: 'UUID Generator Online — Generate UUID v4 Free',
    metaDescription: 'Generate random UUID v4 values instantly. Bulk generation supported. Free online UUID generator — no signup needed.',
    introText: 'Generate cryptographically random UUID v4 identifiers. Perfect for database primary keys, session tokens, and unique identifiers in your applications.',
    exampleInput: 'Count: 3',
    exampleOutput: 'f47ac10b-58cc-4372-a567-0e02b2c3d479\n9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d\n1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
    faqItems: [
      { question: 'What is UUID v4?', answer: 'UUID v4 is a universally unique identifier generated using random numbers. It has a negligible probability of collision.' },
      { question: 'How many UUIDs can I generate?', answer: 'You can generate up to 100 UUIDs at once using the bulk generation feature.' },
      { question: 'Are these UUIDs truly random?', answer: 'Yes. This tool uses the Web Crypto API (crypto.randomUUID) which provides cryptographically strong random values.' },
    ],
    relatedToolSlugs: ['timestamp-converter', 'json-formatter', 'base64-encoder'],
    type: 'custom',
    useCases: ['Generating database primary keys', 'Creating unique session tokens', 'Testing applications that require unique IDs'],
    featured: true,
    popular: true,
  },
  {
    name: 'Unix Timestamp Converter',
    slug: 'timestamp-converter',
    category: 'Developer Tools',
    categorySlug: 'developer-tools',
    description: 'Convert between Unix timestamps and human-readable dates.',
    keywords: ['timestamp', 'unix', 'epoch', 'date', 'converter'],
    seoTitle: 'Unix Timestamp Converter Online — Epoch to Date Free',
    metaDescription: 'Convert Unix timestamps to human-readable dates and vice versa. Free online timestamp converter — no signup required.',
    introText: 'Convert Unix epoch timestamps to human-readable dates, or convert any date into a Unix timestamp. Supports both seconds and milliseconds.',
    exampleInput: '1700000000',
    exampleOutput: 'UTC: Tue, 14 Nov 2023 22:13:20 GMT\nISO: 2023-11-14T22:13:20.000Z\nLocal: 11/14/2023, 5:13:20 PM',
    faqItems: [
      { question: 'What is a Unix timestamp?', answer: 'A Unix timestamp is the number of seconds that have elapsed since January 1, 1970 (UTC), also known as the Unix epoch.' },
      { question: 'Seconds vs milliseconds?', answer: 'Unix timestamps in seconds are 10 digits. JavaScript uses milliseconds (13 digits). This tool auto-detects both formats.' },
      { question: 'How do I get the current timestamp?', answer: 'Click the "Now" button to get the current Unix timestamp, or use Date.now() in JavaScript.' },
    ],
    relatedToolSlugs: ['uuid-generator', 'json-formatter', 'base64-encoder'],
    type: 'custom',
    useCases: ['Converting API timestamps', 'Debugging date-related bugs', 'Converting log file timestamps'],
    popular: true,
  },
  {
    name: 'CSV to JSON Converter',
    slug: 'csv-to-json',
    category: 'Developer Tools',
    categorySlug: 'developer-tools',
    description: 'Convert CSV data into structured JSON arrays.',
    keywords: ['csv', 'json', 'converter', 'data', 'transform'],
    seoTitle: 'CSV to JSON Converter Online — Free Data Converter',
    metaDescription: 'Convert CSV data to JSON format instantly. Free online CSV to JSON converter with no signup required.',
    introText: 'Paste CSV data with headers and convert it into a structured JSON array. Each row becomes a JSON object with keys from the header row.',
    exampleInput: 'name,age,city\nAlice,30,NYC\nBob,25,LA',
    exampleOutput: '[\n  {\n    "name": "Alice",\n    "age": "30",\n    "city": "NYC"\n  },\n  {\n    "name": "Bob",\n    "age": "25",\n    "city": "LA"\n  }\n]',
    faqItems: [
      { question: 'Does the CSV need headers?', answer: 'Yes. The first row is used as field names for the JSON objects.' },
      { question: 'What delimiter is supported?', answer: 'Currently comma-separated values are supported. Tab and semicolon support coming soon.' },
      { question: 'Can I convert large CSV files?', answer: 'This tool works well for moderate-sized data. For very large files, consider a dedicated converter.' },
    ],
    relatedToolSlugs: ['json-to-csv', 'json-formatter', 'url-encoder'],
    type: 'standard',
    useCases: ['Converting spreadsheet exports', 'Preparing data for APIs', 'Migrating data between formats'],
  },
  {
    name: 'JSON to CSV Converter',
    slug: 'json-to-csv',
    category: 'Developer Tools',
    categorySlug: 'developer-tools',
    description: 'Convert JSON arrays into downloadable CSV format.',
    keywords: ['json', 'csv', 'converter', 'export', 'data'],
    seoTitle: 'JSON to CSV Converter Online — Free Data Converter',
    metaDescription: 'Convert JSON arrays to CSV format instantly. Free online JSON to CSV converter — no signup required.',
    introText: 'Convert a JSON array of objects into CSV format. Object keys become column headers and values become rows.',
    exampleInput: '[{"name":"Alice","age":30,"city":"NYC"},{"name":"Bob","age":25,"city":"LA"}]',
    exampleOutput: 'name,age,city\n"Alice","30","NYC"\n"Bob","25","LA"',
    faqItems: [
      { question: 'What JSON format is required?', answer: 'The input must be a JSON array of objects. All objects should have the same keys.' },
      { question: 'How are nested objects handled?', answer: 'Nested objects are converted to their string representation. Flatten nested data for best results.' },
      { question: 'Can I download the CSV?', answer: 'Yes. Use the Download button to save the CSV output as a file.' },
    ],
    relatedToolSlugs: ['csv-to-json', 'json-formatter', 'url-decoder'],
    type: 'standard',
    useCases: ['Exporting API data to spreadsheets', 'Creating reports from JSON data', 'Data migration tasks'],
  },
  {
    name: 'URL Encoder',
    slug: 'url-encoder',
    category: 'Developer Tools',
    categorySlug: 'developer-tools',
    description: 'Encode text for safe use in URLs and query strings.',
    keywords: ['url', 'encoder', 'encode', 'percent encoding', 'query string'],
    seoTitle: 'URL Encoder Online — Encode URLs & Query Strings Free',
    metaDescription: 'Encode text for safe use in URLs and query strings. Free online URL encoder — no signup required.',
    introText: 'Encode special characters in text for safe use in URLs. Converts spaces, symbols, and non-ASCII characters into percent-encoded format.',
    exampleInput: 'Hello World! How are you? param=value&key=data',
    exampleOutput: 'Hello%20World!%20How%20are%20you%3F%20param%3Dvalue%26key%3Ddata',
    faqItems: [
      { question: 'What is URL encoding?', answer: 'URL encoding replaces unsafe characters with percent-encoded equivalents (e.g., space becomes %20) for safe transmission in URLs.' },
      { question: 'When should I URL encode?', answer: 'Encode text when including it in URL query parameters, form submissions, or any URL component with special characters.' },
      { question: 'What characters get encoded?', answer: 'Special characters like spaces, &, =, ?, #, and non-ASCII characters are encoded. Letters, digits, and -_.~ are not.' },
    ],
    relatedToolSlugs: ['url-decoder', 'base64-encoder', 'json-formatter'],
    type: 'standard',
    useCases: ['Encoding query parameters', 'Building API request URLs', 'Encoding form data for submission'],
  },
  {
    name: 'URL Decoder',
    slug: 'url-decoder',
    category: 'Developer Tools',
    categorySlug: 'developer-tools',
    description: 'Decode percent-encoded URLs back to readable text.',
    keywords: ['url', 'decoder', 'decode', 'percent encoding'],
    seoTitle: 'URL Decoder Online — Decode Encoded URLs Free',
    metaDescription: 'Decode percent-encoded URLs and query strings back to readable text. Free online URL decoder — no signup required.',
    introText: 'Decode percent-encoded URL strings back into human-readable text. Useful for debugging URL parameters and inspecting encoded links.',
    exampleInput: 'Hello%20World!%20How%20are%20you%3F%20param%3Dvalue%26key%3Ddata',
    exampleOutput: 'Hello World! How are you? param=value&key=data',
    faqItems: [
      { question: 'What is URL decoding?', answer: 'URL decoding converts percent-encoded characters back to their original form (e.g., %20 becomes a space).' },
      { question: 'Why does decoding fail?', answer: 'Decoding can fail if the input contains malformed percent-encoding sequences (e.g., %ZZ is not valid).' },
      { question: 'Can I decode entire URLs?', answer: 'Yes, paste any URL and all encoded characters will be decoded to their readable equivalents.' },
    ],
    relatedToolSlugs: ['url-encoder', 'base64-decoder', 'json-formatter'],
    type: 'standard',
    useCases: ['Debugging encoded URLs', 'Reading query parameters', 'Inspecting redirect URLs'],
  },
  {
    name: 'JWT Decoder',
    slug: 'jwt-decoder',
    category: 'Developer Tools',
    categorySlug: 'developer-tools',
    description: 'Decode JSON Web Tokens to inspect header and payload.',
    keywords: ['jwt', 'json web token', 'decoder', 'token', 'auth'],
    seoTitle: 'JWT Decoder Online — Decode JSON Web Tokens Free',
    metaDescription: 'Decode JWT tokens to inspect header and payload data. Free online JWT decoder — no signup, no data sent to servers.',
    introText: 'Paste a JWT token to decode and inspect its header and payload. This tool decodes the token locally in your browser — your token is never sent to any server.',
    exampleInput: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    exampleOutput: '{\n  "header": {\n    "alg": "HS256",\n    "typ": "JWT"\n  },\n  "payload": {\n    "sub": "1234567890",\n    "name": "John Doe",\n    "iat": 1516239022\n  }\n}',
    faqItems: [
      { question: 'What is a JWT?', answer: 'A JSON Web Token (JWT) is a compact, URL-safe token format used for authentication and information exchange between parties.' },
      { question: 'Does this verify the signature?', answer: 'No. This tool only decodes the header and payload. Signature verification requires the secret key or public key.' },
      { question: 'Is it safe to paste my JWT here?', answer: 'Yes. All decoding happens in your browser. Your token is never transmitted to any server.' },
    ],
    relatedToolSlugs: ['base64-decoder', 'json-formatter', 'timestamp-converter'],
    type: 'standard',
    useCases: ['Inspecting authentication tokens', 'Debugging API auth issues', 'Checking token expiration claims'],
    featured: true,
  },
  {
    name: 'Markdown to HTML Converter',
    slug: 'markdown-to-html',
    category: 'Developer Tools',
    categorySlug: 'developer-tools',
    description: 'Convert Markdown text into clean HTML with live preview.',
    keywords: ['markdown', 'html', 'converter', 'preview', 'markup'],
    seoTitle: 'Markdown to HTML Converter Online — Free MD to HTML',
    metaDescription: 'Convert Markdown to HTML instantly with live preview. Free online Markdown converter — no signup required.',
    introText: 'Paste Markdown text and instantly see the HTML output. Supports headers, bold, italic, links, code blocks, and lists.',
    exampleInput: '# Hello World\n\nThis is **bold** and *italic* text.\n\n- Item 1\n- Item 2\n\n[Link](https://example.com)',
    exampleOutput: '<h1>Hello World</h1>\n<p>This is <strong>bold</strong> and <em>italic</em> text.</p>\n<ul><li>Item 1</li>\n<li>Item 2</li></ul>\n<p><a href="https://example.com">Link</a></p>',
    faqItems: [
      { question: 'What Markdown syntax is supported?', answer: 'Headers (h1-h3), bold, italic, links, inline code, and unordered lists are supported.' },
      { question: 'Can I preview the rendered HTML?', answer: 'The output shows the raw HTML code. You can copy it and paste it into any HTML document.' },
      { question: 'Does it support tables?', answer: 'Table support is planned for a future update. Currently, basic Markdown elements are supported.' },
    ],
    relatedToolSlugs: ['html-formatter', 'json-formatter', 'sql-formatter'],
    type: 'standard',
    useCases: ['Converting README files', 'Generating HTML from notes', 'Converting blog posts from Markdown'],
  },
  {
    name: 'HTML Formatter',
    slug: 'html-formatter',
    category: 'Developer Tools',
    categorySlug: 'developer-tools',
    description: 'Beautify and indent minified HTML code for readability.',
    keywords: ['html', 'formatter', 'beautify', 'indent', 'prettify'],
    seoTitle: 'HTML Formatter Online — Beautify HTML Code Free',
    metaDescription: 'Beautify and indent HTML code for better readability. Free online HTML formatter — no signup required.',
    introText: 'Paste minified or messy HTML code and get a beautifully formatted, properly indented output. Makes HTML easier to read and debug.',
    exampleInput: '<div><h1>Title</h1><p>Hello <strong>world</strong></p><ul><li>Item 1</li><li>Item 2</li></ul></div>',
    exampleOutput: '<div>\n  <h1>Title</h1>\n  <p>Hello <strong>world</strong></p>\n  <ul>\n    <li>Item 1</li>\n    <li>Item 2</li>\n  </ul>\n</div>',
    faqItems: [
      { question: 'Does this fix broken HTML?', answer: 'No. This tool formats valid HTML with proper indentation. It does not repair malformed markup.' },
      { question: 'What indentation is used?', answer: 'The formatter uses 2-space indentation for clean, readable output.' },
      { question: 'Can I format large HTML files?', answer: 'Yes, though very large files may take a moment to process in the browser.' },
    ],
    relatedToolSlugs: ['markdown-to-html', 'sql-formatter', 'json-formatter'],
    type: 'standard',
    useCases: ['Cleaning up minified HTML', 'Formatting email templates', 'Making HTML code review easier'],
  },
  {
    name: 'SQL Formatter',
    slug: 'sql-formatter',
    category: 'Developer Tools',
    categorySlug: 'developer-tools',
    description: 'Format and beautify SQL queries for better readability.',
    keywords: ['sql', 'formatter', 'beautify', 'query', 'database'],
    seoTitle: 'SQL Formatter Online — Beautify SQL Queries Free',
    metaDescription: 'Format and beautify SQL queries for better readability. Free online SQL formatter — no signup required.',
    introText: 'Paste messy SQL queries and get properly formatted output with keyword highlighting and indentation. Supports SELECT, INSERT, UPDATE, DELETE, and more.',
    exampleInput: 'SELECT u.name, u.email, o.total FROM users u INNER JOIN orders o ON u.id = o.user_id WHERE o.total > 100 ORDER BY o.total DESC LIMIT 10',
    exampleOutput: 'SELECT\n  u.name, u.email, o.total\nFROM\n  users u\nINNER JOIN\n  orders o\nON\n  u.id = o.user_id\nWHERE\n  o.total > 100\nORDER BY\n  o.total DESC\nLIMIT\n  10',
    faqItems: [
      { question: 'What SQL dialects are supported?', answer: 'The formatter supports standard SQL keywords used in MySQL, PostgreSQL, SQLite, and most other databases.' },
      { question: 'Does it validate SQL?', answer: 'No. This tool only formats the query for readability. It does not check for syntax errors.' },
      { question: 'Can I format stored procedures?', answer: 'Basic formatting is applied to all SQL text. Complex procedural SQL may need manual adjustments.' },
    ],
    relatedToolSlugs: ['json-formatter', 'html-formatter', 'csv-to-json'],
    type: 'standard',
    useCases: ['Formatting queries from logs', 'Cleaning up generated SQL', 'Making SQL code reviews easier'],
  },
  {
    name: 'Color Converter',
    slug: 'color-converter',
    category: 'Developer Tools',
    categorySlug: 'developer-tools',
    description: 'Convert colors between HEX, RGB, and HSL formats.',
    keywords: ['color', 'converter', 'hex', 'rgb', 'hsl', 'css'],
    seoTitle: 'Color Converter Online — HEX RGB HSL Converter Free',
    metaDescription: 'Convert colors between HEX, RGB, and HSL formats instantly. Free online color converter — no signup required.',
    introText: 'Enter a color in any format (HEX, RGB, or HSL) and instantly see it converted to all other formats. Includes a live color preview.',
    exampleInput: '#FF5733',
    exampleOutput: 'HEX: #FF5733\nRGB: rgb(255, 87, 51)\nHSL: hsl(11, 100%, 60%)',
    faqItems: [
      { question: 'What color formats are supported?', answer: 'HEX (#FF5733), RGB (rgb(255, 87, 51)), and HSL (hsl(11, 100%, 60%)) formats are supported.' },
      { question: 'Can I input short HEX codes?', answer: 'Yes. Both 3-digit (#F53) and 6-digit (#FF5533) HEX codes are supported.' },
      { question: 'What is HSL?', answer: 'HSL stands for Hue, Saturation, Lightness — a more intuitive way to describe colors compared to RGB.' },
    ],
    relatedToolSlugs: ['json-formatter', 'url-encoder', 'base64-encoder'],
    type: 'custom',
    useCases: ['Converting design tokens', 'Matching CSS colors across formats', 'Translating Figma colors to code'],
    featured: true,
  },
  // ===== TEXT TOOLS =====
  { name: 'Word Counter', slug: 'word-counter', category: 'Text Tools', categorySlug: 'text-tools', description: 'Count words, characters, sentences, and paragraphs in any text.', keywords: ['word count', 'character count', 'text counter'], seoTitle: 'Word Counter Online — Count Words & Characters Free', metaDescription: 'Count words, characters, sentences, and paragraphs instantly. Free online word counter.', introText: 'Paste any text and instantly see word count, character count, line count, and paragraph count.', exampleInput: 'The quick brown fox jumps over the lazy dog. This is a sample sentence for counting.', exampleOutput: 'Words: 16\nCharacters: 82\nCharacters (no spaces): 68\nLines: 1\nParagraphs: 1', faqItems: [{ question: 'How are words counted?', answer: 'Words are split on whitespace.' }, { question: 'Does it count punctuation?', answer: 'Punctuation is included in character counts but not word counts.' }], relatedToolSlugs: ['character-counter', 'sentence-counter', 'paragraph-counter'], type: 'standard', useCases: ['Checking essay word limits', 'Social media post length', 'Content requirements'], featured: true, popular: true },
  { name: 'Character Counter', slug: 'character-counter', category: 'Text Tools', categorySlug: 'text-tools', description: 'Count characters with and without spaces in any text.', keywords: ['character count', 'letter count', 'char counter'], seoTitle: 'Character Counter Online — Count Characters Free', metaDescription: 'Count characters with and without spaces instantly. Free online character counter.', introText: 'Get an accurate character count showing characters with spaces, without spaces, letters, and digits.', exampleInput: 'Hello World 123!', exampleOutput: 'Characters (with spaces): 16\nCharacters (no spaces): 14\nLetters: 10\nDigits: 3', faqItems: [{ question: 'Are spaces counted?', answer: 'Both counts are shown — with and without spaces.' }], relatedToolSlugs: ['word-counter', 'sentence-counter', 'remove-extra-spaces'], type: 'standard', useCases: ['Twitter/X limits', 'SMS length', 'Form input validation'] },
  { name: 'Sentence Counter', slug: 'sentence-counter', category: 'Text Tools', categorySlug: 'text-tools', description: 'Count sentences in any text.', keywords: ['sentence count', 'sentence counter'], seoTitle: 'Sentence Counter Online — Count Sentences Free', metaDescription: 'Count sentences in any text instantly. Free online sentence counter.', introText: 'Estimate sentence count using punctuation-based detection.', exampleInput: 'Hello world. How are you? I am fine! Four sentences.', exampleOutput: 'Sentences: 4', faqItems: [{ question: 'How are sentences detected?', answer: 'By splitting on periods, exclamation marks, and question marks.' }], relatedToolSlugs: ['word-counter', 'paragraph-counter', 'character-counter'], type: 'standard', useCases: ['Writing analysis', 'Content structure', 'Academic review'] },
  { name: 'Paragraph Counter', slug: 'paragraph-counter', category: 'Text Tools', categorySlug: 'text-tools', description: 'Count paragraphs in any text.', keywords: ['paragraph count', 'paragraph counter'], seoTitle: 'Paragraph Counter Online — Count Paragraphs Free', metaDescription: 'Count paragraphs in any text instantly. Free online paragraph counter.', introText: 'Count paragraphs based on blank-line separation.', exampleInput: 'First paragraph.\n\nSecond paragraph.\n\nThird.', exampleOutput: 'Paragraphs: 3', faqItems: [{ question: 'How are paragraphs detected?', answer: 'Separated by blank lines (double line breaks).' }], relatedToolSlugs: ['word-counter', 'sentence-counter', 'character-counter'], type: 'standard', useCases: ['Essay structure', 'Content formatting', 'Document analysis'] },
  { name: 'Case Converter', slug: 'case-converter', category: 'Text Tools', categorySlug: 'text-tools', description: 'Convert text to uppercase, lowercase, title case, or sentence case.', keywords: ['case converter', 'uppercase', 'lowercase', 'title case'], seoTitle: 'Case Converter Online — Change Text Case Free', metaDescription: 'Convert text between uppercase, lowercase, title case, and sentence case. Free online case converter.', introText: 'Transform text between different cases with one click. Supports uppercase, lowercase, title case, sentence case, and toggle case.', exampleInput: 'the quick brown fox jumps over the lazy dog', exampleOutput: 'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG', faqItems: [{ question: 'What is title case?', answer: 'Capitalizes the first letter of every word.' }, { question: 'What is toggle case?', answer: 'Inverts the case of each character.' }], relatedToolSlugs: ['word-counter', 'slug-generator', 'remove-extra-spaces'], type: 'custom', useCases: ['Formatting headings', 'Normalizing text', 'Variable name conversion'], featured: true, popular: true },
  { name: 'Remove Extra Spaces', slug: 'remove-extra-spaces', category: 'Text Tools', categorySlug: 'text-tools', description: 'Collapse multiple spaces into single spaces and trim text.', keywords: ['remove spaces', 'trim', 'clean text'], seoTitle: 'Remove Extra Spaces Online — Clean Text Free', metaDescription: 'Remove extra spaces and trim text instantly. Free online space remover.', introText: 'Clean up text by collapsing repeated spaces and trimming whitespace.', exampleInput: 'Hello    world.   Extra   spaces.', exampleOutput: 'Hello world. Extra spaces.', faqItems: [{ question: 'Does it remove all spaces?', answer: 'Only extra spaces. Single spaces are preserved.' }], relatedToolSlugs: ['remove-line-breaks', 'case-converter', 'word-counter'], type: 'standard', useCases: ['Cleaning pasted text', 'Fixing formatting', 'Data preparation'] },
  { name: 'Remove Line Breaks', slug: 'remove-line-breaks', category: 'Text Tools', categorySlug: 'text-tools', description: 'Replace line breaks with spaces to create single-line text.', keywords: ['remove line breaks', 'join lines', 'single line'], seoTitle: 'Remove Line Breaks Online — Join Lines Free', metaDescription: 'Remove line breaks and join text into a single line. Free online tool.', introText: 'Replace all line breaks with spaces to convert multi-line text into a single line.', exampleInput: 'Line one\nLine two\nLine three', exampleOutput: 'Line one Line two Line three', faqItems: [{ question: 'Does it preserve spacing?', answer: 'Each line break becomes a single space.' }], relatedToolSlugs: ['remove-extra-spaces', 'text-sorter', 'word-counter'], type: 'standard', useCases: ['Cleaning PDF text', 'Fixing email formatting', 'Spreadsheet prep'] },
  { name: 'Text Sorter', slug: 'text-sorter', category: 'Text Tools', categorySlug: 'text-tools', description: 'Sort lines of text alphabetically ascending or descending.', keywords: ['sort text', 'sort lines', 'alphabetical sort'], seoTitle: 'Text Sorter Online — Sort Lines Alphabetically Free', metaDescription: 'Sort lines of text alphabetically. Free online text sorter.', introText: 'Sort lines alphabetically with ascending/descending order and optional case-insensitive sorting.', exampleInput: 'Banana\nApple\nCherry\nDate\nElderberry', exampleOutput: 'Apple\nBanana\nCherry\nDate\nElderberry', faqItems: [{ question: 'Is sorting case-sensitive?', answer: 'Case sensitivity can be toggled. Default is case-insensitive.' }], relatedToolSlugs: ['duplicate-line-remover', 'reverse-text', 'word-counter'], type: 'custom', useCases: ['Sorting name lists', 'Organizing data', 'Cleaning CSV rows'] },
  { name: 'Duplicate Line Remover', slug: 'duplicate-line-remover', category: 'Text Tools', categorySlug: 'text-tools', description: 'Remove duplicate lines while preserving original order.', keywords: ['remove duplicates', 'unique lines', 'deduplicate'], seoTitle: 'Duplicate Line Remover Online — Remove Duplicates Free', metaDescription: 'Remove duplicate lines while preserving order. Free online duplicate remover.', introText: 'Remove duplicate lines from any text. First occurrence is kept.', exampleInput: 'Apple\nBanana\nApple\nCherry\nBanana\nDate', exampleOutput: 'Apple\nBanana\nCherry\nDate', faqItems: [{ question: 'Which duplicate is kept?', answer: 'The first occurrence. All subsequent duplicates are removed.' }], relatedToolSlugs: ['text-sorter', 'remove-extra-spaces', 'word-counter'], type: 'standard', useCases: ['Cleaning email lists', 'Removing duplicate data', 'Unique list prep'] },
  { name: 'Reverse Text', slug: 'reverse-text', category: 'Text Tools', categorySlug: 'text-tools', description: 'Reverse text by characters or by word order.', keywords: ['reverse text', 'flip text', 'backwards'], seoTitle: 'Reverse Text Online — Flip Text Backwards Free', metaDescription: 'Reverse text by characters or word order. Free online text reverser.', introText: 'Reverse any text character by character or by word order.', exampleInput: 'Hello World', exampleOutput: 'Reversed characters:\ndlroW olleH\n\nReversed words:\nWorld Hello', faqItems: [{ question: 'What modes are available?', answer: 'Both character reversal and word order reversal are shown.' }], relatedToolSlugs: ['case-converter', 'text-sorter', 'slug-generator'], type: 'custom', useCases: ['Backwards text for fun', 'String manipulation testing', 'Puzzles'] },
  { name: 'Slug Generator', slug: 'slug-generator', category: 'Text Tools', categorySlug: 'text-tools', description: 'Convert text into a clean URL-friendly slug.', keywords: ['slug', 'url slug', 'permalink', 'slug generator'], seoTitle: 'Slug Generator Online — Create URL Slugs Free', metaDescription: 'Convert any text into a URL-friendly slug. Free online slug generator.', introText: 'Convert text into a URL-safe slug. Lowercases, replaces spaces with hyphens, removes special characters.', exampleInput: 'How to Build a REST API with Node.js — A Complete Guide!', exampleOutput: 'how-to-build-a-rest-api-with-nodejs-a-complete-guide', faqItems: [{ question: 'What characters are removed?', answer: 'Special characters and punctuation. Accented characters are normalized.' }], relatedToolSlugs: ['case-converter', 'url-encoder', 'remove-extra-spaces'], type: 'standard', useCases: ['Blog post URLs', 'SEO permalinks', 'Clean API endpoints'], popular: true },
  { name: 'Lorem Ipsum Generator', slug: 'lorem-ipsum-generator', category: 'Text Tools', categorySlug: 'text-tools', description: 'Generate lorem ipsum placeholder text by paragraph count.', keywords: ['lorem ipsum', 'placeholder text', 'dummy text'], seoTitle: 'Lorem Ipsum Generator Online — Generate Dummy Text Free', metaDescription: 'Generate lorem ipsum placeholder text. Free online generator.', introText: 'Generate classic lorem ipsum placeholder text for designs and mockups.', exampleInput: 'Count: 2', exampleOutput: 'Lorem ipsum dolor sit amet...\n\nDuis aute irure dolor...', faqItems: [{ question: 'What is lorem ipsum?', answer: 'Placeholder text used in design and publishing.' }], relatedToolSlugs: ['word-counter', 'paragraph-counter', 'random-password-generator'], type: 'custom', useCases: ['Design mockups', 'Testing layouts', 'Prototyping'], featured: true },
  { name: 'Random Password Generator', slug: 'random-password-generator', category: 'Text Tools', categorySlug: 'text-tools', description: 'Generate secure random passwords with configurable options.', keywords: ['password generator', 'random password', 'secure password'], seoTitle: 'Random Password Generator Online — Secure Passwords Free', metaDescription: 'Generate secure random passwords. Free online password generator.', introText: 'Generate cryptographically secure random passwords with configurable length and character types.', exampleInput: 'Length: 16', exampleOutput: 'aB3$xK9!mZ2&pQ7@', faqItems: [{ question: 'Are passwords truly random?', answer: 'Yes — using the Web Crypto API.' }, { question: 'Recommended length?', answer: 'At least 12-16 characters with mixed types.' }], relatedToolSlugs: ['random-username-generator', 'uuid-generator', 'lorem-ipsum-generator'], type: 'custom', useCases: ['Account passwords', 'API keys', 'Test credentials'], popular: true },
  { name: 'Random Username Generator', slug: 'random-username-generator', category: 'Text Tools', categorySlug: 'text-tools', description: 'Generate random usernames from adjective-noun combinations.', keywords: ['username generator', 'random username', 'name generator'], seoTitle: 'Random Username Generator Online — Create Usernames Free', metaDescription: 'Generate random usernames. Free online username generator.', introText: 'Generate unique random usernames by combining adjectives, nouns, and numbers.', exampleInput: 'Count: 5', exampleOutput: 'SwiftHawk423\nBrightWolf891\nCoolStorm156', faqItems: [{ question: 'How are usernames generated?', answer: 'Random adjective + noun + number (0-999).' }], relatedToolSlugs: ['random-password-generator', 'uuid-generator', 'lorem-ipsum-generator'], type: 'custom', useCases: ['Social media handles', 'Test accounts', 'Brainstorming names'] },
  { name: 'Text to List Converter', slug: 'text-to-list', category: 'Text Tools', categorySlug: 'text-tools', description: 'Convert comma-separated or line-separated text into formatted lists.', keywords: ['text to list', 'comma to list', 'bullet list', 'numbered list'], seoTitle: 'Text to List Converter Online — Create Lists Free', metaDescription: 'Convert text into bullet or numbered lists. Free online list converter.', introText: 'Convert comma-separated values or line-separated text into clean bullet or numbered lists.', exampleInput: 'Apples, Bananas, Cherries, Dates, Elderberries', exampleOutput: '• Apples\n• Bananas\n• Cherries\n• Dates\n• Elderberries', faqItems: [{ question: 'What separators are supported?', answer: 'Commas and line breaks.' }], relatedToolSlugs: ['word-counter', 'text-sorter', 'duplicate-line-remover'], type: 'custom', useCases: ['Formatting spreadsheet data', 'Creating clean lists', 'Documentation'] },
];

export function getToolBySlug(slug: string): ToolConfig | undefined {
  return tools.find(t => t.slug === slug);
}

export function getToolsByCategory(categorySlug: string): ToolConfig[] {
  return tools.filter(t => t.categorySlug === categorySlug);
}

export function getCategoryBySlug(slug: string): CategoryConfig | undefined {
  return categories.find(c => c.slug === slug);
}

export function searchTools(query: string): ToolConfig[] {
  const q = query.toLowerCase();
  return tools.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.keywords.some(k => k.toLowerCase().includes(q)) ||
    t.category.toLowerCase().includes(q)
  );
}

export function getFeaturedTools(): ToolConfig[] {
  return tools.filter(t => t.featured);
}

export function getPopularTools(): ToolConfig[] {
  return tools.filter(t => t.popular);
}
