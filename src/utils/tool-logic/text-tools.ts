// Text tool logic — pure client-side functions

export function characterCount(input: string): string {
  const chars = input.length;
  const charsNoSpaces = input.replace(/\s/g, '').length;
  const letters = (input.match(/[a-zA-Z]/g) || []).length;
  const digits = (input.match(/\d/g) || []).length;
  return `Characters (with spaces): ${chars}\nCharacters (no spaces): ${charsNoSpaces}\nLetters: ${letters}\nDigits: ${digits}`;
}

export function sentenceCount(input: string): string {
  const text = input.trim();
  if (!text) return 'Sentences: 0';
  const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
  return `Sentences: ${sentences}`;
}

export function paragraphCount(input: string): string {
  const text = input.trim();
  if (!text) return 'Paragraphs: 0';
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length || 1;
  return `Paragraphs: ${paragraphs}`;
}

export function caseConvert(input: string, mode: string): string {
  switch (mode) {
    case 'upper': return input.toUpperCase();
    case 'lower': return input.toLowerCase();
    case 'title': return input.replace(/\b\w/g, c => c.toUpperCase());
    case 'sentence': return input.replace(/(^\s*\w|[.!?]\s+\w)/g, c => c.toUpperCase()).replace(/^./, c => c.toUpperCase());
    case 'toggle': return input.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');
    default: return input;
  }
}

export function removeExtraSpaces(input: string): string {
  return input.split('\n').map(line => line.replace(/  +/g, ' ').trim()).join('\n');
}

export function removeLineBreaks(input: string): string {
  return input.replace(/\n+/g, ' ').replace(/  +/g, ' ').trim();
}

export function sortLines(input: string, descending = false, ignoreCase = false): string {
  const lines = input.split('\n');
  lines.sort((a, b) => {
    const x = ignoreCase ? a.toLowerCase() : a;
    const y = ignoreCase ? b.toLowerCase() : b;
    return x < y ? -1 : x > y ? 1 : 0;
  });
  if (descending) lines.reverse();
  return lines.join('\n');
}

export function removeDuplicateLines(input: string): string {
  const seen = new Set<string>();
  return input.split('\n').filter(line => {
    if (seen.has(line)) return false;
    seen.add(line);
    return true;
  }).join('\n');
}

export function reverseText(input: string): string {
  const reversed = input.split('').reverse().join('');
  const wordReversed = input.split(/(\s+)/).reverse().join('');
  return `Reversed characters:\n${reversed}\n\nReversed words:\n${wordReversed}`;
}

export function generateSlug(input: string): string {
  return input.toLowerCase().trim()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function generateLoremIpsum(paragraphs: number): string {
  const lorem = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
    'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.',
    'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
  ];
  const count = Math.max(1, Math.min(paragraphs, 20));
  return Array.from({ length: count }, (_, i) => lorem[i % lorem.length]).join('\n\n');
}

export function generatePassword(length: number, options: { upper: boolean; lower: boolean; numbers: boolean; symbols: boolean }): string {
  let chars = '';
  if (options.upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (options.lower) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (options.numbers) chars += '0123456789';
  if (options.symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  if (!chars) chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const len = Math.max(4, Math.min(length, 128));
  const arr = new Uint32Array(len);
  crypto.getRandomValues(arr);
  return Array.from(arr, v => chars[v % chars.length]).join('');
}

export function generateUsernames(count: number): string {
  const adjectives = ['Swift', 'Bright', 'Cool', 'Dark', 'Epic', 'Fast', 'Grand', 'Happy', 'Iron', 'Keen', 'Lucky', 'Mega', 'Noble', 'Prime', 'Quick', 'Rare', 'Sharp', 'True', 'Ultra', 'Vivid', 'Wild', 'Zen', 'Bold', 'Calm', 'Deep'];
  const nouns = ['Fox', 'Wolf', 'Hawk', 'Bear', 'Lion', 'Tiger', 'Eagle', 'Shark', 'Raven', 'Storm', 'Blaze', 'Frost', 'Stone', 'River', 'Cloud', 'Star', 'Moon', 'Fire', 'Wind', 'Wave', 'Pixel', 'Byte', 'Code', 'Node', 'Pulse'];
  const n = Math.max(1, Math.min(count, 50));
  const arr = new Uint32Array(n * 3);
  crypto.getRandomValues(arr);
  return Array.from({ length: n }, (_, i) => {
    const adj = adjectives[arr[i * 3] % adjectives.length];
    const noun = nouns[arr[i * 3 + 1] % nouns.length];
    const num = arr[i * 3 + 2] % 1000;
    return `${adj}${noun}${num}`;
  }).join('\n');
}

export function textToList(input: string, format: 'bullet' | 'numbered' = 'bullet'): string {
  const items = input.split(/[,\n]/).map(s => s.trim()).filter(Boolean);
  if (format === 'numbered') {
    return items.map((item, i) => `${i + 1}. ${item}`).join('\n');
  }
  return items.map(item => `• ${item}`).join('\n');
}

// Standard processor map for tools that use the simple input→output pattern
export const textToolProcessors: Record<string, (input: string) => string> = {
  'character-counter': characterCount,
  'sentence-counter': sentenceCount,
  'paragraph-counter': paragraphCount,
  'remove-extra-spaces': removeExtraSpaces,
  'remove-line-breaks': removeLineBreaks,
  'duplicate-line-remover': removeDuplicateLines,
  'slug-generator': generateSlug,
};
