import { Helmet } from 'react-helmet-async';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Mail } from 'lucide-react';

const CONTACT_EMAIL = 'hello@piyushwadhwa.com';
const MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('GadgetSurge feedback')}`;

export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Helmet>
        <title>Contact GadgetSurge — Feedback, Bugs & Tool Suggestions</title>
        <meta name="description" content="Contact GadgetSurge for bug reports, tool suggestions, or general feedback. Reach out by email — usually a reply within a few days." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.gadgetsurge.com/contact" />
        <meta property="og:title" content="Contact GadgetSurge — Feedback, Bugs & Tool Suggestions" />
        <meta property="og:description" content="Contact GadgetSurge for bug reports, tool suggestions, or general feedback. Reach out by email — usually a reply within a few days." />
        <meta property="og:url" content="https://www.gadgetsurge.com/contact" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GadgetSurge" />
      </Helmet>

      <Breadcrumbs items={[{ label: 'Contact' }]} />

      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Contact</h1>

      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p>
          Have a bug report, a tool suggestion, or general feedback? Email is the best way to reach me.
          I read every message and usually reply within a few days.
        </p>

        <p>
          Welcome messages include broken tools, feature ideas, content corrections, and questions about how
          GadgetSurge works. Spam and unrelated promotions will be ignored.
        </p>

        <a
          href={MAILTO}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Mail className="h-4 w-4" />
          Email {CONTACT_EMAIL}
        </a>

        <p className="text-sm">
          Or copy the address:{' '}
          <a href={MAILTO} className="text-primary hover:underline">
            {CONTACT_EMAIL}
          </a>
        </p>
      </div>
    </div>
  );
}
