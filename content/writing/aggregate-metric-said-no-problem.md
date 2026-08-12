---
title: When the aggregate metric says there is no problem
description: How segmentation found a 15% failure rate inside a metric that looked like noise, and what kept the fix honest.
status: published
date: 2026-08-07
order: 4
---

The dashboard said we did not have a problem. Users kept writing in to say we did. Both were looking at the same product, and it took me longer than I would like to admit to accept that the dashboard was the one that was wrong.

This is the story of that disagreement: a swap failure rate that looked like statistical noise, a segment failing at 15% underneath it, and a four-word edit in review that ended up mattering more than the fix itself. The case comes from real Zerion Wallet work, with private data, internal links, and personal names removed.

## The signal came from support, not the dashboard

Zerion Wallet users started reporting a specific kind of failure. They signed a swap, the wallet accepted the transaction, and it never landed onchain. No error they could act on, just money not moving.

Support consolidated the repeated reports, and when we needed the raw signal we pulled the original conversations. The pattern was consistent enough to take seriously.

Then I checked the aggregate failure rate for native swaps, and it looked like nothing. Statistically indistinguishable from background noise.

This is the moment the whole case turns on. Both facts were true at once: users were reliably failing, and the headline metric said everything was fine. If I had treated the dashboard as the arbiter and the tickets as anecdotes, the investigation would have ended here, with a defensible, data-backed, completely wrong conclusion.

## Segmentation is where the problem appeared

Instead of stopping, I decomposed. The funnel by stage. Failures by cause. Then by network. Then by the kind of asset being traded.

The last cut is where it surfaced. Small cap assets were failing at roughly 15%, against an average that looked like noise. The reason was not subtle once it was visible: small caps are far more volatile than the majors, and we applied one largely static slippage tolerance to everything. A tolerance that was fine for ETH was hopeless for a memecoin moving 10% a minute.

The fix followed directly from the diagnosis: a tolerance adapted to asset characteristics, liquidity, and volatility instead of one global default. Failure rate in that segment went from about 15% to about 2%.

The same decomposition surfaced two more failure categories that had nothing to do with slippage. One was technical errors in the transaction builder. The other was users who held the stablecoin they wanted to trade but no native token for gas, which we addressed with gas sponsorship for eligible cases.

Three segments, three unrelated causes, three different interventions. And a single headline metric that showed none of them, and would have argued against all three.

## Why the aggregate hid the problem

The mechanism is worth naming, because I have since seen it reproduce far beyond slippage.

An aggregate metric is a weighted average across heterogeneous segments. The weights come from volume, and volume concentrates in the mainstream case: major assets, popular networks, happy paths. A segment can be small in volume and still account for a large share of unhappy users.

In our case the majors dominated swap volume and almost never failed. Small caps were a thin slice of volume with a catastrophic failure rate. Multiply 15% by a small weight and the average barely moves. The metric was not lying about the average. The average was just the wrong question.

There is a second effect on top: the mix of segments shifts over time. A memecoin season changes the asset mix, a new chain integration changes the network mix, and the aggregate moves for reasons that have nothing to do with product quality. The same number can improve while a real segment gets worse.

The rule I took away: an aggregate that looks fine is not evidence that things are fine. Often it is just evidence that nobody has cut the data yet.

Qualitative signal and quantitative data had different jobs in this sequence. Support conversations told me where to look. Segmentation told me who was actually affected and how badly. Only after both was there anything worth designing. Either one alone would have failed: the tickets without data would have stayed anecdotes, and the data without the tickets would never have been cut along the right axis.

## The second trap: a metric we could have gamed

The diagnosis was done and the fix was designed. Then review caught something that, in hindsight, matters more than the fix.

The PRD's outcome was written as "fewer failed native swaps/bridges." Reducing a failure rate is trivially easy when widening slippage tolerance is allowed: the wallet accepts worse prices on the user's behalf, the metric improves, and it gets called reliability. Nobody has to act in bad faith. The tolerance calculation just drifts wider every time it is tuned against the target, because the target rewards exactly that.

One review pass closed that door. The change to the document was almost nothing:

```diff
- Fewer failed native swaps/bridges
+ Fewer failed native swaps/bridges while maintaining execution quality
```

Four words. The same commit added the two numbers that made them enforceable: the price users actually got against the price they were quoted, and the revenue each trade produced. One metric had to fall while those two held.

Everything technical underneath kept moving after that. Classification rules changed, the calculation changed, a liquidity factor came and went. The product contract never moved again, because it had stopped being a statement about a number and become a statement about a trade-off.

## The contract held me to it

I should be honest about how this one ended, because the ending is part of the argument.

The primary metric closed convincingly: the failure rate in the affected segment collapsed. The execution-quality guardrails the review had insisted on were never fully closed out. By the contract's own decision rule, the honest conclusion is "keep going and finish the evidence," not "ship it and scale."

I would rather have a contract that can hold its author to that than one that lets me round up. A rule that cannot inconvenience the person who wrote it is decoration.

## The sequence I kept

The transferable part of this story is a sequence, not a slippage formula. This is what I took from it:

1. **Qualitative signal is a search warrant, not a verdict.** Repeated support reports told me where to look. They could not tell me the size of the problem, and they did not need to.
2. **Segment until the causes separate.** Stage, cause, network, asset type. I stop cutting when the segments have different fixes: if two segments share a fix, the cut is either not done or went too far.
3. **Design per segment, not per average.** Our three failure categories needed a pricing change, a bug fix, and a gas sponsorship program. No single intervention derived from the average would have touched all three.
4. **Ask how the target could be faked before shipping.** Whatever answers that question becomes the guardrail. The primary metric and the guardrails belong in the same contract: one falls while the others hold.
5. **Let the contract outlive the implementation.** Algorithms, coefficients, and rules changed many times. The trade-off statement did not, and that was the point.

This case ran inside a larger operating model where PRDs, evidence, and outcome contracts live in Git and get reviewed like code. That system, and how the review that added those four words actually happened, is the subject of a separate article: [How I rebuilt product work around coding agents](/writing/product-work-around-coding-agents). The reference implementation is open source: [github.com/abalyasnikov/product-os](https://github.com/abalyasnikov/product-os).
