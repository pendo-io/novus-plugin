# What's Next steering contract

Use this reference only in autonomous steering mode.

## Start from engineering context

Do not ask engineers to supply a product objective, candidate list, or decision schema. Resolve the current work from evidence already present in the environment:

1. explicit task instructions and terminal conditions;
2. the in-progress plan step;
3. assigned or linked issues and pull requests;
4. branch, worktree, diff, and changed capability;
5. relevant recent conversation and commits.

One explicit active assignment is sufficient. Otherwise prefer two compatible sources. Branch names, commit counts, and recent file activity alone are weak evidence. Express the result as a plain outcome-oriented objective and record `inferred`, confidence, and stable source records. Ask one natural-language question only when competing interpretations would materially change the decision. If no work is active and the caller asks what to do next, continue to candidate discovery and use START. If context suggests active work but cannot resolve which work is current, choose ESCALATE.

## Discover candidates and authority

Build the candidate set from the current work, Novus customer evidence, connected roadmap sources, and delivery context. Compare with the strongest credible alternative, not an unlimited hypothetical backlog.

Assign each candidate one execution authority:

- **current-scope** — a continuation, narrowing, pause, or validation step reasonably inside the active assignment;
- **explicit-choice** — the caller explicitly allowed the agent to select among named or clearly bounded tasks;
- **recommend-only** — evidence surfaced the objective, but the caller did not authorize executing it.

Discovery permits evaluation, not execution. The skill may recommend any evidence-backed candidate. It may apply a SWITCH only to an `explicit-choice` candidate. A SWITCH to `recommend-only` remains proposed and names the approval required.

## Authority boundary

This skill controls only the agent's internal plan. It does not independently authorize code edits, branches, pull requests, issues, projects, goals, comments, deployments, or production changes. Those actions require authority from the surrounding task.

Record the internal plan change as:

- **applied** — the valid plan delta was within authority and applied through the host plan mechanism;
- **proposed** — the evidence recommends the delta, but it was not applied because authority or a host plan mechanism is absent;
- **blocked** — consequential ambiguity or missing evidence prevents safe steering; use only with ESCALATE.

Never describe a proposed recommendation as applied. An applied plan change cannot require approval.

## Decision states

Return exactly one:

- **CONTINUE** — preserve the current objective; optionally add a checkpoint.
- **START** — no work is active; recommend or activate exactly one candidate as the next objective.
- **NARROW** — reduce it to the smallest validating or delivery slice.
- **PAUSE** — defer it until a named dependency, exposure, date, or resume condition.
- **SWITCH** — evidence favors one replacement; defer the current objective and activate or propose exactly one candidate.
- **ESCALATE** — current work is consequentially ambiguous, critical evidence is unavailable, or a human decision is required before a useful recommendation can be made.

SWITCH has the highest evidence burden. Prefer continuity when the evidence is close.

These labels are control states for the decision record. Never assume the caller knows them, and do not use one as the response headline without translating it. Use these plain-language interpretations:

- **START:** “No work is active; build this next.”
- **CONTINUE:** “Keep going on the current objective; the evidence still supports it.”
- **NARROW:** “Keep the broader objective, but reduce the immediate work to this smaller slice; do not start the named deferred work yet.”
- **PAUSE:** “Stop after the current safe checkpoint and wait for this named condition.”
- **SWITCH:** “Finish or preserve the current work as stated, then replace it with this better-supported objective.”
- **ESCALATE:** “I cannot safely choose until this specific decision or missing evidence is resolved.”

For NARROW in particular, identify four separate things whenever they exist: a merge or review gate to finish, the one new slice to build, the work being held back, and the condition that resumes it. Do not call a merge gate “what to build next.”

## Control loop

