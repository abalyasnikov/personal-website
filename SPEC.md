# balyasnikov.com — historical product brief

Written and revised 2026-07-30. The document preserves the rationale and target
that started the project. It is no longer the implementation source of truth.

> **Current authority:** use `DESIGN.md` for the visual system, `README.md` for
> setup and authoring, and the active files under `app/`, `content/`, `lib/`, and
> `components/` for implemented behavior and content. The scope, technical spec,
> open questions, and exclusions below are historical unless the current files or
> a later user instruction explicitly confirm them.

## Implemented system as of 2026-07-31

- Next.js 15 App Router with TypeScript and a fully static export.
- One long-scroll home page with `who`, `work`, `building`, `writing`,
  `angel investing`, and `contact` sections.
- Static `/writing/[slug]` routes generated from plain Markdown in
  `content/writing/*.md`.
- YAML frontmatter parsed by `gray-matter`; post bodies rendered by
  `react-markdown` with `remark-gfm` through the shared design system.
- Light and dark themes, a sticky horizontal header, and a runtime accent picker
  with signal blue as the default.
- The earlier standalone exploration remains archived under `demo/`.
- RSS, generated OG images, sitemap/robots routes, analytics, a dedicated
  `/writing` index, `/cv` redirect, deployment, and domain setup are not currently
  implemented.

---

## Context

Andrey is looking for a senior IC product role at a crypto or AI company. The CV
(`../cv/resume.html`) does one job well: it answers a recruiter's checklist in two
printed pages. It cannot do the other job — convince a founder or hiring manager,
in thirty seconds of scrolling, that this person builds things and is worth a call.

A résumé is a document you send. A site is a link you drop in a DM, in an
application form, in a LinkedIn bio, in the first line of a cold email. It works
when Andrey is asleep and it works for people who would never open a PDF.

Why now: the search is active. The site is the highest-leverage artifact that
doesn't exist yet.

**The page's single job:** a senior person at a crypto/AI/infra company lands here
from a link, scrolls once, and decides to reply.

---

## Historical starting state

At the time this brief was written, nothing was built. The starting assets were:

| Asset | Where | Use |
|---|---|---|
| CV project map | [`../cv/CLAUDE.md`](../cv/CLAUDE.md) | Start here for career context |
| CV, hand-maintained HTML | `../cv/resume.html` | Where the facts and numbers came from |
| Positioning notes | `../cv/context/positioning.md` | Target roles, confirmed facts, things deliberately cut |
| Long-form positioning | `../cv/context/positioning-and-interview.md` | The IC reframe, spoken pitch, banned lexicon |
| Career history | `../cv/context/career-context.md` | Raw fact pool |
| CV PDF | `../cv/dist/Andrey Balyasnikov CV.pdf` | Shipped as the download |

Domain `balyasnikov.com` — decided, not yet purchased.

**How to treat the CV project.** It is where the material comes from and it will
save you from re-asking Andrey things he has already answered. It is **not**
binding on this site, and it may be out of date: those files are maintained on the
résumé's own schedule and nothing syncs them here. This brief originally won on
conflict; the current authority order at the top of this file now supersedes that
rule. If something over there looks stale or contradicts itself, ask Andrey rather
than picking a side.

What does carry over unconditionally is the discipline, not the content: no
invented or rounded-up numbers, and no résumé slop.

---

## Scope

**In:** one long-scroll home page, five sections, plus a blog with real per-post
pages, an RSS feed, and a CV download.

**Out of scope, explicitly:**

- Book section, speaking section — Andrey cut both
- `cmd+k` search — the reference has it; with ~15 items on the whole site there is
  nothing to search, and it is the single most obvious "I copied that site" tell
- Comments, newsletter signup, CMS, i18n, contact form
- Case-study subpages for individual products. If a Zerion deep-dive is worth
  writing, it is a blog post, not a new page type

**Ordering constraint:** design direction locks before any section is built.
Rebuilding five sections because the type scale changed is the expensive mistake.

**MVP cut:** home page with all five sections + one published post + working
`/writing` index. RSS, OG images, and dark mode can land the day after without
changing any content.

---

## Information architecture

