# balyasnikov.com

Personal site of Andrey Balyasnikov. Statically exported Next.js, deployed on
Vercel.

**Live:** [balyasnikov.com](https://balyasnikov.com)

## Stack

| | |
|---|---|
| Framework | Next.js 15, App Router, `output: "export"` |
| Language | TypeScript, React 19 |
| Styling | Plain CSS with design tokens, no framework |
| Content | Markdown with frontmatter |
| Fonts | Inter and JetBrains Mono, self-hosted |

No CSS framework, no component library, no client-side state beyond a theme
toggle. The whole site ships as static HTML.

## Run

```bash
npm install
npm run dev -- -p 3001
```

Open `http://localhost:3001`.

```bash
npm run build     # static export to out/
npm run lint      # ESLint
npm run audit     # accessibility and layout regression suite
npm run check:seo # metadata, schema and index surfaces in out/
```

`npm run audit` expects a dev server already running. It checks colour contrast
in both themes, touch-target sizing against WCAG 2.2 AA, horizontal overflow at
four viewport widths, theme-flash on first paint, and keyboard focus order. Set
`AUDIT_URL` to point it elsewhere.

## Structure

| Path | Responsibility |
|---|---|
| `app/` | Routes, layout, global styles |
| `app/writing/page.tsx` | Complete writing index |
| `app/writing/[slug]/` | Static post route |
| `app/feed.xml/`, `app/llms.txt/` | Machine-readable views of the writing archive |
| `components/` | Writing list, article chrome, Markdown renderer, theme control |
| `content/site.tsx` | Work and building entries |
| `content/writing/*.md` | Posts |
| `lib/posts.ts` | Post discovery, frontmatter validation, ordering |
| `lib/site.ts` | Name, URL, shared descriptions, linked profiles |
| `lib/schema.ts` | Person and BlogPosting structured data |
| `styles/tokens.css` | Design tokens |
| `scripts/audit/` | Regression suite |
| `scripts/seo/` | Export check for metadata, schema and index surfaces |
| `scripts/indexnow/` | Ownership file and post-deploy submission |
| `docs/` | Design system and specs |
| `assets/` | Sources that are not published |

## Writing a post

Add a Markdown file to `content/writing/`. The filename becomes the URL slug.

```md
---
title: The post title
description: One sentence used on the homepage and in metadata.
date: 2026-07-31
status: draft
order: 1
---

## first section

Post copy goes here.

> A blockquote becomes a highlighted takeaway.
```

`status` decides what ships. Only `published` posts are listed, exported as
static routes and written to the sitemap; a `draft` produces no page at all.
Drafts still render under `next dev`, so they can be previewed before release.

When `date` is present, it appears on the home-page preview, the complete writing
index, and the article page. The home page shows three posts and links to the full
index at `/writing`.

`order` puts explicitly ordered posts first; equal or missing values fall back to
newest date, then slug, so builds stay deterministic. The page renders the `<h1>`
from `title`, so bodies start at `##`. Level-two headings are numbered
automatically.

Posts are plain Markdown, not MDX. Raw HTML, JSX and per-post styling are not
part of the authoring format, so no article can drift out of the design system.
Extend the shared renderer instead.

## Search and answer engines

The export carries `robots.txt`, `sitemap.xml`, `feed.xml`, `llms.txt`, a
canonical on every page, and JSON-LD: one `Person` node with a stable `@id` on
every page, and a `BlogPosting` per post whose author points back at it. Every
value traces to something the site already says. `npm run check:seo` verifies
all of it against `out/`.

Only `balyasnikov.com` is meant to be indexed. `vercel.json` marks any other
host `noindex`, so preview deployments cannot compete with it in search.

Publishing a post is a deploy plus one command, run once the deploy is live:

```bash
npm run submit:indexnow
```

It submits the sitemap URLs to IndexNow, which is how Bing — and therefore
ChatGPT and Copilot — sees a new post in hours rather than days. The key lives
in `INDEXNOW_KEY`, in `.env.local` locally and in the Vercel project for the
build; `prebuild` writes the file the site has to serve. The key is public once
deployed, and still never enters git.

## Design system

[`docs/DESIGN.md`](docs/DESIGN.md) owns tokens, layout rules, interaction states
and the decision log. A new colour, type size, spacing value, radius or motion
rule is a system change: update that file and `styles/tokens.css` together.

[`CODING_STANDARDS.md`](CODING_STANDARDS.md) covers the rest: error handling,
typing, naming, and what has to pass before a commit.

Specs for larger pieces of work live in [`docs/specs/`](docs/specs). The most
recent one is the
[July 2026 accessibility and layout audit](docs/specs/2026-07-31-accessibility-and-layout-audit.md),
which is where the contrast, theme and type-scale decisions come from.

## Licence

Source code is MIT, see [LICENSE](LICENSE).

Site content is not covered by it: the writing, the portrait, the résumé and the
biographical copy are © Andrey Balyasnikov, all rights reserved.
