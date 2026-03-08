import type { ToolConfig } from '@/lib/tools-registry';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface SeoSectionProps {
  tool: ToolConfig;
}

export function SeoSection({ tool }: SeoSectionProps) {
  return (
    <div className="mt-10 space-y-8">
      {/* What this tool does */}
      <section>
        <h2 className="text-xl font-bold text-foreground mb-3">What This Tool Does</h2>
        <p className="text-muted-foreground leading-relaxed">{tool.introText}</p>
      </section>

      {/* Example */}
      <section>
        <h2 className="text-xl font-bold text-foreground mb-3">Example</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Input</h3>
            <pre className="font-code text-xs bg-muted rounded-lg p-4 overflow-x-auto text-foreground whitespace-pre-wrap break-all">
              {tool.exampleInput}
            </pre>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Output</h3>
            <pre className="font-code text-xs bg-muted rounded-lg p-4 overflow-x-auto text-foreground whitespace-pre-wrap break-all">
              {tool.exampleOutput}
            </pre>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      {tool.useCases.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">Common Use Cases</h2>
          <ul className="list-disc list-inside space-y-1.5 text-muted-foreground">
            {tool.useCases.map((uc, i) => (
              <li key={i}>{uc}</li>
            ))}
          </ul>
        </section>
      )}

      {/* FAQ */}
      {tool.faqItems.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {tool.faqItems.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-foreground">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
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
