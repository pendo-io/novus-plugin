---
name: build-alignment
description: Compare planned product investment, shipped engineering work, and customer experience to identify where engineering effort can create the most customer value. Use for roadmap-versus-reality reviews, investment decisions, post-ship outcome analysis, or when an autonomous agent must verify its active engineering objective, adjust only its own internal plan, and define the next validation checkpoint using Novus, Linear/Jira, and GitHub evidence.
---

# Build Alignment

Turn portfolio evidence into an investment or steering decision. Answer one question: **Are we working where the next unit of authorized engineering effort can create the most customer value?**

Do not produce a generic delivery or analytics dashboard. Lead with the most consequential mismatch, explain why it matters, diagnose it, and recommend one bet.

## Operating rules

- Use real evidence. Never invent allocation, customer pain, metrics, roadmap intent, shipped work, or causality.
- Separate verified facts, correlations, and Novus hypotheses. Treat timing between a ship and metric movement as a hypothesis unless stronger evidence establishes causality.
- Keep external systems read-only. Require separate explicit authorization before creating, editing, moving, or reprioritizing issues, projects, goals, pull requests, code, deployments, or production state.
- In autonomous steering mode, the agent may change only its own internal plan and only within objectives the user already authorized.
- Estimate engineering investment only at the team or product-area level. Never assess individual productivity.
- Never use lines of code, commit count, raw PR count, or hours as investment proxies. Use scope and complexity bands, connected work, planned capacity, contributors involved, rework, and maintenance/feature/platform classification.
- Prefer relative labels such as low, medium, and high when the sources do not support an exact percentage.
- Treat strategic, platform, compliance, reliability, and ahead-of-demand work as deliberate bets when evidence supports that intent. High effort plus low current pain is not automatically waste.
- Account for release, rollout, and adoption lag. Mark recent work `too early to tell` inside a reasonable outcome window.
- Make missing coverage and instrumentation defects visible. An untagged funnel step is a measurement gap, not real 0% completion.
- Exclude known employee, test, bot, and anonymous system traffic when reliable filters are available. If they are not, disclose the limitation instead of guessing.

## Workflow

### 1. Select the mode

Use **review mode** when a human asks for analysis, a portfolio decision, or a shareable report. Complete the workflow and render the human decision surface.

Use **autonomous steering mode** when an agent must verify or revise its active objective or internal plan. Read [references/autonomous-steering.md](references/autonomous-steering.md) before gathering evidence. Preserve the user's objective and authorized scope as hard constraints. Complete the comparison workflow, then emit and validate a steering decision instead of defaulting to HTML.

The current objective must be one explicit, active objective and must also appear verbatim in the authorized objective set. A list of authorized options does not identify which one is current. If either the single current objective or authorized objective set is missing or ambiguous, do not invent or reframe it. Use review mode, or return ESCALATE with no plan change when autonomous steering was explicitly requested.

### 2. Resolve the scope

Identify one application, one analysis window, and the requested portfolio scope.

- Accept an application, product area, goal, initiative, team, or planning cycle from the user.
- Default to the most recent complete 30 days for customer experience and the current planning cycle or quarter for planned and built work.
- Use a partial period only when necessary and label it clearly.
- If more than one application remains plausible after inspecting the available apps and context, ask one focused question. Do not merge applications.

### 3. Establish the product-area map

Create a shared capability map so roadmap, code, and customer evidence can be compared.

- Start with Novus product areas, product-wiki memory, artifact relationships, goals, launches, and signal `productArea` labels.
- Normalize synonyms from Linear/Jira projects, repositories, directories, features, pages, journeys, and customer language into a small set of stable product areas.
- Keep an `unmapped` bucket. Never force weak matches.
- Record why each cross-source mapping is credible.

### 4. Gather broad evidence

Read [references/evidence-map.md](references/evidence-map.md) before querying. Collect a broad, inexpensive portfolio view first, then deepen only the strongest one to three candidate mismatches.

For each product area, gather three layers plus material shipping state:

1. **Planned — where the team intended to invest.** Use initiatives, projects, issue estimates, priorities, cycle assignments, strategic goals, and planned capacity from Linear or Jira.
2. **Built — where engineering effort actually went.** Use completed work, merged changes, scope/complexity bands, planned-versus-interrupt classification, contributors involved, review/rework burden, and maintenance/feature/platform classification.
3. **Experienced — what customers actually experienced.** Use Novus signals, adoption, usage, funnels, journeys, retention, frustration, feedback, account reach, reliability, and outcome change after release.

For a material PR, distinguish **proposed**, **merged**, **exposed**, and **measured**. A PR is not customer impact merely because it exists or merged.

Use Novus signals as the primary join when they already connect product area, customer evidence, PRs, files, UX findings, and metrics. Use direct Linear/Jira or GitHub capabilities only to fill material gaps or verify the final candidate.

