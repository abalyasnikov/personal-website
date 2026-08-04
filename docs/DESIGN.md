---
name: balyasnikov.com-design-system
description: The tokenized visual system for balyasnikov.com.
colors:
  accent-light: "#2B61FF"
  accent-dark: "#5B81F1"
  canvas-dark: "#191919"
  surface-dark: "#202020"
  ink-dark: "#E9E7E2"
  muted-dark: "#929292"
  rule-dark: "#383838"
  canvas-light: "#FAF9F6"
  surface-light: "#F7F5F1"
  ink-light: "#171717"
  muted-light: "#6B6B6B"
  rule-light: "#E7E2DA"
  terminal-green-light: "#4F7629"
  terminal-green-dark: "#95C85A"
  runner-blue-light: "#2B61FF"
  runner-blue-dark: "#5B81F1"
typography:
  sans: "Inter Variable"
  mono: "JetBrains Mono Variable"
  title: "clamp(36px, 6vw, 44px) / 1.08"
  title-compact: "30px / 1.12"
  lede: "18px / 1.6"
  body: "16px / 1.65"
  content: "14px / 1.625"
  small: "11px / 1.65"
  tiny: "10px / 1.65"
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
layout:
  content: "656px"
  gutter: "clamp(20px, 5vw, 32px)"
  hit-target: "44px"
rounded:
  control: "4px"
  small-surface: "4px"
  terminal: "8px"
  round: "999px"
motion:
  fast: "150ms"
  easing: "cubic-bezier(0.2, 0.8, 0.2, 1)"
---

# Design system

## Intent

The site is one narrow centred column: a circular portrait, monospace navigation, a terminal fragment, numbered sections and quiet rules. Navigation sits in a compact sticky header so section access stays available while scrolling.

The system is deliberately small. One column, two faces, six type steps, one accent. Hierarchy comes from spacing and weight rather than from new surfaces, and every addition has to earn a token.

## Rules

1. One centered column, `656px` wide. All major content shares its edges.
2. Inter carries headings and prose. JetBrains Mono is restricted to navigation, terminal, metadata, and controls. Those are the only two faces the site loads.
3. Hierarchy comes from spacing, weight, section rules, and numbering—not extra card surfaces.
4. Every interactive hover and focus state uses `--accent`. Focus must remain visible.
5. Investing uses the same stacked row primitive as building. No one-off grid or spacing model.
6. Motion is functional and restrained. The terminal status indicator and slow eval scan are the only ambient loops; both are disabled by `prefers-reduced-motion`.
7. Placeholders stay visibly muted; copy is never silently invented to fill them.
8. The header contains only unnumbered horizontal section navigation and the theme control. It is sticky, single-line, and horizontally scrollable on narrow screens.
9. Rules separate structural regions only: sticky header, major sections, terminal chrome, and footer. Repeated content rows rely on spacing instead of dividers.
10. Section navigation and card-shaped rows carry no underline. Their click affordance is the block target itself, plus the accent arrow on writing rows. Underlines stay on links that sit inside running text, where nothing else marks them.
11. Standalone controls carry a 44px pointer target in a pseudo-element, so the target grows without moving or resizing anything on screen. Where neighbouring controls sit closer than 44px apart, their zones split the gap instead of overlapping; the binding requirement is SC 2.5.8 at 24px, which spacing satisfies.
12. A section rule belongs to the section it opens. Space above it is larger than space below it, and the two values are the same for every rule on the page.

## Color and themes

The theme follows the operating system on a first visit and is resolved by an inline script in `<head>` before the first frame. A manual choice overrides it and persists in `localStorage`. Dark is a composed alternate, not a CSS inversion. `--canvas`, `--surface`, `--ink`, `--muted`, and `--rule` are semantic roles. Components never use raw palette values.

Signal blue is the identity accent and is no longer user-selectable. It carries two values because no single tone at 225° clears 4.5:1 on both `#FAF9F6` and `#202020`: `#2B61FF` in light, `#5B81F1` in dark. `--runner-blue` stays a separate token with the same pair, so the execution state can diverge from the identity accent again without touching components.

Text links inherit the color of their surrounding hierarchy at rest, move to `--accent` on hover, and use the accent focus ring for keyboard navigation. Email and résumé download follow the same interaction rule as the social links instead of appearing permanently active. Footer navigation remains muted at rest because it belongs to footer furniture. Persistent accent is reserved for semantic signals: work roles, building metadata, error status, writing navigation, and the runner sequence.

The eval runner uses fixed signal blue for execution state. Only the left-hand step label animates across a 28-second cycle: one second fading in, two seconds held, and one second fading out before the next step begins. The sequence is `frame → inspect → define → build → measure → learn → decide`. Descriptions and row backgrounds remain static. This stays independent from the identity accent.

## Type scale

Six steps, each one distinguishable: **44 / 18 / 16 / 14 / 11 / 10**. Every one is a token in `styles/tokens.css`; `app/globals.css` sets no literal font size.

