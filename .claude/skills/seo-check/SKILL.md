---
name: seo-check
description: Verify what the site tells search engines and answer engines — canonicals, titles, descriptions, JSON-LD, sitemap, feed and llms.txt — and run the release steps that follow a deploy, such as the IndexNow submission. Use when Andrey asks about SEO, indexing, AI search visibility, structured data, or after publishing a post.
---

# SEO check

Two jobs: verify the export before it ships, and run the steps that only make
sense once it is live. `npm run audit` already covers how a page looks. This
covers what a machine is told about it.

## Before shipping

```bash
npm run build && npm run check:seo
```

`scripts/seo/check.mjs` reads `out/` the way a crawler does — no browser, no
server. It fails on a missing or wrong canonical, a missing title, description
or `og:image`, an `og:image` that was never exported, a missing or incomplete
`Person` node, a missing `BlogPosting` node on a post, an author that does not
resolve to the `Person` on the same page, and any published URL absent from
`sitemap.xml`, `feed.xml` or `llms.txt`.

It warns, never fails, on a title over 60 characters or a description over 160.
Those are truncation limits, not errors. Report the warning and let Andrey
decide; post titles carry a ` — Andrey Balyasnikov` suffix that pushes longer
titles past the limit, and the fix is a copy decision, not a code one.

## After a deploy

IndexNow tells Bing within hours instead of days, and Bing's index is what
ChatGPT and Copilot answer from. The API fetches the ownership file from the
live site, so this runs **after** the deploy is live, never before:

```bash
npm run submit:indexnow
```

The key lives in `INDEXNOW_KEY` — in `.env.local` locally, in the Vercel project
for the deployed build — and `prebuild` writes the served file from it. The key
is public once deployed but never enters git, which is why it is an environment
variable rather than a committed file.

## What lives where

| Surface | Source |
|---|---|
| `robots.txt`, `sitemap.xml` | `app/robots.ts`, `app/sitemap.ts` |
| `feed.xml`, `llms.txt` | `app/feed.xml/route.ts`, `app/llms.txt/route.ts` |
| `Person` and `BlogPosting` schema | `lib/schema.ts` |
| Name, URL, shared descriptions, profiles | `lib/site.ts` |
| Non-canonical hosts marked `noindex` | `vercel.json` |

## Rules

- Schema fields carry facts, and the content rules apply to them exactly as they
  apply to page copy. Every value traces to something already on the site or
  something Andrey confirmed. Do not add `worksFor`, `alumniOf`, an award or a
  metric that the site itself does not state.
- `AUTHOR_PROFILES` in `lib/site.ts` is an identity claim in both directions. A
  profile belongs there only while it links back to this site.
- Do not add `llms.txt` prose, feed copy or schema descriptions that restate the
  site in new words. Reuse the approved lines from `lib/site.ts` and post
  frontmatter.
- Registration and dashboards are Andrey's to do: Google Search Console, Bing
  Webmaster Tools, and the profile links back to the domain. Prepare the exact
  value or record for him; never ask for a credential.
