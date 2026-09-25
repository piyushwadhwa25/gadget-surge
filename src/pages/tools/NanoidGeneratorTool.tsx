import { useState, useCallback } from 'react';
import { Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { trackEvent } from '@/lib/analytics';
import type { ToolConfig } from '@/lib/tools-registry';

interface Props {
  tool: ToolConfig;
}

type Mode = 'nanoid' | 'ulid';

const ALPHABET_PRESETS: Record<string, string> = {
  default: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_',
  alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  lowercase: 'abcdefghijklmnopqrstuvwxyz0123456789',
  numbers: '0123456789',
};

const ULID_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

function randomByte(): number {
  const buf = new Uint8Array(1);
  crypto.getRandomValues(buf);
  return buf[0];
}

function nanoidCustom(alphabet: string, size: number): string {
  if (alphabet.length === 0) return '';
  if (alphabet.length === 64) {
    const mask = 63;
    let id = '';
    while (id.length < size) {
      const byte = randomByte() & mask;
      if (byte < 64) id += alphabet[byte];
    }
    return id;
  }
  const len = alphabet.length;
  const mask = (2 << (31 - Math.clz32((len - 1) | 1))) - 1;
  let id = '';
  while (id.length < size) {
    const byte = randomByte() & mask;
    if (byte < len) id += alphabet[byte];
  }
  return id;
}

function encodeTime(time: number): string {
  let t = time;
  let out = '';
  for (let i = 9; i >= 0; i--) {
    const mod = t % 32;
    t = Math.floor(t / 32);
    out = ULID_ALPHABET[mod] + out;
  }
  return out;
}

function encodeRandom(bytes: Uint8Array): string {
  let out = '';
  let bitBuffer = 0;
  let bitCount = 0;
  for (let i = 0; i < bytes.length; i++) {
    bitBuffer = (bitBuffer << 8) | bytes[i];
    bitCount += 8;
    while (bitCount >= 5) {
      bitCount -= 5;
      const index = (bitBuffer >> bitCount) & 31;
      out += ULID_ALPHABET[index];
    }
  }
  if (bitCount > 0) {
    const index = (bitBuffer << (5 - bitCount)) & 31;
    out += ULID_ALPHABET[index];
  }
  return out.slice(0, 16);
}

function incrementUlidRandom(timePart: string, randomPart: string): string {
  const chars = ULID_ALPHABET;
  const rand = randomPart.padEnd(16, chars[0]).split('');
  for (let i = rand.length - 1; i >= 0; i--) {
    const idx = chars.indexOf(rand[i]);
    if (idx < 31) {
      rand[i] = chars[idx + 1];
      return timePart + rand.join('');
    }
    rand[i] = chars[0];
  }
  return timePart + rand.join('');
}

function decodeUlidTimestamp(ulid: string): string | null {
  if (ulid.length < 10) return null;
  const timePart = ulid.slice(0, 10);
  let ms = 0;
  for (const c of timePart) {
    const idx = ULID_ALPHABET.indexOf(c);
    if (idx === -1) return null;
    ms = ms * 32 + idx;
  }
  return new Date(ms).toISOString();
}

function generateUlids(count: number): string[] {
  const now = Date.now();
  const timePart = encodeTime(now);
  const ids: string[] = [];
  const bytes = new Uint8Array(10);
  crypto.getRandomValues(bytes);
  let randomPart = encodeRandom(bytes).padEnd(16, ULID_ALPHABET[0]).slice(0, 16);
  for (let i = 0; i < count; i++) {
    if (i > 0) randomPart = incrementUlidRandom('', randomPart).slice(-16);
    ids.push(timePart + randomPart);
  }
  return ids;
}

export function NanoidGeneratorTool({ tool }: Props) {
  const [mode, setMode] = useState<Mode>('nanoid');
  const [length, setLength] = useState(21);
  const [preset, setPreset] = useState('default');
  const [customAlphabet, setCustomAlphabet] = useState('');
  const [count, setCount] = useState(5);
  const [ids, setIds] = useState<string[]>([]);

  const getAlphabet = () => {
    if (preset === 'custom') {
      const unique = [...new Set(customAlphabet)].join('');
      return unique || ALPHABET_PRESETS.default;
    }
    return ALPHABET_PRESETS[preset] ?? ALPHABET_PRESETS.default;
  };

  const handleGenerate = useCallback(() => {
    const n = Math.max(1, Math.min(100, count));
    if (mode === 'ulid') {
      setIds(generateUlids(n));
    } else {
      const alphabet = getAlphabet();
      const size = Math.max(2, Math.min(64, length));
      const list: string[] = [];
      for (let i = 0; i < n; i++) list.push(nanoidCustom(alphabet, size));
      setIds(list);
    }
    trackEvent({ type: 'tool_action_run', slug: tool.slug, action: mode });
  }, [mode, count, length, preset, customAlphabet, tool.slug]);

  const copyAll = async () => {
    if (!ids.length) return;
    await navigator.clipboard.writeText(ids.join('\n'));
    toast.success('Copied to clipboard');
    trackEvent({ type: 'copy_result', slug: tool.slug });
  };

  const copyOne = async (id: string) => {
    await navigator.clipboard.writeText(id);
    toast.success('Copied');
    trackEvent({ type: 'copy_result', slug: tool.slug });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['nanoid', 'ulid'] as Mode[]).map(m => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              mode === m
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-input bg-background text-muted-foreground hover:bg-muted'
            }`}
          >
            {m === 'nanoid' ? 'NanoID' : 'ULID'}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Count</label>
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={e => setCount(Math.max(1, Math.min(100, parseInt(e.target.value, 10) || 1)))}
            className="font-code w-24 rounded-lg border border-input bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        {mode === 'nanoid' && (
          <>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Length</label>
              <input
                type="number"
                min={2}
                max={64}
                value={length}
                onChange={e => setLength(Math.max(2, Math.min(64, parseInt(e.target.value, 10) || 21)))}
                className="font-code w-24 rounded-lg border border-input bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Alphabet</label>
              <select
                value={preset}
                onChange={e => setPreset(e.target.value)}
                className="rounded-lg border border-input bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="default">Default (A–Z, a–z, 0–9, _-)</option>
                <option value="alphanumeric">Alphanumeric</option>
                <option value="lowercase">Lowercase + numbers</option>
                <option value="numbers">Numbers only</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </>
        )}
        <button
          type="button"
          onClick={handleGenerate}
          className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" /> Generate
        </button>
      </div>

      {mode === 'nanoid' && preset === 'custom' && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Custom alphabet</label>
          <input
            value={customAlphabet}
            onChange={e => setCustomAlphabet(e.target.value)}
            placeholder="A-Za-z0-9"
            className="font-code w-full rounded-lg border border-input bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            spellCheck={false}
          />
        </div>
      )}

      {ids.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-foreground">Generated IDs</label>
            <button
              type="button"
              onClick={copyAll}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Copy className="h-3 w-3" /> Copy All
            </button>
          </div>
          <ul className="space-y-2 rounded-lg border border-input bg-muted/30 p-3">
            {ids.map((id, i) => (
              <li key={i} className="flex flex-wrap items-center justify-between gap-2 font-code text-sm">
                <span className="break-all text-foreground">{id}</span>
                <div className="flex items-center gap-2 shrink-0">
                  {mode === 'ulid' && (
                    <span className="text-xs text-muted-foreground">{decodeUlidTimestamp(id) ?? '—'}</span>
                  )}
                  <button
                    type="button"
                    onClick={() => copyOne(id)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-md border border-input bg-background hover:bg-muted"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {mode === 'nanoid' && (
            <p className="text-xs text-muted-foreground mt-2">
              At the default 21-character length with the 64-character alphabet, randomness is about 126 bits — comparable to UUID v4&apos;s ~122 bits of randomness.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
