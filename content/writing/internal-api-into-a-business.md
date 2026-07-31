---
title: Turning an internal API into a business
description: We built it for our own wallet. Productizing it for other people was a different job than building it.
status: draft
date: 2026-07-31
order: 2
---

## built for ourselves

The API began as infrastructure for our own wallet. Its first customer sat inside the company, so product decisions could rely on shared context, direct access to the team and a roadmap we controlled.

That made it useful. It did not yet make it an external product.

## the product was the contract

External teams needed more than endpoints. They needed predictable behavior, clear documentation, stable authentication, useful errors and confidence that changes would not break their product.

The work shifted from exposing infrastructure to defining a contract another team could safely build on. Reliability and developer experience became product features, not implementation details.

> An internal capability becomes a product when another team can depend on it without depending on your team.

## a different feedback loop

The customer was now a product and engineering team with its own users, release cycles and constraints. Their failed integrations were more useful than abstract feature requests because they showed exactly where the contract was incomplete.

That loop helped turn infrastructure we had built for ourselves into a business used by companies including Coinbase, Kraken and Uniswap, and eventually into more than half of company revenue.
