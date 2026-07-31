# Accessibility and layout audit, July 2026

Baseline: commit `1218cf7`. Delivered across five commits, `A` through `E`.

## Why

The site had never been measured. A full pass over the rendered pages, in both
themes and at four viewport widths, found three classes of problem: the default
theme failed WCAG AA on every accent colour, the first contact with the site was
broken in three places at once (browser tab, link sharing, mistyped URL), and the
home page and article pages had drifted apart typographically.

Everything below was measured on the running site, not read off the source.

## What the audit found

| Area | Measured | Severity |
|---|---|---|
| Accent `#4f7cff` on the light canvas | 3.52:1, needs 4.5:1 — 12 elements | P1 |
| `--muted` on `--surface` | 4.35:1 | P1 |
| Theme applied in `useEffect` | full white flash for returning dark-theme visitors | P1 |
| `prefers-color-scheme` | ignored; every first visit got the light theme | P1 |
| Site-wide 404 | Next's default page, black on white, no navigation | P1 |
| Metadata | three tags total: `charSet`, `viewport`, `description` | P1 |
| `GET /favicon.ico` | 404 | P1 |
| Article header vs body | left edges 24px apart on desktop and tablet | P2 |
| Rendered type sizes | nine, against five declared in the design system | P2 |
| `public/profile.png` | 800×800, 680 KB, displayed at 112px | P2 |
| `npm run lint` | `next lint` deprecated, no ESLint config, prompted interactively | P3 |
| Dead code | an unimported component, two unused font packages | P3 |

The contrast problem was not fixable with one colour. Passing AA on `#faf9f6`
needs a relative luminance at or below 0.1716; passing on `#202020` needs at
least 0.2400. The windows do not overlap, so the accent ships as one hue with a
per-theme value.

## What changed

**A — mechanics.** Theme resolved by a synchronous inline script before first
paint, falling back to the system preference. Full metadata: `metadataBase`,
canonical, Open Graph, Twitter card, `theme-color`, JSON-LD `Person`. Icons in
all three formats. A site-wide 404 inside the design system. `robots.txt` and
`sitemap.xml` generated from the post list. Portrait re-encoded to WebP, 693,932
bytes to 13,924. ESLint migrated to the flat-config CLI. Dead code removed. A
regression suite added under `scripts/audit/`.

**B — accessibility and layout.** Accent split per theme, `#2b61ff` on light and
`#5b81f1` on dark, same hue. `--muted` darkened on light. The accent picker and
its three hero treatments removed, locking the identity. Hit areas widened
without changing any visual size. The runner grid stacks below 400px. The article
header, body and footer share one left edge. Type collapsed from nine rendered
sizes to six declared steps: 44 / 18 / 16 / 14 / 11 / 10.

**C — content.** A single status line in contact. Live links on the investing
entries.

**D — review fixes.** The portrait source moved out of the served directory, the
now-unused display face unloaded, and the header focus ring unclipped.

**E — rhythm and standards.** Section rules made asymmetric so a rule belongs to
the section it opens rather than splitting the gap evenly. Target-size checking
corrected to WCAG 2.2 AA.

## Results

| | Before | After |
|---|---|---|
| Text nodes failing contrast | 106 | **0 of 1232** |
| Accent on light canvas / surface | 3.52 / 3.41 | **4.69 / 4.53** |
| Accent on dark canvas / surface | 4.74 / 4.39 | **4.90 / 4.54** |
| `--muted` on light surface | 4.35 | **4.89** |
| Theme flash with stored dark | yes | **none**, dark on first paint |
| System dark honoured on first visit | no | **yes** |
| Article left edges at 1440px | 392 / 416 | **392 / 392** |
| Rendered type sizes, home | 7 | **5** |
| Rendered type sizes, article | 8 | **6** |
| Portrait weight | 693,932 B | **13,924 B** |
| Export size | 2.5 MB | **1.6 MB** |
| Horizontal overflow, 4 widths × 2 themes | 0 | **0** |

## Verification

`npm run audit` is the regression suite and exits 0. It enforces, on a running
server, at 320 / 375 / 768 / 1440 and in both themes:

- contrast for every text node, with correct alpha compositing, at rest and at
  the animation's accent peak
- WCAG 2.2 AA target sizing (SC 2.5.8), with rects intersected against every
  clipping ancestor; the 44px AAA aim is reported but does not fail the run
- horizontal overflow
- theme applied before first paint, system preference, manual override,
  persistence across reload
- keyboard focus order and ring visibility
- shared left edges on article pages

`npm run build` exports every post as a static route. `npm run lint` is silent.

## Decisions worth recording

**One accent, two values.** A single hex cannot pass AA on both themes. The
alternative was to weaken one theme; the site keeps one hue and varies lightness,
matching how the terminal accent already worked.

**Colour is not the only affordance.** Row links keep their accent arrow rather
than gaining an underline, because the whole row is the target and an underline
would be noise. Header navigation stays undecorated for the same reason.

**44px is an aim, not the bar.** The suite enforces WCAG 2.2 AA, which is 24×24
or the spacing exception. 44px belongs to WCAG 2.1 AAA. Four controls sit below
44px and clear AA with room; they were left alone rather than reshaped.

## Deliberately not done

- Section numbering and the terminal block: both are design decisions, not
  defects.
- Horizontal scrolling in the header navigation on narrow screens.
- Draft labels in the writing list: an intentional editorial state.
- Column width and the grid model.
- Moving off static export.
