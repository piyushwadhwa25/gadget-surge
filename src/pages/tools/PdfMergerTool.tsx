import { useState, useRef, useCallback } from 'react';
import { Upload, Trash2, Download, ChevronUp, ChevronDown, FileText } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { trackEvent } from '@/lib/analytics';
import { formatBytes, downloadBlob, parsePdfError } from '@/utils/pdf-helpers';
import type { ToolConfig } from '@/lib/tools-registry';

interface Props {
  tool: ToolConfig;
}

interface PdfFileItem {
  id: string;
  file: File;
  pageCount: number;
}

export function PdfMergerTool({ tool }: Props) {
  const [items, setItems] = useState<PdfFileItem[]>([]);
  const [error, setError] = useState('');
  const [merging, setMerging] = useState(false);
  const [result, setResult] = useState<{ size: number; pageCount: number } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const totalInputSize = items.reduce((sum, i) => sum + i.file.size, 0);
  const totalInputPages = items.reduce((sum, i) => sum + i.pageCount, 0);

  const addFiles = useCallback(async (files: FileList | File[]) => {
    setError('');
    setResult(null);
    const pdfFiles = Array.from(files).filter(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
    if (pdfFiles.length === 0) {
      setError('Please upload PDF files only.');
      return;
    }

    const newItems: PdfFileItem[] = [];
    for (const file of pdfFiles) {
      try {
        const bytes = await file.arrayBuffer();
        const doc = await PDFDocument.load(bytes);
        newItems.push({
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          file,
          pageCount: doc.getPageCount(),
        });
      } catch (err) {
        setError(parsePdfError(err));
        return;
      }
    }
    setItems(prev => [...prev, ...newItems]);
  }, []);

  const moveItem = (index: number, direction: -1 | 1) => {
    const next = index + direction;
    if (next < 0 || next >= items.length) return;
    setItems(prev => {
      const copy = [...prev];
      [copy[index], copy[next]] = [copy[next], copy[index]];
      return copy;
    });
    setResult(null);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    setResult(null);
  };

  const handleMerge = async () => {
    setError('');
    setResult(null);
    if (items.length === 0) {
      setError('Upload at least one PDF to merge.');
      return;
    }

    setMerging(true);
    try {
      const merged = await PDFDocument.create();
      for (const item of items) {
        const bytes = await item.file.arrayBuffer();
        const doc = await PDFDocument.load(bytes);
        const indices = doc.getPageIndices();
        const copied = await merged.copyPages(doc, indices);
        copied.forEach(page => merged.addPage(page));
      }

      const mergedBytes = await merged.save();
      const blob = new Blob([mergedBytes], { type: 'application/pdf' });
      downloadBlob(blob, 'merged.pdf');
      setResult({ size: mergedBytes.length, pageCount: merged.getPageCount() });
      trackEvent({ type: 'tool_action_run', slug: tool.slug, action: 'Merge' });
    } catch (err) {
      setError(parsePdfError(err));
    } finally {
      setMerging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Upload className="h-3.5 w-3.5" /> Upload PDFs
        </button>
        <button
          onClick={() => { setItems([]); setResult(null); setError(''); }}
          disabled={items.length === 0}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          <Trash2 className="h-3.5 w-3.5" /> Clear
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple
          className="hidden"
          onChange={e => e.target.files && addFiles(e.target.files)}
        />
      </div>

      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`rounded-lg border border-dashed p-6 text-center transition-colors ${dragOver ? 'border-primary bg-primary/5' : 'border-border'}`}
      >
        <p className="text-sm text-muted-foreground">Drag and drop PDF files here, or click Upload PDFs</p>
      </div>

      {items.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Input: {items.length} file{items.length !== 1 ? 's' : ''}, {totalInputPages} page{totalInputPages !== 1 ? 's' : ''}, {formatBytes(totalInputSize)}
          </p>
          <ul className="space-y-2">
            {items.map((item, index) => (
              <li key={item.id} className="flex items-center gap-2 rounded-lg border border-input bg-muted/30 px-3 py-2 text-sm">
                <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="flex-1 truncate text-foreground">{item.file.name}</span>
                <span className="text-xs text-muted-foreground shrink-0">{item.pageCount} pg · {formatBytes(item.file.size)}</span>
                <button
                  onClick={() => moveItem(index, -1)}
                  disabled={index === 0}
                  className="p-1 rounded hover:bg-muted disabled:opacity-30"
                  aria-label="Move up"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => moveItem(index, 1)}
                  disabled={index === items.length - 1}
                  className="p-1 rounded hover:bg-muted disabled:opacity-30"
                  aria-label="Move down"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button onClick={() => removeItem(item.id)} className="p-1 rounded hover:bg-muted text-muted-foreground" aria-label="Remove">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {items.length > 0 && (
        <button
          onClick={handleMerge}
          disabled={merging}
          className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          {merging ? 'Merging…' : 'Merge PDFs'}
        </button>
      )}

      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">{error}</div>
      )}

      {result && (
        <div className="rounded-lg border border-input bg-muted/30 p-4 space-y-2">
          <p className="text-sm font-medium text-foreground">Merged PDF ready</p>
          <p className="text-xs text-muted-foreground">
            Output: {result.pageCount} page{result.pageCount !== 1 ? 's' : ''}, {formatBytes(result.size)}
            {' '}(was {totalInputPages} pages, {formatBytes(totalInputSize)})
          </p>
          <button
            onClick={handleMerge}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Download className="h-3.5 w-3.5" /> Download again
          </button>
        </div>
      )}

      {items.length === 0 && !error && (
        <p className="text-sm text-muted-foreground py-4 text-center">Upload two or more PDFs to combine them in order.</p>
      )}
    </div>
  );
}
