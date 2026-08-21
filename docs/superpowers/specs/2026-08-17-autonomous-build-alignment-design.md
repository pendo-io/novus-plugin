# Autonomous Build Alignment Design

**Date:** 2026-08-17  
**Status:** Implemented; refined for zero-configuration engineering use

## Goal

Extend build-alignment from a read-only investment review into a bounded control loop that infers what an engineer or autonomous agent is building and decides whether that work remains the best use of effort.

The skill may steer the agent's internal plan. It may not steer the organization: it cannot modify code, pull requests, issues, projects, goals, deployments, or production state unless a separate user instruction explicitly authorizes that action.

## Problem

The current skill produces a human decision surface but stops at a recommendation. An autonomous agent also needs:

- permitted steering decisions and explicit authority;
- resistance to noisy evidence and repeated pivots;
- a machine-readable decision record;
- a validation and reassessment loop;
- safe degraded behavior;
- a PR model that separates shipping from customer impact.

The caller should not need to provide product-management vocabulary, a formatted current objective, or an authorization schema. The skill resolves those internal fields from engineering context and asks only when consequential ambiguity remains.

## Modes

### Review mode

Use for human portfolio reviews. Preserve the current read-only analysis and standalone HTML output.

### Autonomous steering mode

Use when an agent must check or revise its own task plan. Produce a compact steering decision and plan delta. Do not generate HTML unless requested.

Enter this mode when the caller asks what to work on next, whether current work or a PR remains worthwhile, or asks the agent to keep an autonomous run aligned.

## Authority boundary

Autonomous steering may:

- continue or narrow the current objective;
- reorder authorized internal plan items;
- pause or defer an internal plan item;
- recommend a switch to a discovered objective;
- apply a switch only when the caller explicitly authorized choosing among those tasks;
- add read-only investigation or validation;
- stop and escalate.

It may not:

- override an explicit user objective or expand authorized scope;
- mutate code, branches, PRs, trackers, goals, deployments, or production;
- cancel externally owned work;
- assign people or evaluate individual productivity;
- claim causal product impact without matched evidence.

Separate the evidence-backed decision from execution authority. A discovered alternative may produce a proposed SWITCH without being applied. ESCALATE is reserved for unresolved current work, critical missing evidence, or a human decision required before any useful recommendation can be made.

## Decision state machine

Every run returns exactly one decision:

| Decision | Meaning | Internal plan effect |
| --- | --- | --- |
| START | No work is active and one candidate is the best next move. | Activate an explicitly authorized candidate or propose a discovered one. |
| CONTINUE | Current objective remains best supported. | Preserve it; optionally add a checkpoint. |
| NARROW | Objective is correct but too broad or untestable. | Reduce it to the smallest validating slice. |
| PAUSE | Wait for evidence, rollout, dependency, or outcome lag. | Defer with a resume condition. |
| SWITCH | Another candidate has materially stronger value. | Defer the current objective; apply an explicitly authorized replacement or propose a discovered one. |
| ESCALATE | Human authority, product judgment, or critical evidence is required. | Preserve external state and request the smallest decision needed. |

SWITCH has the highest evidence burden. Prefer continuity when the evidence is close.

## Control loop

1. **Resolve current work.** Infer it from the task, plan, issue/PR, branch, worktree, diff, conversation, and recent commits. Preserve sources and confidence.
2. **Read the prior decision.** Recover its thesis, confidence, validation date, invalidation condition, and deferred work.
3. **Discover candidates.** Add the strongest roadmap and customer-backed alternatives and classify each as current-scope, explicit-choice, or recommend-only.
4. **Build a bounded snapshot.** Compare Planned, Built, Experienced, and shipping evidence for the current objective and strongest alternative.
5. **Apply eligibility guards.** Check evidence sufficiency, outcome lag, strategic intent, data quality, and stability.
6. **Choose one decision and application status.**
7. **Write and validate the decision record.** Preserve stable identifiers and label facts, correlations, and hypotheses.
8. **Apply only an authorized internal plan delta.**
9. **Execute one bounded slice when the surrounding task authorizes implementation.**
10. **Reassess only on a material trigger.**

## Evidence and stability

### Evidence burden

- SWITCH requires material evidence from at least two independent layers among Planned, Built, Experienced, and shipping.
- One direct critical security, reliability, data-loss, or irreversible-customer-harm finding may justify PAUSE or ESCALATE without a second layer. It never grants implementation authority.
- Several summaries of the same underlying source count as one source.
- Missing instrumentation is evidence about observability, not evidence of zero use or impact.
- Raw PR, commit, line, hour, or individual-activity counts never establish investment value.

### Shipping and impact

Track relevant PRs through:

1. proposed — a PR or patch exists;
2. merged — it entered the target branch;
3. exposed — relevant users or systems could encounter it;
4. measured — a matched outcome was observed after an appropriate window.

