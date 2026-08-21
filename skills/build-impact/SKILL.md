---
name: build-impact
description: Use when someone asks whether a shipped change, set of pull requests, launch, experiment, or feature worked, created customer value, should roll out further, should continue, or should be rolled back, including weekly engineering-impact or "code in the wild" reports.
---

# Build Impact

Decide whether shipped work produced the intended customer or business outcome. Separate what shipped, who could experience it, what moved, and what can responsibly be attributed to the work. For a builder's recent PRs, tell one product-impact story instead of producing a changelog.

## Core rule

**No impact verdict from an unverified measurement.** A merge is not exposure, movement is not causality, and zero events is not zero use.

Keep Novus, GitHub, Linear/Jira, flags, launches, and production read-only unless the surrounding task separately authorizes a mutation.

## Workflow

### 1. Reconstruct the impact contract

Resolve the work from the current branch, PRs, issues, launch, flag, goal, or explicit request. For multiple PRs, group only changes that contribute to the same customer experience and name every included PR. Establish:

- intended user or business outcome;
- affected audience and exposure mechanism;
- primary outcome, early indicator, and must-not-regress measures;
- baseline or comparison cohort;
- expected lag or named review point.

Use a saved Novus goal when directly related. Otherwise keep the intended outcome provisional; do not invent a target. Use Linear/Jira intent as planning evidence, not proof of impact.

When reporting on a person, distinguish their contribution from team ownership. Tie their exact PRs to the product experience, but do not credit them with an area-wide metric unless the evidence supports that attribution.

### 2. Verify the shipping trail

Read [references/evidence-map.md](references/evidence-map.md). Stop at the last proven state:

1. **Proposed** — code or a plan exists.
2. **Merged** — it entered the target branch.
3. **Exposed** — the relevant audience could encounter it.
4. **Measured** — trustworthy outcome evidence exists after exposure and the expected lag.

Do not infer exposure from merge, issue completion, or flag existence. Resolve rollout percentage, targeting, app, version, start time, and competing releases when material.

Keep the complete trail in the analysis. In a weekly Slack report, render one release date: when the final required change made the described experience available. Add one short exposure note only when rollout or audience limits materially change the interpretation.

### 3. Establish measurement trust

**REQUIRED MEASUREMENT CHECK:** When the conclusion depends on Pendo behavioral data and no current instrumentation verdict exists for the measured surface, use `verify-instrumentation` when it is available. Otherwise perform the same read-only trust-chain check from [references/evidence-map.md](references/evidence-map.md): arrival, recognition, definition, continuity, audience, and decision-critical coverage.

Carry its `TRUSTED`, `DEGRADED`, `UNTRUSTED`, or `UNKNOWN` verdict into this decision. A degraded measurement may support a bounded directional conclusion when the limitation cannot reverse it. An untrusted or unknown primary outcome yields `CANNOT VERIFY`, not `DID NOT WORK`.

Never infer an instrumentation verdict from aggregate metrics or invent validation findings. If neither the sub-skill nor the direct trust-chain check can establish a current verdict, use `UNKNOWN`. Use `TOO EARLY` only when exposure and measurement are trustworthy but the outcome window is incomplete; otherwise use `CANNOT VERIFY`.

### 4. Compare the right populations

Prefer a concurrent eligible treatment/control or staged-rollout comparison. Otherwise use matched pre/post windows anchored on verified exposure and disclose seasonality, audience shifts, internal/test traffic, overlapping releases, sample size, and adoption lag.

Separate:

- **Observed movement** — what changed after exposure;
- **Attributed impact** — what the design supports assigning to this change;
- **Alternative explanations** — other credible causes.

Use exact lift, confidence intervals, or thresholds only when the underlying data supports them.

Search relevant Novus signals before choosing the next action. Use a current signal to explain what to watch next, especially when the outcome is too early to judge. Prefer a concrete behavior loop, cohort, or guardrail over a generic request to "keep monitoring."

### 5. Return one verdict and action

Read [references/output-contract.md](references/output-contract.md) immediately before responding. Choose exactly one:

- **WORKED** — expected outcome improved after verified exposure with trustworthy measurement and acceptable guardrails.
- **PARTIAL** — evidence supports a real but incomplete, segmented, or guardrail-constrained benefit.
- **DID NOT WORK** — trustworthy evidence after the expected window shows the intended outcome did not improve or a decisive guardrail failed.
- **TOO EARLY** — exposure or the outcome window is incomplete.
- **CANNOT VERIFY** — exposure, instrumentation, comparison, or outcome evidence is not trustworthy enough.

Recommend exactly one next action: `expand`, `continue`, `modify`, `rollback`, or `repair measurement`. Name the evidence that would change the verdict and the next review condition. Use the Slack-first report shape when the request is about a builder's recent work, a weekly update, or a Slack delivery.

## Degraded behavior

- **Novus unavailable:** verify shipping and intended outcome from repository and planning context, but do not claim customer impact.
- **No GitHub or rollout evidence:** do not infer exposure; use `CANNOT VERIFY` or `TOO EARLY`.
- **No Linear/Jira:** use the PR, launch, goal, or caller's stated intent and disclose missing roadmap context only when material.
- **No saved goal:** preserve a provisional outcome; impact verification can still proceed.
- **Broken instrumentation:** identify the smallest exact repair, use `verify-instrumentation` when available, and keep the impact verdict unverified.
- **Conflicting evidence:** show the conflict and choose the more conservative verdict.

## Scope boundary

Do not use this skill to choose the next unrelated build, allocate a portfolio, design a pre-ship experiment, or generate instrumentation from scratch. Use `whats-next` or `build-investment` for the adjacent decisions they cover.
