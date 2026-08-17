---
name: whats-next
description: Use when a builder asks what to build next, whether to finish, continue, narrow, pause, or switch current engineering work, what to defer, or when an autonomous coding agent must steer among bounded work options. Not for team-level portfolio allocation or designing an experiment for an already selected outcome.
---

# What's Next

Recommend one evidence-backed next move for a builder. Start from current engineering work, compare it with the strongest credible alternative, and answer in plain language: what to finish, what to build next, what to defer, and when to reassess.

## Choose the operating mode

- **Advisory mode is the default.** Use it when a person asks for a recommendation. Return the plain-language decision; do not write a decision file, alter a plan, or expose control-state machinery.
- **Autonomous steering mode is conditional.** Use it only when an autonomous agent must persist or change its internal plan, or the caller explicitly requests a durable steering record. Read [references/autonomous-steering.md](references/autonomous-steering.md) and use the validated decision record in this mode.

Advice never grants execution authority. Either mode may recommend work; only the surrounding task can authorize implementation or external mutations.

## Operating rules

- Use real evidence. Never invent roadmap intent, customer pain, metrics, shipping state, or causality.
- Keep Linear, Jira, GitHub, Novus, code, deployments, and production read-only unless the surrounding task separately authorizes a mutation.
- Control only the running agent's internal plan. Discovery permits evaluation, not execution.
- Never assess individual productivity or use lines, commits, PR counts, or hours as value proxies.
- Prefer continuity when evidence is close. Do not abandon in-flight work casually.
- Distinguish proposed, merged, exposed, and measured work.
- Account for rollout lag, broken instrumentation, and internal/test traffic.
- Do not downgrade a candidate or claim customer impact from an untrusted measurement. Consume a current `verify-instrumentation` or `verify-impact` verdict when the decision depends on that evidence.

## Workflow

### 1. Resolve current work

In autonomous steering mode, read [references/autonomous-steering.md](references/autonomous-steering.md) before gathering evidence.

Inspect in order:

1. the caller's task and terminal condition;
2. the active plan and in-progress step;
3. assigned or linked issues and pull requests;
4. branch, worktree, diff, and changed capability;
5. relevant conversation and recent commits.

One explicit assignment is sufficient; otherwise require two compatible sources. A branch name or recent activity alone is weak evidence. State the inferred objective in outcome language with stable source IDs and confidence. Ask one plain-language question only when competing interpretations would change the decision.

In autonomous steering mode, read an existing `whats-next-decision.json` when present. For backward compatibility, also read `build-alignment-decision.json`. Treat prior records as stability evidence, not product truth. In advisory mode, use a prior record only when it is already available and materially relevant; do not create one.

### 2. Build a bounded candidate set

Include the current objective and the strongest credible alternatives surfaced by Novus, the connected roadmap, and delivery context. Mark each candidate:

- `current-scope` for a reversible continuation, narrowing, pause, or validation step inside the assignment;
- `explicit-choice` when the caller authorized choosing among named or clearly bounded tasks;
- `recommend-only` when evidence surfaced it without execution authority.

Use one application and the most recent complete 30 days for customer experience unless the caller supplies another window. Do not merge applications.

### 3. Gather decision evidence

Read [references/evidence-map.md](references/evidence-map.md). Build a bounded snapshot for the current objective and strongest alternatives:

- **Planned:** active issue, project, initiative, priority, cycle, or explicit instruction.
- **Built:** scope, complexity, rework, maintenance/feature/platform classification, and connected completed work.
- **Experienced:** customer burden, adoption, friction, feedback, affected reach, and outcome trend.
- **Shipping:** proposed, merged, exposed, and measured state for material changes.

Start with Novus signals when they already join these layers. Deepen only the strongest one to three candidates. Repository context identifies work; it does not establish customer value.

Before interpreting a behavioral zero, conversion, adoption trend, or post-ship movement that could change the choice:

1. **REQUIRED SUB-SKILL:** Use `verify-instrumentation` for that surface when no current verdict exists and the capability is available. Otherwise apply its four verdict labels from the available evidence and disclose partial coverage.
2. Treat `UNTRUSTED` as an evidence defect, not negative customer behavior. Treat `UNKNOWN` as a confidence limit.
3. Use `verify-impact` for claims that a shipped candidate worked, failed, or deserves expansion. Without a qualifying verdict, stop at proposed, merged, exposed, or descriptive movement.

Do not recreate either full workflow inside this skill. Carry forward its verdict, scope, window, and material limitation.

Use saved goals as strategic evidence:

1. Read active goal artifacts and their related product areas, launches, signals, metrics, issues, and PRs.
2. Prefer direct goal relationships over keyword similarity.
3. Record whether the current objective advances, protects, conflicts with, or is unrelated to an active goal.
4. Treat a goal as evidence of intended investment, not proof that the current implementation is valuable or working.
5. When no saved goal fits, use a provisional outcome grounded in customer or operational evidence; do not invent a target.

