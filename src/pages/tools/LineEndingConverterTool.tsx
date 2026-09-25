import { useState, useMemo, useCallback, useRef } from 'react';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { trackEvent } from '@/lib/analytics';
import type { ToolConfig } from '@/lib/tools-registry';

interface Props {
  tool: ToolConfig;
}

type TargetEol = 'lf' | 'crlf' | 'cr';

function detectStats(text: string) {
  const hasBom = text.charCodeAt(0) === 0xfeff;
  const body = hasBom ? text.slice(1) : text;
  let crlf = 0;
  let lfOnly = 0;
  let crOnly = 0;
  for (let i = 0; i < body.length; i++) {
    if (body[i] === '\r' && body[i + 1] === '\n') {
      crlf++;
      i++;
    } else if (body[i] === '\n') {
      lfOnly++;
    } else if (body[i] === '\r') {
      crOnly++;
    }
  }
  const types = [crlf > 0, lfOnly > 0, crOnly > 0].filter(Boolean).length;
  return { crlf, lfOnly, crOnly, mixed: types > 1, hasBom };
}

function normalizeToLf(text: string, removeBom: boolean): string {
  let t = text;
  if (removeBom && t.charCodeAt(0) === 0xfeff) t = t.slice(1);
  return t.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

function applyEol(lfText: string, target: TargetEol, trailingNewline: boolean): string {
  let out = lfText;
  if (target === 'crlf') out = out.replace(/\n/g, '\r\n');
  else if (target === 'cr') out = out.replace(/\n/g, '\r');
  if (trailingNewline && out.length > 0 && !out.endsWith(target === 'crlf' ? '\r\n' : target === 'cr' ? '\r' : '\n')) {
    out += target === 'crlf' ? '\r\n' : target === 'cr' ? '\r' : '\n';
  }
  return out;
}

export function LineEndingConverterTool({ tool }: Props) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [target, setTarget] = useState<TargetEol>('lf');
  const [removeBom, setRemoveBom] = useState(true);
  const [trailingNewline, setTrailingNewline] = useState(false);
  const [uploadName, setUploadName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const stats = useMemo(() => (input ? detectStats(input) : null), [input]);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setInput(String(reader.result ?? ''));
      setUploadName(file.name);
      setOutput('');
    };
    reader.readAsText(file);
  }, []);

  const convert = useCallback(() => {
    const lf = normalizeToLf(input, removeBom);
    const converted = applyEol(lf, target, trailingNewline);
    setOutput(converted);
    trackEvent({ type: 'tool_action_run', slug: tool.slug, action: `convert-${target}` });
  }, [input, removeBom, target, trailingNewline, tool.slug]);

  const download = () => {
    if (!output) {
      toast.error('Convert first to download');
      return;
    }
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = uploadName ?? 'converted.txt';
    a.click();
    URL.revokeObjectURL(url);
    trackEvent({ type: 'tool_action_run', slug: tool.slug, action: 'download' });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Input</label>
        <textarea
          value={input}
          onChange={e => {
            setInput(e.target.value);
            setUploadName(null);
            setOutput('');
          }}
          placeholder="Paste text or upload a file…"
          className="font-code w-full min-h-[140px] rounded-lg border border-input bg-background p-3 text-sm text-foreground resize-y focus:outline-none focus:ring-2 focus:ring-ring"
          spellCheck={false}
        />
        <input
          ref={fileRef}
          type="file"
          accept=".txt,.csv,.json,.md,.sh,.env,.xml,.html,.css,.js,.ts,.log"
          className="hidden"
          onChange={e => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = '';
          }}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="mt-2 px-3 py-1.5 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          Upload file
        </button>
      </div>

      {stats && (
        <div className="rounded-lg border border-input bg-muted/30 p-3 text-sm space-y-1">
          <p className="font-medium text-foreground">Detection</p>
          <p className="text-muted-foreground">CRLF lines: {stats.crlf}</p>
          <p className="text-muted-foreground">LF-only lines: {stats.lfOnly}</p>
          <p className="text-muted-foreground">CR-only lines: {stats.crOnly}</p>
          <p className="text-muted-foreground">UTF-8 BOM: {stats.hasBom ? 'Yes' : 'No'}</p>
          {stats.mixed && (
            <p className="text-amber-800 dark:text-amber-200">Mixed line endings detected in this file.</p>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Target line endings</label>
        <select
          value={target}
          onChange={e => setTarget(e.target.value as TargetEol)}
          className="w-full max-w-xs rounded-lg border border-input bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="lf">LF (Unix / macOS)</option>
          <option value="crlf">CRLF (Windows)</option>
          <option value="cr">CR (classic Mac)</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={removeBom} onChange={e => setRemoveBom(e.target.checked)} className="h-4 w-4 rounded border-input" />
          Remove BOM
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={trailingNewline} onChange={e => setTrailingNewline(e.target.checked)} className="h-4 w-4 rounded border-input" />
          Ensure trailing newline
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={convert}
          className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
        >
          Convert
        </button>
        <button
          type="button"
          onClick={download}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-input bg-background text-sm font-medium hover:bg-muted transition-colors"
        >
          <Download className="h-4 w-4" /> Download
        </button>
      </div>

      {output && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Preview</label>
          <textarea
            value={output}
            readOnly
            className="font-code w-full min-h-[140px] rounded-lg border border-input bg-muted/50 p-3 text-sm text-foreground resize-y"
            spellCheck={false}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Line endings are invisible in the preview; the downloaded file contains the converted bytes.
          </p>
        </div>
      )}
    </div>
  );
}