1. Resolve current work, constraints, plan, and prior decision from engineering context.
2. Discover and classify the strongest candidate objectives and their execution authority.
3. Build a bounded Planned, Built, Experienced, and shipping snapshot for the current objective and strongest alternative.
4. Apply evidence, strategic-bet, data-quality, release-lag, and stability guards.
5. Select one decision and one internal plan change status.
6. Write the exact response record to `whats-next-decision.json` before altering the plan.
7. Resolve `<skill-directory>` as the directory containing this SKILL.md and validate with:

       node <skill-directory>/scripts/validate-steering-decision.mjs <decision-file>

   Do not assume the caller's repository contains `skills/whats-next`.
8. Require exit code 0 and preserve the exact validator success line. Fix errors before applying a plan delta; never claim validity from inspection.
9. Apply only valid, authorized internal plan changes. Execute one bounded slice only when the surrounding task separately authorizes implementation.
10. Reassess only on a material trigger.

## Evidence burden

- SWITCH requires material evidence from at least two independent layers among Planned, Built, Experienced, and shipping, backed by distinct sources.
- START also requires at least two independent product-evidence layers and sources; repository activity alone cannot choose the next objective.
- A critical security, reliability, data-loss, or irreversible-customer-harm finding may justify PAUSE or ESCALATE without a second layer. It never grants implementation authority.
- Several summaries of one source are not independent corroboration.
- Missing instrumentation describes observability, not zero use or impact.
- Raw PR, commit, line, hour, or individual-activity counts never establish investment value.
- Repository context identifies current work; it does not prove customer value.

## PR impact

Track material PRs through:

1. **proposed** — a PR or patch exists;
2. **merged** — it entered the target branch;
3. **exposed** — relevant users or systems could encounter it;
4. **measured** — a matched outcome was observed after the outcome window.

Do not call a PR impactful before measured. For proposed, merged, or exposed work, state the intended outcome, evidence gap, and measurement checkpoint.

## Stability

- Read the previous decision before changing direction.
- Do not reverse it without materially new evidence or a met invalidation condition.
- Reassess at task start, after a material ship or dependency change, at the validation date, on a critical new signal, or after the bounded slice. Do not poll continuously.
- A recent ship normally yields CONTINUE or PAUSE with a checkpoint, not SWITCH.
- Preserve deferred work with a resume condition; never silently delete it.
- Permit one replacement objective per decision.

## Applying the plan delta

- **CONTINUE:** keep the inferred current objective active.
- **START:** activate one candidate only with `explicit-choice` authority; otherwise propose it as the next move.
- **NARROW:** replace its broad step with the recorded bounded slice.
- **PAUSE:** defer it and preserve the resume condition.
- **SWITCH:** defer the current objective; apply the replacement only with `explicit-choice` authority, otherwise propose it.
- **ESCALATE:** activate nothing and ask the smallest plain-language question required.

Every plan item names a candidate objective verbatim in `objective` and describes the resulting internal action in `statement`. When the host has no plan mechanism, return a proposed delta without pretending it was applied.

The response should describe this status naturally: “I changed only the internal plan,” “This is a recommendation; I changed nothing,” or “I need your decision before changing direction.” Avoid phrases such as “host plan mechanism,” “schema invariant,” or “plan delta” unless the caller asks how the skill works.

## Degraded behavior

- **Novus unavailable:** repository context may support current-scope CONTINUE, NARROW, PAUSE, or validation. Never SWITCH solely from engineering activity.
- **Roadmap unavailable:** state that intent is unconfirmed. A recommend-only SWITCH still requires strong Built plus Experienced evidence.
- **GitHub unavailable:** lower shipping and current-work confidence; do not infer merge, exposure, or measurement from tracker state.
- **Broken analytics:** propose minimum instrumentation work when it fits current scope; otherwise recommend it without applying it.
- **Conflicting context:** ask one plain-language question when the answer would change the decision; otherwise preserve the conflict and lower confidence.
- **No material mismatch:** CONTINUE.
- **Tool failure:** retry a read once, then proceed only if remaining evidence meets the chosen decision's burden.

Read output-contract.md for the version 2 decision record and response shape.
