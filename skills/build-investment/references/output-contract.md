# Build Investment output contract

Produce one portfolio investment decision, not a delivery dashboard. The reader should immediately understand where customers are struggling, where movable engineering investment is going instead, and the focus change that closes that gap.

## Default focus brief

Return a response-only engineering brief of **180–260 words**, capped at **300 words**. Do not create an HTML report or standalone file.

Lead with a claim-first headline or opening sentence that names the focus change and the work that moves later or remains sustained. Within the first 100 words, state both sides of the allocation gap:

- the product path where customers are struggling and the concrete failure mode;
- the material workstream currently receiving movable investment and what it builds.

Use two or three plain headings when useful:

1. **Where investment is misaligned** — contrast customer burden with current investment. Do not merely label it a mismatch.
2. **What should change** — name one focus shift, the direct work involved, what moves later, and what remains protected.
3. **Why this focus** — explain why it beats the strongest alternative and give one short success check.

Do not require the phrase `Bottom line`. The recommendation itself should do that work.

## Engineer-to-engineer writing rules

- Use active, concrete language. Sound like an engineer explaining a sequencing call to another engineer.
- Describe work before citing it. Write `preserve fields that the builder does not model (INT-376)`, not `finish INT-376`.
- Put issue keys, PR numbers, artifact IDs, and links in parentheses as supporting evidence. The brief must make sense without Linear, Jira, or GitHub open.
- Explain what the current investment builds and why it does not address the customer failure.
- Use only one to three metrics that materially change the decision.
- Keep implementation detail to the smallest concrete description needed to understand the workstream.
- Keep validation to one sentence unless measurement confidence changes the recommendation.
- Avoid methodology, taxonomy, classifications, exhaustive coverage notes, long checklists, and generic portfolio language.
- Avoid consultancy phrasing such as `value unlock`, `decision surface`, `the seam`, `bounded tranche`, or `close the delta`.

## Required decision content

The brief must cover:

- **Focus:** what should receive more, less, or sustained investment.
- **Customer gap:** the observed product path, failure mode, and reachable audience.
- **Current investment:** the workstream absorbing movable capacity and what it delivers.
- **Change:** the smallest coherent workstream that should move next.
- **Tradeoff:** the described work that moves later and the work that remains protected.
- **Alternative:** the strongest competing focus and why it loses now.
- **Check:** the outcome to inspect after verified exposure and one supported measurement window.
- **Confidence:** one sentence naming the limitation most likely to change the decision.

Do not render these as a field-by-field template. Write a short, connected brief.

## Reference style

Treat identifiers as citations, not nouns:

> Stop chat edits from clearing step fields the model does not resend (INT-378).

Avoid:

> Complete INT-378.

When several records support one workstream, describe the work once and group the references in parentheses.

## Detailed analysis

Only when the caller explicitly requests detail, put the focus brief first and add a Markdown appendix. The appendix may contain:

- the full product-area investment map;
- planned, built, experienced, and shipping-state evidence;
- the selected-area investigation;
- the goal audit;
- the evidence ledger and coverage limitations.

Do not create a separate report file. Do not let appendix detail change the singularity of the recommendation.

## Evidence and trust

- Use a credible estimate or capacity denominator before stating allocation percentages.
- Never use raw PR, commit, line, issue, or hour counts as effort proxies.
- Use qualitative workstream concentration when estimate coverage is weak.
- Carry `TRUSTED`, `DEGRADED`, `UNTRUSTED`, or `UNKNOWN` internally for decision-critical behavior; expose the verdict only when it changes the recommendation.
- Do not call shipped work successful or failed without verified exposure, elapsed lag, and trustworthy outcome measurement.
- Treat missing instrumentation as missing evidence, not zero demand or impact.

## Goal-to-experiment handoff

When the caller asks to continue into experiment design, pass:

- `selectedOutcome`: the exact portfolio bet or provisional outcome;
- `goalId`: the directly related saved goal, or null;
- `decisionSource`: `build-investment`;
- `whySelected`: why this focus beat the strongest alternative;
- `evidence`: stable IDs and windows for decisive evidence;
- `constraints`: protected investments, deferred scope, and must-not-regress conditions;
- `validationWindow`: when to evaluate after exposure;
- `invalidationCondition`: what would reverse or revise the bet.

Show this only when requested. Do not make it a second portfolio recommendation.

## Final check

- The opening names the focus change.
- Customer struggle and current movable investment are both clear within the first 100 words.
- The recommendation answers “are we investing in the right place?” rather than summarizing product health.
- Work descriptions come before ticket or PR references.
- The displaced and protected work are explicit.
- The strongest alternative is named.
- No more than three decision-carrying metrics appear.
- The default response is 180–260 words and at most 300.
- No HTML or standalone report is produced.