### 5. Compare the layers

Assess each product area using evidence and confidence, not false precision.

- Estimate **planned investment**, **built investment**, **customer problem burden**, and **outcome trend**.
- Approximate customer problem burden from prevalence, severity, outcome impact, account importance, journey criticality, trend, strategic relevance, and evidence confidence. Explain the decisive factors; do not expose a fabricated formula score.
- Compare highest friction with highest reachable impact. They are not necessarily the same.
- Note whether roadmap intent and shipped work match, whether customers improved after delivery, and whether measurement is trustworthy.

Classify each area as one of:

- **Planning drift:** intended investment and actual investment diverged.
- **Investment misalignment:** customer burden or opportunity is high while meaningful investment is low, or investment is high without a supported reason.
- **Impact failure:** the team invested in a real problem, shipped, and the expected outcome did not improve after the lag window.
- **Paying off:** shipped investment is followed by credible outcome improvement.
- **Deliberate bet:** current pain is low, but strategy, platform, reliability, compliance, or future demand justifies the investment.
- **Too early / insufficient evidence:** the outcome window is open, coverage is weak, or measurement is broken.

### 6. Select the largest meaningful mismatch

Rank only after applying the strategic-bet, lag, and data-quality guardrails.

Choose the area where a change in investment is most likely to create customer or business value. Prefer the intersection of:

- material customer or outcome impact;
- high reachable user or account coverage;
- credible evidence from more than one source;
- an actionable code, product, instrumentation, or delivery surface;
- a meaningful mismatch between planned, built, and experienced layers.

Do not automatically pick the largest percentage drop, the most signals, or the busiest code area.

### 7. Diagnose the selected area

Build one connected investigation:

1. **What customers experience** — the observed outcome, friction, or unmet opportunity.
2. **Who is affected** — cohort, accounts, journey position, and reach.
3. **What the team planned and built** — roadmap intent, completed work, in-flight work, and stalled work.
4. **Why the mismatch persists** — likely causes, instrumentation gaps, unresolved UX findings, rollout lag, or incorrect assumptions.
5. **What to do next** — one investment thesis and the smallest validating action.

Link every material claim to a stable signal, artifact, issue, initiative, pull request, UX review, or metric window when available.

### 8. Choose one bet or steering decision

Write one claim-first, quantified investment thesis. State:

- what should receive more, less, or sustained investment;
- what should move in the current planning system;
- which customer or business outcome should move;
- why this beats the strongest alternative;
- the first validation or delivery step;
- the outcome window and invalidation condition.

Respect work state. Do not casually stop in-flight work. Frame tradeoffs as planning-cycle choices, and surface conflicts with other active goals or deliberate bets.

In autonomous steering mode, compare the current objective only with already-authorized alternatives. Choose exactly one of CONTINUE, NARROW, PAUSE, SWITCH, or ESCALATE using the burden and stability rules in autonomous-steering.md. Never silently discard deferred work.

### 9. Render or record the result

Read [references/output-contract.md](references/output-contract.md) immediately before writing.

- In review mode, create a shareable standalone HTML report when the host can write files, unless the user asks for response-only Markdown.
- In autonomous steering mode, write the exact build-alignment-decision.json that will be reported, validate that file with scripts/validate-steering-decision.mjs, and apply only the valid internal plan delta when a plan mechanism exists. Include the validator result in the concise summary. Never claim validation from inspection alone. Do not create HTML unless requested.
- Keep the recommendation or steering decision in the response.
- Offer draft external actions, but never execute them under this skill's authority.

## Degraded modes

- **Novus MCP unavailable:** In review mode, stop and explain that customer-experience evidence is required. In autonomous mode, return ESCALATE without changing the active objective.
- **Linear/Jira unavailable:** Compare built versus experienced, mark planned investment unavailable, and phrase the conclusion as `cannot confirm this is on the roadmap`.
- **GitHub unavailable:** Use completed issues and PR provenance already present in Novus signals; lower confidence in built investment.
- **Sparse product-area taxonomy:** Build a provisional map from wiki, artifacts, paths, issue labels, and signals; disclose weak mappings.
- **Broken analytics:** Recommend minimum instrumentation repair. In autonomous mode, NARROW to that repair only when it is already authorized; otherwise ESCALATE.
- **Sparse evidence:** Return a smaller, lower-confidence analysis instead of generic portfolio advice.
- **Conflicting evidence:** Show the conflict and prefer the most direct, current source.
- **Tool failure:** Retry a failed read at most once, then continue with remaining evidence and disclose the limitation.

## Scope boundaries

Do not use this skill for individual performance evaluation, sprint velocity reporting, generic roadmap summaries, code implementation, automatic issue creation, external backlog management, deployment decisions, or autonomous reprioritization of organizational systems. Autonomous mode may steer only the running agent's internal plan.
