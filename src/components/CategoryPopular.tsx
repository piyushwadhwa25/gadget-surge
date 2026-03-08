import { getToolsByCategory } from '@/lib/tools-registry';
import { ToolCard } from '@/components/ToolCard';

interface CategoryPopularProps {
  categorySlug: string;
  currentSlug: string;
}

export function CategoryPopular({ categorySlug, currentSlug }: CategoryPopularProps) {
  const tools = getToolsByCategory(categorySlug)
    .filter(t => t.slug !== currentSlug)
    .filter(t => t.popular || t.featured)
    .slice(0, 4);

  if (tools.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold text-foreground mb-4">Popular in This Category</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tools.map(tool => <ToolCard key={tool.slug} tool={tool} />)}
      </div>
    </section>
  );
}
