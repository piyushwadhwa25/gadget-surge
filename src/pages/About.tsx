import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Helmet>
        <title>About GadgetSurge — Free Browser-Based Online Tools</title>
        <meta name="description" content="Learn about GadgetSurge: a free collection of browser-based utilities for developers and creators. Built by an independent developer. No signup, no uploads — everything runs in your browser." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.gadgetsurge.com/about" />
        <meta property="og:title" content="About GadgetSurge — Free Browser-Based Online Tools" />
        <meta property="og:description" content="Learn about GadgetSurge: a free collection of browser-based utilities for developers and creators. Built by an independent developer. No signup, no uploads — everything runs in your browser." />
        <meta property="og:url" content="https://www.gadgetsurge.com/about" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GadgetSurge" />
      </Helmet>

      <Breadcrumbs items={[{ label: 'About' }]} />

      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">About GadgetSurge</h1>

      <div className="space-y-8 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">What this site does</h2>
          <p>
            GadgetSurge is a free toolkit of browser-based utilities for developers, creators, and everyday tasks.
            Format JSON, resize images, merge PDFs, generate passwords, convert data formats, and more — without
            installing software or creating an account.
          </p>
          <p className="mt-3">
            Browse the full collection on the{' '}
            <Link to="/tools" className="text-primary hover:underline">All Tools</Link> page, or jump into a
            category like{' '}
            <Link to="/category/developer-tools" className="text-primary hover:underline">Developer Tools</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Why it&apos;s free</h2>
          <p>
            Every tool on GadgetSurge is completely free — no signup, no account, and no paywall. The goal is a
            simple, reliable place to get a small job done quickly. The site is supported by ads so the tools can
            stay free to use.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Privacy — everything runs in your browser</h2>
          <p>
            All processing happens client-side on your device. Your text, images, and files are never uploaded to
            a GadgetSurge server. That matches how each tool is described across the site: paste or upload locally,
            get a result locally, and leave with nothing stored on our end.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Who&apos;s behind this</h2>
          <p>
            I&apos;m an independent developer. I built and maintain GadgetSurge myself — the tools, the pages, and
            the build pipeline. It&apos;s a solo project focused on useful, private browser utilities rather than a
            large product company.
          </p>
        </section>

        <section>
          <p>
            Questions, bug reports, or tool ideas? Reach out on the{' '}
            <Link to="/contact" className="text-primary hover:underline">Contact</Link> page.
          </p>
        </section>
      </div>
    </div>
  );
}
