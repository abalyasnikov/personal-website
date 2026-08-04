---
title: Running ML against prediction markets
description: What survives contact with live execution, and what only ever worked in the backtest.
status: draft
date: 2026-07-31
order: 4
---

## a backtest is a proposal

A backtest can tell you that a model found structure in historical data. It cannot tell you that the system can capture that structure in a live market.

The gap contains latency, changing liquidity, partial fills, fees and every assumption that looked harmless while the data was already complete.

## execution is part of the model

The useful unit is not a prediction score. It is the full path from data collection to feature calculation, decision, order placement and observed outcome.

When that path is measured end to end, failed trades become traces. They show whether the problem was selection, timing, sizing or execution instead of collapsing everything into model accuracy.

> If the model cannot survive the execution path, the backtest measured a product that does not exist.

## keep the loop small

The fastest learning comes from the smallest live system that can challenge the current thesis. Add complexity only when a measured constraint demands it.

That keeps the decision clear: ship the next intervention, scale what survives, or kill the thesis before the system grows around it.
