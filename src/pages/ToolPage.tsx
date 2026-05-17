import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getToolBySlug } from '@/lib/tools-registry';
import { toolSeoFallbackMeta, toolSeoMetaMap } from '@/lib/toolSeoMetaMap';
import { toolProcessors } from '@/utils/tool-logic';
import { ToolPageTemplate } from '@/components/ToolPageTemplate';
import { ToolInterface } from '@/components/ToolInterface';

function ToolPageHelmet({ slug, meta }: { slug: string; meta: { title: string; description: string } }) {
  const canonical = `https://www.gadgetsurge.com/tools/${slug}`;

  return (
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
  );
}

const customToolComponents: Record<string, React.LazyExoticComponent<React.ComponentType<{ tool: any }>>> = {
  'regex-tester': React.lazy(() => import('@/pages/tools/RegexTesterTool').then(m => ({ default: m.RegexTesterTool }))),
  'uuid-generator': React.lazy(() => import('@/pages/tools/UuidGeneratorTool').then(m => ({ default: m.UuidGeneratorTool }))),
  'timestamp-converter': React.lazy(() => import('@/pages/tools/TimestampConverterTool').then(m => ({ default: m.TimestampConverterTool }))),
  'color-converter': React.lazy(() => import('@/pages/tools/ColorConverterTool').then(m => ({ default: m.ColorConverterTool }))),
  'case-converter': React.lazy(() => import('@/pages/tools/CaseConverterTool').then(m => ({ default: m.CaseConverterTool }))),
  'text-sorter': React.lazy(() => import('@/pages/tools/TextSorterTool').then(m => ({ default: m.TextSorterTool }))),
  'reverse-text': React.lazy(() => import('@/pages/tools/ReverseTextTool').then(m => ({ default: m.ReverseTextTool }))),
  'lorem-ipsum-generator': React.lazy(() => import('@/pages/tools/LoremIpsumTool').then(m => ({ default: m.LoremIpsumTool }))),
  'random-password-generator': React.lazy(() => import('@/pages/tools/PasswordGeneratorTool').then(m => ({ default: m.PasswordGeneratorTool }))),
  'random-username-generator': React.lazy(() => import('@/pages/tools/UsernameGeneratorTool').then(m => ({ default: m.UsernameGeneratorTool }))),
  'text-to-list': React.lazy(() => import('@/pages/tools/TextToListTool').then(m => ({ default: m.TextToListTool }))),
  'image-resizer': React.lazy(() => import('@/pages/tools/ImageResizerTool').then(m => ({ default: m.ImageResizerTool }))),
  'image-cropper': React.lazy(() => import('@/pages/tools/ImageCropperTool').then(m => ({ default: m.ImageCropperTool }))),
  'image-rotator': React.lazy(() => import('@/pages/tools/ImageRotatorTool').then(m => ({ default: m.ImageRotatorTool }))),
  'image-flipper': React.lazy(() => import('@/pages/tools/ImageFlipperTool').then(m => ({ default: m.ImageFlipperTool }))),
  'image-to-png': React.lazy(() => import('@/pages/tools/ImageToPngTool').then(m => ({ default: m.ImageToPngTool }))),
  'image-to-jpg': React.lazy(() => import('@/pages/tools/ImageToJpgTool').then(m => ({ default: m.ImageToJpgTool }))),
  'png-to-webp': React.lazy(() => import('@/pages/tools/PngToWebpTool').then(m => ({ default: m.PngToWebpTool }))),
  'webp-to-png': React.lazy(() => import('@/pages/tools/WebpToPngTool').then(m => ({ default: m.WebpToPngTool }))),
  'image-compressor': React.lazy(() => import('@/pages/tools/ImageCompressorTool').then(m => ({ default: m.ImageCompressorTool }))),
  'image-color-picker': React.lazy(() => import('@/pages/tools/ImageColorPickerTool').then(m => ({ default: m.ImageColorPickerTool }))),
  'image-dimensions-checker': React.lazy(() => import('@/pages/tools/ImageDimensionsTool').then(m => ({ default: m.ImageDimensionsTool }))),
  'image-to-base64': React.lazy(() => import('@/pages/tools/ImageToBase64Tool').then(m => ({ default: m.ImageToBase64Tool }))),
  'base64-to-image': React.lazy(() => import('@/pages/tools/Base64ToImageTool').then(m => ({ default: m.Base64ToImageTool }))),
  'favicon-generator': React.lazy(() => import('@/pages/tools/FaviconGeneratorTool').then(m => ({ default: m.FaviconGeneratorTool }))),
  'image-format-info': React.lazy(() => import('@/pages/tools/ImageFormatInfoTool').then(m => ({ default: m.ImageFormatInfoTool }))),
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

  const CustomComponent = slug ? customToolComponents[slug] : undefined;

  return (
    <>
      <ToolPageHelmet slug={tool.slug} meta={meta} />
      <ToolPageTemplate tool={tool}>
        {tool.type === 'custom' && CustomComponent ? (
          <React.Suspense fallback={<div style={{ minHeight: '280px' }} />}>
            <CustomComponent tool={tool} />
          </React.Suspense>
        ) : (
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
        )}
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
