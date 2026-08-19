# Stress Test Plan output contract

Produce a concise engineering decision, not a strategy memo or generic risk register.

## Required response

### Call

Lead with:

> **<PROCEED | REVISE | NARROW | STOP | NEEDS ONE ANSWER> — <plain-language instruction>.**

Follow with the strongest concrete reason you would not implement the original plan as written.

### What the plan is betting on

State the intended outcome, affected users or operators, proposed mechanism, and confidence. Mark assumptions plainly. Use engineering language: inputs, behavior, dependencies, failure mode, and observable result.

### What can break

Show no more than three. A compact table is allowed, but prefer numbered findings when a table makes the response sound like a template.

| Risk | Evidence | Failure if ignored | Cheapest proof before coding | Required plan change |
| --- | --- | --- | --- | --- |

Rank known blockers above speculative risks. Include source IDs or links for material evidence.

For each finding, say:

- what is known versus inferred;
- the product or repository evidence;
- what fails if the plan is wrong;
- the cheapest proof available before coding;
- the exact change required.

### The smaller plan I would ship

State one bounded replacement plan:

- **Build:** one implementation or prototype slice.
- **Do first:** prerequisite, repository check, or targeted validation.
- **Do not include:** explicit deferred scope.
- **Acceptance:** observable user and technical behavior.
- **Ship safely:** flag/audience, failure handling, and rollback.
- **Measure:** intended outcome, early signal, guardrail, and instrumentation-trust check.
- **Stop/switch:** evidence that invalidates the mechanism.

### Coverage and question

State whether Novus, repository, GitHub, and Linear/Jira evidence were available. Ask one question only with `NEEDS ONE ANSWER`; otherwise end with the revised plan, not an invitation to supply more requirements.

## Voice check

- Sound like an engineer protecting another engineer from expensive rework.
- Prefer “the runtime cannot access this dependency” over “delivery confidence is low.”
- Prefer “12 of 80 eligible users reached this step” over “engagement is weak.”
- Prefer “prove this mapping with one fixture before adding the scheduler” over “conduct additional validation.”
- Do not use phrases such as “strategic alignment,” “customer reality,” “value proposition,” or “stakeholder buy-in” when concrete system or behavior language is available.
- Do not explain basic engineering concepts unless the evidence makes the explanation necessary.

## Verdict gates

| Verdict | Gate |
| --- | --- |
| PROCEED | Problem, mechanism, sequence, scope, safety, and learning path are credible. |
| REVISE | Outcome remains sound, but a material mechanism or safety contract must change. |
| NARROW | Outcome remains sound, but the first slice is too large, premature, or weakly testable. |
| STOP | Direct evidence defeats the problem or mechanism and no responsible narrow slice remains. |
| NEEDS ONE ANSWER | One consequential unknown changes the verdict and cannot be safely inferred. |

## Final check

- The verdict appears before analysis.
- The response names why this could be a bad build.
- Relevant Novus product evidence changed a recommendation, or the response explicitly states why it was unavailable or untrustworthy.
- Every product metric names its surface, audience, and window closely enough to audit.
- Risks are plan-specific and evidence-backed.
- No more than three risks appear.
- The revised first slice is smaller and implementable.
- A feature flag is not presented as a value argument.
- Automatic Novus instrumentation is not duplicated; only targeted measurement checks are specified.
- The caller is not given a questionnaire.
