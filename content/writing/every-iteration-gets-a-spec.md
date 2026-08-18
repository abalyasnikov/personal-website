---
title: Every iteration gets a versioned spec
description: Each feature gets a versioned spec with its own implementation history, so agents pick up context instead of starting from zero.
status: published
date: 2026-08-12
order: 4
---

![A blue toy locomotive pulling document cars tagged v1 through v5](/og/every-iteration-gets-a-spec.jpg)

For a while my specs lived in a folder called specs. Every feature added a Markdown file, every file was written for the moment it served, and the folder grew in whatever order the work happened. Soon it could not answer a single useful question. Which of these decisions still stand? Which version of the strategy does this file describe? What was tried and abandoned? I could not read the history out of it, and my agents could not either: every new session started from a blank slate inside a repository that had already learned the answers.

Vibe coding made this worse, because the volume went up. More ideas get tried in a week than a folder of loose files can hold. So the folder became a system: versioned specs with their own implementation history, and a pair of skills that write and review them. It is the base layer under everything I build with agents, including the interface pipeline in [Agent-built interfaces drift into slop. Here is how I stop it.](/writing/interfaces-with-coding-agents)

## The spec is what the agent actually builds

An agent does not build what I meant. It builds what is written. So before code, the work is writing: collect the context, do the research, name the end state, and draw the scope line, including the explicit out-of-scope list. The document is small, but producing it forces the decisions that would otherwise be made silently, mid-implementation, by a model.

What I get: scope pinned before the first line of code, and disagreements moved to where they are cheap.

## One iteration, one version

The structure is small:

```text
dev_history/
  INDEX.md
  v0.42_retry-policy/
    SPEC.md
    IMPLEMENTATION_HISTORY.md
```

INDEX.md is the registry: every version, its status, its outcome, one line each. Each entry holds the spec and its implementation history. The lifecycle is DRAFT → APPROVED → IN PROGRESS → DONE, with SUPERSEDED BY pointing at whatever replaced an entry. Two rules turn this into a history rather than a pile: a version is never reused, and finished entries are never rewritten. Corrections arrive as new entries; the record of what was believed at the time stays intact.

What I get: a repository that can answer "what happened here, and in what order" without me in the room.

## What the spec has to say, and what it must not

The writing skill enforces a discipline I used to apply inconsistently:

- Investigate first, ask second. It reads the repository, the index, and the nearby entries, and only then asks about what is genuinely undecidable.
- Scope is proposed before the document is written: goal, in scope, out of scope, deferred work, risks. Answering questions is not approval; the spec waits until the scope is explicitly approved.
- One spec, one outcome. If two pieces of work can be accepted, stopped, or rolled back independently, they are two entries. Bundled work is where scope drift hides.
- Evidence is labeled. Verified facts, assumptions, blocking questions, and deferred decisions are different things, and an assumption that could change scope blocks the spec until it is resolved.
- Replacement work names its legacy: the final supported path, what gets deleted, and any temporary compatibility exception with its removal condition.
- Failure behavior is defined where it applies: retries, idempotency, partial failure, rollback. Only where it applies; a wall of N/A checklists is its own kind of drift.

What I get: specs an agent can execute without inventing the missing half.

## Review runs in rounds, and the writer is not the reviewer

A spec always looks right to the model that just wrote it. So review is structural, not optional:

Minimum three rounds. Each round, an agent reviews the spec against the repository: scope, evidence, failure semantics, contradictions with earlier entries. The findings go in as fixes, and the next round starts clean, because patches bring their own bugs.

Cross-model. The model that wrote the spec never reviews its own work. I have Claude review the spec and hand the findings to Codex, so one model's defaults get checked against another's.

A final outside pass. gstack's plan-eng-review locks the plan the way an engineering manager would: architecture, data flow, edge cases, test coverage.

The reviewing skill returns findings with a priority, a required-or-not flag, evidence for the problem, one recommended fix, and it ends with a single verdict: APPROVED or CHANGES_REQUIRED. That verdict closes the review, not the decision. The reviewer never edits the spec, and no APPROVED replaces my sign-off: models argue about the document, and the last word on it is always mine.

What I get: a spec I can sign off on with confidence, after three adversarial passes failed to break it.

## The payoff is memory

The clearest case for all this ceremony comes from my ML Trading project, where hypotheses get tested constantly. More than once I have arrived with what felt like a new idea, opened the index, and found the same hypothesis twenty specs back: tested, measured, invalidated by its own results. The idea felt new because I had forgotten it. The history had not.

Without the record I would have built it again, and the second run would have cost as much as the first. The same memory works forward. An agent picking up v0.43 reads what v0.42 did, what broke, what was deferred and why. It starts from what the project knows instead of from whatever I manage to paste into a prompt.

What I get: context that compounds across sessions, models, and months.

## The skills are open source

The two skills that run this system are published in [github.com/abalyasnikov/dev-history-skills](https://github.com/abalyasnikov/dev-history-skills): write-dev-history-spec and review-dev-history-spec. MIT, no runtime dependencies, installed by symlink for Claude Code and Codex. The writer investigates and proposes scope before touching a file; the reviewer never edits and ends with one verdict. Both read your repository's own conventions first and fall back to their structure only where none exists.

Where this sits in the larger picture is the interface pipeline: [Agent-built interfaces drift into slop. Here is how I stop it.](/writing/interfaces-with-coding-agents)
