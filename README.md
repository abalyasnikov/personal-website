# balyasnikov.com

Next.js implementation of Andrey Balyasnikov's personal site. The current direction is intentionally close to [martin-slaney.com](https://martin-slaney.com/) so it can serve as a clean baseline for later iterations.

## Run

```bash
npm install
npm run dev -- -p 3001
```

Open `http://localhost:3001`. Run `npm run build` for the production static-export check.

## Structure

| Path | Purpose |
|---|---|
| `app/` | Page, metadata, and global styles |
| `components/SiteChrome.tsx` | Theme and accent exploration controls |
| `components/ArticleChrome.tsx` | Sticky navigation shared by article pages |
| `components/MarkdownArticle.tsx` | Shared design-system renderer for post content |
| `content/site.tsx` | Structured site content |
| `content/writing/*.md` | Blog posts and their metadata |
| `lib/posts.ts` | Markdown discovery, validation, and sorting |
| `styles/tokens.css` | Runtime design tokens |
| [`DESIGN.md`](DESIGN.md) | Current design system and decisions |
| [`CLAUDE.md`](CLAUDE.md) | Current instructions and guardrails for coding agents |
| [`SPEC.md`](SPEC.md) | Historical brief and decision context; not current implementation authority |
| `demo/index.html` | Preserved previous standalone version |
| [`demo/DESIGN.md`](demo/DESIGN.md) | Design system that belonged to the previous version |

The bottom picker changes accent color and the hero accent treatment. Choices persist in `localStorage`. Dark/light theme is independent.

## Write a post

Add a Markdown file to `content/writing/`. Its filename becomes the URL slug.

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

Use `draft` or `published` for `status`. Published posts with a date show the month and year; drafts show `Draft`. Status is a visible label, not a privacy control: every file in this directory is listed and receives a static route. Keep private drafts elsewhere.

Optional `order` puts explicitly ordered posts first. Equal or missing values fall back to newest date and then slug. The page title comes from frontmatter, so the Markdown body starts at `##`; level-two headings are numbered automatically.

The shared renderer supports level-two and level-three headings, paragraphs, lists, links, images, blockquotes, horizontal rules, inline code, fenced code blocks, and GFM tables.

Posts intentionally use plain Markdown rather than MDX. Raw HTML, JSX, and per-post presentation are not part of the authoring format; the shared renderer keeps every article inside the design system.
