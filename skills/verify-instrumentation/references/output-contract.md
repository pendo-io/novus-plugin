# Verify Instrumentation output contract

Produce one targeted trust decision.

## Required response

### Trust verdict

Lead with:

> **<TRUSTED | DEGRADED | UNTRUSTED | UNKNOWN> — <what decision the data can or cannot support>.**

Name the selected app, target surface, observation window/session, and actual validation coverage.

### Trust chain

| Layer | What was checked | Result | Decision effect | Evidence |
| --- | --- | --- | --- | --- |
| Arrival |  | pass/gap/unknown |  |  |
| Recognition |  | pass/gap/unknown |  |  |
| Definition |  | pass/gap/unknown |  |  |
| Continuity |  | pass/gap/unknown |  |  |
| Audience |  | pass/gap/unknown |  |  |
| Coverage |  | pass/gap/unknown |  |  |

Include only relevant layers, but never omit a known decision-blocking gap.

### What can be concluded

State the narrowest safe product conclusion. Then state the conclusion that remains blocked. Do not report an untrusted zero as user behavior.

### Smallest repair and proof

Name exactly one next action:

- focused Teach Novus repair for an observed Page or Feature gap;
- exact Track Event name/property/code correction;
- selector or URL-rule correction;
- app/audience/filter correction;
- focused live capture or alternate-path test.

Then name the recheck that proves the repair. A configuration or workflow success message is not sufficient; the same real path must produce the intended match.

### Authority

State whether the response was read-only. Name any permission required to start recording, tag/sync artifacts, modify code, or change a production definition.

## Verdict gates

| Verdict | Gate |
| --- | --- |
| TRUSTED | Every decision-critical layer passes with fresh, representative-enough evidence. |
| DEGRADED | Known gaps exist, but they cannot reverse the explicitly bounded conclusion. |
| UNTRUSTED | A known defect affects a primary measure or critical step. |
| UNKNOWN | A decision-critical layer could not be tested. |

## Final check

- The target and decision are explicit.
- Data Validation coverage is described accurately.
- Arrival, recognition, and semantic correctness are not conflated.
- Unmatched events are gaps, not zeros.
- Track Event name splits and alternate paths are checked.
- One repair and its observed proof are present.
- The verdict can be reused by `verify-impact` without reinterpretation.
