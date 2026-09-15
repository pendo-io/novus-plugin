# Build Investment evidence map

Novus MCP tool names are namespaced differently by each host. Match on the tool-name suffix, such as `listSignals`, rather than the full identifier.

## Begin with coverage

| Need | Preferred capability | Guidance |
| --- | --- | --- |
| Resolve the application | `listApps` | Do not combine apps. |
| Check roadmap sources | `listConnectedIntegrations` | Distinguish connected, expired, missing, and tool failure. |
| Establish product areas | `listProductAreas`, `getProductAreaMembers`, `getMemory` | Use product areas and product-wiki memory as the normalization spine. |
| Establish strategic goals | `listArtifactsByType` for goals, `getArtifact`, `getRelatedArtifacts` | Map goals to product areas, launches, signals, metrics, issues, and PRs. |
| Find goals, launches, and tracked surfaces | `listArtifactsByType`, `getArtifact`, `getRelatedArtifacts` | Useful artifact types include goals, launches, pages, features, track events, funnels, journeys, and product wikis. |

## Planned layer

Start with the active goal portfolio. Record each goal's outcome, target or direction, deadline, related artifacts, current trajectory, and measurement quality. Treat a saved goal as evidence of strategy, not evidence that the investment is paying off.

Also read caller-supplied strategy and the relevant initiative documents or recent product/leadership decisions available through connected sources. Bound retrieval to the portfolio question and any period the caller specifies. Record strategic changes, intended future customers, superseded targets, effective dates, and fixed release commitments. A stale issue date is weaker evidence of current priority than an explicit current decision. If sources conflict, show the conflict rather than silently picking the plan that supports the recommendation.

Low use by current customers cannot by itself invalidate investment for a new audience. Preserve the strategic hypothesis and identify evidence that would test it. If the caller corrects missing context, revise the conclusion and explain the change without claiming persistent memory or rewriting planning records.

Resolve Linear or Jira roadmap access before querying:

1. Call Novus `listConnectedIntegrations` to discover native Jira or Linear connections. Treat expired or reauthentication-required connections as unavailable.
2. Inspect the coding agent's available tools for direct Linear or Jira connectors.
3. When both paths exist, use Novus-native issue provenance to preserve joins to goals, signals, launches, artifacts, and product areas. Use direct connectors for richer or fresher state, estimate, cycle, project, initiative, and relationship detail when it can change the conclusion.
4. Deduplicate matching records by stable issue ID or key. They are one planning fact reached through two paths, not two independent sources.
5. When only one path exists, use it fully.
6. When neither path exists, mark Planned coverage unavailable. Compare Built with Experienced, but say `cannot confirm this is on the roadmap` and do not infer planned investment from repository activity.

Use the resolved path in this order:

1. `searchIssues` for product-area names, known initiatives, goals, and high-confidence synonyms.
2. `fetchIssue` for state, priority, estimate, assignee/team, cycle, labels, description, and parent relationships.
3. `getInitiativeForIssue` when initiative or project intent is material.
4. Direct Linear/Jira connectors to fill material gaps, or as the primary path when no Novus-native connection exists.

Avoid sweeping keyword searches across the entire tracker. Search the normalized capability map and the strongest customer problems. A title match alone does not prove alignment.

Treat backlog, planned, in-flight, completed, and canceled work distinctly. Never count a stale backlog item as active investment.

## Built layer

Start with `listSignals` and `getSignal`. Signals often already join product area, pull request, file path, UX review, usage, funnel, and customer impact.

Use direct GitHub capabilities only when they materially improve the decision:

- merged pull requests inside the analysis window;
- linked issues and initiatives;
- changed capabilities or code surfaces;
- feature, maintenance, bug, platform, reliability, or instrumentation classification;
- evidence of interrupt work, rework, or an unresolved review finding;
- merge and rollout timing needed for outcome analysis.

For each decision-relevant PR, record:

- **proposed:** PR URL, state, draft status, mergeability, and intended outcome;
- **merged:** merge commit and merge time;
- **exposed:** rollout, deployment, flag, version, or other credible exposure evidence;
- **measured:** matched outcome, baseline, comparison window, and competing-change caveats.

If a later state is unavailable, stop the trail at the last verified state. Do not infer exposure from merge or measurement from exposure.

