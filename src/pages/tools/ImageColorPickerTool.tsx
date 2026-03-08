import { useState, useRef, useCallback } from 'react';
import { Upload, Trash2, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { trackEvent } from '@/lib/analytics';
import type { ToolConfig } from '@/lib/tools-registry';

interface Props { tool: ToolConfig; }
interface PickedColor { hex: string; rgb: string; }

export function ImageColorPickerTool({ tool }: Props) {
  const [preview, setPreview] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [colors, setColors] = useState<PickedColor[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    setFile(f); setColors([]);
    const url = URL.createObjectURL(f);
    setPreview(url);
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      const c = canvasRef.current;
      if (!c) return;
      c.width = img.width; c.height = img.height;
      c.getContext('2d')!.drawImage(img, 0, 0);
    };
    img.src = url;
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current;
    if (!c) return;
    const rect = c.getBoundingClientRect();
    const scaleX = c.width / rect.width;
    const scaleY = c.height / rect.height;
    const x = Math.round((e.clientX - rect.left) * scaleX);
    const y = Math.round((e.clientY - rect.top) * scaleY);
    const ctx = c.getContext('2d')!;
    const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
    const hex = '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
    const rgb = `rgb(${r}, ${g}, ${b})`;
    setColors(prev => [{ hex, rgb }, ...prev].slice(0, 20));
    trackEvent({ type: 'tool_action_run', slug: tool.slug, action: 'Pick Color' });
  }, [tool.slug]);

  const copyColor = async (val: string) => {
    await navigator.clipboard.writeText(val);
    toast.success('Copied ' + val);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => inputRef.current?.click()} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <Upload className="h-3.5 w-3.5" /> Upload Image
        </button>
        <button onClick={() => { setFile(null); setPreview(''); setColors([]); }} disabled={!file} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-40 disabled:pointer-events-none">
          <Trash2 className="h-3.5 w-3.5" /> Clear
        </button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </div>

      {preview && (
        <>
          <p className="text-xs text-muted-foreground">Click on the image to pick a color.</p>
          <canvas ref={canvasRef} onClick={handleCanvasClick} className="max-w-full max-h-[400px] rounded-lg border border-border cursor-crosshair object-contain" style={{ imageRendering: 'auto' }} />
        </>
      )}

      {colors.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Picked Colors</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {colors.map((c, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg border border-border bg-card">
                <div className="w-8 h-8 rounded border border-border shrink-0" style={{ backgroundColor: c.hex }} />
                <div className="flex-1 text-xs font-mono">
                  <div>{c.hex}</div>
                  <div className="text-muted-foreground">{c.rgb}</div>
                </div>
                <button onClick={() => copyColor(c.hex)} className="p-1 text-muted-foreground hover:text-foreground"><Copy className="h-3.5 w-3.5" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {!file && <p className="text-sm text-muted-foreground py-8 text-center border border-dashed border-border rounded-lg">Upload an image to pick colors from it.</p>}
    </div>
  );
}
