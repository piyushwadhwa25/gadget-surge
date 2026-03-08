import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { searchTools, type ToolConfig } from '@/lib/tools-registry';

interface SearchBarProps {
  className?: string;
  large?: boolean;
  onSelect?: () => void;
}

export function SearchBar({ className = '', large = false, onSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ToolConfig[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length > 0) {
      setResults(searchTools(query).slice(0, 8));
      setOpen(true);
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

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div className={`relative flex items-center ${large ? 'max-w-xl mx-auto' : ''}`}>
        <Search className={`absolute left-3 text-muted-foreground ${large ? 'h-5 w-5' : 'h-4 w-4'}`} />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => query.trim() && setOpen(true)}
          placeholder="Search tools..."
          className={`w-full rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${large ? 'pl-11 pr-10 py-3 text-base' : 'pl-9 pr-8 py-2 text-sm'}`}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setOpen(false); }}
            className={`absolute right-3 text-muted-foreground hover:text-foreground ${large ? '' : ''}`}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {open && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-popover shadow-lg overflow-hidden">
          {results.map(tool => (
            <Link
              key={tool.slug}
              to={`/tools/${tool.slug}`}
              onClick={() => { setQuery(''); setOpen(false); onSelect?.(); }}
              className="flex flex-col px-4 py-2.5 hover:bg-accent/50 transition-colors border-b border-border last:border-0"
            >
              <span className="text-sm font-medium text-popover-foreground">{tool.name}</span>
              <span className="text-xs text-muted-foreground">{tool.description}</span>
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
