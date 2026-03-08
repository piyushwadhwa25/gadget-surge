// JSON Formatter
export function formatJson(input: string): string {
  const parsed = JSON.parse(input);
  return JSON.stringify(parsed, null, 2);
}

// Base64 Encode
export function base64Encode(input: string): string {
  return btoa(unescape(encodeURIComponent(input)));
}

// Base64 Decode
export function base64Decode(input: string): string {
  return decodeURIComponent(escape(atob(input.trim())));
}

// URL Encode
export function urlEncode(input: string): string {
  return encodeURIComponent(input);
}

// URL Decode
export function urlDecode(input: string): string {
  return decodeURIComponent(input);
}

// JWT Decode
export function jwtDecode(input: string): string {
  const parts = input.trim().split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT format: must contain exactly 3 parts separated by dots.');
  try {
    const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return JSON.stringify({ header, payload }, null, 2);
  } catch {
    throw new Error('Failed to decode JWT. Ensure the token is valid.');
  }
}

// UUID Generator
export function generateUuids(count: number = 1): string {
  return Array.from({ length: Math.min(count, 100) }, () => crypto.randomUUID()).join('\n');
}

// CSV to JSON
export function csvToJson(input: string): string {
  const lines = input.trim().split('\n');
  if (lines.length < 2) throw new Error('CSV must have a header row and at least one data row.');
  const headers = parseCsvLine(lines[0]);
  const result = lines.slice(1).filter(l => l.trim()).map(line => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((h, i) => [h, values[i] || '']));
  });
  return JSON.stringify(result, null, 2);
}

function parseCsvLine(line: string): string[] {
  return line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
}

// JSON to CSV
export function jsonToCsv(input: string): string {
  const data = JSON.parse(input);
  if (!Array.isArray(data) || data.length === 0) throw new Error('Input must be a non-empty JSON array of objects.');
  const headers = Object.keys(data[0]);
  const rows = data.map((obj: Record<string, unknown>) =>
    headers.map(h => `"${String(obj[h] ?? '').replace(/"/g, '""')}"`).join(',')
  );
  return [headers.join(','), ...rows].join('\n');
}

// Markdown to HTML
export function markdownToHtml(input: string): string {
  let html = input
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .replace(/^- (.+)$/gm, '<li>$1</li>');
  
  html = html.replace(/(<li>[\s\S]*?<\/li>(\n|$))+/g, (match) => `<ul>${match}</ul>`);
  html = html.split('\n').map(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('<')) return line;
    return `<p>${trimmed}</p>`;
  }).join('\n');
  
  return html;
}

// HTML Formatter
export function formatHtml(input: string): string {
  let formatted = '';
  let indent = 0;
  const tokens = input.replace(/>\s*</g, '>\n<').split('\n');
  
  for (const token of tokens) {
    const trimmed = token.trim();
    if (!trimmed) continue;
    
    if (trimmed.startsWith('</')) {
      indent = Math.max(0, indent - 1);
    }
    
    formatted += '  '.repeat(indent) + trimmed + '\n';
    
    if (
      trimmed.startsWith('<') &&
      !trimmed.startsWith('</') &&
      !trimmed.endsWith('/>') &&
      !trimmed.includes('</') &&
      !trimmed.startsWith('<!') &&
      !trimmed.startsWith('<br') &&
      !trimmed.startsWith('<hr') &&
      !trimmed.startsWith('<img') &&
      !trimmed.startsWith('<input') &&
      !trimmed.startsWith('<meta') &&
      !trimmed.startsWith('<link')
    ) {
      indent++;
    }
  }
  
  return formatted.trim();
}

// SQL Formatter
export function formatSql(input: string): string {
  let result = input.trim().replace(/\s+/g, ' ');
  
  const mainKeywords = [
    'SELECT', 'FROM', 'WHERE', 'ORDER BY', 'GROUP BY', 'HAVING',
    'LIMIT', 'OFFSET', 'UNION', 'UNION ALL', 'EXCEPT', 'INTERSECT',
    'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM',
    'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE',
    'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'OUTER JOIN', 'CROSS JOIN', 'JOIN',
    'ON', 'AND', 'OR'
  ];
  
  for (const kw of mainKeywords) {
    const regex = new RegExp(`\\b(${kw})\\b`, 'gi');
    result = result.replace(regex, '\n$1');
  }
  
  const lines = result.split('\n').filter(l => l.trim());
  const topLevel = /^(SELECT|FROM|WHERE|ORDER BY|GROUP BY|HAVING|LIMIT|OFFSET|UNION|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)/i;
  
  return lines.map(line => {
    const trimmed = line.trim();
    if (topLevel.test(trimmed)) return trimmed;
    return '  ' + trimmed;
  }).join('\n');
}

