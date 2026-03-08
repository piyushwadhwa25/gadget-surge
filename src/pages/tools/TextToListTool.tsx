import { useState, useCallback } from 'react';
import { Copy, Trash2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { textToList } from '@/utils/tool-logic/text-tools';
import { trackEvent } from '@/lib/analytics';
import type { ToolConfig } from '@/lib/tools-registry';

interface Props { tool: ToolConfig; }

export function TextToListTool({ tool }: Props) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [format, setFormat] = useState<'bullet' | 'numbered'>('bullet');

  const handleConvert = useCallback(() => {
    setOutput(textToList(input, format));
    trackEvent({ type: 'tool_action_run', slug: tool.slug, action: format });
  }, [input, format, tool.slug]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setInput(tool.exampleInput)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"><FileText className="h-3.5 w-3.5" /> Load Example</button>
        <button onClick={() => { setInput(''); setOutput(''); }} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"><Trash2 className="h-3.5 w-3.5" /> Clear</button>
      </div>
      <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Enter comma-separated or line-separated items..." className="font-code w-full min-h-[140px] rounded-lg border border-input bg-background p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y" spellCheck={false} />
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="format" checked={format === 'bullet'} onChange={() => setFormat('bullet')} /> Bullet list</label>
        <label className="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="format" checked={format === 'numbered'} onChange={() => setFormat('numbered')} /> Numbered list</label>
      </div>
      <button onClick={handleConvert} disabled={!input} className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:pointer-events-none">Convert to List</button>
      {output && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-foreground">List Output</label>
            <button onClick={async () => { await navigator.clipboard.writeText(output); toast.success('Copied'); trackEvent({ type: 'copy_result', slug: tool.slug }); }} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"><Copy className="h-3 w-3" /> Copy</button>
          </div>
          <textarea value={output} readOnly className="font-code w-full min-h-[140px] rounded-lg border border-input bg-muted/50 p-4 text-sm text-foreground resize-y" spellCheck={false} />
        </div>
      )}
    </div>
  );
}
