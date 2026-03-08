import { Link } from 'react-router-dom';
import type { ToolConfig } from '@/lib/tools-registry';
import { useCaseLabels } from '@/lib/tools-registry';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface SeoSectionProps {
  tool: ToolConfig;
}

export function SeoSection({ tool }: SeoSectionProps) {
  return (
    <div className="mt-12 space-y-10">
      {/* What this tool does */}
      <section>
        <h2 className="text-xl font-bold text-foreground mb-3">What This Tool Does</h2>
        <p className="text-muted-foreground leading-relaxed max-w-prose">{tool.introText}</p>
        <p className="text-sm text-muted-foreground mt-3 max-w-prose">
          This tool is part of our <Link to={`/category/${tool.categorySlug}`} className="text-primary hover:underline">{tool.category}</Link> collection. All processing happens in your browser — your data never leaves your device.
        </p>
      </section>

      {/* Example */}
      <section>
        <h2 className="text-xl font-bold text-foreground mb-4">Example</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="px-4 py-2 bg-muted/60 border-b border-border">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Input</h3>
            </div>
            <pre className="font-code text-xs p-4 overflow-x-auto text-foreground whitespace-pre-wrap break-all bg-card">
              {tool.exampleInput}
            </pre>
          </div>
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="px-4 py-2 bg-muted/60 border-b border-border">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Output</h3>
            </div>
            <pre className="font-code text-xs p-4 overflow-x-auto text-foreground whitespace-pre-wrap break-all bg-card">
              {tool.exampleOutput}
            </pre>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      {tool.useCases.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">Common Use Cases</h2>
          <ul className="space-y-2 text-muted-foreground">
            {tool.useCases.map((uc, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span>{uc}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Use Case Tags */}
      {tool.useCaseTags && tool.useCaseTags.length > 0 && (
        <section>
          <h3 className="text-sm font-medium text-foreground mb-2">Browse by use case:</h3>
          <div className="flex flex-wrap gap-2">
            {tool.useCaseTags.map(tag => (
              <Link
                key={tag}
                to={`/tools?useCase=${tag}`}
                className="px-3 py-1 text-xs font-medium rounded-full border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                {useCaseLabels[tag]}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      {tool.faqItems.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full rounded-lg border border-border overflow-hidden">
            {tool.faqItems.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-b border-border last:border-0">
                <AccordionTrigger className="text-left text-foreground px-4 hover:bg-muted/40 transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground px-4 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      )}
    </div>
  );
}
