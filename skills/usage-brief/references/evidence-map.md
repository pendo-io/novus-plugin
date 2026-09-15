# Usage Brief evidence map

Novus tool prefixes vary by host. Resolve available capabilities by suffix, such as `getArtifactMetrics`. Fetch only evidence that informs current usage, the proposed benefit, or its measurement.

## Resolve surfaces and intent

| Need | Preferred evidence | Interpretation |
| --- | --- | --- |
| Surface | `listArtifactsByType`, `getArtifact`, product-area membership, PR/diff/issue | Match the customer behavior, not only a filename or title. |
| Metric identity | `getExternalIds`, `getFilterVocabulary`, event definitions | Resolve IDs and confirm semantics before comparing data. |
| Access and exposure | flags, deployment/version, targeting, upstream workflow | Establish who can encounter it; flag existence alone is insufficient. |
| Intended benefit | caller context, issue, goal, relevant product/leadership decision | Preserve the intended audience and current strategy, including future needs. Mark inferred intent. |

## Usage and outcome evidence

| Question | Capabilities when available | Interpretation |
| --- | --- | --- |
| Reach and trend | `getArtifactMetrics`, app usage, weekly data | Unique customer users/accounts in comparable windows. Keep active-app reach separate from eligible adoption. |
| Eligibility | segments, targeting, upstream workflow metrics | Match numerator and denominator by unit, window, and access. Do not invent the eligible base. |
| Who benefits | `getArtifactTopUsers`, account activity, reliable exclusion filters | Account concentration and customer cohorts; do not infer customer identity from a name alone. |
| Successful completion | `getFunnelAnalysis`, completion events | Use the relevant workflow and required steps, not general activity. |
| Repeat value | `getRetentionCohorts`, `getPageRetention`, `daysActive` | Match follow-up opportunity and the task's natural frequency. A weekly aggregate is not cohort retention. |
| Efficiency or reliability | verified time-to-complete, errors, retries, operational evidence | Less activity can be good when the task still completes reliably. Do not invent telemetry the host lacks. |
| Customer problem | `listSignals`, replay, available feedback or linked issues | Check whether the proposed change addresses the observed problem. Qualitative evidence alone does not establish prevalence. |

## Measurement trust

Reuse a current `verify-instrumentation` verdict or run it when available. Otherwise check event arrival, artifact recognition, semantic definition, continuity, audience fit, and required flow coverage with available raw events, artifact/ID definitions, targeting, and funnel evidence. Carry `TRUSTED`, `DEGRADED`, `UNTRUSTED`, or `UNKNOWN` for decision-critical measures. Do not infer trust from aggregates.

Check visitor/account-ID migrations, renamed events, changed organization definitions, and release boundaries before interpreting growth or retention. If a migration splits one person into several identities, affected unique counts and new/returning measures are not comparable without a verified reconciliation. Use comparable post-migration windows or say the trend is unavailable. Do not assume account metrics remain valid when account identity also changed.

A genuinely low-use surface may have limited demand or exposure rather than high opportunity. Missing events, warnings, or an absent artifact are evidence gaps. Confirm a meaningful need and reachable audience before estimating potential. Never infer a usage ceiling or target from a low count alone.

## Comment target

Prefer the PR for the current branch, then its linked Linear/Jira issue through a native or direct connector. Resolve the exact target and show the exact comment. Post only after confirmation. If neither target resolves, provide the brief for manual use.