```
/                    home — hero + 5 sections
/writing             post index
/writing/[slug]      post
/cv                  302 → /andrey-balyasnikov-cv.pdf
/feed.xml            RSS
```

Sections, in order:

| # | Section | What it holds |
|---|---|---|
| — | hero | Name, one-line position, current status, photo, 2-sentence who |
| 1 | work | Zerion, Evotor, QIWI — one entry each |
| 2 | building | ML trading systems, personal AI assistant. Under review, see below |
| 3 | investing | Angel cheques: Alliance DAO, zkSync, Socket, CoW Swap, Align Labs |
| 4 | writing | Three latest posts + link to `/writing` |
| 5 | contact | Email, LinkedIn, GitHub, X, Telegram, CV download |

Five sections, not seven. The reference's `who` is folded into the hero because a
standalone two-sentence section is a speed bump, and `book`/`speaking` are gone.

**On `investing` placement.** It sits after `building`, not after `work`. Andrey is
selling "senior IC who ships," and a portfolio list adjacent to the job history
reads "investor, semi-retired" — the exact wrong signal for the roles in
`positioning.md`. One slot lower it does the job it should do: proof he has been
inside crypto infra since 2017 with his own money, read as evidence rather than as
an identity.

---

## Content spec

Everything below is sourced from `resume.html` and `positioning.md`. Nothing is
invented. Lines marked **[NEEDS FACT]** are blocked on Andrey.

### Hero

- Name: Andrey Balyasnikov
- Position line: **Product Lead** (per `positioning.md`, one title, no double title)
- Status line: currently between roles. **[NEEDS FACT]** — exact wording. The
  reference uses "Currently Product Lead at Bolt.new." Andrey's Zerion dates end
  Jun 2026. Options: state what he's looking for, or state what he's building now.
  Do not write "open to opportunities."
- Who, ~2 sentences, drawn from the summary and the spoken pitch. Draft:
  > First product hire at Zerion. Built a self-custodial wallet from zero to 1M+
  > monthly active wallets, then turned the API we built for ourselves into more
  > than half of company revenue.
- Photo **[NEEDS FACT]** — Andrey will supply. Rendered as a 72px circle at the
  **right** edge of the measure on desktop, above the name on mobile. It moved
  from the left on 2026-07-30: sitting in front of the name it pushed every word
  of the hero 98px right of every word below it, and it was the only thing on the
  page breaking the single left edge. Needs a square source of at least 288px so
  it stays sharp at 2x; served through `next/image`. No border, no ring, no
  shadow — the circle crop is the whole treatment.

### 1. work

Three entries. Company, role, dates, one sentence. No bullets — bullets are what
the CV is for, and a wall of them is the fastest way to make this look like a
résumé someone pasted into a webpage.

| Company | Role | Dates | Sentence source |
|---|---|---|---|
| Zerion | Head of Product | Jun 2018 – Jun 2026 | First product hire. Wallet from zero to 1M+ MAW; productized the internal API into more than half of company revenue; most recently Zerion CLI |
| Evotor | Head of Product | May 2016 – May 2018 | Built the smart-POS app marketplace from zero to $12M/month, 500K+ business customers |
| QIWI (NASDAQ: QIWI) | PM → Senior PM | Apr 2014 – Jun 2016 | Relaunched the mobile apps for Russia's largest payment system, 70M+ MAU |

Zerion heading stays `Head of Product` — factually true, and `positioning.md`
explicitly keeps it there while the site's top-level title stays `Product Lead`.

QIWI end date: `positioning.md` flags a conflict (CV says May 2016, career-context
says Jun 2016). Resolve against LinkedIn before publishing, then fix both files.

### 2. building

Artifacts, not a skills list. Rule 5 of the CV instructions applies verbatim: "SQL,
Python" reads as junior in the agentic era.

- **ML trading systems** — prediction markets and Solana; data pipelines, feature
  engineering, backtesting, live execution. Past tense.
- **Personal AI assistant** — built on OpenClaw. **[NEEDS FACT]** one sentence on
  what it actually does.

Zerion CLI is **not** here. Corrected 2026-07-30: it is Zerion work, not a side
project, so it lives in the Zerion entry under `work`. Still **[NEEDS FACT]** a
public link (npm, GitHub, docs). No metrics — `positioning.md`: "launched with no
product metrics, never claim traction for it."

