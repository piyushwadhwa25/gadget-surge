// Calculator tool logic — pure client-side functions

function formatRelativeTime(date: Date, now = new Date()): string {
  const diffMs = date.getTime() - now.getTime();
  const absMs = Math.abs(diffMs);
  const future = diffMs > 0;
  const units: [number, Intl.RelativeTimeFormatUnit][] = [
    [86400000, 'day'],
    [3600000, 'hour'],
    [60000, 'minute'],
    [1000, 'second'],
  ];
  for (const [ms, unit] of units) {
    if (absMs >= ms || unit === 'second') {
      const value = Math.round(absMs / ms) * (future ? 1 : -1);
      return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(value, unit);
    }
  }
  return 'just now';
}

function parseToDate(input: string): Date {
  const trimmed = input.trim();
  if (/^-?\d+$/.test(trimmed)) {
    const n = parseInt(trimmed, 10);
    const date = trimmed.length >= 13 ? new Date(n) : new Date(n * 1000);
    if (isNaN(date.getTime())) throw new Error('Invalid timestamp value.');
    return date;
  }
  const date = new Date(trimmed);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid input. Enter a Unix timestamp (seconds or milliseconds) or a date string like "2024-06-15" or "Jun 15, 2024 2:30 PM".');
  }
  return date;
}

export function convertUnixTimestamp(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) throw new Error('Enter a Unix timestamp or date string.');
  const date = parseToDate(trimmed);
  const now = new Date();
  const seconds = Math.floor(date.getTime() / 1000);
  const ms = date.getTime();
  return [
    `ISO 8601: ${date.toISOString()}`,
    `UTC: ${date.toUTCString()}`,
    `Local: ${date.toLocaleString()}`,
    `Relative: ${formatRelativeTime(date, now)}`,
    `Unix (seconds): ${seconds}`,
    `Unix (milliseconds): ${ms}`,
  ].join('\n');
}

// --- Cron parsing (no external dependency) ---

type CronFields = { minute: Set<number>; hour: Set<number>; dom: Set<number>; month: Set<number>; dow: Set<number> };

const MONTH_NAMES = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DOW_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function parseCronField(field: string, min: number, max: number, name: string): Set<number> {
  if (field === '*' || field === '?') {
    return new Set(Array.from({ length: max - min + 1 }, (_, i) => i + min));
  }
  const values = new Set<number>();
  for (const part of field.split(',')) {
    const stepMatch = part.match(/^(.+)\/(\d+)$/);
    const chunk = stepMatch ? stepMatch[1] : part;
    const step = stepMatch ? parseInt(stepMatch[2], 10) : 1;
    if (!step || step < 1) throw new Error(`Invalid step in ${name} field: "${part}"`);

    let start: number, end: number;
    if (chunk === '*') {
      start = min;
      end = max;
    } else if (chunk.includes('-')) {
      const [a, b] = chunk.split('-');
      start = parseInt(a, 10);
      end = parseInt(b, 10);
    } else {
      start = end = parseInt(chunk, 10);
    }
    if ([start, end].some(n => isNaN(n))) throw new Error(`Invalid ${name} field: "${part}"`);
    if (start < min || end > max || start > end) throw new Error(`${name} value out of range (${min}–${max}): "${part}"`);
    for (let i = start; i <= end; i += step) values.add(i);
  }
  if (values.size === 0) throw new Error(`Invalid ${name} field: "${field}"`);
  return values;
}

function parseCronFields(expr: string): CronFields {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) {
    throw new Error('Cron expression must have exactly 5 fields: minute hour day month weekday (e.g. "30 14 * * 1").');
  }
  const [minF, hourF, domF, monthF, dowF] = parts;
  return {
    minute: parseCronField(minF, 0, 59, 'minute'),
    hour: parseCronField(hourF, 0, 23, 'hour'),
    dom: parseCronField(domF, 1, 31, 'day of month'),
    month: parseCronField(monthF, 1, 12, 'month'),
    dow: parseCronField(dowF.replace(/^7$/, '0'), 0, 6, 'day of week'),
  };
}

