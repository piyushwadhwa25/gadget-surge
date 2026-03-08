import { useState, useCallback } from 'react';
import { Copy, Trash2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { caseConvert } from '@/utils/tool-logic/text-tools';
import { trackEvent } from '@/lib/analytics';
import type { ToolConfig } from '@/lib/tools-registry';

interface Props { tool: ToolConfig; }

const modes = [
  { key: 'upper', label: 'UPPERCASE' },
  { key: 'lower', label: 'lowercase' },
  { key: 'title', label: 'Title Case' },
  { key: 'sentence', label: 'Sentence case' },
  { key: 'toggle', label: 'tOGGLE cASE' },
];

export function CaseConverterTool({ tool }: Props) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('upper');

  const handleConvert = useCallback(() => {
    setOutput(caseConvert(input, mode));
    trackEvent({ type: 'tool_action_run', slug: tool.slug, action: mode });
  }, [input, mode, tool.slug]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => { setInput(tool.exampleInput); }} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <FileText className="h-3.5 w-3.5" /> Load Example
        </button>
        <button onClick={() => { setInput(''); setOutput(''); }} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <Trash2 className="h-3.5 w-3.5" /> Clear
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Input Text</label>
        <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Type or paste your text..." className="font-code w-full min-h-[140px] rounded-lg border border-input bg-background p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y" spellCheck={false} />
      </div>

      <div className="flex flex-wrap gap-2">
        {modes.map(m => (
          <button key={m.key} onClick={() => setMode(m.key)} className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${mode === m.key ? 'border-primary bg-primary/10 text-primary' : 'border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
            {m.label}
          </button>
        ))}
      </div>

      <button onClick={handleConvert} disabled={!input} className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:pointer-events-none">
        Convert Case
      </button>

      {output && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-foreground">Output</label>
            <button onClick={async () => { await navigator.clipboard.writeText(output); toast.success('Copied'); trackEvent({ type: 'copy_result', slug: tool.slug }); }} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <Copy className="h-3 w-3" /> Copy
            </button>
          </div>
          <textarea value={output} readOnly className="font-code w-full min-h-[140px] rounded-lg border border-input bg-muted/50 p-4 text-sm text-foreground resize-y" spellCheck={false} />
        </div>
      )}
    </div>
  );
}
