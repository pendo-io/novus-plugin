# Build Alignment output contract

Produce one decision surface, not a widget grid or delivery-health report. Route by mode:

- **Review mode:** use the human report contract below.
- **Autonomous steering mode:** use the decision-record contract. Do not generate HTML unless requested.

Never hide coverage gaps that could change the decision.

## Review-mode structure

### Scope and coverage

State the application, analysis window, product areas reviewed, sources used, missing or expired integrations, internal/test filtering, and overall confidence.

### Generated thesis

Lead with one claim-first headline and one short paragraph that answers:

1. Where is the largest meaningful mismatch?
2. Why does it matter to customers or the business?

Use only the few numbers that carry the decision. Do not open with PR count, issue count, cycle time, or generic health statistics.

### Investment map

Show one row per normalized product area:

| Product area | Planned | Built | Experienced problem burden | Outcome trend | Classification | Confidence |
| --- | --- | --- | --- | --- | --- | --- |

Use qualitative low/medium/high labels unless exact allocation is directly supported. Sort by the largest meaningful gap after accounting for strategic bets, platform/reliability work, rollout lag, and data quality.

Allowed classifications:

- planning drift;
- investment misalignment;
- impact failure;
- paying off;
- deliberate bet;
- too early / insufficient evidence.

### Selected-area investigation

Write five connected blocks:

1. **What customers experience**
2. **Who is affected**
3. **What the team planned and built**
4. **Why the mismatch persists**
5. **Recommended bet**

For each material claim, include a link or stable identifier and label it as fact, correlation, or Novus hypothesis when that distinction matters.

### Recommended bet

Make one bet unmistakable. Include:

- **Decision:** What to increase, decrease, or sustain.
- **Tradeoff:** What should move later or remain in place, and why.
- **Why now:** The decisive customer, business, and delivery evidence.
- **Expected movement:** The primary outcome and leading indicator, with direction.
- **First action:** The smallest planning, instrumentation, investigation, or delivery step.
- **Validation window:** When to evaluate the outcome after rollout.
- **Invalidation:** What result should reverse or revise the bet.
- **Confidence:** High, medium, or low, with the missing evidence that would change it.

### Evidence ledger

Keep a compact traceability table:

| Claim | Evidence | Source | Window/status | Confidence |
| --- | --- | --- | --- | --- |

Link sources or preserve stable identifiers. Include only decision-relevant evidence.

### Gaps and cautions

List only limitations that could materially change the investment decision: missing roadmap coverage, weak capability mappings, broken instrumentation, stale or narrow windows, internal traffic, open outcome lag, or conflicting goals.

### Next actions

End with a short sequence:

1. The planning decision to make now.
2. The first work item or investigation to draft.
3. The outcome to review, and when.

Do not create or mutate external work without explicit approval.

## Autonomous steering contract

Write build-alignment-decision.json before changing the internal plan. Validate it with:

    node skills/build-alignment/scripts/validate-steering-decision.mjs build-alignment-decision.json

The record must contain:

- schemaVersion, runId, generatedAt, and mode autonomous-steering;
- scope with application, window, and authorizedObjectiveSet;
- currentObjective with id (string or null), statement, and source; its statement must exactly match one member of authorizedObjectiveSet;
- nullable priorDecision;
- one decision: CONTINUE, NARROW, PAUSE, SWITCH, or ESCALATE;
- a claim-first thesis and high, medium, or low confidence;
- decision-relevant evidence with claim, fact/correlation/hypothesis kind, layer, stable sourceId, window or status, and confidence;
- alternatives as objects with objective, disposition, and reason;
- planDelta arrays for activate, continue, narrow, defer, and addValidation;
- expectedOutcome with direction, leading indicators, invalidation condition, and exactly one of validationDate or validationReason;
- authority.externalMutationsAllowed set to false and requiredApproval set to a string or null;
- nullable escalation details.

Each planDelta item contains objective, statement, and reason, plus nullable id and resumeCondition. objective must exactly match a member of authorizedObjectiveSet; statement describes the resulting internal action.
All five planDelta keys must be present as arrays, including empty arrays.

Decision invariants:

- currentObjective may be null only for ESCALATE when the active objective is absent or ambiguous; authorizedObjectiveSet may be empty only for ESCALATE when the authorization envelope is unknown;
- when more than one objective is authorized, alternatives includes at least one different authorized objective;
- CONTINUE names the current objective in continue.
- NARROW names the current objective in narrow.
- PAUSE names the current objective in defer and gives each deferred objective a resume condition.
- SWITCH activates exactly one different authorized objective, names the current objective in defer, and cites at least two independent evidence layers and sources.
- ESCALATE activates no replacement and states reason, decisionNeeded, and requiredAuthority.
- authority.requiredApproval is non-null only for ESCALATE and names the missing approval.
- A reversal of priorDecision lists materially new evidence.
- Deferred work is never silently deleted.

After validation, apply only the internal plan delta when the host exposes a plan mechanism. If it does not, report the proposed delta without claiming it was applied.

The file, validator input, and reported JSON must be identical. Run the validator against the written file and require exit code 0. Include its exact success line, `Decision record is valid.`, in the response. If validation fails, do not apply the plan delta and do not describe the record as valid.

Return a concise summary:

1. **Decision**
2. **Internal plan change**
3. **Strongest evidence**
4. **Strongest alternative**
5. **Confidence**
6. **Next checkpoint**
7. **Validation**
8. **Escalation**, only when present

Do not lead an autonomous response with portfolio exposition. The decision record preserves traceability; the response should help the running agent act.

## HTML report variant

When writing a shareable file, create one standalone, dependency-free HTML document named `build-alignment-YYYY-MM-DD.html` unless the user provides another name.

Use this visual hierarchy:

1. `BUILD ALIGNMENT` eyebrow, timeframe, application, sources, and coverage.
2. Generated thesis.
3. Investment map with three horizontal bands per area: Planned, Built, and Experienced.
4. Selected-area investigation.
5. A prominent recommended-bet strip.
6. Evidence ledger, method, confidence, and missing coverage.

Design requirements:

- Use a light, calm, analytical document style with readable typography and semantic color only.
- Keep one cohesive investigation; do not create a card-heavy widget grid or 2×2 quadrant.
- Make bars and labels accessible without relying on color alone.
- Never imply false precision through bar lengths. Use categorical scales when the evidence is qualitative.
- Include source links and stable IDs.
- Make the document responsive and printable.
- Avoid external scripts, fonts, and network dependencies.
- Embed the analyzed data and timestamp in the document.
- If interaction is used, preserve the full conclusion in visible HTML so printing and static viewing remain useful.

Return the file path plus the generated thesis and recommended bet in the response.

## Final quality check

Before responding, verify:

- Planned, Built, and Experienced are all distinct.
- The finding is a decision, not a recap.
- Strategic and platform bets were not mislabeled as waste.
- Release and adoption lag were considered.
- Investment does not use surveillance-flavored proxies.
- Highest friction and highest reachable impact were compared.
- Zeros and missing events were checked for instrumentation gaps.
- Facts, correlations, and Novus hypotheses are distinguishable.
- The recommendation beats a named alternative.
- One clear next bet and validation window are present.
