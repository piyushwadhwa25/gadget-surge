import { useState, useMemo } from 'react';
import { Copy, Download, ArrowLeftRight } from 'lucide-react';
import { toast } from 'sonner';
import { trackEvent } from '@/lib/analytics';
import type { ToolConfig } from '@/lib/tools-registry';

interface Props {
  tool: ToolConfig;
}

type Direction = 'env-to-json' | 'json-to-env';

type Warning = { type: string; message: string };

function detectDirection(input: string): Direction {
  return input.trim().startsWith('{') ? 'json-to-env' : 'env-to-json';
}

function parseEnvLine(
  line: string,
  lineNum: number,
  warnings: Warning[],
): { key: string; value: string } | null {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return null;
  let body = trimmed;
  if (body.startsWith('export ')) body = body.slice(7).trim();
  const eq = body.indexOf('=');
  if (eq === -1) {
    warnings.push({ type: 'parse', message: `Line ${lineNum}: could not parse (no = found).` });
    return null;
  }
  let key = body.slice(0, eq).trim();
  let value = body.slice(eq + 1);
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
    warnings.push({
      type: 'key',
      message: `Line ${lineNum}: key "${key}" does not match ^[A-Za-z_][A-Za-z0-9_]*$.`,
    });
  }
  const first = value[0];
  const last = value[value.length - 1];
  if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
    value = value.slice(1, -1);
    if (first === '"') value = value.replace(/\\n/g, '\n');
  } else {
    const hash = value.indexOf(' #');
    if (hash !== -1) value = value.slice(0, hash).trimEnd();
    else {
      const hash2 = value.indexOf('#');
      if (hash2 > 0 && value[hash2 - 1] === ' ') value = value.slice(0, hash2).trimEnd();
    }
  }
  return { key, value };
}

function envToJson(input: string): { output: string; warnings: Warning[]; error?: string } {
  const warnings: Warning[] = [];
  const lines = input.split(/\r?\n/);
  const map = new Map<string, string>();
  const keyLines = new Map<string, number[]>();

  lines.forEach((line, i) => {
    const lineNum = i + 1;
    const parsed = parseEnvLine(line, lineNum, warnings);
    if (!parsed) return;
    const prev = keyLines.get(parsed.key) || [];
    prev.push(lineNum);
    keyLines.set(parsed.key, prev);
    map.set(parsed.key, parsed.value);
  });

  keyLines.forEach((nums, key) => {
    if (nums.length > 1) {
      warnings.push({
        type: 'duplicate',
        message: `Duplicate key "${key}" on lines ${nums.join(', ')} (last value wins).`,
      });
    }
  });

  const obj: Record<string, string> = {};
  map.forEach((v, k) => {
    obj[k] = v;
  });
  return { output: JSON.stringify(obj, null, 2), warnings };
}

function jsonToEnv(input: string): { output: string; warnings: Warning[]; error?: string } {
  const warnings: Warning[] = [];
  let data: unknown;
  try {
    data = JSON.parse(input);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Invalid JSON';
    return { output: '', warnings, error: msg };
  }
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return { output: '', warnings, error: 'JSON must be a flat object (not an array).' };
  }
  const lines: string[] = [];
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (typeof value === 'object' && value !== null) {
      return {
        output: '',
        warnings,
        error: `Nested value for key "${key}" is not supported. Use a flat object only.`,
      };
    }
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
      warnings.push({ type: 'key', message: `Key "${key}" does not match ^[A-Za-z_][A-Za-z0-9_]*$.` });
    }
    const str = value === null || value === undefined ? '' : String(value);
    const needsQuote = /[\s#=\n]/.test(str);
    const escaped = needsQuote ? `"${str.replace(/\n/g, '\\n').replace(/"/g, '\\"')}"` : str;
    lines.push(`${key}=${escaped}`);
  }
  return { output: lines.join('\n'), warnings };
}

