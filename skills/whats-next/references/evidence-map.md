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

### Comparable candidate card

Complete this internal card for the current objective and each finalist before choosing. Do not show it verbatim unless the comparison is otherwise hard to follow.

| Field | Required judgment |
| --- | --- |
| Objective | Exact outcome and owned surface; preserve stable issue, PR, signal, goal, and artifact IDs. |
| Goal fit | `direct`, `proxy`, `conflict`, `unrelated`, or `unavailable`, with the relationship that proves it. |
| Experienced | Narrow behavior, feedback, support, replay, or operational evidence that is specific to this candidate. |
| Trust | Instrumentation or impact verdict when required, plus exact app/window and material limitation. |
| Delivery | Planned, Built, and proposed/merged/exposed/measured state; identify an existing implementation before saying **build**. |
| Authority | `current-scope`, `explicit-choice`, or `recommend-only`. |
| Sufficiency | `sufficient`, `partial`, or `missing` for making a product-value comparison. |

Evaluate finalists to comparable depth. A detailed delivery history for the current objective cannot beat a lightly investigated alternative by default, and a rich product signal for an alternative cannot erase nearly finished work without comparing switching cost.

Evidence maps to a candidate only when the source directly names its objective, artifact, flow, customer problem, or the same owned surface with a defensible mechanism. App-wide usage is candidate evidence only for an app-wide acquisition, engagement, or retention objective. Otherwise it is context and must not influence rank.

Before recommending **build**, search issue and shipping evidence for the same outcome. Existing implementation moves to **Finish first**; the next build must address a remaining product gap rather than duplicate the proposed fix.

### Goal hygiene

Do not treat the presence of active goals as alignment:

1. Open the full goal and direct relationships; titles alone are insufficient.
2. Collapse duplicate goals with the same outcome and population.
3. Flag elapsed target dates, missing baselines or measures, contradictory targets, and orphaned goals.
4. Classify candidate fit as `direct` only with an explicit relationship, shared metric, or named outcome. Use `proxy` only when the mechanism and population match. Product-area or keyword overlap alone is `unrelated`.
5. If every goal is unrelated or unusable, say `No usable linked goal` and require candidate-specific customer or operational evidence for a provisional outcome.

### Signal and customer problem

Use signals as the bridge between product evidence and an executable engineering choice:

1. Prefer signals directly related to an active goal, the current product area, or the builder's owned surface.
2. Classify each as an actionable **issue** or **opportunity**. Do not turn descriptive movement into work by itself.
3. Open the strongest signals and extract the concrete customer symptom: what users tried to do, where they failed or became frustrated, who was affected, and what the product data shows.
4. Compare the signal's severity, reach, and risk with active backlog candidates. A signal without a ticket can justify a recommendation, but not execution authority.
5. Use qualitative feedback, support context, session replay, and agent conversations to explain frustration in customer language. Preserve source IDs and avoid broad claims such as “customers are unhappy” when the evidence supports a narrower statement.

If no contextual signal exists, record that gap. Do not use an unrelated high-priority signal merely to make the recommendation look product-informed.

A single customer request can justify a bounded customer-led fix when it maps directly to the candidate and the scope matches the request. It does not establish broad demand, adoption, or strategic priority. Preserve that distinction in confidence and scope.

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

Before querying, write the distinguishing question in plain language, for example: `Are customers failing to complete payment retries often enough that this should interrupt onboarding cleanup?` Prefer evidence that answers that question. Omit metrics that cannot change the order.

Generic active visitors, accounts, or event volume establish that the app is used. They do not establish demand for a specific MCP tool, CLI flow, metadata field, or UI change. Likewise, a signal or metric from another product area cannot fill a candidate's Experienced slot.

For decision-critical behavioral evidence, assign an explicit instrumentation verdict after checking arrival, recognition, definition, continuity, audience, and required flow coverage rather than inferring trust from the presence of an artifact or dashboard. For a claim that shipped work succeeded or failed, apply exposure, elapsed-window, trusted-measurement, outcome, guardrail, and competing-change gates. Preserve the verdict and checked window with the evidence record.

## Efficient query order

1. Resolve current work and prior decision.
2. Resolve one app, window, integrations, and capability map.
3. Read active goals and direct relationships to the current surface.
4. Pull contextual signals for those goals, the current product area, and the builder's owned surface.
5. Deepen the strongest signals with concrete customer frustration, reach, feedback, replay, funnel, or usage evidence.
6. Build the current objective plus strongest credible alternatives, including signal-backed work that has no ticket.
7. Complete comparable candidate cards and identify the narrow product question that separates them.
8. Deepen only the strongest one to three with candidate-specific Experienced, issue, PR, and shipping evidence.
9. Reconcile whether the proposed product fix already exists before naming a new build.
10. Verify measurement or prior impact only for evidence capable of changing the choice.
11. Verify the selected move against the strongest alternative, usable active goals, and goal conflicts.
12. Classify the decision basis and execution authority; preserve deferred work.

## Evidence honesty

- No events is not proof of no use; inspect instrumentation warnings.
- Untagged steps are measurement gaps, not real 0% conversion.
- Timing is not causality; label post-ship movement as a hypothesis unless rollout and competing changes support more.
- Recent ships need an outcome window.
- Apply reliable internal/test filters or disclose that they were unavailable.
- Without roadmap coverage, say intent is unconfirmed.
- Repository context identifies work; it does not prove value.
- App-wide usage is context unless the candidate objective is app-wide; it does not satisfy candidate-specific product evidence.
- A goal list is not goal alignment; open relationships and reject duplicates, elapsed targets, and unrelated goals.
- Customer evidence must map to the candidate's surface and scope before it can change rank.
- A saved goal proves strategic intent, not implementation impact or causality.
- A `TRUSTED` instrumentation verdict proves fitness for its stated decision, not causality; post-ship claims still require exposure, timing, outcome, guardrail, and competing-change checks.
- Preserve issue keys, PR numbers, artifact IDs, metric windows, and links.
