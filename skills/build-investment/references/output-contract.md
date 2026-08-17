# Build Investment output contract

Produce one portfolio investment decision, not a generic delivery dashboard. Never hide a coverage gap that could change the conclusion.

## Scope and coverage

State the application, planning period, customer-experience window, product areas reviewed, sources used, missing or expired integrations, internal/test filtering, and overall confidence.

## Generated thesis

Lead with one claim-first headline and a short paragraph answering:

1. Where is the largest meaningful investment mismatch?
2. Why does it matter to customers or the business?

Use only numbers that carry the decision. Do not open with PR count, issue count, cycle time, or generic health statistics.

## Investment map

Show one row per normalized product area:

| Product area | Related goals | Planned | Built | Experienced problem burden | Outcome trend | Evidence trust | Classification | Confidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

Use qualitative low/medium/high labels unless exact allocation is directly supported. Sort by the largest meaningful gap after accounting for strategic bets, platform/reliability work, rollout lag, and data quality.

Allowed classifications:

- planning drift;
- investment misalignment;
- impact failure;
- paying off;
- deliberate bet;
- too early / insufficient evidence.

`impact failure` and `paying off` require verified audience exposure plus an elapsed outcome window and trustworthy measurement. A merge, completed issue, or intended launch is insufficient. If those gates are missing, use planning drift, investment misalignment, or too early / insufficient evidence.

Use `TRUSTED`, `DEGRADED`, `UNTRUSTED`, or `UNKNOWN` in Evidence trust for the behavioral evidence carrying the row. Direct feedback can establish material burden while a separate adoption metric remains untrusted; describe the distinction.

## Selected-area investigation

Write five connected blocks:

1. **What customers experience**
2. **Who is affected**
3. **What the team planned and built**
4. **Why the mismatch persists**
5. **Recommended bet**

For each material claim, include a stable identifier or link and distinguish fact, correlation, and Novus hypothesis when it matters.

## Recommended bet

Include:

- **Decision:** what to increase, decrease, or sustain.
- **Tradeoff:** what should move later or remain protected.
- **Why now:** decisive customer, business, planning, and delivery evidence.
- **Expected movement:** primary outcome and leading indicator, with direction.
- **Goal connection:** saved goal advanced, protected, or conflicted; use a provisional outcome when none fits.
- **First action:** smallest planning, instrumentation, investigation, or delivery step.
- **Validation window:** when to evaluate after exposure.
- **Invalidation:** what should reverse or revise the bet.
- **Confidence:** high, medium, or low, and the missing evidence that could change it.

Express the tradeoff as a bounded tranche, workstream, or sequence unless an authoritative capacity plan supports an exact percentage. Never manufacture allocation precision from issue counts, PR counts, or qualitative scope bands.

Name a displaced tranche only when it exists in planning evidence and is plausibly movable. When the evidence supports more investment but not its source, write `Tradeoff unresolved at the next planning checkpoint` and name the evidence required to choose it. Do not invent an “uncommitted expansion tranche.”

Name an exact validation date or duration only when planning cadence or expected outcome lag supports it. Otherwise use the next named planning checkpoint, one complete measurement window after verified exposure, or the observable condition that starts evaluation.

Do not imply that the first slice fixes the entire portfolio mismatch. State its direct expected effect and what remains.

## Evidence ledger

Keep a compact traceability table:

| Claim | Evidence | Source | Window/status | Confidence |
| --- | --- | --- | --- | --- |

Include only decision-relevant evidence. Preserve issue keys, initiatives, PRs, artifact IDs, and metric windows.

## Gaps and cautions

List only limitations that could materially change the investment decision: missing roadmap coverage, weak mappings, broken instrumentation, stale or narrow windows, internal traffic, open outcome lag, or conflicting goals.

## Next actions

End with:

1. the planning decision to make now;
2. the first work item or investigation to draft;
3. the outcome to review and when.

Do not mutate external systems without explicit authorization.

## Goal-to-experiment handoff

When the caller asks to continue into experiment design, pass:

- `selectedOutcome`: the exact portfolio bet or provisional outcome;
- `goalId`: the directly related saved goal, or null;
- `decisionSource`: `build-investment`;
- `whySelected`: why this mismatch beat the strongest alternative;
- `evidence`: stable IDs and windows for the decisive portfolio evidence;
- `constraints`: protected investments, deferred scope, authority, and must-not-regress conditions;
- `validationWindow`: when the bet should be evaluated after exposure;
- `invalidationCondition`: what would reverse or revise the bet.

Show this block only when the caller requests the handoff or experiment brief. Do not make it a second portfolio recommendation.

## Lifecycle handoffs

- Use `verify-instrumentation` when a decision-critical measure is disputed, zero, or structurally incomplete.
- Use `stress-test-plan` when a concrete plan already exists for the selected bet and its mechanism has not been challenged.
- Use `goal-to-experiment` when the selected outcome needs a reversible rollout and evaluation contract.
- Use `verify-impact` after exposure to determine whether the funded change worked.

Offer only the immediate next gate.

## HTML report

When the host can write files, create one standalone dependency-free document named `build-investment-YYYY-MM-DD.html` unless the caller provides another name.

Use this hierarchy:

1. `BUILD INVESTMENT` eyebrow, timeframe, application, sources, and coverage;
2. generated thesis;
3. investment map with Planned, Built, and Experienced bands;
4. selected-area investigation;
5. prominent recommended-bet strip;
6. evidence ledger, method, confidence, and missing coverage.

Use a light, calm, analytical, responsive, and printable design. Avoid card-heavy widget grids and false-precision bars. Make labels accessible without relying on color. Use no external scripts, fonts, or network dependencies. Keep the full conclusion visible for static and printed use.

Return the report path plus the generated thesis and recommended bet.

## Final check

- Planned, Built, Experienced, and shipping state are distinct.
- Saved goals are treated as strategic intent, not proof of impact.
- The finding is a decision, not a recap.
- Strategic, platform, reliability, and compliance bets were not mislabeled as waste.
- Release and adoption lag were considered.
- Investment avoids surveillance-flavored proxies.
- Highest friction and highest reachable impact were compared.
- Missing events and zeros were checked for instrumentation gaps.
- Decision-critical behavioral evidence carries an explicit instrumentation-trust verdict.
- Facts, correlations, and hypotheses are distinguishable.
- The recommendation beats a named alternative.
- One clear investment bet and validation window are present.
- The first slice's direct effect is separated from the broader mismatch.
- Exact capacity percentages appear only when an authoritative capacity plan supports them.
- Impact classifications pass the exposure, lag, and measurement gates.
- The named tradeoff is evidenced; otherwise its unresolved planning decision is explicit.
