# Stress Test Plan evidence map

Novus MCP tool prefixes vary by host. Match capability suffixes, not full tool names.

## Start with the proposed plan

Use the smallest available artifact: explicit request, plan file, spec, issue, branch, diff, PR description, or architecture note. Preserve stable IDs and distinguish stated requirements from inferred assumptions.

## Find falsifying evidence

| Plan claim | Preferred evidence | Question to answer |
| --- | --- | --- |
| Customers need this | `listSignals`, `getSignal`, feedback, NPS, agent issues/conversations, replays | Is this the observed problem or merely the proposed solution? |
| This surface matters | artifact/app metrics, funnels, journeys, retention, affected accounts/visitors | How many relevant users encounter the problem, and where is the binding constraint? |
| This aligns with strategy | saved goals and related artifacts, launches, initiatives | Does it advance a real outcome without treating the goal as proof? |
| This is not duplicate work | Novus `listConnectedIntegrations`, native issue tools, direct Linear/Jira connectors, GitHub | Does an issue, owner, dependency, prior attempt, or parallel implementation already exist? |
| The mechanism fits the system | repository code, tests, architecture docs, current flags and workflows | What existing state and failure paths must it preserve? |
| We can learn after shipping | `verify-instrumentation`, raw events, artifact definitions, rollout/flag capabilities | Can the outcome and guardrails be observed for the exposed audience? |

## Linear and Jira resolution

1. Check Novus `listConnectedIntegrations` for native Linear/Jira coverage.
2. Inspect direct Linear/Jira tools available to the coding agent.
3. Use Novus-native provenance to join issues to goals, signals, launches, and artifacts.
4. Use direct connectors for fresher issue, project, initiative, cycle, dependency, and relationship detail.
5. Deduplicate by issue ID/key. Two access paths to one record are one source.
6. When neither path exists, state that duplication, ownership, and roadmap intent are unconfirmed.

## Repository checks

Inspect only the plan's likely implementation surface and its immediate callers. Look for:

- state preservation and destructive updates;
- permissions, privacy, accessibility, platform, browser, and mobile differences;
- retries, idempotency, partial failure, rollback, and migration;
- existing abstractions or parallel code paths;
- flags, rollout seams, and exposure evidence;
- tests that reveal the true contract.

Do not convert the stress test into a full architecture or code review.

## Risk ranking

Rank a risk highly when:

- direct evidence contradicts the plan's thesis;
- learning after implementation would be expensive;
- failure can lose data, broaden audience, violate trust, or block the core user path;
- it is a prerequisite that makes the proposed feature unusable;
- it prevents measurement of the intended outcome.

Do not elevate speculative edge cases above a current customer or system failure.

## Evidence honesty

- A Linear/Jira issue proves proposed work, not customer need.
- A goal proves intended outcome, not mechanism quality.
- A flag reduces exposure risk but does not reduce engineering complexity.
- One replay illustrates behavior; it does not establish prevalence.
- Missing events are not evidence of no use.
- Repository activity is not investment or value evidence.
- Preserve source IDs, metric windows, affected audience, and confidence for every plan-changing claim.
