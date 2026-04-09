import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SearchBar } from '@/components/SearchBar';
import { ToolCard } from '@/components/ToolCard';
import {
  getFeaturedTools, getPopularTools, getRecentlyAddedTools,
  getToolsByCategory, getToolsByUseCaseTag, tools, categories,
  useCaseLabels, getAllUseCaseTags, type UseCaseTag,
} from '@/lib/tools-registry';
import { Zap, ArrowRight, Code2, Type, ImageIcon, Shield, Globe, Sparkles } from 'lucide-react';

export default function Index() {
  const featured = getFeaturedTools();
  const popular = getPopularTools();
  const recent = getRecentlyAddedTools();
  const devTools = getToolsByCategory('developer-tools');
  const textTools = getToolsByCategory('text-tools');
  const imageTools = getToolsByCategory('image-tools');
  const activeTags = getAllUseCaseTags();

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
      <Helmet>
        <title>GadgetSurge — Free Online Tools for Developers, Creators &amp; Everyday Tasks</title>
        <meta name="description" content="A growing collection of free browser-based utilities. JSON formatter, Base64 encoder, regex tester, UUID generator, image tools, and more. No signup required." />
        <link rel="canonical" href="https://www.gadgetsurge.com/" />
        <meta property="og:title" content="GadgetSurge — Free Online Tools for Developers, Creators &amp; Everyday Tasks" />
        <meta property="og:description" content="A growing collection of free browser-based utilities. JSON formatter, Base64 encoder, regex tester, UUID generator, image tools, and more. No signup required." />
        <meta property="og:url" content="https://www.gadgetsurge.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GadgetSurge" />
        <script type="application/ld+json">{JSON.stringify(websiteLd)}</script>
      </Helmet>

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
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed">
          {tools.length} lightweight browser-based utilities. No signup, no data collection — everything runs in your browser.
        </p>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-8">
          Format JSON, resize images, generate passwords, count words, convert data formats, and much more — all free and private.
        </p>
        <SearchBar large className="max-w-xl mx-auto" />
        <p className="mt-3 text-xs text-muted-foreground">{tools.length} free tools • 100% client-side • No signup required</p>
      </section>

      {/* Value props */}
      <section className="container mx-auto px-4 pb-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { icon: Code2, title: 'Developer Tools', desc: `${devTools.length} formatting, encoding, and debugging tools.`, path: '/category/developer-tools' },
            { icon: Type, title: 'Text Tools', desc: `${textTools.length} counting, conversion, and generator tools.`, path: '/category/text-tools' },
            { icon: ImageIcon, title: 'Image Tools', desc: `${imageTools.length} resize, convert, and compression tools.`, path: '/category/image-tools' },
            { icon: Shield, title: '100% Private', desc: 'All tools run in your browser. No data leaves your device.' },
          ].map(({ icon: Icon, title, desc, path }) => (
            <div key={title} className="text-center p-5 rounded-xl border border-border bg-card hover:border-primary/30 transition-all">
              {path ? (
                <Link to={path} className="block">
                  <div className="inline-flex p-2.5 rounded-lg bg-primary/10 mb-3">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-card-foreground mb-1 text-sm">{title}</h3>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </Link>
              ) : (
                <>
                  <div className="inline-flex p-2.5 rounded-lg bg-primary/10 mb-3">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-card-foreground mb-1 text-sm">{title}</h3>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Top Free Online Tools */}
      <section className="container mx-auto px-4 pb-14">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Top Free Online Tools</h2>
          </div>
          <Link to="/tools" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">
            View all {tools.length} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.slice(0, 9).map(tool => <ToolCard key={tool.slug} tool={tool} />)}
        </div>
      </section>

      {/* Category preview: Developer Tools */}
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

      {/* Category preview: Text Tools */}
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

      {/* Category preview: Image Tools */}
      <section className="container mx-auto px-4 pb-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Image Tools</h2>
          <Link to="/category/image-tools" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">
            See all {imageTools.length} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {imageTools.slice(0, 6).map(tool => <ToolCard key={tool.slug} tool={tool} />)}
        </div>
      </section>

      {/* Recently Added */}
      {recent.length > 0 && (
        <section className="container mx-auto px-4 pb-14">
          <h2 className="text-xl font-bold text-foreground mb-6">Recently Added</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recent.slice(0, 8).map(tool => <ToolCard key={tool.slug} tool={tool} />)}
          </div>
        </section>
      )}

      {/* Popular Tools */}
      {popular.length > 0 && (
        <section className="container mx-auto px-4 pb-14">
          <h2 className="text-xl font-bold text-foreground mb-6">Popular Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popular.map(tool => <ToolCard key={tool.slug} tool={tool} />)}
          </div>
        </section>
      )}

      {/* Browse by Use Case */}
      <section className="container mx-auto px-4 pb-14">
        <h2 className="text-xl font-bold text-foreground mb-6">Browse by Use Case</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {activeTags.map(tag => {
            const count = getToolsByUseCaseTag(tag).length;
            return (
              <Link
                key={tag}
                to={`/tools?useCase=${tag}`}
                className="text-center p-4 rounded-lg border border-border bg-card hover:border-primary/50 hover:shadow-md hover:shadow-primary/5 transition-all"
              >
                <span className="text-sm font-medium text-card-foreground">{useCaseLabels[tag]}</span>
                <span className="block text-xs text-muted-foreground mt-1">{count} tools</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Browse by Category */}
      <section className="container mx-auto px-4 pb-16">
        <h2 className="text-xl font-bold text-foreground mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {categories.map(cat => {
            const count = getToolsByCategory(cat.slug).length;
            return (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className="text-center p-4 rounded-lg border border-border bg-card hover:border-primary/50 hover:shadow-md hover:shadow-primary/5 transition-all"
              >
                <span className="text-sm font-medium text-card-foreground">{cat.name}</span>
                {cat.comingSoon ? (
                  <span className="block text-[10px] text-accent font-semibold mt-1">Coming Soon</span>
                ) : (
                  <span className="block text-xs text-muted-foreground mt-1">{count} tools</span>
                )}
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