Telegram bot cut on Andrey's call.

**Open issue: this section is now two entries, and one of them has no
description.** A section that thin reads as filler and may be doing less work than
the space it takes. Three options: add whatever else Andrey has built, fold the two
survivors into a "beyond work" paragraph in the style of the CV's closing section,
or drop the section and let `work` and `investing` carry the page. Decide before
build.

### 3. investing

Angel cheques into crypto infrastructure. Format: name, one factual sentence, year.

Descriptions were researched from public sources and **confirmed correct by Andrey
on 2026-07-30**. Ship them as written:

| Project | Draft one-liner | Year |
|---|---|---|
| Alliance DAO | Web3 accelerator and founder community; invested when it was still DeFi Alliance | **[NEEDS FACT]** |
| zkSync | ZK rollup scaling Ethereum, built by Matter Labs | **[NEEDS FACT]** |
| Socket | Chain abstraction infrastructure — one API to read state and write transactions across 20+ chains; Bungee is the consumer product | **[NEEDS FACT]** |
| CoW Swap | DEX that settles trades through batch auctions and coincidence of wants, so orders are protected from MEV | **[NEEDS FACT]** |
| Align Labs | Full-stack financial infrastructure for stablecoins — cross-border payments over stablecoin and fiat rails with named IBANs | **[NEEDS FACT]** |

Alliance DAO — confirmed: a cheque into the accelerator itself, not a vehicle he
invested through. It rebranded from DeFi Alliance in January 2022, so naming the
old entity in the copy dates the cheque as early without stating a year.

**[NEEDS FACT]** — is the list complete, and what year for each.

No cheque sizes, no ownership, no valuations. Confirmed with Andrey.

### 4. writing

Three most recent posts on the home page: date, title, one-line description, in
the reference's shape because that shape is correct and not ownable. Then a link
to `/writing`.

**[NEEDS FACT]** — where the drafts live. Searched `career-ops/writing-samples/`;
it holds only a README, no files. Post count for v1 depends on the answer. One
published post is enough to launch; zero is not — an empty section is worse than
no section.

Post topics that are already earned by the CV and would not require new thinking:
the social feed as a retention engine and the day push delivery broke; productizing
an internal API into a revenue line; running ML models against prediction markets;
shipping production code through coding agents. Andrey's call, these are only
prompts.

### 5. contact

Email, LinkedIn, GitHub, X, Telegram, CV download button. Same quiet
label-plus-value layout as the rest of the page.

**[NEEDS FACT]** — GitHub, X, Telegram handles. The CV lists only email and
LinkedIn. `positioning.md` open question #4 wants one or two public links proving
he codes; if there is a GitHub with anything on it, it belongs here.

---

## Design direction

The brief is "minimal and careful, like the reference, without being the
reference." That means the shared inheritance is restraint and a narrow measure —
not the reference's specific palette, faces, or devices.

**The system now lives in [`DESIGN.md`](DESIGN.md).** That file holds the tokens
in its frontmatter and the reasoning in its prose, and it is the current one on
any design value. This section keeps the *direction* — what we inherit, what we
refuse, and which axes are still open. Where the two disagree on a number,
`DESIGN.md` is right and this section is stale.

### What we deliberately do not reuse

- The reference's vermilion `#FF4D2E`. Warm paper on its own is fair game and
  Andrey leans that way; it is warm paper **plus** vermilion that reproduces his
  scheme outright, and that pairing is also the most common AI-generated palette
  in circulation. The demo offers the vermilion swatch for calibration only,
  labelled "do not ship"
- Inter + JetBrains Mono — the reference's exact pairing. Offered in the demo as a
  toggle so the tradeoff can be seen rather than argued; picking it moves the site
  markedly closer to the original
- A handwriting face for one hero word
- `01 / 02 / 03` section numbering. Numbering should encode a real sequence; these
  sections are not a sequence, so numbers would be decoration
- A fake terminal block. It is the reference's best idea and its most stealable;
  copying it is the single most detectable move on this page
- A stat-tile grid — big number, small label, three across. It is the template
  answer for "show metrics"

### Tokens — **not locked, pick in the demo**

