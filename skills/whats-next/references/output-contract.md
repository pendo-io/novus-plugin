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

Make the decision understandable in one screen. Use this exact narrative order.

### 1. Named headline

Open with a level-one heading:

- `# <First name>'s next steps` when the caller names a builder, for example `# Joe's next steps`;
- `# Your next steps` when speaking directly to the builder;
- `# Next steps` only when no person can be identified.

Never use the formal steering state, `What's next`, or `Do this next` as the page headline.

### 2. Opening recommendation

Immediately below the headline, write one short paragraph in ordinary engineering language. State the recommended order, the current finish gate, the next bounded slice, and the concrete reason for that order. A builder should know what to do without reading farther.

Prefer:

> Get `<current PR>` merged, then `<next bounded slice>` before returning to `<deferred work>`. `<Current gate>` is nearly done; `<next slice>` addresses `<specific customer or product problem>`.

### 3. Do this next

Use a `## Do this next` heading and a short numbered list:

1. **Finish `<current gate>`.** State what remains before it is done.
2. **Build `<one bounded slice>`.** Name the contextual signal or customer/product evidence and the goal or provisional outcome it advances. When an implementation already exists, say **repair**, **rebase**, **validate**, or **finish** it instead of proposing a second build.
3. **Hold `<strongest deferred candidate>`.** State the exact resume condition and why it loses now.

Use only applicable steps, but never hide the strongest deferred candidate. The action line is the answer; do not make the reader reconstruct it from evidence.

After the list, translate the classified basis into one natural sentence: `This is a product-led call.`, `This is a customer-led call.`, `This is a continuity-led call.`, or `This is a validation-led call.`

- `product-led`: trusted candidate-specific behavioral evidence materially changed the order.
- `customer-led`: mapped feedback, support, or customer need materially changed the order.
- `continuity-led`: product evidence was close, missing, or non-distinguishing, so delivery continuity decided the order.
- `validation-led`: missing or untrusted evidence made repair or investigation the next move.

Never call a decision product-led because app-wide activity exists or because active goals were listed. The evidence must map to the selected candidate and distinguish it from the strongest alternative.

### 4. Why this order

Use a `## Why this order` heading and at most four short bullets, in this priority order:

- **Signal:** the issue or opportunity, its stable ID, and the concrete customer problem it represents.
- **Goal:** the directly related saved goal and relationship. If none fits, say `No linked goal` and state the signal-backed provisional outcome.
- **Product:** the narrow product metric, feedback theme, replay finding, or affected reach that distinguishes the choice. Say what customers are doing or failing to do.
- **Delivery:** the decisive issue, PR, conflict, review, or exposure fact.

Within those bullets, compare the strongest alternative at equivalent depth. Name its goal fit, candidate-specific product/customer evidence, and delivery state; do not merely say it is lower priority. If the alternative lacks evidence, say exactly what is missing.

Before writing **Build**, reconcile the proposed slice with open and merged issues/PRs. Existing matching work belongs under **Finish**. Do not recommend rebuilding a customer request that a review-ready PR already implements.

Within those bullets, state what the selected slice fixes and the broader problem it does not fix. Keep signals, goals, and other decision-changing evidence beside the recommendation they caused; do not add an evidence appendix.

### 5. Validate now

Use a `## Validate now` heading. Name the immediate engineering checks required before the work is considered ready: review, mergeability, CI, acceptance paths, instrumentation repair, or exposure proof. If a behavioral zero or trend is untrusted, say it was excluded from the ranking and name the verification required before it can be used.

### 6. Reassess later

Use a `## Reassess later` heading. State:

- the later customer or business checkpoint and invalidation condition;
- the sourced window, sample condition, named planning checkpoint, or observable event that starts reassessment;
- confidence and only the material evidence or connector limitation that could change the order.

Include `Instrumentation: TRUSTED | DEGRADED | UNTRUSTED | UNKNOWN` with the checked surface/window only when behavioral evidence affected the order. Otherwise explain naturally why an untrusted behavioral claim was excluded.

Ask a question only when one consequential decision is required.

Use an engineer-to-engineer voice throughout: short sentences, concrete nouns, explicit IDs, and direct verbs. Prefer “Users cannot tell what Seen it means” over “There is a comprehension mismatch in the analytics surface.” Avoid throat-clearing, strategy-deck language, repeated caveats, schema vocabulary, and a closing recap.

Do not use the formal state as an unexplained headline. Translate it first; when useful, show it later as secondary metadata such as `Steering state: NARROW`.

For NARROW, prefer:

> # Joe's next steps
>
> Get `<existing gate>` finished, then `<one bounded slice>` before returning to `<deferred work>`. The next slice addresses `<specific customer or product problem>`.
>
> ## Do this next
>
> 1. **Finish `<existing gate>`.** `<remaining gate>`.
> 2. **Build `<one bounded slice>`.** `<signal/customer evidence>`; this advances `<goal or provisional outcome>`.
> 3. **Hold `<deferred work>`.** Resume when `<condition>`.
>
> This is a customer-led call.

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
- The response opens with the named builder's next-steps headline and a short recommendation paragraph.
- The decision basis sentence sounds natural and matches what actually changed the order.
- The current objective and strongest alternative received comparable product-evidence depth.
- Every decisive product or customer source maps directly to the candidate's objective, artifact, flow, or owned surface.
- App-wide usage is not presented as candidate-specific demand unless the objective itself is app-wide.
- Full goal relationships were checked; duplicate, elapsed, unmeasured, and unrelated goals do not count as alignment.
- A new build is not recommended when the same outcome already has an implementation or review-ready PR.
- Goal alignment is treated as strategic evidence, not proof of impact.
- Decision-critical behavioral evidence carries an explicit `TRUSTED`, `DEGRADED`, `UNTRUSTED`, or `UNKNOWN` instrumentation verdict; untrusted zeros do not count against a candidate.
- Shipped work is not called effective or ineffective without a qualifying impact verdict or equivalent gates.
- Planned, Built, Experienced, and shipping evidence remain distinct.
- Recent work is not called impactful before measurement.
- The formal state is translated before it is named.
- The headings read as a developer handoff: **Do this next**, **Why this order**, **Validate now**, and **Reassess later**.
- Finish work, the next build, deferred work, and validation are not conflated.
- The slice's direct effect is separated from the broader product mismatch.
- One validation window and invalidation condition are present.
- Advisory answers do not create or validate a steering record.
