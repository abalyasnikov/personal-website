# balyasnikov.com — agent instructions

Andrey Balyasnikov's personal site. The active implementation is a statically
exported Next.js 15 app. It uses martin-slaney.com as a structural baseline,
then applies the project's own content, tokens, interaction rules, and writing
system.

The earlier standalone exploration is preserved under `demo/`. It is reference
material only; do not edit it while working on the active site.

## Sources of truth

Use these in order:

1. **`DESIGN.md`** owns the current visual system and settled interaction rules.
   `styles/tokens.css` must implement its tokens exactly.
2. **The active content files** own what appears on the site:
   `content/site.tsx`, `content/writing/*.md`, and the remaining page copy in
   `app/page.tsx`.
3. **`README.md`** owns setup, project structure, and the post-authoring workflow.
4. **`SPEC.md`** is the historical product and design brief. It preserves the
   reasoning that started the project, but many implementation details and open
   questions in it have been superseded. Never use it to overwrite current code,
   `DESIGN.md`, or user-confirmed content.

The CV project one directory over is background context, not authority. Start at
`../cv/CLAUDE.md` when career context is useful, but treat its content as possibly
out of date. If it conflicts with this project or looks stale, ask Andrey.

## Project map

| Path | Responsibility |
|---|---|
| `app/layout.tsx` | Global metadata, language, font loading, and root document |
| `app/page.tsx` | Home-page composition and section order |
| `app/writing/[slug]/` | Static post route and post-specific not-found state |
| `components/SiteChrome.tsx` | Theme and accent exploration controls |
| `components/ArticleChrome.tsx` | Shared sticky chrome for article pages |
| `components/MarkdownArticle.tsx` | Design-system renderer for Markdown elements |
| `components/IndexList.tsx` | Currently unused earlier list primitive; do not extend unless it is wired back in |
| `content/site.tsx` | Work, building, and investing content |
| `content/writing/*.md` | Blog post source files |
| `lib/posts.ts` | Post discovery, frontmatter validation, ordering, and labels |
| `styles/tokens.css` | Runtime implementation of design tokens |
| `app/globals.css` | Layout and component rules built from those tokens |
| `next.config.ts` | Static-export configuration |
| `public/` | Profile image and downloadable résumé |
| `demo/` | Archived pre-Next.js exploration; do not modify |

## Content rules

- Never invent, infer, or round up a fact, metric, date, investment, or title.
  Every number must trace to something Andrey confirmed.
- Keep the site's English direct and falsifiable. Avoid résumé language such as
  “spearheaded,” “leveraged,” “passionate about,” “proven track record,”
  “results-driven,” “at the intersection of,” and “not just X, but Y.”
- Do not reintroduce claims already removed for positioning reasons. The target
  is hands-on Product Lead / Principal PM work, not a people-manager profile.
- Preserve confirmed wording and ordering unless the user explicitly asks to
  revisit it.

## Known open work

- The `Personal AI assistant` description in `content/site.tsx` is an explicit
  placeholder. Do not replace it until Andrey supplies the factual sentence.
- The three current writing files are public previews labelled `Draft`; none is
  published yet.
- The accent picker and its three hero treatments remain intentionally live
  until Andrey chooses the final identity direction.

## Writing contract

Posts are plain Markdown files in `content/writing/`; do not recreate a TypeScript
post registry.

```md
---
title: The post title
description: One sentence used on the homepage and in metadata.
date: 2026-07-31
status: draft
---

## first section

Post copy.

> A highlighted takeaway.
```

- The filename becomes the slug. Do not duplicate it in frontmatter.
- `status` is `draft` or `published`; `date` and `order` are optional.
- `status` is a visible editorial label, not an access control. Draft files are
  listed and receive static public routes; keep private drafts outside this folder.
- Ordered posts come first. Equal or missing `order` values fall back to newest
  date, then slug, so builds remain deterministic.
- The page creates the `<h1>` from `title`, so article bodies start at `##`.
- `##` headings become numbered sections and `>` becomes a takeaway.
- The shared renderer also supports `###`, lists, links, images, tables,
  horizontal rules, inline code, and fenced code blocks.
- Keep posts as plain Markdown. No raw HTML, JSX, inline presentation, or
  one-off per-post styling. Extend `MarkdownArticle` and `DESIGN.md` when a new
  semantic element is genuinely needed.

## Design rules

- Read `DESIGN.md` before changing layout, type, color, spacing, motion, links,
  or interaction states.
- Use semantic variables such as `--canvas`, `--ink`, `--muted`, `--rule`, and
  `--accent`; do not place raw palette values in components.
- A new color, type size, spacing value, radius, or motion rule is a design-system
  change. Update `DESIGN.md` and `styles/tokens.css` together.
- Light is the default theme and signal blue is the default accent. Dark mode and
  every accent option must remain intentional, not merely functional.
- Keep the accent picker until Andrey locks the identity direction.
- Text links inherit their surrounding hierarchy at rest, switch to `--accent`
  on hover, and use the accent focus ring for keyboard navigation. Do not make email or résumé links permanently
  blue; persistent accent is reserved for semantic signals such as roles,
  post status, runner state, and writing arrows.
- Use rules only for structural boundaries. Repeated rows rely on spacing.
- Respect `prefers-reduced-motion` and preserve visible keyboard focus.

## Working locally

```bash
npm install
npm run dev -- -p 3001
npm run build
```

Use `http://localhost:3001` in this workspace. Port `3000` may belong to another
process; never kill or replace an unknown service just to reclaim it.

`npm run build` is the authoritative type, route, and static-export check. Stop
the dev server before building, then restart it on `3001` so the shared `.next`
directory is not mutated concurrently.

## Before handing work back

- `npm run build` passes and every Markdown post is listed as an SSG route.
- The active site has zero console errors and no failed local requests.
- Check 320/375px, 768px, and 1440px with no horizontal overflow.
- Check light and dark themes plus all accent options affected by the change.
- Verify home → post → `back to writing`, plus `back to top`.
- New standalone controls have practical 44px targets and visible focus.
- Read changed copy aloud. If it sounds like a LinkedIn post, rewrite it.
