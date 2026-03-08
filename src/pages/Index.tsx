import { Link } from 'react-router-dom';
import { usePageMeta } from '@/hooks/usePageMeta';
import { SearchBar } from '@/components/SearchBar';
import { ToolCard } from '@/components/ToolCard';
import { JsonLd } from '@/components/JsonLd';
import { getFeaturedTools, getPopularTools, getToolsByCategory, tools, categories } from '@/lib/tools-registry';
import { Zap, ArrowRight, Code2, Type, Globe } from 'lucide-react';

export default function Index() {
  usePageMeta({
    title: 'GadgetSurge — Free Online Tools for Developers, Creators & Everyday Tasks',
    description: 'A growing collection of free browser-based utilities. JSON formatter, Base64 encoder, word counter, password generator, and more. No signup required.',
    canonical: 'https://gadgetsurge.com/',
    ogTitle: 'GadgetSurge — Free Online Tools',
    ogDescription: 'Free browser-based utilities for developers, creators, and everyday tasks.',
  });

  const featured = getFeaturedTools();
  const popular = getPopularTools();
  const devTools = getToolsByCategory('developer-tools');
  const textTools = getToolsByCategory('text-tools');

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
      <section className="container mx-auto px-4 pt-16 pb-12 md:pt-24 md:pb-16 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="p-3 rounded-2xl bg-primary/10">
            <Zap className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight mb-5 leading-tight">
          Free Online Tools for <br className="hidden sm:block" />
          <span className="text-primary">Developers</span>, <span className="text-primary">Creators</span> & Everyone
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
          {tools.length} lightweight browser-based utilities. No signup, no data collection — everything runs in your browser.
        </p>
        <SearchBar large className="max-w-xl mx-auto" />
        <p className="mt-3 text-xs text-muted-foreground">{tools.length} free tools • 100% client-side</p>
      </section>

      {/* Value props */}
      <section className="container mx-auto px-4 pb-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: Code2, title: 'Developer Tools', desc: `${devTools.length} tools to format, encode, decode, and convert data.` },
            { icon: Type, title: 'Text Tools', desc: `${textTools.length} tools to count, convert, sort, and generate text.` },
            { icon: Globe, title: 'Always Free', desc: 'Every tool is free. No signup, no ads-wall — just open and go.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center p-6 rounded-xl border border-border bg-card">
              <div className="inline-flex p-2.5 rounded-lg bg-primary/10 mb-3">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-card-foreground mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Tools */}
      <section className="container mx-auto px-4 pb-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Featured Tools</h2>
          <Link to="/tools" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.slice(0, 6).map(tool => <ToolCard key={tool.slug} tool={tool} />)}
        </div>
      </section>

      {/* Developer Tools */}
      <section className="container mx-auto px-4 pb-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Developer Tools</h2>
          <Link to="/category/developer-tools" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">
            See all {devTools.length} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {devTools.slice(0, 6).map(tool => <ToolCard key={tool.slug} tool={tool} />)}
        </div>
      </section>

      {/* Text Tools */}
      <section className="container mx-auto px-4 pb-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Text Tools</h2>
          <Link to="/category/text-tools" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">
            See all {textTools.length} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {textTools.slice(0, 6).map(tool => <ToolCard key={tool.slug} tool={tool} />)}
        </div>
      </section>

      {/* Popular Tools */}
      {popular.length > 0 && (
        <section className="container mx-auto px-4 pb-14">
          <h2 className="text-xl font-bold text-foreground mb-6">Popular Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popular.map(tool => <ToolCard key={tool.slug} tool={tool} />)}
          </div>
        </section>
      )}

      {/* Browse Categories */}
      <section className="container mx-auto px-4 pb-16">
        <h2 className="text-xl font-bold text-foreground mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {categories.map(cat => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="text-center p-4 rounded-lg border border-border bg-card hover:border-primary/50 hover:shadow-md hover:shadow-primary/5 transition-all"
            >
              <span className="text-sm font-medium text-card-foreground">{cat.name}</span>
              {cat.comingSoon && <span className="block text-[10px] text-accent font-semibold mt-1">Coming Soon</span>}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