The active checkout may be a feature branch based on another feature branch. Verify the target branch and release separately; include unreleased scope as planned/in-flight work, not realized customer impact. Group linked changes by the customer job they enable. A current Build Value report can supply that mapping when its scope and evidence still apply.

Estimate effort with relative scope/complexity bands and delivery context. Never use raw PR count, commits, lines changed, or individual activity as productivity or investment.

## Experienced layer

| Question | Preferred capabilities |
| --- | --- |
| What problems or opportunities are already synthesized? | `listSignals`, `getSignal` |
| What is used and adopted? | `getArtifactMetrics`, `getPageMetrics`, `getFeatureMetrics`, `getTrackEventMetrics`, `getAppUsageMetrics` |
| Where do users fail or abandon? | `getFunnelAnalysis`, `getFunnelAnalytics`, `getJourney` |
| Do users return? | `getPageRetention`, `getRetentionCohorts` |
| Is frustration observable? | `listReplays`, `getSessionReplayEvents`, `listUxReviews` |
| What do users say? | `getGuideFeedback`, `getNps`, `listAgentIssues`, `clusterAgentConversations`, `getAgentConversations` |
| Who and how many are affected? | `listAccounts`, `listVisitors`, `getArtifactTopUsers`, `getAccountActivityOnArtifact` |
| What instrumentation exists? | `listArtifactsByType`, `getExternalIds`, `getEventProperties`, `getRawEvents` |

Use the narrowest metric that answers the investment question. Do not narrate every available metric.

Use successful completion, reduced effort, time, errors, or reliability when those reflect the intended benefit better than activity growth. Check which customer jobs UI, agent, and MCP investments serve, and whether common capabilities support several of them. Do not double-count overlapping customer groups.

Check visitor/account-ID migrations and changes to organization or event definitions. Exclude affected before/after growth and retention comparisons without a verified reconciliation or stable comparable windows. Do not assume account continuity from visitor continuity, or the reverse. A caveat after an invalid growth headline does not make the recommendation evidence-based.

Attach an explicit `TRUSTED`, `DEGRADED`, `UNTRUSTED`, or `UNKNOWN` instrumentation verdict to every behavioral measure capable of changing allocation. For material claims that shipped work paid off or failed, verify exposure, elapsed outcome window, trusted measurement, outcome movement, guardrails, and competing changes. Several metrics derived from one untrusted artifact do not become trustworthy through repetition.

## Efficient query order

1. Resolve app, window, connected integrations, product areas, and wiki context.
2. Map active goals to product areas, launches, metrics, issues, and PRs.
3. Pull a bounded set of recent, high-value signals across the portfolio.
4. Inventory active initiatives/projects and recently completed work by normalized product area.
5. Build a provisional goal/planned/built/experienced comparison.
6. Verify measurement and prior impact only for evidence capable of changing the portfolio conclusion.
7. Deepen only the strongest one to three investment questions with metrics, issue detail, PR evidence, audience, feedback, or relevant strategic decisions.
8. Verify whether to sustain, increase, redirect, reduce, or defer judgment. For a proposed shift, compare real alternatives and movable work; for sustain or defer judgment, do not invent displacement. Respect locked release scope and identify the next open planning decision.

## Evidence honesty

- **No events is not proof of no use.** Check warnings and instrumentation before interpreting zero.
- **Untagged steps are measurement gaps.** Do not render them as real 0% conversion.
- **Correlation is not causation.** Label post-ship movement as a Novus hypothesis unless rollout and competing-change evidence support a stronger claim.
- **Recent ships need an outcome window.** Use `too early to tell` when appropriate.
- **Partial periods distort comparison.** Label or avoid them.
- **Internal/test traffic can dominate small samples.** Apply known filters or disclose that filtering was unavailable.
- **Sparse roadmap coverage changes the question.** Without Linear/Jira, answer where pain and apparent investment diverge; do not claim intent.
- **Stable identifiers matter.** Preserve issue keys, PR numbers, artifact IDs, and links in the evidence ledger.
- **A goal is intent, not impact.** Verify delivery, exposure, and outcome movement separately.
- **A tradeoff is a planning fact, not a rhetorical balancing item.** Name the actual tranche or disclose that displacement is unresolved.
