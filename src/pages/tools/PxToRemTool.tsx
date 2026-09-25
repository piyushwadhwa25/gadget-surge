import { useState, useMemo, useCallback } from 'react';
import { Copy, Download } from 'lucide-react';
import { toast } from 'sonner';
import { trackEvent } from '@/lib/analytics';
import type { ToolConfig } from '@/lib/tools-registry';

interface Props {
  tool: ToolConfig;
}

const REF_PX = [10, 12, 14, 16, 18, 20, 24, 28, 32, 40, 48, 64];

function formatRem(px: number, base: number): string {
  if (!base || base <= 0) return '0rem';
  const rem = px / base;
  const s = rem.toFixed(4).replace(/\.?0+$/, '');
  return `${s}rem`;
}

function formatPxFromRem(rem: number, base: number): string {
  const px = rem * base;
  const s = px.toFixed(4).replace(/\.?0+$/, '');
  return `${s}px`;
}

function convertCss(
  css: string,
  base: number,
  skip1px: boolean,
  skipMedia: boolean,
): string {
  const lines = css.split('\n');
  let inMedia = false;
  let depth = 0;
  return lines
    .map(line => {
      const trimmed = line.trim();
      if (skipMedia) {
        if (/@media\b/i.test(trimmed)) {
          inMedia = true;
          depth = (trimmed.match(/\{/g) || []).length - (trimmed.match(/\}/g) || []).length;
          if (depth < 0) depth = 0;
        } else if (inMedia) {
          depth += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
          if (depth <= 0) inMedia = false;
        }
      }
      if (skipMedia && inMedia) return line;
      return line.replace(/(-?\d*\.?\d+)px\b/g, (match, num) => {
        const n = parseFloat(num);
        if (skip1px && n === 1) return match;
        const rem = n / base;
        const s = rem.toFixed(4).replace(/\.?0+$/, '');
        return `${s}rem`;
      });
    })
    .join('\n');
}

export function PxToRemTool({ tool }: Props) {
  const [base, setBase] = useState(16);
  const [pxVal, setPxVal] = useState('16');
  const [remVal, setRemVal] = useState('1');
  const [cssInput, setCssInput] = useState('');
  const [cssOutput, setCssOutput] = useState('');
  const [skip1px, setSkip1px] = useState(true);
  const [skipMedia, setSkipMedia] = useState(true);

  const safeBase = base > 0 ? base : 16;

  const onPxChange = (v: string) => {
    setPxVal(v);
    const n = parseFloat(v);
    if (!Number.isNaN(n)) setRemVal(formatRem(n, safeBase).replace('rem', ''));
  };

  const onRemChange = (v: string) => {
    setRemVal(v);
    const n = parseFloat(v);
    if (!Number.isNaN(n)) setPxVal(formatPxFromRem(n, safeBase).replace('px', ''));
  };

  const onBaseChange = (n: number) => {
    const b = Math.max(1, n);
    setBase(b);
    const px = parseFloat(pxVal);
    if (!Number.isNaN(px)) setRemVal(formatRem(px, b).replace('rem', ''));
  };

  const refTable = useMemo(
    () => REF_PX.map(px => ({ px, rem: formatRem(px, safeBase) })),
    [safeBase],
  );

  const runCssConvert = useCallback(() => {
    setCssOutput(convertCss(cssInput, safeBase, skip1px, skipMedia));
    trackEvent({ type: 'tool_action_run', slug: tool.slug, action: 'convert-css' });
  }, [cssInput, safeBase, skip1px, skipMedia, tool.slug]);

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
    trackEvent({ type: 'copy_result', slug: tool.slug });
  };

  const downloadCss = () => {
    const blob = new Blob([cssOutput], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.css';
    a.click();
    URL.revokeObjectURL(url);
    trackEvent({ type: 'tool_action_run', slug: tool.slug, action: 'download' });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Base font size (px)</label>
        <input
          type="number"
          min={1}
          value={base}
          onChange={e => onBaseChange(parseInt(e.target.value, 10) || 16)}
          className="font-code w-28 rounded-lg border border-input bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <p className="text-xs text-muted-foreground mt-1">Default browser root size is 16px (1rem).</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Pixels (px)</label>
          <input
            value={pxVal}
            onChange={e => onPxChange(e.target.value)}
            className="font-code w-full rounded-lg border border-input bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            spellCheck={false}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Rem</label>
          <input
            value={remVal}
            onChange={e => onRemChange(e.target.value)}
            className="font-code w-full rounded-lg border border-input bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            spellCheck={false}
          />
        </div>
      </div>

      <div className="border-t border-border pt-4 space-y-3">
        <p className="text-sm font-medium text-foreground">Convert CSS (batch)</p>
        <textarea
          value={cssInput}
          onChange={e => setCssInput(e.target.value)}
          placeholder={`.card {\n  padding: 16px;\n  border: 1px solid #ccc;\n}\n@media (min-width: 768px) {\n  .card { padding: 24px; }\n}`}
          className="font-code w-full min-h-[120px] rounded-lg border border-input bg-background p-3 text-sm text-foreground resize-y focus:outline-none focus:ring-2 focus:ring-ring"
          spellCheck={false}
        />
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={skip1px} onChange={e => setSkip1px(e.target.checked)} className="h-4 w-4 rounded border-input" />
            Skip 1px values (borders)
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={skipMedia} onChange={e => setSkipMedia(e.target.checked)} className="h-4 w-4 rounded border-input" />
            Skip values inside media queries
          </label>
        </div>
        <button
          type="button"
          onClick={runCssConvert}
          className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
        >
          Convert CSS
        </button>
        {cssOutput && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-foreground">Converted CSS</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => copy(cssOutput)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <Copy className="h-3 w-3" /> Copy
                </button>
                <button
                  type="button"
                  onClick={downloadCss}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <Download className="h-3 w-3" /> Download
                </button>
              </div>
            </div>
            <textarea
              value={cssOutput}
              readOnly
              className="font-code w-full min-h-[120px] rounded-lg border border-input bg-muted/50 p-3 text-sm text-foreground resize-y"
              spellCheck={false}
            />
          </div>
        )}
      </div>

      <div>
        <p className="text-sm font-medium text-foreground mb-2">Reference (px → rem at base {safeBase})</p>
        <div className="overflow-x-auto rounded-lg border border-input">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-2 text-left font-medium">px</th>
                <th className="p-2 text-left font-medium">rem</th>
              </tr>
            </thead>
            <tbody>
              {refTable.map(row => (
                <tr key={row.px} className="border-t border-input">
                  <td className="p-2 font-code">{row.px}</td>
                  <td className="p-2 font-code">{row.rem}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
