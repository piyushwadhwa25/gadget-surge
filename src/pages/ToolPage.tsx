import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getToolBySlug } from '@/lib/tools-registry';
import { toolProcessors } from '@/utils/tool-logic';
import { ToolPageTemplate } from '@/components/ToolPageTemplate';
import { ToolInterface } from '@/components/ToolInterface';
import { RegexTesterTool } from '@/pages/tools/RegexTesterTool';
import { UuidGeneratorTool } from '@/pages/tools/UuidGeneratorTool';
import { TimestampConverterTool } from '@/pages/tools/TimestampConverterTool';
import { ColorConverterTool } from '@/pages/tools/ColorConverterTool';

export default function ToolPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const tool = slug ? getToolBySlug(slug) : undefined;

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  // Load from ?data= query param
  useEffect(() => {
    const data = searchParams.get('data');
    if (data) {
      try {
        setInput(decodeURIComponent(data));
      } catch {
        setInput(data);
      }
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

  // Reset state when slug changes
  useEffect(() => {
    setInput('');
    setOutput('');
    setError('');
    const data = searchParams.get('data');
    if (data) {
      try { setInput(decodeURIComponent(data)); } catch { setInput(data); }
    }
  }, [slug]);

  if (!tool) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Tool Not Found</h1>
        <p className="text-muted-foreground">The tool you're looking for doesn't exist.</p>
      </div>
    );
  }

  // Custom tool rendering
  if (tool.type === 'custom') {
    return (
      <ToolPageTemplate tool={tool}>
        {slug === 'regex-tester' && <RegexTesterTool tool={tool} />}
        {slug === 'uuid-generator' && <UuidGeneratorTool tool={tool} />}
        {slug === 'timestamp-converter' && <TimestampConverterTool tool={tool} />}
        {slug === 'color-converter' && <ColorConverterTool tool={tool} />}
      </ToolPageTemplate>
    );
  }

  // Standard tool rendering
  return (
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
  };
  return labels[slug] || 'Process';
}
