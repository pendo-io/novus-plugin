---
name: build-impact
description: Explain what a team's shipped improvements add up to for customers in a product area, why they matter, and what evidence supports their value. Also use to verify a specific change, launch, or experiment, or when a builder explicitly requests an individual impact report. Portfolio allocation belongs to build-investment.
---

# Build Impact

The default report is **Build Value**: what the team built, what it enables for customers, and whether the evidence supports the intended benefit. Keep the `build-impact` command for both this product-area review and specific impact decisions.

## Choose the scope

- **Product area or team work (default):** explain the value of related improvements over a defined period. Include contributions across the team. Weekly reports and Slack requests use this scope unless the caller names a person or specific change.
- **Specific change or rollout decision:** evaluate the named PR, launch, experiment, or feature and recommend one next action.
- **Individual contribution (explicit request only):** relate the person's exact PRs to the customer experience. Distinguish their contribution from team ownership; never assign them an area-wide result without supporting evidence or compare individual productivity.

Read [references/output-contract.md](references/output-contract.md) for the selected report shape and apply its Tiffany-style pass. Every output includes its own title, plain-language purpose, and short headings, so it makes sense outside the chat. All views share the evidence checks below. Keep connected systems read-only unless the surrounding task separately authorizes a change.

## 1. Resolve the work and the customer job

Identify one application, product area or customer workflow, delivery period, and outcome window. Use the caller's scope; otherwise use the most recent complete 30 days of delivery and an exposure-appropriate outcome window. Resolve ambiguity from available context before asking. Do not mix applications.

Read [references/evidence-map.md](references/evidence-map.md). Map PRs, completed issues, launches, artifacts, and product memory to the customer experience. Include linked dependencies outside the period when needed to understand it, and label them separately. Preserve each included PR and its release evidence in linked sources.

Treat the current checkout as context, not the release boundary. A feature branch, including one based on another feature branch, can contain work that customers have never received. Verify the target branch and release trail separately. If the named person's work is all unreleased or outside the window, say so; do not substitute team work and call it their impact. For a team report, include all relevant contributors without requiring separate personal runs.

Establish:

- who has the problem and what they are trying to accomplish;
- what became possible, easier, faster, or more reliable;
- the stated reason for the work, from a goal, issue, customer feedback, or the caller;
- the intended outcome, early indicator, guardrails, and baseline or comparison;
- who could encounter the changes and when a benefit could reasonably appear.

Use related saved goals as intent, not proof of impact. If the rationale or target was never recorded, label the reconstructed reasoning as a hypothesis. Do not invent a goal, success threshold, customer request, or business commitment. Check whether customer-feedback sources are available before claiming what customers asked for.

## 2. Explain what the improvements add up to

Group work by a shared customer job or dependency, rather than by contributor, folder, or date. Explain the connection in plain language: **changes → different customer experience → expected benefit**.

Distinguish improvements that remove separate annoyances from those that complete a workflow or make it consistent across surfaces. Look for a remaining step that prevents the combined benefit. If the work does not form a coherent experience, say so and report the supported benefits separately.

Explain why the benefit matters to the affected customers. Reduced effort, fewer errors, reliability, and completing a task can be valuable even when usage does not grow. Treat customer requests as evidence of a problem, not proof that the solution worked. Do not jump from adoption to satisfaction, retention, or revenue without evidence for each link.

Keep these judgments distinct throughout the report:

- **Product rationale:** why the work could help, and whose stated intent or evidence supports that explanation.
- **Observed outcome:** what customers actually did or reported.
- **Attribution:** how strongly the comparison supports assigning that result to the changes, including competing explanations.

A useful product rationale can be reported while measured impact remains unverified. It can also be weak, contradicted, or incomplete. Do not write a justification merely because the work shipped.

## 3. Verify release and measurement

Stop at the last proven state: **proposed**, **merged**, **exposed**, or **measured**. A merge, closed issue, or existing flag does not prove exposure. Resolve deployment/version, targeting, rollout start, and competing releases when material.

For several changes, preserve their separate exposure dates and eligible populations. A common date is appropriate when exposure on that date is verified for every included change. If one benefit required several changes released at different times, evaluate that combined benefit from the final required exposure date without applying it retroactively to earlier adoption. Never sum overlapping account or user counts across features to claim total reach.

When a conclusion depends on Pendo behavioral data, reuse a current `verify-instrumentation` verdict or run that skill when available. Otherwise perform the same read-only check from the evidence map: arrival, recognition, definition, continuity, audience, and decision-critical coverage. Carry `TRUSTED`, `DEGRADED`, `UNTRUSTED`, or `UNKNOWN` for each decision-critical measure. Aggregate metrics alone cannot establish trust.

