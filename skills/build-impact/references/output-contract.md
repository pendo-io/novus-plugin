# Build Impact output contract

## Tiffany writing style

When `tiffany-style` is available, read and apply it before drafting. The rules here remain usable when that personal skill is not installed. Write for an engineering reader who wants to understand the product consequence. Lead with what customers can do, what became easier, or what remains unresolved. Use complete sentences, short paragraphs, and the report headings below.

Describe changes before citing PRs or issues. Use concrete verbs and keep technical detail only when it explains the outcome. Avoid em dashes, decorative emoji, canned praise, dramatic fragments, and phrases such as "value unlock," "transformative impact," or "this isn't X, it's Y." Do not announce that an insight matters; explain its consequence. Keep caveats beside the claims they qualify.

Before returning the report, make one read-aloud pass. Replace analytical labels with what happened to the customer: “the number and explanation can disagree” rather than “decision consistency is degraded.” Say “we have not confirmed customers received the fix” rather than “production exposure remains unverified.” Keep each material limitation to a direct sentence beside its claim; retain supporting detail in sources. Leave unusable numbers out of the main report rather than listing and retracting them. Remove repeated conclusions and sentences that do not explain the benefit, evidence, or next check.

Read [examples.md](examples.md) when calibrating a product-area report. The examples are synthetic and cannot supply evidence for a live report.

## Build Value: default product-area report

Title the report **Build Value · <product area or team scope> · <period>**. Directly below it, add **What the team built and why it matters to customers.** Keep the title and purpose inside the reusable report, not only in the surrounding chat. Aim for 180–260 words; a short Slack spotlight can be 100–160 words. Expand when the caller requests detail and honor a requested audience format.

Use these three headings (bold labels in short Slack reports). The first sentence under **What changed** states the supported customer benefit or remaining problem; a separate executive-summary paragraph is unnecessary:

1. **What changed:** connect the team's improvements to the customer job. Explain who benefits and how, with the source of the rationale. Mark an inferred benefit as provisional. Use short bullets when several changes are easier to scan that way.
2. **What we know so far:** select one to three measures or observations that help judge the benefit. Interpret adoption with counts, matching units, eligible population, and window. Distinguish customer statements from measured behavior. If impact is unknown, state the reason directly without replacing the report with an instrumentation audit.
3. **What to check next:** give the supported conclusion and one useful next check. A plausible rationale is useful even when impact cannot be verified. State weak reasoning or an incomplete workflow directly.

When a caller requests another format, preserve the title, purpose, and these three questions within it.

State the last verified shipping state, relevant exposure date(s) or missing exposure evidence, audience, outcome window, and measurement limitation compactly in the prose or a source note. Put the instrumentation verdict before interpreting behavioral measures. For example, `Measurement: trusted for eligible accounts and filter use; completion is not tracked.` This does not imply that causality is established.

Use a common release date when exposure on that date is verified for all included changes. For staggered releases, show the relevant range or dates and keep per-change details in sources. If a benefit required all changes, state when the final dependency became available and evaluate the combined benefit from that point. Keep every included PR, issue, release, artifact, signal, and metric window traceable through inline links or a compact source list. Link detailed evidence when a long list would overwhelm the spotlight; never invent a source URL.

Apply the verdict gates in `SKILL.md` to measured impact claims. Express the conclusion naturally, such as `Repeat use supports a recurring need; faster completion is still unproven.` Do not attach one success label to a mix of unrelated changes or claim retention or revenue benefit from adoption alone.

Choose one next check or action the audience can use. Team reports should not tell builders to abandon agreed priorities. If the finding raises an allocation question, recommend a separate leadership review without inventing the displaced work.

## Specific-change decision

For a named change, rollout, rollback, or experiment evaluation, title the response **Build Impact · <change>** and lead with one verdict. Follow with the proof, intended outcome, attribution limits, and one action: `expand`, `continue`, `modify`, `rollback`, or `repair measurement`.

Include the purpose line **Did this change deliver the intended customer outcome?** Use **Result**, **Evidence**, and **Next step** as short headings.

Use the same release, measurement, population, and citation requirements as Build Value. Name the review condition and evidence that would change the decision. Do not force an expansion or rollback recommendation when rollout itself is unverified; identify that missing proof as the next check. The action is a recommendation, not authorization to change production.

## Individual contribution: explicit request only

Title the report **Build Impact · <person>**. Aim for 130–180 words. Explain the customer experience their exact contributions helped enable, then the supported outcome and next check. Keep the broader team contribution visible. Do not infer personal productivity, rank people, or assign a shared outcome to one person.

Include the purpose line **How this person's work contributed to the customer experience.** Use **Contribution**, **What we know so far**, and **Next check** as short headings.

Prepare this as a private response. A request for analysis does not authorize posting it or sending a DM. Use the shared evidence requirements and qualify the opening benefit when it has not been observed.

## Final check

- The report uses the requested scope and explains who benefits and how.
- The combined benefit follows from connected work, not a forced story.
- Reported demand, product rationale, observed outcome, and causal attribution are distinguishable.
- Counts, denominators, windows, and follow-up opportunities match; overlapping populations are not added together.
- Measurement confidence does not stand in for causal confidence.
- A missing exposure record yields `CANNOT VERIFY`; `TOO EARLY` means only the outcome window is incomplete.
- The next check follows from the finding, and the report claims no delivery or automation that has not occurred.
