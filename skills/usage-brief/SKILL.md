---
name: usage-brief
description: Use when a builder wants to understand how much a product area is actually used today, and whether the PR or feature they are working on has potential to grow that usage — backed by real Pendo numbers. It leads with current usage, then reads the growth potential and the numbers that would show it worked, and can post the brief as a comment on the PR or the linked Linear/Jira ticket. The at-PR counterpart to build-impact — it reads the ground a change touches, not whether shipped work paid off.
---

# Usage Brief

Show a builder how much the product area a change touches is used **today**, and whether the change has room to **grow** that usage — leading with real numbers. Then offer to post the brief to the PR or ticket. Do not judge shipped impact, choose the next task, or review UX.

Your reader is a builder without deep product-analytics fluency. Lead with the usage numbers, keep metric jargon and internal labels out of the way, and write in plain product language.

## Core rule

**Lead with what's actually used.** The first thing the reader wants is the real usage of this area — show that before anything else. Then read whether this change can move it, and never present growth "potential" as a prediction: it is an estimate from the headroom in current usage, the lever the change pulls, and the population it can reach. Say so honestly.

Reads stay read-only — Novus, GitHub, Linear/Jira, flags, and production are never mutated. The **one** exception is the final step: posting the brief as a comment, and only after the user confirms the exact text. This is the only skill in this plugin that writes anything; the others never do.

## Workflow

### 1. Resolve the associated surfaces

Resolve the work from a description, a Linear/Jira ticket, or a PR/branch/diff. Identify the **user-visible surfaces** the change touches — the Pages, Features, Track Events, and funnels it reaches, not the files. Read [references/evidence-map.md](references/evidence-map.md). Map code to Novus artifacts by area. If nothing resolves to a Novus artifact, say so and give a code-only scope — do not invent usage.

### 2. Current usage — the headline

For the associated surfaces, over the last 7 days ("now") and 30 days (trend):

- **reach** — unique visitors and accounts, and reach as a **share of active users** (a count means nothing without the base);
- **who** — the top accounts and visitors, with internal, test, and researcher traffic **separated out**, not folded into customer reach;
- **the specific control or flow this change touches** — its own usage, when it is measurable on its own.

This is the block the brief leads with. Report every number in plain product language.

### 3. Can this change grow usage?

Read whether the change has room to move those numbers, honestly labelled as an estimate:

- **Headroom** — is usage low or declining (room to grow) or high and saturated (little room)? Low usage on a live area is where potential is highest, not lowest.
- **Lever** — does the change bring **new users**, **deepen use** for people already here, or **neither**? Say which, in one plain sentence, and separate it from the surface's own trajectory (an in-flow enhancement rarely acquires new users even on a growing surface).
- **The number that would show it worked** — name the one metric this change could move, its value now, and a realistic ceiling. Call `verify-instrumentation` for that surface; if the metric is not cleanly measurable yet, say so and where the number would have to come from instead.
- **Known friction it addresses** — if a Novus signal already flags a problem here (low conversion, frustration, a broken step), cite it; closing a known gap raises the potential.

### 4. Share the brief

Read [references/output-contract.md](references/output-contract.md) immediately before composing. Build the comment (the two blocks above, plain language). Then:

- **Find the target** — a pull request for the current branch first (post to GitHub/the git host); if there is none, the linked Linear/Jira ticket.
- **Confirm, then post** — show the exact comment and the target, and post only after the user confirms. Never auto-post.
- **Degrade** — if no PR or ticket resolves, or there is no write access, output the comment for the user to paste and say why it was not posted. Never fail silently, and never post to the wrong target when unsure.

## Degraded behavior

- **Novus unavailable:** you cannot fill the usage block — say so plainly. Still name the surfaces and the likely lever from code, marked as un-evidenced. Do not invent numbers.
- **No matching artifact:** the surface is not modeled in Novus. Say so; describe the area from code, not from an invented reach.
- **Zero or sparse activity:** report it honestly — a genuinely low-usage area is exactly where growth headroom is largest, so say that rather than rendering zero events as "no potential".
- **Internal/test/researcher-heavy traffic:** separate it; a ramp that is mostly internal or researcher traffic is not proven customer usage or proven potential.
- **Instrumentation untrusted:** carry the `verify-instrumentation` verdict into "the number that would show it worked"; do not claim a growth metric the measurement cannot support.
- **No PR or ticket / no write access:** output the comment for manual paste; do not treat inability to post as a failure of the brief.

## Scope boundary

This skill reads current usage and growth potential and shares the brief. It does not decide whether shipped work created value (`build-impact`), choose the next task (`whats-next`), allocate a portfolio (`build-investment`), review UX (`ux-review`), or add tracking (a dedicated `add-instrumentation` skill is planned but not yet available). Use `verify-instrumentation` as its measurement sub-check. Posting is unique to this skill and always confirmed; do not add write behavior to the others, and do not expand this skill into their decisions.
