---
name: build-investment
description: Use when a leader asks whether engineering investment is going to the right goals or product areas, where to invest more or less, or needs a roadmap-versus-reality, planning-cycle, quarterly allocation, or post-ship portfolio review. Not for choosing one builder's next task or designing an experiment for an already selected outcome.
---

# Build Investment

Answer one portfolio question: **Are we investing engineering effort where it can create the most customer and business value?** Lead with the largest meaningful mismatch and recommend one investment bet.

## Voice and narrative

Write like an engineer briefing another engineer who needs to make a scope and sequencing decision. Make the investment takeaway obvious immediately:

1. **Where customers are struggling:** name the product path and concrete failure mode.
2. **Where the team is investing instead:** name the material current work and what it builds.
3. **What should change:** name one focus shift, what moves later, and what remains protected.
4. **Why this focus wins:** compare it briefly with the strongest alternative.

The default response is a **180–260 word focus brief**, capped at **300 words**. The first paragraph or claim-first headline must say what to focus on and what to delay or sustain. Within the first 100 words, state both sides of the allocation gap: customers are struggling in one place while movable engineering investment is going somewhere else.

Use two or three plain focus-area headings when they improve scanning, such as `Where investment is misaligned`, `What should change`, and `Why this focus`. Do not use `Bottom line` as a required label. Do not turn the brief into a specification, implementation plan, methodology recap, or evidence dump.

Describe work before citing its record. Write `stop builder rebuilds from deleting unmodeled fields (INT-376)`, not `finish INT-376`. Treat issue keys, PR numbers, artifact IDs, and links as supporting references in parentheses; the brief must remain understandable when no planning tool is open.

Prefer concrete engineering language: `workstream`, `product path`, `dependency`, `failure mode`, `merged`, `exposed`, `measured`, `rework`, and `acceptance criteria`. Avoid consultancy language, abstract framework labels, throat-clearing, and phrases such as `generated thesis`, `decision surface`, `value unlock`, `the seam`, or `bounded tranche`.

Use only the one to three metrics that carry the decision. Give enough context to understand what current work builds, why it does not close the customer gap, and what capacity should move. Keep success criteria to one sentence unless they change the sequencing decision.

## Operating rules

- Use real evidence. Never invent allocation, pain, metrics, roadmap intent, shipping state, or causality.
- Keep external systems read-only. Offer drafts, but do not edit issues, projects, goals, PRs, code, deployments, or production without separate authorization.
- Estimate investment only at team or product-area level. Never assess individual productivity.
- Never use lines, commits, raw PR counts, or hours as investment proxies. Use scope and complexity bands, connected work, contributors involved, rework, and maintenance/feature/platform classification.
- Do not recommend a capacity percentage unless an authoritative capacity plan supports it. Otherwise name one bounded tranche, workstream, or sequencing tradeoff.
- Treat platform, reliability, compliance, strategy, and ahead-of-demand work as deliberate bets when evidence supports the intent.
- Account for rollout and adoption lag. Mark recent work `too early to tell`.
- Treat missing instrumentation as a coverage gap, not zero impact.
- Apply reliable employee, test, bot, and system-traffic filters; otherwise disclose the limitation.
- Carry an explicit instrumentation-trust verdict for every behavioral measure capable of changing the investment decision. Use a qualifying impact verdict before classifying shipped work as paying off or failing.

## Workflow

### 1. Set scope and coverage

Identify one application, one portfolio scope, one planning period, and one customer-experience window. Accept an application, product area, goal, initiative, team, quarter, or planning cycle from the caller. Default to the most recent complete 30 days for customer experience and the current cycle or quarter for planned and built work. Do not combine applications.

