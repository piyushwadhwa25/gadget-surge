# GadgetSurge — Developer Onboarding & Codebase Guide

This document explains **what this project is**, **how it is structured**, and **how to work on it**—written for someone who is new to programming and new to this codebase.

---

## 1) What is GadgetSurge?

GadgetSurge is a React + TypeScript web app that provides many free browser-based tools:

- Developer tools (JSON formatter, Base64 tools, regex tester, etc.)
- Text tools (word counter, case converter, slug generator, etc.)
- Image tools (resizer, cropper, converter, compressor, etc.)

A key design goal is privacy: tool processing is done in the browser (client-side), so user data typically does not need to leave the device.

---

## 2) Tech stack (simple explanation)

- **React**: builds UI from components (reusable pieces of screen).
- **TypeScript**: JavaScript with types to catch errors earlier.
- **Vite**: fast local dev server + build tool.
- **React Router**: navigation between pages (`/`, `/tools/:slug`, etc.).
- **Tailwind CSS + shadcn/ui**: UI styling and reusable UI primitives.
- **Vitest**: test runner.

You can see scripts and dependencies in `package.json`.

---

## 3) How to run the project locally

### Prerequisites

- Node.js installed
- npm available

### Setup

```bash
npm install
npm run dev
```

Open the local URL shown by Vite (usually `http://localhost:5173`).

### Useful commands

```bash
npm run dev          # start development server
npm run build        # production build
npm run preview      # preview production build locally
npm run lint         # lint checks
npm run test         # run tests once
npm run test:watch   # run tests in watch mode
```

---

## 4) High-level architecture (how the app fits together)

Think of the app in 4 layers:

1. **Entry + providers**
   - `src/main.tsx` mounts the app.
   - Wraps app with `HelmetProvider` for SEO head tags.

2. **App shell + routes**
   - `src/App.tsx` defines routes and top-level providers (`QueryClientProvider`, `TooltipProvider`, toasters).

3. **Pages**
   - `src/pages/*` are route-level screens:
     - `Index.tsx` = home page
     - `AllTools.tsx` = all tools listing
     - `CategoryPage.tsx` = tools by category
     - `ToolPage.tsx` = a specific tool page

4. **Data + logic + reusable components**
   - `src/lib/tools-registry.ts` stores tool metadata and category definitions.
   - `src/utils/tool-logic/*` stores pure processing functions.
   - `src/components/*` stores reusable UI components.

---

## 5) Important files and what they do

### `src/main.tsx`
- Finds the `root` element.
- Uses `hydrateRoot` if HTML already exists (prerendered SSR-like content), else `createRoot`.
- Wraps app in `HelmetProvider`.

### `src/App.tsx`
- Creates a `QueryClient`.
- Adds global UI providers and route setup.
- Main routes:
  - `/`
  - `/tools`
  - `/tools/:slug`
  - `/category/:slug`
  - fallback `*` (not found)

### `src/lib/tools-registry.ts`
This is one of the most important files.

It defines:
- `ToolConfig` (shape of one tool’s metadata)
- `CategoryConfig` (shape of one category)
- `tools` array (all tools)
- `categories` array

A tool entry includes:
- name, slug, category
- SEO title/meta
- intro/example data
- related tools
- type (`standard` or `custom`)

### `src/pages/ToolPage.tsx`
This page decides **how a tool runs**.

- Reads `slug` from URL.
- Looks up tool metadata by slug.
- If tool is custom UI, renders a custom component.
- Otherwise uses generic `<ToolInterface />` and runs function from `toolProcessors`.
- Handles input/output state and errors.

### `src/components/ToolInterface.tsx`
Generic UI for simple tools:
- input textarea
- process button
- output textarea
- copy / download / share helpers
- basic events tracking

### `src/utils/tool-logic/index.ts` and `src/utils/tool-logic/text-tools.ts`
Contains pure logic functions (format/encode/decode/convert/count/generate).

Examples:
- `formatJson`
- `base64Encode` / `base64Decode`
- `urlEncode` / `urlDecode`
- `wordCount`, `characterCount`
- `generateSlug`, `generatePassword`

These are mostly plain input→output functions.

---

## 6) How tool rendering works (end-to-end flow)

When a user opens a tool URL like `/tools/json-formatter`:

1. Router sends request to `ToolPage`.
2. `ToolPage` reads `slug = json-formatter`.
3. It finds metadata from `tools-registry`.
4. If `tool.type === 'custom'`, it renders a dedicated component (e.g., regex tester).
5. If standard, it uses shared `ToolInterface`.
6. On “Process”, it calls the matching processor function and shows output.

