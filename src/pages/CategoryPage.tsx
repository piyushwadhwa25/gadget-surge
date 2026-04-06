import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ToolCard } from '@/components/ToolCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getCategoryBySlug, getToolsByCategory, categories } from '@/lib/tools-registry';
import { Clock, ArrowRight } from 'lucide-react';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();

  const categoryMeta: Record<string, { title: string; description: string }> = {
    "developer-tools": {
      title: "Free Developer Tools Online — JSON, Base64, UUID, Regex & More | GadgetSurge",
      description: "Free online developer tools including JSON formatter, Base64 encoder/decoder, UUID generator, regex tester, JWT decoder, timestamp converter, and more.",
    },
    "image-tools": {
      title: "Free Online Image Tools — Resize, Convert, Compress & More | GadgetSurge",
      description: "Free browser-based image tools. Resize, crop, rotate, compress, and convert images between formats (PNG, JPG, WebP). No upload to server — runs in your browser.",
    },
    "text-tools": {
      title: "Free Online Text Tools — Word Counter, Case Converter & More | GadgetSurge",
      description: "Free text utilities including word counter, character counter, case converter, duplicate line remover, text sorter, lorem ipsum generator, and more.",
    },
    "document-tools": {
      title: "Free Online Document Tools — Markdown, HTML, SQL | GadgetSurge",
      description: "Free document conversion and formatting tools. Convert Markdown to HTML, format SQL queries, format HTML, and more. All tools run in your browser.",
    },
    "calculators": {
      title: "Free Online Calculators — GadgetSurge",
      description: "Free online calculators for everyday tasks. All calculators run directly in your browser with no signup required.",
    },
  };

  const meta = categoryMeta[slug ?? ""] ?? {
    title: "GadgetSurge — Free Online Tools",
    description: "Free browser-based utilities for developers, creators, and everyday tasks.",
  };

  const canonical = `https://www.gadgetsurge.com/category/${slug}`;

  const category = slug ? getCategoryBySlug(slug) : undefined;
  const categoryTools = slug ? getToolsByCategory(slug) : [];

  const canonicalUrl = canonical;

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Helmet>
          <title>{meta.title}</title>
          <meta name="description" content={meta.description} />
          <link rel="canonical" href={canonical} />
          <meta property="og:title" content={meta.title} />
          <meta property="og:description" content={meta.description} />
          <meta property="og:url" content={canonical} />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="GadgetSurge" />
        </Helmet>
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
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.gadgetsurge.com/' },
      { '@type': 'ListItem', position: 2, name: category.name, item: canonicalUrl },
    ],
  };

  const popularTools = categoryTools.filter(t => t.popular || t.featured);
  const relatedCategories = category.relatedCategorySlugs
    ?.map(s => categories.find(c => c.slug === s))
    .filter(Boolean) || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GadgetSurge" />
      </Helmet>
      <JsonLd data={breadcrumbLd} />
      <Breadcrumbs items={[{ label: category.name }]} />

      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
        Free Online {category.name}
      </h1>
      <p className="text-muted-foreground mb-4 max-w-prose leading-relaxed">{category.introText}</p>

      {/* Who is it for */}
      {category.whoIsItFor && (
        <p className="text-sm text-muted-foreground mb-2 max-w-prose">
          <strong className="text-foreground">Who is it for:</strong> {category.whoIsItFor}
        </p>
      )}

      {/* Common use cases */}
      {category.commonUseCases && category.commonUseCases.length > 0 && (
        <div className="mb-6">
          <p className="text-sm font-medium text-foreground mb-2">Common use cases:</p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {category.commonUseCases.map((uc, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span>{uc}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!category.comingSoon && categoryTools.length > 0 && (
        <p className="text-sm text-muted-foreground mb-8">
          {categoryTools.length} free tools available — all run entirely in your browser with no data sent to any server.
        </p>
      )}

      {category.comingSoon ? (
        <div className="text-center py-16 border border-dashed border-border rounded-xl bg-muted/20 mb-10">
          <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Coming Soon</h2>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">{category.introText}</p>
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

      {/* Category FAQs */}
      {category.faqItems && category.faqItems.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-semibold text-foreground mb-4">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full rounded-lg border border-border overflow-hidden">
            {category.faqItems.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-b border-border last:border-0">
                <AccordionTrigger className="text-left text-foreground px-4 hover:bg-muted/40 transition-colors text-sm">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground px-4 pb-4 text-sm">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      )}

      {/* Related Categories */}
      {relatedCategories.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-semibold text-foreground mb-4">Explore Related Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {relatedCategories.map(cat => cat && (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className="p-4 rounded-lg border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all"
              >
                <span className="text-sm font-medium text-card-foreground">{cat.name}</span>
                <span className="block text-xs text-muted-foreground mt-1">{cat.description}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
