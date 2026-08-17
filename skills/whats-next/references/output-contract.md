# What's Next output contract

Produce one steering decision, not a portfolio dashboard. Never hide a coverage gap that could change the choice.

## Advisory mode

Return the human response below. Do not create `whats-next-decision.json`, print validator output, or alter an internal plan.

## Autonomous steering mode decision record

Write schema version 2 `whats-next-decision.json` before altering the internal plan. Validate with:

    node <skill-directory>/scripts/validate-steering-decision.mjs <decision-file>

The file, validator input, and reported record must be identical. Require exit code 0 and include the exact success line `Decision record is valid.` Do not claim validity from inspection.

The record contains:

- `schemaVersion: 2`, `runId`, `generatedAt`, and `mode: autonomous-steering`;
- `scope.application`, `scope.window`, and `scope.candidateObjectives`;
- nullable `currentObjective` inferred from engineering context;
- nullable `priorDecision`;
- one `decision`: START, CONTINUE, NARROW, PAUSE, SWITCH, or ESCALATE;
- claim-first `thesis` and high, medium, or low `confidence`;
- decision-relevant evidence with claim, fact/correlation/hypothesis kind, Planned/Built/Experienced/shipping/constraint layer, stable source ID, status or window, and confidence;
- alternatives with objective, disposition, and reason;
- `planDelta` arrays for activate, continue, narrow, defer, and addValidation;
- `expectedOutcome` with direction, leading indicators, invalidation condition, and exactly one validation date or validation reason;
- authority with `externalMutationsAllowed: false`, internal plan status, reason, and required approval;
- nullable escalation details.

Each candidate contains a plain outcome statement, execution authority, and stable source IDs. The current objective statement and every plan item objective exactly match a candidate. Each current-objective source records kind, source ID, and summary.

## State invariants

- **CONTINUE:** preserve the current objective in `continue`.
- **START:** require no current objective, activate exactly one candidate, compare a different candidate when available, and cite at least two independent product-evidence layers and sources. Applied START requires explicit-choice authority.
- **NARROW:** name the current objective in `narrow`.
- **PAUSE:** defer the current objective with a resume condition.
- **SWITCH:** activate exactly one different candidate, defer the current objective, and cite at least two independent product-evidence layers and sources. Applied SWITCH requires explicit-choice authority. A recommend-only replacement remains proposed and names the required approval.
- **ESCALATE:** activate nothing, use blocked status, and state the reason, decision needed, authority, and approval.

Applied means the internal plan was actually changed. Proposed means it was not. Never silently delete deferred work or claim external mutation authority.

## Human response

Lead with ordinary builder language:

1. **What to do next** — one actionable imperative.
2. **Finish first**, when applicable — a PR, review, or validation gate.
3. **Build next** — exactly one bounded new slice.
4. **Do not start yet** — deferred work and its resume condition.
5. **Why this order** — decisive Planned, Built, Experienced, and shipping evidence, plus why it beats the strongest alternative.
6. **Goal connection** — the active goal advanced or protected, or the provisional outcome when no goal fits; state conflicts explicitly.
7. **What this will and will not fix** — the slice's direct effect and the broader mismatch that remains.
8. **How to validate** — immediate engineering acceptance separately from the later customer/business checkpoint.
9. **Evidence trust** — when behavioral evidence materially affected the order, write `Instrumentation: TRUSTED | DEGRADED | UNTRUSTED | UNKNOWN` and include the checked surface/window. When prior impact affected the order, write the `verify-impact` verdict.
10. **Confidence and limitation** — only gaps that could change the order.
11. **Question**, only when one consequential decision is required.

Do not use the formal state as an unexplained headline. Translate it first; when useful, show it later as secondary metadata such as `Steering state: NARROW`.

For NARROW, prefer:

> Finish `<existing gate>`. Then build `<one bounded slice>`. Do not begin `<deferred work>` until `<resume condition>`.

Avoid “host plan mechanism,” “plan delta,” and schema vocabulary unless the caller asks. State external-action status naturally.

Do not invent a reassessment duration. Use a sourced outcome lag, configured window, sufficient-sample condition, or named planning checkpoint.

## Goal-to-experiment handoff

When the caller asks to continue into experiment design, pass this compact contract without re-running portfolio selection:

- `selectedOutcome`: the exact chosen objective or provisional outcome;
- `goalId`: the directly related saved goal, or null;
- `decisionSource`: `whats-next`;
- `whySelected`: the decisive comparison with the strongest alternative;
- `evidence`: stable IDs and windows for the few facts that selected the move;
- `constraints`: authority, must-not-regress conditions, and explicitly deferred scope;
- `validationWindow`: when outcome evidence should be reviewed;
- `invalidationCondition`: what would change the decision.

Include this as a visible block only when the caller requests the handoff or experiment brief. Otherwise keep it implicit in the response.

## Lifecycle handoffs

- **Plan exists but implementation has not started:** offer `stress-test-plan` as the next gate.
- **Outcome is selected and needs rollout/measurement design:** offer `goal-to-experiment`.
- **Measurement is broken or disputed:** use `verify-instrumentation` before interpreting it.
- **Work is exposed and the caller asks whether it worked:** use `verify-impact`.

Offer only the handoff that matches the immediate next decision. Do not turn the response into a menu of skills.

## Final check

- The current objective is supported by engineering context.
- Linear/Jira coverage states whether Novus-native access, direct connector access, both, or neither was available; duplicate issue records are not treated as independent evidence.
- The recommendation beats a named alternative.
- Goal alignment is treated as strategic evidence, not proof of impact.
- Decision-critical behavioral evidence carries an explicit `TRUSTED`, `DEGRADED`, `UNTRUSTED`, or `UNKNOWN` instrumentation verdict; untrusted zeros do not count against a candidate.
- Shipped work is not called effective or ineffective without a qualifying impact verdict or equivalent gates.
- Planned, Built, Experienced, and shipping evidence remain distinct.
- Recent work is not called impactful before measurement.
- The formal state is translated before it is named.
- Finish work, the next build, deferred work, and validation are not conflated.
- The slice's direct effect is separated from the broader product mismatch.
- One validation window and invalidation condition are present.
- Advisory answers do not create or validate a steering record.
