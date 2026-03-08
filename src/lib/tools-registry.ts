export interface FaqItem {
  question: string;
  answer: string;
}

export type UseCaseTag = 'formatting' | 'conversion' | 'encoding' | 'decoding' | 'generators' | 'text-cleanup' | 'image-editing' | 'compression' | 'debugging' | 'productivity' | 'counting';

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
  recentlyAdded?: boolean;
  useCaseTags?: UseCaseTag[];
}

export interface CategoryConfig {
  name: string;
  slug: string;
  description: string;
  introText: string;
  comingSoon?: boolean;
  whoIsItFor?: string;
  commonUseCases?: string[];
  faqItems?: FaqItem[];
  relatedCategorySlugs?: string[];
}

export const useCaseLabels: Record<UseCaseTag, string> = {
  formatting: 'Formatting',
  conversion: 'Conversion',
  encoding: 'Encoding',
  decoding: 'Decoding',
  generators: 'Generators',
  'text-cleanup': 'Text Cleanup',
  'image-editing': 'Image Editing',
  compression: 'Compression',
  debugging: 'Debugging',
  productivity: 'Productivity',
  counting: 'Counting',
};

export const categories: CategoryConfig[] = [
  {
    name: 'Developer Tools',
    slug: 'developer-tools',
    description: 'Essential tools for software developers and engineers.',
    introText: 'A collection of free browser-based developer tools to help you format, encode, decode, convert, and validate data. All tools run entirely in your browser — no data is sent to any server.',
    whoIsItFor: 'Software developers, web developers, DevOps engineers, QA testers, and anyone working with APIs, data formats, or code.',
    commonUseCases: ['Formatting JSON, HTML, and SQL for readability', 'Encoding and decoding Base64 and URL data', 'Converting between data formats like CSV and JSON', 'Debugging JWT tokens and regex patterns', 'Generating UUIDs and converting timestamps'],
    faqItems: [
      { question: 'Are these developer tools really free?', answer: 'Yes. Every tool on GadgetSurge is completely free with no signup, no account, and no hidden fees.' },
      { question: 'Is my data safe when using these tools?', answer: 'Absolutely. All processing happens locally in your browser. No data is ever uploaded to a server.' },
      { question: 'Do I need to install anything?', answer: 'No. All tools run directly in your browser. Just open the page and start using them.' },
    ],
    relatedCategorySlugs: ['text-tools', 'image-tools'],
  },
  {
    name: 'Image Tools',
    slug: 'image-tools',
    description: 'Tools for image conversion, resizing, and optimization.',
    introText: 'A collection of free browser-based image tools. Resize, crop, convert, compress, and inspect images — all processing happens entirely in your browser for complete privacy. Your images never leave your device.',
    whoIsItFor: 'Designers, content creators, social media managers, web developers, bloggers, and anyone who works with images regularly.',
    commonUseCases: ['Resizing images for social media or web uploads', 'Converting between PNG, JPG, and WebP formats', 'Compressing images to reduce file size', 'Picking colors from images for design work', 'Generating favicons for websites'],
    faqItems: [
      { question: 'Are my images uploaded to a server?', answer: 'No. All image processing happens in your browser using the Canvas API. Your files never leave your device.' },
      { question: 'What image formats are supported?', answer: 'PNG, JPG, JPEG, WebP, GIF, and any format your browser can display.' },
      { question: 'Is there a file size limit?', answer: 'There is no hard limit, but very large images may process slowly depending on your device.' },
    ],
    relatedCategorySlugs: ['developer-tools', 'text-tools'],
  },
  {
    name: 'Text Tools',
    slug: 'text-tools',
    description: 'Tools for text manipulation, formatting, counting, and generation.',
    introText: 'A collection of free browser-based text utilities. Count words, convert case, generate passwords, clean up text, and more — all running entirely in your browser with no data sent to any server.',
    whoIsItFor: 'Writers, editors, students, content creators, SEO professionals, and developers working with text data.',
    commonUseCases: ['Counting words and characters for content limits', 'Converting text between different cases', 'Generating secure passwords and usernames', 'Cleaning up text by removing extra spaces or duplicates', 'Creating URL-friendly slugs from titles'],
    faqItems: [
      { question: 'Can I use these tools for long documents?', answer: 'Yes. All text tools handle large inputs well. Processing happens instantly in your browser.' },
      { question: 'Do text tools support Unicode?', answer: 'Yes. Most tools handle Unicode characters, emojis, and special characters correctly.' },
    ],
    relatedCategorySlugs: ['developer-tools', 'image-tools'],
  },
  {
    name: 'Document Tools',
    slug: 'document-tools',
    description: 'Tools for document conversion and processing.',
    introText: 'Document tools for converting, formatting, and processing documents are coming soon. In the meantime, check out our developer tools for data format conversion, or our text tools for content manipulation.',
    comingSoon: true,
    relatedCategorySlugs: ['developer-tools', 'text-tools'],
  },
  {
    name: 'Calculators',
    slug: 'calculators',
    description: 'Useful online calculators for everyday tasks.',
    introText: 'Online calculators for everyday math, finance, and productivity are coming soon. While you wait, explore our existing tools for text counting, data conversion, and image processing.',
    comingSoon: true,
    relatedCategorySlugs: ['text-tools', 'developer-tools'],
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
    useCaseTags: ['formatting', 'debugging'],
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
    useCaseTags: ['encoding'],
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
    useCaseTags: ['decoding'],
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
    useCaseTags: ['debugging', 'productivity'],
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
    useCaseTags: ['generators'],
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
    useCaseTags: ['conversion', 'debugging'],
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
    useCaseTags: ['conversion'],
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
    useCaseTags: ['conversion'],
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
    useCaseTags: ['encoding'],
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
    useCaseTags: ['decoding'],
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
    useCaseTags: ['decoding', 'debugging'],
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
    useCaseTags: ['conversion', 'formatting'],
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
    useCaseTags: ['formatting'],
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
    useCaseTags: ['formatting'],
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
    relatedToolSlugs: ['image-color-picker', 'json-formatter', 'url-encoder'],
    type: 'custom',
    useCases: ['Converting design tokens', 'Matching CSS colors across formats', 'Translating Figma colors to code'],
    featured: true,
    useCaseTags: ['conversion'],
  },
  // ===== TEXT TOOLS =====
  { name: 'Word Counter', slug: 'word-counter', category: 'Text Tools', categorySlug: 'text-tools', description: 'Count words, characters, sentences, and paragraphs in any text.', keywords: ['word count', 'character count', 'text counter'], seoTitle: 'Word Counter Online — Count Words & Characters Free', metaDescription: 'Count words, characters, sentences, and paragraphs instantly. Free online word counter.', introText: 'Paste any text and instantly see word count, character count, line count, and paragraph count. Perfect for checking essay word limits, social media character limits, and content requirements.', exampleInput: 'The quick brown fox jumps over the lazy dog. This is a sample sentence for counting.', exampleOutput: 'Words: 16\nCharacters: 82\nCharacters (no spaces): 68\nLines: 1\nParagraphs: 1', faqItems: [{ question: 'How are words counted?', answer: 'Words are split on whitespace.' }, { question: 'Does it count punctuation?', answer: 'Punctuation is included in character counts but not word counts.' }], relatedToolSlugs: ['character-counter', 'sentence-counter', 'paragraph-counter'], type: 'standard', useCases: ['Checking essay word limits', 'Social media post length', 'Content requirements'], featured: true, popular: true, useCaseTags: ['counting', 'productivity'] },
  { name: 'Character Counter', slug: 'character-counter', category: 'Text Tools', categorySlug: 'text-tools', description: 'Count characters with and without spaces in any text.', keywords: ['character count', 'letter count', 'char counter'], seoTitle: 'Character Counter Online — Count Characters Free', metaDescription: 'Count characters with and without spaces instantly. Free online character counter.', introText: 'Get an accurate character count showing characters with spaces, without spaces, letters, and digits. Essential for Twitter/X posts, SMS messages, and form validation.', exampleInput: 'Hello World 123!', exampleOutput: 'Characters (with spaces): 16\nCharacters (no spaces): 14\nLetters: 10\nDigits: 3', faqItems: [{ question: 'Are spaces counted?', answer: 'Both counts are shown — with and without spaces.' }], relatedToolSlugs: ['word-counter', 'sentence-counter', 'remove-extra-spaces'], type: 'standard', useCases: ['Twitter/X limits', 'SMS length', 'Form input validation'], useCaseTags: ['counting', 'productivity'] },
  { name: 'Sentence Counter', slug: 'sentence-counter', category: 'Text Tools', categorySlug: 'text-tools', description: 'Count sentences in any text.', keywords: ['sentence count', 'sentence counter'], seoTitle: 'Sentence Counter Online — Count Sentences Free', metaDescription: 'Count sentences in any text instantly. Free online sentence counter.', introText: 'Estimate sentence count using punctuation-based detection. Useful for writing analysis, content structure review, and academic work.', exampleInput: 'Hello world. How are you? I am fine! Four sentences.', exampleOutput: 'Sentences: 4', faqItems: [{ question: 'How are sentences detected?', answer: 'By splitting on periods, exclamation marks, and question marks.' }], relatedToolSlugs: ['word-counter', 'paragraph-counter', 'character-counter'], type: 'standard', useCases: ['Writing analysis', 'Content structure', 'Academic review'], useCaseTags: ['counting'] },
  { name: 'Paragraph Counter', slug: 'paragraph-counter', category: 'Text Tools', categorySlug: 'text-tools', description: 'Count paragraphs in any text.', keywords: ['paragraph count', 'paragraph counter'], seoTitle: 'Paragraph Counter Online — Count Paragraphs Free', metaDescription: 'Count paragraphs in any text instantly. Free online paragraph counter.', introText: 'Count paragraphs based on blank-line separation. Useful for checking essay structure and document formatting.', exampleInput: 'First paragraph.\n\nSecond paragraph.\n\nThird.', exampleOutput: 'Paragraphs: 3', faqItems: [{ question: 'How are paragraphs detected?', answer: 'Separated by blank lines (double line breaks).' }], relatedToolSlugs: ['word-counter', 'sentence-counter', 'character-counter'], type: 'standard', useCases: ['Essay structure', 'Content formatting', 'Document analysis'], useCaseTags: ['counting'] },
  { name: 'Case Converter', slug: 'case-converter', category: 'Text Tools', categorySlug: 'text-tools', description: 'Convert text to uppercase, lowercase, title case, or sentence case.', keywords: ['case converter', 'uppercase', 'lowercase', 'title case'], seoTitle: 'Case Converter Online — Change Text Case Free', metaDescription: 'Convert text between uppercase, lowercase, title case, and sentence case. Free online case converter.', introText: 'Transform text between different cases with one click. Supports uppercase, lowercase, title case, sentence case, and toggle case. Essential for formatting headings, normalizing data, and converting variable names.', exampleInput: 'the quick brown fox jumps over the lazy dog', exampleOutput: 'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG', faqItems: [{ question: 'What is title case?', answer: 'Capitalizes the first letter of every word.' }, { question: 'What is toggle case?', answer: 'Inverts the case of each character.' }], relatedToolSlugs: ['word-counter', 'slug-generator', 'remove-extra-spaces'], type: 'custom', useCases: ['Formatting headings', 'Normalizing text', 'Variable name conversion'], featured: true, popular: true, useCaseTags: ['conversion', 'text-cleanup'] },
  { name: 'Remove Extra Spaces', slug: 'remove-extra-spaces', category: 'Text Tools', categorySlug: 'text-tools', description: 'Collapse multiple spaces into single spaces and trim text.', keywords: ['remove spaces', 'trim', 'clean text'], seoTitle: 'Remove Extra Spaces Online — Clean Text Free', metaDescription: 'Remove extra spaces and trim text instantly. Free online space remover.', introText: 'Clean up text by collapsing repeated spaces and trimming whitespace. Great for cleaning pasted text, fixing formatting issues, and preparing data.', exampleInput: 'Hello    world.   Extra   spaces.', exampleOutput: 'Hello world. Extra spaces.', faqItems: [{ question: 'Does it remove all spaces?', answer: 'Only extra spaces. Single spaces are preserved.' }], relatedToolSlugs: ['remove-line-breaks', 'case-converter', 'word-counter'], type: 'standard', useCases: ['Cleaning pasted text', 'Fixing formatting', 'Data preparation'], useCaseTags: ['text-cleanup'] },
  { name: 'Remove Line Breaks', slug: 'remove-line-breaks', category: 'Text Tools', categorySlug: 'text-tools', description: 'Replace line breaks with spaces to create single-line text.', keywords: ['remove line breaks', 'join lines', 'single line'], seoTitle: 'Remove Line Breaks Online — Join Lines Free', metaDescription: 'Remove line breaks and join text into a single line. Free online tool.', introText: 'Replace all line breaks with spaces to convert multi-line text into a single line. Useful for cleaning PDF text, fixing email formatting, and preparing data for spreadsheets.', exampleInput: 'Line one\nLine two\nLine three', exampleOutput: 'Line one Line two Line three', faqItems: [{ question: 'Does it preserve spacing?', answer: 'Each line break becomes a single space.' }], relatedToolSlugs: ['remove-extra-spaces', 'text-sorter', 'word-counter'], type: 'standard', useCases: ['Cleaning PDF text', 'Fixing email formatting', 'Spreadsheet prep'], useCaseTags: ['text-cleanup'] },
  { name: 'Text Sorter', slug: 'text-sorter', category: 'Text Tools', categorySlug: 'text-tools', description: 'Sort lines of text alphabetically ascending or descending.', keywords: ['sort text', 'sort lines', 'alphabetical sort'], seoTitle: 'Text Sorter Online — Sort Lines Alphabetically Free', metaDescription: 'Sort lines of text alphabetically. Free online text sorter.', introText: 'Sort lines alphabetically with ascending/descending order and optional case-insensitive sorting. Ideal for organizing name lists, data, and CSV rows.', exampleInput: 'Banana\nApple\nCherry\nDate\nElderberry', exampleOutput: 'Apple\nBanana\nCherry\nDate\nElderberry', faqItems: [{ question: 'Is sorting case-sensitive?', answer: 'Case sensitivity can be toggled. Default is case-insensitive.' }], relatedToolSlugs: ['duplicate-line-remover', 'reverse-text', 'word-counter'], type: 'custom', useCases: ['Sorting name lists', 'Organizing data', 'Cleaning CSV rows'], useCaseTags: ['text-cleanup', 'productivity'] },
  { name: 'Duplicate Line Remover', slug: 'duplicate-line-remover', category: 'Text Tools', categorySlug: 'text-tools', description: 'Remove duplicate lines while preserving original order.', keywords: ['remove duplicates', 'unique lines', 'deduplicate'], seoTitle: 'Duplicate Line Remover Online — Remove Duplicates Free', metaDescription: 'Remove duplicate lines while preserving order. Free online duplicate remover.', introText: 'Remove duplicate lines from any text. First occurrence is kept, all subsequent duplicates are removed. Perfect for cleaning email lists, data deduplication, and preparing unique lists.', exampleInput: 'Apple\nBanana\nApple\nCherry\nBanana\nDate', exampleOutput: 'Apple\nBanana\nCherry\nDate', faqItems: [{ question: 'Which duplicate is kept?', answer: 'The first occurrence. All subsequent duplicates are removed.' }], relatedToolSlugs: ['text-sorter', 'remove-extra-spaces', 'word-counter'], type: 'standard', useCases: ['Cleaning email lists', 'Removing duplicate data', 'Unique list prep'], useCaseTags: ['text-cleanup'] },
  { name: 'Reverse Text', slug: 'reverse-text', category: 'Text Tools', categorySlug: 'text-tools', description: 'Reverse text by characters or by word order.', keywords: ['reverse text', 'flip text', 'backwards'], seoTitle: 'Reverse Text Online — Flip Text Backwards Free', metaDescription: 'Reverse text by characters or word order. Free online text reverser.', introText: 'Reverse any text character by character or by word order. Useful for string manipulation testing, puzzles, and creative writing.', exampleInput: 'Hello World', exampleOutput: 'Reversed characters:\ndlroW olleH\n\nReversed words:\nWorld Hello', faqItems: [{ question: 'What modes are available?', answer: 'Both character reversal and word order reversal are shown.' }], relatedToolSlugs: ['case-converter', 'text-sorter', 'slug-generator'], type: 'custom', useCases: ['Backwards text for fun', 'String manipulation testing', 'Puzzles'], useCaseTags: ['productivity'] },
  { name: 'Slug Generator', slug: 'slug-generator', category: 'Text Tools', categorySlug: 'text-tools', description: 'Convert text into a clean URL-friendly slug.', keywords: ['slug', 'url slug', 'permalink', 'slug generator'], seoTitle: 'Slug Generator Online — Create URL Slugs Free', metaDescription: 'Convert any text into a URL-friendly slug. Free online slug generator.', introText: 'Convert text into a URL-safe slug. Lowercases, replaces spaces with hyphens, removes special characters. Essential for blog post URLs, SEO permalinks, and clean API endpoints.', exampleInput: 'How to Build a REST API with Node.js — A Complete Guide!', exampleOutput: 'how-to-build-a-rest-api-with-nodejs-a-complete-guide', faqItems: [{ question: 'What characters are removed?', answer: 'Special characters and punctuation. Accented characters are normalized.' }], relatedToolSlugs: ['case-converter', 'url-encoder', 'remove-extra-spaces'], type: 'standard', useCases: ['Blog post URLs', 'SEO permalinks', 'Clean API endpoints'], popular: true, useCaseTags: ['conversion', 'productivity'] },
  { name: 'Lorem Ipsum Generator', slug: 'lorem-ipsum-generator', category: 'Text Tools', categorySlug: 'text-tools', description: 'Generate lorem ipsum placeholder text by paragraph count.', keywords: ['lorem ipsum', 'placeholder text', 'dummy text'], seoTitle: 'Lorem Ipsum Generator Online — Generate Dummy Text Free', metaDescription: 'Generate lorem ipsum placeholder text. Free online generator.', introText: 'Generate classic lorem ipsum placeholder text for designs, mockups, and prototyping. Control the number of paragraphs to match your layout needs.', exampleInput: 'Count: 2', exampleOutput: 'Lorem ipsum dolor sit amet...\n\nDuis aute irure dolor...', faqItems: [{ question: 'What is lorem ipsum?', answer: 'Placeholder text used in design and publishing.' }], relatedToolSlugs: ['word-counter', 'paragraph-counter', 'random-password-generator'], type: 'custom', useCases: ['Design mockups', 'Testing layouts', 'Prototyping'], featured: true, useCaseTags: ['generators'] },
  { name: 'Random Password Generator', slug: 'random-password-generator', category: 'Text Tools', categorySlug: 'text-tools', description: 'Generate secure random passwords with configurable options.', keywords: ['password generator', 'random password', 'secure password'], seoTitle: 'Random Password Generator Online — Secure Passwords Free', metaDescription: 'Generate secure random passwords. Free online password generator.', introText: 'Generate cryptographically secure random passwords with configurable length and character types. Uses the Web Crypto API for true randomness.', exampleInput: 'Length: 16', exampleOutput: 'aB3$xK9!mZ2&pQ7@', faqItems: [{ question: 'Are passwords truly random?', answer: 'Yes — using the Web Crypto API.' }, { question: 'Recommended length?', answer: 'At least 12-16 characters with mixed types.' }], relatedToolSlugs: ['random-username-generator', 'uuid-generator', 'lorem-ipsum-generator'], type: 'custom', useCases: ['Account passwords', 'API keys', 'Test credentials'], popular: true, useCaseTags: ['generators'] },
  { name: 'Random Username Generator', slug: 'random-username-generator', category: 'Text Tools', categorySlug: 'text-tools', description: 'Generate random usernames from adjective-noun combinations.', keywords: ['username generator', 'random username', 'name generator'], seoTitle: 'Random Username Generator Online — Create Usernames Free', metaDescription: 'Generate random usernames. Free online username generator.', introText: 'Generate unique random usernames by combining adjectives, nouns, and numbers. Great for social media handles, test accounts, and brainstorming.', exampleInput: 'Count: 5', exampleOutput: 'SwiftHawk423\nBrightWolf891\nCoolStorm156', faqItems: [{ question: 'How are usernames generated?', answer: 'Random adjective + noun + number (0-999).' }], relatedToolSlugs: ['random-password-generator', 'uuid-generator', 'lorem-ipsum-generator'], type: 'custom', useCases: ['Social media handles', 'Test accounts', 'Brainstorming names'], useCaseTags: ['generators'] },
  { name: 'Text to List Converter', slug: 'text-to-list', category: 'Text Tools', categorySlug: 'text-tools', description: 'Convert comma-separated or line-separated text into formatted lists.', keywords: ['text to list', 'comma to list', 'bullet list', 'numbered list'], seoTitle: 'Text to List Converter Online — Create Lists Free', metaDescription: 'Convert text into bullet or numbered lists. Free online list converter.', introText: 'Convert comma-separated values or line-separated text into clean bullet or numbered lists. Useful for formatting spreadsheet data, creating documentation, and quick list generation.', exampleInput: 'Apples, Bananas, Cherries, Dates, Elderberries', exampleOutput: '• Apples\n• Bananas\n• Cherries\n• Dates\n• Elderberries', faqItems: [{ question: 'What separators are supported?', answer: 'Commas and line breaks.' }], relatedToolSlugs: ['word-counter', 'text-sorter', 'duplicate-line-remover'], type: 'custom', useCases: ['Formatting spreadsheet data', 'Creating clean lists', 'Documentation'], useCaseTags: ['conversion', 'formatting'] },
  // ===== IMAGE TOOLS =====
  { name: 'Image Resizer', slug: 'image-resizer', category: 'Image Tools', categorySlug: 'image-tools', description: 'Resize images to custom dimensions with aspect ratio lock.', keywords: ['image resizer', 'resize image', 'scale image', 'dimensions'], seoTitle: 'Image Resizer Online — Resize Images Free', metaDescription: 'Resize images to any dimension with aspect ratio lock. Free online image resizer — 100% client-side.', introText: 'Upload an image, set your target width and height, and download the resized result. Optionally lock the aspect ratio to prevent distortion. All processing happens in your browser — your images never leave your device.', exampleInput: 'Upload an image file', exampleOutput: 'Resized image at your chosen dimensions', faqItems: [{ question: 'Is my image uploaded to a server?', answer: 'No. All processing happens in your browser. Your images never leave your device.' }, { question: 'What formats are supported?', answer: 'PNG, JPG, JPEG, WebP, GIF, and any browser-supported image format.' }, { question: 'Can I preserve the aspect ratio?', answer: 'Yes. Toggle the aspect ratio lock to keep proportions when changing width or height.' }], relatedToolSlugs: ['image-cropper', 'image-compressor', 'image-to-png'], type: 'custom', useCases: ['Social media image sizing', 'Thumbnail creation', 'Web optimization'], featured: true, popular: true, recentlyAdded: true, useCaseTags: ['image-editing'] },
  { name: 'Image Cropper', slug: 'image-cropper', category: 'Image Tools', categorySlug: 'image-tools', description: 'Crop images using numeric coordinates for precise control.', keywords: ['image cropper', 'crop image', 'trim image'], seoTitle: 'Image Cropper Online — Crop Images Free', metaDescription: 'Crop images with precise numeric controls. Free online image cropper — runs in your browser.', introText: 'Upload an image and set X, Y, width, and height values to crop a precise region. Download the cropped result instantly. No server upload required.', exampleInput: 'Upload an image file', exampleOutput: 'Cropped region of your image', faqItems: [{ question: 'How do I set the crop area?', answer: 'Enter pixel values for X, Y, Width, and Height to define the crop rectangle.' }, { question: 'Is the original image modified?', answer: 'No. The original stays untouched. You download a new cropped copy.' }], relatedToolSlugs: ['image-resizer', 'image-rotator', 'image-flipper'], type: 'custom', useCases: ['Profile picture cropping', 'Removing unwanted areas', 'Creating thumbnails'], recentlyAdded: true, useCaseTags: ['image-editing'] },
  { name: 'Image Rotator', slug: 'image-rotator', category: 'Image Tools', categorySlug: 'image-tools', description: 'Rotate images by 90, 180, or 270 degrees.', keywords: ['rotate image', 'image rotator', 'turn image'], seoTitle: 'Image Rotator Online — Rotate Images Free', metaDescription: 'Rotate images by 90, 180, or 270 degrees. Free online image rotator.', introText: 'Upload an image and rotate it by 90°, 180°, or 270° with one click. Preview and download the result.', exampleInput: 'Upload an image file', exampleOutput: 'Rotated image', faqItems: [{ question: 'What rotation angles are supported?', answer: '90°, 180°, and 270° clockwise rotations.' }], relatedToolSlugs: ['image-flipper', 'image-resizer', 'image-cropper'], type: 'custom', useCases: ['Fixing photo orientation', 'Rotating screenshots', 'Adjusting scanned documents'], recentlyAdded: true, useCaseTags: ['image-editing'] },
  { name: 'Image Flipper', slug: 'image-flipper', category: 'Image Tools', categorySlug: 'image-tools', description: 'Flip images horizontally or vertically.', keywords: ['flip image', 'mirror image', 'image flipper'], seoTitle: 'Image Flipper Online — Mirror Images Free', metaDescription: 'Flip images horizontally or vertically. Free online image flipper.', introText: 'Upload an image and flip it horizontally (mirror) or vertically. Preview and download the result instantly.', exampleInput: 'Upload an image file', exampleOutput: 'Flipped image', faqItems: [{ question: 'What is the difference between horizontal and vertical flip?', answer: 'Horizontal flip mirrors left-to-right. Vertical flip mirrors top-to-bottom.' }], relatedToolSlugs: ['image-rotator', 'image-resizer', 'image-cropper'], type: 'custom', useCases: ['Creating mirror selfies', 'Fixing mirrored text', 'Design compositions'], recentlyAdded: true, useCaseTags: ['image-editing'] },
  { name: 'Image to PNG Converter', slug: 'image-to-png', category: 'Image Tools', categorySlug: 'image-tools', description: 'Convert any image to PNG format.', keywords: ['image to png', 'convert to png', 'png converter'], seoTitle: 'Image to PNG Converter Online — Convert to PNG Free', metaDescription: 'Convert any image to PNG format instantly. Free online PNG converter.', introText: 'Upload any image and convert it to PNG format. Supports JPG, WebP, GIF, and more. PNG offers lossless compression and transparency support.', exampleInput: 'Upload a JPG or WebP image', exampleOutput: 'PNG image file', faqItems: [{ question: 'Why convert to PNG?', answer: 'PNG supports lossless compression and transparency, making it ideal for graphics and web use.' }], relatedToolSlugs: ['image-to-jpg', 'png-to-webp', 'image-compressor'], type: 'custom', useCases: ['Getting transparency support', 'Lossless image saving', 'Web graphics'], featured: true, recentlyAdded: true, useCaseTags: ['conversion'] },
  { name: 'Image to JPG Converter', slug: 'image-to-jpg', category: 'Image Tools', categorySlug: 'image-tools', description: 'Convert any image to JPG format with quality control.', keywords: ['image to jpg', 'convert to jpg', 'jpg converter', 'jpeg'], seoTitle: 'Image to JPG Converter Online — Convert to JPG Free', metaDescription: 'Convert any image to JPG format with quality control. Free online JPG converter.', introText: 'Upload any image and convert it to JPG format. Adjust quality to balance file size and image clarity.', exampleInput: 'Upload a PNG or WebP image', exampleOutput: 'JPG image file', faqItems: [{ question: 'Does JPG support transparency?', answer: 'No. Transparent areas are filled with white when converting to JPG.' }, { question: 'What quality should I use?', answer: '80-90% is a good balance. Lower quality reduces file size but may introduce artifacts.' }], relatedToolSlugs: ['image-to-png', 'image-compressor', 'webp-to-png'], type: 'custom', useCases: ['Reducing file size', 'Email attachments', 'Photo sharing'], recentlyAdded: true, useCaseTags: ['conversion'] },
  { name: 'PNG to WebP Converter', slug: 'png-to-webp', category: 'Image Tools', categorySlug: 'image-tools', description: 'Convert PNG images to WebP format for smaller file sizes.', keywords: ['png to webp', 'webp converter', 'convert png'], seoTitle: 'PNG to WebP Converter Online — Convert PNG to WebP Free', metaDescription: 'Convert PNG images to WebP format. Free online converter — 100% client-side.', introText: 'Convert PNG images to the modern WebP format for significantly smaller file sizes with excellent quality.', exampleInput: 'Upload a PNG image', exampleOutput: 'WebP image file', faqItems: [{ question: 'Why convert to WebP?', answer: 'WebP typically produces 25-35% smaller files than PNG with comparable quality.' }, { question: 'Is WebP widely supported?', answer: 'Yes. All modern browsers support WebP.' }], relatedToolSlugs: ['webp-to-png', 'image-to-png', 'image-compressor'], type: 'custom', useCases: ['Web performance optimization', 'Reducing bandwidth', 'Modern image formats'], recentlyAdded: true, useCaseTags: ['conversion', 'compression'] },
  { name: 'WebP to PNG Converter', slug: 'webp-to-png', category: 'Image Tools', categorySlug: 'image-tools', description: 'Convert WebP images to PNG format.', keywords: ['webp to png', 'convert webp', 'png converter'], seoTitle: 'WebP to PNG Converter Online — Convert WebP to PNG Free', metaDescription: 'Convert WebP images to PNG format. Free online converter.', introText: 'Convert WebP images to the widely compatible PNG format for use in editors and platforms that don\'t support WebP.', exampleInput: 'Upload a WebP image', exampleOutput: 'PNG image file', faqItems: [{ question: 'Why convert WebP to PNG?', answer: 'Some older software and platforms don\'t support WebP. PNG is universally compatible.' }], relatedToolSlugs: ['png-to-webp', 'image-to-png', 'image-to-jpg'], type: 'custom', useCases: ['Compatibility with older software', 'Editing in Photoshop', 'Print-ready images'], recentlyAdded: true, useCaseTags: ['conversion'] },
  { name: 'Image Compressor', slug: 'image-compressor', category: 'Image Tools', categorySlug: 'image-tools', description: 'Compress images client-side with adjustable quality.', keywords: ['image compressor', 'compress image', 'reduce image size', 'optimize image'], seoTitle: 'Image Compressor Online — Compress Images Free', metaDescription: 'Compress images with adjustable quality. See original vs compressed size. Free online compressor.', introText: 'Compress images by adjusting the quality slider. See the original and compressed file sizes side by side before downloading. All compression happens in your browser.', exampleInput: 'Upload an image file', exampleOutput: 'Compressed image with size comparison', faqItems: [{ question: 'How does compression work?', answer: 'The tool re-encodes your image as JPEG at your chosen quality level, reducing file size.' }, { question: 'Will I lose image quality?', answer: 'Some quality loss occurs at lower settings. Use the slider to find the right balance.' }], relatedToolSlugs: ['image-resizer', 'image-to-jpg', 'png-to-webp'], type: 'custom', useCases: ['Email attachments', 'Web optimization', 'Storage saving'], featured: true, popular: true, recentlyAdded: true, useCaseTags: ['compression', 'image-editing'] },
  { name: 'Image Color Picker', slug: 'image-color-picker', category: 'Image Tools', categorySlug: 'image-tools', description: 'Pick colors from any image and get HEX and RGB values.', keywords: ['color picker', 'eyedropper', 'pick color from image', 'hex color'], seoTitle: 'Image Color Picker Online — Pick Colors from Images Free', metaDescription: 'Pick colors from any image. Get HEX and RGB values. Free online color picker.', introText: 'Upload an image and click anywhere to sample colors. Get instant HEX and RGB values with a history of picked colors. Works great with the Color Converter tool for format conversion.', exampleInput: 'Upload an image file', exampleOutput: 'HEX: #FF5733 / RGB: rgb(255, 87, 51)', faqItems: [{ question: 'How do I pick a color?', answer: 'Click anywhere on the uploaded image. The color at that pixel will be sampled.' }, { question: 'Can I copy color values?', answer: 'Yes. Click the copy icon next to any picked color.' }], relatedToolSlugs: ['color-converter', 'image-dimensions-checker', 'image-format-info'], type: 'custom', useCases: ['Design color matching', 'CSS color extraction', 'Brand color identification'], popular: true, recentlyAdded: true, useCaseTags: ['image-editing', 'productivity'] },
  { name: 'Image Dimensions Checker', slug: 'image-dimensions-checker', category: 'Image Tools', categorySlug: 'image-tools', description: 'Check image width, height, file size, and aspect ratio.', keywords: ['image dimensions', 'image size', 'check image', 'aspect ratio'], seoTitle: 'Image Dimensions Checker Online — Check Image Size Free', metaDescription: 'Check image width, height, file size, and aspect ratio. Free online dimensions checker.', introText: 'Upload an image to instantly see its width, height, file size, format, aspect ratio, and megapixel count. Essential for verifying upload requirements and social media sizes.', exampleInput: 'Upload an image file', exampleOutput: 'Width: 1920 px, Height: 1080 px, Ratio: 16:9', faqItems: [{ question: 'What information is shown?', answer: 'Width, height, file size, format, aspect ratio, and megapixels.' }], relatedToolSlugs: ['image-format-info', 'image-resizer', 'image-color-picker'], type: 'custom', useCases: ['Checking upload requirements', 'Social media size verification', 'Print resolution check'], recentlyAdded: true, useCaseTags: ['productivity'] },
  { name: 'Image to Base64 Converter', slug: 'image-to-base64', category: 'Image Tools', categorySlug: 'image-tools', description: 'Convert images to Base64 encoded strings.', keywords: ['image to base64', 'base64 encode image', 'data uri'], seoTitle: 'Image to Base64 Converter Online — Encode Images Free', metaDescription: 'Convert images to Base64 strings. Free online image encoder.', introText: 'Upload an image and get its Base64 data URI string. Useful for embedding images directly in HTML and CSS without extra HTTP requests.', exampleInput: 'Upload an image file', exampleOutput: 'data:image/png;base64,iVBORw0KGgo...', faqItems: [{ question: 'What is Base64 image encoding?', answer: 'Base64 converts binary image data into a text string that can be embedded directly in HTML or CSS.' }, { question: 'When should I use Base64 images?', answer: 'For small icons and images where reducing HTTP requests is beneficial. Large images should use regular files.' }], relatedToolSlugs: ['base64-to-image', 'base64-encoder', 'image-to-png'], type: 'custom', useCases: ['Embedding images in HTML', 'CSS background images', 'Email templates'], recentlyAdded: true, useCaseTags: ['encoding', 'conversion'] },
  { name: 'Base64 to Image Converter', slug: 'base64-to-image', category: 'Image Tools', categorySlug: 'image-tools', description: 'Decode Base64 strings back into downloadable images.', keywords: ['base64 to image', 'decode base64 image', 'data uri decoder'], seoTitle: 'Base64 to Image Converter Online — Decode Images Free', metaDescription: 'Decode Base64 strings into viewable and downloadable images. Free online decoder.', introText: 'Paste a Base64 encoded image string and see the decoded image. Download the result as a file. Works with both raw Base64 and data URI formats.', exampleInput: 'data:image/png;base64,iVBORw0KGgo...', exampleOutput: 'Decoded and viewable image', faqItems: [{ question: 'Do I need the data: prefix?', answer: 'No. The tool auto-detects and adds the prefix if missing.' }], relatedToolSlugs: ['image-to-base64', 'base64-decoder', 'image-to-png'], type: 'custom', useCases: ['Previewing embedded images', 'Debugging data URIs', 'Extracting images from code'], recentlyAdded: true, useCaseTags: ['decoding', 'conversion'] },
  { name: 'Favicon Generator', slug: 'favicon-generator', category: 'Image Tools', categorySlug: 'image-tools', description: 'Generate favicon-sized PNGs from any image.', keywords: ['favicon generator', 'favicon', 'icon generator', 'site icon'], seoTitle: 'Favicon Generator Online — Create Favicons Free', metaDescription: 'Generate favicons in multiple sizes from any image. Free online favicon generator.', introText: 'Upload a square image and generate favicon-sized outputs (16×16 to 192×192). Download individual sizes for your website. Perfect for web developers setting up favicons, PWA icons, and browser tab icons.', exampleInput: 'Upload a square image', exampleOutput: 'Favicons at 16, 32, 48, 64, 128, 180, 192 pixels', faqItems: [{ question: 'What size should my source image be?', answer: 'Use a square image at least 192×192 pixels for best results.' }, { question: 'What sizes are generated?', answer: '16×16, 32×32, 48×48, 64×64, 128×128, 180×180, and 192×192.' }], relatedToolSlugs: ['image-resizer', 'image-to-png', 'image-compressor'], type: 'custom', useCases: ['Website favicons', 'PWA icons', 'Browser tab icons'], featured: true, recentlyAdded: true, useCaseTags: ['generators', 'image-editing'] },
  { name: 'Image Format Info Viewer', slug: 'image-format-info', category: 'Image Tools', categorySlug: 'image-tools', description: 'View detailed format information and metadata for any image.', keywords: ['image info', 'image metadata', 'file info', 'format viewer'], seoTitle: 'Image Format Info Viewer Online — View Image Metadata Free', metaDescription: 'View detailed image metadata, format, and dimensions. Free online image info viewer.', introText: 'Upload an image to see its file name, MIME type, dimensions, file size, aspect ratio, megapixels, and last modified date.', exampleInput: 'Upload an image file', exampleOutput: 'Detailed format info table', faqItems: [{ question: 'What information is shown?', answer: 'File name, MIME type, size, dimensions, aspect ratio, megapixels, and last modified date.' }], relatedToolSlugs: ['image-dimensions-checker', 'image-color-picker', 'image-to-base64'], type: 'custom', useCases: ['Checking image specifications', 'Debugging image issues', 'Verifying file formats'], recentlyAdded: true, useCaseTags: ['debugging', 'productivity'] },
];

