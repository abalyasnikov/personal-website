---
title: How I rebuilt product work around coding agents
description: Company strategy, evidence, product bets, PRDs, delivery and learning in one system that people and agents both read.
status: published
date: 2026-08-03
order: 1
---

A PRD feels finished the moment the Notion page is shared. From then on the document ages quietly while the real decisions live in comments, calls, and someone's memory. That is how most product organizations run, and it is how we ran at Zerion, right up until coding agents made the mismatch intolerable: an agent could reason across an entire codebase, while the reasoning behind the product sat in pages someone had to find and paste by hand.

So I made a small move rather than a grand one. I put our product documents in Git, where the agents already worked. Git turned out to change more than storage: it became a shared product interface for PMs, reviewers, developers, and their agents.

Over time the operating model grew into [Product OS](https://github.com/abalyasnikov/product-os), an open-source reference implementation. It came out of my experience at Zerion; it is not an official Zerion product or methodology.

This is a field report on what held up, what broke, and what I would build next. Examples come from real Zerion Wallet work, with private data, internal links, and personal names removed.

## Git became the review system nobody had to build

I did not want to build another workflow with custom statuses, approval buttons, and a product-management UI to maintain.

I had used enough of those tools to know how they end. The first two months feel great. Then the thing rots, and it rots for a structural reason rather than a design one: the person who gets the value is the PM, and the people who pay the upkeep are everyone else.

Engineers treat it as a second place to update after Linear. Support treats it as a form. Within a quarter you are the only one still opening it, and what is inside is stale enough to be worse than nothing.

Git already had branches, pull requests, comments, approvals, and an immutable merged version. Every one of those had taken years to become boring and reliable, and nobody had to be persuaded to keep them alive.

PMs opened PRs for PRDs. I reviewed them. We argued about the product decision in the PR, and the author updated the document.

That was the whole team: two PMs, and me as head of product. Review moved out of meetings and into threads anyone could reread.

Agents could read the same comments and respond by changing the PRD, so I never had to open a separate AI interface just to translate review feedback into edits.

Merging mattered more than I expected. Once a PRD was merged, everyone, including agents, could point at the same immutable version. Later edits became a new review instead of a silent change to something we had already approved.

Delivery stopped aging the document, too. Developers added the product repository as a submodule in their codebase. We still had calls, and the submodule never replaced that human handoff; it removed a smaller, more persistent one between the developer and their coding agent. Nobody had to paste an old PRD into a prompt or remember that a requirement had moved last week.

Versioning solved drift. It did not solve judgment. Handing an agent the latest PRD is not much help if the agent cannot see why the company should want this work at all.

## Strategy context matters more than the PRD template

A template can make an agent fill in the right sections. It cannot make the decision underneath them any good. What actually did that work was the context sitting around the PRD.

We kept a compact strategy file in the Zerion repository: who the product was for, the goal for the year, where revenue came from, product principles, explicit trade-offs, competitive position, and the current priority bands. For the wallet, the principles were ordered: reliable first, then fast, then power without noise. Trading was the largest revenue line, and product quality was the primary growth lever.

Ordering is what made those principles usable. Unordered principles cannot settle an argument, and settling arguments is the only thing a principle is for. When speed and reliability collided in a review, reliability won, and the PRD had to say so out loud.

That file changed the questions an agent asked. A request stopped being evaluated on its own merits. Does it serve the customer we named? Does it move the goal? Which priority band is it in? Which principle does it strain?

Evidence explains why a problem might be real. Strategy context explains why this team should act on it now. Product OS keeps that as one readable file per workspace. Deliberately one, because a strategy context that grows into a second planning database stops being read, and an unread strategy file is indistinguishable from having none.

## How a company ambition becomes one Product Bet

Zerion had a broad objective: create a best-in-class crypto trading experience.

That sentence is too large to become a PRD. I started collecting the barriers standing between it and reality, and what struck me afterwards was how differently each one had surfaced:

- **Cross-chain Swap** came from the market, not from users. Nobody asked for it. Competitors had made single-intent cross-chain trading the baseline, and our journey still made people coordinate a bridge themselves.
- **Auto-slippage** came from support: transactions that looked ready to execute and then failed onchain. Analytics came later, and at first it argued the opposite.
- **Skip Signing Screen** came from inspecting our own flows and finding a confirmation that repeated information the user had already accepted.
- **Transaction Toasters** came from the same inspection: pending and success screens that blocked the rest of the wallet.
- **Bridge Progress Tracking** came from a dependency. Cross-chain Swap would be irresponsible to ship while long settlements stayed an ambiguous wait.

Five barriers, four different origins, one outcome. That mix is the argument for the structure. A system that only ingests user feedback would have found exactly one of these. A system that only follows strategy would have found a different one. Neither would have found the three that came from looking hard at our own product and our own plan.

A small bet is a single PRD. A broad outcome becomes an Initiative when several independent barriers have to fall together, which is what this was.

Strategy shaped the bet rather than decorating it. Removing a duplicate confirmation served speed, but only conditionally: because reliability outranks speed, the signing screen is skipped only when simulation and security checks come back clean. The unconditional version would have been faster, and it was rejected on the strength of a principle order written down months earlier.

Shipping all five would still not prove the trading experience improved. The Initiative owns that aggregate claim; each PRD owns evidence that its own barrier is gone. The [worked example](https://github.com/abalyasnikov/product-os/tree/main/examples/best-in-class-trading-experience) keeps that chain intact, from the strategy file down to individual requirements, and for one of the five, all the way through to a measured result and the decision that followed it.

Most bets are smaller than this one. The repository carries [a short-path example](https://github.com/abalyasnikov/product-os/tree/main/examples/receipt-follow-up) too: four Signals, one Opportunity, one PRD, and no Initiative at all.

## The metric that said there was no problem

Auto-slippage is the bet I keep coming back to, because almost everything I believe about evidence is in it.

The signal came from users, not a dashboard: support tickets about swaps that were signed, accepted by the wallet, and never settled onchain. The aggregate failure rate said we had no problem. It was the wrong instrument.

Segmentation said otherwise. Cut by asset type, one band was failing at roughly 15% while the average stayed flat: volatile small caps priced against a tolerance that barely moved. Making that tolerance adapt to the asset took the band to about 2%, and the same decomposition surfaced two unrelated failure causes with fixes of their own.

The part that shaped the operating model came from review. Widening the tolerance would have driven the failure rate down on its own, at the cost of worse prices for users. Closing that door took almost nothing:

```diff
- Fewer failed native swaps/bridges
+ Fewer failed native swaps/bridges while maintaining execution quality
```

Four words, plus two guardrail numbers in the same commit that made them enforceable: execution price against quote, and revenue per trade. The failure metric had to fall while both held. The implementation kept changing after that; the Outcome Contract did not. I unpack the full investigation, including two failure modes unrelated to slippage, in [When the aggregate metric says there is no problem](/writing/aggregate-metric-said-no-problem).

## A PRD short enough to be read

Long PRDs failed on our team for an unglamorous reason: people did not read them. Instead of assuming I knew why, I asked them what made them stop and what would have made it worth finishing, then cut the format against the answers. Running discovery on my own documents was the cheapest research I did that year.

A PRD covered the user problem and use cases, the business reason to act now, the evidence, the desired journey, requirements, non-goals, risks, and the outcome we intended to observe. Competitor context appeared when it changed the decision, not as a market-research appendix nobody asked for.

Architecture, algorithms, API contracts, migrations, and rollout mechanics moved into an engineering-owned Implementation Plan living in the code repository. The auto-slippage classification rules, coefficients, and fallback algorithms went with them: all important, none of them the durable product decision. They were engineering hypotheses wearing product clothing. That split kept the PRD readable, and it stopped an implementation detail from quietly redefining the product outcome.

Shortening a document only works if what it drops stays reachable, and that is the objection I would raise with someone showing me this format: cut the PRD down and the engineer gets less context, not more. The answer is that evidence moves rather than disappears. Signals and Patterns stay linked to the PRD, so anyone (or any agent) reading a requirement can follow it back to the support conversation that produced it. The [evidence behind auto-slippage](https://github.com/abalyasnikov/product-os/blob/main/examples/best-in-class-trading-experience/product/signals/slippage-failures-hide-in-the-aggregate.md) sits in the worked example, next to the bet it justified. The document gets shorter. The trail behind it does not get thinner.

Product safety bounds stayed in the PRD, though, and that distinction took me a while to get right. "Auto never exceeds 10%, manual caps at 25%" is a promise to the user. The rule deciding where a specific trade lands inside those bounds is engineering's business.

## The process does not end at handoff

My old workflow had one more structural problem: it ended at the engineering handoff. Product OS follows the decision further.

```text
strategy context ─┐
                  ↓
evidence
  → opportunity
  → product bet
  → PRD + Outcome Contract
  → delivery
  → measurement
  → learning and next decision
```

Git holds the artifacts and the decision trail. Everything else keeps its natural job: transcript providers own full interviews, Linear owns delivery, analytics systems own behavioral data, code repositories own implementation plans. An agent connects them and brings the next decision to a human.

Three judgments stay human. Whether to pursue an opportunity. Whether to approve the bet. What to do once the result is in. An agent can investigate, draft, compare, and recommend; it does not get to make those three calls quietly.

## GitHub is useful, and still a barrier

The operating model worked. Its interface did not work equally well for everyone.

GitHub is a technical tool. PMs already living in coding agents adapted in days. Designers and other collaborators needed help: Loom walkthroughs, live demos, and time in Claude Cowork and Claude Code. The curve got shorter. It never went away.

That is the trade-off: you get a review system nobody has to build and a context store agents can read, and you pay for it with an interface that excludes part of your team by default.

It also convinced me the agent, not GitHub, should be the front door. A PM should be able to ask "what decision needs my attention?" or "interrogate me before I draft this PRD" without learning an artifact graph or hand-editing YAML. That front door exists now: the list of decisions waiting on a human is computed from the repository on request and written nowhere, and a PRD draft starts with the interrogation, not the template.

## Marketing is the next edge

Marketing came into the thinking but never into the system, and that is the most interesting problem this model has not solved yet.

The thinking part worked. Marketing joined discovery early, and go-to-market was a question inside the PRD rather than a launch checklist bolted on at the end. Who discovers this, what promise makes them try it, which adoption action counts: those shaped what we built, and more than once changed it. Deciding distribution while the product is still movable is worth far more than deciding it after the build is frozen.

What never merged was the working surface. Marketing lived in its own Notion and its own boards, so the launch promise existed in two places maintained by two sets of hands. Engineering never had that problem, because engineering already lived in Git and already worked with agents that read it.

That is the real limit of building on the developers' substrate: it serves the people already standing on it. Extending the same decision trail out to marketing is the piece I would build first if I were starting this again: one context, one source of the promise, no manual re-entry.

## A contract you cannot round up

I should be precise about which parts of this are load-bearing.

The system I ran at Zerion was real. It handled live Linear, Notion, Mixpanel, Metabase, and support workflows, and the examples in this article come out of that work.

The Auto-slippage contract is where that precision cost me something. Its primary metric closed convincingly. The guardrails it had been given did not, so the contract's own rule pointed at finishing the evidence rather than scaling, and that is not the verdict I would have written for myself. The contract did its job: it outranked the person who wrote it.

## The shift is bigger than moving Markdown into Git

Better PRD templates were not the answer, and neither was relocating Markdown into a repository. Value came from the chain: company context, evidence, a Product Bet, delivery, and eventually a learning that changes the next decision.

My transferable lesson is narrower than "move every product team to Git." If your team already works with coding agents, product context should not arrive as a one-off prompt. Put strategy, evidence, and decisions where both people and agents can review them. Let Git preserve what you decided. Let the agent carry that decision into delivery and back into learning.

That is what changed for me. The PRD stopped being the end of the product process and became one versioned contract inside a loop that keeps running.

The repository is here: **[github.com/abalyasnikov/product-os](https://github.com/abalyasnikov/product-os)**.
