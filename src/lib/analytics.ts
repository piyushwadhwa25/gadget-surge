// Analytics layer wired to Google Tag Manager via window.dataLayer.

import { getToolBySlug } from './tools-registry';

export type AnalyticsEvent =
  | { type: 'tool_viewed'; slug: string }
  | { type: 'tool_action_run'; slug: string; action: string }
  | { type: 'copy_result'; slug: string }
  | { type: 'download_result'; slug: string }
  | { type: 'copy_share_link'; slug: string }
  | { type: 'search_used'; query: string; resultCount: number }
  | { type: 'load_example'; slug: string }
  | { type: 'clear_input'; slug: string }
  | { type: 'page_view'; path: string };

// Ensure dataLayer exists
function getDataLayer(): Record<string, unknown>[] {
  if (typeof window === 'undefined') return [];
  (window as any).dataLayer = (window as any).dataLayer || [];
  return (window as any).dataLayer;
}

/** Push a structured event to GTM dataLayer. */
function pushToGTM(eventName: string, payload: Record<string, unknown>) {
  getDataLayer().push({ event: eventName, ...payload });
}

/** Map internal event types to GTM event names + payloads. */
function eventToGTM(event: AnalyticsEvent): { name: string; payload: Record<string, unknown> } {
  switch (event.type) {
    case 'tool_viewed': {
      const tool = getToolBySlug(event.slug);
      return {
        name: 'tool_view',
        payload: {
          tool_name: event.slug,
          category: tool?.categorySlug ?? 'unknown',
        },
      };
    }
    case 'tool_action_run':
      return { name: 'tool_run', payload: { tool_name: event.slug, action: event.action } };
    case 'copy_result':
      return { name: 'copy_result', payload: { tool_name: event.slug } };
    case 'download_result':
      return { name: 'download_result', payload: { tool_name: event.slug } };
    case 'copy_share_link':
      return { name: 'share_tool', payload: { tool_name: event.slug } };
    case 'search_used':
      return { name: 'tool_search', payload: { query: event.query, result_count: event.resultCount } };
    case 'load_example':
      return { name: 'load_example', payload: { tool_name: event.slug } };
    case 'clear_input':
      return { name: 'clear_input', payload: { tool_name: event.slug } };
    case 'page_view':
      return { name: 'page_view', payload: { page_path: event.path } };
  }
}

// Optional external listeners
const listeners: ((event: AnalyticsEvent) => void)[] = [];

export function onAnalyticsEvent(fn: (event: AnalyticsEvent) => void) {
  listeners.push(fn);
  return () => {
    const idx = listeners.indexOf(fn);
    if (idx >= 0) listeners.splice(idx, 1);
  };
}

/** Fire an analytics event — pushes to GTM dataLayer + dev console. */
export function trackEvent(event: AnalyticsEvent) {
  const { name, payload } = eventToGTM(event);

  // Push to GTM
  pushToGTM(name, payload);

  // Dev logging
  if (import.meta.env.DEV) {
    console.debug(`Analytics Event: ${name}`, payload);
  }

  // External listeners
  listeners.forEach(fn => fn(event));
}

/** Fire a page_view event (call from router). */
export function trackPageView(path: string) {
  trackEvent({ type: 'page_view', path });
}
