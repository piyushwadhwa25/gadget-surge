import { usePageMeta } from '@/hooks/usePageMeta';
import { ToolCard } from '@/components/ToolCard';
import { SearchBar } from '@/components/SearchBar';
import { tools } from '@/lib/tools-registry';

export default function AllTools() {
  usePageMeta({
    title: 'All Free Online Tools — GadgetSurge',
    description: 'Browse all free browser-based tools on GadgetSurge. Developer tools, converters, formatters, and more.',
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">All Tools</h1>
      <p className="text-muted-foreground mb-6">Browse our complete collection of {tools.length} free online tools.</p>

      <SearchBar className="max-w-md mb-8" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map(tool => <ToolCard key={tool.slug} tool={tool} />)}
      </div>
    </div>
  );
}
