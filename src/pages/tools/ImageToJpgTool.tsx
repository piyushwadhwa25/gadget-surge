import { useState, useRef, useCallback } from 'react';
import { Download, Upload, Trash2 } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import type { ToolConfig } from '@/lib/tools-registry';

interface Props { tool: ToolConfig; }

export function ImageToJpgTool({ tool }: Props) {
  const [preview, setPreview] = useState('');
  const [output, setOutput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(0.9);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    setFile(f); setOutput('');
    setPreview(URL.createObjectURL(f));
  }, []);

  const process = useCallback(() => {
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.width; c.height = img.height;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0);
      setOutput(c.toDataURL('image/jpeg', quality));
      trackEvent({ type: 'tool_action_run', slug: tool.slug, action: 'Convert to JPG' });
    };
    img.src = preview;
  }, [file, quality, preview, tool.slug]);

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

      {preview && (
        <>
          <div className="max-w-xs">
            <label className="block text-sm font-medium text-foreground mb-1">Quality: {Math.round(quality * 100)}%</label>
            <input type="range" min={0.1} max={1} step={0.05} value={quality} onChange={e => setQuality(+e.target.value)} className="w-full" />
          </div>
          <button onClick={process} className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors">Convert to JPG</button>
          <img src={preview} alt="Preview" className="max-h-48 rounded-lg border border-border object-contain" />
        </>
      )}

      {output && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">JPG Output</label>
          <img src={output} alt="JPG" className="max-h-64 rounded-lg border border-border object-contain" />
          <a href={output} download="converted.jpg" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <Download className="h-3.5 w-3.5" /> Download JPG
          </a>
        </div>
      )}

      {!file && <p className="text-sm text-muted-foreground py-8 text-center border border-dashed border-border rounded-lg">Upload an image to convert to JPG.</p>}
    </div>
  );
}
