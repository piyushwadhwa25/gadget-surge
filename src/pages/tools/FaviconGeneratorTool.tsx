import { useState, useRef, useCallback } from 'react';
import { Download, Upload, Trash2 } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import type { ToolConfig } from '@/lib/tools-registry';

interface Props { tool: ToolConfig; }
const SIZES = [16, 32, 48, 64, 128, 180, 192];

export function FaviconGeneratorTool({ tool }: Props) {
  const [preview, setPreview] = useState('');
  const [outputs, setOutputs] = useState<{ size: number; dataUrl: string }[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    setFile(f); setOutputs([]);
    setPreview(URL.createObjectURL(f));
  }, []);

  const process = useCallback(() => {
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const results = SIZES.map(size => {
        const c = document.createElement('canvas');
        c.width = size; c.height = size;
        c.getContext('2d')!.drawImage(img, 0, 0, size, size);
        return { size, dataUrl: c.toDataURL('image/png') };
      });
      setOutputs(results);
      trackEvent({ type: 'tool_action_run', slug: tool.slug, action: 'Generate Favicons' });
    };
    img.src = preview;
  }, [file, preview, tool.slug]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => inputRef.current?.click()} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <Upload className="h-3.5 w-3.5" /> Upload Image
        </button>
        <button onClick={() => { setFile(null); setPreview(''); setOutputs([]); }} disabled={!file} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-40 disabled:pointer-events-none">
          <Trash2 className="h-3.5 w-3.5" /> Clear
        </button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </div>

      {preview && (
        <>
          <p className="text-xs text-muted-foreground">For best results, use a square image.</p>
          <button onClick={process} className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors">Generate Favicons</button>
          <img src={preview} alt="Preview" className="max-h-32 rounded-lg border border-border object-contain" />
        </>
      )}

      {outputs.length > 0 && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Generated Sizes</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {outputs.map(o => (
              <div key={o.size} className="p-3 rounded-lg border border-border bg-card text-center space-y-2">
                <img src={o.dataUrl} alt={`${o.size}x${o.size}`} className="mx-auto border border-border rounded" style={{ width: Math.min(o.size, 64), height: Math.min(o.size, 64), imageRendering: o.size <= 32 ? 'pixelated' : 'auto' }} />
                <div className="text-xs text-muted-foreground">{o.size}×{o.size}</div>
                <a href={o.dataUrl} download={`favicon-${o.size}x${o.size}.png`} className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-medium rounded border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                  <Download className="h-3 w-3" /> Download
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {!file && <p className="text-sm text-muted-foreground py-8 text-center border border-dashed border-border rounded-lg">Upload a square image to generate favicon sizes.</p>}
    </div>
  );
}
