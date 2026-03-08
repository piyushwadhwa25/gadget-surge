// Lightweight analytics event layer — no vendor yet.
// Call these helpers from UI code; swap the implementation when a provider is added.

export type AnalyticsEvent =
  | { type: 'tool_viewed'; slug: string }
  | { type: 'tool_action_run'; slug: string; action: string }
  | { type: 'copy_result'; slug: string }
  | { type: 'download_result'; slug: string }
  | { type: 'copy_share_link'; slug: string }
  | { type: 'search_used'; query: string; resultCount: number }
  | { type: 'load_example'; slug: string }
  | { type: 'clear_input'; slug: string };

const listeners: ((event: AnalyticsEvent) => void)[] = [];

/** Register a listener (e.g. when adding an analytics vendor). */
export function onAnalyticsEvent(fn: (event: AnalyticsEvent) => void) {
  listeners.push(fn);
  return () => {
    const idx = listeners.indexOf(fn);
    if (idx >= 0) listeners.splice(idx, 1);
  };
}

/** Fire an analytics event. */
export function trackEvent(event: AnalyticsEvent) {
  // Dev logging – remove or gate behind env in production
  if (import.meta.env.DEV) {
    console.debug('[analytics]', event.type, event);
  }
  listeners.forEach(fn => fn(event));
}
