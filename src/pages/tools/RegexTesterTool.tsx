import { useState, useCallback } from 'react';
import { Copy, Trash2, FileText, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { testRegex } from '@/utils/tool-logic';
import type { ToolConfig } from '@/lib/tools-registry';

interface Props {
  tool: ToolConfig;
}

export function RegexTesterTool({ tool }: Props) {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('gi');
  const [testText, setTestText] = useState('');
  const [results, setResults] = useState<{ match: string; index: number }[]>([]);
  const [error, setError] = useState('');
  const [count, setCount] = useState(0);

  const handleTest = useCallback(() => {
    setError('');
    setResults([]);
    setCount(0);
    if (!pattern) { setError('Enter a regex pattern'); return; }
    try {
      const res = testRegex(pattern, flags, testText);
      setResults(res.matches);
      setCount(res.count);
    } catch (e: any) {
      setError(e.message || 'Invalid regex');
    }
  }, [pattern, flags, testText]);

  const handleLoadExample = () => {
    setPattern('\\b\\w+@\\w+\\.\\w+\\b');
    setFlags('gi');
    setTestText('Contact us at hello@example.com or support@test.org for help.');
  };

  const getHighlightedText = () => {
    if (results.length === 0 || !testText) return null;
    const parts: { text: string; highlight: boolean }[] = [];
    let lastIndex = 0;
    for (const r of results) {
      if (r.index > lastIndex) {
        parts.push({ text: testText.slice(lastIndex, r.index), highlight: false });
      }
      parts.push({ text: r.match, highlight: true });
      lastIndex = r.index + r.match.length;
    }
    if (lastIndex < testText.length) {
      parts.push({ text: testText.slice(lastIndex), highlight: false });
    }
    return parts;
  };

  const highlighted = getHighlightedText();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button onClick={handleLoadExample} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <FileText className="h-3.5 w-3.5" /> Load Example
        </button>
        <button onClick={() => { setPattern(''); setFlags('gi'); setTestText(''); setResults([]); setCount(0); setError(''); }} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <Trash2 className="h-3.5 w-3.5" /> Clear
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Pattern</label>
          <input
            value={pattern}
            onChange={e => setPattern(e.target.value)}
            placeholder="Enter regex pattern..."
            className="font-code w-full rounded-lg border border-input bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            spellCheck={false}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Flags</label>
          <input
            value={flags}
            onChange={e => setFlags(e.target.value)}
            placeholder="gi"
            className="font-code w-24 rounded-lg border border-input bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            spellCheck={false}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Test Text</label>
        <textarea
          value={testText}
          onChange={e => setTestText(e.target.value)}
          placeholder="Enter text to test against..."
          className="font-code w-full min-h-[120px] rounded-lg border border-input bg-background p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y"
          spellCheck={false}
        />
      </div>

      <button onClick={handleTest} className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors">
        Test Regex
      </button>

      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">{error}</div>
      )}

      {count > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">{count} match{count !== 1 ? 'es' : ''} found</p>
          {highlighted && (
            <div className="font-code text-sm bg-muted/50 rounded-lg p-4 whitespace-pre-wrap break-all border border-input">
              {highlighted.map((part, i) =>
                part.highlight ? (
                  <mark key={i} className="bg-primary/25 text-foreground rounded px-0.5">{part.text}</mark>
                ) : (
                  <span key={i}>{part.text}</span>
                )
              )}
            </div>
          )}
          <div className="space-y-1">
            {results.map((r, i) => (
              <div key={i} className="font-code text-xs text-muted-foreground">
                Match {i + 1}: <span className="text-foreground">"{r.match}"</span> at index {r.index}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
