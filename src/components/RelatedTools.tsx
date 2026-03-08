import { getSmartRelatedTools, getMoreToolsLikeThis } from '@/lib/tools-registry';
import { ToolCard } from '@/components/ToolCard';

interface RelatedToolsProps {
  slugs: string[];
  currentSlug: string;
}

export function RelatedTools({ currentSlug }: RelatedToolsProps) {
  const relatedTools = getSmartRelatedTools(currentSlug, 6);
  const moreTools = getMoreToolsLikeThis(currentSlug, relatedTools.map(t => t.slug), 4);

  if (relatedTools.length === 0 && moreTools.length === 0) return null;

  return (
    <>
      {relatedTools.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-foreground mb-4">Related Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedTools.map(tool => <ToolCard key={tool.slug} tool={tool} />)}
          </div>
        </section>
      )}
      {moreTools.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">More Tools Like This</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {moreTools.map(tool => <ToolCard key={tool.slug} tool={tool} />)}
          </div>
        </section>
      )}
    </>
  );
}
