import { useState, useCallback } from 'react';
import { Copy, FileText, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { convertColor } from '@/utils/tool-logic';
import type { ToolConfig } from '@/lib/tools-registry';

interface Props {
  tool: ToolConfig;
}

export function ColorConverterTool({ tool }: Props) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [previewColor, setPreviewColor] = useState('');

  const handleConvert = useCallback(() => {
    setError('');
    setOutput('');
    setPreviewColor('');
    try {
      const result = convertColor(input);
      setOutput(result);
      // Extract HEX for preview
      const hexMatch = result.match(/#[A-F0-9]{6}/);
      if (hexMatch) setPreviewColor(hexMatch[0]);
    } catch (e: any) {
      setError(e.message);
    }
  }, [input]);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => { setInput('#FF5733'); }} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <FileText className="h-3.5 w-3.5" /> Load Example
        </button>
        <button onClick={() => { setInput(''); setOutput(''); setError(''); setPreviewColor(''); }} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <Trash2 className="h-3.5 w-3.5" /> Clear
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Color Input</label>
        <p className="text-xs text-muted-foreground mb-2">Enter HEX (#FF5733), RGB (rgb(255,87,51)), or HSL (hsl(11,100%,60%))</p>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="#FF5733"
          className="font-code w-full rounded-lg border border-input bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          spellCheck={false}
        />
      </div>

      <button onClick={handleConvert} className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors">
        Convert Color
      </button>

      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">{error}</div>
      )}

      {output && (
        <div className="space-y-3">
          {previewColor && (
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-lg border border-border shadow-sm" style={{ backgroundColor: previewColor }} />
              <span className="font-code text-sm text-foreground">{previewColor}</span>
            </div>
          )}
          <div className="relative">
            <pre className="font-code text-sm bg-muted/50 rounded-lg p-4 border border-input text-foreground whitespace-pre-wrap">{output}</pre>
            <button onClick={handleCopy} className="absolute top-2 right-2 p-1.5 rounded-md hover:bg-muted transition-colors">
              <Copy className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