Four axes are live in `demo/index.html`: paper, accent, type, figures. Andrey picks
one combination; the winning values get written here and the picker is deleted.

Paper is neutral in every option — no tinted backgrounds. The candidates are the
reference's warm `#FAF9F6`, a cool `#FBFBFD`, and plain white. Warm is the default
in the demo because Andrey liked the reference's colour.

Two things found on 2026-07-30 that narrow the choice, both worth knowing before
picking:

- **The warm paper is two points off the line.** A warm cream or beige page
  background is the reflex "tasteful" AI surface; the usual threshold for calling
  one starts at an r−b warmth of 6. `#FAF9F6` measures 4. It is not cream. It is
  narrowly not cream, and it is also the reference's exact paper.
- **The proposed accent is a violet.** `#4B3FD6` is an ultramarine-violet, and
  violet is the single most-cited signature of generated interfaces. The demo's
  own contrast fitter makes it worse in dark mode, lightening it toward lavender.
  It stays in the picker for comparison; it is no longer the recommendation. The
  shortlist now leads with `#12306E` ink navy.

The original starting proposal, kept for the record — its accent is the violet
above, so read it as history rather than as a recommendation:

```
--paper      #FBFBFD    cool near-white
--ink        #14161A    near-black, blue cast
--muted      #6E7480
--rule       #E4E6EB
--accent     #4B3FD6    ultramarine-violet, links only

dark:
--paper      #0E1013
--ink        #E6E8EC
--muted      #8C939F
--rule       #23262C
--accent     #9B93FF
```

Any accent must clear **4.5:1 against paper**. Roughly half the candidate colours
are fill colours, not text colours, and have to be darkened to qualify; the demo
does this automatically and reports it.

### Type

Inverted from the reference: grotesque headings, serif prose. A serif reading face
signals someone who writes, which matters when a fifth of the site is a blog.

**Two faces, never three, and no italic.** Revised 2026-07-30. The three-family
set put grotesque, mono and mono into a single row under `work` — "Zerion",
"Head of Product", the date — and that is what read muddled rather than
considered. The demo now offers four pairings, each of them exactly two faces:

| Pairing | Structural | Prose | Metadata |
|---|---|---|---|
| **grotesque + serif** (default) | Archivo | Newsreader | Archivo, tabular |
| grotesque + mono | Archivo | Archivo | IBM Plex Mono |
| serif-led | Newsreader | Newsreader | Archivo |
| reference's — calibration | Inter | Inter | JetBrains Mono |

Newsreader is loaded roman only; the italic axis is not requested. The position
line under the name was the page's one italic and it now carries the accent
instead.

All three self-hosted via `next/font` — no request to Google's CDN, no layout shift.

The demo also offers the reference's own pairing (Inter / JetBrains Mono) so the
two can be compared directly. Picking it makes the site read markedly closer to
martin-slaney.com, which is the tradeoff being decided — and Inter is on every
overused-font list in circulation, which is the other half of the cost.

Measure: **72ch of the prose face**, not 680px. Corrected 2026-07-30 after
measuring: 680px at Newsreader 16px renders about 92 characters per line, well
past the point where the eye starts losing its place tracking back to the next
line. 72ch renders 74.6. Because the unit is `ch`, the column re-measures itself
when the type axis changes — verified within a tenth of a character across all
three shipping pairings.

### Scale — three sizes, and that is the whole system

Re-measured against the live reference on 2026-07-30, second pass. It now runs on
**six** sizes — 10, 11, 12, 14, 16, 44 — with 75 elements at 14px and 30 at 11px.
Four of the six are clustered inside 4px of each other. So the reference is not
the model for type discipline that the first measurement suggested; on this one
axis our three-size system is tighter than the thing we are learning from. Stop
treating its scale as a target.

What the same pass did find worth knowing: the reference runs on **three
colours** — `#737373` muted (57 uses), `#171717` ink (28), `#FF4D2E` vermilion
(18) — and is **mono-dominant**, 90 elements in JetBrains Mono against 37 in
Inter. That ratio is its personality. Ours is the serif prose; that is the
trade, and it is the right one for a page a fifth of which is a blog.

