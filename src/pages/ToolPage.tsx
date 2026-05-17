import { useState, useEffect, useCallback, type ComponentType } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getToolBySlug } from '@/lib/tools-registry';
import { toolSeoFallbackMeta, toolSeoMetaMap } from '@/lib/toolSeoMetaMap';
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

const customToolComponents: Record<string, ComponentType<{ tool: any }>> = {
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

  const CustomComponent = slug ? customToolComponents[slug] : undefined;

  return (
    <>
      <ToolPageHelmet slug={tool.slug} meta={meta} />
      <ToolPageTemplate tool={tool}>
        {tool.type === 'custom' && CustomComponent ? (
          <CustomComponent tool={tool} />
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