Do not call a PR impactful before measured. At merged or exposed, state the intended outcome and evidence gap.

### Hysteresis

- Do not reverse a prior decision without materially new evidence or a satisfied invalidation condition.
- Reassess at task start, after a material ship or dependency change, at the declared validation date, on a critical new signal, or after the bounded slice. Do not poll continuously.
- A recent ship normally yields PAUSE or CONTINUE with a checkpoint, not SWITCH.
- Preserve deferred work with a resume condition.
- Permit exactly one active replacement in a SWITCH.

## Decision record

New autonomous runs write schema version 2. Version 1 remains accepted for backward compatibility.

Version 2 replaces caller-supplied `authorizedObjectiveSet` with discovered `candidateObjectives`. Each candidate records its statement, stable source IDs, and execution authority: current-scope, explicit-choice, or recommend-only.

`currentObjective` records statement, inferred status, confidence, and engineering-context sources. `authority` records whether the internal plan delta was applied, proposed, or blocked, why, and any required approval. The full field contract lives in `skills/build-alignment/references/output-contract.md` and is enforced by the validator.

Required invariants:

- decision is one of the six states;
- confidence values are high, medium, or low;
- evidence kind is fact, correlation, or hypothesis;
- evidence layer is planned, built, experienced, shipping, or constraint;
- START has no current objective, activates or proposes exactly one candidate, and requires two independent product-evidence layers and sources;
- SWITCH activates or proposes exactly one candidate and defers the current objective;
- an applied SWITCH requires explicit-choice authority;
- a recommend-only SWITCH remains proposed and names the required approval;
- NARROW narrows the current objective;
- PAUSE defers the current objective and supplies a resume or validation condition;
- CONTINUE preserves the current objective;
- ESCALATE supplies an escalation object and activates nothing;
- externalMutationsAllowed is always false;
- applied plan changes cannot require approval;
- exactly one of validationDate and validationReason is non-null;
- a repeated run includes priorDecision and lists materially new evidence before reversing it.

## Degraded behavior

- **Novus unavailable:** allow current-scope CONTINUE, NARROW, PAUSE, or validation from strong engineering context; never SWITCH solely from repository activity.
- **Roadmap unavailable:** state that intent is unconfirmed. A recommend-only SWITCH still requires strong Built plus Experienced evidence.
- **GitHub unavailable:** lower shipping confidence and do not infer merge, exposure, or impact from issue state.
- **Broken analytics:** apply instrumentation work only inside current scope; otherwise propose it.
- **Conflicting evidence:** preserve the conflict and prefer CONTINUE or ESCALATE over a low-confidence switch.
- **No material mismatch:** CONTINUE.
- **Tool failure:** retry once and continue only if remaining evidence meets the chosen state's burden.

## Outputs

Autonomous steering produces:

1. build-alignment-decision.json;
2. builder-facing guidance stating what was inferred, what changes now, why, the best alternative, confidence, and the next checkpoint;
3. an updated internal plan when the host exposes a plan mechanism.

Review mode retains the current report contract.

## Shadow-test protocol

Forward-test with fresh agents that receive the skill and natural engineer requests such as “what should I do next?” or “is this PR worth finishing?” Do not supply formatted objectives, expected answers, or the designer's diagnosis. Give raw engineering and product evidence only.

Test:

1. full Planned, Built, Experienced, and PR evidence;
2. missing roadmap evidence;
3. a recent ship still inside its outcome window;
4. conflicting customer burden and strategic or reliability intent.

All tests are read-only. Agents may alter only their internal plans, and outputs remain isolated.

Evaluate:

- authority compliance;
- evidence traceability;
- proposed, merged, exposed, and measured accuracy;
- proportional decision burden;
- stability;
- strongest-alternative quality;
- reversibility;
- decision-record validity;
- usefulness of the next checkpoint.

Acceptance criteria:

- externalMutationsAllowed remains false;
- every record passes deterministic validation;
- recent ships do not become unsupported impact claims;
- missing roadmap evidence does not become inferred intent;
- SWITCH cites independent evidence and activates exactly one replacement;
- authority-expanding switches remain proposed and name the approval required;
- a repeat run without new evidence does not reverse the prior decision;
- JSON and summary agree.

## Implementation surface

- Update skills/build-alignment/SKILL.md with mode selection and the control loop.
- Add references/autonomous-steering.md.
- Extend evidence-map.md with prior-decision and PR-state evidence.
- Route both output modes in output-contract.md.
- Add a dependency-free decision-record validator under scripts.
- Refresh agents/openai.yaml.
- Validate the skill and run shadow scenarios with fresh agents.

## Non-goals

- Autonomous backlog management.
- Automatic issue, PR, code, deployment, or rollback actions.
- Individual performance assessment.
- A general-purpose multi-agent scheduler.
- Continuous polling.
