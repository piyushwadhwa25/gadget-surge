import { useState, useRef, useCallback } from 'react';
import { Upload, Trash2, Download, FileText } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { trackEvent } from '@/lib/analytics';
import { formatBytes, downloadBlob, parsePdfError, parsePageList } from '@/utils/pdf-helpers';
import type { ToolConfig } from '@/lib/tools-registry';

interface Props {
  tool: ToolConfig;
}

export function PdfPageRemoverTool({ tool }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageInput, setPageInput] = useState('');
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ size: number; pageCount: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback(async (f: File) => {
    setError('');
    setResult(null);
    setPageInput('');
    setSelectedPages(new Set());
    try {
      const bytes = await f.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const count = doc.getPageCount();
      setFile(f);
      setPageCount(count);
    } catch (err) {
      setFile(null);
      setPageCount(0);
      setError(parsePdfError(err));
    }
  }, []);

  const syncFromInput = (value: string) => {
    setPageInput(value);
    setResult(null);
    if (!value.trim() || pageCount === 0) {
      setSelectedPages(new Set());
      return;
    }
    try {
      const pages = parsePageList(value, pageCount);
      setSelectedPages(new Set(pages));
      setError('');
    } catch (err) {
      setSelectedPages(new Set());
      setError(err instanceof Error ? err.message : 'Invalid page list.');
    }
  };

  const togglePage = (page: number) => {
    setResult(null);
    setSelectedPages(prev => {
      const next = new Set(prev);
      if (next.has(page)) next.delete(page);
      else next.add(page);
      setPageInput([...next].sort((a, b) => a - b).join(', '));
      return next;
    });
    setError('');
  };

  const handleRemove = async () => {
    setError('');
    setResult(null);
    if (!file) {
      setError('Upload a PDF first.');
      return;
    }

    let toRemove: number[];
    try {
      toRemove = parsePageList(pageInput, pageCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid page list.');
      return;
    }

    if (toRemove.length === 0) {
      setError('Select or enter pages to remove.');
      return;
    }
    if (toRemove.length >= pageCount) {
      setError('Cannot remove all pages. At least one page must remain.');
      return;
    }

    setProcessing(true);
    try {
      const bytes = await file.arrayBuffer();
      const source = await PDFDocument.load(bytes);
      const removeSet = new Set(toRemove);
      const keepIndices = source.getPageIndices().filter(i => !removeSet.has(i + 1));

      const output = await PDFDocument.create();
      const copied = await output.copyPages(source, keepIndices);
      copied.forEach(page => output.addPage(page));

      const outBytes = await output.save();
      const blob = new Blob([outBytes], { type: 'application/pdf' });
      const baseName = file.name.replace(/\.pdf$/i, '') || 'document';
      downloadBlob(blob, `${baseName}-edited.pdf`);
      setResult({ size: outBytes.length, pageCount: output.getPageCount() });
      trackEvent({ type: 'tool_action_run', slug: tool.slug, action: 'Remove pages' });
    } catch (err) {
      setError(parsePdfError(err));
    } finally {
      setProcessing(false);
    }
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
          onClick={() => { setFile(null); setPageCount(0); setPageInput(''); setSelectedPages(new Set()); setResult(null); setError(''); }}
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
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Pages to remove</label>
            <input
              value={pageInput}
              onChange={e => syncFromInput(e.target.value)}
              placeholder="e.g. 2, 5, 7-9"
              className="font-code w-full rounded-lg border border-input bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="text-xs text-muted-foreground mt-1">Enter page numbers or ranges, separated by commas.</p>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground mb-2">Or select pages</p>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
              {Array.from({ length: pageCount }, (_, i) => i + 1).map(page => (
                <label
                  key={page}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs cursor-pointer transition-colors ${
                    selectedPages.has(page)
                      ? 'border-destructive/50 bg-destructive/10 text-destructive'
                      : 'border-input bg-background text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={selectedPages.has(page)}
                    onChange={() => togglePage(page)}
                  />
                  {page}
                </label>
              ))}
            </div>
          </div>

          {selectedPages.size > 0 && (
            <p className="text-xs text-muted-foreground">
              Removing {selectedPages.size} page{selectedPages.size !== 1 ? 's' : ''} → {pageCount - selectedPages.size} remaining
            </p>
          )}

          <button
            onClick={handleRemove}
            disabled={processing || selectedPages.size === 0}
            className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {processing ? 'Processing…' : 'Remove Pages & Download'}
          </button>
        </>
      )}

      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">{error}</div>
      )}

      {result && file && (
        <div className="rounded-lg border border-input bg-muted/30 p-4 space-y-1">
          <p className="text-sm font-medium text-foreground">Download started</p>
          <p className="text-xs text-muted-foreground">
            Before: {pageCount} pages, {formatBytes(file.size)} → After: {result.pageCount} pages, {formatBytes(result.size)}
          </p>
          <button
            onClick={handleRemove}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors mt-2"
          >
            <Download className="h-3.5 w-3.5" /> Download again
          </button>
        </div>
      )}

      {!file && !error && (
        <p className="text-sm text-muted-foreground py-8 text-center border border-dashed border-border rounded-lg">Upload a PDF to select pages to remove.</p>
      )}
    </div>
  );
}