The first version of this design had **twelve** sizes and 17px body text. That is
what made it read louder and less considered than the reference, and Andrey caught
it. The correction to "four" was written into this spec but never made it into the
demo — a second measurement on 2026-07-30 found **five** sizes rendering, three of
them (10.5px, 11px, 11.5px) within a pixel of each other and doing three different
jobs. No reader can tell a half-pixel apart, so those were never three roles; they
were one role with three values. Collapsed to:

| Role | Size |
|---|---|
| Hero name | 34px / 600, fluid 30–36 |
| Everything in the reading flow — prose, company names, post titles, contact values | 16px, weight 400 or 600 |
| Everything else — section labels, dates, roles, nav, buttons, contact keys, fine print | 12px |

Two weights share 16px: 600 for names you scan down a column, 500 for things you
read once, like the position line and an email address. 600 on an email address
turned it into a headline.

16px rather than the reference's 14px because Newsreader is a serif and needs more
than Inter's tall x-height. If it still reads large, 15px is the floor.

**Hierarchy comes from weight, colour, case and family — never from size.** Adding
a fourth size is a change to the system, not a tweak. The five roles that share
12px are separated by family, weight, case and tracking instead — see the type
table in [`DESIGN.md`](DESIGN.md).

**Mono is for measurement, not atmosphere.** Date ranges are data and earn the
metadata face. A job title is not measurement, so the role beside a company name
sits in the structural face and takes the **accent** instead — the one device
lifted from the reference, and the thing that makes each `work` row read as a
line rather than a paragraph with a bold word on top. Navigation, buttons,
contact keys and section labels are not measurement either.

### Signature — under review

The original proposal made the numbers the visual material: one figure per entry
set in tabular figures, an optical step larger, in the accent colour, inline in the
reading flow. The reasoning was that Andrey's evidence is quantitative where the
reference's is deliberately not.

**It did not survive contact with the page.** At 1.34em it became the largest text
in the reading area — larger than the company names — and read as a growth-landing
tic rather than as confidence. Andrey's word for it was "cheap", and he was right.

The demo now offers three states: `plain`, `accent colour` only, and the original
`colour + bigger`. Default is `plain`. Decision pending.

If `plain` wins, this page has no signature device at all, and that is an
acceptable outcome. What distinguishes it from the reference is then the serif
reading face and the accent — quiet, but real. A page whose job is to be read
without resistance in thirty seconds does not need a gadget, and a gadget that
reads cheap is worse than none.

Everything else stays quiet regardless: hairline rules between entries, generous
vertical rhythm, no cards, no shadows, no gradients, no border radius above 4px.

### Motion

One page-load sequence: the hero settles — name, position, status, paragraph, on
an exponential ease-out over roughly half a second. Nothing else.
`prefers-reduced-motion` fully respected. Scattered hover effects are the tell
that a page was generated rather than designed.

**The per-section scroll fade is cut.** Revised 2026-07-30. It was in the original
draft and it is wrong twice over: an identical entrance on every section is not
one authored moment, it is the same effect seven times; and gating content on a
scroll handler means one broken handler ships a blank page. Content is visible at
rest, and JavaScript only ever changes how it arrives.

---

## Historical target technical spec

> Superseded by the implemented-system summary at the top of this file. This
> section remains only to preserve the original target and explain later changes.

Next.js on Vercel, per Andrey's call. Correct for this: the blog gets statically
generated real HTML per post, which the reference does not have — its posts live as
template literals inside a 187 KB JS bundle rendered through
`dangerouslySetInnerHTML`, so crawlers see an empty `<div id="root">` and every
visitor downloads every post.

| Layer | Choice |
|---|---|
| Framework | Next.js 15, App Router, TypeScript |
| Styling | Tailwind CSS v4 |
| Content | MDX files in `content/writing/*.mdx`, frontmatter: `title`, `date`, `description`, `draft` |
| Rendering | Fully static. Every route prerendered at build |
| Fonts | `next/font/local`, self-hosted, variable |
| OG images | `next/og` — one per post, generated at build, title + date on the site's own palette |
| RSS | `app/feed.xml/route.ts` |
| `/cv` | A static redirect in `next.config.ts` `redirects()`, not a route handler — keeps the route table fully static |
| SEO | `app/sitemap.ts`, `app/robots.ts`, JSON-LD `Person` + `BlogPosting` |
| Dark mode | `prefers-color-scheme` default, toggle persisted to `localStorage` |
| Analytics | Vercel Analytics, one line, no cookies |
| Deploy | Vercel, `balyasnikov.com` |

