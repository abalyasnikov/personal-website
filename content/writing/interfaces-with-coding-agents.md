---
title: "Agent-built interfaces drift into slop. Here is how I stop it."
description: "The anchors that keep agent-built interfaces consistent: global principles, a versioned spec, a design system, and review at every stage."
status: published
date: 2026-08-12
order: 2
---

![A robot builder on scaffolding checks a blue blueprint while assembling a browser window](/og/interfaces-with-coding-agents.jpg)

The first version an agent hands back almost always looks fine. Scroll for a minute and it stops looking fine: three grays that are nearly the same, two corner radii on one screen, a button that invented its own padding, a heading set at 15px because nothing said it could not be. Nothing fails the build, and the whole page still reads as slop.

I have stopped trying to fix this with better prompts. A prompt steers one task; an interface drifts across fifty tasks. What works is anchors: a small set of artifacts every task has to pass through, set up once and enforced everywhere. Principles before any work, a spec before code, a design system before screens, review before merge.

I wrote earlier about [running product work through Git and agents](/writing/product-work-around-coding-agents). This is the builder half: the pipeline I use when the thing being shipped is an interface. Each stage below says what I do, which tools carry it, and what the stage buys.

## Principles the agent reads before I say anything

Every session starts from a global agents file, and its core is a distilled version of the [Karpathy guidelines](https://github.com/multica-ai/andrej-karpathy-skills): surface material assumptions and a verifiable end state before writing code, make the smallest complete change, no speculative abstractions, no drive-by refactoring, every changed line has to belong to the request, delete only what the current change made dead, verify with the smallest relevant test.

None of this is about interfaces, which is exactly why it comes first. An agent with these defaults does not redesign the navigation while fixing a spacing bug.

What I get: surgical behavior on every task, paid for once instead of re-prompted fifty times.

## A spec before any code

Anything bigger than a tweak starts as a versioned spec: the context I gathered, the research, the end state, what is in scope and what is explicitly not. The spec then gets reviewed in rounds, three at minimum, by a model that did not write it, and the final pass goes through gstack's plan-eng-review. How that system works, and why every iteration keeps its own implementation history, is a separate article: [Every iteration gets a versioned spec](/writing/every-iteration-gets-a-spec).

What I get: a contract the build can be checked against, instead of a vibe the build slowly walks away from.

## References are links, not screenshots

When I share inspiration, I mostly share links and let the agent open the site itself. A screenshot shows the surface; the live page carries the system underneath it: the real type scale, the spacing rhythm, how hover and focus behave, what the layout does at 375px. Screenshots still happen when only a fragment matters, but the default is sending the agent to the source. For landing pages I collect references on [land-book.com](https://land-book.com).

What I get: shared taste with the agent before any code exists, in a form it can inspect rather than guess at.

## The design phase ends with a system, not with screens

The goal of the design phase is not mockups. It is a design system and a DESIGN.md strong enough to govern everything built after them: tokens for color, type, spacing, radii and motion, plus the rules for using them.

Two tools carry this stage. gstack's design-consultation researches the product and proposes a direction: aesthetic, typography, color, spacing, motion. [Impeccable](https://github.com/pbakaus/impeccable) used to be guardrails against default AI taste; v4 turned it into a full design pass — directions, critique, typography, layout, polish, and a generated DESIGN.md. Known products' systems are worth studying here too — not to copy one, but to feel out your own. [awesome-design-md](https://github.com/VoltAgent/awesome-design-md) collects DESIGN.md files extracted from real products; [styles.refero.design](https://styles.refero.design) serves two thousand of them as a browsable, AI-readable library.

The stage is not done at the document. I have the agent build a demo: the design system rendered as a page, plus one real slice of the product built with it. Reading tokens tells you little; seeing your actual screen set in them tells you whether the direction works. The demo is where I feel that out, and it is cheap to throw away.

What I get: the anchor. From here on, every element on every screen has one source, and "looks close enough" stops being an option.

## Copy is part of the interface

Text gets the same treatment as pixels. Interface copy and longer prose go through [stop-slop](https://github.com/hardikpandya/stop-slop), a skill that strips AI writing patterns: throat-clearing openers, fake contrasts, the rhythm every model falls into.

What I get: copy that sounds like a person decided something, not like a model filled a container.

## Building runs on two tracks

For product interfaces, the agent does not invent components. The base is [shadcn/ui](https://ui.shadcn.com), larger sections come from [shadcnblocks.com](https://www.shadcnblocks.com), and the occasional wow detail comes from [21st.dev](https://21st.dev) or [reactbits.dev](https://reactbits.dev). The design system decides how all of it looks; the libraries decide how it is constructed. [tweakcn](https://tweakcn.com) exists for exactly this: retuning the shadcn theme so the result does not look like every other shadcn site.

Landing pages work the other way around. There is no component library for a good landing; there are references. I pick one, study how it earns its effect, and build my own on top of that understanding.

The stack underneath both is the same: Next.js and Tailwind, deployed on Vercel.

What I get: speed without invention where invention adds nothing, and deliberate wow where it does.

## Review happens in rounds, with fresh eyes

A built interface goes through the same review discipline as the spec did. gstack's design-review walks the UI the way a designer would: visual inconsistency, spacing problems, broken hierarchy, slop patterns, slow interactions. gstack's review reads the diff before anything merges. Findings come back, fixes go in, the next round starts. One pass is never trusted, because fixes introduce their own mistakes.

What I get: problems found while they cost minutes, by reviewers who did not build the thing and have nothing to defend.

## Verification is a browser, not a feeling

The last stage checks that it works rather than agreeing it looks done. gstack's qa drives a real browser through the flows, in tiers from critical paths down to cosmetics, and fixes what it finds. Playwright pins the paths that matter as tests, so the next agent cannot quietly break them.

What I get: regressions caught by machinery instead of by visitors.

## Where it still breaks

The pipeline does not remove the failure mode, it contains it. First versions still drift toward inconsistency; that is the strongest gravity in agent-built UI. The rule doing most of the work against it: a new element may only enter through the design system. If the system does not cover the case, the system gets extended first, in DESIGN.md and tokens, and only then does the screen use it. The agent never invents a style inline because one screen seemed to need it.

Everything above exists to make that rule cheap to follow. The principles keep the agent surgical, the spec pins scope, the references and the system define taste once, reviews catch the drift, and the browser checks what survived.

The toolkit in one place:

- [andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills), base principles in the global agents file
- [dev-history-skills](https://github.com/abalyasnikov/dev-history-skills), my skills for writing and reviewing versioned specs
- [gstack](https://github.com/garrytan/gstack): plan-eng-review, design-consultation, design-review, review, qa
- [Impeccable](https://github.com/pbakaus/impeccable), the full design pass, guardrails included
- [awesome-design-md](https://github.com/VoltAgent/awesome-design-md) and [styles.refero.design](https://styles.refero.design), known products' systems for reference
- [stop-slop](https://github.com/hardikpandya/stop-slop), AI patterns out of copy
- [shadcn/ui](https://ui.shadcn.com), [shadcnblocks.com](https://www.shadcnblocks.com), [21st.dev](https://21st.dev), [reactbits.dev](https://reactbits.dev), component sources
- [tweakcn](https://tweakcn.com), the shadcn theme retuned away from stock
- [land-book.com](https://land-book.com), landing references

The spec system that anchors all of it has its own article: [Every iteration gets a versioned spec](/writing/every-iteration-gets-a-spec).