function maskOutput(text: string, direction: Direction): string {
  if (direction === 'env-to-json') {
    try {
      const o = JSON.parse(text) as Record<string, string>;
      const masked: Record<string, string> = {};
      for (const k of Object.keys(o)) masked[k] = '••••';
      return JSON.stringify(masked, null, 2);
    } catch {
      return text.replace(/=(.*)$/gm, '=••••');
    }
  }
  return text.replace(/=(.*)$/gm, '=••••');
}

export function EnvJsonConverterTool({ tool }: Props) {
  const [input, setInput] = useState('');
  const [directionOverride, setDirectionOverride] = useState<Direction | null>(null);
  const [maskValues, setMaskValues] = useState(false);

  const autoDirection = useMemo(() => detectDirection(input), [input]);
  const direction = directionOverride ?? autoDirection;

  const result = useMemo(() => {
    if (!input.trim()) return { output: '', warnings: [] as Warning[], error: '' };
    if (direction === 'env-to-json') return envToJson(input);
    return jsonToEnv(input);
  }, [input, direction]);

  const displayOutput = useMemo(() => {
    if (!result.output) return '';
    return maskValues ? maskOutput(result.output, direction) : result.output;
  }, [result.output, maskValues, direction]);

  const swapDirection = () => {
    setDirectionOverride(direction === 'env-to-json' ? 'json-to-env' : 'env-to-json');
    trackEvent({ type: 'tool_action_run', slug: tool.slug, action: 'swap' });
  };

  const copy = async () => {
    if (!displayOutput) return;
    await navigator.clipboard.writeText(displayOutput);
    toast.success(maskValues ? 'Copied masked output' : 'Copied to clipboard');
    trackEvent({ type: 'copy_result', slug: tool.slug });
  };

  const download = () => {
    if (!displayOutput) return;
    const name = direction === 'env-to-json' ? 'env.json' : '.env';
    const mime = direction === 'env-to-json' ? 'application/json' : 'text/plain';
    const blob = new Blob([displayOutput], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
    trackEvent({ type: 'tool_action_run', slug: tool.slug, action: 'download' });
  };

  const badgeLabel = direction === 'env-to-json' ? '.env → JSON' : 'JSON → .env';

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-muted text-xs font-medium text-foreground">
          {badgeLabel}
        </span>
        <button
          type="button"
          onClick={swapDirection}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <ArrowLeftRight className="h-3.5 w-3.5" /> Swap direction
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Input</label>
        <textarea
          value={input}
          onChange={e => {
            setInput(e.target.value);
            setDirectionOverride(null);
          }}
          placeholder={`# .env example\nexport API_KEY=abc123\nDB_HOST="localhost"`}
          className="font-code w-full min-h-[160px] rounded-lg border border-input bg-background p-3 text-sm text-foreground resize-y focus:outline-none focus:ring-2 focus:ring-ring"
          spellCheck={false}
        />
      </div>

      <label className="inline-flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={maskValues}
          onChange={e => setMaskValues(e.target.checked)}
          className="h-4 w-4 rounded border-input"
        />
        Mask values in output (display and copy use •••• for screen-sharing)
      </label>

      {result.error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">
          {result.error}
        </div>
      )}

      {result.warnings.length > 0 && (
        <div className="rounded-lg bg-amber-500/10 border border-amber-500/40 p-3 text-sm space-y-1">
          <p className="font-medium text-foreground">Warnings</p>
          <ul className="list-disc pl-5 text-muted-foreground">
            {result.warnings.map((w, i) => (
              <li key={i}>{w.message}</li>
            ))}
          </ul>
        </div>
      )}

      {displayOutput && !result.error && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-foreground">Output</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={copy}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <Copy className="h-3 w-3" /> Copy
              </button>
              <button
                type="button"
                onClick={download}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <Download className="h-3 w-3" /> Download
              </button>
            </div>
          </div>
          <textarea
            value={displayOutput}
            readOnly
            className="font-code w-full min-h-[160px] rounded-lg border border-input bg-muted/50 p-3 text-sm text-foreground resize-y"
            spellCheck={false}
          />
        </div>
      )}
    </div>
  );
}
