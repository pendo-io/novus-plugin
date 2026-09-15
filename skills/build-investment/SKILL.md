---
name: build-investment
description: Use when a leader asks whether engineering investment is going to the right goals or product areas, whether to sustain or change that investment, or needs a planning-cycle or portfolio review. Explaining the value of a team's shipped improvements belongs to build-impact.
---

# Build Investment

Answer one portfolio question: **Are we investing engineering effort where it can create the most customer and business value?** Lead with the most consequential conclusion the evidence supports: **sustain, increase, redirect, reduce, or defer judgment**. A supported decision to stay the course is a useful result. Do not require a mismatch or invent work to delay.

## Voice and audience

Write for an engineering or product leader making a scope and sequencing decision. Lead with the recommendation and explain who benefits, what the work enables, why the evidence supports it, and what could change the decision. Use plain sentences and short paragraphs. Avoid em dashes, decorative emoji, canned praise, dramatic fragments, abstract framework language, and manufactured contrasts such as "this isn't X, it's Y."

Describe work before citing its record. Keep PRs and issue keys as supporting references; the brief should make sense without opening a planning tool. Use one to three measures that carry the decision. Aim for 180–260 words, at most 300 unless the caller asks for detail. Read [references/output-contract.md](references/output-contract.md) before writing and apply its Tiffany-style pass. Identify the report as Build Investment, state the question it answers, and use its required headings to compare engineering effort with customer needs before the next decision. Keep this investment comparison central; Build Value is the separate explanation of what completed work adds up to.

## Operating rules

- Use real evidence. Never invent allocation, pain, strategy, roadmap intent, shipping state, targets, or causality.
- Keep connected systems read-only. This skill recommends a decision; it does not change issues, goals, code, deployments, or production.
- Assess investment at team or product-area level, never individual productivity. Use connected scope, complexity, rework, and maintenance/feature/platform context rather than lines, commits, raw PR or issue counts, or hours as effort proxies.
- Use allocation percentages only with a credible estimate or capacity denominator. Keep planned capacity separate from completed-scope share, state coverage, and preserve unmapped work. With weak coverage, name the material workstreams qualitatively. Do not prescribe capacity percentages without an authoritative plan.
- Respect platform, reliability, compliance, strategy, and ahead-of-demand work when evidence supports their intent. A leader's rationale is strategic context to test; it does not prove customer impact.
- Account for rollout, adoption lag, measurement trust, and employee/test/bot traffic. Missing instrumentation is missing evidence, not zero demand.

## Evidence boundary

Treat sources named in the current request as the complete evidence boundary. If the caller asks for Novus, GitHub, and Linear, use only those sources. Do not carry meeting notes, prior transcripts, personal memory, ambient UI, or evidence from an earlier request into the brief unless the caller explicitly includes or authorizes them for this run. A Linear issue or GitHub PR that names a customer can support only what that record says; it does not authorize retrieving the customer's meeting or attributing additional statements to a person.

Before drafting, keep a short internal source ledger: each customer statement, strategic rationale, planning fact, delivery fact, and measure must map to an allowed source. A link to a source outside the boundary proves only that the link exists. If the named sources do not contain the strategy or customer rationale needed for a confident recommendation, say so and defer only the affected judgment. Cite the allowed source that supports each attribution.

## 1. Set scope and evidence coverage

Resolve one application, portfolio scope, planning period, and customer-experience window. Accept a product area, goal, initiative, team, quarter, or cycle. Otherwise use the most recent complete 30 days for customer experience and the current cycle or quarter for planned and built work. Do not combine applications.

Read [references/evidence-map.md](references/evidence-map.md). Check Novus coverage and both Novus-native and direct Linear/Jira connectors. Deduplicate the same issue by stable ID or key. If Novus is unavailable, give a preliminary planning-and-delivery view and the customer evidence needed; do not conclude that customer-value alignment is right or wrong.

## 2. Map areas, goals, and customer needs

Use Novus product areas, product memory, goals, launches, and artifact relationships to map roadmap work, repositories, surfaces, and customer language. Keep an unmapped bucket with reasons rather than forcing platform or cross-cutting work into an area.

For each relevant goal, record intended outcome, target or direction, deadline, related areas and launches, current trajectory, and measurement quality. A saved goal establishes intent, not impact. If no saved goal fits, keep the outcome provisional without creating one.

Read strategic context supplied by the caller or available in relevant initiative documents and recent product or leadership decisions. Use a bounded set tied to this investment question; if the caller names a period of meetings, use that period. Record the intended audience, strategic shift, effective date, fixed commitments, and which targets it supersedes. Reconcile stale tracker dates and statuses against current decisions rather than treating every dated project as current intent. An expired native integration can fall back to an available direct connector.

When a current audience differs from the intended future audience, do not optimize only the old cohort's metrics. State what the strategy intends to change and what future evidence would test it. If missing context could reverse the recommendation, name the assumption and ask one focused question or defer the affected judgment while completing the supported analysis. When the user supplies a correction, revise the conclusion and state what changed; do not claim the correction is saved for future runs unless the host actually preserves it.

Identify which customer jobs each investment serves. Where UI, agent, and MCP investments compete, examine actual audience needs, task completion, migration readiness, commercial commitments, and shared dependencies. These populations may overlap. Current UI use does not settle future strategy, and growing agent use does not make UI work wasteful.

