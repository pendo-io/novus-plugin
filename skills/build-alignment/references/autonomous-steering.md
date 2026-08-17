# Autonomous Build Alignment

Use this reference only in autonomous steering mode.

## Capture the mandate

Before querying product evidence, record:

- the explicit user objective and definition of done;
- one explicit current objective, copied verbatim from the mandate;
- the objectives already authorized by the user;
- the agent's current internal plan;
- fixed constraints, deadlines, and work that cannot be displaced;
- the prior Build Alignment decision, when one exists.

User instructions are hard constraints. Evidence may change how the agent pursues an objective, but it cannot expand the authorized objective set.

The current objective must be a single member of the authorized objective set. Permission to work on `A or B` is an authorization envelope, not proof that either one is current. If the active objective is absent or ambiguous, set currentObjective to null, choose ESCALATE, and make no plan change. Use an empty authorizedObjectiveSet only when the authorization envelope is also unknown. Do not turn “pick the highest-value option” into a synthetic current objective.

## Authority

The skill may change only the agent's internal plan. It may continue, narrow, reorder, pause, defer, or switch among already-authorized objectives. It may add read-only investigation and validation work.

The skill may not create or edit code, branches, pull requests, issues, projects, goals, comments, deployments, or production state. It may not cancel externally owned work. If the best action needs new authority, choose ESCALATE and request the smallest additional decision.

## Decision states

Return exactly one:

- **CONTINUE** — preserve the current objective; optionally add a checkpoint.
- **NARROW** — reduce the objective to the smallest validating or delivery slice.
- **PAUSE** — defer it until a named dependency, exposure, validation date, or resume condition.
- **SWITCH** — defer the current objective and activate exactly one already-authorized replacement.
- **ESCALATE** — preserve external state and ask for required authority, product judgment, or critical missing evidence.

SWITCH has the highest burden. Prefer continuity when the evidence is close.

## Control loop

1. Read the mandate and prior decision.
2. Build a bounded Planned, Built, Experienced, and shipping snapshot for the current objective and strongest alternative.
3. Apply evidence, strategic-bet, data-quality, release-lag, and stability guards.
4. Select one decision state.
5. Write the exact response record to build-alignment-decision.json before altering the internal plan.
6. Validate it with:

       node skills/build-alignment/scripts/validate-steering-decision.mjs build-alignment-decision.json

7. Require exit code 0 and preserve the exact validator success line. Fix validation errors before applying a plan delta; never claim the record is valid from visual inspection.
8. Apply only activate, continue, narrow, defer, and validation changes to the named authorized objectives in the internal plan.
9. Execute one bounded slice, then reassess only on a material trigger.

## Evidence burden

- SWITCH requires material evidence from at least two independent layers among Planned, Built, Experienced, and shipping, backed by distinct underlying sources.
- A direct critical security, reliability, data-loss, or irreversible-customer-harm finding may justify PAUSE or ESCALATE without a second layer. It never grants implementation authority.
- Several summaries of the same underlying source are not independent corroboration.
- Missing instrumentation describes observability, not zero use or zero impact.
- Raw PR, commit, line, hour, or individual-activity counts never establish investment value.
- Compare the current objective with the strongest authorized alternative. Do not compare against an unlimited hypothetical backlog.

## PR impact

Track material PRs through:

1. **proposed** — a PR or patch exists;
2. **merged** — it entered the target branch;
3. **exposed** — relevant users or systems could encounter it;
4. **measured** — a matched outcome was observed after the outcome window.

Do not call a PR impactful before measured. For proposed, merged, or exposed work, state the intended outcome, current evidence gap, and next measurement checkpoint.

## Stability

- Read the previous decision before changing direction.
- Do not reverse it without materially new evidence or a met invalidation condition.
- Reassess at task start, after a material ship or dependency change, at the validation date, on a critical new signal, or after the bounded slice completes. Do not poll continuously.
- A recent ship normally yields CONTINUE or PAUSE with a checkpoint, not SWITCH.
- Preserve deferred work with a resume condition; never silently delete it.
- Permit one active replacement objective per decision.

## Applying the plan delta

- **CONTINUE:** keep the current objective active.
- **NARROW:** replace its broad internal step with the recorded narrow slice.
- **PAUSE:** mark it deferred and preserve the resume condition.
- **SWITCH:** defer the current objective and activate the single replacement.
- **ESCALATE:** make no replacement active. Continue only safe work that does not prejudge the requested decision.

Every plan-change item names its target in `objective`, copied verbatim from authorizedObjectiveSet, and describes the resulting internal action in `statement`. CONTINUE, NARROW, PAUSE, and SWITCH must target the current objective in the decision-appropriate array. SWITCH may activate only one different authorized objective.

When the host has no plan mechanism, return the proposed plan delta without pretending it was applied.

## Degraded behavior

- **Novus unavailable:** ESCALATE; customer evidence is required to redirect engineering work.
- **Roadmap unavailable:** CONTINUE, NARROW, or PAUSE are allowed. SWITCH only between explicitly authorized objectives with strong Built plus Experienced evidence.
- **GitHub unavailable:** lower shipping confidence; do not infer merged, exposed, or measured from tracker state.
- **Broken analytics:** NARROW to minimum instrumentation repair only when already authorized; otherwise ESCALATE.
- **Conflicting evidence:** preserve the conflict and prefer CONTINUE or ESCALATE over a low-confidence switch.
- **No material mismatch:** CONTINUE.
- **Tool failure:** retry a read once, then proceed only if remaining evidence meets the selected state's burden.

Read output-contract.md for the decision-record fields and response shape.
