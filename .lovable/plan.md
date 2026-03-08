

# GadgetSurge — Implementation Plan

## Overview
Build a client-side-only tools platform with 15 developer tools, central registry, reusable templates, SEO optimization, dark mode, and search.

---

## 1. Foundation & Layout

**Tool Registry** (`src/lib/tools-registry.ts`)
- Central config array defining all 15 tools with: name, slug, category, description, keywords, seoTitle, metaDescription, introText, exampleInput, exampleOutput, faqItems, relatedToolSlugs, component reference
- Helper functions: getToolBySlug, getToolsByCategory, searchTools

**Layout** (`src/components/Layout.tsx`)
- Header: "GadgetSurge" logo, tagline, dark mode toggle (sun/moon icon), global search bar
- Navigation: Home, Developer Tools, Image Tools (coming soon), Text Tools (coming soon), Document Tools (coming soon), All Tools — with mobile hamburger menu
- Footer: category links, copyright
- Ad placeholder divs (below header, below tool, bottom) with reserved height

**Dark Mode** — Toggle via class on `<html>`, persist in localStorage, use existing Tailwind dark mode setup

**Theme** — Clean minimal design, monospace font (`font-mono`) for code areas, responsive throughout

## 2. Routing

```
/                              → Homepage
/tools                         → All Tools page
/tools/[slug]                  → Individual tool pages (dynamic from registry)
/category/[slug]               → Category pages
```

All 15 tools + category pages registered as React Router routes, generated from the registry.

## 3. Reusable Components

- **ToolPageTemplate** — Wraps every tool: breadcrumbs, title, description, tool interface slot, SEO content, related tools, ad slots
- **ToolInterface** — Input textarea + action buttons + output textarea + copy/download/clear/load example/share link buttons
- **ToolCard** — Name, description, link — used in grids
- **SearchBar** — Filters registry by name/description/keywords, instant dropdown results
- **RelatedTools** — Grid of related tool cards from relatedToolSlugs
- **SeoSection** — What it does, example I/O, use cases, FAQs (accordion)
- **Breadcrumbs** — Home → Category → Tool
- **AdPlaceholder** — Simple div with reserved height and "Advertisement" label

## 4. Homepage

- Hero with headline "Free Online Tools for Developers, Creators & Everyday Tasks" + search bar
- Featured tools grid (curated subset)
- Developer Tools category preview
- Popular tools section
- Recently added tools section

## 5. Category & All Tools Pages

- `/tools` — grid of all tools from registry
- `/category/developer-tools` — filtered grid + intro text
- Placeholder category pages for image-tools, text-tools, document-tools, calculators with "Coming Soon" messaging

## 6. Tool Logic (15 Tools)

Pure functions in `src/utils/tool-logic/`:

| Tool | Logic |
|------|-------|
| JSON Formatter | `JSON.parse` + `JSON.stringify(obj, null, 2)`, catch errors |
| Base64 Encoder | `btoa()` |
| Base64 Decoder | `atob()` |
| Regex Tester | `new RegExp()`, `matchAll`, highlight spans |
| UUID Generator | `crypto.randomUUID()`, bulk option |
| Timestamp Converter | `new Date()` ↔ Unix timestamp |
| CSV to JSON | Split rows/cols, map to objects |
| JSON to CSV | Extract keys as headers, map values |
| URL Encoder | `encodeURIComponent()` |
| URL Decoder | `decodeURIComponent()` |
| JWT Decoder | Split `.`, base64 decode header+payload |
| Markdown to HTML | Simple regex-based converter (headers, bold, italic, links, code, lists) |
| HTML Formatter | Regex-based indentation |
| SQL Formatter | Keyword-based formatting (SELECT, FROM, WHERE on new lines) |
| Color Converter | Parse HEX↔RGB↔HSL with math conversion |

No external libraries — all pure JS implementations.

## 7. Shareable URLs

- Read `?data=` query param on tool page load via `useSearchParams`
- Decode and populate input textarea
- "Copy Share Link" button encodes current input as `?data=` URL
- Canonical URL set without query params via meta tag

## 8. SEO

- `document.title` and meta description set per page via a `usePageMeta` hook
- JSON-LD structured data: WebSite (homepage), BreadcrumbList (all pages), WebApplication + FAQPage (tool pages)
- Static `sitemap.xml` generated from registry (placed in public/)
- Updated `robots.txt` with sitemap reference

## 9. Implementation Order

1. Tool registry + types + tool logic functions (all 15)
2. Dark mode setup + Layout component (header, nav, footer, ad slots)
3. Reusable components (ToolPageTemplate, ToolInterface, ToolCard, SearchBar, etc.)
4. Homepage
5. All 15 tool page components wired to template
6. Category pages + All Tools page
7. SEO (meta tags, structured data, sitemap)
8. Shareable URLs
9. Polish (responsive, animations, edge cases)

## Technical Notes

- All tool logic as pure functions — no side effects, easy to test
- Registry-driven architecture means adding a tool = add registry entry + component + logic function
- No new dependencies needed — using existing stack (React, React Router, Tailwind, Lucide icons)
- Markdown-to-HTML and SQL/HTML formatters will be simple regex-based (no heavy libs like marked or sql-formatter)
- ~25-30 new files total

