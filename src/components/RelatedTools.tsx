import { getToolBySlug } from '@/lib/tools-registry';
import { ToolCard } from '@/components/ToolCard';

interface RelatedToolsProps {
  slugs: string[];
}

export function RelatedTools({ slugs }: RelatedToolsProps) {
  const relatedTools = slugs.map(getToolBySlug).filter(Boolean);
  if (relatedTools.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold text-foreground mb-4">Related Tools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {relatedTools.map(tool => tool && <ToolCard key={tool.slug} tool={tool} />)}
      </div>
    </section>
  );
}
