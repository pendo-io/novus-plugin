---
name: verify-instrumentation
description: Use when a decision depends on Pendo/Novus behavioral data and you need to know whether the measured surface is instrumented well enough to trust — before starting work, before reading impact numbers, or as the measurement-trust sub-check for build-impact, build-investment, whats-next, or usage-brief. It returns a trust verdict and the smallest exact repair; it never adds instrumentation.
---

# Verify Instrumentation

Decide whether a product surface is measured well enough that a later conclusion drawn from its Pendo data can be trusted. Return one verdict and the smallest repair that would raise it. Do not judge product impact, choose work, or write tracking code.

## Core rule

**Absence of events is not proof of absence.** A surface with no recorded activity may be unused, excluded, renamed, or simply untagged. An unverified measurement earns `UNKNOWN`, never a zero, and never `UNTRUSTED` by assumption.

Keep Novus, GitHub, Linear/Jira, flags, and production read-only. This skill inspects; it does not change instrumentation, artifacts, or rollout.

## Workflow

### 1. Resolve the surface to check

Resolve what must be measurable from the current branch, diff, PR, issue, launch, flag, goal, or explicit request. Establish:

- the **decision** the measurement will support (what someone will conclude from it);
- the **surfaces** that carry the evidence — the Pages, Features, Track Events, funnels, journeys, goals, or flow the decision depends on;
- the **decision-critical events** specifically — the one or two signals without which the decision cannot be made (e.g. a completion event, a "created" denominator), separate from nice-to-have coverage.

Read [references/trust-chain.md](references/trust-chain.md) for how to resolve artifacts from the surface. Map changed code to Novus artifacts by area, not by fetching every artifact the diff touches. If nothing resolves to a Novus artifact, say so and stop at `UNKNOWN` — do not invent a surface.

### 2. Run the trust chain

Read [references/trust-chain.md](references/trust-chain.md). Check the six links, in order, only as far as the decision requires:

1. **Arrival** — events reach Pendo for this surface at all.
2. **Recognition** — they map to a defined, synced artifact, not an untagged blob.
3. **Definition** — the artifact/funnel/goal means what the decision assumes (right rule, not a renamed or split event).
4. **Continuity** — coverage is stable across the decision window (no rename, retag, or gap mid-window).
5. **Audience** — the measured population matches the exposed audience, with internal/test traffic accounted for.
6. **Decision-critical coverage** — the one or two events the decision hinges on exist and fire, not just adjacent ones.

Stop at the first link that fails the decision and name it. A later link cannot rescue a broken earlier one.

### 3. Return one verdict and the smallest repair

Read [references/output-contract.md](references/output-contract.md) immediately before responding. Choose exactly one:

- **TRUSTED** — every decision-critical link holds; the measurement can carry the conclusion.
- **DEGRADED** — a limitation exists but cannot reverse the specific decision (bounded use only, stated).
- **UNTRUSTED** — a decision-critical link is broken; the measurement cannot carry the conclusion.
- **UNKNOWN** — the chain could not be established (Novus unavailable, no matching artifact, no arrival evidence).

Name the **single smallest exact repair** that would raise the verdict — the specific event, tag, funnel step, or exclusion — and the surface, window, and evidence checked. Do not list every possible improvement; name the one that unblocks the decision.

## Degraded behavior

- **Novus unavailable:** return `UNKNOWN` with the surface you would have checked and the tools you could not reach. Do not guess a verdict.
- **No matching artifact:** the surface is not modeled in Novus. Return `UNKNOWN` and name the artifact type that would need to exist. Do not treat "not found" as `UNTRUSTED`.
- **Zero activity:** report it as zero *arrival*, surface the `warnings`, and hold at `UNKNOWN` unless independent evidence shows the event should have fired. Never render zero events as zero use.
- **Recent change to the surface:** a rename or retag inside the window breaks continuity — say which, and prefer `UNTRUSTED` or `DEGRADED` over a clean verdict.
- **Conflicting evidence:** show the conflict and choose the more conservative verdict.

## Scope boundary

This skill decides whether a measurement can be trusted. It does not add or repair instrumentation (that is `add-instrumentation`), decide whether shipped work created value (`build-impact`), characterize an area's usage or risk (`usage-brief`), or choose the next task (`whats-next`). Hand the verdict, checked surface, window, and repair to those skills; do not expand this one into their decision.
