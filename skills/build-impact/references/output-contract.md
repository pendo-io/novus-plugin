# Build Impact output contract

## Write plainly

Write for an engineering reader who wants to understand the product consequence. Lead with what customers can do, what became easier, or what remains unresolved. Use complete sentences, short paragraphs, and headings only when they help scanning.

Describe changes before citing PRs or issues. Use concrete verbs and keep technical detail only when it explains the outcome. Avoid em dashes, decorative emoji, canned praise, dramatic fragments, and phrases such as "value unlock," "transformative impact," or "this isn't X, it's Y." Do not announce that an insight matters; explain its consequence. Keep caveats beside the claims they qualify.

Read [examples.md](examples.md) when calibrating a product-area report. The examples are synthetic and cannot supply evidence for a live report.

## Build Value: default product-area report

Title the report **Build Value · <product area or team scope> · <period>**. Aim for 180–260 words; a short Slack spotlight can be 100–160 words. Expand when the caller requests detail and honor a requested audience format. Prefer a few connected paragraphs to a changelog or metric inventory.

Cover these questions in order, using the headings only when useful:

1. **What the work adds up to.** State the shared customer job and the benefit or remaining gap. Explain how the related improvements contribute, who benefits, and the source of the rationale. Mark an inferred benefit as provisional. Do not open with an individual's name or a list of PRs.
2. **What the evidence says.** Select one to three measures or observations that help judge that benefit. Interpret adoption with counts, matching units, eligible population, and window. Add completion, repeat use, efficiency, reliability, or feedback when relevant. Distinguish customer statements from measured behavior.
3. **The conclusion and next check.** Say what is supported, what is still unknown, and the evidence needed next. A plausible rationale is useful even when impact cannot be verified. A weak rationale or incomplete workflow should be stated directly.

State the last verified shipping state, relevant exposure date(s) or missing exposure evidence, audience, outcome window, and measurement limitation compactly in the prose or a source note. Put the instrumentation verdict before interpreting behavioral measures. For example, `Measurement: trusted for eligible accounts and filter use; completion is not tracked.` This does not imply that causality is established.

Use a common release date when exposure on that date is verified for all included changes. For staggered releases, show the relevant range or dates and keep per-change details in sources. If a benefit required all changes, state when the final dependency became available and evaluate the combined benefit from that point. Keep every included PR, issue, release, artifact, signal, and metric window traceable through inline links or a compact source list. Link detailed evidence when a long list would overwhelm the spotlight; never invent a source URL.

Apply the verdict gates in `SKILL.md` to measured impact claims. Express the conclusion naturally, such as `Repeat use supports a recurring need; faster completion is still unproven.` Do not attach one success label to a mix of unrelated changes or claim retention or revenue benefit from adoption alone.

Choose one next check or action the audience can use. Team reports should not tell builders to abandon agreed priorities. If the finding raises an allocation question, recommend a separate leadership review without inventing the displaced work.

## Specific-change decision

For a named change, rollout, rollback, or experiment evaluation, title the response **Build Impact · <change>** and lead with one verdict. Follow with the proof, intended outcome, attribution limits, and one action: `expand`, `continue`, `modify`, `rollback`, or `repair measurement`.

Use the same release, measurement, population, and citation requirements as Build Value. Name the review condition and evidence that would change the decision. Do not force an expansion or rollback recommendation when rollout itself is unverified; identify that missing proof as the next check. The action is a recommendation, not authorization to change production.

## Individual contribution: explicit request only

Title the report **Build Impact · <person>**. Aim for 130–180 words. Explain the customer experience their exact contributions helped enable, then the supported outcome and next check. Keep the broader team contribution visible. Do not infer personal productivity, rank people, or assign a shared outcome to one person.

Prepare this as a private response. A request for analysis does not authorize posting it or sending a DM. Use the shared evidence requirements and qualify the opening benefit when it has not been observed.

## Final check

- The report uses the requested scope and explains who benefits and how.
- The combined benefit follows from connected work, not a forced story.
- Reported demand, product rationale, observed outcome, and causal attribution are distinguishable.
- Counts, denominators, windows, and follow-up opportunities match; overlapping populations are not added together.
- Measurement confidence does not stand in for causal confidence.
- A missing exposure record yields `CANNOT VERIFY`; `TOO EARLY` means only the outcome window is incomplete.
- The next check follows from the finding, and the report claims no delivery or automation that has not occurred.
