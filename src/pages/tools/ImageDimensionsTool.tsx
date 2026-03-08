import { useState, useRef, useCallback } from 'react';
import { Upload, Trash2 } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import type { ToolConfig } from '@/lib/tools-registry';

interface Props { tool: ToolConfig; }

function formatBytes(b: number) {
  if (b < 1024) return b + ' B';
  if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
  return (b / 1048576).toFixed(2) + ' MB';
}

function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b); }

export function ImageDimensionsTool({ tool }: Props) {
  const [preview, setPreview] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [info, setInfo] = useState<{ w: number; h: number; size: number; type: string; ratio: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    const img = new Image();
    img.onload = () => {
      const g = gcd(img.width, img.height);
      setInfo({ w: img.width, h: img.height, size: f.size, type: f.type || 'unknown', ratio: `${img.width / g}:${img.height / g}` });
      trackEvent({ type: 'tool_action_run', slug: tool.slug, action: 'Check Dimensions' });
    };
    img.src = URL.createObjectURL(f);
  }, [tool.slug]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => inputRef.current?.click()} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <Upload className="h-3.5 w-3.5" /> Upload Image
        </button>
        <button onClick={() => { setFile(null); setPreview(''); setInfo(null); }} disabled={!file} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-40 disabled:pointer-events-none">
          <Trash2 className="h-3.5 w-3.5" /> Clear
        </button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </div>

      {info && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            ['Width', info.w + ' px'],
            ['Height', info.h + ' px'],
            ['File Size', formatBytes(info.size)],
            ['Format', info.type],
            ['Aspect Ratio', info.ratio],
            ['Megapixels', ((info.w * info.h) / 1e6).toFixed(2) + ' MP'],
          ].map(([l, v]) => (
            <div key={l} className="p-3 rounded-lg border border-border bg-card">
              <div className="text-xs text-muted-foreground">{l}</div>
              <div className="text-sm font-semibold text-foreground">{v}</div>
            </div>
          ))}
        </div>
      )}

      {preview && <img src={preview} alt="Preview" className="max-h-48 rounded-lg border border-border object-contain" />}
      {!file && <p className="text-sm text-muted-foreground py-8 text-center border border-dashed border-border rounded-lg">Upload an image to check its dimensions.</p>}
    </div>
  );
}
