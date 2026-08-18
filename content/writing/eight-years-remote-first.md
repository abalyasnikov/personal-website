---
title: "Eight years of running product remote-first: what actually worked"
description: The remote operating system we ran at Zerion, from a one year direction down to a single ticket.
status: published
date: 2026-08-16
order: 1
---

![A figure reaching for a blue paper plane whose dotted route circles a half-lit globe](/og/eight-years-remote-first.jpg)

My product team at Zerion was spread across New York, London, and continental Europe, with a few people in Asia. Roughly thirteen hours end to end, a narrow overlap window, no office to fall back on. Async was structural, not a preference.

Remote work is not about tools. Loom, Slack, and Linear are the easy part, and none of them help a team that has not agreed on the level above: where it is going, how a decision gets made, what a meeting is for. Distance just makes the missing agreement visible, because nothing gets repaired by proximity. In an office an unclear decision costs a swivel of the chair; across thirteen hours it costs a day. So all of it has to be agreed explicitly, and ours came down to six pieces:

1. **A rhythm.** A one year direction, plans every six months, two month delivery cycles, and days that run async with one rule: unblocking others goes first.
2. **One way to make decisions.** Requests land in one queue; a decision becomes a document, and its merge means approved.
3. **Meetings with jobs.** Every call has a purpose, a pre-read, and an owner of the next step, and the calendar itself gets audited.
4. **The cheapest form that works.** A comment where the work is when you can, a call when you must.
5. **Writing that gets read.** Context lives where agents read it at any hour; approving stays human.
6. **A manager who trusts.** Remove blockers, grant permission loudly, no surveillance.

The tools barely come up, because once this level is agreed, they pick themselves.

## The rhythm

Each stretch of time has its own job, from the year down to the day.

Twice a year, a strategy offsite with founders and stakeholders. It sets the direction for the year ahead, one page, ordered principles, explicit trade-offs, and it is where we agree on the plans for the next six months. The principles are ordered because when two of them collide, the order settles the argument at any hour, with nobody escalating. How we ran the strategy file day to day is its own article: [How I rebuilt product work around coding agents](/writing/product-work-around-coding-agents).

Delivery runs on two month cycles, six a year. Week one, the whole team plans: engineers spend most of it thinking rather than building, and "why are we doing this at all" is an expected question. Weeks two through seven build. Week eight closes: retro, finishing, tech debt. Week one looks like a lost week, and on a distributed team it is the fastest one on the calendar. A ticket with a title and four bullets reads as obvious, so the engineer commits to two weeks; three weeks in, five questions surface that nobody asked at the start. In an office each is a shoulder tap. Across timezones each costs a day, and they arrive one by one. Week one answers those questions while they are still cheap, and it sets the bar for any ticket: decomposed enough that a person can move without waiting for the next call.

The week runs on a small fixed set of meetings, and they get their own section below.

The day runs async with one rule on top: anything that unblocks another person goes first. If twenty seconds of my attention lets somebody else move, that is the cheapest twenty seconds in the system. Blocking beats interesting.

## How a decision gets made

The remote problem with decisions is not making them. It is knowing that one was made. You post a document, people open it at different hours carrying different context, a few comment, nobody objects, and it feels agreed. It is not; silence tells you nothing. I learned that the expensive way, when my own team ended up holding three versions of a decision with nothing on record to say which was real.

The fix: a decision is not a feeling in the room, it is a recorded moment with a named approver and a version. Ours traveled like code. The PRD went out as a pull request, review happened in the thread, and the merge meant approved. From then on everyone pointed at one version, and any later change was a new review, not a quiet edit. The tool does not matter; an RFC with named approvers or a decision log with dates does the same job.

Around that moment, a habit and an exception. The habit: if it was said and not written down, it did not happen, so every call ends as a summary plus action items with an owner and a deadline. The exception: the most expensive decisions get a live call, everyone having read the document, because the call exists to hear the objection nobody would have typed. Cameras belong exactly here. On a status call a camera only checks that you showed up; on a decision call it is how you read the room, and reading the room is what you are paying for. Async first does not mean async only.

Distance changes urgency too. In an office, incoming requests get sorted out in hallways; remote, they do not get sorted at all, and everyone forms a private view of what is urgent. So every request lands in one queue automatically and gets ranked by explicit criteria: revenue at stake and fit with the strategy, not who asks loudest. Saying no is only possible when the alternative is visible.

## What meetings are for

Our weekly set is what survived an audit. In February 2025 we rebuilt every recurring product meeting around jobs instead of audiences. What survived: two short discovery roundtables, a Show and Tell every two weeks with founders, working syncs only for questions that need those exact people, technical PRD review on demand, and standups where the report is the short part, and the discussion happens right after, among only the people it concerns. One meeting we deleted outright, because other slots already covered it. What changed was not the number of colored blocks: the same topics stopped migrating from call to call, and each meeting became a step in a sequence: investigate, decide, align, name the owner of the next step.