Check Novus coverage and connected Linear/Jira sources before analysis. Resolve both Novus-native integrations and direct Linear/Jira connectors exposed to the coding agent. If both paths describe the same issue, deduplicate by stable issue ID or key rather than treating them as independent corroboration. If Novus is unavailable, do not claim that investment is right or wrong. Return a clearly labeled planning-and-delivery-only preliminary view and the smallest customer-evidence step required to reach a portfolio conclusion.

### 2. Establish the product-area map

Use Novus product areas, product memory, goals, launches, signals, and artifact relationships as the normalization spine. Map roadmap projects, repositories, directories, pages, features, journeys, and customer language to a small set of stable areas. Keep an `unmapped` bucket and record why each mapping is credible.

Build a goal map alongside the product-area map. For each active goal, record its intended outcome, target or direction, deadline, related areas and launches, current trajectory, and measurement quality. Goals establish strategic intent; they do not prove that shipped work is effective.

### 3. Gather a broad portfolio view

Read [references/evidence-map.md](references/evidence-map.md). For each product area, gather:

1. **Planned:** initiatives, projects, active issues, estimates, priorities, cycles, goals, and intended capacity.
2. **Built:** completed scope, complexity, planned-versus-interrupt work, rework, and feature/maintenance/platform classification.
3. **Experienced:** signals, adoption, funnels, journeys, retention, frustration, feedback, account reach, reliability, and outcome movement.
4. **Shipping:** whether material work is proposed, merged, exposed, or measured.

Collect a broad inexpensive view first. Deepen only the strongest one to three candidate mismatches.

For decision-critical behavioral evidence, reuse or run `verify-instrumentation` when available. Carry its `TRUSTED`, `DEGRADED`, `UNTRUSTED`, or `UNKNOWN` verdict into the investment map. An untrusted zero cannot establish low demand, impact failure, or over-investment.

For material shipped work, reuse `verify-impact` when available before classifying it as **paying off** or **impact failure**. Otherwise apply the same gates explicitly: verified exposure, elapsed outcome window, trusted measurement, outcome movement, and guardrails. Do not recreate either full workflow here.

### 4. Compare investment with burden and outcomes

Estimate planned investment, built investment, customer problem burden, and outcome trend with evidence and confidence—not false precision. Compare highest friction with highest reachable impact; they may differ.

Compare investment against active goals in both directions:

- Which goals receive meaningful planned and built investment?
- Which goals lack delivery support despite material customer or business importance?
- Which product areas absorb effort without a clear goal, deliberate-bet rationale, or measured outcome?
- Which goals conflict, overlap, or rely on the same constrained engineering surface?

Classify each area as:

- **planning drift** — intended and actual investment diverged;
- **investment misalignment** — burden or opportunity is high while investment is low, or investment is high without supported intent;
- **impact failure** — the team invested in a real problem, shipped, and the expected outcome did not improve after the lag window;
- **paying off** — shipped investment is followed by credible improvement;
- **deliberate bet** — strategy, platform, reliability, compliance, or future demand justifies the investment;
- **too early / insufficient evidence** — rollout lag, weak coverage, or broken measurement prevents a conclusion.

Apply an exposure gate to outcome classifications:

- Use **impact failure** only when the material investment is verified as exposed to the relevant audience, the expected outcome window has elapsed, measurement is trustworthy, and the expected outcome did not improve.
- Use **paying off** only when verified exposure precedes credible improvement after the expected lag; call the relationship correlation unless stronger causal evidence exists.
- When merge, exposure, lag, or measurement is missing, use **planning drift**, **investment misalignment**, or **too early / insufficient evidence** instead.

### 5. Select and diagnose one mismatch

Choose the area where an investment change has the best combination of material impact, reachable coverage, multi-source confidence, an actionable surface, and a meaningful Planned/Built/Experienced mismatch. Do not select by the largest percentage drop, signal count, or busiest code area alone.

Diagnose:

1. what customers experience;
2. who is affected and how broadly;
3. what the team planned and built;
4. why the mismatch persists;
5. the smallest validating planning, instrumentation, investigation, or delivery step.