An unknown or untrusted primary outcome yields `CANNOT VERIFY`. A degraded measure supports only a conclusion its limitations cannot reverse. Missing instrumentation is missing evidence, not zero use. Keep measurement confidence separate from causal confidence; do not invent a numeric confidence score.

Check visitor/account-ID migrations and changes to organization or event definitions. An identity migration can make existing people appear new and inflate unique counts, acquisition, or retention. Omit invalidated growth headlines; a later caveat does not make them usable. Compare stable post-change windows or a verified reconciliation, and disclose when neither is available. Check account metrics independently rather than assuming they survived a visitor-ID change.

## 4. Interpret the outcome

Answer what adoption means using a matching denominator: eligible customer accounts or users who had access and an opportunity to encounter the relevant workflow during the same window. Keep units consistent. Show counts with percentages and distinguish this denominator from all active app users. If eligibility is unknown, report the count and the gap without grading adoption as good or bad.

Select the measures that reflect the intended benefit: adoption, successful completion, repeat use, time or effort, errors, reliability, or customer feedback. For repeat use, include only cohorts with enough follow-up. Interpret frequency against the natural frequency of the task; a rarely needed feature need not be used weekly to be valuable.

Compare with a saved target, relevant baseline, or comparable exposed cohort when available. Without one, describe the evidence and its limits rather than inventing a benchmark. More clicks may mean more effort, and fewer clicks may mean a task became easier.

Prefer a credible concurrent treatment/control or staged-rollout comparison. Otherwise use matched, exposure-anchored windows and disclose material differences in audience, internal/test/bot traffic, seasonality, sample size, instrumentation, or overlapping releases. A clean measure does not establish causation. Label descriptive post-release movement as an association.

Search relevant Novus signals and available customer feedback to explain the result and select the next check. Several summaries of one source are one source. Small qualitative samples can explain a problem but do not establish prevalence.

## 5. Give the supported conclusion

Read [references/output-contract.md](references/output-contract.md) immediately before writing. For a Build Value report, lead with the product benefit or unresolved problem, then state what is and is not supported. Do not force one verdict over unrelated improvements. Use the following gates for each material outcome claim and for the single verdict in a specific-change decision:

- **WORKED:** verified exposure, elapsed outcome window, trustworthy improvement in the intended outcome, and acceptable guardrails. State whether attribution is causal or observational.
- **PARTIAL:** the same exposure and measurement checks support a real benefit, but scope, outcome, or guardrails limit it.
- **DID NOT WORK:** trustworthy evidence after exposure and the expected window shows no intended improvement or a decisive guardrail failure.
- **TOO EARLY:** exposure and decision-fit measurement are verified; only the outcome window is incomplete.
- **CANNOT VERIFY:** exposure, measurement, comparison, or outcome evidence is insufficient. This includes a merged change with no verified exposure.

For Build Value, choose one useful next check or action without prescribing portfolio allocation. For a specific-change decision, recommend one of `expand`, `continue`, `modify`, `rollback`, or `repair measurement`, explain why, and name the review condition and evidence that would change the verdict. If exposure is unknown, `continue` can mean verify rollout before making a rollout recommendation; it must not imply continuing an unverified deployment.

## Audience and delivery

Team reports explain customer value and what the team learned. Investment tradeoffs belong in a separate leadership review with `build-investment`. Prepare individual reports privately and let the recipient decide whether to share; do not broadcast recognition or infer permission to send anything.

A Slack-shaped response does not create a schedule or send a message. If an authorized recurring workflow invokes the skill, prefer a short spotlight when new outcome evidence, a material anomaly, or a named review point warrants it. Avoid repeating unchanged findings when prior reports are available. Do not promise monitoring or persistent memory that the host has not configured.

## Missing evidence and boundaries

- **Novus unavailable:** reconstruct delivery and intent from available sources. Label the customer-value explanation as provisional and identify the evidence needed to evaluate it.
- **No rollout evidence:** stop at the verified shipping state and use `CANNOT VERIFY` for impact.
- **No planning or feedback source:** use available intent, disclose the gap, and keep unrecorded rationale provisional.
- **Broken measurement:** identify the smallest exact repair and proof needed before interpreting the outcome.
- **Conflicting evidence:** show the conflict and limit the conclusion to what remains supported.

Do not choose unrelated work, allocate a portfolio, design a pre-ship experiment, or add instrumentation. Use `whats-next`, `build-investment`, or `usage-brief` for those adjacent questions as appropriate.
