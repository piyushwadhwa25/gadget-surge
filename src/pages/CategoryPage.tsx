import { useParams } from 'react-router-dom';
import { usePageMeta } from '@/hooks/usePageMeta';
import { ToolCard } from '@/components/ToolCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { getCategoryBySlug, getToolsByCategory } from '@/lib/tools-registry';
import { Clock } from 'lucide-react';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = slug ? getCategoryBySlug(slug) : undefined;
  const categoryTools = slug ? getToolsByCategory(slug) : [];

  usePageMeta({
    title: category ? `${category.name} — Free Online Tools | GadgetSurge` : 'Category — GadgetSurge',
    description: category?.description || 'Browse tools on GadgetSurge.',
  });

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Category Not Found</h1>
        <p className="text-muted-foreground">This category doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: category.name }]} />

      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{category.name}</h1>
      <p className="text-muted-foreground mb-8">{category.introText}</p>

      {category.comingSoon ? (
        <div className="text-center py-16 border border-dashed border-border rounded-lg bg-muted/30">
          <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Coming Soon</h2>
          <p className="text-muted-foreground">We're working on adding {category.name.toLowerCase()}. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryTools.map(tool => <ToolCard key={tool.slug} tool={tool} />)}
        </div>
      )}
    </div>
  );
}
