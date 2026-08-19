---
name: whats-next
description: Use when a builder asks what to build next, whether to finish, continue, narrow, pause, or switch current engineering work, what to defer, or when an autonomous coding agent must steer among bounded work options. Not for team-level portfolio allocation or designing an experiment for an already selected outcome.
---

# What's Next

Recommend one evidence-backed next move for a builder. Start from current engineering work, then tell a simple engineering story: where the team is investing, where customers are struggling, which goal matters, and what smallest next slice closes that gap. Compare it with the strongest credible alternative and answer in plain language: what to finish, what to build next, what to defer, and when to reassess.

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
- Do not downgrade a candidate or claim customer impact from an untrusted measurement. Assign an explicit instrumentation-trust verdict and apply exposure and impact gates when the decision depends on behavioral or post-ship evidence.

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

Include the current objective and the strongest credible alternatives surfaced by contextual Novus signals, active goals, the connected roadmap, and delivery context. Prefer signals tied to the current product area, a directly related goal, or a surface the builder already owns; do not treat the subscription-wide signal list as a generic backlog. Mark each candidate:

- `current-scope` for a reversible continuation, narrowing, pause, or validation step inside the assignment;
- `explicit-choice` when the caller authorized choosing among named or clearly bounded tasks;
- `recommend-only` when evidence surfaced it without execution authority.

Use one application and the most recent complete 30 days for customer experience unless the caller supplies another window. Do not merge applications.

When a signal describes a problem without a ticket, keep it as `recommend-only` unless the caller authorized choosing new work. Compare its severity and customer risk with the assigned backlog instead of dropping it merely because Linear or Jira has no matching issue.

### 3. Gather decision evidence

Read [references/evidence-map.md](references/evidence-map.md). Build a bounded snapshot for the current objective and strongest alternatives. Reason in this order:

1. **Goal:** what outcome the team has said matters.
2. **Signal:** what issue or opportunity Novus found on that goal, product area, or owned surface.
3. **Customer experience:** the concrete frustration, failed flow, feedback theme, or affected reach behind the signal.
4. **Delivery:** what is assigned, in flight, reviewable, or already shipped.

Then preserve the evidence layers separately:

- **Planned:** active issue, project, initiative, priority, cycle, or explicit instruction.
- **Built:** scope, complexity, rework, maintenance/feature/platform classification, and connected completed work.
- **Experienced:** customer burden, adoption, friction, feedback, affected reach, and outcome trend.
- **Shipping:** proposed, merged, exposed, and measured state for material changes.

Start with Novus signals when they already join these layers. Deepen only the strongest one to three candidates. Use the signal to explain the customer problem in concrete language; do not repeat a vague severity label when feedback, replay, funnel, or usage evidence can say what customers are actually experiencing. Repository context identifies work; it does not establish customer value.

Build one comparable evidence card for each finalist before choosing:

- the exact candidate objective and owned surface;
- goal relationship: `direct`, `proxy`, `conflict`, `unrelated`, or `unavailable`;
- candidate-specific Experienced evidence and its trusted window;
- Planned, Built, and shipping state, including whether the proposed fix already exists;
- execution authority and the smallest decision-relevant evidence gap.

Give the current objective and strongest alternative comparable depth. Evidence counts for a candidate only when its source directly names that objective, its artifact, its customer flow, or the same owned surface with a defensible mechanism. Subscription-wide activity, an unrelated goal, and a signal from another product area are context, not candidate evidence.

Apply the product-evidence sufficiency gate:

1. Frame the product question that would distinguish each candidate, then query the narrowest behavior, feedback, support, replay, or operational evidence that answers it.
2. Reconcile product evidence with delivery before using the verb **build**. If a matching PR or implementation already exists, put it under **Finish first** and identify the next unmet product gap separately.
3. A new **Build next**, START, or SWITCH requires one trusted candidate-specific Experienced source plus either a relevant active goal or a concrete customer/operational problem that defines a provisional outcome. Critical security, reliability, data-loss, or irreversible harm remains an exception.
4. If product evidence does not distinguish the candidates, choose only a safe finish, continuation, narrowing, or validation move. Do not manufacture a product rationale for PR hygiene.
5. Classify the decision basis as `product-led`, `customer-led`, `continuity-led`, or `validation-led`. Use `product-led` only when trusted behavioral evidence materially changes the order; use `customer-led` when mapped feedback, support, or customer need does. State the other two honestly when delivery continuity or an evidence repair decides the move.

The recommendation must make Novus's contribution visible:

- **Build next** must name the contextual signal or customer/product evidence that makes the slice worth doing, plus the goal it advances or the provisional outcome used when no goal fits.
- **Do not start yet** must name the goal, signal, customer evidence, or delivery fact that makes the deferred candidate weaker now, and the exact condition that would change that decision.
- When no relevant signal exists, say so plainly and lower confidence in the product-value comparison. Do not substitute a generic subscription-wide signal.
- When no saved goal fits, let the strongest trusted customer-friction or product-opportunity signal define a provisional outcome. Do not let “no goal” reduce the decision to PR hygiene alone.

