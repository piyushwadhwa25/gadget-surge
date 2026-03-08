import { Link, useParams } from 'react-router-dom';
import { usePageMeta } from '@/hooks/usePageMeta';
import { ToolCard } from '@/components/ToolCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { getCategoryBySlug, getToolsByCategory } from '@/lib/tools-registry';
import { Clock, ArrowRight } from 'lucide-react';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = slug ? getCategoryBySlug(slug) : undefined;
  const categoryTools = slug ? getToolsByCategory(slug) : [];

  const canonicalUrl = `https://gadgetsurge.com/category/${slug}`;

  usePageMeta({
    title: category ? `${category.name} — Free Online Tools | GadgetSurge` : 'Category — GadgetSurge',
    description: category?.description || 'Browse tools on GadgetSurge.',
    canonical: canonicalUrl,
    ogTitle: category ? `${category.name} — GadgetSurge` : undefined,
    ogDescription: category?.description,
  });

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Category Not Found</h1>
        <p className="text-muted-foreground">This category doesn't exist.</p>
        <Link to="/tools" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
          Browse all tools <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://gadgetsurge.com/' },
      { '@type': 'ListItem', position: 2, name: category.name, item: canonicalUrl },
    ],
  };

  const popularTools = categoryTools.filter(t => t.popular || t.featured);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <JsonLd data={breadcrumbLd} />

      <Breadcrumbs items={[{ label: category.name }]} />

      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{category.name}</h1>
      <p className="text-muted-foreground mb-4 max-w-prose leading-relaxed">{category.introText}</p>

      {!category.comingSoon && categoryTools.length > 0 && (
        <p className="text-sm text-muted-foreground mb-8">
          {categoryTools.length} free tools available in this category — all run entirely in your browser.
        </p>
      )}

      {category.comingSoon ? (
        <div className="text-center py-16 border border-dashed border-border rounded-xl bg-muted/20">
          <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Coming Soon</h2>
          <p className="text-muted-foreground mb-4">We're working on adding {category.name.toLowerCase()}. Check back soon!</p>
          <Link to="/tools" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            Browse available tools <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <>
          {/* Top tools highlight */}
          {popularTools.length > 0 && (
            <div className="mb-10">
              <h2 className="text-lg font-semibold text-foreground mb-4">Top {category.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularTools.slice(0, 3).map(tool => <ToolCard key={tool.slug} tool={tool} />)}
              </div>
            </div>
          )}

          {/* All tools */}
          <h2 className="text-lg font-semibold text-foreground mb-4">All {category.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryTools.map(tool => <ToolCard key={tool.slug} tool={tool} />)}
          </div>
        </>
      )}
    </div>
  );
}
