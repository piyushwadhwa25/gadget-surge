import { useState, useRef, useCallback } from 'react';
import { Download, Upload, Trash2 } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import type { ToolConfig } from '@/lib/tools-registry';

interface Props { tool: ToolConfig; }

export function ImageCropperTool({ tool }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [output, setOutput] = useState('');
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [cx, setCx] = useState(0);
  const [cy, setCy] = useState(0);
  const [cw, setCw] = useState(200);
  const [ch, setCh] = useState(200);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    setFile(f); setOutput('');
    const url = URL.createObjectURL(f);
    setPreview(url);
    const img = new Image();
    img.onload = () => { setOrigW(img.width); setOrigH(img.height); setCw(Math.min(200, img.width)); setCh(Math.min(200, img.height)); setCx(0); setCy(0); };
    img.src = url;
  }, []);

  const process = useCallback(() => {
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = cw; c.height = ch;
      c.getContext('2d')!.drawImage(img, cx, cy, cw, ch, 0, 0, cw, ch);
      setOutput(c.toDataURL('image/png'));
      trackEvent({ type: 'tool_action_run', slug: tool.slug, action: 'Crop' });
    };
    img.src = preview;
  }, [file, cx, cy, cw, ch, preview, tool.slug]);

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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[['X', cx, setCx], ['Y', cy, setCy], ['Width', cw, setCw], ['Height', ch, setCh]].map(([label, val, setter]) => (
              <div key={label as string}>
                <label className="block text-sm font-medium text-foreground mb-1">{label as string} (px)</label>
                <input type="number" value={val as number} onChange={e => (setter as (v: number) => void)(Math.max(0, +e.target.value))} min={0} className="w-full rounded-lg border border-input bg-background p-2 text-sm text-foreground" />
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Original: {origW} × {origH}</p>
          <button onClick={process} className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors">Crop Image</button>
          <img src={preview} alt="Preview" className="max-h-48 rounded-lg border border-border object-contain" />
        </>
      )}

      {output && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Cropped Output ({cw} × {ch})</label>
          <img src={output} alt="Cropped" className="max-h-64 rounded-lg border border-border object-contain" />
          <a href={output} download="cropped.png" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <Download className="h-3.5 w-3.5" /> Download
          </a>
        </div>
      )}

      {!file && <p className="text-sm text-muted-foreground py-8 text-center border border-dashed border-border rounded-lg">Upload an image to crop.</p>}
    </div>
  );
}