Before interpreting a behavioral zero, conversion, adoption trend, or post-ship movement that could change the choice:

1. Assign `TRUSTED`, `DEGRADED`, `UNTRUSTED`, or `UNKNOWN` after checking live arrival, artifact matching, definitions, continuity, audience, and required flow coverage with available Novus evidence.
2. Treat `UNTRUSTED` as an evidence defect, not negative customer behavior. Treat `UNKNOWN` as a confidence limit.
3. For claims that a shipped candidate worked, failed, or deserves expansion, verify exposure, elapsed outcome window, measurement trust, outcome movement, guardrails, and plausible competing changes. Otherwise stop at proposed, merged, exposed, or descriptive movement.

Carry forward the verdict, scope, window, and material limitation without expanding this skill into a full instrumentation or post-release audit.

Use saved goals as strategic evidence:

1. Read the full active goal artifacts and their related product areas, launches, signals, metrics, issues, and PRs; a list of goal titles is not goal coverage.
2. Collapse duplicates and flag elapsed targets, missing measurement, conflicting definitions, and goals with no current relationship before ranking candidates.
3. Prefer direct goal relationships over product-area adjacency, and product-area adjacency over keyword similarity. Keyword similarity alone is `unrelated`.
4. Record whether each candidate directly advances, plausibly proxies, protects, conflicts with, or is unrelated to an active goal, and cite the relationship that supports the classification.
5. Treat a goal as evidence of intended investment, not proof that the current implementation is valuable or working.
6. When no saved goal fits, use a provisional outcome grounded in candidate-specific customer or operational evidence; do not invent a target.

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

Write like one engineer handing work to another. Start with `# <Builder>'s next steps` when a named builder is in scope, or `# Your next steps` when speaking directly to the builder. Follow it with one short paragraph that states the order and the concrete reason before any section heading. Then use **Do this next**, **Why this order**, **Validate now**, and **Reassess later**. Use concrete surface and failure names, keep paragraphs short, and link stable IDs inline. Avoid strategy-deck language such as “seam,” “mismatch,” or “investment thesis” when “customers cannot complete X” or “Y fails after Z” is available.

Keep the decision basis internally exact, but translate it for the builder as a natural sentence such as `This is a customer-led call.` Do not expose `Decision basis:` or other schema-like labels in an advisory response.

Name an exact reassessment duration only when expected lag, traffic, experiment design, or a configured measurement window supports it. Otherwise use the next named planning checkpoint or the observable condition that starts a complete measurement window.

When an implementation plan already exists for the selected slice, state the highest-risk assumption and the smallest pre-code check needed to validate the mechanism. A selected objective is not proof that its proposed mechanism is sound.

### 6. Respond or record

Read [references/output-contract.md](references/output-contract.md) immediately before writing.

In advisory mode, return the human response from [references/output-contract.md](references/output-contract.md) and stop. Do not write a JSON record.

In autonomous steering mode, write the exact version 2 record to `whats-next-decision.json`. Resolve the validator from this skill directory and run:

    node <skill-directory>/scripts/validate-steering-decision.mjs <decision-file>

Require exit code 0 and preserve the exact success line `Decision record is valid.` Do not change an internal plan until the record is valid. Apply only an authorized plan change when a plan mechanism exists.

Lead the human response with the plain-language action, not the formal state or validation machinery. Report external-action status naturally, for example: “This is a recommendation; I changed no code, issues, or PRs.”

When the selected move needs an engineering experiment, rollout, or measurement contract, offer a compact implementation handoff using the fields in [references/output-contract.md](references/output-contract.md). Do not generate the full experiment brief unless the caller requests it.

## Degraded behavior

- **Novus unavailable:** allow current-scope CONTINUE, NARROW, PAUSE, or validation when engineering context is strong; never SWITCH from repository activity alone.
- **No Linear/Jira path:** say roadmap intent is unavailable. Use explicit instructions and linked issue/PR provenance already present in Novus or GitHub. Allow safe current-scope continuation, narrowing, pausing, or validation; never START or SWITCH from repository activity alone. ESCALATE if missing roadmap intent changes the choice.
- **GitHub unavailable:** lower shipping and current-work confidence; do not infer merge or exposure from issue state.
- **Broken analytics:** name the smallest exact instrumentation repair and observed proof. Apply it only when authorized and inside current scope; otherwise keep it proposed.
- **Conflicting current work:** ESCALATE with one focused question when the ambiguity changes the choice.
- **No material mismatch:** CONTINUE.
- **Tool failure:** retry once, then proceed only if the remaining evidence meets the chosen state's burden.

## Scope boundary

Do not use this skill for a broad “are we investing in the right product areas?” portfolio review, generic roadmap summaries, individual performance evaluation, automatic backlog management, code implementation, deployment decisions, or detailed experiment design. Use `build-investment` for portfolio allocation.
