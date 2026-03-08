import { useState, useCallback } from 'react';
import { Download, Trash2, FileText } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import type { ToolConfig } from '@/lib/tools-registry';

interface Props { tool: ToolConfig; }

export function Base64ToImageTool({ tool }: Props) {
  const [input, setInput] = useState('');
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');

  const process = useCallback(() => {
    setError(''); setPreview('');
    if (!input.trim()) { setError('Please paste a Base64 string.'); return; }
    let src = input.trim();
    if (!src.startsWith('data:')) {
      src = `data:image/png;base64,${src}`;
    }
    const img = new Image();
    img.onload = () => {
      setPreview(src);
      trackEvent({ type: 'tool_action_run', slug: tool.slug, action: 'Decode' });
    };
    img.onerror = () => setError('Invalid Base64 image data.');
    img.src = src;
  }, [input, tool.slug]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setInput('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVQYV2P8z8DwHwMJgHGUIjwUAQBjIgMdFP8vQQAAAABJRU5ErkJggg==')} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <FileText className="h-3.5 w-3.5" /> Load Example
        </button>
        <button onClick={() => { setInput(''); setPreview(''); setError(''); }} disabled={!input} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-40 disabled:pointer-events-none">
          <Trash2 className="h-3.5 w-3.5" /> Clear
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Base64 Input</label>
        <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Paste Base64 string here (with or without data: prefix)..." className="font-code w-full min-h-[120px] rounded-lg border border-input bg-background p-4 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y" />
      </div>

      <button onClick={process} disabled={!input.trim()} className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:pointer-events-none">Decode Image</button>

      {error && <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">⚠ {error}</div>}

      {preview && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Decoded Image</label>
          <img src={preview} alt="Decoded" className="max-h-64 rounded-lg border border-border object-contain" />
          <a href={preview} download="decoded-image.png" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <Download className="h-3.5 w-3.5" /> Download
          </a>
        </div>
      )}
    </div>
  );
}
