import { usePageMeta } from '@/hooks/usePageMeta';
import { ToolCard } from '@/components/ToolCard';
import { SearchBar } from '@/components/SearchBar';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { tools, categories } from '@/lib/tools-registry';
import { Link } from 'react-router-dom';

export default function AllTools() {
  usePageMeta({
    title: 'All Free Online Tools — GadgetSurge',
    description: 'Browse all free browser-based tools on GadgetSurge. Developer tools, converters, formatters, and more.',
    canonical: 'https://gadgetsurge.com/tools',
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Breadcrumbs items={[{ label: 'All Tools' }]} />

      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">All Tools</h1>
      <p className="text-muted-foreground mb-6">
        Browse our complete collection of {tools.length} free online tools. All tools run entirely in your browser — no data is ever sent to a server.
      </p>

      <SearchBar className="max-w-md mb-8" />

      {/* Category chips */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.filter(c => !c.comingSoon).map(cat => (
          <Link
            key={cat.slug}
            to={`/category/${cat.slug}`}
            className="px-3 py-1.5 text-xs font-medium rounded-full border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map(tool => <ToolCard key={tool.slug} tool={tool} />)}
      </div>
    </div>
  );
}