function describeCron(fields: CronFields): string {
  const min = [...fields.minute].sort((a, b) => a - b);
  const hrs = [...fields.hour].sort((a, b) => a - b);
  const parts: string[] = [];

  if (fields.minute.size === 60 && fields.hour.size === 24 && fields.dom.size === 31 && fields.month.size === 12 && fields.dow.size === 7) {
    return 'Every minute';
  }

  if (min.length === 1 && hrs.length === 1) {
    const h = hrs[0];
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    parts.push(`At ${h12}:${String(min[0]).padStart(2, '0')} ${ampm}`);
  } else if (hrs.length === 1) {
    parts.push(`At hour ${hrs[0]}:${String(min[0] ?? 0).padStart(2, '0')}`);
  } else {
    parts.push(`At minutes ${min.join(', ')} past hours ${hrs.join(', ')}`);
  }

  if (fields.dow.size < 7) {
    parts.push(`on ${[...fields.dow].sort((a, b) => a - b).map(d => DOW_NAMES[d]).join(', ')}`);
  }
  if (fields.dom.size < 31) {
    parts.push(`on day ${[...fields.dom].sort((a, b) => a - b).join(', ')}`);
  }
  if (fields.month.size < 12) {
    parts.push(`in ${[...fields.month].sort((a, b) => a - b).map(m => MONTH_NAMES[m]).join(', ')}`);
  }

  return parts.join(', ');
}

function cronMatches(date: Date, fields: CronFields): boolean {
  const minute = date.getMinutes();
  const hour = date.getHours();
  const dom = date.getDate();
  const month = date.getMonth() + 1;
  const dow = date.getDay();
  const domMatch = fields.dom.has(dom);
  const dowMatch = fields.dow.has(dow);
  const dayMatch = fields.dom.size === 31 || fields.dow.size === 7
    ? domMatch && dowMatch
    : domMatch || dowMatch;
  return fields.minute.has(minute) && fields.hour.has(hour) && fields.month.has(month) && dayMatch;
}

function getNextCronRuns(fields: CronFields, count: number): Date[] {
  const runs: Date[] = [];
  const cursor = new Date();
  cursor.setSeconds(0, 0);
  cursor.setMinutes(cursor.getMinutes() + 1);
  const limit = 525600 * 2;
  for (let i = 0; i < limit && runs.length < count; i++) {
    if (cronMatches(cursor, fields)) runs.push(new Date(cursor));
    cursor.setMinutes(cursor.getMinutes() + 1);
  }
  if (runs.length === 0) throw new Error('No upcoming run times found within 2 years.');
  return runs;
}

export function parseCronExpression(input: string): string {
  const expr = input.trim();
  if (!expr) throw new Error('Enter a cron expression.');
  const fields = parseCronFields(expr);
  const description = describeCron(fields);
  const nextRuns = getNextCronRuns(fields, 5);
  return [
    `Expression: ${expr}`,
    `Description: ${description}`,
    '',
    'Next 5 run times (local):',
    ...nextRuns.map((d, i) => `${i + 1}. ${d.toLocaleString()} (${d.toISOString()})`),
  ].join('\n');
}

// --- Color contrast (WCAG) ---

