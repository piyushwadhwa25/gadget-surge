import { useState, useRef, useCallback } from 'react';
import { Download, Upload, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { trackEvent } from '@/lib/analytics';
import type { ToolConfig } from '@/lib/tools-registry';

interface Props { tool: ToolConfig; }

export function ImageResizerTool({ tool }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [output, setOutput] = useState('');
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [lock, setLock] = useState(true);
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setOutput('');
    const url = URL.createObjectURL(f);
    setPreview(url);
    const img = new Image();
    img.onload = () => { setOrigW(img.width); setOrigH(img.height); setWidth(img.width); setHeight(img.height); };
    img.src = url;
  }, []);

  const handleWidthChange = (w: number) => {
    setWidth(w);
    if (lock && origW) setHeight(Math.round((w / origW) * origH));
  };

  const handleHeightChange = (h: number) => {
    setHeight(h);
    if (lock && origH) setWidth(Math.round((h / origH) * origW));
  };

  const process = useCallback(() => {
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = width; c.height = height;
      c.getContext('2d')!.drawImage(img, 0, 0, width, height);
      setOutput(c.toDataURL('image/png'));
      trackEvent({ type: 'tool_action_run', slug: tool.slug, action: 'Resize' });
    };
    img.src = preview;
  }, [file, width, height, preview, tool.slug]);

  const clear = () => { setFile(null); setPreview(''); setOutput(''); };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => inputRef.current?.click()} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <Upload className="h-3.5 w-3.5" /> Upload Image
        </button>
        <button onClick={clear} disabled={!file} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-40 disabled:pointer-events-none">
          <Trash2 className="h-3.5 w-3.5" /> Clear
        </button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </div>

      {preview && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Width (px)</label>
              <input type="number" value={width} onChange={e => handleWidthChange(+e.target.value)} min={1} className="w-full rounded-lg border border-input bg-background p-2 text-sm text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Height (px)</label>
              <input type="number" value={height} onChange={e => handleHeightChange(+e.target.value)} min={1} className="w-full rounded-lg border border-input bg-background p-2 text-sm text-foreground" />
            </div>
            <label className="inline-flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
              <input type="checkbox" checked={lock} onChange={e => setLock(e.target.checked)} className="rounded" /> Lock aspect ratio
            </label>
          </div>
          <button onClick={process} className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors">Resize Image</button>
          <p className="text-xs text-muted-foreground">Original: {origW} × {origH}</p>
          <img src={preview} alt="Preview" className="max-h-48 rounded-lg border border-border object-contain" />
        </>
      )}

      {output && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Resized Output ({width} × {height})</label>
          <img src={output} alt="Resized" className="max-h-64 rounded-lg border border-border object-contain" />
          <a href={output} download={`resized-${width}x${height}.png`} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <Download className="h-3.5 w-3.5" /> Download
          </a>
        </div>
      )}

      {!file && <p className="text-sm text-muted-foreground py-8 text-center border border-dashed border-border rounded-lg">Upload an image to get started.</p>}
    </div>
  );
}
