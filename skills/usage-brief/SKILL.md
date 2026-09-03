---
name: usage-brief
description: Use when a builder is about to start or scope work on a product area and wants a structured read of how used the associated surfaces are, whether the area grows by adoption or by stickiness, and how much verification the change warrants. The pre-build counterpart to build-impact — it characterizes the ground you are about to change, not whether shipped work paid off.
---

# Usage Brief

Characterize the product area a change will touch, before it ships, so the builder knows the stakes: who uses it, whether it is an adoption or a stickiness story, and how much manual verification the change warrants. Return one test-emphasis verdict backed by evidence. Do not judge shipped impact, choose the next task, or review UX.

## Core rule

**Reach is not stakes, and low traffic is not low risk.** A surface a handful of accounts touch can be high-stakes if those accounts are valuable or the action is irreversible; a busy surface can be low-stakes if the change is read-only and reversible. Characterize *who* and *how sticky* before rating severity, and never let a single top-line reach number stand in for the risk.

Keep Novus, GitHub, Linear/Jira, flags, and production read-only. This skill reads and rates; it changes nothing.

## Workflow

### 1. Resolve the associated surfaces

Resolve the intended work from a description, a Linear/Jira ticket, or a PR/branch/diff. Establish:

- the **user-visible surfaces** the change touches — the Pages, Features, Track Events, funnels the change reaches, not the files;
- the **action type** — read-only view, state-changing write, or outbound/irreversible effect (a rollout, a delivery, a destructive edit);
- the **exposure** — is the surface itself behind a flag or a partial rollout, which caps who a bug can reach.

Read [references/evidence-map.md](references/evidence-map.md). Map code to Novus artifacts by area. If nothing resolves, say so and fall back to a code-only scoping note — do not invent usage.

### 2. Usage of the associated parts

For each associated surface, over a recent window (default last 7 days for "now" and last 30 days for trend):

- **reach** — unique visitors and accounts, and reach as a share of active users;
- **top accounts and visitors** — who actually uses it, by account and by visitor;
- **journey** — how users arrive at and move through the surface, when a path is legible.

Exclude or separate internal, test, and researcher traffic — name it, do not silently fold it into customer reach.

### 3. Adoption vs. stickiness

Classify how the area grows, with numbers, not adjectives:

- **Adoption signal** — new accounts/visitors arriving (new-vs-returning split, account-count growth, weekly ramp).
- **Stickiness signal** — the same users returning (retention, days-active cadence, repeat depth).

Return one classification — `ADOPTION-LEANING`, `STICKINESS-LEANING`, `BOTH`, `NEITHER`, or `UNKNOWN` — and say which lever *this specific change* pulls, since an in-flow enhancement rarely drives new-user acquisition even when its surface is being adopted.

### 4. Rate severity and test emphasis

Combine, from [references/evidence-map.md](references/evidence-map.md):

- **base** — reach (share of active users) × criticality (is the surface in a critical or irreversible path?) × action type;
- **modifiers** — reachability (a flag/partial rollout scales a bug's blast radius down), account concentration/value (a few high-value accounts scale it up), data-scale coupling, and usage trend.

Then call `verify-instrumentation` for the surface, so the brief can state whether the change's own impact will be measurable after it ships. A change on a fast-growing surface with no denominator event is worth flagging now, not after.

### 5. Return the brief

Read [references/output-contract.md](references/output-contract.md) immediately before responding. Return one test-emphasis verdict — `HEAVY`, `STANDARD`, or `LIGHT` — with the adoption/stickiness classification, the evidence behind the rating, and the one measurability note. Point the emphasis at the specific path that carries the risk (e.g. delivery-correctness), not "test everything."

## Degraded behavior

- **Novus unavailable:** return the code-only scope — surfaces, action type, exposure — and a `LIGHT`/`STANDARD`/`HEAVY` rating from criticality and action alone, marked as un-evidenced. Do not claim usage numbers.
- **No matching artifact:** the surface is not modeled in Novus. Say so; rate from criticality and action, not from an invented reach.
- **Zero or sparse activity:** report it honestly; a genuinely unused surface lowers reach but may still be high-stakes if the action is irreversible. Never render zero events as zero use.
- **Internal/test/researcher-heavy traffic:** separate it; a ramp that is mostly internal or researcher traffic is not proven customer adoption.
- **Instrumentation untrusted:** carry the `verify-instrumentation` verdict; do not upgrade a usage claim past what the measurement supports.

## Scope boundary

This skill characterizes the ground before a change and rates verification effort. It does not decide whether shipped work created value (`build-impact`), choose which work to do next (`whats-next`), allocate a portfolio (`build-investment`), review a change for UX problems (`ux-review`), or add tracking (`add-instrumentation`). Use `verify-instrumentation` as its measurement sub-check; hand off the other decisions rather than expanding this skill into them.
