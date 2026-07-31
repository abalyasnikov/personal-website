---
name: balyasnikov.com
description: Personal site for a senior IC product person. Quiet, editorial, read in thirty seconds.
colors:
  # Neutrals — three papers are still live in the demo picker. All three
  # are declared so the detector accepts whichever wins. See "Open axes".
  paper-warm: "#FAF9F6"
  ink-warm: "#171717"
  muted-warm: "#666666"
  rule-warm: "#E4DFD6"
  paper-cool: "#FBFBFD"
  ink-cool: "#14161A"
  muted-cool: "#5F6570"
  rule-cool: "#E4E6EB"
  paper-plain: "#FFFFFF"
  ink-plain: "#111111"
  muted-plain: "#5C5C5C"
  rule-plain: "#E5E7EB"
  # Dark counterparts, composed rather than inverted.
  paper-warm-dark: "#191817"
  ink-warm-dark: "#E8E4DE"
  muted-warm-dark: "#969696"
  rule-warm-dark: "#2E2B27"
  paper-cool-dark: "#0E1013"
  ink-cool-dark: "#E6E8EC"
  muted-cool-dark: "#99A0AB"
  rule-cool-dark: "#23262C"
  paper-plain-dark: "#0A0A0A"
  ink-plain-dark: "#EDEDED"
  muted-plain-dark: "#949494"
  rule-plain-dark: "#222222"
  # Accent shortlist. Exactly one ships.
  accent-ink-navy: "#12306E"
  accent-royal-blue: "#3447AA"
  accent-pine: "#14532D"
  accent-blue-whale: "#03363D"
  accent-signal-blue: "#0057FF"
  accent-ultramarine: "#4B3FD6"
typography:
  display:
    fontFamily: "Archivo, sans-serif"
    fontSize: "clamp(30px, 1.6rem + 1.1vw, 36px)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  strong:
    fontFamily: "Archivo, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "-0.012em"
  value:
    fontFamily: "Archivo, sans-serif"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  ui:
    fontFamily: "Archivo, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.45
    letterSpacing: "normal"
  label:
    fontFamily: "Archivo, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.12em"
  data:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "normal"
rounded:
  control: "3px"
  avatar: "50%"
spacing:
  s1: "4px"
  s2: "8px"
  s3: "12px"
  s4: "16px"
  s5: "24px"
  s6: "32px"
  s7: "48px"
  s8: "64px"
  s9: "96px"
---

# Design system — balyasnikov.com

The page has one job: a senior person at a crypto/AI/infra company lands from a
link, scrolls once, and decides to reply. Everything below serves reading speed.

`SPEC.md` owns content and scope. This file owns the visual system. Where a
design value appears in both, this file is the one that is current — it carries
measured values, `SPEC.md` carries the reasoning that produced them.

---

## 1. The rules that generate the rest

Four about what lands on the page, one about how it survives being written down.

**One left edge.** Every line of the page starts at the same x. No section, no
heading, no hero element is indented relative to another. One metadata rail is
allowed inside the column — `--rail`, 128px — and `investing` and `contact` both
use it. Two lists, one rail, one token. They were 148px and 96px for no reason
either could name.

**One measure.** The content column is `72ch` of the prose face. Every ruled
line, every right-aligned date and every paragraph ends at that same right edge.
Because the unit is `ch`, the column re-measures itself when the type axis
changes: measured at 74.5–74.6 actual characters across all three shipping
pairings, the top of the comfortable range. 76ch would match the reference's
line and overshoot it.

**Three sizes.** 34 / 16 / 12. Nothing else. Hierarchy comes from weight,
colour, case and family. Adding a fourth size is a change to the system, not a
tweak — and the reason is concrete: the previous build shipped 10.5px, 11px and
11.5px side by side doing three different jobs, and no reader can tell a 0.5px
difference apart.

**Two faces, and no italic.** One face carries everything structural, the other
carries one job and only that. Three families is what made the first version
read muddled rather than considered: a single row under `work` ran grotesque for
"Zerion", mono for "Head of Product", then mono again for the date. Italic is
gone outright — the position line was the only one, and a serif italic is the
most recognisable AI-startup signature there is.

And one rule about how the above survives contact with a stylesheet:

**One implementation per role.** The five roles in section 2 appear exactly once
each in the CSS, as one grouped selector. The first version of this system was
correct on paper and wrong in the file: `.entry-name`, `.inv-name`,
`.post-title` and `.contact-val` were four byte-identical copies of the same
five declarations, and `.contact-val` had already drifted a weight. Four copies
is not a system, it is four places to forget. If a new element needs the
`strong` role, it joins that selector list — it does not get its own block.

---

## 2. Type

Five roles. `display`, `strong`, `value` and `ui` all sit in the structural
face; `body` and `data` are the two that can move.

