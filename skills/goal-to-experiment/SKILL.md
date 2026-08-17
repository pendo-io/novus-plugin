---
name: goal-to-experiment
description: Use when a saved goal, provisional outcome, portfolio bet, or bounded engineering move has already been selected and needs a reversible experiment, acceptance criteria, instrumentation, rollout, rollback, or an evaluation rule. Not for choosing among portfolio priorities or unrelated next tasks.
---

# Goal to Experiment

Assume the upstream goal or outcome is selected but may be incomplete. Complete its evidence contract, explain the user value in plain language, and return one engineering-ready experiment with acceptance, rollout, rollback, and measurement guidance.

## Operating rules

- Require minimal input. Never require the caller to supply a baseline, target, pace, segment, or product vocabulary when tools or workspace context can resolve it.
- Exhaust read-only discovery before asking a question. Inspect the repository, current work, Novus context, goals, signals, metrics, and connected planning systems first.
- Proceed with the most credible context. State medium-confidence assumptions; do not turn missing data into a blocker.
- Use real evidence. Separate **verified facts**, **correlations**, and **Novus hypotheses**; timing alone does not prove causality.
- Treat broken instrumentation as an evidence problem, not real zero usage.
- Prefer Novus's existing automatic instrumentation and artifact definitions. Never add duplicate manual events for supported Pages, Features, or flows; specify only the mapping, semantic property, or truly unsupported behavior still required.
- Prefer one reversible, high-learning action over a backlog of generic recommendations.
- Translate product language into engineering decisions. Explain each metric by what changed for users and what the engineer should build, test, instrument, or roll back.
- Reuse an existing issue, PR, or workstream before proposing net-new work.
- Keep live-user and external mutations safe. Do not publish guides, widen or enable flags, change targeting, or mutate production state without explicit authority for that action and audience.
- Never invent rollout percentages, lift thresholds, cohort sizes, or fixed durations. Use exact values only when observed traffic, variance, risk, or a named business decision supports them; otherwise make sizing and baseline establishment pre-launch acceptance criteria.

## Minimal-input behavior

| Caller provides | Do this without requesting more input |
| --- | --- |
| A goal or goal ID | Resolve its saved contract and related work. |
| A branch, diff, PR, issue, or file | Map the changed surface to its product area, user journey, active goals, signals, and metrics. |
| A portfolio bet or handoff from `build-investment` | Preserve its selected outcome, tradeoff, protected investments, and invalidation condition; design the smallest experiment that can validate the thesis. |
| A bounded move or handoff from `whats-next` | Preserve its scope, deferred work, authority, and invalidation condition; design acceptance, rollout, rollback, and outcome evaluation. |
| “Does this help users?” | Identify the branch's direct user effect, operational effect, and measurable goal connection. |
| No saved goal, but a selected outcome is supplied | Use the selected outcome provisionally; do not invent a target. |

Use confidence to control behavior:

- **High:** Proceed with the selected goal or outcome.
- **Medium:** Proceed, state the assumption, and name the strongest alternative.
- **Low with a human available:** Ask one focused question only when its answer would materially change the recommended action.
- **Low without a human:** Choose the safest reversible investigation or measurement repair and state what evidence should trigger a different action.

## Workflow

### 1. Resolve the selected outcome and engineering context

Read [references/evidence-map.md](references/evidence-map.md) before querying.

Start from the supplied goal, provisional outcome, portfolio bet, bounded move, or upstream handoff contract. Preserve its exact outcome, constraints, explicitly deferred scope, and invalidation condition. If none is supplied, infer only from a directly linked goal or issue/PR outcome; do not rank unrelated goals or choose among competing product areas. Ask one focused question when no selected or directly linked outcome can be resolved.

If the input is a bounded engineering move, the experiment may narrow it but must not expand beyond it. If the input is only a high-level goal, select the smallest candidate experiment inside that goal and label it as an experiment choice—not a new portfolio decision.

Inspect the current repository, branch, tracked and untracked changes, current PR or issue, tests, and nearby code. Determine:

- the product surface and user workflow affected;
- whether the work changes user behavior, reliability, operability, instrumentation, or only internal structure;
- existing issue or PR intent;
- likely rollout mechanism and technical risks.

Do not review the whole repository when the current work gives a narrower starting point.

### 2. Complete the relevant outcome

Resolve one application and match the selected outcome to a saved goal using direct artifact, issue, PR, launch, signal, product-surface, or user-journey relationships. Prefer direct relationships over keyword matches.

If no saved goal fits, keep the selected outcome provisional and ground its measurement contract in current customer or operational evidence. Do not choose a different portfolio priority and do not force every engineering task into Pendo usage data.

### 3. Complete the goal contract from data

Derive the primary user or business outcome, current state, target or direction, deadline, affected audience, early indicators, must-not-regress measures, expected lag, and data-quality limits.

