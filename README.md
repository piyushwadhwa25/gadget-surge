# GadgetSurge

Browser-based developer tools. JSON, PDF, text, image stuff, a few calculators.

**Live:** [gadgetsurge.com](https://www.gadgetsurge.com)

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)

## What it is

You paste or upload something, it runs in your browser, nothing hits a server. Format JSON, merge PDFs, resize images, that kind of thing.

52 tools across five categories. I built and shipped it myself: the tools, the SEO pages, the build pipeline, analytics, ads, all of it.

## Why I built it

I didn't want another tutorial todo app. I wanted something that forced me through the boring parts too: indexing, bundle size, ad approval, deploy config. Individual tools are small. Everything around them adds up fast.

## Stack

| Thing | Why I picked it |
|-------|-----------------|
| Vite 5, React 18, TypeScript | Fast local dev, static deploy, no SSR framework for a mostly client-side site |
| React Router 6 | `/tools/:slug` maps cleanly to a registry entry |
| Tailwind + Radix (shadcn) | Accessible components without a huge UI kit in the bundle |
| react-helmet-async | Per-page title and meta at runtime; prerender handles the first HTML paint |
| pdf-lib | PDF merge/split in a ~179 KB gzip chunk, lazy-loaded. pdf.js is for rendering viewers; I only mutate PDFs, and that library is much heavier |
| GTM | Events go to `dataLayer`, script loads on `requestIdleCallback`. GA4 lives in GTM, not in this repo |
| Vercel | Serves `dist/`, rewrites tool URLs to prerendered shells, caches hashed assets for a year |

## Architecture

### Prerender without a browser

Google needs titles, meta, FAQ schema, and actual text on tool pages. Pure client-side React gives crawlers an empty div on first load.

I tried Puppeteer-style prerender first. On Vercel that's missing system libraries, slow in CI, and annoying to keep alive.

So I wrote `scripts/prerender.mjs`: reads the Vite output, injects meta + JSON-LD + static HTML blocks, writes `dist/tools/json-formatter/index.html` and so on. No Chromium. Runs in seconds after build.

Sitemap generation is prebuild. Prerender is postbuild. Order matters.

### Seven files per new tool

Yeah, it's a lot. On purpose.

`tools-registry.ts` owns slug, category, FAQs, standard vs custom. Then separate files for runtime SEO meta, long-form content, processor logic, prerender routes, and sitemap entries. Custom tools get a React component wired in `ToolPage.tsx`.

Prebuild copies `toolContentMap.ts` into `toolContentData.mjs` so the prerender script can import it.

I could generate prerender and sitemap routes from the registry. I haven't. When Search Console looks wrong, I'd rather grep a flat list than trace codegen. Runtime reads the registry; build artifacts stay explicit and diffable.

### Lazy loading: tried it, mostly undid it

The main bundle kept growing with every custom tool. Lazy-loading all of them sounded smart.

It wasn't. You click a tool, wait for a chunk, then the UI appears. Felt worse than carrying the extra KB up front.

Now almost everything is a static import (~210 KB gzip main chunk). Only the three PDF tools still use `React.lazy()` because pdf-lib alone is ~179 KB gzip and only those routes need it.

Measure before you split. Best practice isn't always best for your app.

### CSS deferral broke layout

PageSpeed flagged render-blocking Google Fonts. I tried the `media="print"` onload swap trick.

CLS went to 0.506. Text jumped when fonts loaded.

Reverted that. Fonts load normally with `display=swap`, plus woff2 preload for Inter and JetBrains Mono. If I defer CSS again, I'll inline critical styles first.

### Almost shipped cloaked content

The prerender script injects SEO copy (about, how-to, FAQs) into each tool page. First version hid it in a visually-hidden div.

That's cloaking. Same idea Google penalizes: bots see a wall of text users don't.

Fixed it before launch. The block is visible (`#seo-content`). React hydrates on top; the in-app SEO section shows the same content anyway.

## SEO and ads (honest version)

What's working: 52 tool pages with how-to sections, use cases, FAQs. Prerendered shells with BreadcrumbList and FAQ schema. Sitemap has 59 URLs. Canonical is always `https://www.gadgetsurge.com` everywhere (sitemap, prerender, Helmet). `robots.txt` allows normal crawlers and blocks the usual SEO scraper bots.

AdSense approved me, then rejected the site for "low value content." The tool pages aren't empty; each one has real copy. What was missing was trust pages (About, Contact) and any blog or editorial content. Working on that before I reapply.

Also: if your sitemap says `www` but canonical says non-www (or the other way around), you split your own signals. Easy mistake. I check all three files when I add a tool.

## Next

- Blog or editorial layer (partly for AdSense, partly for search)
- Script to emit sitemap/prerender routes from the registry, with a CI check so manual lists don't drift
- Actually marketing it. The build is done; traffic isn't.

## Local dev

Node 18+, npm.

```bash
git clone https://github.com/piyushwadhwa25/gadget-surge.git
cd gadget-surge
npm install
npm run dev    # localhost:8080
```

Production build (sync content, sitemap, vite, prerender):

```bash
npm run build
npm run preview
```

Skip prerender when you're iterating locally:

```bash
SKIP_PRERENDER=1 npm run build
```

| Command | Does |
|---------|------|
| `npm run generate-sitemap` | Rewrite `public/sitemap.xml` |
| `node scripts/sync-tool-content-data.mjs` | Sync content map for prerender |
| `npm run lint` | ESLint |
| `npm run test` | Vitest |

## Layout

```
src/
  lib/tools-registry.ts
  lib/toolSeoMetaMap.ts
  lib/toolContentMap.ts
  lib/analytics.ts          # GTM; category from getToolBySlug()
  pages/ToolPage.tsx
  utils/tool-logic/
scripts/
  prerender.mjs
  generate-sitemap.mjs
  sync-tool-content-data.mjs
public/
  robots.txt, ads.txt, sitemap.xml
```

Built by [Piyush Wadhwa](https://www.gadgetsurge.com). Issues welcome on GitHub.

## License

[MIT](LICENSE)