The test is the part worth copying, because meetings pile up like subscriptions, and "is it useful" filters nothing; everything is useful. The question that filters:

> What decision does this meeting produce, and who owns the next step when it ends?

A slot that produces neither is a broadcast, and a broadcast does not need everyone at once. Doing this once is a cleanup; doing it on a schedule is a practice, because no meeting ever announces it has become redundant, and deleting one reads as a statement about its owner. So the review gets a slot of its own, where killing something is the expected outcome, not an accusation. I owned that review for the product organization.

Surviving meetings run on two rules: a stated purpose, and a pre-read sent ahead, a doc or a short video, so the call starts at the decision instead of at slide one. These rules cannot be replaced by one more call, because attention runs out. In our larger calls, about an hour was the ceiling: past it I would ask a question and the person could not repeat it back. Everything scheduled past that ceiling is theater. And meeting load feeds itself: holes in async get patched with meetings, and meetings burn the attention that careful reading and writing need. The brake is whole meeting-free days, because focus cut into hourly pieces is not focus.

## Where to say things

Every message lands in somebody else's attention. A Slack ping feels free to send and is not free to receive; a live call spends other people's exact hours. So the rule is to say it in the cheapest form that still works:

1. **A comment on the document or the pull request.** Attached to the thing it is about, readable later, costs nobody a context switch.
2. **A Slack thread.** Cheap to send, interrupts, and evaporates.
3. **A recorded walkthrough.** Costs the recipient real minutes, but minutes they choose.
4. **A live call.** The most expensive form, saved for what needs everyone at once.

The recorded walkthrough is where Loom carried real weight. Designers walked reviewers through their own prototypes, and comments landed at the exact timestamp; that thread was the review, and having a place to respond is the whole difference between collaboration and a broadcast. The same format loaded context before meetings, because people who will not read twelve pages will watch six minutes.

A thread that goes back and forth without reaching an answer moves to a call; without that trigger, threads either die quietly or drag on forever. And this is where the tools finally pick themselves: Git holds decisions, Linear holds delivery and the request queue, Loom holds walkthroughs and pre-reads, Slack is for what interrupts and evaporates.

## Agents read what we write

The old objection to writing everything down was fair: documentation is written by one person, read by almost nobody, and rots. That objection stopped holding when writing got a reader that never sleeps. The core problem of async was always one sentence, the person who knows is asleep, and an agent that can read a well kept knowledge base removes it. What you write now gets read, at any hour; what stays on you is keeping it true.

Three things we shipped. A Slack agent that answers from the product knowledge base, built and deployed by me, so anyone could ask about roadmap or competitors without hunting for the one person who knew. A skill that turns call transcripts into Linear items, with manual review; its first test on a single standup produced eight items that had lived only in somebody's memory. And a pytest framework for API QA, because a test run is an artifact and a verbal report is a rumor.

One line keeps this honest: a transcript is not a decision, and a summary is not a decision. Agents capture, draft, summarize, and route; approving stays human, on purpose and in the open, because sign-off is the one moment that has to mean something.

## The manager's job

Mine was to remove blockers, set direction, and own the process, because we hired for autonomy and the point was to preserve it, not replace it with checking. The failure mode of remote management is anxiety, and anxiety produces surveillance: status calls, check-ins, activity dashboards, all of which wreck the async system while calming the manager.

One move matters double at a distance: grant permission loudly. An office hands out permission in hallways; you mention an idea, someone says go ahead. Remote has no ambient yes, so the default drifts to no, and good people quietly pay for their own tools instead of opening an approval thread. Say yes in public, and treat someone hitting a usage limit as a good sign: they are doing the thing you wanted more of.

The human side takes deliberate effort, because burnout does not show in a Slack thread. One on ones without an agenda were worth more than anything structural I tried. In-person time stayed on the calendar: the strategy offsite every six months and a full team offsite once a year, because setting direction face to face is worth the flights.

And I run myself on the same system, one level down: a git-synced folder of Markdown notes, meetings, decisions, daily logs, with scheduled digests, on the principle that anything I only remember, I do not actually have.

## What stayed hard

Most problems above turned manageable once they got a rule: the attention ceiling, the regrowing calendar, the default no. One never did, and it is the first thing I would build next. Marketing and BD joined discovery early, and that worked: deciding distribution while the product was still movable changed what got built more than once. A launch plan built on influencers needs a referral mechanism inside the product, live before launch, not after. The working surface never merged, though; marketing kept its own Notion and boards, so the launch promise lived in two places. Extending one decision trail from strategy to launch, without forcing anyone into a developer tool, is the most interesting problem remote work has left me.

## The short version

Async is a decision system, not a communication style, and remote work is not a tool stack. Teams do not fail at a distance because people write badly; they fail when nobody can point at the moment a decision was made. So every scale of the system produces that moment: the half year has its offsite, the cycle its week one, the week its decision meetings, the document its merge, the ticket its bar, the call its action items. Across thirteen hours, only what is explicit survives. Build for that, and distance stops being an excuse; it becomes the standard the whole system is held to.
