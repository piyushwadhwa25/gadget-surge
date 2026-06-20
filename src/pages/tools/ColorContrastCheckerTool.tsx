import { useState, useCallback } from 'react';
import { Copy, Trash2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { calculateColorContrast, parseHexForContrast } from '@/utils/tool-logic/calculator-tools';
import type { ToolConfig } from '@/lib/tools-registry';

interface Props {
  tool: ToolConfig;
}

function toHex(input: string): string {
  const [r, g, b] = parseHexForContrast(input);
  return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('').toUpperCase();
}

export function ColorContrastCheckerTool({ tool: _tool }: Props) {
  const [foreground, setForeground] = useState('#FFFFFF');
  const [background, setBackground] = useState('#1A1A2E');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleCheck = useCallback(() => {
    setError('');
    setOutput('');
    try {
      const result = calculateColorContrast(`${foreground}\n${background}`);
      setOutput(result);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Invalid colors');
    }
  }, [foreground, background]);

  const handleLoadExample = () => {
    setForeground('#FFFFFF');
    setBackground('#1A1A2E');
    setOutput('');
    setError('');
  };

  let fgHex = foreground;
  let bgHex = background;
  try {
    fgHex = toHex(foreground);
    bgHex = toHex(background);
  } catch {
    // preview falls back to raw values
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button onClick={handleLoadExample} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <FileText className="h-3.5 w-3.5" /> Load Example
        </button>
        <button onClick={() => { setForeground(''); setBackground(''); setOutput(''); setError(''); }} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <Trash2 className="h-3.5 w-3.5" /> Clear
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Foreground (text)</label>
          <div className="flex gap-2">
            <input type="color" value={fgHex.startsWith('#') && fgHex.length === 7 ? fgHex : '#FFFFFF'} onChange={e => setForeground(e.target.value)} className="h-10 w-12 rounded border border-input cursor-pointer" />
            <input value={foreground} onChange={e => setForeground(e.target.value)} placeholder="#FFFFFF" className="font-code flex-1 rounded-lg border border-input bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" spellCheck={false} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Background</label>
          <div className="flex gap-2">
            <input type="color" value={bgHex.startsWith('#') && bgHex.length === 7 ? bgHex : '#1A1A2E'} onChange={e => setBackground(e.target.value)} className="h-10 w-12 rounded border border-input cursor-pointer" />
            <input value={background} onChange={e => setBackground(e.target.value)} placeholder="#1A1A2E" className="font-code flex-1 rounded-lg border border-input bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" spellCheck={false} />
          </div>
        </div>
      </div>

      <div
        className="rounded-lg border border-input p-6 min-h-[100px] flex flex-col justify-center"
        style={{ backgroundColor: bgHex, color: fgHex }}
      >
        <p className="text-lg font-semibold">Sample text preview</p>
        <p className="text-sm mt-1 opacity-90">The quick brown fox jumps over the lazy dog.</p>
        <p className="text-xs mt-2 opacity-75">Large text: Heading Example</p>
      </div>

      <button onClick={handleCheck} disabled={!foreground || !background} className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50">
        Check Contrast
      </button>

      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">{error}</div>
      )}

      {output && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-foreground">Results</label>
            <button onClick={async () => { await navigator.clipboard.writeText(output); toast.success('Copied'); }} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted">
              <Copy className="h-3 w-3" /> Copy
            </button>
          </div>
          <pre className="font-code w-full rounded-lg border border-input bg-muted/50 p-4 text-sm text-foreground whitespace-pre-wrap">{output}</pre>
        </div>
      )}
    </div>
  );
}
