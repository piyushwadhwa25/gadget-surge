import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { searchTools, type ToolConfig } from '@/lib/tools-registry';
import { trackEvent } from '@/lib/analytics';

interface SearchBarProps {
  className?: string;
  large?: boolean;
  onSelect?: () => void;
}

export function SearchBar({ className = '', large = false, onSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ToolConfig[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.trim().length > 0) {
      const found = searchTools(query).slice(0, 8);
      setResults(found);
      setOpen(true);
      setActiveIdx(-1);
      trackEvent({ type: 'search_used', query, resultCount: found.length });
    } else {
      setResults([]);
      setOpen(false);
    }
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!open || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(prev => (prev <= 0 ? results.length - 1 : prev - 1));
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault();
      const tool = results[activeIdx];
      if (tool) {
        setQuery('');
        setOpen(false);
        onSelect?.();
        window.location.href = `/tools/${tool.slug}`;
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
    }
  }, [open, results, activeIdx, onSelect]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div className={`relative flex items-center ${large ? 'max-w-xl mx-auto' : ''}`}>
        <Search className={`absolute left-3 text-muted-foreground pointer-events-none ${large ? 'h-5 w-5' : 'h-4 w-4'}`} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => query.trim() && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search tools..."
          className={`w-full rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${large ? 'pl-11 pr-10 py-3 text-base' : 'pl-9 pr-8 py-2 text-sm'}`}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setOpen(false); }}
            className="absolute right-3 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {open && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-popover shadow-lg overflow-hidden">
          {results.map((tool, i) => (
            <Link
              key={tool.slug}
              to={`/tools/${tool.slug}`}
              onClick={() => { setQuery(''); setOpen(false); onSelect?.(); }}
              className={`flex flex-col px-4 py-2.5 transition-colors border-b border-border last:border-0 ${
                i === activeIdx ? 'bg-accent/20' : 'hover:bg-accent/10'
              }`}
            >
              <span className="text-sm font-medium text-popover-foreground">{tool.name}</span>
              <span className="text-xs text-muted-foreground line-clamp-1">{tool.description}</span>
            </Link>
          ))}
        </div>
      )}
      {open && query.trim() && results.length === 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-popover shadow-lg p-4 text-center text-sm text-muted-foreground">
          No tools found for "{query}"
        </div>
      )}
    </div>
  );
}
