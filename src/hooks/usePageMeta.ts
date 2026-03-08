import { useEffect } from 'react';

interface PageMeta {
  title: string;
  description: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
  ogUrl?: string;
  twitterCard?: string;
}

function setMeta(name: string, content: string, attribute: string = 'name') {
  let el = document.querySelector(`meta[${attribute}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attribute, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function usePageMeta({ title, description, canonical, ogTitle, ogDescription, ogType, ogUrl, twitterCard }: PageMeta) {
  useEffect(() => {
    document.title = title;

    setMeta('description', description);

    // Open Graph
    setMeta('og:title', ogTitle || title, 'property');
    setMeta('og:description', ogDescription || description, 'property');
    setMeta('og:type', ogType || 'website', 'property');
    if (ogUrl || canonical) {
      setMeta('og:url', ogUrl || canonical || '', 'property');
    }
    setMeta('og:site_name', 'GadgetSurge', 'property');

    // Twitter
    setMeta('twitter:card', twitterCard || 'summary');
    setMeta('twitter:title', ogTitle || title, 'name');
    setMeta('twitter:description', ogDescription || description, 'name');

    // Canonical
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonical) {
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', canonical);
    } else if (canonicalLink) {
      canonicalLink.remove();
    }
  }, [title, description, canonical, ogTitle, ogDescription, ogType, ogUrl, twitterCard]);
}
