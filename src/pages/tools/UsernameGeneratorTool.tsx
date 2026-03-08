import { useState, useCallback } from 'react';
import { Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { generateUsernames } from '@/utils/tool-logic/text-tools';
import { trackEvent } from '@/lib/analytics';
import type { ToolConfig } from '@/lib/tools-registry';

interface Props { tool: ToolConfig; }

export function UsernameGeneratorTool({ tool }: Props) {
  const [count, setCount] = useState(5);
  const [output, setOutput] = useState('');

  const handleGenerate = useCallback(() => {
    setOutput(generateUsernames(count));
    trackEvent({ type: 'tool_action_run', slug: tool.slug, action: 'generate' });
  }, [count, tool.slug]);

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-3">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Count</label>
          <input type="number" min={1} max={50} value={count} onChange={e => setCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 5)))} className="font-code w-24 rounded-lg border border-input bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <button onClick={handleGenerate} className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors inline-flex items-center gap-2">
          <RefreshCw className="h-4 w-4" /> Generate
        </button>
      </div>
      {output && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-foreground">Generated Usernames</label>
            <button onClick={async () => { await navigator.clipboard.writeText(output); toast.success('Copied'); trackEvent({ type: 'copy_result', slug: tool.slug }); }} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"><Copy className="h-3 w-3" /> Copy</button>
          </div>
          <textarea value={output} readOnly className="font-code w-full min-h-[180px] rounded-lg border border-input bg-muted/50 p-4 text-sm text-foreground resize-y" spellCheck={false} />
        </div>
      )}
    </div>
  );
}