| Role | Face | Size | Weight | Where |
|---|---|---|---|---|
| `display` | structural | 34 (fluid 30–36) | 600 | Hero name. Once per page |
| `strong` | structural | 16 | 600 | Names you scan down a column: companies, projects, post titles |
| `value` | structural | 16 | 500 | Read, not scanned: the position line, contact values |
| `body` | prose face | 16 | 400 | All prose |
| `ui` · `label` | structural | 12 | 500 · 600 + `0.12em` uppercase | Nav, buttons, contact keys · section labels |
| `data` | metadata face | 12 | 400, tabular figures | Date ranges |

**`strong` and `value` differ only in weight, and that is a real distinction.**
A company name is scanned down a column; an email address is read once. 600 on
`andrew.balyasnikov@gmail.com` turned it into a headline, which is why the
contact block looked wrong.

**The metadata face carries dates and nothing else.** A monospace face used to
make a page feel technical is a costume; date ranges are measurement, so they
earn it. A job title is not measurement — the role beside a company name sits in
the structural face and takes the accent instead. Navigation, buttons, contact
keys and section labels are not measurement either.

*This narrows the type table in `SPEC.md`, which puts all labels and metadata in
IBM Plex Mono. Called out here rather than made silently.*

**Body is 16px and the measure is 72ch.** The original spec called for 680px; at
Newsreader 16px that renders around 92 characters per line, well past the point
where the eye starts losing its place tracking back. 72ch is the corrected
number — 653px, rendering 74.6 characters, and it holds within a tenth of a
character across all three shipping pairings because expressing it in `ch` makes
the column re-measure itself when the face changes. `SPEC.md` carries the same
number.

**Long-headline rule.** The display size is reserved for the name. No sentence
is ever set at 34px.

**No italic.** Not in the hero, not in prose, not anywhere. It was on the
position line and it is now the accent instead, which does the same job — mark
this as the title — with the same treatment the role gets beside a company name
lower down. One device, used twice, instead of two devices used once each.

---

## 3. Colour

Neutral paper, one accent, nothing else. No tinted surfaces, no second accent,
no semantic colour — the page has no states to communicate.

**The accent is for links only.** It never becomes a background, a border, a
button fill or a number. Its whole job is to mark the six or seven things on
this page that are clickable and are not obviously clickable already.

**Three text colours, and each one means something.**

| Colour | Means | Where |
|---|---|---|
| `--ink` | this is the content | all prose, all names, titles, contact values |
| `--muted` | this is furniture | section labels, dates, contact keys, nav |
| `--accent` | this is a link, a title, or a blocker | links, the position line, the role beside a company name, `[needs …]` |

**No sentence is ever grey.** Descriptions under `investing` and `writing` used
to be muted on the theory that they support the name beside them. On the page it
just read as text someone had turned down. Grey is for furniture — labels, keys,
dates — and prose is always ink.

**The greys are neutral.** `#5F5B54` on warm paper is brown enough to read as a
colour rather than as a tone, which is what made the muted text look muddy.
Neutral grey on warm paper is also what the reference does.

**The accent marks the role beside a company name.** This is the one device
lifted from the reference, and it is the thing that makes each `work` row read
as a line rather than a paragraph with a bold word above it. The colour is ours,
not its vermilion.

**Every anchor states its colour.** An `<a>` with no colour falls back to the
browser's `#0000EE`, which passes contrast and therefore slips past every
automated check. It was on the page for one commit.

**Every accent must clear 4.5:1 against the paper it sits on.** The demo walks
any candidate toward black (light paper) or white (dark paper) until it passes
and reports that it did so. A candidate that has to move a long way is telling
you it is a fill colour, not a text colour.

**Dark is composed, not inverted.** The dark papers are not the light values
flipped: they are lifted off pure black so the serif does not vibrate, and
light-on-dark text carries a touch more line height and tracking, because the
same face reads heavier when it is light on dark.

### Named rules

**No violet.** A violet or purple accent is the most-cited signature of
generated interfaces, and the demo's own contrast fitter makes it worse in dark
mode by lightening it toward lavender. `#4B3FD6` stays in the picker for
comparison; it is not the recommendation.

**No warm-paper-plus-warm-accent.** Warm paper is fine on its own and Andrey
leans that way. Warm paper *plus* an orange-red accent reproduces the reference
outright and is simultaneously the most common generated palette in circulation.
The demo keeps `#FF4D2E` visible for calibration, labelled do-not-ship.

**The warm paper is two points off the line.** `#FAF9F6` has an r−b warmth of 4.
Cream and beige page backgrounds are the reflex "tasteful" AI surface, and the
usual threshold for calling one starts at 6. This paper is not cream — it is
narrowly not cream. Worth knowing before choosing it.

---

## 4. Space

A 4px base. Ten steps, `--s1` through `--s9`. No value off the scale ships.

| Interval | Step | Measured |
|---|---|---|
| Section · hairline · section label | `--s7` 48 either side | 97px |
| Section label → first entry | `--s6` 32 | 32px |
| Entry · hairline · entry | `--s6` 32 either side | 65px |
| Investing row · hairline · row | `--s5` 24 either side | 49px |
| Entry head → its prose | `--s3` 12 | 12px |
| Rail gutter | `--s5` 24 | 24px |

