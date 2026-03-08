import { Link } from 'react-router-dom';
import { usePageMeta } from '@/hooks/usePageMeta';
import { SearchBar } from '@/components/SearchBar';
import { ToolCard } from '@/components/ToolCard';
import { JsonLd } from '@/components/JsonLd';
import { getFeaturedTools, getPopularTools, getToolsByCategory, tools } from '@/lib/tools-registry';
import { Zap, ArrowRight } from 'lucide-react';

export default function Index() {
  usePageMeta({
    title: 'GadgetSurge — Free Online Tools for Developers, Creators & Everyday Tasks',
    description: 'A growing collection of free browser-based utilities. JSON formatter, Base64 encoder, regex tester, UUID generator, and more. No signup required.',
  });

  const featured = getFeaturedTools();
  const popular = getPopularTools();
  const devTools = getToolsByCategory('developer-tools');

  const websiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'GadgetSurge',
    url: 'https://gadgetsurge.com',
    description: 'Free online tools for developers, creators, and everyday tasks.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://gadgetsurge.com/tools?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <div>
      <JsonLd data={websiteLd} />

      {/* Hero */}
      <section className="container mx-auto px-4 py-16 md:py-24 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Zap className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
          Free Online Tools for <br className="hidden sm:block" />
          <span className="text-primary">Developers</span>, <span className="text-primary">Creators</span> & Everyone
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          A growing collection of lightweight browser-based utilities. No signup, no data collection — all tools run entirely in your browser.
        </p>
        <SearchBar large className="max-w-xl mx-auto" />
        <p className="mt-3 text-xs text-muted-foreground">{tools.length} free tools available</p>
      </section>

      {/* Featured Tools */}
      <section className="container mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Featured Tools</h2>
          <Link to="/tools" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map(tool => <ToolCard key={tool.slug} tool={tool} />)}
        </div>
      </section>

      {/* Developer Tools */}
      <section className="container mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Developer Tools</h2>
          <Link to="/category/developer-tools" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">
            See all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {devTools.slice(0, 6).map(tool => <ToolCard key={tool.slug} tool={tool} />)}
        </div>
      </section>

      {/* Popular Tools */}
      {popular.length > 0 && (
        <section className="container mx-auto px-4 pb-12">
          <h2 className="text-xl font-bold text-foreground mb-6">Popular Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popular.map(tool => <ToolCard key={tool.slug} tool={tool} />)}
          </div>
        </section>
      )}

      {/* Recently Added */}
      <section className="container mx-auto px-4 pb-16">
        <h2 className="text-xl font-bold text-foreground mb-6">Recently Added</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.slice(-3).reverse().map(tool => <ToolCard key={tool.slug} tool={tool} />)}
        </div>
      </section>
    </div>
  );
}