function parseHexColor(hex: string): [number, number, number] {
  const m = hex.trim().replace(/^#/, '').match(/^([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/);
  if (!m) throw new Error(`Invalid hex color: "${hex}". Use #RRGGBB or #RGB.`);
  let h = m[1];
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function linearize(channel: number): number {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function relativeLuminance(r: number, g: number, b: number): number {
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

export function calculateColorContrast(input: string): string {
  const lines = input.trim().split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) {
    throw new Error('Enter two hex colors on separate lines (foreground first, then background).\nExample:\n#FFFFFF\n#1A1A2E');
  }
  const [fgHex, bgHex] = lines;
  const fg = parseHexColor(fgHex);
  const bg = parseHexColor(bgHex);
  const l1 = relativeLuminance(...fg);
  const l2 = relativeLuminance(...bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  const ratio = (lighter + 0.05) / (darker + 0.05);
  const ratioStr = `${ratio.toFixed(2)}:1`;
  const pass = (threshold: number) => (ratio >= threshold ? 'PASS' : 'FAIL');

  return [
    `Foreground: #${fg.map(c => c.toString(16).padStart(2, '0')).join('').toUpperCase()}`,
    `Background: #${bg.map(c => c.toString(16).padStart(2, '0')).join('').toUpperCase()}`,
    `Contrast ratio: ${ratioStr}`,
    '',
    'WCAG AA (normal text, 4.5:1): ' + pass(4.5),
    'WCAG AA (large text, 3:1): ' + pass(3),
    'WCAG AAA (normal text, 7:1): ' + pass(7),
    'WCAG AAA (large text, 4.5:1): ' + pass(4.5),
  ].join('\n');
}

export { parseHexColor as parseHexForContrast };

// --- Data size converter ---

const BINARY_UNITS: Record<string, number> = {
  B: 1, b: 1, byte: 1, bytes: 1,
  KIB: 1024, KiB: 1024, kib: 1024,
  MIB: 1024 ** 2, MiB: 1024 ** 2, mib: 1024 ** 2,
  GIB: 1024 ** 3, GiB: 1024 ** 3, gib: 1024 ** 3,
  TIB: 1024 ** 4, TiB: 1024 ** 4, tib: 1024 ** 4,
};

const DECIMAL_UNITS: Record<string, number> = {
  B: 1, b: 1, byte: 1, bytes: 1,
  KB: 1000, kb: 1000,
  MB: 1000 ** 2, mb: 1000 ** 2,
  GB: 1000 ** 3, gb: 1000 ** 3,
  TB: 1000 ** 4, tb: 1000 ** 4,
};

function resolveUnit(unit: string, system: 'binary' | 'decimal'): number {
  const map = system === 'binary' ? BINARY_UNITS : DECIMAL_UNITS;
  const key = Object.keys(map).find(k => k.toLowerCase() === unit.toLowerCase());
  if (!key) {
    const hint = system === 'binary' ? 'B, KiB, MiB, GiB, TiB' : 'B, KB, MB, GB, TB';
    throw new Error(`Unknown ${system} unit "${unit}". Supported: ${hint}`);
  }
  return map[key];
}

export function convertDataSize(input: string): string {
  const lines = input.trim().split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length < 3) {
    throw new Error('Enter value, from unit, and to unit on separate lines. Optional 4th line: binary or decimal.\nExample:\n1024\nMiB\nGiB\nbinary');
  }
  const value = parseFloat(lines[0]);
  if (isNaN(value)) throw new Error('First line must be a numeric value.');
  const fromUnit = lines[1];
  const toUnit = lines[2];
  const systemLine = (lines[3] || 'binary').toLowerCase();
  const system = systemLine.startsWith('dec') ? 'decimal' : 'binary';

  const fromFactor = resolveUnit(fromUnit, system);
  const toFactor = resolveUnit(toUnit, system);
  const bytes = value * fromFactor;
  const result = bytes / toFactor;

  const rounded = result >= 1000
    ? result.toFixed(2)
    : result >= 1
      ? result.toFixed(4).replace(/\.?0+$/, '')
      : result.toPrecision(6);

  return [
    `${value} ${fromUnit} (${system})`,
    `= ${rounded} ${toUnit}`,
    `Exact: ${result}`,
    `In bytes: ${bytes}`,
    `System: ${system === 'binary' ? 'Binary (base 1024)' : 'Decimal (base 1000)'}`,
  ].join('\n');
}

export const calculatorToolProcessors: Record<string, (input: string) => string> = {
  'unix-timestamp-converter': convertUnixTimestamp,
  'cron-expression-calculator': parseCronExpression,
  'data-size-converter': convertDataSize,
};
