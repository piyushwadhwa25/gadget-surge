import { useState, useCallback } from 'react';
import { Copy, Download, Trash2, FileText, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface ToolInterfaceProps {
  slug: string;
  inputValue: string;
  onInputChange: (value: string) => void;
  outputValue: string;
  error?: string;
  onProcess: () => void;
  actionLabel?: string;
  exampleInput: string;
  inputPlaceholder?: string;
  outputPlaceholder?: string;
}

export function ToolInterface({
  slug,
  inputValue,
  onInputChange,
  outputValue,
  error,
  onProcess,
  actionLabel = 'Process',
  exampleInput,
  inputPlaceholder = 'Paste your input here...',
  outputPlaceholder = 'Output will appear here...',
}: ToolInterfaceProps) {

  const handleCopy = useCallback(async () => {
    if (!outputValue) return;
    await navigator.clipboard.writeText(outputValue);
    toast.success('Copied to clipboard');
  }, [outputValue]);

  const handleDownload = useCallback(() => {
    if (!outputValue) return;
    const blob = new Blob([outputValue], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug}-output.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded');
  }, [outputValue, slug]);

  const handleClear = useCallback(() => {
    onInputChange('');
  }, [onInputChange]);

  const handleLoadExample = useCallback(() => {
    onInputChange(exampleInput);
  }, [onInputChange, exampleInput]);

  const handleShareLink = useCallback(async () => {
    const encoded = encodeURIComponent(inputValue);
    const url = `${window.location.origin}/tools/${slug}?data=${encoded}`;
    await navigator.clipboard.writeText(url);
    toast.success('Share link copied to clipboard');
  }, [inputValue, slug]);

  return (
    <div className="space-y-4">
      {/* Action buttons row */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleLoadExample}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <FileText className="h-3.5 w-3.5" /> Load Example
        </button>
        <button
          onClick={handleClear}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" /> Clear
        </button>
      </div>

      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Input</label>
        <textarea
          value={inputValue}
          onChange={e => onInputChange(e.target.value)}
          placeholder={inputPlaceholder}
          className="font-code w-full min-h-[180px] rounded-lg border border-input bg-background p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y"
          spellCheck={false}
        />
      </div>

      {/* Process button */}
      <button
        onClick={onProcess}
        className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
      >
        {actionLabel}
      </button>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Output */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-medium text-foreground">Output</label>
          <div className="flex gap-1.5">
            <button
              onClick={handleCopy}
              disabled={!outputValue}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-40 disabled:pointer-events-none"
            >
              <Copy className="h-3 w-3" /> Copy
            </button>
            <button
              onClick={handleDownload}
              disabled={!outputValue}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-40 disabled:pointer-events-none"
            >
              <Download className="h-3 w-3" /> Download
            </button>
            <button
              onClick={handleShareLink}
              disabled={!inputValue}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-40 disabled:pointer-events-none"
            >
              <Share2 className="h-3 w-3" /> Share
            </button>
          </div>
        </div>
        <textarea
          value={outputValue}
          readOnly
          placeholder={outputPlaceholder}
          className="font-code w-full min-h-[180px] rounded-lg border border-input bg-muted/50 p-4 text-sm text-foreground placeholder:text-muted-foreground resize-y"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
