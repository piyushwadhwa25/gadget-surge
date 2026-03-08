import { useState, useRef, useCallback } from 'react';
import { Download, Upload, Trash2, RotateCw } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import type { ToolConfig } from '@/lib/tools-registry';

interface Props { tool: ToolConfig; }

export function ImageRotatorTool({ tool }: Props) {
  const [preview, setPreview] = useState('');
  const [output, setOutput] = useState('');
  const [angle, setAngle] = useState(90);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    setFile(f); setOutput('');
    setPreview(URL.createObjectURL(f));
  }, []);

  const process = useCallback(() => {
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const rad = (angle * Math.PI) / 180;
      const swap = angle === 90 || angle === 270;
      const c = document.createElement('canvas');
      c.width = swap ? img.height : img.width;
      c.height = swap ? img.width : img.height;
      const ctx = c.getContext('2d')!;
      ctx.translate(c.width / 2, c.height / 2);
      ctx.rotate(rad);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      setOutput(c.toDataURL('image/png'));
      trackEvent({ type: 'tool_action_run', slug: tool.slug, action: 'Rotate' });
    };
    img.src = preview;
  }, [file, angle, preview, tool.slug]);

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
          <div className="flex flex-wrap gap-2">
            {[90, 180, 270].map(a => (
              <button key={a} onClick={() => setAngle(a)} className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${angle === a ? 'border-primary bg-primary/10 text-primary' : 'border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                <RotateCw className="h-3.5 w-3.5 inline mr-1" />{a}°
              </button>
            ))}
          </div>
          <button onClick={process} className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors">Rotate Image</button>
          <img src={preview} alt="Preview" className="max-h-48 rounded-lg border border-border object-contain" />
        </>
      )}

      {output && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Rotated {angle}°</label>
          <img src={output} alt="Rotated" className="max-h-64 rounded-lg border border-border object-contain" />
          <a href={output} download={`rotated-${angle}.png`} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <Download className="h-3.5 w-3.5" /> Download
          </a>
        </div>
      )}

      {!file && <p className="text-sm text-muted-foreground py-8 text-center border border-dashed border-border rounded-lg">Upload an image to rotate.</p>}
    </div>
  );
}
