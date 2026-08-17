# Stress Test Plan output contract

Produce a concise pre-build decision, not a generic risk register.

## Required response

### Plan verdict

Lead with:

> **<PROCEED | REVISE | NARROW | STOP | NEEDS ONE ANSWER> — <plain-language instruction>.**

Follow with the strongest reason not to build the original plan as written.

### Thesis under test

State the intended user/operational outcome, audience, proposed mechanism, and confidence. Mark assumptions plainly.

### Plan-breaking risks

Show no more than three:

| Risk | Evidence | Failure if ignored | Cheapest proof before coding | Required plan change |
| --- | --- | --- | --- | --- |

Rank known blockers above speculative risks. Include source IDs or links for material evidence.

### Stronger first slice

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

## Verdict gates

| Verdict | Gate |
| --- | --- |
| PROCEED | Thesis, sequence, scope, safety, and learning path are credible. |
| REVISE | Outcome remains sound, but a material mechanism or safety contract must change. |
| NARROW | Outcome remains sound, but the first slice is too large, premature, or weakly testable. |
| STOP | Direct evidence defeats the problem or mechanism and no responsible narrow slice remains. |
| NEEDS ONE ANSWER | One consequential unknown changes the verdict and cannot be safely inferred. |

## Final check

- The verdict appears before analysis.
- The response names why this could be a bad build.
- Risks are plan-specific and evidence-backed.
- No more than three risks appear.
- The revised first slice is smaller and implementable.
- A feature flag is not presented as a value argument.
- Automatic Novus instrumentation is not duplicated; only targeted measurement checks are specified.
- The caller is not given a questionnaire.
