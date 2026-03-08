import { useState, useCallback } from 'react';
import { Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { generatePassword } from '@/utils/tool-logic/text-tools';
import { trackEvent } from '@/lib/analytics';
import type { ToolConfig } from '@/lib/tools-registry';

interface Props { tool: ToolConfig; }

export function PasswordGeneratorTool({ tool }: Props) {
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [output, setOutput] = useState('');

  const handleGenerate = useCallback(() => {
    setOutput(generatePassword(length, { upper, lower, numbers, symbols }));
    trackEvent({ type: 'tool_action_run', slug: tool.slug, action: 'generate' });
  }, [length, upper, lower, numbers, symbols, tool.slug]);

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-3 flex-wrap">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Length</label>
          <input type="number" min={4} max={128} value={length} onChange={e => setLength(Math.max(4, Math.min(128, parseInt(e.target.value) || 16)))} className="font-code w-24 rounded-lg border border-input bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <button onClick={handleGenerate} className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors inline-flex items-center gap-2">
          <RefreshCw className="h-4 w-4" /> Generate
        </button>
      </div>
      <div className="flex flex-wrap gap-4">
        {[
          { label: 'Uppercase (A-Z)', checked: upper, set: setUpper },
          { label: 'Lowercase (a-z)', checked: lower, set: setLower },
          { label: 'Numbers (0-9)', checked: numbers, set: setNumbers },
          { label: 'Symbols (!@#$)', checked: symbols, set: setSymbols },
        ].map(opt => (
          <label key={opt.label} className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" checked={opt.checked} onChange={e => opt.set(e.target.checked)} className="rounded border-input" />
            {opt.label}
          </label>
        ))}
      </div>
      {output && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-foreground">Generated Password</label>
            <button onClick={async () => { await navigator.clipboard.writeText(output); toast.success('Copied'); trackEvent({ type: 'copy_result', slug: tool.slug }); }} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"><Copy className="h-3 w-3" /> Copy</button>
          </div>
          <div className="font-code text-lg bg-muted/50 rounded-lg p-4 border border-input text-foreground break-all select-all">{output}</div>
        </div>
      )}
    </div>
  );
}
