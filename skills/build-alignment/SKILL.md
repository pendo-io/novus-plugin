---
name: build-alignment
description: Infer what an engineer or agent is currently building, compare it with product plans, shipped work, and customer experience, then decide what to continue, narrow, pause, or recommend next. Use for natural questions such as “what should I work on next?”, “is this PR still worth finishing?”, roadmap-versus-reality reviews, post-ship impact checks, investment decisions, or autonomous plan steering using repository context, Novus, Linear/Jira, and GitHub evidence. Callers do not need product-management terminology or a structured objective prompt.
---

# Build Alignment

Turn portfolio evidence into an investment or steering decision. Answer one question: **Are we working where the next unit of authorized engineering effort can create the most customer value?**

Do not produce a generic delivery or analytics dashboard. Lead with the most consequential mismatch, explain why it matters, diagnose it, and recommend one bet.

## Operating rules

- Use real evidence. Never invent allocation, customer pain, metrics, roadmap intent, shipped work, or causality.
- Separate verified facts, correlations, and Novus hypotheses. Treat timing between a ship and metric movement as a hypothesis unless stronger evidence establishes causality.
- Keep external systems read-only. Require separate explicit authorization before creating, editing, moving, or reprioritizing issues, projects, goals, pull requests, code, deployments, or production state.
- In autonomous steering mode, the agent may change only its own internal plan. It may apply current-scope changes and explicitly authorized choices; discovered work outside that authority remains a recommendation.
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

Use **autonomous steering mode** when an engineer asks what to do next, asks whether current work is still worthwhile, or an agent must verify or revise its internal plan. Read [references/autonomous-steering.md](references/autonomous-steering.md) before gathering evidence. Infer the active work from engineering context; do not require the caller to translate it into an objective or authorization schema. Complete the comparison workflow, then emit and validate a steering decision instead of defaulting to HTML.

Treat explicit user instructions as the highest-authority evidence, not as a required input format. Ask one plain-language question only when the available task, plan, issue, PR, branch, diff, conversation, and recent-commit context supports materially different interpretations. Otherwise record the inferred current objective, its sources, and confidence. When no work is active and the caller asks what to do next, discover candidates and use START. When context is ambiguous and the ambiguity would change the decision, return ESCALATE with no plan change.

### 2. Resolve current work, candidates, and scope

Infer the current engineering objective before querying product evidence. Inspect, in order:

1. the caller's task and terminal condition;
2. the active plan and in-progress step;
3. assigned or linked issues and pull requests;
4. the branch, worktree, uncommitted diff, and changed capability;
5. relevant recent conversation and commits.

Prefer one explicit assignment or two compatible context sources. A branch name or commit count alone is weak evidence. State the objective in plain outcome-oriented language, record whether it was inferred, preserve stable source IDs, and set high, medium, or low resolution confidence.

Build the candidate set rather than asking the caller to provide it. Include the current objective plus the strongest credible alternatives found in Novus, the connected roadmap, and delivery context. Mark each candidate:

- `current-scope` when it is a reversible continuation, narrowing, pause, or validation step inside the active assignment;
- `explicit-choice` when the caller explicitly allowed the agent to choose among named or clearly bounded tasks;
- `recommend-only` when evidence surfaced it but the caller did not authorize executing it.

Evaluating a candidate does not grant authority to execute it. A better `recommend-only` candidate may produce a proposed SWITCH, but never an applied one.

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

In autonomous steering mode, compare the inferred current objective with the strongest discovered candidate. Choose exactly one of START, CONTINUE, NARROW, PAUSE, SWITCH, or ESCALATE using the burden and stability rules in autonomous-steering.md. Use START only when no work is active. Separate the evidence-backed decision from whether its internal plan delta was applied, proposed, or blocked. Never silently discard deferred work or treat a recommendation as execution authority.

### 9. Render or record the result

Read [references/output-contract.md](references/output-contract.md) immediately before writing.

- In review mode, create a shareable standalone HTML report when the host can write files, unless the user asks for response-only Markdown.
- In autonomous steering mode, write the exact build-alignment-decision.json that will be reported. Resolve the validator relative to this SKILL.md's directory, not the caller's repository, then validate the decision file with scripts/validate-steering-decision.mjs. Apply only a valid and authorized internal plan delta when a plan mechanism exists. Include the validator result in the concise summary. Never claim validation from inspection alone. Do not create HTML unless requested.
- Keep the recommendation or steering decision in the response.
- Offer draft external actions, but never execute them under this skill's authority.

## Degraded modes

- **Novus MCP unavailable:** In review mode, stop and explain that customer-experience evidence is required. In autonomous mode, current-scope CONTINUE, NARROW, PAUSE, or validation work may proceed when engineering context is strong; never SWITCH based only on repository activity. Otherwise ESCALATE.
- **Linear/Jira unavailable:** Compare built versus experienced, mark planned investment unavailable, and phrase the conclusion as `cannot confirm this is on the roadmap`.
- **GitHub unavailable:** Use completed issues and PR provenance already present in Novus signals; lower confidence in built investment.
- **Sparse product-area taxonomy:** Build a provisional map from wiki, artifacts, paths, issue labels, and signals; disclose weak mappings.
- **Broken analytics:** Recommend minimum instrumentation repair. Apply it only when it fits current scope or an explicit choice; otherwise keep it proposed.
- **Sparse evidence:** Return a smaller, lower-confidence analysis instead of generic portfolio advice.
- **Conflicting evidence:** Show the conflict and prefer the most direct, current source.
- **Tool failure:** Retry a failed read at most once, then continue with remaining evidence and disclose the limitation.

## Scope boundaries

Do not use this skill for individual performance evaluation, sprint velocity reporting, generic roadmap summaries, code implementation, automatic issue creation, external backlog management, deployment decisions, or autonomous reprioritization of organizational systems. Autonomous mode may steer only the running agent's internal plan.
