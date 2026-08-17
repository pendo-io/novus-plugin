# Goal-to-experiment evidence map

Novus MCP tool names are namespaced differently by each host. Match the suffix, such as `listSignals`, instead of the full identifier.

## Bootstrap from the selected outcome and current work

Begin with the saved goal, provisional outcome, portfolio bet, or bounded move supplied by the caller or an upstream skill. Preserve its scope. When no outcome is supplied, use only a directly linked goal or issue/PR outcome; do not rank unrelated goals or choose the portfolio priority here.

Start with the smallest available engineering context:

| Need | Sources | Guidance |
| --- | --- | --- |
| Repository and branch intent | working directory, branch name, diff, untracked files, recent commits | Read changed and nearby files; identify the user or operational behavior affected. |
| Existing work | current PR, issue references, commit messages, `searchIssues`, `fetchIssue` | Reuse relevant work and preserve stable IDs. |
| Product meaning of code | `getMemory`, product wiki, artifact relationships, signals with file or PR provenance | Map files and components to product areas and user journeys. |
| Rollout path | feature-flag code, launch configuration, guides, deployment context | Distinguish merged, deployed, enabled, and exposed. |

Classify the change before looking for a goal: user behavior, reliability, operability, instrumentation, platform enablement, or internal-only work. Internal-only work needs an explicit path to a user or operational outcome.

## Select the relevant goal

| Need | Preferred capabilities |
| --- | --- |
| Application | `listApps` |
| Saved goals and full data | `listArtifactsByType`, `getArtifact` |
| Related surfaces | `getRelatedArtifacts`, `getMemory` |
| Existing synthesized evidence | `listSignals`, `getSignal` |
| Planning coverage | `listConnectedIntegrations`, `searchIssues`, `fetchIssue`, `getInitiativeForIssue` |

Match the selected outcome to a goal in this order:

1. direct goal-to-artifact, issue, launch, or signal relationship;
2. same changed product surface or user journey;
3. same normalized product area;
4. current metric or frustration evidence affecting that surface;
5. keyword similarity alone.

If one goal directly matches, use it. If two remain plausible and would change the experiment, ask one focused question. Do not merge goals or choose between unrelated portfolio priorities.

## Measure the outcome

| Engineer's question | Preferred capabilities |
| --- | --- |
| Did the user outcome move? | `getArtifactMetrics`, `getHeadlineMetrics` |
| Is this page, feature, or event used? | `getPageMetrics`, `getFeatureMetrics`, `getTrackEventMetrics`, `getAppUsageMetrics` |
| Where do users stop? | `getFunnelAnalysis`, `getFunnelAnalytics`, `getJourney` |
| Do users return? | `getPageRetention`, `getRetentionCohorts` |
| Who is affected? | `getArtifactTopUsers`, `getAccountActivityOnArtifact`, `getVisitorActivityForArtifact` |
| Is the metric trustworthy? | `verify-instrumentation`, then `listArtifactsByType`, `getExternalIds`, `getEventProperties`, `getRawEvents` as needed |

The primary outcome answers whether users or the business improved. An early indicator answers whether the code is beginning to work. A must-not-regress measure protects against creating a new failure.

Carry the instrumentation verdict, checked surface, window, and repair into the experiment brief. Prefer existing Novus Page, Feature, Track Event, funnel, journey, and automatic instrumentation coverage. Add net-new manual tracking only when the desired semantic outcome or guardrail cannot be represented by supported coverage.

## Explain why

| Evidence | Preferred capabilities | Engineering use |
| --- | --- | --- |
| PRs, releases, flags, and launches | signal provenance, GitHub, `listFlags`, `getFlag`, launches | Establish exact code, rollout, audience, and exposure timing. |
| Existing work | `searchIssues`, `fetchIssue`, Linear/Jira connectors | Attach the recommendation to current work or explain why new work is required. |
| Replays and UX findings | `listReplays`, `getSessionReplayEvents`, `listUxReviews` | Translate a metric drop into observed user behavior. |
| Feedback and agent problems | `getGuideFeedback`, `getNps`, `listAgentIssues`, `clusterAgentConversations`, `getAgentConversations` | Add failure language, recovery patterns, and user impact. |
| Operational evidence | connected systems or user-provided data | Measure support, incident, investigation, reliability, or delivery outcomes directly. |

Start broad, then deepen the strongest candidate cause. Do not sweep every source.

## Action surfaces

After the action is authorized, use the narrowest surface:

- **Current repository:** code, tests, instrumentation, and local draft documentation.
- **Issue:** `createIssueArtifact` or connected Linear/Jira capability; prefer an existing issue.
- **Guide:** `createArtifact` with `GUIDE`; keep it draft or staged until publication authority is explicit.
- **Flag:** `checkFlagEligibility`, `createFlag`, `updateFlagTargeting`, `setFlagEnabled`; confirm audience and enabled state.
- **Launch:** group rollout work and preserve target date and linked artifacts.

When a tool cannot link the action to the goal, preserve stable IDs and links in the engineering brief.

## Evidence honesty

Label decision-relevant claims:

- **Verified fact:** Direct observation in a named source and window.
- **Correlation:** Measured changes move together; causality remains unproven.
- **Novus hypothesis:** Testable explanation synthesized from evidence.

Use high, medium, or low confidence based on source directness, coverage, consistency, data quality, and competing explanations. Do not fabricate a numeric confidence score.

Before attribution, check merge versus exposure date, target audience, flag percentage, expected lag, overlapping changes, sample size, internal/test traffic, and selector or event changes. No events is not proof of no use.

## Efficient order

1. Resolve the selected goal, provisional outcome, portfolio bet, or bounded move.
2. Inspect current work, classify its effect, and map the surface to that outcome.
3. Read the selected goal, recent signals, metric trend, rollout state, and existing issues.
4. Identify likely Helping, Hurting, and Uncertain drivers.
5. Verify the primary measure and baseline when they can change the experiment.
6. Deepen only evidence capable of changing the engineering move.
7. Verify the winning experiment against the strongest alternative inside the selected outcome.
