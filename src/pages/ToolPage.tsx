import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getToolBySlug } from '@/lib/tools-registry';
import { toolSeoFallbackMeta, toolSeoMetaMap } from '@/lib/toolSeoMetaMap';
import { toolContentMap } from '@/lib/toolContentMap';
import { toolProcessors } from '@/utils/tool-logic';
import { ToolPageTemplate } from '@/components/ToolPageTemplate';
import { ToolInterface } from '@/components/ToolInterface';
import { RegexTesterTool } from '@/pages/tools/RegexTesterTool';
import { UuidGeneratorTool } from '@/pages/tools/UuidGeneratorTool';
import { TimestampConverterTool } from '@/pages/tools/TimestampConverterTool';
import { ColorConverterTool } from '@/pages/tools/ColorConverterTool';
import { CaseConverterTool } from '@/pages/tools/CaseConverterTool';
import { TextSorterTool } from '@/pages/tools/TextSorterTool';
import { ReverseTextTool } from '@/pages/tools/ReverseTextTool';
import { LoremIpsumTool } from '@/pages/tools/LoremIpsumTool';
import { PasswordGeneratorTool } from '@/pages/tools/PasswordGeneratorTool';
import { UsernameGeneratorTool } from '@/pages/tools/UsernameGeneratorTool';
import { TextToListTool } from '@/pages/tools/TextToListTool';
// Image tools
import { ImageResizerTool } from '@/pages/tools/ImageResizerTool';
import { ImageCropperTool } from '@/pages/tools/ImageCropperTool';
import { ImageRotatorTool } from '@/pages/tools/ImageRotatorTool';
import { ImageFlipperTool } from '@/pages/tools/ImageFlipperTool';
import { ImageToPngTool } from '@/pages/tools/ImageToPngTool';
import { ImageToJpgTool } from '@/pages/tools/ImageToJpgTool';
import { PngToWebpTool } from '@/pages/tools/PngToWebpTool';
import { WebpToPngTool } from '@/pages/tools/WebpToPngTool';
import { ImageCompressorTool } from '@/pages/tools/ImageCompressorTool';
import { ImageColorPickerTool } from '@/pages/tools/ImageColorPickerTool';
import { ImageDimensionsTool } from '@/pages/tools/ImageDimensionsTool';
import { ImageToBase64Tool } from '@/pages/tools/ImageToBase64Tool';
import { Base64ToImageTool } from '@/pages/tools/Base64ToImageTool';
import { FaviconGeneratorTool } from '@/pages/tools/FaviconGeneratorTool';
import { ImageFormatInfoTool } from '@/pages/tools/ImageFormatInfoTool';

function ToolSeoJsonLd({ slug, meta }: { slug: string; meta: { title: string; description: string } }) {
  const toolContent = toolContentMap[slug];
  const appName = meta.title.split(' —')[0];
  const softwareLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: appName,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web Browser',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    url: `https://www.gadgetsurge.com/tools/${slug}`,
  };
  const faqLd =
    toolContent?.faqs && toolContent.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: toolContent.faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer },
          })),
        }
      : null;

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(softwareLd)}</script>
      {faqLd && <script type="application/ld+json">{JSON.stringify(faqLd)}</script>}
    </>
  );
}

const customToolComponents: Record<string, React.ComponentType<{ tool: any }>> = {
  'regex-tester': RegexTesterTool,
  'uuid-generator': UuidGeneratorTool,
  'timestamp-converter': TimestampConverterTool,
  'color-converter': ColorConverterTool,
  'case-converter': CaseConverterTool,
  'text-sorter': TextSorterTool,
  'reverse-text': ReverseTextTool,
  'lorem-ipsum-generator': LoremIpsumTool,
  'random-password-generator': PasswordGeneratorTool,
  'random-username-generator': UsernameGeneratorTool,
  'text-to-list': TextToListTool,
  // Image tools
  'image-resizer': ImageResizerTool,
  'image-cropper': ImageCropperTool,
  'image-rotator': ImageRotatorTool,
  'image-flipper': ImageFlipperTool,
  'image-to-png': ImageToPngTool,
  'image-to-jpg': ImageToJpgTool,
  'png-to-webp': PngToWebpTool,
  'webp-to-png': WebpToPngTool,
  'image-compressor': ImageCompressorTool,
  'image-color-picker': ImageColorPickerTool,
  'image-dimensions-checker': ImageDimensionsTool,
  'image-to-base64': ImageToBase64Tool,
  'base64-to-image': Base64ToImageTool,
  'favicon-generator': FaviconGeneratorTool,
  'image-format-info': ImageFormatInfoTool,
};