// Timestamp Converter
export function timestampToDate(input: string): string {
  const ts = parseInt(input.trim());
  if (isNaN(ts)) throw new Error('Invalid timestamp. Enter a number.');
  const date = ts > 1e12 ? new Date(ts) : new Date(ts * 1000);
  if (isNaN(date.getTime())) throw new Error('Invalid timestamp value.');
  return [
    `UTC: ${date.toUTCString()}`,
    `ISO: ${date.toISOString()}`,
    `Local: ${date.toLocaleString()}`,
    `Unix (seconds): ${Math.floor(date.getTime() / 1000)}`,
    `Unix (milliseconds): ${date.getTime()}`,
  ].join('\n');
}

export function dateToTimestamp(input: string): string {
  const date = new Date(input.trim());
  if (isNaN(date.getTime())) throw new Error('Invalid date string. Try formats like "2024-01-15" or "Jan 15, 2024".');
  return [
    `Unix (seconds): ${Math.floor(date.getTime() / 1000)}`,
    `Unix (milliseconds): ${date.getTime()}`,
  ].join('\n');
}

// Color Converter
export function convertColor(input: string): string {
  const trimmed = input.trim();
  
  const hexMatch = trimmed.match(/^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const hsl = rgbToHsl(r, g, b);
    return `HEX: #${hex.toUpperCase()}\nRGB: rgb(${r}, ${g}, ${b})\nHSL: hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
  }
  
  const rgbMatch = trimmed.match(/rgba?\(?\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]), g = parseInt(rgbMatch[2]), b = parseInt(rgbMatch[3]);
    const hex = '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('').toUpperCase();
    const hsl = rgbToHsl(r, g, b);
    return `HEX: ${hex}\nRGB: rgb(${r}, ${g}, ${b})\nHSL: hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
  }
  
  const hslMatch = trimmed.match(/hsla?\(?\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?/i);
  if (hslMatch) {
    const h = parseInt(hslMatch[1]), s = parseInt(hslMatch[2]), l = parseInt(hslMatch[3]);
    const rgb = hslToRgb(h, s, l);
    const hex = '#' + rgb.map(c => c.toString(16).padStart(2, '0')).join('').toUpperCase();
    return `HEX: ${hex}\nRGB: rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})\nHSL: hsl(${h}, ${s}%, ${l}%)`;
  }
  
  throw new Error('Unsupported color format. Use HEX (#FF5733), RGB (rgb(255,87,51)), or HSL (hsl(11,100%,60%)).');
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360; s /= 100; l /= 100;
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Regex Tester
export function testRegex(pattern: string, flags: string, text: string): { matches: { match: string; index: number; groups?: Record<string, string> }[]; count: number } {
  const regex = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
  const results: { match: string; index: number; groups?: Record<string, string> }[] = [];
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    results.push({
      match: m[0],
      index: m.index,
      groups: m.groups ? { ...m.groups } : undefined,
    });
    if (!m[0]) regex.lastIndex++;
  }
  return { matches: results, count: results.length };
}

// Re-export text tool processors
import { textToolProcessors } from './text-tools';

// Process function map for standard tools
export const toolProcessors: Record<string, (input: string) => string> = {
  'json-formatter': formatJson,
  'base64-encoder': base64Encode,
  'base64-decoder': base64Decode,
  'url-encoder': urlEncode,
  'url-decoder': urlDecode,
  'jwt-decoder': jwtDecode,
  'csv-to-json': csvToJson,
  'json-to-csv': jsonToCsv,
  'markdown-to-html': markdownToHtml,
  'html-formatter': formatHtml,
  'sql-formatter': formatSql,
  ...textToolProcessors,
};