For this skill, a goal is a constraint and tie-breaker—not a command to abandon authorized work. A direct goal relationship may strengthen an evidence-backed candidate, but it cannot create execution authority or outweigh critical customer harm, delivery reality, or missing measurement by itself.

Resolve planning sources without assuming one integration path:

1. Check Novus-native Linear/Jira availability with `listConnectedIntegrations`.
2. Check whether direct Linear or Jira connector tools are available to the customer's coding agent.
3. When both are available, use Novus-native issue provenance as the product-evidence join and direct connectors for material assignee, cycle, project, initiative, or status gaps. Treat matching records as one source, not independent corroboration.
4. When only one path is available, use it fully.
5. When neither path is available, mark roadmap intent unavailable. Continue, narrow, pause, or validate current-scope work only when engineering and customer evidence is strong; never START or SWITCH from repository activity alone.

### 4. Choose one move

Choose exactly one plain-language move. In autonomous steering mode, map it to START, CONTINUE, NARROW, PAUSE, SWITCH, or ESCALATE using [references/autonomous-steering.md](references/autonomous-steering.md). SWITCH and START require at least two independent product-evidence layers and sources. A critical security, reliability, data-loss, or irreversible-harm finding may justify PAUSE or ESCALATE alone.

Respect authority. Apply a SWITCH only to an `explicit-choice` candidate. A recommend-only replacement remains proposed. Preserve deferred work with a resume condition.

### 5. Separate the sequence

When applicable, identify:

- **Finish first:** an existing PR, review, or validation gate—not the next build.
- **Build next:** exactly one bounded implementation or investigation slice.
- **Do not start yet:** named deferred work and its resume condition.
- **Validate now:** engineering acceptance checks.
- **Reassess later:** the customer or business outcome window.

State what the slice directly fixes and what broader mismatch remains. Do not imply that a bounded fix resolves the whole product-area problem.

Name an exact reassessment duration only when expected lag, traffic, experiment design, or a configured measurement window supports it. Otherwise use the next named planning checkpoint or the observable condition that starts a complete measurement window.

When an implementation plan already exists for the selected slice, consume a current `stress-test-plan` verdict or offer that skill as the pre-code gate. A selected objective is not proof that its proposed mechanism is sound.

### 6. Respond or record

Read [references/output-contract.md](references/output-contract.md) immediately before writing.

In advisory mode, return the human response from [references/output-contract.md](references/output-contract.md) and stop. Do not write a JSON record.

In autonomous steering mode, write the exact version 2 record to `whats-next-decision.json`. Resolve the validator from this skill directory and run:

    node <skill-directory>/scripts/validate-steering-decision.mjs <decision-file>

Require exit code 0 and preserve the exact success line `Decision record is valid.` Do not change an internal plan until the record is valid. Apply only an authorized plan change when a plan mechanism exists.

Lead the human response with the plain-language action, not the formal state or validation machinery. Report external-action status naturally, for example: “This is a recommendation; I changed no code, issues, or PRs.”

When the selected move needs an engineering experiment, rollout, or measurement contract, offer a handoff to `goal-to-experiment`. Preserve the handoff fields defined in [references/output-contract.md](references/output-contract.md). Do not invoke the downstream skill automatically unless the caller requests the experiment brief.

When the caller is ready to implement an existing plan, offer `stress-test-plan`. After verified exposure and the outcome window, route “did it work?” to `verify-impact`. These are lifecycle gates, not additional competing recommendations.

## Degraded behavior

- **Novus unavailable:** allow current-scope CONTINUE, NARROW, PAUSE, or validation when engineering context is strong; never SWITCH from repository activity alone.
- **No Linear/Jira path:** say roadmap intent is unavailable. Use explicit instructions and linked issue/PR provenance already present in Novus or GitHub. Allow safe current-scope continuation, narrowing, pausing, or validation; never START or SWITCH from repository activity alone. ESCALATE if missing roadmap intent changes the choice.
- **GitHub unavailable:** lower shipping and current-work confidence; do not infer merge or exposure from issue state.
- **Broken analytics:** use `verify-instrumentation` to name the smallest exact repair and proof. Apply it only when authorized and inside current scope; otherwise keep it proposed.
- **Conflicting current work:** ESCALATE with one focused question when the ambiguity changes the choice.
- **No material mismatch:** CONTINUE.
- **Tool failure:** retry once, then proceed only if the remaining evidence meets the chosen state's burden.

## Scope boundary

Do not use this skill for a broad “are we investing in the right product areas?” portfolio review, generic roadmap summaries, individual performance evaluation, automatic backlog management, code implementation, deployment decisions, or detailed experiment design. Use `build-investment` for portfolio allocation and `goal-to-experiment` after the next move is selected.