| Token | Size | Used by |
|---|---|---|
| `--text-title` | clamp 36–44px | hero name, writing index, post title, error title |
| `--text-lede` | 18px | post dek, article section heading, article blockquote |
| `--text-body` | 16px | article prose, hero identity line |
| `--text-content` | 14px | section copy, terminal, contact links, code blocks |
| `--text-small` | 11px | navigation, publication dates, metadata, footer |
| `--text-tiny` | 10px | section numbers, terminal chrome |

The title is a clamp, not a step, so it scales with the viewport. `--text-title-compact` (30px) is part of the same axis: page titles step down to it below 672px, which keeps the hero name on one line.

Site body is 16px and compact section copy is 14px. The home page is compact copy; article pages use site body. That is the only place two content sizes coexist, and it is intentional.

A section heading sits one step above the copy it governs. On the home page that
is 14px mono over 14px rows, where the heading reads as a peer label. In an
article, prose is 16px, so the heading takes 18px: at 14px it was smaller than
the paragraphs beneath it and read as their caption. The two surfaces are allowed
to differ here because the article has a different job.

Spacing inside a text pill is the one place that leaves the 4px scale: inline code pads in `em` so it tracks the type it sits in.

Line height follows the role, not the size: 1.8 for prose, 1.65 for compact copy
and code, 1.45 for labels and metadata.

## Layout rhythm

The 4px scale is strict. Normal gaps use 12–24px.

Section separation is deliberately asymmetric: **72px above a rule, 40px below it** on desktop, **56/32** below 672px. The rule belongs to the section it opens, not to the gap between two sections, so it sits closer to the heading that follows than to the block it closes. `--rule-space-above` and `--rule-space-below` carry both values, and every rule on the page obeys them — including the two that are not numbered-section boundaries, the hero's edge with section 01 and the footer's top border.

Markdown block elements have their UA margins reset, so the flow rule is the only thing setting vertical space inside an article. A leftover browser margin-bottom on a code block is invisible while margins collapse and wrong the moment they do not.

Article bodies run on one flow rule: every block separates from its predecessor
by 24px, and only the elements that need more air widen it — 64px above a section
heading, 32px above a code block, table or image, 64px on both sides of a rule.
Spacing is never attached to a specific pair of tags. The earlier rule keyed on
two adjacent paragraphs, so a paragraph following a list or a code block
inherited nothing and butted straight against it.

A writing row states its own sizes rather than inheriting them, because it appears on two surfaces with different body sizes and has to read the same on both. Rank inside the row comes from weight and ink.

Rows share one structure: title/meta first, description second, and spacing between entries. They do not draw their own rules. Below 672px they stack into one column.

Work headers keep company and role together on the left, with the employment period in muted mono on the right. The header remains a single line at supported widths.

Contact keeps the primary email first, the résumé download directly below it, and social profiles as the final low-emphasis row.

Writing entries are internal routes, marked with a right arrow rather than an external-link arrow. Publication dates appear in muted mono; technical publication status is not rendered. When `showWritingOnHome` is enabled in `config/features.json`, the home page previews three posts and ends with `read all →`; `/writing` always lists the complete archive. Articles return to that archive with `← all writings`. The archive returns to the home Writing section when it is visible, otherwise to the home page. Post pages reuse the sticky chrome, keep article prose at a `608px` reading measure inside the `656px` shell, and provide 44px targets for writing navigation and the page top.

Writing source files live in `content/writing/*.md`. The filename defines the route slug; frontmatter supplies title, description, status, and optional publication date. Article bodies start at `##`: level-two headings become numbered sections, blockquotes become accent takeaways, and all other Markdown elements inherit the shared article renderer. Raw HTML and per-post presentation are intentionally unavailable so content cannot bypass the design system.

## Responsive and accessibility

- Minimum supported viewport: 320px; no horizontal overflow.
- Every target meets WCAG 2.2 SC 2.5.8 (AA): 24×24, or the spacing exception. That is what `npm run audit` enforces.
- Standalone controls also aim for a 44px target, delivered by a pseudo-element so nothing shifts visually. Header navigation items and the email/résumé pair fall short of 44px because their neighbours sit closer than that; both still clear AA on spacing. 44px is SC 2.5.5, Level AAA, so this is reported and not treated as a failure.
- Below 400px the eval runner stacks its key over its value, because no key column leaves all seven descriptions on one line.
- Every rendered text node clears WCAG AA in both themes: 4.5:1 normal, 3:1 large. `npm run audit` measures this with real alpha compositing.
- Color is never the sole focus indicator.
- Portrait alt text identifies the subject.
- Reduced-motion preferences stop the terminal status and eval-scan loops, then collapse transitions.

## Change protocol

Change a token in `styles/tokens.css` and this file together. A new raw color, type size, spacing value, or radius is a system change and must be documented here before it ships.

## Decision log