This architecture keeps simple tools fast to add while allowing custom UI where needed.

---

## 7) `standard` vs `custom` tools (for beginners)

### Standard tool
Use this when a tool can be represented as:
- one input
- one button/action
- one output

Example: URL encode/decode, JSON formatter.

### Custom tool
Use this when tool needs:
- multiple controls
- real-time previews
- file/canvas interactions
- richer UI states

Example: image cropper, regex tester, password generator UI.

---

## 8) How to add a new tool (step-by-step)

### Option A — Add a standard tool

1. **Create the logic function** in `src/utils/tool-logic/index.ts` or `text-tools.ts`.
2. **Register the function** in the processor map (where tool slugs map to functions).
3. **Add tool metadata** in `src/lib/tools-registry.ts`:
   - name, slug, descriptions, examples, FAQ, related slugs, etc.
4. **(Recommended)** add richer content in `src/lib/toolContentMap.ts`.
5. Run app and test the new `/tools/<your-slug>` route.

### Option B — Add a custom tool

1. Create a dedicated component in `src/pages/tools/<YourTool>.tsx`.
2. Add tool metadata in `tools-registry.ts` with `type: 'custom'`.
3. Register component in `customToolComponents` map in `src/pages/ToolPage.tsx`.
4. Add tool content in `toolContentMap.ts`.
5. Test UI and behavior manually.

---

## 9) SEO and metadata model

SEO is handled in multiple places:

- Page-level `<Helmet>` usage (`Index`, `ToolPage`, etc.)
- Tool-specific metadata maps in `src/lib/toolSeoMetaMap.ts`
- Canonical URLs for pages
- JSON-LD schema on homepage

Because this is a tools website, metadata quality is important for discoverability.

---

## 10) Build-time scripts and content generation

In `package.json`:

- `prebuild` runs:
  - `scripts/sync-tool-content-data.mjs`
  - `scripts/generate-sitemap.mjs`
- `postbuild` runs:
  - `scripts/prerender.mjs`

This means production build is not only bundling code—it also updates content/sitemap/prerender output.

---

## 11) Basic coding patterns used in this repo

### Pattern: “pure function logic”
Most processors are pure functions:
- input string in
- output string out
- throw error for invalid input

This is beginner-friendly and easy to test.

### Pattern: “metadata-driven UI”
`tools-registry.ts` holds lots of content/config. UI reads this metadata to render pages consistently.

### Pattern: “shared template + custom override”
- Shared: `ToolPageTemplate` and `ToolInterface`
- Custom override for advanced tools via `customToolComponents`

---

## 12) Testing and quality checks

- Unit tests are in `src/test/*`.
- Run `npm run test` for automated checks.
- Run `npm run lint` for style and potential bug warnings.

For bigger features, do manual checks too:
- navigation links
- tool outputs
- error messages
- mobile layout

---

## 13) Beginner glossary

- **Component**: reusable UI function returning JSX.
- **Props**: inputs passed into a component.
- **State**: data a component remembers and updates.
- **Hook**: React helper function like `useState`, `useEffect`.
- **Slug**: URL-safe identifier (`json-formatter`).
- **Client-side**: code runs in user browser.
- **Hydration**: attaching React behavior to pre-rendered HTML.

---

## 14) Suggested first tasks for new contributors

1. Add a small standard tool (easy win).
2. Add/adjust FAQ content for existing tools.
3. Improve a single processor function with edge-case handling.
4. Add tests for one tool function.
5. Review and improve one page’s accessibility labels.

---

## 15) Quick troubleshooting

- **Build fails**: run `npm install` again and retry.
- **Tool route shows not found**: confirm tool `slug` is correct and registered.
- **Custom tool not rendering**: ensure slug exists in `customToolComponents` map.
- **Processing button does nothing**: check processor map for matching slug.
- **Weird output characters**: verify encoding logic and input assumptions.

---

## 16) Summary for absolute beginners

If you are new:

- Start by reading `src/App.tsx`, `src/pages/ToolPage.tsx`, and `src/lib/tools-registry.ts`.
- Understand that each tool is mostly:
  1) metadata (name/slug/content), and
  2) logic function (input → output).
- For advanced behavior, tools get custom React components.

Once you understand these three ideas, the whole project becomes much easier to navigate.

---

If you want, I can also generate a **“Contributor Playbook”** next (branch strategy, commit style, PR checklist, and release checklist).
