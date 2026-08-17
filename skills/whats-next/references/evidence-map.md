# What's Next evidence map

Novus tool prefixes vary by host. Match capability suffixes such as `listSignals`, not full names.

## Start with engineering context

Resolve current work before product queries:

1. explicit task and terminal condition;
2. in-progress plan step;
3. assigned or linked issues and PRs;
4. branch, worktree, diff, and changed capability;
5. relevant conversation and recent commits.

Preserve stable IDs and explain why each source supports the inferred objective. One explicit assignment is sufficient; otherwise prefer two compatible sources. Do not use commit volume or file recency as proof of importance.

In autonomous steering mode, read `whats-next-decision.json` when available, falling back to `build-alignment-decision.json` for compatibility. Extract the prior state, thesis, validation date, invalidation condition, deferred work, and material-new-evidence list. In advisory mode, do not create or search for a steering record; use one only when it is already in the active context and materially relevant.

## Resolve product coverage

| Need | Preferred capability | Guidance |
| --- | --- | --- |
| Application | `listApps` | Use one app; do not combine apps. |
| Roadmap availability | `listConnectedIntegrations` | Distinguish connected, expired, missing, and tool failure. |
| Capability context | `listProductAreas`, `getMemory` | Use product areas and memory as the normalization spine. |
| Strategic outcomes | `listArtifactsByType` for goals, `getArtifact`, `getRelatedArtifacts` | Use direct goal relationships before product-area or keyword similarity. |
| Current problems | `listSignals`, `getSignal` | Start with signals that already connect metrics, artifacts, PRs, and findings. |

## Resolve Linear and Jira access

Support either planning path; do not require both:

1. Call Novus `listConnectedIntegrations` to discover native Jira or Linear connections. A connection requiring reauthentication is unavailable and should be reported as such.
2. Inspect the coding agent's available tools for direct Linear or Jira connectors.
3. If both paths exist, use Novus-native issue data to preserve joins to signals, artifacts, launches, and product areas. Use direct connectors for richer or fresher assignee, state, cycle, project, initiative, and relationship detail when it can change the decision.
4. Deduplicate by stable issue key or ID. Two summaries of the same issue are one source, not independent evidence.
5. If only Novus-native access exists, use `searchIssues`, `fetchIssue`, and `getInitiativeForIssue`.
6. If only direct access exists, use the corresponding Linear/Jira search, issue, project, cycle, and initiative capabilities.
7. If neither exists, use explicit task instructions plus issue or PR provenance already embedded in Novus signals, GitHub, the branch, or the conversation. Mark Planned coverage unavailable and phrase the result as `cannot confirm this is on the roadmap`.

Without either Linear/Jira path, repository activity may identify current work but cannot select a new objective. Permit current-scope CONTINUE, NARROW, PAUSE, or validation when customer and engineering evidence is strong. Never START or SWITCH solely from repository activity; ESCALATE when missing roadmap intent would change the choice.

## Candidate evidence

### Planned

Use active assignments and whichever connected planning path is available:

1. `searchIssues` for the current capability and strongest customer problem;
2. `fetchIssue` for status, priority, estimate, assignee/team, cycle, labels, and description;
3. `getInitiativeForIssue` for project or initiative intent;
4. direct Linear/Jira connectors to fill material gaps or serve as the primary path when Novus-native access is unavailable.

Treat backlog, planned, in-flight, completed, and canceled work distinctly. A title match or stale backlog item does not establish active investment.

### Built and shipping

Use issue and GitHub evidence for decision-relevant work only. Record:

- **proposed:** PR, state, draft status, mergeability, and intended outcome;
- **merged:** merge commit and time;
- **exposed:** deployment, flag, version, or other credible exposure evidence;
- **measured:** matched outcome, baseline, comparison window, and caveats.

Stop at the last verified state. Estimate scope with qualitative complexity and delivery context, never raw counts or individual activity.

### Experienced

| Question | Preferred capabilities |
| --- | --- |
| What pain or opportunity is synthesized? | `listSignals`, `getSignal` |
| What is used? | `getArtifactMetrics`, `getAppUsageMetrics` |
| Where do users fail? | `getFunnelAnalysis`, `getFunnelAnalytics`, `getJourney` |
| Is frustration visible? | `listReplays`, `getSessionReplayEvents`, `listUxReviews` |
| What do users say? | `getGuideFeedback`, `getNps`, `listAgentIssues`, `getAgentConversations` |
| Who is affected? | `listAccounts`, `listVisitors`, `getArtifactTopUsers` |
| Is measurement complete? | `listArtifactsByType`, `getExternalIds`, `getEventProperties`, `getRawEvents` |

Use the narrowest metric that distinguishes the current objective from the strongest alternative.

## Efficient query order

1. Resolve current work and prior decision.
2. Resolve one app, window, integrations, and capability map.
3. Read active goals and direct relationships to the current surface.
4. Pull a bounded set of current high-value signals.
5. Build the current objective plus strongest credible alternatives.
6. Deepen only the strongest one to three with issue, PR, reach, feedback, or metric evidence.
7. Verify the selected move against the strongest alternative, active goals, and goal conflicts.
8. Classify execution authority and preserve deferred work.

## Evidence honesty

- No events is not proof of no use; inspect instrumentation warnings.
- Untagged steps are measurement gaps, not real 0% conversion.
- Timing is not causality; label post-ship movement as a hypothesis unless rollout and competing changes support more.
- Recent ships need an outcome window.
- Apply reliable internal/test filters or disclose that they were unavailable.
- Without roadmap coverage, say intent is unconfirmed.
- Repository context identifies work; it does not prove value.
- A saved goal proves strategic intent, not implementation impact or causality.
- Preserve issue keys, PR numbers, artifact IDs, metric windows, and links.
