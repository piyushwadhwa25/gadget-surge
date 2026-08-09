import { ReactNode, useEffect } from 'react';
import type { ToolConfig } from '@/lib/tools-registry';
import { toolContentMap } from '@/lib/toolContentMap';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { SeoSection } from '@/components/SeoSection';
import { RelatedTools } from '@/components/RelatedTools';
import { CategoryPopular } from '@/components/CategoryPopular';
import { trackEvent } from '@/lib/analytics';

interface ToolPageTemplateProps {
  tool: ToolConfig;
  children: ReactNode;
}

export function ToolPageTemplate({ tool, children }: ToolPageTemplateProps) {
  useEffect(() => {
    trackEvent({ type: 'tool_viewed', slug: tool.slug });
  }, [tool.slug]);

  const expandedContent = toolContentMap[tool.slug];

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">

      <Breadcrumbs
        items={[
          { label: tool.category, path: `/category/${tool.categorySlug}` },
          { label: tool.name },
        ]}
      />

      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{tool.name}</h1>
      <p className="text-muted-foreground mb-6 max-w-prose">{tool.description}</p>

      {/* Tool Interface */}
      <div style={{ minHeight: '280px' }}>
        {children}
      </div>

      {/* SEO Content */}
      <div style={{ minHeight: '600px' }}>
        <SeoSection tool={tool} expanded={expandedContent} />
      </div>

      {/* Related Tools */}
      <RelatedTools slugs={tool.relatedToolSlugs} currentSlug={tool.slug} />

      {/* Popular in this category */}
      <CategoryPopular categorySlug={tool.categorySlug} currentSlug={tool.slug} />
    </div>
  );
}
