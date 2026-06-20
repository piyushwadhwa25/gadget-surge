import { useState, useRef, useCallback } from 'react';
import { Upload, Trash2, Download, FileText } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { trackEvent } from '@/lib/analytics';
import { formatBytes, downloadBlob, parsePdfError, parsePageRanges } from '@/utils/pdf-helpers';
import type { ToolConfig } from '@/lib/tools-registry';

interface Props {
  tool: ToolConfig;
}

type SplitMode = 'every-n' | 'ranges';

export function PdfSplitterTool({ tool }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [mode, setMode] = useState<SplitMode>('every-n');
  const [everyN, setEveryN] = useState('1');
  const [rangeInput, setRangeInput] = useState('');
  const [error, setError] = useState('');
  const [splitting, setSplitting] = useState(false);
  const [lastSplitCount, setLastSplitCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback(async (f: File) => {
    setError('');
    setLastSplitCount(0);
    try {
      const bytes = await f.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      setFile(f);
      setPageCount(doc.getPageCount());
    } catch (err) {
      setFile(null);
      setPageCount(0);
      setError(parsePdfError(err));
    }
  }, []);

  const downloadPart = async (source: PDFDocument, indices: number[], filename: string) => {
    const part = await PDFDocument.create();
    const copied = await part.copyPages(source, indices);
    copied.forEach(page => part.addPage(page));
    const bytes = await part.save();
    downloadBlob(new Blob([bytes], { type: 'application/pdf' }), filename);
  };

  const handleSplit = async () => {
    setError('');
    setLastSplitCount(0);
    if (!file) {
      setError('Upload a PDF first.');
      return;
    }

    setSplitting(true);
    try {
      const bytes = await file.arrayBuffer();
      const source = await PDFDocument.load(bytes);
      const total = source.getPageCount();
      const baseName = file.name.replace(/\.pdf$/i, '') || 'document';
      let partNum = 0;

      if (mode === 'every-n') {
        const n = parseInt(everyN, 10);
        if (isNaN(n) || n < 1) {
          throw new Error('Enter a valid number of pages (1 or more).');
        }
        if (n > total) {
          throw new Error(`Split size (${n}) is larger than the PDF page count (${total}).`);
        }

        for (let start = 0; start < total; start += n) {
          partNum++;
          const end = Math.min(start + n, total);
          const indices = Array.from({ length: end - start }, (_, i) => start + i);
          await downloadPart(source, indices, `${baseName}-part-${partNum}.pdf`);
        }
        setLastSplitCount(partNum);
      } else {
        const ranges = parsePageRanges(rangeInput, total);
        for (const [start, end] of ranges) {
          partNum++;
          const indices = Array.from({ length: end - start + 1 }, (_, i) => start - 1 + i);
          const label = start === end ? `page-${start}` : `pages-${start}-${end}`;
          await downloadPart(source, indices, `${baseName}-${label}.pdf`);
        }
        setLastSplitCount(partNum);
      }

      trackEvent({ type: 'tool_action_run', slug: tool.slug, action: 'Split' });
    } catch (err) {
      setError(err instanceof Error ? err.message : parsePdfError(err));
    } finally {
      setSplitting(false);
    }
  };

  const previewSplitCount = () => {
    if (pageCount === 0) return null;
    if (mode === 'every-n') {
      const n = parseInt(everyN, 10);
      if (isNaN(n) || n < 1) return null;
      if (n > pageCount) return 'Split size exceeds page count';
      return `${Math.ceil(pageCount / n)} file${Math.ceil(pageCount / n) !== 1 ? 's' : ''}`;
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Upload className="h-3.5 w-3.5" /> Upload PDF
        </button>
        <button
          onClick={() => { setFile(null); setPageCount(0); setEveryN('1'); setRangeInput(''); setLastSplitCount(0); setError(''); }}
          disabled={!file}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          <Trash2 className="h-3.5 w-3.5" /> Clear
        </button>
        <input ref={inputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={e => e.target.files?.[0] && loadFile(e.target.files[0])} />
      </div>

      {file && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="h-4 w-4" />
          <span className="text-foreground truncate">{file.name}</span>
          <span>· {pageCount} page{pageCount !== 1 ? 's' : ''} · {formatBytes(file.size)}</span>
        </div>
      )}

      {pageCount > 0 && (
        <>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setMode('every-n')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                mode === 'every-n'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-input bg-background text-muted-foreground hover:bg-muted'
              }`}
            >
              Every N pages
            </button>
            <button
              onClick={() => setMode('ranges')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                mode === 'ranges'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-input bg-background text-muted-foreground hover:bg-muted'
              }`}
            >
              Page ranges
            </button>
          </div>

          {mode === 'every-n' ? (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Pages per file</label>
              <input
                type="number"
                min={1}
                max={pageCount}
                value={everyN}
                onChange={e => setEveryN(e.target.value)}
                className="w-32 rounded-lg border border-input bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {previewSplitCount() && (
                <p className="text-xs text-muted-foreground mt-1">Will create {previewSplitCount()}</p>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Page ranges</label>
              <input
                value={rangeInput}
                onChange={e => setRangeInput(e.target.value)}
                placeholder="e.g. 1-3, 5-7, 10"
                className="font-code w-full rounded-lg border border-input bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <p className="text-xs text-muted-foreground mt-1">Each range becomes a separate PDF download.</p>
            </div>
          )}

          <button
            onClick={handleSplit}
            disabled={splitting}
            className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {splitting ? 'Splitting…' : 'Split & Download'}
          </button>
        </>
      )}

      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">{error}</div>
      )}

      {lastSplitCount > 0 && (
        <div className="rounded-lg border border-input bg-muted/30 p-4 space-y-1">
          <p className="text-sm font-medium text-foreground">
            Downloaded {lastSplitCount} PDF file{lastSplitCount !== 1 ? 's' : ''}
          </p>
          <button
            onClick={handleSplit}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors mt-2"
          >
            <Download className="h-3.5 w-3.5" /> Split again
          </button>
        </div>
      )}

      {!file && !error && (
        <p className="text-sm text-muted-foreground py-8 text-center border border-dashed border-border rounded-lg">Upload a PDF to split it into smaller files.</p>
      )}
    </div>
  );
}