| Date | Decision | Reason |
|---|---|---|
| 2026-08-04 | The article title block sits closer to its body than two sections sit to each other | At section spacing the cover read as detached from the article it introduces; the asymmetry stays, the total drops from 129px to 81px |
| 2026-08-04 | The article section number scales with its heading | Raising the heading to 18px had left the number at 0.56 of it, against the 0.71 it held before |
| 2026-08-04 | The writing row pins its own type instead of inheriting the surface | The archive renders prose at 16px, so an inherited description outweighed the 14px title of the post it described |
| 2026-08-04 | Article section headings take 18px, one step above article prose | At 14px the heading was smaller than the paragraphs it governed and read as their caption |
| 2026-08-04 | Writing index title moves to the sans face | It was the only large monospace heading on the site, while the other two page titles were sans |
| 2026-08-04 | Article spacing runs on one flow rule instead of per-pair margins | Keying on two adjacent paragraphs left lists and code blocks with no gap beneath them |
| 2026-07-30 | Rebuild on one narrow column with numbered sections | The earlier editorial direction spread attention across surfaces that carried no information |
| 2026-07-30 | Keep accent color and treatment as live axes | These are the two identity decisions still worth testing |
| 2026-07-30 | Preserve the previous demo separately | Baseline work must not destroy the earlier exploration |
| 2026-07-30 | Move section navigation into a sticky horizontal header | Keep orientation available without a large standalone navigation block |
| 2026-07-30 | Restrict rules to structural boundaries | Repeated row dividers added noise and competed with section hierarchy |
| 2026-07-30 | Use 600 weight for inline metrics | Keep numbers prominent without making them wider and darker than surrounding copy |
| 2026-07-30 | Turn the terminal into a product eval runner | Show the operating loop behind the work instead of restating career claims |
| 2026-07-30 | Animate the eval loop with fixed signal blue | Separate execution state from the user-selectable identity accent |
| 2026-07-30 | Make signal blue the default identity accent | Start from the strongest current accent while preserving the runtime palette |
| 2026-07-31 | Increase the content column to 656px | Give dense work copy and the eval runner more room without losing readable line lengths |
| 2026-07-31 | Add first-class writing routes | Make Writing navigable while keeping article reading inside the established system |
| 2026-07-31 | Keep post authoring in plain Markdown | Let content stay portable while the shared renderer prevents per-post design drift |
| 2026-07-31 | Unify text-link interaction states | Keep hierarchy neutral at rest and use the accent consistently for hover and focus |
| 2026-07-31 | Treat drafts as public previews | Make status editorially visible without implying access control that the static export does not provide |
| 2026-07-31 | Lock the identity accent to signal blue and delete the picker | The identity decision is made; a live picker on a job-search page is cost without benefit |
| 2026-07-31 | Split the accent by theme: `#2B61FF` light, `#5B81F1` dark | No single tone at 225° clears 4.5:1 on both `#FAF9F6` and `#202020`; the terminal green already set this precedent |
| 2026-07-31 | Move light `--muted` from `#737373` to `#6B6B6B` | `#737373` measured 4.35:1 on `--surface`, below AA for the terminal chrome and runner keys |
| 2026-07-31 | Drop the Caveat hero treatment and unload the face | The italic word was an exploration axis, not a decision; the role phrase reads as an accent on its own, and nothing else used Caveat |
| 2026-07-31 | Declare a six-step scale and delete 17/13/12px | Four sizes lived between 10 and 13px; a 1px difference is not a hierarchy, it is accumulation |
| 2026-07-31 | Give standalone controls a 44px pseudo-element target | The pointer target grows without moving a single visible pixel |
| 2026-07-31 | Keep navigation and writing rows underline-free | The block target and the accent arrow already mark them; underlines would add noise to a mono row |
| 2026-07-31 | Remove the article `margin: 0 auto` | Centering the 608px measure inside the 656px shell broke rule 1 by 24px |
| 2026-07-31 | Stop dimming the writing arrow | It is the only non-colour signal that the row is a link |
| 2026-07-31 | Resolve the theme in an inline head script | The stored theme was applied after hydration, so a dark visitor got a light first frame |
| 2026-07-31 | Make section separation asymmetric, 72 above a rule and 40 below | A rule centred in its own whitespace divides two sections equally and belongs to neither; moving it toward the heading it introduces makes it read as that section's opening |
| 2026-07-31 | Apply the same pair to the hero edge and the footer border | They are rules too. Leaving them on the old symmetric spacing would have made two of the seven boundaries read differently |
| 2026-07-31 | Enforce SC 2.5.8 (24px, AA) and report 44px as AAA | 44px is Level AAA and the Apple guideline, not the standard the site is held to; the audit was failing builds over an enhancement |
| 2026-07-31 | Keep post status technical and hidden | Publication workflow metadata does not help a visitor scan or read the writing |
| 2026-07-31 | Add a dated writing index and explicit return paths | Keep the home page compact while making the complete archive and article navigation predictable |
