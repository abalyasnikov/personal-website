# balyasnikov.com — agent instructions

Andrey Balyasnikov's personal site: a statically exported Next.js 15 app. The
design is a single narrow column with a circular portrait, monospace navigation,
numbered sections and quiet rules, built on the project's own tokens,
interaction rules and writing system.

## Sources of truth

Use these in order:

1. **`docs/DESIGN.md`** owns the current visual system and settled interaction
   rules. `styles/tokens.css` must implement its tokens exactly.
2. **The active content files** own what appears on the site:
   `content/site.tsx`, `content/writing/*.md`, and the remaining page copy in
   `app/page.tsx`.
3. **`README.md`** owns setup, project structure, and the post-authoring workflow.
4. **`CODING_STANDARDS.md`** owns the conventions this repository is held to.

## Project map

| Path | Responsibility |
|---|---|
| `config/features.json` | Release visibility flags |
| `app/layout.tsx` | Global metadata, language, font loading, and root document |
| `app/page.tsx` | Home-page composition and section order |
| `app/writing/page.tsx` | Complete writing index |
| `app/writing/[slug]/` | Static post route and post-specific not-found state |
| `components/SiteChrome.tsx` | Theme control |
| `components/ArticleChrome.tsx` | Shared sticky chrome for writing pages |
| `components/WritingList.tsx` | Shared dated post list |
| `components/MarkdownArticle.tsx` | Design-system renderer for Markdown elements |
| `content/site.tsx` | Work, building, and investing content |
| `content/writing/*.md` | Blog post source files |
| `lib/posts.ts` | Post discovery, frontmatter validation, ordering, and date formatting |
| `styles/tokens.css` | Runtime implementation of design tokens |
| `app/globals.css` | Layout and component rules built from those tokens |
| `next.config.ts` | Static-export configuration |
| `scripts/audit/` | Contrast, layout, behaviour and screenshot regression checks |
| `scripts/check-english.mjs` | Enforces the English-only rule across tracked files |
| `public/` | Everything the site serves: portrait, OG image, résumé |
| `assets/` | Sources that must not be published, such as the original portrait PNG |

## Content rules

- Never invent, infer, or round up a fact, metric, date, investment, or title.
  Every number must trace to something Andrey confirmed.
- Keep the site's English direct and falsifiable. Avoid résumé language such as
  “spearheaded,” “leveraged,” “passionate about,” “proven track record,”
  “results-driven,” “at the intersection of,” and “not just X, but Y.”
- Do not reintroduce claims already removed for positioning reasons.
- Preserve confirmed wording and ordering unless the user explicitly asks to
  revisit it.

## Public repository and external services

- Treat `CLAUDE.md` and every tracked file as public. Never store credentials,
  API tokens, OAuth codes or challenges, cookies, payment details, registrar
  contact data, or private dashboard URLs in the repository.
- Keep authentication in user-local browser sessions, credential stores,
  environment variables, or globally configured tools. Refer to setup only by
  tool name and required capability, never by secret value.
- If a newly configured external tool is unavailable in the current agent
  session, start a fresh session instead of copying credentials into prompts or
  files.
- Before a paid or irreversible external action, verify the exact target and
  final price or impact. Proceed only after explicit user authorization, and do
  not add extras beyond the approved scope.

## Known open work

- `content/writing/` holds one published post and three drafts. The drafts are
  placeholders from the build-out of the writing system; they are not exported
  and are not visible to anyone. Delete them once they have served their purpose.
- Writing is live: `showWritingOnHome` in `config/features.json` is on, so the
  home page carries a Writing section and its navigation entry, and the section
  numbering runs to `06 contact`. Turning the flag off hides both and shifts the
  numbering back; the archive and article routes stay reachable either way.
- `public/og.png` is generated, not hand-edited. Its description is a separate
  approved line from the hero and is set at 32px, where it fits two lines with
  7px to spare in the 640px column. Editing that line means re-measuring the
  wrap.

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
- `status` is `draft` or `published`; `date` and `order` are optional. A present
  date is shown on the home page, writing index, and article page.
- `status` decides what ships. Only `published` posts are listed, exported as
  static routes and written to the sitemap; a `draft` produces no page at all.
  Drafts still render under `next dev`, which is how they get previewed.
- Read posts through `getPublishedPosts` anywhere the result reaches a visitor.
  `getAllPosts` includes drafts and belongs only in local tooling.
- Ordered posts come first. Equal or missing `order` values fall back to newest
  date, then slug, so builds remain deterministic.
- The page creates the `<h1>` from `title`, so article bodies start at `##`.
- `##` headings become numbered sections and `>` becomes a takeaway.
- The shared renderer also supports `###`, lists, links, images, tables,
  horizontal rules, inline code, and fenced code blocks.
- Keep posts as plain Markdown. No raw HTML, JSX, inline presentation, or
  one-off per-post styling. Extend `MarkdownArticle` and `docs/DESIGN.md` when a new
  semantic element is genuinely needed.

## Design rules

- Read `docs/DESIGN.md` before changing layout, type, color, spacing, motion, links,
  or interaction states.
- Use semantic variables such as `--canvas`, `--ink`, `--muted`, `--rule`, and
  `--accent`; do not place raw palette values in components.
- Vertical space inside a section comes from `--row-space`, `--label-space` and
  `--section-space`, which are one step and its multiples: X between peer rows,
  2X below a section label, 3X at a section edge. Repeated rows carry no padding
  of their own, and the three distances have to stay in that order.
- A new color, type size, spacing value, radius, or motion rule is a design-system
  change. Update `docs/DESIGN.md` and `styles/tokens.css` together.
- The theme follows the operating system on a first visit and is resolved by the
  inline script in `app/layout.tsx` before the first frame. A manual choice wins
  and persists. Dark mode must stay composed, not a mechanical inversion.
- Signal blue is the locked identity accent and carries two values, `#2b61ff` in
  light and `#5b81f1` in dark. There is no accent picker; do not reintroduce one.
- Type sizes come from the six-step scale in `docs/DESIGN.md`. Do not add a size, and
  do not write a literal `font-size` in `app/globals.css`.
- Text links inherit their surrounding hierarchy at rest, switch to `--accent`
  on hover, and use the accent focus ring for keyboard navigation. Do not make email or résumé links permanently
  blue; persistent accent is reserved for semantic signals such as roles,
  runner state, and writing navigation.
- Use rules only for structural boundaries. Repeated rows rely on spacing.
- Respect `prefers-reduced-motion` and preserve visible keyboard focus.

## Working locally

Use Node `>=20.19.4`; check `node --version` before installs, builds, or audits.

```bash
npm install
npm run dev -- -p 3001
npm run build
```

Use one server at `http://localhost:3001`. Check the owning process before
starting or stopping it; never kill an unknown service to reclaim a port.

Never run `next dev` and `next build` concurrently in the same working tree,
including from another agent: both mutate `.next` and can corrupt the live
server. Stop dev before the authoritative build, then restart it on `3001`. If
the server must stay available, build from an isolated temporary copy.

## Before handing work back

- `npm run build` passes and every Markdown post is listed as an SSG route.
- The active site has zero console errors and no failed local requests.
- `npm run lint` exits 0 and `npm run audit` reports no violations against a dev
  server on `3001`.
- Check 320/375px, 768px, and 1440px with no horizontal overflow.
- Check light and dark themes.
- Verify home → `read all` → post → `all writings`, plus `back` and `back to top`.
- New standalone controls have practical 44px targets and visible focus.
- Read changed copy aloud. If it sounds like a LinkedIn post, rewrite it.