## 3. Compare planned, built, and experienced work

Gather a broad inexpensive view, then deepen the strongest one to three investment questions:

- **Planned:** active initiatives, projects, priorities, estimates, intended capacity, and commitments. Distinguish backlog from planned or in-flight work.
- **Built:** completed scope, complexity, planned-versus-interrupt work, rework, and feature/maintenance/platform classification.
- **Experienced:** adoption, completion, efficiency, reliability, frustration, feedback, account reach, and outcome movement.
- **Shipping:** proposed, merged, exposed, or measured. Stop at the last proven state.

Keep unreleased feature-branch work visible as planned or in-flight scope without attributing production outcomes to it. Verify release state separately from the active checkout, including branches based on other feature branches. Separate the next movable decision from a locked release commitment; a portfolio review can affirm the release plan and inform the next open decision.

Group related small improvements by the customer job they jointly support. Use a current Build Value report from `build-impact` when available and verify that its scope and evidence are still applicable. Distinguish completing a workflow from adding isolated conveniences. Low growth does not imply low value when the goal is less effort, fewer errors, or reliable completion.

Assign `TRUSTED`, `DEGRADED`, `UNTRUSTED`, or `UNKNOWN` to each decision-critical behavioral measure. Reuse a current `verify-instrumentation` check when available; otherwise inspect arrival, recognition, definition, continuity, audience, and required flow coverage. Before judging shipped work successful or failed, verify exposure, elapsed outcome window, trustworthy measurement, outcome movement, guardrails, and competing changes. A trusted metric alone does not establish causality.

Check changes to visitor IDs, account IDs, organization definitions, and event semantics before interpreting trends. Exclude invalidated growth and retention comparisons from the recommendation, rather than leading with them and adding a disclaimer. Use a verified reconciliation or stable comparable windows; otherwise state the limitation and defer any allocation claim that depends on those measures.

Compare in both directions:

- Which goals and customer needs receive meaningful investment?
- Which important goals lack delivery support?
- Which work lacks recorded intent, and could missing strategic context explain it?
- Which investments reinforce each other, duplicate effort, or compete for the same constrained capacity?

Useful conclusions include planning drift, investment misalignment, paying off, impact failure, deliberate bet, and insufficient evidence. Do not force every area into a problem category. Use paying off or impact failure only after the exposure and measurement gates; describe observational relationships as associations. Missing exposure or measurement cannot establish impact failure.

## 4. Reach one investment conclusion

Select the question with the strongest combination of material customer consequence, reachable audience, evidence quality, and a real planning decision. Do not select solely by the largest percentage drop, signal count, or busiest code area.

Explain what customers experience, what the work enables, why current investment fits or misses the need, and the uncertainty most likely to change the conclusion. Separate facts, customer statements, strategic intent, and hypotheses. Preserve stable issue, PR, artifact, release, and metric-window references.

Choose one direction:

- **Sustain:** explain why the current focus remains justified and what would cause reconsideration. Do not require displaced work.
- **Increase or redirect:** name the next coherent workstream, protected work, and the actual planned or movable work that would fund it. Compare with the strongest supported alternative.
- **Reduce:** explain what outcome no longer justifies the next increment of work, what would be reduced, and what commitments remain protected. Do not imply that removing an investment is free.
- **Defer judgment:** identify the unresolved evidence or strategic choice and the smallest step to resolve it. Do not disguise uncertainty as an allocation recommendation.

When a change is supported but no funding source is visible, state that the direction is supported and the exact displacement remains a leadership decision. Lower confidence accordingly. For sustain or defer judgment, do not invent an alternative or a tradeoff to fill a template.

Name the outcome or goal, next action, review condition, and evidence that would reverse the conclusion. Use a supported planning checkpoint or outcome lag; never invent a cadence or exact duration. Frame allocation as a leadership decision rather than a broadcast instruction for builders to switch tasks.

## 5. Write the brief

Read [references/output-contract.md](references/output-contract.md) immediately before writing. Default to a response-only focus brief that can be included in an existing product-meeting pre-read or leadership workflow. When the caller requests an artifact, document, or different audience format, use that format and preserve the evidence and decision limits. Do not create files, publish, or schedule delivery merely because the skill ran. Keep experiment design, detailed plan review, and individual impact evaluation outside this skill.

## Missing evidence

- **No planning source:** compare Built with Experienced and say roadmap intent is unconfirmed. Do not infer planned investment from repository activity.
- **No GitHub:** use completed issues and PR provenance already in Novus; lower confidence in delivery scope and release state.
- **Sparse area mapping:** disclose provisional mappings and unmapped work.
- **Broken analytics:** identify the smallest exact measurement repair and the proof needed before interpreting the measure.
- **Sparse or conflicting evidence:** show the material gap or contradiction, prefer direct current evidence, and defer judgment when it could reverse the recommendation.
- **Tool failure:** retry a failed read once, then use remaining evidence and disclose the limitation.

Use `build-impact` for product-area value or post-release outcome review and `whats-next` for one builder's next move. Do not evaluate individual performance, automatically manage a backlog, or make deployment decisions.
