# Verify Impact evidence map

Novus MCP tool prefixes vary by host. Match capability suffixes such as `getArtifactMetrics`, not full tool names.

## Resolve the change and intent

| Need | Preferred sources | Guidance |
| --- | --- | --- |
| Changed behavior | branch, diff, PR, commits, tests | Identify the user-visible or operational effect, not just files changed. |
| Intended outcome | saved goal, launch, PR/issue, caller statement | Prefer direct relationships and preserve stable IDs. |
| Planning context | Novus `listConnectedIntegrations`, native issue tools, direct Linear/Jira connectors | Deduplicate the same issue reached through multiple paths. |
| Strongest alternative | goal, issue, launch, prior experiment | Use it to test whether the result is decision-relevant, not to reopen portfolio selection. |

## Prove shipping state

| State | Evidence |
| --- | --- |
| Proposed | PR or patch exists and names an intended outcome. |
| Merged | Target branch contains the merge commit. |
| Exposed | Deployment/version plus flag state, audience targeting, rollout start, or another credible exposure record. |
| Measured | Outcome evidence covers the exposed audience after the expected lag. |

Useful Novus capabilities include goal, launch, flag, artifact, signal, and related-artifact reads. Use GitHub or deployment context to fill merge and release gaps. Never promote a later state from an issue status alone.

## Verify measurement

Use `verify-instrumentation` for the measured Page, Feature, Track Event, funnel, journey, goal, or affected flow. Relevant Novus capabilities may include:

- `getRawEvents` or recording controls for event arrival;
- Data Validation event-to-artifact matching when exposed by the host;
- `listArtifactsByType`, `getArtifact`, `getExternalIds`, and `getEventProperties` for definitions and sync state;
- funnel, journey, page, feature, track-event, retention, guide, agent, and app metrics for outcomes;
- account, visitor, segment, and top-user reads for audience validation.

Preserve the instrumentation verdict, checked surface, window, evidence, and repair requirement. Do not silently combine renamed events or redefine a funnel to make the result look complete.

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
- A recent exposure normally yields `TOO EARLY`.
- An untagged funnel step yields a measurement problem, not 0% customer behavior.
- A guardrail failure can make an otherwise positive result `PARTIAL` or `DID NOT WORK`.
- Several summaries of one underlying source are one source.
