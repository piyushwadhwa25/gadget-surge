import { createRoot, hydrateRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root")!;

const app = (
  <HelmetProvider>
    <App />
  </HelmetProvider>
);

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, app);
} else {
  createRoot(rootElement).render(app);
}

const deferFn = (window as any).requestIdleCallback ?? ((fn: () => void) => setTimeout(fn, 1));
deferFn(() => {
  const s = document.createElement('script');
  s.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-TVFS36TS';
  s.async = true;
  document.head.appendChild(s);
  const ns = document.createElement('noscript');
  const iframe = document.createElement('iframe');
  iframe.src = 'https://www.googletagmanager.com/ns.html?id=GTM-TVFS36TS';
  iframe.height = '0';
  iframe.width = '0';
  iframe.style.cssText = 'display:none;visibility:hidden';
  ns.appendChild(iframe);
  document.body.prepend(ns);
});
