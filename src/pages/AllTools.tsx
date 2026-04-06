import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ToolCard } from '@/components/ToolCard';
import { SearchBar } from '@/components/SearchBar';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import {
  tools, categories, getFeaturedTools, getPopularTools,
  useCaseLabels, getAllUseCaseTags, type UseCaseTag,
} from '@/lib/tools-registry';
import { Link } from 'react-router-dom';

export default function AllTools() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || '';
  const activeUseCase = (searchParams.get('useCase') || '') as UseCaseTag;

  const featured = getFeaturedTools();
  const popular = getPopularTools();
  const activeTags = getAllUseCaseTags();

  const filteredTools = tools.filter(t => {
    if (activeCategory && t.categorySlug !== activeCategory) return false;
    if (activeUseCase && !t.useCaseTags?.includes(activeUseCase)) return false;
    return true;
  });

  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    // Clear other filter when setting category/useCase
    setSearchParams(params);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Helmet>
        <title>All Free Online Tools — GadgetSurge</title>
        <meta name="description" content="Browse all free online tools at GadgetSurge. Developer utilities, text tools, image converters, and everyday calculators. No signup, no login, runs in your browser." />
        <link rel="canonical" href="https://www.gadgetsurge.com/tools" />
        <meta property="og:title" content="All Free Online Tools — GadgetSurge" />
        <meta property="og:description" content="Browse all free online tools at GadgetSurge. Developer utilities, text tools, image converters, and everyday calculators. No signup, no login, runs in your browser." />
        <meta property="og:url" content="https://www.gadgetsurge.com/tools" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GadgetSurge" />
      </Helmet>
      <Breadcrumbs items={[{ label: 'All Tools' }]} />

      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">All Free Online Tools</h1>
      <p className="text-muted-foreground mb-6 max-w-prose">
        Browse our complete collection of {tools.length} free online tools for developers, creators, and everyday tasks. All tools run entirely in your browser — no data is ever sent to a server.
      </p>

      <SearchBar className="max-w-md mb-6" />

      {/* Category filter chips */}
      <div className="mb-3">
        <span className="text-xs font-medium text-muted-foreground mr-2">Category:</span>
        <div className="inline-flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('category', '')}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${!activeCategory ? 'border-primary bg-primary/10 text-primary' : 'border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground'}`}
          >
            All
          </button>
          {categories.filter(c => !c.comingSoon).map(cat => (
            <button
              key={cat.slug}
              onClick={() => setFilter('category', activeCategory === cat.slug ? '' : cat.slug)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${activeCategory === cat.slug ? 'border-primary bg-primary/10 text-primary' : 'border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Use case filter chips */}
      <div className="mb-8">
        <span className="text-xs font-medium text-muted-foreground mr-2">Use case:</span>
        <div className="inline-flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('useCase', '')}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${!activeUseCase ? 'border-primary bg-primary/10 text-primary' : 'border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground'}`}
          >
            All
          </button>
          {activeTags.map(tag => (
            <button
              key={tag}
              onClick={() => setFilter('useCase', activeUseCase === tag ? '' : tag)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${activeUseCase === tag ? 'border-primary bg-primary/10 text-primary' : 'border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground'}`}
            >
              {useCaseLabels[tag]}
            </button>
          ))}
        </div>
      </div>

      {/* Featured tools (only when no filters) */}
      {!activeCategory && !activeUseCase && featured.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">Featured Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.slice(0, 6).map(tool => <ToolCard key={tool.slug} tool={tool} />)}
          </div>
        </div>
      )}

      {/* Popular tools (only when no filters) */}
      {!activeCategory && !activeUseCase && popular.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">Popular Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popular.slice(0, 4).map(tool => <ToolCard key={tool.slug} tool={tool} />)}
          </div>
        </div>
      )}

      {/* All / filtered tools */}
      <h2 className="text-lg font-semibold text-foreground mb-4">
        {activeCategory || activeUseCase
          ? `Showing ${filteredTools.length} tools`
          : `All ${tools.length} Tools`}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map(tool => <ToolCard key={tool.slug} tool={tool} />)}
      </div>

      {filteredTools.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          No tools match the current filters. <button onClick={() => { setFilter('category', ''); setFilter('useCase', ''); }} className="text-primary hover:underline">Clear filters</button>
        </p>
      )}
    </div>
  );
}