Separate facts, correlations, and Novus hypotheses. Preserve issue keys, PRs, artifact IDs, metric windows, and links for material claims.

### 6. Recommend one investment bet

State:

- what should receive more, less, or sustained investment;
- what planning-cycle work should move later or remain protected;
- which customer or business outcome should move;
- why this beats the strongest alternative;
- the first validation or delivery step;
- the outcome window and invalidation condition.

Use a named planning checkpoint or evidence-based outcome lag. Do not invent exact cycle counts, dates, or durations when cadence and expected lag are unknown.

Support the tradeoff with an actual planned or uncommitted tranche, workstream, or sequencing choice from the authoritative planning context. If no credible displacement candidate is visible, do not invent one. State that the portfolio direction is supported but the exact funding source remains a planning decision, and lower confidence accordingly.

Name the goal advanced by the recommended bet. If no saved goal fits, state the provisional outcome and recommend deciding whether it should become a goal; do not create one automatically.

For this skill, goals define the intended portfolio. Evaluate them in both directions: underfunded goals and effort without a credible goal or deliberate-bet rationale. A goal's existence, status, or target never proves impact; delivery, exposure, and outcome evidence must support that conclusion separately.

Respect active work and deliberate bets. Frame tradeoffs as planning-cycle choices, not automatic reprioritization.

### 7. Write the recommendation

Read [references/output-contract.md](references/output-contract.md) immediately before writing.

Return a response-only focus brief. Do not create an HTML report, standalone file, steering JSON record, or internal execution plan. If the caller explicitly requests detailed analysis, put the focus brief first and add a Markdown appendix after it.

Before sending the response, check its length and structure:

- The focus change appears in the first paragraph or headline.
- The response is 180–260 words and never exceeds 300 words unless the caller explicitly requests detail.
- The first 100 words name both sides: customer struggle and current movable investment.
- It answers four questions: where investment is misaligned, what should change, what stays protected, and why this focus beats the alternative.
- Every issue or PR reference follows a short plain-language description.
- It uses no more than three decision-carrying metrics.
- It does not include the full investment map, evidence ledger, methodology, planning-hygiene review, or a long implementation checklist.
- Coverage limitations are compressed into one confidence sentence unless one changes the decision.

After the portfolio bet is chosen, offer `goal-to-experiment` only when it is the immediate useful next step. Preserve the handoff fields in [references/output-contract.md](references/output-contract.md). Do not spend response space on lifecycle routing by default, collapse experiment design into the portfolio report, or invoke the downstream skill automatically.

When a concrete implementation plan already exists for the selected bet, offer `stress-test-plan` before experiment design. After exposure, route the outcome decision to `verify-impact`.

## Degraded behavior

- **Novus unavailable:** provide only a preliminary planning-and-delivery view, state that customer-value alignment cannot be concluded, and name the minimum evidence needed.
- **No Linear/Jira path:** compare Built versus Experienced and say `cannot confirm this is on the roadmap`. Do not infer planned investment from repository activity.
- **GitHub unavailable:** use completed issues and PR provenance already present in Novus; lower confidence in built investment.
- **Sparse taxonomy:** build a provisional map and disclose weak mappings.
- **Broken analytics:** use `verify-instrumentation` to name the smallest exact repair and observed proof; avoid interpreting zeros.
- **Sparse evidence:** return a smaller, lower-confidence portfolio conclusion instead of generic advice.
- **Conflicting evidence:** show the conflict and prefer the most direct current source.
- **Tool failure:** retry a failed read once, then continue with remaining evidence and disclose the limitation.

## Scope boundary

Do not use this skill for an individual engineer's next task, autonomous plan steering, sprint velocity reporting, individual performance evaluation, code implementation, automatic backlog management, deployment decisions, or detailed experiment design. Use `whats-next` for current-work steering and `goal-to-experiment` after the investment bet is selected.
