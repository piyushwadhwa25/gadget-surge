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
};
