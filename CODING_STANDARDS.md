# Coding standards

Adapted for a statically exported Next.js site. Shorter than a service codebase
needs, because this one has no runtime, no database and no user input.

## Five principles

1. **Read before you write.** Read two or three similar files first. Copy their
   structure, naming and patterns. Do not invent a new abstraction.
2. **No silent failures.** Every error is handled or rethrown; every skip is
   visible. Nothing disappears without a trace. In this project that mostly means
   build-time validation: bad frontmatter must fail `next build`, not render an
   empty page.
3. **No dead code.** Commented-out blocks, unused imports, variables and
   functions get deleted, not parked. Git remembers.
4. **One responsibility, one place.** A check or transform living in three files
   gets extracted. One feature spread across unrelated modules gets collected.
5. **Minimal change surface.** Change only what was asked. Do not refactor the
   neighbouring code, do not improve what works, do not add unrequested features.

## Functions and modules

- Aim for under 40 lines of logic per function. Longer means split it.
- If describing a function needs the word "and", split it.
- More than four parameters: consider an options object.
- Guard clauses at the top, happy path at the normal nesting level.
- Same input, same output. Side effects live at the boundary (file reads, fetch).
- More than three levels of nesting is a refactor signal.

## Errors

- Validate inputs where they enter. Bad data should fail early and loudly.
- Error messages say what was expected, what arrived and where.

```ts
// Bad
throw new Error("invalid frontmatter");
// Good
throw new Error(`${filePath} must define string title and description fields`);
```

- An empty `catch {}` is banned. Handle it or rethrow it.
- When rethrowing, keep the original message as context.

## Types

- No `any`. Use `unknown` plus narrowing, or a concrete type.
- `interface` for data shapes, `type` for unions and utilities.
- No `as SomeType` without a guard first.
- Do not mark a field optional if it is always present. Optional means it can be
  undefined, and that has to be true.

## Design system

- Components never carry raw palette values. Use the semantic tokens: `--canvas`,
  `--ink`, `--muted`, `--rule`, `--accent`.
- A new colour, type size, spacing value, radius or motion rule is a system
  change. Update `styles/tokens.css` and `docs/DESIGN.md` in the same commit.
- No literal `font-size` outside the declared scale.
- Colour is never the only carrier of meaning. Anything clickable has a second
  signal: an underline, an arrow, or a block-level hit area.
- Respect `prefers-reduced-motion`. Keep keyboard focus visible.

## Content

- Posts are plain Markdown. No raw HTML, no JSX, no per-post styling. If a new
  semantic element is genuinely needed, extend the shared renderer and document
  it, rather than escaping the system in one file.
- Never invent, infer or round a fact, metric, date or title. Every number traces
  to something confirmed.

## Regression suite

This project has no unit tests. `npm run audit` is the equivalent and it is not
optional.

- Changed layout, colour or type → run it before committing.
- It enforces contrast in both themes, WCAG 2.2 AA target sizing, horizontal
  overflow at four widths, theme application before first paint, and keyboard
  focus order.
- A new invariant worth protecting goes into `scripts/audit/`, not into a comment.
- Exit code 0 means shippable. Do not commit a red suite.

## Self review before committing

**Dead code**
- [ ] No commented-out blocks
- [ ] No unused imports, variables or functions
- [ ] No TODO or FIXME without a linked task
- [ ] No leftover debug `console.log`

**Logic**
- [ ] No duplicated logic
- [ ] No responsibility smeared across unrelated files
- [ ] No abstraction used in exactly one place
- [ ] No magic numbers or strings; named constants instead
- [ ] No nesting deeper than three levels

**Shipping**
- [ ] No credentials, keys or secrets
- [ ] Nothing added to `public/` that should not be served
- [ ] `npm run build`, `npm run lint` and `npm run audit` all pass

## Naming

- Variables and functions describe **what**, not **how**.
- Booleans take `is`, `has` or `should`.
- Constants are `UPPER_SNAKE_CASE`.
- No abbreviations beyond the widely understood ones.

## Language and comments

- Code, comments and documentation in this repository are in English.
- Do not comment the obvious.
- Comment **why**: the rule behind a decision, the constraint that is not visible
  from the code.

## Never do

| Do not | Do instead |
|---|---|
| Comment out code for later | Delete it, git remembers |
| Empty `catch {}` | Handle or rethrow with context |
| Copy-paste logic between files | Extract a shared function |
| Add parameters for the future | Add them when needed |
| Leave debug logging | Remove it |
| Mix responsibilities in one function | Split it |
| Hardcode config in logic | Use constants or tokens |
| Use `any` | Use `unknown` and narrow |
| Return `null` silently on failure | Throw with context, or log the skip |
| Abstract for a single use | Three lines of duplication beat a premature abstraction |
| Refactor neighbouring code along the way | Change only what was asked |
| Put a raw colour in a component | Use the semantic token |
| Ship a red `npm run audit` | Fix it or explain it in the commit |