No database, no CMS, no auth, no API routes beyond the feed. Publishing a post is:
add an MDX file, push, Vercel builds.

### Layout

```
balyasnikov-site/
  app/
    layout.tsx              fonts, theme, metadata
    page.tsx                home
    writing/page.tsx        index
    writing/[slug]/page.tsx post
    writing/[slug]/opengraph-image.tsx
    feed.xml/route.ts
    sitemap.ts  robots.ts
  components/
    Hero.tsx  Section.tsx  WorkEntry.tsx
    ProjectEntry.tsx  InvestmentEntry.tsx  PostCard.tsx
    ThemeToggle.tsx
  content/
    writing/*.mdx
    site.ts                 all home-page copy, one file, typed
  public/
    andrey-balyasnikov-cv.pdf
    photo.jpg
    fonts/
```

Home-page copy lives in `content/site.ts`, not scattered through JSX. Editing a
sentence should never mean opening a component.

---

## Acceptance criteria

1. `balyasnikov.com` serves the home page over HTTPS with a valid certificate
2. Home page renders all five sections plus hero; every fact matches
   `../cv/resume.html`; no number appears that is not in `../cv/context/`
3. `curl -s https://balyasnikov.com | grep "Zerion"` returns a match — content is
   in the HTML, not injected by JS
4. Every published post has its own URL, prerendered, and returns 200 with the full
   post body in the initial HTML response
5. `/feed.xml` validates as RSS 2.0 and lists every non-draft post
6. Each post has a unique OG image; pasting a post URL into Telegram, X and
   LinkedIn previews correctly with title and description
7. `/cv` redirects to the PDF and the PDF downloads with the filename
   `Andrey Balyasnikov CV.pdf`
8. Lighthouse on the home page: Performance ≥ 95, Accessibility 100, SEO 100,
   mobile and desktop
9. Renders correctly at 375px, 768px, 1440px. No horizontal scroll at any width
10. Dark mode works in both directions, persists across reloads, no flash of the
    wrong theme on load
11. Every interactive element is keyboard reachable with a visible focus ring
12. `prefers-reduced-motion: reduce` disables all animation
13. No text on the page uses any phrase from the banned list in `../cv/CLAUDE.md`
    rule 3 or `positioning.md` section 4
14. Zero console errors, zero failed network requests

---

## Effort

| Component | CC |
|---|---|
| ~~Design demo with the direction picker~~ | done |
| Strip the picker, write the chosen values in | ~10 min |
| Next.js scaffold, fonts, tokens, theme toggle | ~20 min |
| Home page, five sections, all copy | ~45 min |
| Blog: MDX pipeline, index, post page, typography | ~40 min |
| RSS, OG images, sitemap, robots, JSON-LD | ~25 min |
| Responsive + a11y pass, Lighthouse | ~30 min |
| Domain, Vercel, DNS, deploy | ~15 min |

Roughly half a day of wall-clock including review rounds, assuming the blocked
facts arrive first.

---

## Rollback

Static site on Vercel. Every deploy is immutable and instantly revertable from the
dashboard. The domain is the only thing that is not a click to undo, and DNS
propagation is the only slow step in the whole project.

---

## Open questions — blocked on Andrey

1. **Writing drafts** — where are they? `career-ops/writing-samples/` has only a
   README. Determines how many posts ship in v1.
2. **Angel investing** — is the list of five complete, and what year for each.
   (Descriptions confirmed. Alliance DAO resolved: a cheque into the accelerator
   itself, back when it was DeFi Alliance.)
3. **Photo** — Andrey to supply. Square, 288px or larger.
4. **Public links** — Zerion CLI (npm/GitHub/docs), GitHub handle, X, Telegram,
   the conference talk on YouTube, DegenScore. `positioning.md` open question #4
   wants at least one; the `building` and `contact` sections both want more.
