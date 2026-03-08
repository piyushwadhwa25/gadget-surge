import { Link } from 'react-router-dom';
import type { ToolConfig } from '@/lib/tools-registry';
import { ArrowRight } from 'lucide-react';

interface ToolCardProps {
  tool: ToolConfig;
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link
      to={`/tools/${tool.slug}`}
      className="group block rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md hover:shadow-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-card-foreground group-hover:text-primary transition-colors">
          {tool.name}
        </h3>
        {tool.popular && (
          <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-accent">Popular</span>
        )}
      </div>
      <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
        {tool.description}
      </p>
      <div className="mt-3 flex items-center text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
        Open tool <ArrowRight className="ml-1 h-3 w-3" />
      </div>
    </Link>
  );
}