// ===== HELPER FUNCTIONS =====

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
  const q = query.toLowerCase().trim();
  if (!q) return [];

  // Score-based ranking: exact matches first, then partial
  const scored = tools.map(t => {
    let score = 0;
    const name = t.name.toLowerCase();
    const desc = t.description.toLowerCase();
    if (name === q) score += 100;
    else if (name.startsWith(q)) score += 50;
    else if (name.includes(q)) score += 30;
    if (desc.includes(q)) score += 10;
    if (t.keywords.some(k => k.toLowerCase() === q)) score += 40;
    else if (t.keywords.some(k => k.toLowerCase().includes(q))) score += 15;
    if (t.category.toLowerCase().includes(q)) score += 5;
    if (t.useCaseTags?.some(tag => tag.includes(q))) score += 8;
    return { tool: t, score };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(s => s.tool);
}

export function getFeaturedTools(): ToolConfig[] {
  return tools.filter(t => t.featured);
}

export function getPopularTools(): ToolConfig[] {
  return tools.filter(t => t.popular);
}

export function getRecentlyAddedTools(): ToolConfig[] {
  return tools.filter(t => t.recentlyAdded);
}

export function getToolsByUseCaseTag(tag: UseCaseTag): ToolConfig[] {
  return tools.filter(t => t.useCaseTags?.includes(tag));
}

export function getAllUseCaseTags(): UseCaseTag[] {
  const tags = new Set<UseCaseTag>();
  tools.forEach(t => t.useCaseTags?.forEach(tag => tags.add(tag)));
  return Array.from(tags);
}

/**
 * Get related tools for a given tool. Prioritizes manual relatedToolSlugs,
 * then supplements with same-category, shared-tag, and shared-keyword tools.
 */
export function getSmartRelatedTools(currentSlug: string, limit = 6): ToolConfig[] {
  const current = getToolBySlug(currentSlug);
  if (!current) return [];

  const seen = new Set<string>([currentSlug]);
  const result: ToolConfig[] = [];

  // 1. Manual related tools (highest priority)
  for (const slug of current.relatedToolSlugs) {
    if (seen.has(slug)) continue;
    const t = getToolBySlug(slug);
    if (t) { result.push(t); seen.add(slug); }
    if (result.length >= limit) return result;
  }

  // 2. Same use-case tags
  if (current.useCaseTags) {
    const tagTools = tools.filter(t =>
      !seen.has(t.slug) &&
      t.useCaseTags?.some(tag => current.useCaseTags!.includes(tag))
    );
    for (const t of tagTools) {
      result.push(t); seen.add(t.slug);
      if (result.length >= limit) return result;
    }
  }

  // 3. Same category
  const catTools = tools.filter(t => !seen.has(t.slug) && t.categorySlug === current.categorySlug);
  for (const t of catTools) {
    result.push(t); seen.add(t.slug);
    if (result.length >= limit) return result;
  }

  // 4. Shared keywords (cross-category)
  const kwSet = new Set(current.keywords.map(k => k.toLowerCase()));
  const kwTools = tools.filter(t =>
    !seen.has(t.slug) &&
    t.keywords.some(k => kwSet.has(k.toLowerCase()))
  );
  for (const t of kwTools) {
    result.push(t); seen.add(t.slug);
    if (result.length >= limit) return result;
  }

  return result;
}

/**
 * Get "More tools like this" — tools sharing use-case tags but different from related tools
 */
export function getMoreToolsLikeThis(currentSlug: string, relatedSlugs: string[], limit = 4): ToolConfig[] {
  const current = getToolBySlug(currentSlug);
  if (!current?.useCaseTags?.length) return [];

  const excluded = new Set([currentSlug, ...relatedSlugs]);
  return tools
    .filter(t => !excluded.has(t.slug) && t.useCaseTags?.some(tag => current.useCaseTags!.includes(tag)))
    .slice(0, limit);
}
