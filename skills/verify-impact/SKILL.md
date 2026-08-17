---
name: verify-impact
description: Use when someone asks whether a shipped change, pull request, launch, experiment, or feature worked, created customer value, should roll out further, should continue, or should be rolled back.
---

# Verify Impact

Decide whether a shipped change produced the intended customer or business outcome. Separate what shipped, who could experience it, what moved, and what can responsibly be attributed to the change.

## Core rule

**No impact verdict from an unverified measurement.** A merge is not exposure, movement is not causality, and zero events is not zero use.

Keep Novus, GitHub, Linear/Jira, flags, launches, and production read-only unless the surrounding task separately authorizes a mutation.

## Workflow

### 1. Reconstruct the impact contract

Resolve the change from the current branch, PR, issue, launch, flag, goal, or explicit request. Establish:

- intended user or business outcome;
- affected audience and exposure mechanism;
- primary outcome, early indicator, and must-not-regress measures;
- baseline or comparison cohort;
- expected lag or named review point.

Use a saved Novus goal when directly related. Otherwise keep the intended outcome provisional; do not invent a target. Use Linear/Jira intent as planning evidence, not proof of impact.

### 2. Verify the shipping trail

Read [references/evidence-map.md](references/evidence-map.md). Stop at the last proven state:

1. **Proposed** — code or a plan exists.
2. **Merged** — it entered the target branch.
3. **Exposed** — the relevant audience could encounter it.
4. **Measured** — trustworthy outcome evidence exists after exposure and the expected lag.

Do not infer exposure from merge, issue completion, or flag existence. Resolve rollout percentage, targeting, app, version, start time, and competing releases when material.

### 3. Establish measurement trust

**REQUIRED SUB-SKILL:** Use `verify-instrumentation` when the conclusion depends on Pendo behavioral data and no current instrumentation verdict exists for the measured surface.

Carry its `TRUSTED`, `DEGRADED`, `UNTRUSTED`, or `UNKNOWN` verdict into this decision. A degraded measurement may support a bounded directional conclusion when the limitation cannot reverse it. An untrusted or unknown primary outcome yields `CANNOT VERIFY`, not `DID NOT WORK`.

### 4. Compare the right populations

Prefer a concurrent eligible treatment/control or staged-rollout comparison. Otherwise use matched pre/post windows anchored on verified exposure and disclose seasonality, audience shifts, internal/test traffic, overlapping releases, sample size, and adoption lag.

Separate:

- **Observed movement** — what changed after exposure;
- **Attributed impact** — what the design supports assigning to this change;
- **Alternative explanations** — other credible causes.

Use exact lift, confidence intervals, or thresholds only when the underlying data supports them.

### 5. Return one verdict and action

Read [references/output-contract.md](references/output-contract.md) immediately before responding. Choose exactly one:

- **WORKED** — expected outcome improved after verified exposure with trustworthy measurement and acceptable guardrails.
- **PARTIAL** — evidence supports a real but incomplete, segmented, or guardrail-constrained benefit.
- **DID NOT WORK** — trustworthy evidence after the expected window shows the intended outcome did not improve or a decisive guardrail failed.
- **TOO EARLY** — exposure or the outcome window is incomplete.
- **CANNOT VERIFY** — exposure, instrumentation, comparison, or outcome evidence is not trustworthy enough.

Recommend exactly one next action: `expand`, `continue`, `modify`, `rollback`, or `repair measurement`. Name the evidence that would change the verdict and the next review condition.

## Degraded behavior

- **Novus unavailable:** verify shipping and intended outcome from repository and planning context, but do not claim customer impact.
- **No GitHub or rollout evidence:** do not infer exposure; use `CANNOT VERIFY` or `TOO EARLY`.
- **No Linear/Jira:** use the PR, launch, goal, or caller's stated intent and disclose missing roadmap context only when material.
- **No saved goal:** preserve a provisional outcome; impact verification can still proceed.
- **Broken instrumentation:** route the smallest exact repair through `verify-instrumentation` and keep the impact verdict unverified.
- **Conflicting evidence:** show the conflict and choose the more conservative verdict.

## Scope boundary

Do not use this skill to choose the next unrelated build, allocate a portfolio, design a pre-ship experiment, or generate instrumentation from scratch. Use `whats-next`, `build-investment`, `goal-to-experiment`, or `stress-test-plan` for those decisions.
