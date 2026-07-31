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
| `components/` | Writing list, article chrome, Markdown renderer, theme control |
| `content/site.tsx` | Work, building and investing entries |
| `content/writing/*.md` | Posts |
| `lib/posts.ts` | Post discovery, frontmatter validation, ordering |
| `styles/tokens.css` | Design tokens |
| `scripts/audit/` | Regression suite |
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

`status` is `draft` or `published`. It is technical metadata, not a visible label
or access control: every file in the directory is listed and gets a public route.
Keep private drafts elsewhere.

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
