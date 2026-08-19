---
name: stress-test-plan
description: "Use when an engineer or coding agent has a proposed feature, implementation plan, issue, spec, or architecture direction and wants an engineer-to-engineer challenge grounded in repository constraints and, when available, Novus product data: actual adoption, friction, affected users, feedback, roadmap dependencies, measurement gaps, unsafe rollout, or reasons to narrow or stop before coding."
---

# Stress Test Plan

Challenge a proposed build before implementation begins. Find the few assumptions most likely to make it wasted, unsafe, unmeasurable, or larger than it appears, then return the smallest stronger plan.

Repository evidence answers whether the mechanism can work. Novus product evidence answers whether it addresses a real problem, for how many users, and whether the result can be observed. Use both when available. That combination is the reason to use this skill instead of a generic plan reviewer.

## Operating rules

- Stay read-only. This skill critiques and reshapes a plan; it does not implement it, rewrite issues, or change the roadmap.
- Do not run a generic architecture or security checklist. Test claims specific to this plan and its intended outcome.
- Ask at most one question, only when the answer would change a consequential or irreversible recommendation. Infer everything else from the plan, repository, Novus, and connected work systems.
- Lead with the plan decision, not a long discovery narrative.
- Use no more than three plan-breaking risks. Rank by likelihood × consequence × cost of learning late.
- Write like a senior engineer reviewing another engineer's design: direct, specific, and comfortable saying “this dependency is missing” or “the data does not support this scope.” Avoid consultant language, motivational framing, and generic product-management advice.
- Translate product evidence into an engineering decision. Do not report a metric unless it changes the mechanism, sequence, scope, rollout, or stop condition.
- Treat a feature flag as a rollout mechanism, not proof that a build is valuable, small, or safe.
- Do not prescribe broad new instrumentation when Novus can instrument supported surfaces automatically. Specify only the measurement or trust check needed to evaluate this plan.

## Workflow

### 1. Reconstruct what the plan is betting on

Read the supplied plan, spec, issue, branch, or conversation. Inspect the narrowest relevant repository surface. State:

- who has the problem and what they cannot do today;
- the user or operational outcome the plan claims to improve;
- the proposed mechanism and first release slice;
- the main constraints, dependencies, rollout, and success evidence.

Mark missing fields as assumptions instead of interviewing the caller. A saved Novus goal tells you the intended outcome; it does not prove this mechanism is the right solution.

### 2. Gather only evidence that could change the plan

Read [references/evidence-map.md](references/evidence-map.md). Seek evidence capable of changing the plan. When Novus product data is available and the plan affects a user-facing or operational workflow, query at least one relevant product-data source. Do not satisfy this requirement with a generic app-level metric.

- **Usage evidence:** adoption, friction, feedback, replays, affected reach, and the actual bottleneck.
- **Work already in flight:** existing Linear/Jira issue, initiative, owner, dependencies, duplicates, and parallel work.
- **Code path:** current implementation, architectural seams, failure states, migration/compatibility burden, and prior attempts.
- **Observability:** whether the stated result can be observed and trusted after exposure.

Bind product data to the exact surface and claim under review:

- resolve the app, artifact, feature, page, event, funnel, guide, agent, or product area before reading a metric;
- preserve the source ID, audience, time window, denominator, comparison window, and external/internal scope;
- use `listSignals` only to find candidates, then inspect the underlying signal and linked artifacts before changing the plan;
- use replays or feedback to explain a failure mode, not to claim prevalence from one example;
- say what engineering decision each data point changes.

If relevant Novus data exists but is too broad, stale, internally contaminated, or mapped to the wrong surface, treat measurement trust as a blocker. If no relevant product evidence is available, say that whether users need this remains unproven and make the cheapest evidence-producing check part of the first slice.

Resolve Novus-native Linear/Jira integrations and direct connectors exposed to the coding agent. Use either path; when both return the same issue, treat it as one source. If neither exists, disclose missing roadmap coverage without blocking repository and customer analysis.

Stop gathering when the top risks and revised first slice are stable. Do not sweep every signal, issue, or file.

### 3. Try to break the plan from five angles

Test:

1. **Problem:** Is this solving the binding customer or operational constraint?
2. **Mechanism:** Could the implementation produce the intended behavior without worsening a known failure?
3. **Scope:** What hidden state, platform, privacy, accessibility, compatibility, or migration work makes it larger?
4. **Sequence:** Does a prerequisite or more fundamental broken path need to come first?
5. **Learning:** Can the first slice distinguish “works,” “wrong mechanism,” and “measurement broken” quickly and reversibly?

For every risk, name the evidence, consequence, cheapest pre-code test, and exact plan change. Separate a known fact from a plausible failure mode.

### 4. Make the call

Choose exactly one:

- **PROCEED** — no material plan change is needed; add only the proof points.
- **REVISE** — preserve the outcome but change a material mechanism, dependency, or safety contract.
- **NARROW** — preserve the intended outcome but reduce the first slice to the smallest useful learning or delivery step.
- **STOP** — evidence shows the plan solves the wrong problem, duplicates better work, or cannot responsibly create the intended value.
- **NEEDS ONE ANSWER** — one consequential unknown prevents choosing among the states above.

Prefer `NARROW` or `REVISE` over `STOP` when the outcome is sound and a reversible route remains.

### 5. Return the plan you would actually ship

Read [references/output-contract.md](references/output-contract.md) immediately before responding. State the strongest reason not to build the plan as written, then provide one revised first slice with:

- explicit non-goals;
- pre-code proof or dependency checks;
- user and technical acceptance criteria;
- safe rollout and rollback;
- measurement and instrumentation-trust checks;
- stop or switch condition.

When the plan survives and needs a full experiment contract, offer `goal-to-experiment`. Do not invoke it or duplicate its detailed experiment brief unless requested.

## Degraded behavior

- **Novus unavailable:** stress-test mechanism, scope, sequence, and delivery evidence; mark confidence that users need it as low and name the minimum product evidence needed.
- **Linear/Jira unavailable:** say roadmap ownership and duplication are unconfirmed; do not infer intent from code activity.
- **Repository unavailable:** test the claimed user outcome, evidence, rollout, and measurement; lower confidence in the implementation advice.
- **Instrumentation untrusted:** make a targeted `verify-instrumentation` check a precondition when the plan depends on that metric.
- **Sparse evidence:** return the most reversible narrower plan and its falsifying test instead of generic cautions.

## Scope boundary

Do not use this skill to choose among unrelated portfolio investments, decide an engineer's next task without an existing plan, review implementation after coding, or judge post-release impact. Use `build-investment`, `whats-next`, `ux-review`, or `verify-impact` for those questions.
