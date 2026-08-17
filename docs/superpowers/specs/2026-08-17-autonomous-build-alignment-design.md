# Autonomous Build Alignment Design

**Date:** 2026-08-17  
**Status:** Proposed for implementation

## Goal

Extend build-alignment from a read-only investment review into a bounded control loop that helps an autonomous agent decide whether its current engineering objective is still the best use of its authorized effort.

The skill may steer the agent's internal plan. It may not steer the organization: it cannot modify code, pull requests, issues, projects, goals, deployments, or production state unless a separate user instruction explicitly authorizes that action.

## Problem

The current skill produces a human decision surface but stops at a recommendation. An autonomous agent also needs:

- permitted steering decisions and explicit authority;
- resistance to noisy evidence and repeated pivots;
- a machine-readable decision record;
- a validation and reassessment loop;
- safe degraded behavior;
- a PR model that separates shipping from customer impact.

## Modes

### Review mode

Use for human portfolio reviews. Preserve the current read-only analysis and standalone HTML output.

### Autonomous steering mode

Use when an agent must check or revise its own task plan. Produce a compact steering decision and plan delta. Do not generate HTML unless requested.

Enter this mode only when the caller asks the skill to evaluate an active objective, choose among authorized tasks, or keep an autonomous run aligned.

## Authority boundary

Autonomous steering may:

- continue or narrow the current objective;
- reorder authorized internal plan items;
- pause or defer an internal plan item;
- switch to one already-authorized objective;
- add read-only investigation or validation;
- stop and escalate.

It may not:

- override an explicit user objective or expand authorized scope;
- mutate code, branches, PRs, trackers, goals, deployments, or production;
- cancel externally owned work;
- assign people or evaluate individual productivity;
- claim causal product impact without matched evidence.

If the best action requires new authority, return ESCALATE and continue only safe, reversible work.

## Decision state machine

Every run returns exactly one decision:

| Decision | Meaning | Internal plan effect |
| --- | --- | --- |
| CONTINUE | Current objective remains best supported. | Preserve it; optionally add a checkpoint. |
| NARROW | Objective is correct but too broad or untestable. | Reduce it to the smallest validating slice. |
| PAUSE | Wait for evidence, rollout, dependency, or outcome lag. | Defer with a resume condition. |
| SWITCH | Another authorized objective has materially stronger value. | Defer the current objective and activate one replacement. |
| ESCALATE | Human authority, product judgment, or critical evidence is required. | Preserve external state and request the smallest decision needed. |

SWITCH has the highest evidence burden. Prefer continuity when the evidence is close.

## Control loop

1. **Read the mandate.** Capture the user's objective, authorized objective set, constraints, current plan, and definition of done. User instructions are hard constraints.
2. **Read the prior decision.** Recover its thesis, confidence, validation date, invalidation condition, and deferred work.
3. **Build a bounded snapshot.** Compare Planned, Built, Experienced, and shipping evidence for the current objective and strongest alternative.
4. **Apply eligibility guards.** Check evidence sufficiency, outcome lag, strategic intent, data quality, and stability.
5. **Choose one state.**
6. **Write the decision record.** Preserve stable identifiers and label facts, correlations, and hypotheses.
7. **Apply only the internal plan delta.**
8. **Execute one bounded slice.**
9. **Reassess only on a material trigger.**

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

Autonomous steering writes build-alignment-decision.json containing:

    {
      "schemaVersion": 1,
      "runId": "stable-id",
      "generatedAt": "ISO-8601",
      "mode": "autonomous-steering",
      "scope": {
        "application": "name-or-id",
        "window": "evidence-window",
        "authorizedObjectiveSet": ["objective"]
      },
      "currentObjective": {
        "id": "stable-id-or-null",
        "statement": "current objective",
        "source": "user, task, plan, or issue"
      },
      "priorDecision": {
        "runId": "prior-run-id",
        "decision": "CONTINUE",
        "validationDate": "ISO-8601 date",
        "invalidationCondition": "prior reversal condition",
        "materialNewEvidence": []
      },
      "decision": "CONTINUE",
      "thesis": "claim-first rationale",
      "confidence": "high",
      "evidence": [
        {
          "claim": "decision-relevant claim",
          "kind": "fact",
          "layer": "experienced",
          "sourceId": "stable-source-id",
          "windowOrStatus": "30 days",
          "confidence": "high"
        }
      ],
      "alternatives": [
        {
          "objective": "strongest alternative",
          "disposition": "not selected",
          "reason": "why it loses"
        }
      ],
      "planDelta": {
        "activate": [],
        "continue": [],
        "narrow": [],
        "defer": [],
        "addValidation": []
      },
      "expectedOutcome": {
        "primary": "outcome",
        "direction": "increase",
        "leadingIndicators": ["indicator"],
        "validationDate": "ISO-8601 date",
        "validationReason": null,
        "invalidationCondition": "observable reversal condition"
      },
      "authority": {
        "externalMutationsAllowed": false,
        "requiredApproval": null
      },
      "escalation": {
        "reason": "why autonomous steering must stop",
        "decisionNeeded": "smallest human decision required",
        "requiredAuthority": "authority the agent does not have"
      }
    }

priorDecision and escalation are nullable. Each planDelta array contains objective-change objects with statement and reason; id and resumeCondition may be null. Deferred items require a non-null resumeCondition.

Required invariants:

- decision is one of the five states;
- confidence values are high, medium, or low;
- evidence kind is fact, correlation, or hypothesis;
- evidence layer is planned, built, experienced, shipping, or constraint;
- SWITCH activates exactly one objective and defers at least one;
- NARROW narrows at least one objective;
- PAUSE defers work and supplies a resume or validation condition;
- ESCALATE supplies an escalation object and activates nothing;
- externalMutationsAllowed is always false;
- exactly one of validationDate and validationReason is non-null;
- a repeated run includes priorDecision and lists materially new evidence before reversing it.

## Degraded behavior

- **Novus unavailable:** ESCALATE because customer evidence is required to redirect engineering.
- **Roadmap unavailable:** allow CONTINUE, NARROW, or PAUSE. Allow SWITCH only between explicitly authorized objectives with strong Built plus Experienced evidence.
- **GitHub unavailable:** lower shipping confidence and do not infer merge, exposure, or impact from issue state.
- **Broken analytics:** NARROW to minimum instrumentation repair only when already authorized; otherwise ESCALATE.
- **Conflicting evidence:** preserve the conflict and prefer CONTINUE or ESCALATE over a low-confidence switch.
- **No material mismatch:** CONTINUE.
- **Tool failure:** retry once and continue only if remaining evidence meets the chosen state's burden.

## Outputs

Autonomous steering produces:

1. build-alignment-decision.json;
2. a concise summary with decision, plan change, strongest evidence, strongest alternative, confidence, and next checkpoint;
3. an updated internal plan when the host exposes a plan mechanism.

Review mode retains the current report contract.

## Shadow-test protocol

Forward-test with fresh agents that receive the skill, a realistic active objective, and raw task-local evidence. Do not provide an expected answer or the designer's diagnosis.

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
- low-confidence or authority-expanding choices ESCALATE;
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