Calculate current versus required pace when the saved goal supports it. When target, baseline, deadline, or traffic is missing, label only that field `provisional` and continue.

**REQUIRED SUB-SKILL:** Use `verify-instrumentation` when the baseline, goal measure, or decision rule depends on Pendo behavioral data and no current verdict exists. Carry forward its verdict and exact repair. Do not design a product experiment around an `UNTRUSTED` primary outcome; make the repair and observed recheck a pre-launch gate.

### 4. Diagnose what matters

Gather a broad, inexpensive view, then deepen only decision-relevant evidence. Build three groups:

- **Helping:** Evidence moving in the desired direction.
- **Hurting:** A material obstacle or adverse movement.
- **Uncertain:** Coverage, timing, conflict, or data quality prevents a responsible conclusion.

Preserve source, window, audience, relationship type, and confidence. Separate merge date from rollout and exposure. Check flags, overlapping changes, adoption lag, and instrumentation changes before attributing movement.

### 5. Select one engineering experiment

Search existing work inside the selected outcome first. Rank experiment candidates by user or operational impact, affected reach, evidence confidence, reversibility, engineering effort, time to learn, and fit with the selected move.

Choose one action and the strongest alternative. An instrumentation repair or focused investigation can win when it unlocks a responsible product decision. Never recommend “collect more data” without naming the exact event, field, cohort, replay, test, or comparison needed.

When a concrete implementation plan already exists, consume a current `stress-test-plan` verdict when available. Preserve its required mechanism changes and explicit non-goals; do not expand the selected outcome while designing the experiment.

### 6. Produce the engineering brief

Read [references/output-contract.md](references/output-contract.md) immediately before responding. Lead with the engineering action, affected code or work surface, and user impact. Put the analytical evidence underneath it.

Define user-visible behavior, technical acceptance criteria, tests, instrumentation, rollout, rollback, user outcome, early signal, must-not-regress measures, evaluation window, and decision rule.

For instrumentation, state in order:

1. what Novus should instrument automatically;
2. how `verify-instrumentation` will prove arrival, recognition, definition, continuity, audience, and required flow coverage;
3. any net-new event or property that is genuinely required because supported automatic coverage cannot express the outcome.

Configuration success is not proof. Require an observed end-to-end path before exposure.

Use exact experiment allocation, lift thresholds, cohort sizes, or durations only when traffic, variance, risk, or a named business decision supports them. Otherwise state the sizing method and make baseline, sample, and guardrail selection explicit pre-launch acceptance criteria.

### 7. Hand off or execute safely

- **Analysis request:** Return the engineering brief and offer the next implementation action.
- **Implementation authorized:** The agent may edit the current repository, add tests and instrumentation, and prepare local or draft artifacts within the authorized task.
- **External draft authorized:** Create draft or disabled issues, guides, flags, or launch artifacts only within the requested scope.
- **Live-user effect:** Require explicit authority before publishing, enabling, widening, retargeting, or otherwise affecting users.
- **No human available:** Continue with authorized repository work and read-only discovery. Leave production-facing actions as a precise handoff with the required authorization clearly named.

### 8. Review after release

After verified exposure and the measurement window, use `verify-impact` with this experiment contract. Preserve the intended outcome, audience, comparison, early signal, guardrails, expected lag, and invalidation condition. Its verdict determines whether to expand, continue, modify, rollback, or repair measurement; do not make a parallel impact claim inside this skill.

## Degraded modes

- **Novus unavailable:** Use repository, issue, PR, test, and user-provided evidence; state which product evidence would change the decision.
- **No repository context:** Start from the saved goal and connected work systems.
- **No saved goal:** Keep the supplied outcome provisional and design a learning action; do not invent a target or select a different portfolio priority.
- **No trustworthy metric:** Use `verify-instrumentation`; make its smallest exact repair and observed proof a pre-launch gate when evaluation is blocked.
- **Sparse or conflicting evidence:** Choose a reversible action and state the switch condition.
- **Tool failure:** Retry a failed read once, then continue and disclose the gap.

## Common failures

- Asking the engineer to provide product fields Novus can discover.
- Using this skill to choose between unrelated goals, product areas, or backlog items; route that decision to `build-investment` or `whats-next` first.
- Leading with a dashboard or goal table instead of the engineering move.
- Recommending a net-new ticket when relevant work already exists.
- Adding duplicate manual tracking for a surface Novus already instruments automatically.
- Calling observability work “user value” without separating faster diagnosis from fewer user failures.
- Using PM shorthand without explaining the engineering consequence.
- Blocking an autonomous caller on a question when a safe assumption or measurement repair is available.
- Re-evaluating post-release impact here instead of handing the experiment contract to `verify-impact`.

## References

- [references/evidence-map.md](references/evidence-map.md) — repository bootstrap, goal selection, source order, and evidence honesty
- [references/output-contract.md](references/output-contract.md) — required engineer-facing response and optional visualization