The measured column is one pixel over in each case because the hairline is in
the gap. That is the whole discrepancy; if a number here ever drifts further
than that, something has stopped using the scale.

**More space above a heading than below it.** A section label binds to the
content it introduces. 48 above, 32 below. When those numbers invert, every
section starts reading as a caption for the previous one.

**One break size per level, and they halve.** 96 between sections, 64 between
entries, 48 between list rows. A reader does not measure pixels, but they do
notice when two different breaks look the same — and they notice more when the
smaller one looks bigger.

**Rhythm, not repetition.** Tight inside a group, generous between groups. One
spacing value repeated everywhere gives every element the same weight, which is
the same as having no hierarchy at all.

---

## 5. Surface and shape

Flat. There are no cards on this page and none should appear — a card is the
container you reach for when proximity and type were not doing enough work, and
here they are.

- Hairline rules, 1px, `--rule`. Two kinds, and nothing decorative is ever a
  line:
  - **Separators**, drawn as `border-top` on the second of two siblings — a
    section boundary (5), an entry or post boundary (5), an investing row (4),
    the footer (1).
  - **Edges**, drawn all the way round an element — the theme button, the CV
    button, the avatar. Three, and all three are things you can point at.
- **The section hairline is what makes the page a page.** Without it, the entry
  hairlines were the strongest horizontal marks on the screen and a 64px break
  *inside* a section read heavier than a 96px break *between* two — the
  hierarchy was upside down and the fix is one line, not more space.
- Radius `3px` on the two controls (theme button, CV button). The avatar is the
  only circle.
- No shadows, no gradients, no glass, no glow, no side stripes, no borders wider
  than 1px anywhere.
- Both a hairline border *and* a soft shadow on the same element is the ghost
  card. Declare elevation once — here it is always the border.

---

## 6. Motion

**One authored moment.** The hero settles on load: name, position, status and
paragraph arrive in sequence over roughly half a second, on an exponential
ease-out, from an already-visible default.

That is the whole motion budget. In particular there is **no per-section fade on
scroll**, which `SPEC.md` originally called for. Two reasons: an identical
entrance on every section is not one authored moment, it is the same effect
seven times; and gating content on a scroll handler means a failed handler ships
a blank page. Content is visible at rest and JavaScript only enhances how it
arrives.

- Easing: `cubic-bezier(0.16, 1, 0.3, 1)`. No bounce, no elastic.
- The load animation moves `opacity` and `transform` only.
- **Hover is a colour change, and there is one transition declaration for the
  whole page**: `a, .themebtn { transition: color, border-color }`. Per-element
  transitions are how a page ends up with four slightly different durations.
  Never a lift, a scale or a shadow.
- `prefers-reduced-motion: reduce` removes all of it, and the page is complete
  without it — verified by measuring hero opacity at 1 with the media feature
  emulated.

---

## 7. Focus and keyboard

Every interactive element takes a 2px `--accent` ring at 2px offset on
`:focus-visible`, radius matching the element. The browser default ring is a
blue that belongs to Chrome, not to this palette, and it nearly disappears on
dark paper.

Section labels are real `<h2>` elements. The previous build had a single `<h1>`
and no other heading on the page, which leaves a screen reader with no way to
move through it.

---

## 8. Open axes

Four choices are still live in `demo/index.html` and are Andrey's to make. The
picker is a decision tool and does not ship. When a direction is locked, write
the values into the frontmatter above, delete the picker, and record the choice
in the `SPEC.md` decisions log.

| Axis | Options | Note |
|---|---|---|
| Paper | warm · cool · plain white | Warm is the reference's own, and narrowly not cream |
| Accent | six shortlisted, plus calibration swatches | Violet and vermilion both carry a cost, both labelled |
| Type | grotesque + serif · grotesque + mono · serif-led · reference's | Four pairings, every one of them exactly two faces with no italic. `grotesque + serif` is the default; `reference's` (Inter / JetBrains) is calibration — Inter is on every overused-font list there is, and picking it moves the site markedly closer to the reference |
| Figures | plain · accent colour · colour + bigger | `plain` is the default and, on the evidence so far, the right answer |

---

## 9. Do not

Beyond the reference-specific list in `SPEC.md` — no `01 / 02 / 03` numbering,
no terminal block, no handwriting word, no `cmd+k`, not its vermilion:

- **Do not** add a fourth type size. Reach for weight, colour, case or family.
- **Do not** add a third face. Two, and one of them does one job.
- **Do not** use italic. There is no italic on this page and no role wants one.
- **Do not** set a sentence in grey. Grey is furniture: labels, keys, dates.
- **Do not** put a small tracked uppercase label directly above a heading. The
  section label *is* the heading here; a second one above it is an eyebrow.
- **Do not** introduce cards, stat tiles, icon tiles or a big-number-small-label
  grid. Numbers live inline in the sentence that earns them.
- **Do not** use monospace for anything that is not data.
- **Do not** animate an image, or animate on hover at all.
- **Do not** add a colour outside the shortlist without adding it here first.
- **Do not** let a rule, a date or a paragraph end at a different x than the
  others. One right edge.
