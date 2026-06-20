export interface ToolContent {
  howToUse: {
    steps: string[];
  };
  expandedDescription: string[];
  useCases: Array<{
    title: string;
    description: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  trustNote: string;
}

export const toolContentMap: Record<string, ToolContent> = {
  'json-formatter': {
    howToUse: {
      steps: [
        'Paste your raw or minified JSON into the Input field, or click "Load Example" to try a sample.',
        'Click "Format JSON" to instantly beautify and validate your JSON.',
        'Review the formatted output with proper indentation and syntax highlighting.',
        'Click "Copy" to copy the result, or "Download" to save it as a .json file.',
      ],
    },
    expandedDescription: [
      'JSON (JavaScript Object Notation) is the standard data format used by virtually every web API, configuration file, and modern application. When APIs return minified JSON or when data gets mangled in transit, reading and debugging it becomes painful without a proper formatter.',
      'This free JSON formatter and validator instantly transforms compact, unreadable JSON into a cleanly indented, human-readable structure. It also validates your JSON as it formats — catching missing commas, unmatched brackets, unclosed strings, and other syntax errors that are nearly impossible to spot in minified output.',
      'Unlike desktop tools that require installation, everything runs directly in your browser. Your JSON data never leaves your device — it is processed entirely client-side, making this tool safe for formatting sensitive API payloads, configuration files, and authentication tokens.',
      'The formatter handles all valid JSON structures including nested objects, arrays, booleans, nulls, and Unicode strings. It works equally well for small API responses and large multi-thousand line JSON files.',
    ],
    useCases: [
      { title: 'Debugging API responses', description: 'Paste the raw response from a REST API call to instantly see the structure and identify missing or unexpected fields.' },
      { title: 'Formatting configuration files', description: 'Clean up minified package.json, tsconfig.json, or other config files that have been compressed for production.' },
      { title: 'Validating JSON before sending', description: 'Check that a JSON payload is syntactically correct before POSTing it to an API endpoint to avoid 400 errors.' },
      { title: 'Reading webhook payloads', description: 'Format incoming webhook data from Stripe, GitHub, Slack, or other services to understand the event structure.' },
      { title: 'Learning JSON structure', description: 'Students and beginners can use the formatter to visualise how nested objects and arrays relate to each other.' },
      { title: 'Comparing data structures', description: 'Format two JSON blobs separately to visually compare their structure and spot differences in nesting or field names.' },
    ],
    faqs: [
      { question: 'What is JSON formatting?', answer: 'JSON formatting (also called JSON beautifying or pretty-printing) adds consistent indentation and line breaks to compact JSON, making it readable. Minified JSON is valid but written on a single line to reduce file size — formatting expands it back into a structured, human-readable layout.' },
      { question: 'Does this tool validate JSON?', answer: 'Yes. The formatter validates your JSON as it processes it. If your JSON has a syntax error — such as a missing comma, unclosed bracket, or invalid value — the tool will display a clear error message showing what went wrong and where.' },
      { question: 'Is my data safe?', answer: 'Yes. All processing happens entirely in your browser using JavaScript. Your JSON data is never sent to any server, stored, or logged. You can safely format sensitive data including API keys, tokens, and user information.' },
      { question: 'What is the difference between JSON and JSON5?', answer: 'Standard JSON (RFC 7159) requires double-quoted keys and no trailing commas. JSON5 is a superset that allows comments, single-quoted strings, trailing commas, and unquoted keys. This tool formats standard JSON. JSON5 files need to be converted to standard JSON first.' },
      { question: 'How do I format nested JSON?', answer: 'Nested JSON (objects inside objects, or arrays of objects) is formatted automatically. Each nesting level is indented by 2 spaces, making the hierarchy immediately visible. There is no depth limit — deeply nested structures are handled correctly.' },
      { question: 'What causes a JSON parse error?', answer: 'Common JSON errors include: missing commas between object properties, trailing commas after the last item, single quotes instead of double quotes around strings, unescaped special characters inside strings, and missing closing brackets or braces. The formatter error message will point to the line and character position of the issue.' },
      { question: 'Can I format JSON from a file?', answer: 'Currently you can paste JSON directly into the input field. To format a JSON file, open the file in a text editor, select all (Ctrl+A / Cmd+A), paste into the input field, and click Format JSON. Download the result as a formatted .json file using the Download button.' },
      { question: 'What is JSON minification?', answer: 'Minification is the opposite of formatting — it removes all whitespace and line breaks to produce the most compact possible JSON string. This reduces file size for network transmission. Many formatters also support minification; if you need to minify, paste your formatted JSON and look for a Minify option.' },
    ],
    trustNote: 'All formatting runs locally in your browser — your data is never uploaded to any server.',
  },

  'base64-encoder': {
    howToUse: {
      steps: [
        'Type or paste the text you want to encode into the input field.',
        'Click "Encode" — the Base64 encoded output appears instantly.',
        'Copy the encoded string using the Copy button.',
        'Use the encoded string in your API header, data URI, or wherever Base64 is required.',
      ],
    },
    expandedDescription: [
      'Base64 is an encoding scheme that converts binary data into a string of ASCII characters. It was designed to safely transmit binary content — like images, files, or arbitrary bytes — through systems that only handle text, such as email, HTTP headers, and XML documents.',
      'This free Base64 encoder converts any text string into its Base64 representation instantly. The encoding is reversible — use the companion Base64 Decoder to get the original text back from any Base64 string.',
      'Base64 encoded strings are about 33% longer than the original input because every 3 bytes of input become 4 characters of output. This size tradeoff is acceptable in most cases since the primary benefit is compatibility, not compression.',
      'Everything runs in your browser — your text is encoded client-side and never sent to a server. This makes it safe to encode sensitive strings like passwords, tokens, and API credentials for use in Basic Authentication headers.',
    ],
    useCases: [
      { title: 'HTTP Basic Authentication', description: 'Encode "username:password" to Base64 for use in the Authorization: Basic header when making authenticated API requests.' },
      { title: 'Embedding images in CSS or HTML', description: 'Convert small images to Base64 data URIs to embed them directly in stylesheets or HTML, eliminating a network request.' },
      { title: 'Encoding JSON payloads', description: 'Some APIs require JSON body parameters to be Base64 encoded before transmission to avoid special character conflicts.' },
      { title: 'JWT token inspection', description: 'JWT tokens are Base64URL encoded. Encode or decode parts of a JWT to inspect headers and payloads during debugging.' },
      { title: 'Email attachment encoding', description: 'MIME email attachments use Base64 to encode binary files as plain text for transmission through email servers.' },
      { title: 'Storing binary data in text fields', description: 'When you need to store binary data in a database text column or JSON field, Base64 encoding makes it safe and portable.' },
    ],
    faqs: [
      { question: 'What is Base64 encoding?', answer: 'Base64 is a binary-to-text encoding scheme that represents binary data using 64 printable ASCII characters (A-Z, a-z, 0-9, +, /). It was created to safely transmit binary content through systems designed only for text, such as email protocols and HTTP headers.' },
      { question: 'Is Base64 encryption?', answer: 'No. Base64 is encoding, not encryption. It does not provide any security or confidentiality — anyone can decode a Base64 string instantly. It is purely a format transformation for compatibility purposes. Do not use Base64 as a security measure.' },
      { question: 'What does the = sign mean at the end of a Base64 string?', answer: 'The = characters are padding. Base64 encodes 3 bytes at a time into 4 characters. If the input length is not a multiple of 3, one or two = padding characters are added to make the output length a multiple of 4. One = means one byte of padding, == means two bytes.' },
      { question: 'What is the difference between Base64 and Base64URL?', answer: 'Standard Base64 uses + and / characters which have special meanings in URLs. Base64URL replaces + with - and / with _ to make the encoded string safe to use in URLs and filenames without percent-encoding. JWT tokens use Base64URL encoding.' },
      { question: 'How much larger is Base64 encoded output?', answer: 'Base64 output is approximately 33% larger than the input. Every 3 bytes of input produces 4 characters of output. A 100-byte string becomes roughly 136 Base64 characters. This overhead is the tradeoff for text-safe encoding.' },
      { question: 'Can I encode binary files like images to Base64?', answer: 'Yes, but this text encoder works with text input only. To encode binary files (images, PDFs, etc.) to Base64, use the Image to Base64 tool in the image tools section, which handles binary file input directly.' },
      { question: 'Is my data safe to encode here?', answer: 'Yes. All encoding happens entirely in your browser using JavaScript. Your text never leaves your device and is not sent to any server. It is safe to encode sensitive strings including passwords, tokens, and private keys.' },
    ],
    trustNote: 'Encoding runs entirely in your browser — your text is never sent to any server.',
  },

  'base64-decoder': {
    howToUse: {
      steps: [
        'Paste the Base64 encoded string into the input field.',
        'Click "Decode" to convert it back to the original text.',
        'View the decoded output in the result field.',
        'Copy the decoded text using the Copy button.',
      ],
    },
    expandedDescription: [
      'Base64 decoding reverses the Base64 encoding process, converting an ASCII string of encoded characters back into the original text or data. Whenever you encounter a Base64 string — in a JWT token, an API response, an email header, or a data URI — this tool converts it back to readable form instantly.',
      'This decoder handles both standard Base64 (using + and / characters) and Base64URL (using - and _ characters, commonly used in JWT tokens and URL parameters). It automatically detects the variant and decodes correctly.',
      'Base64 strings are easy to recognise — they consist of uppercase and lowercase letters, numbers, and end with zero, one, or two = padding characters. If a string looks like a long alphanumeric sequence ending in == or =, it is almost certainly Base64 encoded.',
      'All decoding happens in your browser. Your encoded strings are never sent to a server, making this tool safe for decoding JWT payloads, authentication tokens, and other sensitive encoded data.',
    ],
    useCases: [
      { title: 'Decoding JWT token payloads', description: 'JWT tokens consist of three Base64URL encoded segments. Decode the middle segment (payload) to inspect claims like user ID, roles, and expiry time.' },
      { title: 'Reading Basic Auth headers', description: 'HTTP Basic Authentication headers contain Base64 encoded credentials. Decode them to verify the username and password being sent.' },
      { title: 'Extracting embedded images', description: 'Data URIs in HTML and CSS embed images as Base64 strings. Decode to retrieve the original image data.' },
      { title: 'Debugging API responses', description: 'Some APIs return Base64 encoded fields in JSON responses. Decode them to read the actual content.' },
      { title: 'Reading encoded configuration', description: 'Some configuration systems store values as Base64 to avoid special character issues. Decode to read the actual setting.' },
      { title: 'Inspecting email content', description: 'Email attachments and some email bodies are MIME encoded in Base64. Decode to read or extract the content.' },
    ],
    faqs: [
      { question: 'How do I know if a string is Base64 encoded?', answer: 'Base64 strings only contain letters (A-Z, a-z), numbers (0-9), and the characters +, /, =. They are usually a multiple of 4 characters long and often end with = or ==. If a string looks like random alphanumeric characters with possible trailing equals signs, it is likely Base64.' },
      { question: 'What is the difference between Base64 and Base64URL?', answer: 'Standard Base64 uses + and / which are special characters in URLs. Base64URL replaces + with - and / with _ to make encoded strings URL-safe. JWT tokens use Base64URL. This decoder handles both variants automatically.' },
      { question: 'Why does my decoded output look like gibberish?', answer: 'If the decoded output is unreadable, the original data was binary (not text) — such as an image, PDF, or other file. Text decoders cannot display binary data meaningfully. Use a specialised binary-aware tool if you need to decode binary Base64 content.' },
      { question: 'Can Base64 be decoded without a key?', answer: 'Yes. Base64 is not encryption — it is just encoding. Anyone can decode a Base64 string without any key or password. If you need to protect data, use proper encryption (AES, RSA etc.) not Base64.' },
      { question: 'Is my data safe to decode here?', answer: 'Yes. All decoding runs entirely in your browser. Your Base64 strings are never sent to any server and are not logged or stored. It is safe to decode JWT tokens, credentials, and other sensitive encoded strings.' },
      { question: 'What does an invalid Base64 error mean?', answer: 'An invalid Base64 error means the input string contains characters that are not part of the Base64 alphabet, or the string length is not valid. Check for missing padding (= characters), spaces, or non-Base64 characters that may have been accidentally included.' },
    ],
    trustNote: 'Decoding runs entirely in your browser — your encoded strings are never sent to any server.',
  },

  'regex-tester': {
    howToUse: {
      steps: [
        'Enter your regular expression pattern in the Regex field (without surrounding / slashes).',
        'Select any flags you need: g (global), i (case-insensitive), m (multiline), s (dotAll).',
        'Type or paste your test string in the Test String field.',
        'Matches are highlighted in real time as you type — no need to click a button.',
      ],
    },
    expandedDescription: [
      'Regular expressions (regex) are patterns used to match, search, validate, and manipulate text. They are supported in virtually every programming language and are essential for tasks like form validation, log parsing, data extraction, and search-and-replace operations.',
      'This free online regex tester lets you build and debug regular expressions in real time with immediate visual feedback. Matches are highlighted as you type, so you can see exactly what your pattern matches — and what it misses — without writing any code.',
      'The tester supports all standard JavaScript regex syntax including character classes, quantifiers, groups, lookaheads, lookbehinds, and backreferences. It also supports all common flags: g (find all matches), i (case-insensitive), m (multiline anchors), and s (dot matches newlines).',
      'Regex can be notoriously difficult to debug — a single misplaced character changes the entire match behaviour. This tool makes the iteration cycle fast: tweak the pattern, see the result immediately, and understand exactly why a match succeeded or failed.',
    ],
    useCases: [
      { title: 'Form validation', description: 'Test email, phone number, password strength, postcode, and URL validation patterns before adding them to your application code.' },
      { title: 'Log file parsing', description: 'Write patterns to extract timestamps, error codes, IP addresses, and other structured data from server logs.' },
      { title: 'Search and replace', description: 'Build replacement patterns to clean, transform, or reformat text data in editors that support regex find-and-replace.' },
      { title: 'Data extraction', description: 'Extract specific fields from unstructured text, such as prices from HTML, dates from documents, or identifiers from logs.' },
      { title: 'Input sanitisation', description: 'Test patterns that strip or reject invalid characters from user input before saving to a database.' },
      { title: 'Learning regex syntax', description: 'Experiment with quantifiers, groups, lookaheads, and other advanced features to understand how they work in isolation.' },
    ],
    faqs: [
      { question: 'What is a regular expression?', answer: 'A regular expression (regex) is a sequence of characters that defines a search pattern. It can describe anything from a simple word to a complex structure like an email address or URL. Regex is supported in JavaScript, Python, Java, PHP, Ruby, and most other programming languages.' },
      { question: 'What flags does this tester support?', answer: 'This tester supports the standard JavaScript regex flags: g (global — find all matches, not just the first), i (case-insensitive matching), m (multiline — makes ^ and $ match line boundaries), and s (dotAll — makes the dot . match newline characters too).' },
      { question: 'What is the difference between .* and .+?', answer: '. matches any character except newline (with the s flag it matches newlines too). * means "zero or more", so .* matches any sequence including empty strings. + means "one or more", so .+ requires at least one character. Use .* when the match can be absent, .+ when at least one character is required.' },
      { question: 'How do I make a regex case-insensitive?', answer: 'Enable the i flag. With the i flag, the pattern [a-z] matches both lowercase and uppercase letters. The flag applies to the entire pattern — you cannot make only part of a regex case-insensitive using the flag.' },
      { question: 'What is a capture group?', answer: 'A capture group is a part of the regex surrounded by parentheses ( ). Whatever the group matches is "captured" and can be referenced later in a replacement string or extracted by your code. For example, (\\d{4}) captures exactly 4 digits.' },
      { question: 'What is the difference between greedy and lazy matching?', answer: 'Greedy quantifiers (*, +, {n,}) match as much as possible. Lazy quantifiers (*?, +?, {n,}?) match as little as possible. For example, .* on the string "aXbXc" matches the entire string greedily, but .*? matches just "a" lazily before stopping at the first X.' },
      { question: 'How do I match a literal dot or parenthesis?', answer: 'Special regex characters (. * + ? ( ) [ ] { } ^ $ | \\) must be escaped with a backslash to match literally. So \\. matches a literal dot, \\( matches a literal opening parenthesis. Without the backslash, . matches any character.' },
      { question: 'Why does my regex match too much?', answer: 'This is usually a greedy quantifier issue. Try adding ? after *, +, or {n,} to make them lazy. Also check your anchors — without ^ and $ anchors, patterns can match substrings anywhere in the input rather than requiring a full-string match.' },
    ],
    trustNote: 'All regex processing runs in your browser — no data is sent to any server.',
  },

  'uuid-generator': {
    howToUse: {
      steps: [
        'Click "Generate UUID" to create a new random UUID v4.',
        'Click again to generate another, or set a quantity to generate multiple at once.',
        'Copy individual UUIDs with the Copy button, or copy all at once.',
        'Use the generated UUIDs as database primary keys, session IDs, or unique identifiers in your application.',
      ],
    },
    expandedDescription: [
      'A UUID (Universally Unique Identifier) is a 128-bit identifier standardised by RFC 4122. It is formatted as 32 hexadecimal digits separated by hyphens in the pattern 8-4-4-4-12 (e.g., 550e8400-e29b-41d4-a716-446655440000). UUIDs are designed to be unique across all devices and all time without requiring a central authority to assign them.',
      'This generator creates UUID version 4, which uses cryptographically secure random numbers. The probability of two UUID v4 values colliding is so astronomically small that it is effectively impossible — you would need to generate over a billion UUIDs per second for 85 years before a 50% chance of collision.',
      'UUIDs are the standard choice for database primary keys in distributed systems, where auto-incrementing integers would require coordination between servers. They are also widely used as session IDs, request IDs for API tracing, file names for uploaded content, and idempotency keys.',
      'All UUIDs are generated using the Web Crypto API (crypto.getRandomValues), which provides cryptographically strong random values in the browser without any server interaction.',
    ],
    useCases: [
      { title: 'Database primary keys', description: 'Use UUIDs as primary keys in PostgreSQL, MySQL, MongoDB, or any database to avoid sequential ID prediction and enable distributed writes without coordination.' },
      { title: 'Session and token IDs', description: 'Generate unique session identifiers for user authentication tokens, CSRF tokens, and API keys.' },
      { title: 'API request tracing', description: 'Attach a UUID to each API request as an X-Request-ID header to trace requests through microservices and correlate logs.' },
      { title: 'File upload naming', description: 'Use UUIDs as filenames for user-uploaded content to prevent collisions and avoid exposing sequential file counts.' },
      { title: 'Idempotency keys', description: 'Generate UUIDs as idempotency keys for payment APIs and other services that need to safely retry requests without double-processing.' },
      { title: 'Testing and mocking', description: 'Generate batches of UUIDs to populate test databases, mock API responses, or seed development data.' },
    ],
    faqs: [
      { question: 'What is a UUID?', answer: 'A UUID (Universally Unique Identifier) is a 128-bit identifier formatted as 32 hexadecimal characters separated by hyphens: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx. It is standardised by RFC 4122 and designed to be unique across all computers and all time without central coordination.' },
      { question: 'What is the difference between UUID v1, v4, and v7?', answer: 'UUID v1 is based on the current timestamp and MAC address — it is time-ordered but leaks hardware information. UUID v4 uses entirely random numbers — it is the most widely used version and recommended for most use cases. UUID v7 is a newer standard that uses random numbers with a time-ordered prefix, making it better for database indexing than v4.' },
      { question: 'Are UUIDs truly unique?', answer: 'UUID v4 is generated from 122 random bits. The probability of generating two identical UUIDs is 1 in 5.3 × 10³⁶. In practice, UUID collisions essentially never happen — even generating millions of UUIDs per second would take billions of years to produce a collision.' },
      { question: 'Can UUIDs be used as database primary keys?', answer: 'Yes, and this is one of the most common use cases. UUIDs as primary keys allow records to be created on any server without coordination, prevent ID enumeration attacks, and make data merging from different databases straightforward. The tradeoff is slightly larger storage than integers and less optimal index performance for UUID v4 (UUID v7 addresses this with time-ordering).' },
      { question: 'Are the generated UUIDs cryptographically secure?', answer: 'Yes. This generator uses the Web Crypto API (window.crypto.getRandomValues), which provides cryptographically strong random values. These are suitable for use as session tokens and security-sensitive identifiers.' },
      { question: 'What is a GUID? Is it the same as a UUID?', answer: 'GUID (Globally Unique Identifier) is Microsoft\'s name for the UUID standard. GUIDs and UUIDs are the same format and fully interchangeable. Microsoft tools typically display them in uppercase with braces: {550E8400-E29B-41D4-A716-446655440000}.' },
    ],
    trustNote: 'UUIDs are generated in your browser using the Web Crypto API — no data leaves your device.',
  },

  'timestamp-converter': {
    howToUse: {
      steps: [
        'Enter a Unix timestamp (in seconds or milliseconds) to convert it to a human-readable date.',
        'Or enter a date and time to convert it to a Unix timestamp.',
        'Select your timezone to see the local equivalent.',
        'Copy the result with the Copy button.',
      ],
    },
    expandedDescription: [
      'A Unix timestamp (also called Epoch time) is the number of seconds that have elapsed since 00:00:00 UTC on 1 January 1970. It is the universal standard for representing moments in time in software — used in databases, APIs, log files, JWT tokens, and file systems across every platform and programming language.',
      'This free timestamp converter works in both directions: paste a Unix timestamp to get a human-readable date and time, or enter a date to get the corresponding Unix timestamp. It supports both second-precision and millisecond-precision timestamps, which are common in JavaScript APIs.',
      'Timestamps are timezone-independent by definition — a Unix timestamp represents the same moment in time regardless of where you are. The converter shows both the UTC time and the local time in your selected timezone so you can verify the exact moment being represented.',
      'Common situations where you need a timestamp converter include debugging JWT expiry claims (the exp field is a Unix timestamp), reading database created_at fields, interpreting API rate limit reset times, and working with log files that use numeric timestamps.',
    ],
    useCases: [
      { title: 'Debugging JWT tokens', description: 'Convert the exp, iat, and nbf claims in JWT payloads from Unix timestamps to readable dates to check expiry times.' },
      { title: 'Reading API responses', description: 'Many APIs return timestamps as Unix epoch values. Convert them to understand when an event occurred or when a resource expires.' },
      { title: 'Log file analysis', description: 'Server and application logs often use Unix timestamps. Convert them to local time to correlate events with real-world times.' },
      { title: 'Database record inspection', description: 'Convert created_at, updated_at, and deleted_at timestamp columns to readable dates when inspecting database records.' },
      { title: 'Checking rate limit resets', description: 'API rate limit headers often include a reset timestamp. Convert it to know exactly when your rate limit will lift.' },
      { title: 'Generating timestamps for testing', description: 'Convert a specific future or past date to a Unix timestamp to use in test data, mock API responses, or scheduled jobs.' },
    ],
    faqs: [
      { question: 'What is a Unix timestamp?', answer: 'A Unix timestamp is the number of seconds (or milliseconds) since January 1, 1970 00:00:00 UTC, known as the Unix Epoch. It provides a single, timezone-independent number to represent any moment in time. For example, the timestamp 1700000000 represents November 14, 2023 22:13:20 UTC.' },
      { question: 'What is the difference between seconds and milliseconds timestamps?', answer: 'Unix timestamps are traditionally in seconds, giving a 10-digit number. JavaScript\'s Date.now() and many modern APIs return milliseconds, giving a 13-digit number. If your timestamp has 13 digits, it is in milliseconds. Divide by 1000 to convert to seconds. This converter handles both automatically.' },
      { question: 'What is the maximum Unix timestamp?', answer: 'A 32-bit signed integer can store Unix timestamps up to 2147483647, which represents January 19, 2038 03:14:07 UTC. This is the "Year 2038 problem". Modern systems use 64-bit integers which can represent dates billions of years into the future.' },
      { question: 'Why do APIs use timestamps instead of date strings?', answer: 'Unix timestamps are unambiguous — they represent a single moment in time regardless of timezone, locale, or date format conventions. Date strings like "01/02/03" are ambiguous (is it January 2 or February 1? 2003 or 1903?). Timestamps eliminate this ambiguity and are trivial to compare and sort.' },
      { question: 'How do I get the current Unix timestamp?', answer: 'In JavaScript: Math.floor(Date.now() / 1000) for seconds, or Date.now() for milliseconds. In Python: import time; int(time.time()). In Unix shell: date +%s. This tool also displays the current timestamp in real time.' },
    ],
    trustNote: 'All conversion happens in your browser — no data is sent to any server.',
  },

  'word-counter': {
    howToUse: {
      steps: [
        'Type or paste your text into the input area.',
        'Word count, character count, sentence count, and reading time update instantly as you type.',
        'View keyword frequency to see which words appear most often.',
        'Clear the field and start again or paste new text to analyse a different document.',
      ],
    },
    expandedDescription: [
      'The word counter gives you an instant, accurate count of words, characters (with and without spaces), sentences, paragraphs, and estimated reading time as you type — no button press required.',
      'Writers, editors, students, and content creators rely on word counts for meeting submission requirements, staying within social media character limits, hitting SEO content length targets, and tracking writing productivity. This tool makes all those counts visible at a glance.',
      'The reading time estimate uses the average adult reading speed of 200-250 words per minute, which is a widely accepted standard for web content. This helps you gauge how long an article, blog post, or email will take a typical reader to consume.',
      'Unlike word processors that require saving a file first, this browser-based counter works with any text you can paste — emails, documents, social media drafts, code comments, or anything else. There is no file size limit for reasonable text lengths.',
    ],
    useCases: [
      { title: 'Blog and article writing', description: 'Track word count while writing to hit SEO content length targets — most competitive articles need 1,500-2,500 words.' },
      { title: 'Social media captions', description: 'Keep LinkedIn posts under 3,000 characters, Twitter/X posts under 280 characters, and Instagram captions under 2,200 characters.' },
      { title: 'Academic submissions', description: 'Verify your essay or assignment meets minimum or maximum word count requirements before submitting.' },
      { title: 'Meta description optimisation', description: 'Keep meta descriptions between 150-160 characters — paste your draft to check the exact length instantly.' },
      { title: 'Email subject line testing', description: 'Subject lines over 60 characters get cut off on most email clients. Paste yours to check.' },
      { title: 'Reading time estimation', description: 'Add reading time estimates to blog posts to set reader expectations and improve engagement.' },
    ],
    faqs: [
      { question: 'How are words counted?', answer: 'Words are counted by splitting the text on whitespace (spaces, tabs, newlines) and counting non-empty segments. Hyphenated words like "well-known" count as one word. Numbers count as words. Punctuation attached to words (commas, periods, quotes) is ignored.' },
      { question: 'Does it count characters with or without spaces?', answer: 'Both. The tool shows characters with spaces (total character count including spaces) and characters without spaces (only letters, numbers, and punctuation). Characters without spaces is more useful for character-limited fields like Twitter.' },
      { question: 'How is reading time calculated?', answer: 'Reading time is estimated based on an average adult reading speed of approximately 200-250 words per minute. For a 1,000-word article, this gives a reading time of 4-5 minutes. Complex technical content or content with many images may take longer.' },
      { question: 'What counts as a sentence?', answer: 'Sentences are counted by splitting on sentence-ending punctuation: periods, exclamation marks, and question marks. Abbreviations like "Mr." and "U.S.A." can occasionally cause slight overcounting, but the result is accurate for typical prose.' },
      { question: 'Is there a maximum text length?', answer: 'There is no hard limit, but very long texts (over 100,000 words) may cause a slight delay as the browser processes the count. For typical documents, blog posts, and emails, counting is instant.' },
    ],
    trustNote: 'Your text stays in your browser — it is never sent to any server.',
  },

  'image-resizer': {
    howToUse: {
      steps: [
        'Click "Upload Image" or drag and drop a PNG, JPG, or WebP file onto the tool.',
        'Enter the target width and/or height in pixels, or choose a percentage scale.',
        'Toggle "Maintain aspect ratio" to prevent the image from being distorted.',
        'Click "Resize" and download the resized image.',
      ],
    },
    expandedDescription: [
      'Image resizing is one of the most common image editing tasks for web developers, designers, and content creators. Whether you need to shrink a photo for faster web loading, resize a product image to a specific ecommerce platform requirement, or scale up a small graphic, this tool handles it in seconds.',
      'This free online image resizer lets you set exact pixel dimensions or resize by percentage. Aspect ratio lock prevents unwanted stretching or squashing when you only specify one dimension. The tool supports PNG, JPG, and WebP formats as both input and output.',
      'All image processing happens directly in your browser using the Canvas API. Your images are never uploaded to any server — they never leave your device. This makes the tool both fast (no upload/download latency) and completely private.',
      'For web use, the general rule is to resize images to the exact dimensions they will be displayed at — serving a 3000px wide image for a 800px display area wastes bandwidth and slows page load. Resizing before upload is one of the simplest ways to improve Core Web Vitals scores.',
    ],
    useCases: [
      { title: 'Web optimisation', description: 'Resize photos to match the display dimensions on your website to reduce file size and improve page load speed.' },
      { title: 'Social media images', description: 'Resize images to platform-specific dimensions: 1200x630 for Open Graph, 1080x1080 for Instagram square, 1500x500 for Twitter header.' },
      { title: 'Ecommerce product images', description: 'Resize product photos to the exact dimensions required by Shopify, WooCommerce, Amazon, or other platforms.' },
      { title: 'Email campaigns', description: 'Resize header images and inline photos to appropriate widths (typically 600px) for HTML email templates.' },
      { title: 'Profile pictures and avatars', description: 'Crop and resize photos to the square dimensions required by profile picture uploads on various platforms.' },
      { title: 'Presentation slides', description: 'Resize images to fit slide dimensions (typically 1920x1080 for widescreen) without stretching or distortion.' },
    ],
    faqs: [
      { question: 'Will resizing reduce image quality?', answer: 'Reducing image dimensions (downscaling) generally has no visible quality loss. Increasing dimensions (upscaling) will make the image appear softer or pixelated because you are adding pixels that did not exist. For best results, always start with the largest available source image.' },
      { question: 'What is aspect ratio and why does it matter?', answer: 'Aspect ratio is the proportional relationship between width and height. A 1920x1080 image has a 16:9 aspect ratio. If you resize only the width without maintaining aspect ratio, the height stays the same and the image gets stretched horizontally. "Maintain aspect ratio" automatically adjusts the other dimension to keep the image proportional.' },
      { question: 'What formats are supported?', answer: 'This tool supports PNG, JPG (JPEG), and WebP as both input and output formats. PNG preserves transparency, JPG produces smaller files for photographs, and WebP is the modern format that offers the best compression for web use.' },
      { question: 'Is there a file size limit?', answer: 'There is no strict file size limit, but very large images (above 20-30MB) may be slow to process depending on your device. The browser processes the image in memory, so available RAM is the practical limit.' },
      { question: 'Are my images uploaded to a server?', answer: 'No. All image processing uses the browser Canvas API and runs entirely on your device. Your images never leave your browser and are not stored anywhere. This is safe for resizing private, confidential, or proprietary images.' },
      { question: 'What pixel dimensions should I use for web images?', answer: 'For full-width blog images: 1200px wide. For Open Graph social sharing: 1200x630px. For Instagram square: 1080x1080px. For product thumbnails: typically 400-800px square. For background images: match your container width, commonly 1920px for full-screen backgrounds.' },
    ],
    trustNote: 'All image processing runs in your browser — your images are never uploaded to any server.',
  },

  'image-compressor': {
    howToUse: {
      steps: [
        'Upload a PNG, JPG, or WebP image by clicking "Upload Image" or dragging it onto the tool.',
        'Adjust the quality slider — lower values mean smaller files, higher values mean better quality.',
        'Preview the compressed image and compare the original vs compressed file size.',
        'Download the compressed image when satisfied with the quality/size tradeoff.',
      ],
    },
    expandedDescription: [
      'Image compression reduces file size while preserving visual quality to the degree you choose. Smaller images mean faster page loads, lower bandwidth costs, and better scores on Google PageSpeed Insights and Core Web Vitals — all of which directly affect SEO rankings and user experience.',
      'This free image compressor uses lossy compression for JPG and WebP files and lossless compression for PNG. The quality slider lets you find the right balance: most web images look visually identical at 70-85% quality while being 50-80% smaller than the original.',
      'Images are often the largest contributors to page weight. A single uncompressed high-resolution photo can be 5-15MB, while a web-optimised version of the same image at 1200px wide and 80% quality is typically 100-300KB. That difference in load time is measurable and affects bounce rate.',
      'All compression runs in your browser using the Canvas API. No images are uploaded to any server, making this tool suitable for compressing private, confidential, or proprietary images without security concerns.',
    ],
    useCases: [
      { title: 'Website performance', description: 'Compress hero images, blog post images, and product photos before uploading to your CMS to improve page load speed.' },
      { title: 'Google PageSpeed optimisation', description: 'Address "Serve images in next-gen formats" and "Efficiently encode images" PageSpeed recommendations by compressing and converting images.' },
      { title: 'Email attachments', description: 'Compress images before attaching them to emails to stay within size limits and avoid slow delivery.' },
      { title: 'Social media uploads', description: 'Compress images before uploading to avoid platform recompression, which can introduce visible artefacts.' },
      { title: 'Cloud storage savings', description: 'Compress image libraries before uploading to AWS S3, Google Cloud Storage, or other paid storage to reduce costs.' },
      { title: 'Mobile app assets', description: 'Compress images before including them in mobile app bundles to reduce download size and app storage requirements.' },
    ],
    faqs: [
      { question: 'What is the difference between lossy and lossless compression?', answer: 'Lossy compression permanently removes some image data to achieve smaller file sizes — JPG and WebP use lossy compression. The removed data is generally imperceptible at quality levels above 70%. Lossless compression (used for PNG) reduces file size without removing any image data, but achieves less size reduction than lossy methods.' },
      { question: 'What quality level should I use?', answer: 'For photographs and complex images on the web: 75-85% quality. For images with text, logos, or sharp edges: 85-95% to avoid visible artefacts. For thumbnails and small images: 60-75%. Compare the original and compressed preview before downloading — trust your eyes over the number.' },
      { question: 'How much can I expect images to compress?', answer: 'JPG and WebP images straight from a camera or design tool compress by 50-80% at 80% quality with no visible quality loss. Already-compressed images (screenshots, downloaded web images) compress much less since most data was already removed. PNG compression depends heavily on image content.' },
      { question: 'Does compression reduce image dimensions?', answer: 'No. This tool only reduces file size, not pixel dimensions. If you also need to reduce the width or height of the image, use the Image Resizer first, then compress. Resizing usually has a larger impact on file size than quality compression alone.' },
      { question: 'Are my images safe to compress here?', answer: 'Yes. All compression happens in your browser using the Canvas API. Your images never leave your device and are not stored or transmitted anywhere. This is safe for compressing confidential or proprietary images.' },
    ],
    trustNote: 'All compression runs in your browser — your images are never uploaded to any server.',
  },

  'random-password-generator': {
    howToUse: {
      steps: [
        'Set your desired password length using the slider or input field.',
        'Select the character types to include: uppercase, lowercase, numbers, and/or symbols.',
        'Click "Generate Password" to create a new random password.',
        'Copy the password using the Copy button — then store it in a password manager.',
      ],
    },
    expandedDescription: [
      'A strong password is the first line of defence for any account. This free password generator creates cryptographically random passwords using the Web Crypto API, which is the same standard used by security-focused applications to generate tokens and keys.',
      'Strong passwords should be at least 12 characters long and include a mix of uppercase letters, lowercase letters, numbers, and symbols. The generator defaults to settings that produce passwords that meet most platform requirements and pass common password strength checks.',
      'Human-chosen passwords are predictable — people reuse words, names, and patterns. A randomly generated password has no pattern, making it immune to dictionary attacks, credential stuffing, and guessing. The longer and more varied the character set, the more combinations an attacker must try.',
      'Always store generated passwords in a reputable password manager (1Password, Bitwarden, Dashlane) rather than writing them down or reusing them. This tool generates the password client-side — it is never transmitted, logged, or stored anywhere.',
    ],
    useCases: [
      { title: 'Account registration', description: 'Generate strong, unique passwords for every new account to prevent credential stuffing attacks if one site is breached.' },
      { title: 'Password manager seeding', description: 'Generate passwords to store in 1Password, Bitwarden, or another password manager for all your accounts.' },
      { title: 'API keys and tokens', description: 'Generate random strings for use as API keys, webhook secrets, session tokens, and other authentication values.' },
      { title: 'Database passwords', description: 'Create strong passwords for database users, service accounts, and application credentials.' },
      { title: 'WiFi network passwords', description: 'Generate a strong WiFi password to replace the default router password or share with guests.' },
      { title: 'Temporary access credentials', description: 'Generate one-time passwords to share temporary access to systems, resetting after use.' },
    ],
    faqs: [
      { question: 'How secure are the generated passwords?', answer: 'Very secure. Passwords are generated using window.crypto.getRandomValues(), the browser\'s cryptographically secure random number generator. This produces true randomness with no predictable pattern. A 16-character password using all character types has approximately 95¹⁶ possible combinations — trillions of years to brute force.' },
      { question: 'Are my generated passwords stored anywhere?', answer: 'No. Password generation happens entirely in your browser using JavaScript. The password is displayed on screen and never sent to any server, stored in a database, or logged. Once you close the browser tab, the password is gone unless you copied it.' },
      { question: 'What makes a password strong?', answer: 'Length is the most important factor — each additional character multiplies the number of possible combinations. Character variety adds further strength: a 12-character password using uppercase, lowercase, numbers, and symbols has more possible combinations than a 20-character password using only lowercase letters.' },
      { question: 'How long should my password be?', answer: 'The minimum recommended length is 12 characters. For sensitive accounts (banking, email, work systems), use 16-20 characters. For most other accounts, 12-16 characters with mixed character types provides excellent security. Some platforms have maximum length limits — check before generating.' },
      { question: 'Should I use symbols in passwords?', answer: 'Yes, if the platform allows it. Symbols dramatically increase the character set size. With lowercase only (26 chars), each position has 26 possibilities. With uppercase, lowercase, numbers, and symbols (~95 chars), each position has 95 possibilities — a 12-character password becomes orders of magnitude harder to crack.' },
      { question: 'What is the difference between a password and a passphrase?', answer: 'A password is a random string of characters. A passphrase is a sequence of random words (e.g., "correct-horse-battery-staple"). Passphrases are often easier to remember while still being very strong. For accounts where you need to type the password without a manager, a passphrase may be more practical than a random string.' },
    ],
    trustNote: 'Passwords are generated in your browser using the Web Crypto API — they are never sent to any server.',
  },

  'case-converter': {
    howToUse: {
      steps: [
        'Type or paste your text into the input field.',
        'Click the case format button you want: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, or kebab-case.',
        'The converted text appears instantly in the output field.',
        'Copy the result with the Copy button.',
      ],
    },
    expandedDescription: [
      'Text case conversion is a frequent need for developers, writers, and content creators. Whether you need to normalise database column names to snake_case, convert a title to Title Case for a heading, or prepare a variable name in camelCase, this tool handles all common case formats instantly.',
      'This free case converter supports all the formats developers and writers regularly need: UPPERCASE for constants and emphasis, lowercase for normalisation, Title Case for headings and titles, Sentence case for body text, camelCase for JavaScript variables, snake_case for Python variables and database columns, and kebab-case for URL slugs and CSS class names.',
      'The conversion is non-destructive — you can convert back and forth between formats without losing information (with the exception of formats like all-uppercase where the original mixed case cannot be recovered). The input text is never permanently changed.',
    ],
    useCases: [
      { title: 'Variable and function naming', description: 'Convert descriptive names to camelCase for JavaScript, snake_case for Python, or PascalCase for class names.' },
      { title: 'Database column naming', description: 'Convert column names to snake_case to follow database naming conventions for PostgreSQL and MySQL.' },
      { title: 'URL slug creation', description: 'Convert article titles to kebab-case for clean, readable URL slugs.' },
      { title: 'Heading and title formatting', description: 'Convert draft headings to Title Case for consistent capitalisation across a document or site.' },
      { title: 'Normalising user input', description: 'Convert names and addresses to consistent case formats before storing in a database.' },
      { title: 'Fixing ALL CAPS text', description: 'Convert text typed in all caps (accidentally left on with Caps Lock) to normal sentence case.' },
    ],
    faqs: [
      { question: 'What is camelCase?', answer: 'camelCase writes compound words with no spaces, with each word after the first capitalised: myVariableName. It is the standard naming convention for variables and functions in JavaScript, Java, and many other languages. The name comes from the "humps" created by the capital letters.' },
      { question: 'What is snake_case?', answer: 'snake_case writes compound words in lowercase with underscores between words: my_variable_name. It is the standard convention for Python variables, functions, and database column names. It is easy to read and widely used in data engineering and backend development.' },
      { question: 'What is kebab-case?', answer: 'kebab-case writes words in lowercase separated by hyphens: my-variable-name. It is used for URL slugs, CSS class names, HTML attributes, and file names. It is called kebab-case because the hyphens look like skewers.' },
      { question: 'What is Title Case?', answer: 'Title Case capitalises the first letter of each major word. Typically, articles (a, an, the), short prepositions (in, on, at), and short conjunctions (and, but, or) are not capitalised unless they are the first or last word. Used for article headings, page titles, and book titles.' },
      { question: 'What is PascalCase?', answer: 'PascalCase is like camelCase but the first letter is also capitalised: MyClassName. It is the standard naming convention for classes in Java, C#, TypeScript, and many other object-oriented languages. Also called UpperCamelCase.' },
    ],
    trustNote: 'All text processing runs in your browser — your text is never sent to any server.',
  },

  'lorem-ipsum-generator': {
    howToUse: {
      steps: [
        'Select how much placeholder text you need: by paragraphs, sentences, or words.',
        'Enter the quantity you want.',
        'Click "Generate" to create the Lorem Ipsum text.',
        'Copy the generated text and paste it into your design, template, or document.',
      ],
    },
    expandedDescription: [
      'Lorem Ipsum is the standard placeholder text used in graphic design, web development, and publishing to fill spaces where real content will eventually go. It has been used since the 1500s and became the de facto standard placeholder text for the digital age.',
      'Using placeholder text lets designers focus on layout, typography, and visual balance without being distracted by meaningful content. It also prevents clients from focusing on the words instead of the design during review stages.',
      'The standard Lorem Ipsum passage begins with "Lorem ipsum dolor sit amet, consectetur adipiscing elit..." — a scrambled excerpt from "de Finibus Bonorum et Malorum" by Cicero, written in 45 BC. The scrambling makes it look plausible at a glance while being unreadable as Latin.',
      'This generator lets you produce exactly the amount of placeholder text you need — specific paragraph counts for document layouts, sentence counts for UI components, or word counts for character-limited fields.',
    ],
    useCases: [
      { title: 'Website and app prototyping', description: 'Fill text areas, cards, and content sections with placeholder text to show realistic layout density during design reviews.' },
      { title: 'Email template design', description: 'Populate email templates with body text to show how the layout handles different content lengths.' },
      { title: 'UI component development', description: 'Test how components handle overflow, line wrapping, and truncation by filling them with varying amounts of placeholder text.' },
      { title: 'Print and publication layouts', description: 'Use Lorem Ipsum in InDesign, Figma, or other design tools to establish typographic rhythm before final copy is ready.' },
      { title: 'Database seeding', description: 'Generate placeholder text to populate description fields in development and testing databases.' },
      { title: 'Presentation slides', description: 'Fill presentation slide body areas with placeholder text to show the template design before writing the actual content.' },
    ],
    faqs: [
      { question: 'What does Lorem Ipsum mean?', answer: 'Lorem Ipsum is derived from a passage in Cicero\'s "de Finibus Bonorum et Malorum" (On the Ends of Good and Evil), written in 45 BC. The text has been scrambled and portions removed to make it meaningless but readable-looking. "Lorem ipsum" itself is a corruption of "dolorem ipsum" meaning "pain itself".' },
      { question: 'Why use Lorem Ipsum instead of real text?', answer: 'Placeholder text prevents distraction during design review. When real content is used, people read it and comment on the words instead of evaluating the design. Lorem Ipsum is recognisable as a placeholder, signals that real content will replace it, and has no emotional or political connotations.' },
      { question: 'Can I use Lorem Ipsum in a live website?', answer: 'No. Lorem Ipsum is intended only for design mockups and prototypes. A live website with Lorem Ipsum text looks unfinished and unprofessional. Search engines also cannot index meaningful content from it. Always replace placeholder text with real content before publishing.' },
      { question: 'What is a paragraph of Lorem Ipsum?', answer: 'There is no fixed definition, but a typical Lorem Ipsum paragraph contains 5-8 sentences, which is roughly 75-100 words. This approximates the density of typical body copy paragraphs in web articles and documents.' },
    ],
    trustNote: 'Text generation runs entirely in your browser — nothing is sent to any server.',
  },

  'color-converter': {
    howToUse: {
      steps: [
        'Enter a color value in any supported format: HEX (#ff6600), RGB (255, 102, 0), or HSL (24, 100%, 50%).',
        'The tool instantly converts and displays the equivalent in all other formats.',
        'Click the color swatch to use a visual color picker.',
        'Copy any format using the Copy button next to each value.',
      ],
    },
    expandedDescription: [
      'Web and graphic designers work with colour in multiple formats depending on the context: HEX codes in CSS and HTML, RGB values in design tools and some CSS properties, HSL for programmatic colour manipulation, and HSV for some design applications. Converting between them manually is error-prone and slow.',
      'This free colour converter instantly shows the equivalent of any colour in HEX, RGB, HSL, and HSV formats simultaneously. Enter a value in any format and all the others update immediately.',
      'HEX is the most common format in web development — a 6-character code like #FF6600 representing red, green, and blue as hexadecimal pairs. RGB uses decimal values from 0-255 for each channel. HSL (Hue, Saturation, Lightness) is more intuitive for creating colour variations — adjusting the lightness value makes a colour lighter or darker without changing the hue.',
    ],
    useCases: [
      { title: 'CSS colour values', description: 'Convert design tool RGB or HSL colours to HEX for use in CSS stylesheets and Tailwind configuration files.' },
      { title: 'Design system consistency', description: 'Verify that colours in different formats across design files and code are actually the same colour value.' },
      { title: 'Creating colour variations', description: 'Use HSL conversion to create lighter and darker variants of a brand colour by adjusting the lightness value.' },
      { title: 'Accessibility contrast checking', description: 'Convert colours to RGB to calculate luminance values for WCAG accessibility contrast ratio calculations.' },
      { title: 'Brand colour documentation', description: 'Document brand colours in all formats so developers and designers can use whichever format their tool requires.' },
    ],
    faqs: [
      { question: 'What is the difference between HEX, RGB, and HSL?', answer: 'HEX represents colours as a 6-digit hexadecimal number (#RRGGBB), where each pair controls red, green, and blue intensity. RGB uses decimal numbers 0-255 for the same three channels. HSL represents colour as Hue (0-360°, the colour wheel position), Saturation (0-100%, colour intensity), and Lightness (0-100%, from black to white). All three describe the same colour space — just in different formats.' },
      { question: 'What is HSL and why is it useful?', answer: 'HSL (Hue, Saturation, Lightness) is designed to be more intuitive than RGB. To create a lighter version of a colour, increase the Lightness value. To create a less saturated (greyer) version, decrease Saturation. To rotate to a related hue, adjust the Hue value. This makes HSL much easier to work with programmatically for generating colour palettes.' },
      { question: 'What does the alpha/opacity channel do?', answer: 'The alpha channel controls transparency. In CSS, rgba(255, 0, 0, 0.5) is a red that is 50% transparent. HEX supports an 8-digit format (#RRGGBBAA) for alpha. HSL has the HSLA variant. An alpha of 1.0 is fully opaque; 0.0 is fully transparent.' },
    ],
    trustNote: 'All colour conversion runs in your browser — nothing is sent to any server.',
  },

  // ─────────────────────────────────────────────────────────────────
  // DEVELOPER TOOLS — remaining
  // ─────────────────────────────────────────────────────────────────

  'csv-to-json': {
    howToUse: {
      steps: [
        'Paste your CSV data into the input field, or click "Load Example" to try sample data.',
        'Ensure the first row contains your column headers — these become the JSON keys.',
        'Click "Convert" to instantly generate the JSON output.',
        'Copy the result or download it as a .json file.',
      ],
    },
    expandedDescription: [
      'CSV (Comma-Separated Values) is the most common format for tabular data exports from spreadsheets, databases, and analytics tools. JSON is the standard format for APIs, web applications, and modern data pipelines. Converting between them is a daily task for developers, data analysts, and anyone working with data.',
      'This free CSV to JSON converter transforms any CSV data into a clean JSON array of objects, using the first row of your CSV as the property keys. Each subsequent row becomes a JSON object in the output array.',
      'The converter handles common CSV edge cases including values that contain commas (wrapped in quotes), multi-line values, and different line ending formats (Windows CRLF and Unix LF). It works with exports from Excel, Google Sheets, MySQL, PostgreSQL, and any other CSV-producing tool.',
      'All conversion runs in your browser — your data is never sent to any server. This makes it safe to convert sensitive business data, personally identifiable information, and confidential records.',
    ],
    useCases: [
      { title: 'Importing spreadsheet data to APIs', description: 'Convert Excel or Google Sheets exports to JSON before sending data to a REST API or storing it in a document database like MongoDB.' },
      { title: 'Database migration', description: 'Convert CSV database exports to JSON format for importing into NoSQL databases, Elasticsearch, or modern data warehouses.' },
      { title: 'Front-end development', description: 'Convert CSV data files to JSON arrays to use as static data in React, Vue, or Angular applications without a backend.' },
      { title: 'Data pipeline transformation', description: 'Transform CSV outputs from analytics tools, CRMs, or payment processors into JSON for downstream processing.' },
      { title: 'API response mocking', description: 'Convert sample CSV data into JSON to create realistic mock API responses for front-end development and testing.' },
      { title: 'Configuration file creation', description: 'Convert tabular configuration data maintained in spreadsheets to JSON config files for applications.' },
    ],
    faqs: [
      { question: 'What is CSV format?', answer: 'CSV (Comma-Separated Values) is a plain text format where each line represents a row of data and values are separated by commas. The first row typically contains column headers. It is the most universal data exchange format, supported by every spreadsheet application, database, and analytics tool.' },
      { question: 'How does the converter handle commas inside values?', answer: 'Values containing commas must be wrapped in double quotes in valid CSV (e.g., "Smith, John"). The converter handles this correctly — the entire quoted value is treated as a single field, not split at the comma.' },
      { question: 'What if my CSV uses semicolons or tabs instead of commas?', answer: 'Some regional CSV exports use semicolons (common in European locales) or tabs (TSV format) as delimiters. If your file uses a different delimiter, you may need to find-and-replace it before converting. Future updates will add delimiter selection.' },
      { question: 'What happens to empty cells?', answer: 'Empty cells in the CSV are converted to empty strings ("") in the JSON output. They are included as properties with empty values rather than being omitted, which preserves the data structure. You can handle null/empty values in your application after conversion.' },
      { question: 'Can I convert a CSV file directly without pasting?', answer: 'Currently the tool works by pasting CSV text. To convert a file, open it in a text editor (or Excel → Save As → CSV), select all the text, paste it into the tool, and convert. Direct file upload may be added in future.' },
      { question: 'What is the output JSON structure?', answer: 'The output is a JSON array of objects. Each object represents one CSV row, with keys taken from the header row and values from that row\'s cells. For example, a CSV with columns "name,age" produces [{"name":"Alice","age":"30"},{"name":"Bob","age":"25"}].' },
      { question: 'Are all values strings in the output?', answer: 'By default, all values are output as strings. If you need numbers, booleans, or null values, you will need to post-process the JSON in your application. This is intentional — the converter cannot reliably infer data types without explicit instructions.' },
    ],
    trustNote: 'All conversion runs in your browser — your data is never sent to any server.',
  },

  'json-to-csv': {
    howToUse: {
      steps: [
        'Paste your JSON array into the input field. The JSON must be an array of objects with consistent keys.',
        'Click "Convert" to generate the CSV output.',
        'The first row of the CSV will contain the keys from your JSON objects as column headers.',
        'Copy the CSV or download it as a .csv file to open in Excel or Google Sheets.',
      ],
    },
    expandedDescription: [
      'Converting JSON to CSV is essential when you need to analyse API response data in a spreadsheet, export application data for reporting, or prepare JSON data for tools that only accept tabular input. This converter handles the transformation instantly.',
      'The converter expects a JSON array of objects where each object has the same set of keys. The keys become CSV column headers and each object becomes a row. Nested objects are flattened where possible.',
      'This is the reverse operation of the CSV to JSON converter. Together they let you move data freely between the tabular world (spreadsheets, databases) and the structured world (APIs, web applications).',
      'All processing runs in your browser — your JSON data never leaves your device, making it safe to convert sensitive or proprietary data.',
    ],
    useCases: [
      { title: 'API data to spreadsheet', description: 'Convert JSON responses from REST APIs into CSV to analyse data in Excel or Google Sheets.' },
      { title: 'Database export for reporting', description: 'Convert JSON database query results to CSV for business reports and stakeholder dashboards.' },
      { title: 'Data sharing with non-technical teams', description: 'Convert JSON data to CSV so business stakeholders can work with it in familiar spreadsheet tools.' },
      { title: 'Bulk import preparation', description: 'Convert JSON datasets to CSV format for bulk import into CRMs, email platforms, or other tools that accept CSV.' },
      { title: 'Log analysis', description: 'Convert JSON-formatted application logs to CSV for analysis in spreadsheet tools.' },
    ],
    faqs: [
      { question: 'What JSON structure does this converter accept?', answer: 'The converter expects a JSON array of objects: [{...}, {...}, ...]. Each object should have the same keys. If objects have different keys, missing values will be blank in the output. Nested objects and arrays may be serialised as strings.' },
      { question: 'Can I convert a single JSON object (not an array)?', answer: 'A single object will be converted to a two-row CSV — one header row and one data row. For multi-row output, your JSON should be an array of objects.' },
      { question: 'How are nested objects handled?', answer: 'Nested objects are typically serialised as JSON strings within the CSV cell. If you need nested data flattened into separate columns (e.g., address.city becomes a separate column), you will need to flatten the JSON first before converting.' },
      { question: 'Will the CSV open correctly in Excel?', answer: 'Yes. The output uses standard comma-separated format with double-quote escaping for values that contain commas or newlines. It is compatible with Excel, Google Sheets, LibreOffice Calc, and any other standard CSV reader.' },
      { question: 'What encoding is used for the CSV output?', answer: 'The output is UTF-8 encoded, which handles all international characters, emojis, and special symbols. If Excel shows garbled characters when opening the file, select "UTF-8" as the encoding when importing (File → Import → CSV).' },
    ],
    trustNote: 'All conversion runs in your browser — your data is never sent to any server.',
  },

  'url-encoder': {
    howToUse: {
      steps: [
        'Paste the URL or text string you want to encode into the input field.',
        'Click "Encode" to percent-encode all special characters.',
        'Copy the encoded output for use in your URL, query string, or API request.',
        'Use the companion URL Decoder to reverse the process.',
      ],
    },
    expandedDescription: [
      'URLs can only contain a limited set of characters — letters, numbers, and a few special characters. Any other character, including spaces, ampersands, equals signs, and non-ASCII characters, must be encoded as a percent sign followed by two hexadecimal digits. This process is called URL encoding or percent encoding.',
      'This free URL encoder converts any text into a URL-safe format. A space becomes %20, an ampersand becomes %26, and special characters like ü or 中 become their UTF-8 byte sequences encoded in percent format.',
      'URL encoding is required when passing data as query string parameters, constructing API request URLs programmatically, handling form submissions, and working with international characters in web addresses.',
      'There are two types of URL encoding: encoding an entire URL (which only encodes characters that are invalid in URLs) and encoding a URL component like a query parameter value (which encodes more characters, including /, ?, and &). This tool encodes components, which is the safer default for building query strings.',
    ],
    useCases: [
      { title: 'Query string parameters', description: 'Encode parameter values before appending them to URLs to prevent them from being interpreted as URL structure.' },
      { title: 'API request construction', description: 'Encode dynamic values when building API request URLs programmatically to avoid malformed URLs and 400 errors.' },
      { title: 'Search URL generation', description: 'Encode search terms for use in site search URLs — spaces and special characters must be encoded for valid URLs.' },
      { title: 'Form data handling', description: 'Encode form field values for use in GET request URLs or for manual construction of application/x-www-form-urlencoded payloads.' },
      { title: 'Internationalised URLs', description: 'Encode non-ASCII characters (Chinese, Arabic, accented Latin characters) for use in URLs that must be ASCII-safe.' },
      { title: 'OAuth and authentication', description: 'Encode redirect URIs, state parameters, and other OAuth values that are passed as URL query parameters.' },
    ],
    faqs: [
      { question: 'What is URL encoding?', answer: 'URL encoding (also called percent encoding) converts characters that are not allowed in URLs into a safe format. Each disallowed character is replaced by a percent sign followed by two hexadecimal digits representing the character\'s UTF-8 byte value. For example, a space becomes %20 and an ampersand becomes %26.' },
      { question: 'What is the difference between encodeURI and encodeURIComponent?', answer: 'encodeURI encodes a complete URL — it does not encode characters that have special meaning in URLs like /, ?, #, and &. encodeURIComponent encodes a URL component (like a single query parameter value) — it encodes those special characters too. Use encodeURIComponent when encoding values that will appear as query parameters.' },
      { question: 'Why does a space become %20 and not +?', answer: 'Both %20 and + represent a space in URLs, but in different contexts. %20 is the standard percent-encoding and works everywhere. + is only valid for spaces in application/x-www-form-urlencoded format (HTML form submissions). For query parameters in general URL construction, %20 is more universal and correct.' },
      { question: 'Do I need to encode the entire URL or just parts of it?', answer: 'Only encode the component parts of a URL — specifically query parameter values and path segments that contain special characters. Do not encode the entire URL including the https://, domain, and slashes, as that will break the URL structure.' },
      { question: 'What characters do not need encoding?', answer: 'The "unreserved characters" are safe in URLs without encoding: A-Z, a-z, 0-9, hyphen (-), underscore (_), period (.), and tilde (~). Everything else, including spaces, !, @, #, $, %, ^, &, *, (, ), +, =, should be encoded in component values.' },
    ],
    trustNote: 'All encoding runs in your browser — your data is never sent to any server.',
  },

  'url-decoder': {
    howToUse: {
      steps: [
        'Paste the percent-encoded URL or URL component into the input field.',
        'Click "Decode" to convert %XX sequences back to their original characters.',
        'Copy the decoded output for reading or editing.',
        'Use the companion URL Encoder to re-encode if needed.',
      ],
    },
    expandedDescription: [
      'Percent-encoded URLs replace special characters with %XX sequences, making them unreadable at a glance. This URL decoder reverses the process, converting %20 back to spaces, %26 back to ampersands, and all other encoded sequences back to their original characters.',
      'URL decoding is essential when debugging web applications, reading API request logs, inspecting redirect chains, and understanding complex query strings. Encoded URLs in browser network tabs, server logs, and error messages become immediately readable after decoding.',
      'The decoder handles both standard percent encoding and the + sign as a space (used in HTML form submissions). It correctly decodes UTF-8 encoded multi-byte sequences for international characters.',
    ],
    useCases: [
      { title: 'Debugging API requests', description: 'Decode logged API request URLs to read the actual parameter values being sent.' },
      { title: 'Reading redirect chains', description: 'Decode redirect URLs in browser network tabs or server logs to understand where requests are being directed.' },
      { title: 'Analysing form submissions', description: 'Decode application/x-www-form-urlencoded form data to read the values submitted in POST requests.' },
      { title: 'Reading complex query strings', description: 'Decode multi-parameter query strings from analytics tools, ad platforms, and tracking URLs to understand the parameters.' },
      { title: 'International URL inspection', description: 'Decode URLs containing international characters to read the original non-ASCII text.' },
    ],
    faqs: [
      { question: 'What is URL decoding?', answer: 'URL decoding reverses percent encoding, converting %XX sequences back to the original characters. %20 becomes a space, %26 becomes &, %3D becomes =, and so on. It is the inverse operation of URL encoding.' },
      { question: 'What does %20 mean?', answer: '%20 is the percent-encoded representation of a space character. The 20 is the hexadecimal ASCII code for space (32 in decimal). You will see %20 in URLs wherever a space would appear in the unencoded text.' },
      { question: 'Why does + decode to a space?', answer: 'In HTML form data (application/x-www-form-urlencoded format), a + sign represents a space. This is a legacy convention from early web forms. This decoder handles both %20 and + as spaces, depending on context.' },
      { question: 'What if my URL contains multiple encoding layers?', answer: 'Sometimes URLs are double-encoded — a % sign is itself encoded as %25, producing sequences like %2520 for an originally encoded space. Run the decoder twice on double-encoded URLs to fully decode them.' },
      { question: 'Is decoding URLs safe?', answer: 'Decoding is a read-only transformation — it does not execute anything or affect any system. It is completely safe to decode any URL to inspect its contents.' },
    ],
    trustNote: 'All decoding runs in your browser — your data is never sent to any server.',
  },

  'jwt-decoder': {
    howToUse: {
      steps: [
        'Paste your JWT token into the input field — it should look like three base64url strings separated by dots.',
        'The decoder automatically splits and decodes all three parts: header, payload, and signature.',
        'Read the payload section to inspect claims like user ID, roles, expiry (exp), and issue time (iat).',
        'The signature section shows the raw signature bytes — verification requires the secret key, which this tool does not perform.',
      ],
    },
    expandedDescription: [
      'A JSON Web Token (JWT) is a compact, URL-safe token format used for authentication and information exchange in web applications. JWTs are issued by authentication servers and sent with API requests to prove identity. They consist of three Base64URL-encoded parts separated by dots: a header, a payload, and a signature.',
      'This free JWT decoder splits and decodes all three parts of any JWT token, making the claims and metadata immediately readable. You can inspect the user ID, roles, permissions, expiry time, issuer, and any other claims embedded in the token without needing the signing secret.',
      'Decoding a JWT does not verify its signature — it only shows you the contents. Any JWT can be decoded by anyone who has the token. This is by design: JWTs are not encrypted by default, they are just signed. Sensitive data should not be stored in JWT payloads unless the token is also encrypted (JWE).',
      'JWT debugging is one of the most common tasks in API development. Tokens that expire unexpectedly, contain wrong roles, or come from unexpected issuers are difficult to debug without a decoder. This tool makes that inspection instant.',
    ],
    useCases: [
      { title: 'Debugging authentication issues', description: 'Decode JWTs from failed API requests to inspect the claims and understand why authentication is failing.' },
      { title: 'Checking token expiry', description: 'Decode the exp claim (a Unix timestamp) to see exactly when a token expires and compare with the current time.' },
      { title: 'Inspecting user roles and permissions', description: 'Read the roles, scope, or permissions claims in a JWT to debug authorisation issues in API endpoints.' },
      { title: 'Verifying token issuer', description: 'Check the iss (issuer) claim to confirm tokens are coming from the expected authentication server.' },
      { title: 'Understanding OAuth tokens', description: 'Decode access tokens and ID tokens from OAuth 2.0 and OpenID Connect flows to understand their structure and claims.' },
      { title: 'API integration debugging', description: 'Decode JWTs received from third-party APIs to understand what information the provider is sending about the authenticated user.' },
    ],
    faqs: [
      { question: 'What is a JWT?', answer: 'A JSON Web Token (JWT) is a compact token format defined by RFC 7519. It consists of three Base64URL-encoded JSON objects separated by dots: a header (algorithm and token type), a payload (claims — data about the user or session), and a signature (cryptographic proof of authenticity). They are widely used for stateless authentication in web APIs.' },
      { question: 'What is the difference between decoding and verifying a JWT?', answer: 'Decoding reads the contents of a JWT by Base64URL-decoding the header and payload. Anyone can do this with any JWT — no secret needed. Verifying checks that the signature is valid using the signing key, proving the token was issued by the expected authority and has not been tampered with. This tool decodes only — it does not verify signatures.' },
      { question: 'Is it safe to paste my JWT into this decoder?', answer: 'JWTs for production systems should be treated as sensitive credentials. This tool decodes entirely in your browser — your token is never sent to any server. However, be cautious about pasting production tokens into any online tool as a general security practice. For production debugging, consider using local tools or your browser\'s developer tools.' },
      { question: 'What do the standard JWT claims mean?', answer: 'Common standard claims: sub (subject — usually user ID), iss (issuer — who created the token), aud (audience — who the token is intended for), exp (expiration — Unix timestamp when the token expires), iat (issued at — when the token was created), nbf (not before — earliest valid time), jti (JWT ID — unique token identifier).' },
      { question: 'Why is the payload readable without the secret?', answer: 'JWT payloads are Base64URL encoded, not encrypted. The signature only proves authenticity — it does not hide the contents. This is intentional: servers need to read the payload to extract claims, and doing so without decryption makes JWTs efficient. For confidential payloads, use JWE (JSON Web Encryption) instead.' },
      { question: 'What algorithm does the header describe?', answer: 'The header\'s alg field specifies the signing algorithm. Common values: HS256 (HMAC-SHA256, symmetric — uses a shared secret), RS256 (RSA-SHA256, asymmetric — uses a public/private key pair), ES256 (ECDSA-SHA256, asymmetric). The typ field is typically "JWT".' },
    ],
    trustNote: 'All decoding runs in your browser — your JWT token is never sent to any server.',
  },

  'markdown-to-html': {
    howToUse: {
      steps: [
        'Type or paste your Markdown text into the input field on the left.',
        'The HTML output and rendered preview update in real time as you type.',
        'Switch between "HTML Source" and "Preview" tabs to see both the raw HTML and the rendered result.',
        'Copy the HTML output to use in your website, email template, or application.',
      ],
    },
    expandedDescription: [
      'Markdown is a lightweight markup language that lets you write formatted text using simple plain-text syntax. Pound signs for headings, asterisks for bold, hyphens for lists — it is designed to be readable as plain text and convertible to HTML for web display.',
      'This free Markdown to HTML converter transforms any Markdown document into clean, standards-compliant HTML in real time. It supports the full CommonMark specification plus GitHub Flavored Markdown (GFM) extensions, including tables, task lists, strikethrough, and fenced code blocks with syntax highlighting.',
      'Markdown is used everywhere: README files on GitHub, blog posts in static site generators, documentation in Notion and Confluence, comments in Slack and Discord, and content in headless CMS platforms. Converting to HTML makes it compatible with any web context.',
      'The rendered preview shows exactly how the HTML will look when styled, making it easy to catch formatting errors before using the output in your project.',
    ],
    useCases: [
      { title: 'README and documentation', description: 'Convert GitHub README files or documentation written in Markdown to HTML for display on websites or in web applications.' },
      { title: 'Blog post publishing', description: 'Write blog posts in Markdown and convert to HTML for publishing in CMS platforms that accept HTML input.' },
      { title: 'Email template creation', description: 'Draft email content in readable Markdown and convert to HTML for use in email marketing templates.' },
      { title: 'Static site generation', description: 'Convert Markdown content files to HTML as part of a static site build process for Jekyll, Hugo, or Eleventy.' },
      { title: 'API documentation', description: 'Convert Markdown API documentation to HTML for display in developer portals and documentation websites.' },
      { title: 'Knowledge base articles', description: 'Write knowledge base content in Markdown and convert to HTML for publishing in help centres and wikis.' },
    ],
    faqs: [
      { question: 'What is Markdown?', answer: 'Markdown is a lightweight markup language created by John Gruber in 2004. It uses plain-text formatting conventions — like # for headings, ** for bold, and - for list items — that are readable as-is and convertible to HTML. It has become the standard writing format for developers, technical writers, and content creators.' },
      { question: 'What is the difference between CommonMark and GitHub Flavored Markdown?', answer: 'CommonMark is the standardised Markdown specification with unambiguous rules. GitHub Flavored Markdown (GFM) is a superset that adds tables, task lists (- [ ]), strikethrough (~~text~~), autolinked URLs, and fenced code blocks with language identifiers. This converter supports both.' },
      { question: 'How do I create a table in Markdown?', answer: 'Use pipes and hyphens: | Column 1 | Column 2 | on the first row, then | --- | --- | as the separator row, then data rows. For example: | Name | Age |\n| --- | --- |\n| Alice | 30 |' },
      { question: 'How do I add syntax highlighting to code blocks?', answer: 'Use fenced code blocks with a language identifier: ```javascript followed by your code and a closing ```. Supported languages include javascript, python, bash, html, css, sql, json, and many others.' },
      { question: 'Does the converter handle images?', answer: 'Yes. Markdown image syntax ![alt text](image-url) is converted to HTML <img> tags. Note that the images must be hosted somewhere accessible — the converter only produces the HTML markup, it does not host or process the images themselves.' },
      { question: 'Can I convert HTML back to Markdown?', answer: 'Not with this tool — this converter is one-directional, Markdown to HTML only. Converting HTML back to Markdown (called "reverse Markdown" or "turndown") requires a different tool as the process is more complex.' },
    ],
    trustNote: 'All conversion runs in your browser — your Markdown is never sent to any server.',
  },

  'html-formatter': {
    howToUse: {
      steps: [
        'Paste your minified or messy HTML into the input field.',
        'Click "Format HTML" to instantly beautify it with consistent indentation.',
        'Review the formatted output — nesting is visually clear and each tag is on its own line.',
        'Copy the formatted HTML or download it.',
      ],
    },
    expandedDescription: [
      'Minified HTML is compact and fast for browsers to parse but unreadable for humans. Build processes, CDNs, and web scrapers often produce HTML without whitespace or indentation. This formatter restores human-readable structure with proper nesting and indentation.',
      'This free HTML formatter takes any HTML input — minified, scraped, or just messily written — and outputs cleanly indented HTML with each element on its own line and consistent 2-space indentation for nested elements.',
      'Formatted HTML is essential for debugging layout issues, reviewing scraped page source, understanding third-party HTML structures, and maintaining code quality in HTML templates. The visual hierarchy of properly indented HTML makes the document structure immediately obvious.',
    ],
    useCases: [
      { title: 'Debugging minified HTML', description: 'Format minified HTML from production builds to understand the structure and debug rendering issues.' },
      { title: 'Web scraping analysis', description: 'Format scraped HTML to understand the page structure before writing selectors for data extraction.' },
      { title: 'Email template development', description: 'Format complex HTML email templates that have been compressed for delivery to make them editable.' },
      { title: 'Code review', description: 'Format submitted HTML code before reviewing to ensure consistent indentation and readable structure.' },
      { title: 'CMS output inspection', description: 'Format HTML generated by CMS WYSIWYG editors to review and clean up the markup.' },
    ],
    faqs: [
      { question: 'What indentation does the formatter use?', answer: 'The formatter uses 2-space indentation by default, which is the most common convention in web development. Each level of HTML nesting adds 2 spaces of indentation.' },
      { question: 'Does formatting change how the HTML renders in a browser?', answer: 'No. Whitespace between HTML elements is generally insignificant in browsers. The formatted HTML renders identically to the minified version. The only exception is text inside <pre> tags, where whitespace is preserved as-is.' },
      { question: 'Does the formatter validate HTML?', answer: 'The formatter processes HTML as-is and does not validate it against HTML standards. Invalid or unclosed tags will be formatted as they appear. For HTML validation, use the W3C Markup Validation Service.' },
      { question: 'Can I format HTML fragments (not full documents)?', answer: 'Yes. The formatter works on any HTML input — complete documents with <!DOCTYPE> and <html>, partial templates, or individual component snippets.' },
    ],
    trustNote: 'All formatting runs in your browser — your HTML is never sent to any server.',
  },

  'sql-formatter': {
    howToUse: {
      steps: [
        'Paste your SQL query into the input field — minified, single-line, or just poorly formatted.',
        'Select your SQL dialect if needed (MySQL, PostgreSQL, standard SQL).',
        'Click "Format SQL" to instantly beautify it with consistent indentation and keyword casing.',
        'Copy the formatted query to use in your editor or database tool.',
      ],
    },
    expandedDescription: [
      'SQL queries become hard to read when written on a single line, generated by ORMs, or copied from logs. Proper formatting with indentation, line breaks after clauses, and consistent keyword casing makes complex queries understandable at a glance.',
      'This free SQL formatter applies consistent formatting rules: keywords (SELECT, FROM, WHERE, JOIN, etc.) are uppercased, each major clause starts on a new line, and subqueries and CASE expressions are properly indented. The result is immediately readable SQL regardless of how messy the input was.',
      'Well-formatted SQL is essential for code review, documentation, query optimisation, and debugging. When you can clearly see the JOIN conditions, WHERE filters, and subquery structure, logical errors and performance issues become much easier to spot.',
      'The formatter supports standard SQL, MySQL, PostgreSQL, SQL Server, and SQLite syntax. Common dialect-specific keywords and functions are recognised and formatted correctly.',
    ],
    useCases: [
      { title: 'ORM query debugging', description: 'Format raw SQL generated by ORMs like Hibernate, SQLAlchemy, or ActiveRecord to understand and optimise the generated queries.' },
      { title: 'Log analysis', description: 'Format SQL queries captured in slow query logs or application logs to understand what queries are being executed.' },
      { title: 'Code review', description: 'Format SQL before reviewing to ensure consistent style and make logic errors visible.' },
      { title: 'Documentation', description: 'Format SQL queries before including them in documentation, runbooks, or README files.' },
      { title: 'Query optimisation', description: 'Format complex queries with multiple JOINs and subqueries to understand the execution path and identify optimisation opportunities.' },
      { title: 'Migration script writing', description: 'Format SQL in database migration scripts for consistency and readability across the team.' },
    ],
    faqs: [
      { question: 'What SQL dialects does this support?', answer: 'The formatter supports standard SQL and the most common dialects: MySQL, PostgreSQL, SQL Server (T-SQL), SQLite, and Oracle. Dialect-specific keywords, functions, and syntax variations are handled correctly for each.' },
      { question: 'Does formatting change how the SQL executes?', answer: 'No. SQL ignores whitespace (outside of string literals). Formatted and minified versions of the same query execute identically and produce the same results.' },
      { question: 'Does the formatter validate SQL syntax?', answer: 'The formatter processes SQL structurally but does not fully validate it against a specific database\'s syntax rules. Formatting will succeed even for queries with minor syntax errors. For syntax validation, run the query against your actual database.' },
      { question: 'How are keywords cased?', answer: 'SQL keywords (SELECT, FROM, WHERE, JOIN, GROUP BY, etc.) are uppercased by default. Identifiers (table names, column names) keep their original casing. This follows the most widely-used SQL style convention.' },
      { question: 'Can I format stored procedures and functions?', answer: 'Yes. The formatter handles multi-statement SQL including stored procedures, functions, triggers, and other DDL statements. Each statement is formatted independently.' },
    ],
    trustNote: 'All formatting runs in your browser — your SQL is never sent to any server.',
  },

  // ─────────────────────────────────────────────────────────────────
  // TEXT TOOLS — remaining
  // ─────────────────────────────────────────────────────────────────

  'character-counter': {
    howToUse: {
      steps: [
        'Type or paste your text into the input area.',
        'Character counts update instantly — no button press needed.',
        'See characters with spaces and characters without spaces side by side.',
        'Clear the field to analyse new text.',
      ],
    },
    expandedDescription: [
      'Character counting is essential for any platform with strict character limits. Twitter/X posts, SMS messages, meta descriptions, database field lengths, and many form fields have specific character limits that, when exceeded, cause truncation or rejection.',
      'This free character counter tracks characters with spaces and without spaces simultaneously. Characters without spaces is the relevant metric for most character-limited fields, as spaces still count toward the limit in social media and SMS contexts.',
      'The distinction between character count and word count matters for different use cases: social media platforms use character limits, while academic and professional writing uses word counts. This tool shows both.',
    ],
    useCases: [
      { title: 'Twitter/X posts', description: 'Keep posts within the 280-character limit — characters with spaces is the relevant count for Twitter.' },
      { title: 'SMS messages', description: 'Standard SMS allows 160 characters per message. Messages over this limit are split and may cost more to send.' },
      { title: 'Meta descriptions', description: 'Google displays approximately 155-160 characters of meta description text in search results. Check your draft before adding it to your site.' },
      { title: 'Database field planning', description: 'Count characters in sample data to determine appropriate VARCHAR or CHAR field lengths for database schema design.' },
      { title: 'Password length verification', description: 'Check that passwords or keys meet minimum character length requirements for security policies.' },
      { title: 'Form field validation', description: 'Verify that text content meets the minimum and maximum character requirements for input fields.' },
    ],
    faqs: [
      { question: 'What is the difference between characters with and without spaces?', answer: 'Characters with spaces counts every character in the text including spaces. Characters without spaces counts only non-space characters. For most character-limited platforms (Twitter, SMS, meta descriptions), the "with spaces" count is what matters — spaces do count toward the limit.' },
      { question: 'How many characters are in a tweet?', answer: 'Twitter/X allows 280 characters per tweet for most accounts. URLs always count as 23 characters regardless of actual length. Line breaks count as characters. Emojis may count as 1 or 2 characters depending on the emoji.' },
      { question: 'What is the character limit for an SMS?', answer: 'A standard SMS using GSM-7 encoding allows 160 characters. If the message contains any non-GSM characters (emojis, most non-Latin characters), it switches to UCS-2 encoding and the limit drops to 70 characters. Messages over the limit are split into multiple SMS.' },
      { question: 'How many characters should a meta description be?', answer: 'Google typically displays 155-160 characters of meta description in search results before truncating with "...". Write meta descriptions between 120-160 characters to ensure the full text shows in most search contexts.' },
    ],
    trustNote: 'Your text stays in your browser — it is never sent to any server.',
  },

  'sentence-counter': {
    howToUse: {
      steps: [
        'Paste or type your text into the input area.',
        'The sentence count updates instantly.',
        'Also see word count and paragraph count in the same view.',
        'Use the results to assess text length and readability.',
      ],
    },
    expandedDescription: [
      'Sentence counting is useful for assessing text complexity, calculating average sentence length, and checking readability. Short sentences are easier to read. Academic writing, legal documents, and technical writing often need to be checked for overly long or complex sentence structures.',
      'Sentences are counted by detecting sentence-ending punctuation: periods, exclamation marks, and question marks. The counter handles common edge cases like abbreviations (Mr., U.S.A., etc.) and ellipses reasonably well.',
      'Average sentence length is a key readability metric. The Flesch-Kincaid readability formula uses sentence length as a primary input. Most readability guides recommend keeping average sentence length under 20 words for web content aimed at general audiences.',
    ],
    useCases: [
      { title: 'Readability assessment', description: 'Count sentences alongside words to calculate average sentence length — a primary readability metric.' },
      { title: 'Academic writing analysis', description: 'Check whether an essay or paper meets minimum or maximum sentence count requirements.' },
      { title: 'Content editing', description: 'Identify sections with too many long sentences that should be split for better readability.' },
      { title: 'Automated text analysis', description: 'Use sentence count as a structural metric when analysing or comparing documents.' },
    ],
    faqs: [
      { question: 'How are sentences counted?', answer: 'Sentences are counted by detecting sentence-ending punctuation: periods (.), exclamation marks (!), and question marks (?). The counter attempts to handle common abbreviations like "Mr.", "U.S.A.", and "etc." to avoid overcounting, but complex cases may occasionally produce slight inaccuracies.' },
      { question: 'What is a good average sentence length?', answer: 'For general web content: 15-20 words per sentence. For academic writing: up to 25 words. For simplified or plain language content: under 15 words. The Hemingway Editor recommends sentences under 14 words as "easy to read" and flags sentences over 30 words as very difficult.' },
      { question: 'Does punctuation inside quotes count as sentence endings?', answer: 'Punctuation inside quotation marks at the end of a sentence (e.g., He said, "Stop!") is handled correctly — it counts as the sentence-ending punctuation. Mid-sentence quotations with exclamation marks or question marks inside may occasionally be double-counted.' },
    ],
    trustNote: 'Your text stays in your browser — it is never sent to any server.',
  },

  'paragraph-counter': {
    howToUse: {
      steps: [
        'Paste or type your text into the input area.',
        'Paragraph count updates instantly based on blank line detection.',
        'Use alongside word count to assess document structure.',
      ],
    },
    expandedDescription: [
      'Paragraphs are counted by detecting blocks of text separated by blank lines. This matches how paragraphs are structured in plain text and Markdown — each block of consecutive non-empty lines is one paragraph.',
      'Paragraph count is a useful structural metric for documents, blog posts, and web content. Too few paragraphs suggests walls of text that are hard to read. Too many short paragraphs can fragment ideas that belong together.',
      'For web content, the standard guidance is to keep paragraphs to 3-5 sentences for desktop and even shorter (2-3 sentences) for mobile, where long blocks of text are harder to scan.',
    ],
    useCases: [
      { title: 'Document structure assessment', description: 'Count paragraphs alongside words to understand the overall structure and density of a document.' },
      { title: 'Content guideline compliance', description: 'Verify that content meets style guide requirements for paragraph count or average paragraph length.' },
      { title: 'Readability improvement', description: 'Identify sections with overly long paragraphs that should be broken up for better web readability.' },
    ],
    faqs: [
      { question: 'How are paragraphs counted?', answer: 'Paragraphs are counted by detecting groups of text separated by one or more blank lines. Each continuous block of non-empty lines counts as one paragraph. Single line breaks within a block do not create a new paragraph.' },
      { question: 'What is a good paragraph length for web content?', answer: 'For web content: 2-5 sentences or 50-150 words per paragraph. For mobile-first content: 2-3 sentences. Shorter paragraphs improve scannability and reduce bounce rate. Long paragraphs (over 100 words) are harder to read on screen than in print.' },
    ],
    trustNote: 'Your text stays in your browser — it is never sent to any server.',
  },

  'remove-extra-spaces': {
    howToUse: {
      steps: [
        'Paste your text with extra spaces into the input field.',
        'Click "Remove Extra Spaces" to clean it instantly.',
        'The output has single spaces between words, no leading or trailing spaces.',
        'Copy the cleaned text.',
      ],
    },
    expandedDescription: [
      'Extra whitespace creeps into text from copy-paste operations, OCR scans, text exports from PDFs, and inconsistent typing. Double spaces after periods, leading spaces on lines, and multiple spaces between words all need to be normalised before text is used in production.',
      'This tool removes leading and trailing whitespace from the entire text, collapses multiple consecutive spaces into single spaces, and optionally removes extra blank lines. It is the fastest way to clean up text that has been through multiple copy-paste operations.',
    ],
    useCases: [
      { title: 'PDF text extraction cleanup', description: 'Clean up extra spaces that appear when copying text from PDF documents, which often insert extra spaces between words.' },
      { title: 'Database import preparation', description: 'Normalise whitespace in data before importing to databases to avoid inconsistent spacing in stored values.' },
      { title: 'Content editing', description: 'Remove double spaces after periods and extra blank lines before publishing written content.' },
      { title: 'Code cleanup', description: 'Clean up string variables in code that may have been pasted with extra whitespace.' },
    ],
    faqs: [
      { question: 'What counts as an "extra" space?', answer: 'Leading spaces at the start of text, trailing spaces at the end, and any sequence of two or more consecutive spaces within the text. The tool collapses all such sequences to single spaces.' },
      { question: 'Does this also remove extra blank lines?', answer: 'Yes — multiple consecutive blank lines are collapsed to a single blank line, preserving paragraph structure while removing unnecessary vertical whitespace.' },
      { question: 'Will this affect intentional formatting?', answer: 'The tool normalises all whitespace. If your text uses multiple spaces intentionally (e.g., ASCII art or pre-formatted tables), this tool will alter that formatting. It is designed for prose text cleaning.' },
    ],
    trustNote: 'Your text stays in your browser — it is never sent to any server.',
  },

  'remove-line-breaks': {
    howToUse: {
      steps: [
        'Paste your text with unwanted line breaks into the input field.',
        'Choose to replace line breaks with spaces, or remove them entirely.',
        'Click "Remove Line Breaks" to process the text.',
        'Copy the result.',
      ],
    },
    expandedDescription: [
      'Line breaks from PDF exports, email forwarding, and text wrapping often fragment sentences across multiple lines. When you paste this text into a single-line field, email, or document, the line breaks appear as hard returns that break the flow.',
      'This tool removes hard line breaks while preserving intentional paragraph breaks (double line breaks). It is the standard fix for text that has been hard-wrapped for a specific column width and needs to flow as continuous paragraphs.',
    ],
    useCases: [
      { title: 'PDF text cleanup', description: 'Remove line breaks from text copied out of PDF documents where each line ends with a hard return.' },
      { title: 'Email forwarding cleanup', description: 'Remove the hard line breaks added by email clients when forwarding messages.' },
      { title: 'Single-line field preparation', description: 'Convert multi-line text to a single line for use in fields that do not accept line breaks.' },
      { title: 'Plain text to paragraph conversion', description: 'Convert hard-wrapped plain text (wrapped at 80 characters) to flowing paragraphs.' },
    ],
    faqs: [
      { question: 'What is a line break vs a paragraph break?', answer: 'A line break (\\n) is a single newline that starts a new line. A paragraph break is two or more consecutive newlines that create visible vertical space between blocks of text. This tool removes single line breaks within paragraphs while preserving paragraph breaks.' },
      { question: 'Why do PDFs add line breaks when copied?', answer: 'PDF documents store text as positioned glyphs on a page, not as flowing paragraphs. When you select and copy text from a PDF, the PDF reader has to reconstruct paragraph structure from visual position data. This process often inserts a hard line break at each visual line end.' },
    ],
    trustNote: 'Your text stays in your browser — it is never sent to any server.',
  },

  'text-sorter': {
    howToUse: {
      steps: [
        'Paste your list of lines into the input field — one item per line.',
        'Choose your sort order: A-Z, Z-A, by length (shortest first), by length (longest first), or random shuffle.',
        'Click "Sort" to reorder the lines.',
        'Copy the sorted output.',
      ],
    },
    expandedDescription: [
      'Sorting lines of text alphabetically, by length, or randomly is a frequent need for developers processing lists, writers organising content, and anyone working with tabular data outside a spreadsheet.',
      'This tool sorts any list of lines in multiple ways: alphabetical (A-Z and Z-A), by line length, and random shuffle. It handles case-insensitive sorting so "Apple" and "apple" are treated as equivalent when sorting alphabetically.',
    ],
    useCases: [
      { title: 'Alphabetising word lists', description: 'Sort glossaries, tag lists, category lists, and other word collections alphabetically.' },
      { title: 'Organising import lists', description: 'Sort JavaScript or Python import statements alphabetically for consistent code style.' },
      { title: 'Data preprocessing', description: 'Sort lines in data files before processing or comparing to make differences easier to spot.' },
      { title: 'Random list shuffling', description: 'Randomly shuffle a list of names, items, or tasks for random assignment or randomised ordering.' },
    ],
    faqs: [
      { question: 'Is sorting case-sensitive?', answer: 'By default, sorting is case-insensitive so "Apple" and "apple" sort together. Most use cases benefit from case-insensitive sorting. If you need case-sensitive sorting where uppercase letters come before lowercase, look for the case-sensitive option.' },
      { question: 'Does it handle numbers correctly?', answer: 'Lines starting with numbers sort lexicographically by default (1, 10, 2, 20) rather than numerically (1, 2, 10, 20). For correct numerical sorting, you would need to pad numbers with leading zeros before sorting.' },
    ],
    trustNote: 'Your text stays in your browser — it is never sent to any server.',
  },

  'duplicate-line-remover': {
    howToUse: {
      steps: [
        'Paste your text or list (with duplicates) into the input field.',
        'Click "Remove Duplicates" to eliminate all repeated lines, keeping only the first occurrence.',
        'Optionally enable case-insensitive mode to treat "Apple" and "apple" as duplicates.',
        'Copy the deduplicated output.',
      ],
    },
    expandedDescription: [
      'Duplicate lines accumulate in text files, lists, logs, and data exports through repeated operations, merges, and copy-paste mistakes. Manually finding and removing duplicates is error-prone and time-consuming in large lists.',
      'This tool removes duplicate lines in a single click, preserving the order of first occurrences. It supports both case-sensitive and case-insensitive duplicate detection, and optionally ignores blank lines when checking for duplicates.',
    ],
    useCases: [
      { title: 'Deduplicating email lists', description: 'Remove duplicate email addresses from marketing lists before import to avoid sending duplicate messages.' },
      { title: 'Log file cleanup', description: 'Remove repeated log entries to identify unique events in verbose application logs.' },
      { title: 'Keyword list deduplication', description: 'Remove duplicate keywords from SEO keyword lists or tag collections.' },
      { title: 'Code import deduplication', description: 'Remove duplicate import statements that have accumulated through code edits and merges.' },
      { title: 'Data cleaning', description: 'Remove duplicate rows from exported data before import or analysis.' },
    ],
    faqs: [
      { question: 'Does it preserve the original order?', answer: 'Yes. The first occurrence of each unique line is kept in its original position. Subsequent duplicates are removed. The relative order of unique lines is unchanged.' },
      { question: 'What counts as a duplicate?', answer: 'By default, lines must be exactly identical (same characters, same case) to be considered duplicates. In case-insensitive mode, "Apple" and "apple" and "APPLE" are all considered the same line and only the first occurrence is kept.' },
      { question: 'Are blank lines treated as duplicates?', answer: 'Multiple consecutive blank lines can optionally be collapsed to a single blank line. Non-blank lines that are identical are always deduplicated regardless of this setting.' },
    ],
    trustNote: 'Your text stays in your browser — it is never sent to any server.',
  },

  'reverse-text': {
    howToUse: {
      steps: [
        'Type or paste your text into the input field.',
        'Choose: reverse the entire string character by character, reverse word order, or reverse each word individually.',
        'The reversed output appears instantly.',
        'Copy the result.',
      ],
    },
    expandedDescription: [
      'Text reversal has practical uses in development (checking palindromes, testing string manipulation logic), creative writing (mirror text, coded messages), and data transformation (reversing serialised data for specific formats).',
      'This tool offers three reversal modes: character reversal (the entire string backwards), word order reversal (last word first), and per-word reversal (each word spelled backwards but word order preserved).',
    ],
    useCases: [
      { title: 'Palindrome testing', description: 'Check whether a word or phrase reads the same forwards and backwards.' },
      { title: 'String manipulation testing', description: 'Generate reversed strings to test string processing functions in your code.' },
      { title: 'Creative text effects', description: 'Create mirror text or backwards text for creative writing, puzzles, or social media.' },
      { title: 'Simple obfuscation', description: 'Reverse text as a simple (non-cryptographic) way to make content less immediately readable.' },
    ],
    faqs: [
      { question: 'What is the difference between the three reversal modes?', answer: '"Reverse string" reverses every character: "Hello World" becomes "dlroW olleH". "Reverse words" keeps each word intact but reverses their order: "Hello World" becomes "World Hello". "Reverse each word" reverses the characters within each word: "Hello World" becomes "olleH dlroW".' },
      { question: 'Does reversal work with Unicode and emoji?', answer: 'Yes, but emoji and some multi-character Unicode sequences (like flags or skin tone modifiers) may not reverse as expected because they consist of multiple code points. The tool reverses at the Unicode code point level.' },
    ],
    trustNote: 'Your text stays in your browser — it is never sent to any server.',
  },

  'slug-generator': {
    howToUse: {
      steps: [
        'Type or paste your title, heading, or phrase into the input field.',
        'The URL slug is generated instantly.',
        'Copy the slug for use in your URL, file name, or database ID.',
        'Adjust separator style if needed (hyphens are the default and recommended standard).',
      ],
    },
    expandedDescription: [
      'A URL slug is the clean, URL-safe version of a title or heading used in web addresses. "My Blog Post Title" becomes "my-blog-post-title" — lowercase, with spaces replaced by hyphens and special characters removed.',
      'Clean URL slugs are important for SEO (keywords in the URL are a ranking signal), user experience (readable URLs build trust and are shareable), and technical correctness (special characters in URLs cause encoding issues).',
      'This tool converts any text to a URL slug by lowercasing all characters, replacing spaces and non-alphanumeric characters with hyphens, collapsing multiple consecutive hyphens, and removing leading and trailing hyphens.',
    ],
    useCases: [
      { title: 'Blog post URLs', description: 'Generate clean URL slugs from blog post titles for WordPress, Ghost, or custom CMS platforms.' },
      { title: 'Product page URLs', description: 'Create SEO-friendly product URL slugs from product names for ecommerce sites.' },
      { title: 'Database ID generation', description: 'Generate human-readable identifiers from names for use as database slugs or URL keys.' },
      { title: 'File naming', description: 'Convert document titles to clean file names without spaces or special characters.' },
      { title: 'Category and tag slugs', description: 'Generate consistent slugs for categories, tags, and taxonomy terms in CMS systems.' },
    ],
    faqs: [
      { question: 'What is a URL slug?', answer: 'A URL slug is the part of a URL that identifies a specific page in a human-readable way. In "https://example.com/blog/my-post-title", the slug is "my-post-title". It is lowercase, uses hyphens between words, and contains only letters, numbers, and hyphens.' },
      { question: 'Why use hyphens instead of underscores?', answer: 'Google treats hyphens as word separators in URLs — "my-blog-post" is read as three separate words. Underscores are treated as connectors — "my_blog_post" is read as one word. Hyphens are the SEO-recommended choice for word separation in URL slugs.' },
      { question: 'How are special characters handled?', answer: 'Accented characters are transliterated to their ASCII equivalents where possible (ü → u, é → e, ñ → n). Other special characters (!@#$%^&*) are removed. The result is a slug containing only lowercase letters, numbers, and hyphens.' },
    ],
    trustNote: 'Your text stays in your browser — it is never sent to any server.',
  },

  'random-username-generator': {
    howToUse: {
      steps: [
        'Click "Generate Username" to create a random username.',
        'Adjust style settings: with/without numbers, with/without special characters, preferred length.',
        'Click again to generate alternatives until you find one you like.',
        'Copy your chosen username.',
      ],
    },
    expandedDescription: [
      'Choosing a good username is harder than it seems — your preferred name is often taken, and random alternatives need to be memorable, appropriate, and available across platforms.',
      'This generator creates random usernames using combinations of words, numbers, and optional special characters. It produces names that are readable and pronounceable rather than random strings of characters, making them easier to remember and share.',
    ],
    useCases: [
      { title: 'Social media accounts', description: 'Generate creative usernames for Twitter, Instagram, TikTok, and other platforms when your preferred name is taken.' },
      { title: 'Gaming handles', description: 'Create unique gaming usernames for Steam, Xbox, PlayStation, and other gaming platforms.' },
      { title: 'Forum and community accounts', description: 'Generate usernames for Reddit, Discord servers, and other community platforms.' },
      { title: 'Anonymous accounts', description: 'Create usernames for accounts where you want privacy without using your real name.' },
      { title: 'Test account creation', description: 'Generate realistic-looking test usernames for populating development and testing databases.' },
    ],
    faqs: [
      { question: 'Are the generated usernames unique?', answer: 'The generator creates usernames that are statistically unlikely to be used by others, but it cannot guarantee availability on any specific platform. Always check availability on the platform before registering.' },
      { question: 'Can I customise the username style?', answer: 'Yes. You can adjust options like including numbers, maximum length, and separator style to match the requirements of specific platforms.' },
      { question: 'Are the usernames stored or logged?', answer: 'No. All generation happens in your browser and the usernames are not stored or transmitted anywhere.' },
    ],
    trustNote: 'All generation runs in your browser — nothing is sent to any server.',
  },

  'text-to-list': {
    howToUse: {
      steps: [
        'Paste your plain text or comma-separated values into the input field.',
        'Choose your desired list format: bulleted HTML, numbered HTML, Markdown, or comma-separated.',
        'Click "Convert" to generate the formatted list.',
        'Copy the result for use in your document, email, or code.',
      ],
    },
    expandedDescription: [
      'Converting unstructured text into formatted lists is a common task when preparing content for documents, websites, and emails. This tool converts plain text, comma-separated values, or line-separated items into properly formatted HTML lists, Markdown lists, or other structured formats.',
      'The converter detects whether your input uses commas, newlines, or other separators and intelligently splits it into list items. It handles common edge cases like trailing commas and extra whitespace around items.',
    ],
    useCases: [
      { title: 'Converting CSV to HTML lists', description: 'Transform comma-separated feature lists or options into HTML bullet point lists for web pages.' },
      { title: 'Email formatting', description: 'Convert plain text lists into properly formatted HTML lists for HTML email templates.' },
      { title: 'Document preparation', description: 'Convert text notes into structured bulleted or numbered lists for documents and presentations.' },
      { title: 'Markdown content creation', description: 'Convert plain text into Markdown lists for README files and documentation.' },
    ],
    faqs: [
      { question: 'What separators does the tool detect?', answer: 'The tool detects commas, semicolons, newlines, and pipe characters (|) as item separators. It automatically identifies the most likely separator in your input.' },
      { question: 'Can I create numbered lists?', answer: 'Yes. Choose "Numbered list" from the format options to generate an ordered HTML list (<ol>) or a Markdown numbered list (1., 2., 3.).' },
    ],
    trustNote: 'Your text stays in your browser — it is never sent to any server.',
  },

  // ─────────────────────────────────────────────────────────────────
  // IMAGE TOOLS — remaining
  // ─────────────────────────────────────────────────────────────────

  'image-cropper': {
    howToUse: {
      steps: [
        'Upload an image by clicking "Upload Image" or dragging it onto the tool.',
        'Drag the crop handles to select the area you want to keep.',
        'Optionally lock the aspect ratio (e.g., 1:1 for square, 16:9 for widescreen) before cropping.',
        'Click "Crop" and download the result.',
      ],
    },
    expandedDescription: [
      'Cropping removes unwanted areas from an image to focus on the subject, meet specific dimension requirements, or adjust the composition. It is one of the most fundamental image editing operations.',
      'This free browser-based image cropper gives you full control over the crop area with draggable handles and optional aspect ratio locking. It supports free-form cropping and common preset ratios used for social media, print, and web.',
      'All cropping runs in your browser using the Canvas API — your images never leave your device, making this suitable for cropping private or sensitive images.',
    ],
    useCases: [
      { title: 'Profile photo preparation', description: 'Crop photos to a square aspect ratio for profile pictures on social media and professional platforms.' },
      { title: 'Social media image sizing', description: 'Crop images to specific aspect ratios: 1:1 for Instagram, 16:9 for Twitter/LinkedIn, 4:5 for Instagram portrait.' },
      { title: 'Product image standardisation', description: 'Crop product photos to consistent dimensions and aspect ratios for ecommerce listings.' },
      { title: 'Removing unwanted backgrounds', description: 'Crop out distracting backgrounds, watermarks, or irrelevant elements from the edges of images.' },
      { title: 'Thumbnail creation', description: 'Crop the most visually interesting portion of an image for use as a blog post or video thumbnail.' },
    ],
    faqs: [
      { question: 'Can I crop to a specific pixel size?', answer: 'Yes. Enter exact pixel dimensions for the crop area rather than using the drag handles. This ensures the output meets specific size requirements.' },
      { question: 'What aspect ratios are available?', answer: 'Common presets include 1:1 (square), 16:9 (widescreen), 4:3 (standard), 4:5 (Instagram portrait), and 3:2 (standard photo). You can also use free-form cropping for any custom dimensions.' },
      { question: 'Does cropping reduce file size?', answer: 'Yes. Cropping to a smaller area reduces the number of pixels and therefore reduces file size, typically proportionally to the area removed. A crop that removes 50% of the image area roughly halves the file size.' },
      { question: 'Are my images uploaded to a server?', answer: 'No. All cropping uses the browser Canvas API and runs entirely on your device. Your images never leave your browser.' },
    ],
    trustNote: 'All image processing runs in your browser — your images are never uploaded to any server.',
  },

  'image-rotator': {
    howToUse: {
      steps: [
        'Upload your image by clicking "Upload Image" or dragging it onto the tool.',
        'Click the rotation buttons to rotate 90° clockwise, 90° counter-clockwise, or 180°.',
        'Preview the rotated result.',
        'Download the rotated image.',
      ],
    },
    expandedDescription: [
      'Images taken on mobile phones are sometimes saved in the wrong orientation due to EXIF orientation metadata not being respected by all applications. This free image rotator lets you correct orientation in seconds.',
      'The rotator supports 90° clockwise, 90° counter-clockwise, and 180° rotation. All rotation runs in your browser with no server upload required.',
    ],
    useCases: [
      { title: 'Fixing phone photo orientation', description: 'Correct photos taken on mobile devices that display sideways or upside-down when uploaded to websites.' },
      { title: 'Preparing images for presentations', description: 'Rotate images to the correct orientation before inserting into slide decks or documents.' },
      { title: 'Social media uploads', description: 'Correct image orientation before uploading to Instagram, LinkedIn, or other platforms.' },
      { title: 'Batch orientation correction', description: 'Quickly rotate multiple images that need the same orientation correction.' },
    ],
    faqs: [
      { question: 'Why do phone photos sometimes appear rotated?', answer: 'Camera phones save photos with an EXIF orientation tag indicating how the phone was held, rather than rotating the actual pixels. Applications that ignore the EXIF tag display the photo in its raw pixel orientation, which may appear sideways. This rotator applies pixel-level rotation.' },
      { question: 'Will rotation reduce image quality?', answer: '90° and 180° rotations do not reduce image quality — the same pixels are rearranged. There is no interpolation and no loss of detail. The file size may change slightly due to recompression.' },
    ],
    trustNote: 'All image processing runs in your browser — your images are never uploaded to any server.',
  },

  'image-flipper': {
    howToUse: {
      steps: [
        'Upload your image by clicking "Upload Image" or dragging it onto the tool.',
        'Click "Flip Horizontal" to create a mirror image, or "Flip Vertical" to flip upside down.',
        'Preview the result.',
        'Download the flipped image.',
      ],
    },
    expandedDescription: [
      'Image flipping creates a mirror reflection of an image along a horizontal or vertical axis. Horizontal flipping (left-right mirror) is commonly used for symmetry effects, correcting mirrored screenshots, and creative compositions. Vertical flipping (upside down) is used for reflection effects and specific design needs.',
      'All flipping runs in your browser — images are never sent to any server.',
    ],
    useCases: [
      { title: 'Creating mirror effects', description: 'Flip images horizontally to create symmetrical compositions or mirrored reflections for design work.' },
      { title: 'Correcting mirrored selfies', description: 'Flip selfie photos that appear as mirror images rather than as others see you.' },
      { title: 'Data augmentation', description: 'Create flipped variants of images to augment training datasets for machine learning models.' },
      { title: 'Graphic design', description: 'Flip design elements, illustrations, or decorative images to balance compositions.' },
    ],
    faqs: [
      { question: 'What is the difference between horizontal and vertical flip?', answer: 'Horizontal flip mirrors the image left-to-right — left becomes right and vice versa. Vertical flip mirrors the image top-to-bottom — the image appears upside down. Horizontal flip is by far the more common operation.' },
      { question: 'Does flipping change the image dimensions?', answer: 'No. Flipping rearranges pixels without changing the total pixel count or dimensions. A 1920×1080 image is still 1920×1080 after flipping.' },
    ],
    trustNote: 'All image processing runs in your browser — your images are never uploaded to any server.',
  },

  'image-to-png': {
    howToUse: {
      steps: [
        'Upload your image (JPG, WebP, GIF, BMP, or other format) by clicking "Upload Image".',
        'The conversion to PNG happens automatically.',
        'Preview the converted image.',
        'Download the PNG file.',
      ],
    },
    expandedDescription: [
      'PNG (Portable Network Graphics) is the preferred format for images that require transparency, sharp edges, or lossless quality. Converting to PNG is necessary when you need a transparent background, are working with screenshots or diagrams that have text, or need to preserve every pixel perfectly.',
      'This converter transforms any common image format to PNG instantly in your browser. The output is a lossless PNG — no quality is lost in the conversion. For JPG inputs (which are already lossy), the PNG output preserves the quality as-is without further degradation.',
    ],
    useCases: [
      { title: 'Adding transparency support', description: 'Convert JPG images to PNG when you need to remove the background — PNG supports transparency, JPG does not.' },
      { title: 'Preserving screenshot quality', description: 'Save screenshots as PNG rather than JPG to avoid compression artefacts on text and UI elements.' },
      { title: 'Logo and icon preparation', description: 'Convert logos to PNG for use on websites where transparent backgrounds are needed.' },
      { title: 'Design asset preparation', description: 'Convert images to PNG for use in design tools that work best with lossless formats.' },
    ],
    faqs: [
      { question: 'When should I use PNG instead of JPG?', answer: 'Use PNG for: images with transparency, screenshots and screen recordings, logos and icons, images with text, diagrams and charts, images that will be edited further. Use JPG for: photographs and complex natural images where file size is important and transparency is not needed.' },
      { question: 'Will converting JPG to PNG improve quality?', answer: 'No. The JPG compression artefacts are already baked into the image data. Converting to PNG preserves the current quality losslessly but cannot recover data lost during the original JPG compression.' },
      { question: 'Does PNG support transparency?', answer: 'Yes. PNG supports a full alpha channel for transparency. When you convert a JPG (which has no transparency) to PNG, the result will have a white or opaque background. To make the background transparent, you need a background removal tool after converting.' },
    ],
    trustNote: 'All image processing runs in your browser — your images are never uploaded to any server.',
  },

  'image-to-jpg': {
    howToUse: {
      steps: [
        'Upload your image (PNG, WebP, GIF, BMP, or other format).',
        'Adjust the JPG quality setting if needed (80% is a good default).',
        'The conversion to JPG happens automatically.',
        'Download the JPG file.',
      ],
    },
    expandedDescription: [
      'JPG (JPEG) is the standard format for photographs and complex images where file size matters more than perfect quality or transparency. Converting to JPG typically reduces file size dramatically compared to PNG for photographic content.',
      'This converter transforms any image to JPG with adjustable quality. Lower quality settings produce smaller files; higher settings preserve more detail. For web use, 75-85% quality is the standard sweet spot.',
    ],
    useCases: [
      { title: 'Reducing file size for web', description: 'Convert PNG photos to JPG to dramatically reduce file size while maintaining acceptable visual quality.' },
      { title: 'Platform compatibility', description: 'Convert images to JPG for platforms that only accept JPG format.' },
      { title: 'Email attachment size reduction', description: 'Convert high-quality PNG images to JPG to keep email attachments within size limits.' },
      { title: 'Photography workflow', description: 'Convert RAW or PNG exports from photo editors to JPG for web delivery and sharing.' },
    ],
    faqs: [
      { question: 'What quality setting should I use?', answer: '80-85% quality is the standard recommendation for web images — visually indistinguishable from higher quality settings but with much smaller file sizes. For print use, use 95%+. For thumbnails and previews, 60-75% is sufficient.' },
      { question: 'Does JPG support transparency?', answer: 'No. JPG does not support transparency. Any transparent areas in your source image will be filled with a background colour (usually white) during conversion. If you need transparency, use PNG or WebP instead.' },
      { question: 'Why is JPG smaller than PNG for photographs?', answer: 'JPG uses lossy compression specifically designed for photographic content. It discards subtle colour variations that the human eye barely notices, achieving 5-10x smaller files than PNG for the same photograph. PNG uses lossless compression, preserving every pixel at the cost of much larger file sizes.' },
    ],
    trustNote: 'All image processing runs in your browser — your images are never uploaded to any server.',
  },

  'png-to-webp': {
    howToUse: {
      steps: [
        'Upload your PNG image.',
        'Adjust the WebP quality setting if desired.',
        'The conversion to WebP happens automatically.',
        'Download the WebP file.',
      ],
    },
    expandedDescription: [
      'WebP is Google\'s modern image format that provides superior compression compared to both PNG and JPG. WebP lossless is 26% smaller than PNG on average; WebP lossy is 25-35% smaller than JPG at equivalent visual quality. All modern browsers support WebP.',
      'Converting PNG images to WebP is one of the highest-impact actions for web performance optimisation. Google PageSpeed Insights specifically recommends serving images in "next-gen formats" like WebP as a performance improvement.',
      'All conversion runs in your browser — your images never leave your device.',
    ],
    useCases: [
      { title: 'Web performance optimisation', description: 'Convert PNG images to WebP to reduce page weight and improve Google PageSpeed scores and Core Web Vitals.' },
      { title: 'Addressing PageSpeed recommendations', description: 'Resolve the "Serve images in next-gen formats" PageSpeed Insights recommendation by converting to WebP.' },
      { title: 'Bandwidth cost reduction', description: 'Reduce CDN and hosting bandwidth costs by serving smaller WebP images instead of PNG.' },
      { title: 'Mobile performance', description: 'Improve load times on mobile connections where file size has a larger impact on user experience.' },
    ],
    faqs: [
      { question: 'Do all browsers support WebP?', answer: 'Yes. WebP is supported in all modern browsers: Chrome, Firefox, Safari (since version 14), Edge, and Opera. As of 2024, global WebP support exceeds 96% of web users. For the remaining users, serving a PNG or JPG fallback via a <picture> element is best practice.' },
      { question: 'Does WebP support transparency?', answer: 'Yes. WebP supports both lossless transparency (like PNG) and lossy transparency with an alpha channel. When converting a PNG with transparency to WebP, the transparency is preserved in the WebP output.' },
      { question: 'How much smaller will my WebP file be?', answer: 'For lossless conversion (PNG to WebP lossless), expect 15-30% file size reduction. For lossy conversion at equivalent quality, expect 25-40% reduction compared to PNG. Results vary by image content — images with large uniform colour areas compress more than photographs.' },
    ],
    trustNote: 'All image processing runs in your browser — your images are never uploaded to any server.',
  },

  'webp-to-png': {
    howToUse: {
      steps: [
        'Upload your WebP image.',
        'The conversion to PNG happens automatically.',
        'Download the PNG file.',
      ],
    },
    expandedDescription: [
      'While WebP is excellent for web delivery, some tools and contexts still require PNG — older image editors, certain CMS platforms, print workflows, and systems that do not support WebP. This converter handles the reverse conversion instantly.',
      'The PNG output is lossless — it preserves all the quality of the WebP source without introducing additional compression artefacts. For WebP images that were originally lossless, the PNG output will be pixel-perfect.',
    ],
    useCases: [
      { title: 'Editing in older tools', description: 'Convert WebP to PNG for editing in image editors that do not support WebP input.' },
      { title: 'Print workflow preparation', description: 'Convert web-optimised WebP images to PNG for use in print design workflows.' },
      { title: 'CMS compatibility', description: 'Convert WebP images to PNG for upload to CMS platforms that only accept PNG and JPG.' },
      { title: 'Asset archiving', description: 'Convert WebP delivery assets back to PNG for archiving in formats with universal tool support.' },
    ],
    faqs: [
      { question: 'Will the PNG be the same quality as the original?', answer: 'For WebP lossless sources: yes, the PNG will be pixel-perfect. For WebP lossy sources: the PNG will preserve the quality of the compressed WebP without adding further degradation, but the original lossy compression cannot be reversed.' },
      { question: 'Why is the PNG larger than the WebP?', answer: 'This is expected. WebP was specifically designed for smaller file sizes than PNG. Converting back to PNG undoes the compression advantage. The PNG will typically be 30-60% larger than the WebP source.' },
    ],
    trustNote: 'All image processing runs in your browser — your images are never uploaded to any server.',
  },

  'image-color-picker': {
    howToUse: {
      steps: [
        'Upload an image or paste an image URL.',
        'Click anywhere on the image to pick that colour.',
        'The HEX, RGB, and HSL values for the clicked colour are displayed instantly.',
        'Copy any colour format with the Copy button.',
      ],
    },
    expandedDescription: [
      'Identifying exact colour values from an image is a common task for designers, developers, and anyone who needs to match colours across digital assets. This colour picker lets you click any pixel in an uploaded image to get its precise HEX, RGB, and HSL values.',
      'Unlike browser developer tools that only work on web page elements, this tool works on any image you upload — product photos, brand assets, screenshots, artwork, or any other image file.',
      'All colour picking runs in your browser using the Canvas API — your images never leave your device.',
    ],
    useCases: [
      { title: 'Brand colour extraction', description: 'Extract exact colour codes from brand logo files to use in CSS, design tools, and style guides.' },
      { title: 'Matching colours across assets', description: 'Pick colours from one image to match them exactly in another design or in CSS.' },
      { title: 'Creating colour palettes', description: 'Extract a palette of dominant or accent colours from a photograph or artwork for use in design projects.' },
      { title: 'CSS colour matching', description: 'Get the HEX or RGB value of a colour in a design mockup to implement it accurately in code.' },
      { title: 'Accessibility checking', description: 'Extract foreground and background colours to calculate contrast ratios for WCAG accessibility compliance.' },
    ],
    faqs: [
      { question: 'What colour formats does it return?', answer: 'The tool returns the picked colour in HEX (#RRGGBB), RGB (r, g, b), and HSL (h, s%, l%) formats simultaneously. Copy whichever format your design tool or code requires.' },
      { question: 'How accurate is the colour picking?', answer: 'The tool picks the exact pixel colour using the Canvas API, which reads the actual pixel RGBA values. The accuracy is pixel-perfect for images without lossy compression artefacts. For JPG images, nearby pixels may have slightly different values due to compression.' },
      { question: 'Can I pick colours from web pages?', answer: 'This tool works with uploaded images only. For picking colours from live web pages, use your browser\'s built-in developer tools colour picker or a browser extension like ColorZilla.' },
    ],
    trustNote: 'All image processing runs in your browser — your images are never uploaded to any server.',
  },

  'image-dimensions-checker': {
    howToUse: {
      steps: [
        'Upload your image by clicking "Upload Image".',
        'The width, height, file size, format, and resolution are displayed instantly.',
        'No download needed — just upload to inspect.',
      ],
    },
    expandedDescription: [
      'Knowing an image\'s exact dimensions, file size, and format is essential before uploading to platforms with specific requirements, adding to a website, or including in a document.',
      'This tool instantly displays all key technical properties of any uploaded image: pixel dimensions (width × height), file size, format (PNG, JPG, WebP, etc.), aspect ratio, and colour depth.',
      'All inspection runs in your browser — images are never uploaded to any server.',
    ],
    useCases: [
      { title: 'Platform upload compliance', description: 'Check that images meet the dimension and file size requirements of specific platforms before uploading.' },
      { title: 'Web performance auditing', description: 'Identify oversized images that need to be resized or compressed before use on a website.' },
      { title: 'Design asset verification', description: 'Confirm that exported design assets have the expected dimensions and file size.' },
      { title: 'Email attachment checking', description: 'Check image file sizes before attaching to emails to stay within size limits.' },
    ],
    faqs: [
      { question: 'What information does the checker display?', answer: 'Width and height in pixels, file size in KB/MB, image format (PNG, JPG, WebP, GIF etc.), aspect ratio, and colour depth (bits per pixel).' },
      { question: 'Can I check multiple images at once?', answer: 'Currently the tool checks one image at a time. Upload each image separately to check its dimensions and properties.' },
      { question: 'Is my image uploaded to a server?', answer: 'No. All inspection uses browser APIs (FileReader and Canvas) and runs entirely on your device. Images never leave your browser.' },
    ],
    trustNote: 'All image inspection runs in your browser — your images are never uploaded to any server.',
  },

  'image-to-base64': {
    howToUse: {
      steps: [
        'Upload your image (PNG, JPG, WebP, GIF, or SVG).',
        'The Base64 encoded string is generated instantly.',
        'Copy the raw Base64 string or the complete data URI (data:image/png;base64,...).',
        'Use the data URI directly in HTML, CSS, or JSON.',
      ],
    },
    expandedDescription: [
      'Base64 encoding converts an image\'s binary data into a text string that can be embedded directly in HTML, CSS, or JSON without requiring a separate image file or network request. This technique is used for small images, icons, and inline SVGs.',
      'This tool converts any image to its Base64 representation and provides the complete data URI format ready to paste into your code. A data URI like data:image/png;base64,iVBOR... can be used anywhere an image URL is expected.',
      'Base64 encoded images are about 33% larger than the original binary file because of the encoding overhead. For this reason, Base64 is best suited for small images (under 10-20KB) where eliminating the HTTP request outweighs the size increase.',
    ],
    useCases: [
      { title: 'CSS background images', description: 'Embed small background images, patterns, and icons directly in CSS files to eliminate HTTP requests.' },
      { title: 'HTML inline images', description: 'Embed images directly in HTML src attributes for self-contained HTML files and email templates.' },
      { title: 'API image transmission', description: 'Send images as Base64 strings in JSON API payloads when a separate file upload endpoint is not available.' },
      { title: 'Email inline images', description: 'Embed images directly in HTML emails to avoid external image blocking by email clients.' },
      { title: 'Favicon embedding', description: 'Embed favicons directly in HTML using data URIs to ensure they load even when asset files cannot be accessed.' },
    ],
    faqs: [
      { question: 'What is a data URI?', answer: 'A data URI (data URL) is a URL scheme that embeds data directly in the URL string rather than linking to an external resource. Format: data:[mediatype];base64,[data]. For example, data:image/png;base64,iVBOR... can be used as an img src value to display an image without an HTTP request.' },
      { question: 'How much larger is the Base64 version?', answer: 'Base64 encoding increases the data size by approximately 33%. A 10KB image becomes about 13.3KB as Base64. For small images, this overhead is acceptable. For large images, the size increase outweighs the benefits of inlining.' },
      { question: 'What image formats can be encoded?', answer: 'Any image format your browser can display can be encoded: PNG, JPG, WebP, GIF, SVG, ICO, and more. The data URI includes the correct MIME type automatically.' },
    ],
    trustNote: 'All encoding runs in your browser — your images are never uploaded to any server.',
  },

  'base64-to-image': {
    howToUse: {
      steps: [
        'Paste your Base64 encoded image string into the input field.',
        'Include the full data URI prefix (data:image/png;base64,...) or just the raw Base64 string.',
        'The decoded image is previewed instantly.',
        'Download the image file.',
      ],
    },
    expandedDescription: [
      'Base64 encoded images appear as long strings of characters in HTML source, CSS files, API responses, and JSON payloads. This tool decodes any Base64 image string back into a viewable and downloadable image file.',
      'Paste either a complete data URI (data:image/png;base64,...) or a raw Base64 string. The tool automatically detects the format and renders the image preview. The decoded image can be downloaded in its original format.',
    ],
    useCases: [
      { title: 'Extracting inlined images', description: 'Extract images embedded as Base64 data URIs in HTML or CSS files to save them as separate image files.' },
      { title: 'API response inspection', description: 'Preview images returned as Base64 strings in API responses to verify the content.' },
      { title: 'Debugging image data', description: 'Decode Base64 image data from logs, database records, or JSON payloads to inspect what image was stored.' },
      { title: 'Email image extraction', description: 'Extract and save images that are embedded as Base64 data URIs in HTML email source.' },
    ],
    faqs: [
      { question: 'Do I need to include the data URI prefix?', answer: 'The full data URI format (data:image/png;base64,...) is preferred as it includes the image format information. If you paste just the raw Base64 string without the prefix, the tool will attempt to detect the image format automatically.' },
      { question: 'What image formats are supported?', answer: 'Any image format that can be Base64 encoded is supported for decoding: PNG, JPG, WebP, GIF, SVG, ICO, and more. The format is determined from the data URI MIME type.' },
      { question: 'Is there a size limit?', answer: 'Very large Base64 strings (representing images over 10-20MB) may be slow to process in the browser. For typical web use cases (images under a few MB), processing is instant.' },
    ],
    trustNote: 'All decoding runs in your browser — your data is never sent to any server.',
  },

  'favicon-generator': {
    howToUse: {
      steps: [
        'Upload a square PNG image (ideally 512×512 or larger) to use as your favicon source.',
        'The generator creates favicon files in all required sizes: 16×16, 32×32, 48×48, and 64×64.',
        'Download the generated favicon.ico file or individual PNG files.',
        'Place the favicon.ico in your website\'s root directory and add the appropriate <link> tags to your HTML.',
      ],
    },
    expandedDescription: [
      'A favicon is the small icon displayed in browser tabs, bookmarks, and browser history next to your website\'s name. A missing favicon results in browser errors and gives your site an unfinished appearance. Favicons need to be provided in multiple sizes to look sharp across different display contexts.',
      'This generator creates all the common favicon formats from a single source image: 16×16 for browser tabs, 32×32 for taskbar and bookmarks, 48×48 for Windows site icons, and 64×64 for high-DPI displays. It also generates the sizes needed for Apple touch icons (180×180) for iOS home screen shortcuts.',
      'For best results, use a square PNG with a transparent background and dimensions of at least 512×512 pixels. The generator scales it down to all required sizes while preserving sharpness.',
    ],
    useCases: [
      { title: 'New website setup', description: 'Generate a complete favicon package for a new website from a logo or icon file.' },
      { title: 'Brand update', description: 'Regenerate all favicon sizes when updating a brand logo or icon.' },
      { title: 'PWA icon generation', description: 'Generate the full set of icon sizes required for Progressive Web App manifests.' },
      { title: 'Apple touch icon creation', description: 'Generate the 180×180 Apple touch icon for iOS home screen shortcuts alongside standard favicons.' },
    ],
    faqs: [
      { question: 'What size should my source image be?', answer: 'Use a square PNG of at least 512×512 pixels for the best results when scaling down to smaller sizes. Smaller source images may look pixelated when scaled. For favicons with text or fine detail, 512×512 or 1024×1024 is recommended.' },
      { question: 'How do I add the favicon to my website?', answer: 'Place favicon.ico in your website root directory. Add these tags to your HTML <head>: <link rel="icon" href="/favicon.ico"> for the main favicon, <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"> for PNG favicons, and <link rel="apple-touch-icon" href="/apple-touch-icon.png"> for iOS.' },
      { question: 'Do I need a favicon.ico or can I use PNG?', answer: 'Modern browsers support PNG favicons, which are sharper than ICO format at small sizes. However, favicon.ico is still recommended in the website root for maximum compatibility with older browsers, RSS readers, and other tools that look for it automatically.' },
      { question: 'What is the apple-touch-icon?', answer: 'The apple-touch-icon is a 180×180 PNG used when iOS users add your website to their home screen. Without it, iOS takes a screenshot of the page as the icon, which looks poor. The favicon generator creates this size along with the standard favicon files.' },
    ],
    trustNote: 'All image processing runs in your browser — your images are never uploaded to any server.',
  },

  'image-format-info': {
    howToUse: {
      steps: [
        'Upload any image file by clicking "Upload Image".',
        'The tool instantly displays format, dimensions, file size, colour depth, and other metadata.',
        'No conversion or download needed — upload to inspect only.',
      ],
    },
    expandedDescription: [
      'Understanding an image\'s technical properties is essential for web development, design workflows, and troubleshooting. This tool reads and displays all key technical metadata from any uploaded image file.',
      'The information displayed includes: image format (PNG, JPG, WebP, GIF, etc.), dimensions (width × height in pixels), file size, colour depth (bits per pixel), whether the image has transparency (alpha channel), aspect ratio, and EXIF metadata where available (camera model, capture date, GPS coordinates for photos).',
      'All inspection runs entirely in your browser — images are never uploaded to a server.',
    ],
    useCases: [
      { title: 'Format identification', description: 'Identify the actual format of an image file regardless of its file extension.' },
      { title: 'Transparency detection', description: 'Check whether a PNG image actually has transparent pixels or is fully opaque.' },
      { title: 'EXIF data inspection', description: 'View camera metadata, capture date, and GPS location data embedded in JPEG photos.' },
      { title: 'Asset auditing', description: 'Audit image assets to identify those that are larger than expected or in unexpected formats.' },
      { title: 'Pre-upload verification', description: 'Verify image properties before uploading to platforms with specific format or dimension requirements.' },
    ],
    faqs: [
      { question: 'What metadata does the tool display?', answer: 'Format (PNG, JPG, WebP, etc.), width and height in pixels, file size, colour depth (bits per pixel), alpha channel presence (transparency), aspect ratio, and EXIF data for JPEG files (camera model, date taken, GPS coordinates, exposure settings).' },
      { question: 'What is colour depth?', answer: 'Colour depth (bits per pixel) determines how many colours can be represented. 8-bit: 256 colours (used in GIFs and indexed PNGs). 24-bit: 16.7 million colours (standard RGB). 32-bit: 16.7 million colours plus full transparency alpha channel (standard RGBA PNG). Most web images are 24-bit or 32-bit.' },
      { question: 'Can I see if an image has transparent pixels?', answer: 'Yes. The tool detects whether the image has an alpha channel (which supports transparency). For PNG files, it checks whether any pixels are actually transparent rather than just whether the format supports transparency.' },
      { question: 'Is my image uploaded to a server?', answer: 'No. All format inspection uses browser APIs and runs entirely on your device. Images never leave your browser.' },
    ],
    trustNote: 'All image inspection runs in your browser — your images are never uploaded to any server.',
  },

  'pdf-merger': {
    howToUse: {
      steps: [
        'Click "Upload PDFs" or drag and drop multiple PDF files onto the upload area.',
        'Reorder files using the up and down arrows so they merge in the correct sequence.',
        'Review the total page count and file size summary.',
        'Click "Merge PDFs" and download the combined document.',
      ],
    },
    expandedDescription: [
      'Combining multiple PDF files is a common task when you have report sections saved separately, scanned pages in batches, or invoices that need to be joined into one file for sharing or printing.',
      'This free PDF merger runs entirely in your browser using pdf-lib. Upload as many PDFs as you need, arrange them in order, and download a single merged file. No account, no upload to a server, and no watermarks.',
      'The tool shows each file\'s page count and size before merging, plus the combined totals after merge so you can verify the result matches your expectations.',
      'Password-protected PDFs cannot be merged until the encryption is removed. If a file is corrupted or invalid, the tool displays a clear error message.',
    ],
    useCases: [
      { title: 'Report assembly', description: 'Combine cover page, main content, and appendix PDFs into one deliverable document.' },
      { title: 'Scan consolidation', description: 'Merge batches of scanned pages into a single archive-quality PDF.' },
      { title: 'Invoice bundling', description: 'Join monthly invoice PDFs into one file for accounting or email attachment.' },
      { title: 'Course materials', description: 'Merge lecture slides, handouts, and readings into one downloadable packet.' },
      { title: 'Legal document compilation', description: 'Combine exhibits and supporting documents in a defined order for review.' },
      { title: 'Portfolio creation', description: 'Merge design proofs or project PDFs into a single presentation file.' },
    ],
    faqs: [
      { question: 'Is there a limit on how many PDFs I can merge?', answer: 'There is no fixed limit. Practical limits depend on your browser memory and PDF sizes. Most users can merge dozens of files without issue.' },
      { question: 'Does merge order matter?', answer: 'Yes. Pages appear in the order of your file list, top to bottom. Use the arrow buttons to reorder before merging.' },
      { question: 'Are my files uploaded anywhere?', answer: 'No. Merging uses pdf-lib in your browser. Files never leave your device.' },
      { question: 'What happens to bookmarks and links?', answer: 'Basic page content is preserved. Complex PDF features like form fields, bookmarks, and internal links may not carry over perfectly after merging.' },
      { question: 'Can I merge PDFs with different page sizes?', answer: 'Yes. Each page keeps its original dimensions in the merged output.' },
      { question: 'Why does merging fail?', answer: 'Common causes include password-protected PDFs, corrupted files, or non-PDF files renamed with a .pdf extension. Unlock or repair the source file and try again.' },
    ],
    trustNote: 'All PDF processing runs in your browser — your files are never uploaded to any server.',
  },

  'pdf-page-remover': {
    howToUse: {
      steps: [
        'Upload a PDF file using the Upload button.',
        'Enter page numbers to remove (e.g. 2, 5, 7-9) or click page buttons to select them.',
        'Confirm how many pages will remain in the output.',
        'Click "Remove Pages & Download" to save the edited PDF.',
      ],
    },
    expandedDescription: [
      'Sometimes you need to trim a PDF — remove blank pages, cut confidential sections, or drop unwanted appendices before sharing. This tool lets you delete specific pages without desktop software.',
      'Select pages individually with checkboxes or type a comma-separated list with ranges. The tool validates page numbers against the document and blocks removal of every page so you always get a usable result.',
      'Processing happens locally with pdf-lib. Your PDF is never sent to a server, making this safe for sensitive documents.',
      'The original file on your device is never modified. You download a new PDF with the selected pages removed.',
    ],
    useCases: [
      { title: 'Removing blank pages', description: 'Delete empty pages from scanned documents before sharing.' },
      { title: 'Redacting sections', description: 'Remove pages containing confidential or irrelevant content.' },
      { title: 'Trimming appendices', description: 'Drop unwanted appendix or reference pages from a report.' },
      { title: 'Fixing scan errors', description: 'Remove duplicate or mis-scanned pages from a multi-page scan.' },
      { title: 'Preparing print files', description: 'Delete cover or instruction pages not needed for final print output.' },
      { title: 'Email size reduction', description: 'Remove large-image pages to reduce file size before sending.' },
    ],
    faqs: [
      { question: 'Can I remove all pages?', answer: 'No. The tool requires at least one page to remain. If you need to discard the entire document, delete the file instead.' },
      { question: 'Are page numbers 1-based?', answer: 'Yes. Page 1 is the first page, matching standard PDF viewer labels.' },
      { question: 'How do ranges work?', answer: 'A range like 7-9 removes pages 7, 8, and 9 inclusive. Combine ranges with commas: 2, 5, 7-9.' },
      { question: 'Is the original PDF changed?', answer: 'No. You download a new file. Your original stays untouched.' },
      { question: 'Does this work on encrypted PDFs?', answer: 'Password-protected PDFs must be unlocked first. The tool cannot process encrypted files.' },
      { question: 'Will formatting be preserved?', answer: 'Remaining pages are copied as-is. Text, images, and layout on kept pages are preserved.' },
    ],
    trustNote: 'All PDF editing runs in your browser — your files are never uploaded to any server.',
  },

  'pdf-splitter': {
    howToUse: {
      steps: [
        'Upload the PDF you want to split.',
        'Choose "Every N pages" for equal chunks or "Page ranges" for custom sections.',
        'Enter the split size or range specification (e.g. 1-3, 5-7).',
        'Click "Split & Download" — each part downloads as a separate PDF file.',
      ],
    },
    expandedDescription: [
      'Large PDFs are hard to email, slow to open, and awkward to share one section at a time. Splitting lets you break a document into manageable parts or extract only the pages you need.',
      'Split every N pages to create equal consecutive chunks — useful for dividing a long scan or manual into parts. Or use page ranges to extract specific chapters, exhibits, or sections as separate files.',
      'Each output file downloads individually. No zip archive is required — your browser handles multiple downloads. All splitting runs client-side with pdf-lib for complete privacy.',
      'The tool validates your settings against the page count and shows clear errors if a split size exceeds the document length or ranges are out of bounds.',
    ],
    useCases: [
      { title: 'Chapter extraction', description: 'Pull individual chapters from an ebook or manual PDF using page ranges.' },
      { title: 'Email-friendly chunks', description: 'Split a large PDF into smaller parts that fit email attachment limits.' },
      { title: 'Batch processing prep', description: 'Divide a multi-page scan into single-page or few-page files for OCR or review.' },
      { title: 'Sharing specific sections', description: 'Send only the relevant pages to a colleague without sharing the full document.' },
      { title: 'Archive organisation', description: 'Split yearly report compilations into monthly or quarterly files.' },
      { title: 'Print shop submission', description: 'Separate cover, body, and insert pages for different print specifications.' },
    ],
    faqs: [
      { question: 'What is the difference between the two split modes?', answer: '"Every N pages" splits the PDF into consecutive equal-sized chunks automatically. "Page ranges" lets you define custom sections like 1-3 and 8-10, each becoming its own file.' },
      { question: 'Are files downloaded as a zip?', answer: 'No. Each split PDF downloads individually. Allow multiple downloads if your browser prompts you.' },
      { question: 'What if N is larger than the page count?', answer: 'The tool shows an error. N must be between 1 and the total number of pages in the PDF.' },
      { question: 'Can ranges overlap?', answer: 'Yes, but overlapping ranges will produce files with duplicate pages. Define non-overlapping ranges for clean splits.' },
      { question: 'Are my PDFs uploaded to a server?', answer: 'No. Splitting happens entirely in your browser.' },
      { question: 'Does page order stay the same?', answer: 'Yes. Pages within each output file maintain their original order from the source PDF.' },
    ],
    trustNote: 'All PDF splitting runs in your browser — your files are never uploaded to any server.',
  },
};
