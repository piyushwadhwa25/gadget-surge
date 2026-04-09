import { ReactNode, useEffect } from 'react';
import type { ToolConfig } from '@/lib/tools-registry';
import { toolContentMap } from '@/lib/toolContentMap';
import { usePageMeta } from '@/hooks/usePageMeta';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { SeoSection } from '@/components/SeoSection';
import { RelatedTools } from '@/components/RelatedTools';
import { CategoryPopular } from '@/components/CategoryPopular';
import { AdPlaceholder } from '@/components/AdPlaceholder';
import { JsonLd } from '@/components/JsonLd';
import { trackEvent } from '@/lib/analytics';

interface ToolPageTemplateProps {
  tool: ToolConfig;
  children: ReactNode;
}

export function ToolPageTemplate({ tool, children }: ToolPageTemplateProps) {
  const canonicalUrl = `https://gadgetsurge.com/tools/${tool.slug}`;

  usePageMeta({
    title: tool.seoTitle,
    description: tool.metaDescription,
    canonical: canonicalUrl,
    ogTitle: tool.seoTitle,
    ogDescription: tool.metaDescription,
    ogType: 'website',
    ogUrl: canonicalUrl,
    twitterCard: 'summary',
  });

  useEffect(() => {
    trackEvent({ type: 'tool_viewed', slug: tool.slug });
  }, [tool.slug]);

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://gadgetsurge.com/' },
      { '@type': 'ListItem', position: 2, name: tool.category, item: `https://gadgetsurge.com/category/${tool.categorySlug}` },
      { '@type': 'ListItem', position: 3, name: tool.name, item: canonicalUrl },
    ],
  };

  const expandedContent = toolContentMap[tool.slug];
  const faqLd =
    !expandedContent?.faqs?.length && tool.faqItems.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: tool.faqItems.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer },
          })),
        }
      : null;

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <JsonLd data={breadcrumbLd} />
      {faqLd && <JsonLd data={faqLd} />}

      <Breadcrumbs
        items={[
          { label: tool.category, path: `/category/${tool.categorySlug}` },
          { label: tool.name },
        ]}
      />

      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{tool.name}</h1>
      <p className="text-muted-foreground mb-6 max-w-prose">{tool.description}</p>

      {/* Tool Interface */}
      {children}

      {/* Ad Placeholder - Below Tool */}
      <div className="mt-8">
        <AdPlaceholder />
      </div>

      {/* SEO Content */}
      <SeoSection tool={tool} expanded={expandedContent} />

      {/* Related Tools */}
      <RelatedTools slugs={tool.relatedToolSlugs} currentSlug={tool.slug} />

      {/* Popular in this category */}
      <CategoryPopular categorySlug={tool.categorySlug} currentSlug={tool.slug} />
    </div>
  );
}