5. **Hero status line** — exact wording now that Zerion ended Jun 2026.
6. **Do the Zerion metrics go on a public page?** Raised 2026-07-30, not yet
   answered. "More than half of company revenue", $2B+ cumulative volume, 600K
   MAW, NPS 70 are all in the CV already — but the CV is a PDF sent to named
   individuals, while this page is indexed by Google, permanent, and readable by
   former colleagues at Zerion. These are Andrey's own achievements and his to
   publish; the point is that going from addressed-send to open-web is a choice
   worth making deliberately rather than inheriting from the CV by default.
   Either ship them as-is, or soften the figures on the site and keep the full
   set in the PDF.

Nothing is blocked on 3 or 5; the build can start and both drop in at the end.
Items 1, 2 and 4 gate their own sections. Item 6 gates the `work` copy.

## Decisions log

Settled during the 2026-07-30 session, so they are not re-opened by accident:

| Decision | Why |
|---|---|
| Five sections, no book, no speaking | Andrey cut both |
| No `cmd+k` | ~15 items site-wide; nothing to search, and the most obvious copy tell |
| `investing` after `building` | Adjacent to `work` it reads "investor", against the senior-IC framing |
| Zerion CLI under `work`, not `building` | It is Zerion work, not a side project |
| Telegram bot cut | Andrey's call |
| Next.js + MDX on Vercel | The reference has no real blog; this gets per-post HTML, RSS, OG images |
| Neutral paper only | Tinted backgrounds fight the text |
| Site language is English | Audience is crypto/AI/infra hiring in the US and EU |

Settled during the 2026-07-30 design-system pass:

| Decision | Why |
|---|---|
| `DESIGN.md` is the design source of truth | Tokens in frontmatter, rules in prose, one file. The frontmatter is machine-checkable, so drift gets caught instead of argued about |
| Type scale of three sizes: 34 / 16 / 12 | The spec said four; the demo was rendering five, three of them within a pixel of each other |
| Measure is 68ch, not 680px — later widened to 72ch | Measured: 680px at Newsreader 16px is ~92 characters per line, and it survives the type toggle |
| One left edge, one right edge | Measured: the hero sat 98px right of every section, and hairlines ended 80px past where the prose ended |
| Section labels are `<h2>` | The page had one `<h1>` and no other heading — nothing to navigate by |
| 4px spacing scale, `--s1`…`--s9` | ~21 distinct ad-hoc spacing values were in use, so there was no rhythm to read |
| Focus ring is 2px accent on `:focus-visible` | The default was Chrome's blue, which belongs to no palette here and vanishes on dark paper |
| No per-section scroll fade | One authored moment, and content visible at rest |
| Mono only for data | Monospace used to signal "technical" is a costume; dates are measurement and earn it |
| Photo moves to the right of the hero | It was the thing pushing the hero out of alignment with the rest of the page |

Settled during the review pass that followed:

| Decision | Why |
|---|---|
| A hairline at every section boundary | Without one, a 64px break inside a section read heavier than a 96px break between two. Hierarchy was upside down |
| Break sizes halve: 96 / 64 / 48 | Section, entry, list row. Two different breaks that look the same is worse than either |
| One implementation per type role | Four byte-identical copies of the `strong` role were in the CSS, and one had already drifted a weight |
| One transition declaration for the page | Per-element transitions are how four slightly different durations happen |
| Every anchor states its colour | One `<a>` fell back to the browser's `#0000EE`. It passes contrast, so no automated check caught it |
| Stop using the reference's type scale as a target | Re-measured: it runs on six sizes, four of them clustered within 4px |

Settled on Andrey's review of the rendered page:

| Decision | Why |
|---|---|
| Two faces maximum, never three | Grotesque + mono + mono landed in one `work` row and read muddled |
| No italic anywhere | The position line was the only one; a serif italic is the AI-startup signature |
| The role beside a company name takes the accent | The reference's one genuinely reusable move — it is what makes each row a line |
| No sentence is ever grey | Muted descriptions in `investing` and `writing` read as text someone turned down |
| Greys are neutral, not warm | `#5F5B54` on warm paper is brown enough to read as a colour |
| Contact values drop to weight 500 | 600 on an email address made it a headline |
| Measure 68ch → 72ch | Andrey wanted it wider; 74.6 rendered characters is the top of the range |
