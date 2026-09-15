# Build Impact evidence map

Novus MCP tool prefixes vary by host. Match capability suffixes such as `getArtifactMetrics`, not full tool names.

## Resolve the change and intent

| Need | Preferred sources | Guidance |
| --- | --- | --- |
| Changed behavior | branch, diff, PR, commits, tests | Identify the user-visible or operational effect, not just files changed. |
| Intended outcome | saved goal, launch, PR/issue, caller statement | Prefer direct relationships and preserve stable IDs. |
| Planning context | Novus `listConnectedIntegrations`, native issue tools, direct Linear/Jira connectors | Deduplicate the same issue reached through multiple paths. |
| Product-area scope | product areas, product memory, artifact relationships, linked team work | Start with the shared customer job and include all relevant contributions. Preserve unmapped work and incomplete dependencies. |
| Customer rationale | caller context, linked requests, available feedback, product or leadership decisions | Separate reported demand from inferred rationale and realized benefit. Do not assume feedback access exists. |
| Strongest alternative | goal, issue, launch, prior experiment | Use it to test whether the result is decision-relevant, not to reopen portfolio selection. |

## Prove shipping state

| State | Evidence |
| --- | --- |
| Proposed | PR or patch exists and names an intended outcome. |
| Merged | Target branch contains the merge commit. |
| Exposed | Deployment/version plus flag state, audience targeting, rollout start, or another credible exposure record. |
| Measured | Outcome evidence covers the exposed audience after the expected lag. |

Useful Novus capabilities include goal, launch, flag, artifact, signal, and related-artifact reads. Use GitHub or deployment context to fill merge and release gaps. Never promote a later state from an issue status alone.

Check the target branch and deployment evidence even when running from a feature branch or a branch based on another feature branch. Unreleased work can explain intent but cannot supply post-release impact. A common exposure date must be verified for each included change. For staggered changes, retain per-change exposure windows and eligible populations; a combined benefit requiring every change starts at the final dependency's exposure date.

## Verify measurement

Use `verify-instrumentation` when available for the measured Page, Feature, Track Event, funnel, journey, goal, or affected flow. Otherwise inspect the same trust chain directly: event arrival, artifact recognition, semantic definition, continuity across the window, audience fit, and decision-critical coverage. Relevant Novus capabilities may include:

- `getRawEvents` or recording controls for event arrival;
- Data Validation event-to-artifact matching when exposed by the host;
- `listArtifactsByType`, `getArtifact`, `getExternalIds`, and `getEventProperties` for definitions and sync state;
- funnel, journey, page, feature, track-event, retention, guide, agent, and app metrics for outcomes;
- account, visitor, segment, and top-user reads for audience validation.

Preserve the instrumentation verdict, checked surface, window, evidence, and repair requirement. Do not silently combine renamed events or redefine a funnel to make the result look complete.

Check identity continuity explicitly: visitor IDs, account IDs, and organization definitions may change. A migration can split existing users into new records and inflate unique counts or acquisition. Do not interpret affected before/after growth, retention, or new-versus-returning figures without a verified reconciliation. Prefer stable post-migration windows when available. Independently verify account continuity and omit invalid headlines rather than presenting them with a footnote.

## Interpret product value

Use the eligible exposed users or accounts who could encounter the workflow as the adoption denominator, with matching units and windows. All-app activity can orient the reader but is not an eligibility substitute. Never add overlapping feature populations. For repeat use, require equal follow-up opportunity and consider the task's natural frequency.

Connect related changes to the customer job they support. Look for incomplete handoffs, lost context, or missing dependencies that prevent the combined benefit. Use completion, effort, time, errors, reliability, or feedback when those better reflect the intent than usage growth. A feature can create value by reducing the number of steps required.

Without an eligible denominator or a supported benchmark, report what is known without grading adoption. Customer requests establish demand, not success; adoption does not establish satisfaction, retention, or revenue.

## Explain observed movement

Prefer, in order:

1. randomized or credible holdout comparison;
2. concurrent staged-rollout comparison among eligible users;
3. matched cohort or account comparison;
4. exposure-anchored pre/post comparison;
5. descriptive post-ship movement only.

Check exposure date, audience, adoption, internal/test traffic, sample size, seasonality, incident periods, instrumentation changes, and overlapping releases. Replays and feedback can explain a movement; they do not establish its prevalence by themselves.

## Evidence honesty

- Report percentage-point and relative movement only when denominators and windows are comparable.
- A statistically uncertain result is not proof of no effect.
- A renamed event can split a metric; do not merge definitions without evidence that they represent the same behavior.
- Use `TOO EARLY` only with verified exposure and decision-fit measurement when the outcome window is incomplete. Missing exposure or untrusted measurement yields `CANNOT VERIFY`.
- An untagged funnel step yields a measurement problem, not 0% customer behavior.
- A guardrail failure can make an otherwise positive result `PARTIAL` or `DID NOT WORK`.
- Several summaries of one underlying source are one source.