export default function ToolPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const tool = slug ? getToolBySlug(slug) : undefined;

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const data = searchParams.get('data');
    if (data) {
      try { setInput(decodeURIComponent(data)); } catch { setInput(data); }
    }
  }, [searchParams]);

  const handleProcess = useCallback(() => {
    if (!slug || !toolProcessors[slug]) return;
    setError('');
    setOutput('');
    try {
      const result = toolProcessors[slug](input);
      setOutput(result);
    } catch (e: any) {
      setError(e.message || 'An error occurred');
    }
  }, [input, slug]);

  useEffect(() => {
    setInput('');
    setOutput('');
    setError('');
    const data = searchParams.get('data');
    if (data) {
      try { setInput(decodeURIComponent(data)); } catch { setInput(data); }
    }
  }, [slug]);

  const meta = toolSeoMetaMap[slug ?? ""] ?? toolSeoFallbackMeta;
  const canonical = `https://www.gadgetsurge.com/tools/${slug}`;

  if (!tool) {
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
        <h1 className="text-2xl font-bold text-foreground mb-2">Tool Not Found</h1>
        <p className="text-muted-foreground">The tool you're looking for doesn't exist.</p>
      </div>
    );
  }

  // Custom tool rendering
  if (tool.type === 'custom') {
    const CustomComponent = slug ? customToolComponents[slug] : undefined;
    return (
      <>
        <Helmet>
          <title>{meta.title}</title>
          <meta name="description" content={meta.description} />
          <link rel="canonical" href={canonical} />
          <meta property="og:title" content={meta.title} />
          <meta property="og:description" content={meta.description} />
          <meta property="og:url" content={canonical} />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="GadgetSurge" />
          <ToolSeoJsonLd slug={tool.slug} meta={meta} />
        </Helmet>
        <ToolPageTemplate tool={tool}>
          {CustomComponent ? <CustomComponent tool={tool} /> : null}
        </ToolPageTemplate>
      </>
    );
  }

  // Standard tool rendering
  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GadgetSurge" />
        <ToolSeoJsonLd slug={tool.slug} meta={meta} />
      </Helmet>
      <ToolPageTemplate tool={tool}>
        <ToolInterface
          slug={tool.slug}
          inputValue={input}
          onInputChange={setInput}
          outputValue={output}
          error={error}
          onProcess={handleProcess}
          actionLabel={getActionLabel(tool.slug)}
          exampleInput={tool.exampleInput}
        />
      </ToolPageTemplate>
    </>
  );
}

function getActionLabel(slug: string): string {
  const labels: Record<string, string> = {
    'json-formatter': 'Format JSON',
    'base64-encoder': 'Encode',
    'base64-decoder': 'Decode',
    'url-encoder': 'Encode URL',
    'url-decoder': 'Decode URL',
    'jwt-decoder': 'Decode JWT',
    'csv-to-json': 'Convert to JSON',
    'json-to-csv': 'Convert to CSV',
    'markdown-to-html': 'Convert to HTML',
    'html-formatter': 'Format HTML',
    'sql-formatter': 'Format SQL',
    'word-counter': 'Count Words',
    'character-counter': 'Count Characters',
    'sentence-counter': 'Count Sentences',
    'paragraph-counter': 'Count Paragraphs',
    'remove-extra-spaces': 'Remove Spaces',
    'remove-line-breaks': 'Remove Line Breaks',
    'duplicate-line-remover': 'Remove Duplicates',
    'slug-generator': 'Generate Slug',
  };
  return labels[slug] || 'Process';
}
