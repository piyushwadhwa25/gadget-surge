import { useState, useRef, useCallback } from 'react';
import { Upload, Trash2, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { trackEvent } from '@/lib/analytics';
import type { ToolConfig } from '@/lib/tools-registry';

interface Props { tool: ToolConfig; }

export function ImageToBase64Tool({ tool }: Props) {
  const [preview, setPreview] = useState('');
  const [output, setOutput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    setFile(f); setOutput('');
    setPreview(URL.createObjectURL(f));
    const reader = new FileReader();
    reader.onload = () => {
      setOutput(reader.result as string);
      trackEvent({ type: 'tool_action_run', slug: tool.slug, action: 'Convert to Base64' });
    };
    reader.readAsDataURL(f);
  }, [tool.slug]);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    toast.success('Base64 copied to clipboard');
    trackEvent({ type: 'copy_result', slug: tool.slug });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => inputRef.current?.click()} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <Upload className="h-3.5 w-3.5" /> Upload Image
        </button>
        <button onClick={() => { setFile(null); setPreview(''); setOutput(''); }} disabled={!file} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-40 disabled:pointer-events-none">
          <Trash2 className="h-3.5 w-3.5" /> Clear
        </button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </div>

      {preview && <img src={preview} alt="Preview" className="max-h-48 rounded-lg border border-border object-contain" />}

      {output && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Base64 Output</label>
            <button onClick={handleCopy} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <Copy className="h-3 w-3" /> Copy
            </button>
          </div>
          <textarea value={output} readOnly className="font-code w-full min-h-[120px] rounded-lg border border-input bg-muted/50 p-4 text-xs text-foreground resize-y" />
          <p className="text-xs text-muted-foreground">{output.length.toLocaleString()} characters</p>
        </div>
      )}

      {!file && <p className="text-sm text-muted-foreground py-8 text-center border border-dashed border-border rounded-lg">Upload an image to convert to Base64.</p>}
    </div>
  );
}
