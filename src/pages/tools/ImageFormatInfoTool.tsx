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

export function ImageFormatInfoTool({ tool }: Props) {
  const [preview, setPreview] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [info, setInfo] = useState<Record<string, string> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    const img = new Image();
    img.onload = () => {
      const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
      const g = gcd(img.width, img.height);
      setInfo({
        'File Name': f.name,
        'MIME Type': f.type || 'unknown',
        'File Size': formatBytes(f.size),
        'Width': img.width + ' px',
        'Height': img.height + ' px',
        'Aspect Ratio': `${img.width / g}:${img.height / g}`,
        'Megapixels': ((img.width * img.height) / 1e6).toFixed(2) + ' MP',
        'Last Modified': f.lastModified ? new Date(f.lastModified).toLocaleString() : 'N/A',
      });
      trackEvent({ type: 'tool_action_run', slug: tool.slug, action: 'View Info' });
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
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {Object.entries(info).map(([k, v]) => (
                <tr key={k} className="border-b border-border last:border-0">
                  <td className="px-4 py-2 font-medium text-foreground bg-muted/30 w-40">{k}</td>
                  <td className="px-4 py-2 text-muted-foreground font-mono text-xs">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {preview && <img src={preview} alt="Preview" className="max-h-48 rounded-lg border border-border object-contain" />}
      {!file && <p className="text-sm text-muted-foreground py-8 text-center border border-dashed border-border rounded-lg">Upload an image to view format information.</p>}
    </div>
  );
}
