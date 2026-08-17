# Engineer-facing output contract

Produce one engineering brief, not a product dashboard. Use plain Markdown by default. Lead with the code or work decision; use goal and product evidence to justify it.

## Required structure

### Recommended engineering experiment

State one action in imperative language. Include:

- **Change:** What to build, fix, instrument, investigate, continue, or stop.
- **Where:** Repository, component, workflow, file area, PR, or existing issue.
- **User effect:** What becomes easier, more reliable, or less frustrating for users—or which operational burden improves.
- **Why now:** The two or three decisive facts, translated into plain language.
- **Goal connection:** Goal or provisional outcome, current status when known, and confidence in the match.
- **Strongest alternative:** What other experiment within the selected outcome could be run and why it ranks lower.

### Definition of done

Write testable checkboxes under these labels:

- **User behavior:** The observable experience that changes.
- **Technical behavior:** Error, state, performance, reliability, or data behavior that must hold.
- **Tests:** The automated or manual proof required before merge.
- **Instrumentation:** Existing automatic Novus coverage, the exact `verify-instrumentation` recheck, and only the net-new event, property, log, trace, cohort, or reconciliation check that supported coverage cannot provide.

Do not tell the engineer to “add analytics” or “collect more data” without naming the measurement.

Do not add a duplicate manual Page/Feature event merely to make the experiment easier to query. Reuse the existing artifact or repair its mapping; reserve custom Track Events and properties for behavior or semantics automatic coverage cannot express.

### Ship safely

State:

- rollout mechanism and audience;
- draft, disabled, staged, or live starting state;
- comparison or holdout when practical;
- technical and user-facing rollback conditions;
- authority still required before any live-user effect.

When traffic, variance, or operational risk is unknown, do not invent a rollout percentage, cohort size, duration, lift threshold, or numeric guardrail. Make baseline collection and sizing a pre-launch checkbox, state how the value will be chosen, and use qualitative stop conditions until it is supportable.

### How Novus will evaluate it

Translate product terms:

| Plain-language label | Meaning |
| --- | --- |
| **User outcome** | The number showing users or the business actually improved. |
| **Early signal** | The first measurable sign the change is working. |
| **Must not get worse** | Reliability, performance, frustration, or adjacent behavior protected during rollout. |
| **Review point** | The sample, cycle, or date when the agent chooses expand, continue, modify, or stop. |

Include baseline when trustworthy, direction or threshold, source, expected lag, and invalidation condition. Mark unsupported numeric thresholds `provisional`.

Include `Instrumentation: TRUSTED | DEGRADED | UNTRUSTED | UNKNOWN`. An `UNTRUSTED` primary outcome makes repair plus an observed end-to-end recheck a pre-launch gate.

After exposure and the review point, pass this contract to `verify-impact`. Do not declare the experiment successful or unsuccessful from this pre-release brief.

### Evidence behind the recommendation

Keep this compact and below the engineering action:

| Direction | What we observed | Engineering meaning | Relationship | Confidence | Source/window |
| --- | --- | --- | --- | --- | --- |

Use `Helping`, `Hurting`, or `Uncertain`; and `fact`, `correlation`, or `Novus hypothesis`. Plainly separate observability benefits from preventing user failures.

### Assumptions and handoff

List only assumptions that could change the recommendation. End with one next state:

- **Ready to implement** — repository work is sufficiently specified and authorized.
- **Ready to draft** — an issue, guide, flag, or launch can be prepared without live-user effect.
- **Needs authorization** — name the exact production-facing action and audience.
- **Needs one answer** — only when no safe assumption is available; ask one question.

For an autonomous caller, choose one of the first three states whenever possible. Do not end in a generic “ask a PM” state.

## No saved goal

Do not open with a goal-selection table. State the supplied provisional outcome inside **Goal connection**, explain how the experiment tests it, and proceed with the engineering brief. Do not select a different portfolio priority.

Do not invent a target. Use a measurement repair, baseline-establishment task, or directional outcome until the target is supportable.

## Shareable visualization

When explicitly requested, create a standalone `goal-to-experiment-YYYY-MM-DD.html` report with:

1. recommended engineering move and user effect;
2. definition of done and safe rollout;
3. actual trajectory, required pace, baseline, and target when applicable;
4. dated PR, rollout, guide, or incident markers;
5. Helping, Hurting, and Uncertain evidence;
6. evaluation plan, assumptions, sources, and confidence.

Use the right chart for the metric. Keep the file responsive, printable, dependency-free, and useful without interaction. Event markers imply timing, not causality.

## Final check

- The first section tells an engineer what to do and where.
- Product evidence is translated into user and engineering consequences.
- Definition of done includes behavior, tests, and exact instrumentation.
- Existing automatic instrumentation is reused before net-new tracking is proposed.
- Existing work was reused when relevant.
- Observability value is not confused with fewer user failures.
- The rollout and rollback are implementable.
- The evaluation plan uses plain language and a clear decision rule.
- Assumptions are explicit; missing product fields did not become unnecessary questions.
- No production-facing change occurs without authority.
- Numeric splits, thresholds, durations, and guardrails are sourced or explicitly provisional pre-launch decisions.
- Post-release success or failure is delegated to `verify-impact` with the original experiment contract intact.
