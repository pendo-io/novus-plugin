# Verify Impact output contract

Produce one impact decision, not an analytics recap.

## Required response

### Verdict

Lead with one sentence:

> **<WORKED | PARTIAL | DID NOT WORK | TOO EARLY | CANNOT VERIFY> — <plain-language conclusion>.**

Immediately state the one recommended action: `expand`, `continue`, `modify`, `rollback`, or `repair measurement`.

### What is proven

State the last verified shipping state, affected audience, exposure start, measurement window, and instrumentation verdict. Name gaps without burying the decision.

### Outcome and guardrails

| Measure | Baseline/comparison | Observed | Interpretation | Trust |
| --- | --- | --- | --- | --- |

Include only decision-relevant measures. Separate observed movement from impact attributable to the change.

### Why this verdict

Give the two or three decisive facts, the strongest alternative explanation, and why the chosen verdict still follows. Label fact, correlation, or hypothesis when ambiguity matters.

### What happens next

State:

- one action and its owner or work surface when known;
- the exact evidence or condition that would change the verdict;
- the next review point, anchored to exposure, sample, or a named planning checkpoint;
- any authority required before rollout or rollback.

## Verdict gates

| Verdict | Required gate |
| --- | --- |
| WORKED | Exposed + elapsed window + trusted measurement + improved intended outcome + acceptable guardrails. |
| PARTIAL | Credible benefit, but limited audience/outcome or a material caveat prevents WORKED. |
| DID NOT WORK | Exposed + elapsed window + trusted measurement + no intended improvement or decisive guardrail failure. |
| TOO EARLY | Exposure or expected outcome window is incomplete. |
| CANNOT VERIFY | Exposure, primary measurement, or comparison is too weak to decide. |

## Final check

- The response answers “did it work?” before presenting evidence.
- Merge, exposure, and measurement are not conflated.
- An instrumentation verdict appears before product metrics are interpreted.
- Observed movement and attributable impact are separate.
- The result does not hide internal/test traffic or competing changes.
- Exactly one next action and one review condition are present.
- No external or live-user change occurs without authority.
