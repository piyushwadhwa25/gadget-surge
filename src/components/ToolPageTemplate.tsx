import { ReactNode } from 'react';
import type { ToolConfig } from '@/lib/tools-registry';
import { usePageMeta } from '@/hooks/usePageMeta';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { SeoSection } from '@/components/SeoSection';
import { RelatedTools } from '@/components/RelatedTools';
import { AdPlaceholder } from '@/components/AdPlaceholder';
import { JsonLd } from '@/components/JsonLd';

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
  });

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://gadgetsurge.com/' },
      { '@type': 'ListItem', position: 2, name: tool.category, item: `https://gadgetsurge.com/category/${tool.categorySlug}` },
      { '@type': 'ListItem', position: 3, name: tool.name, item: canonicalUrl },
    ],
  };

  const webAppLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    url: canonicalUrl,
    description: tool.metaDescription,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };

  const faqLd = tool.faqItems.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: tool.faqItems.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  } : null;

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={webAppLd} />
      {faqLd && <JsonLd data={faqLd} />}

      <Breadcrumbs
        items={[
          { label: tool.category, path: `/category/${tool.categorySlug}` },
          { label: tool.name },
        ]}
      />

      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{tool.name}</h1>
      <p className="text-muted-foreground mb-6">{tool.description}</p>

      {/* Tool Interface */}
      {children}

      {/* Ad Placeholder - Below Tool */}
      <div className="mt-8">
        <AdPlaceholder />
      </div>

      {/* SEO Content */}
      <SeoSection tool={tool} />

      {/* Related Tools */}
      <RelatedTools slugs={tool.relatedToolSlugs} />
    </div>
  );
}
