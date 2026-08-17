---
name: stress-test-plan
description: Use when an engineer or coding agent has a proposed feature, implementation plan, issue, spec, or architecture direction and wants to expose bad assumptions, customer-value risks, hidden dependencies, unsafe rollout, or reasons to narrow or stop before coding.
---

# Stress Test Plan

Challenge a proposed build before implementation begins. Find the few assumptions most likely to make it wasted, unsafe, unmeasurable, or larger than it appears, then return the smallest stronger plan.

## Operating rules

- Stay read-only. This skill critiques and reshapes a plan; it does not implement it, rewrite issues, or change the roadmap.
- Do not run a generic architecture or security checklist. Test claims specific to this plan and its intended outcome.
- Ask at most one question, only when the answer would change a consequential or irreversible recommendation. Infer everything else from the plan, repository, Novus, and connected work systems.
- Lead with the plan decision, not a long discovery narrative.
- Use no more than three plan-breaking risks. Rank by likelihood × consequence × cost of learning late.
- Treat a feature flag as a rollout mechanism, not proof that a build is valuable, small, or safe.
- Do not prescribe broad new instrumentation when Novus can instrument supported surfaces automatically. Specify only the measurement or trust check needed to evaluate this plan.

## Workflow

### 1. Reconstruct the plan's thesis

Read the supplied plan, spec, issue, branch, or conversation. Inspect the narrowest relevant repository surface. State:

- who has the problem and what they cannot do today;
- the user or operational outcome the plan claims to improve;
- the proposed mechanism and first release slice;
- the main constraints, dependencies, rollout, and success evidence.

Mark missing fields as assumptions instead of interviewing the caller. A saved Novus goal can establish strategic intent; it does not prove this mechanism is the right solution.

### 2. Gather only falsifying evidence

Read [references/evidence-map.md](references/evidence-map.md). Seek evidence capable of changing the plan:

- **Customer reality:** adoption, friction, feedback, replays, affected reach, and the actual bottleneck.
- **Roadmap reality:** existing Linear/Jira issue, initiative, owner, dependencies, duplicates, and parallel work.
- **Delivery reality:** current code path, architectural seams, failure states, migration/compatibility burden, and prior attempts.
- **Measurement reality:** whether the stated outcome can be observed and trusted after exposure.

Resolve Novus-native Linear/Jira integrations and direct connectors exposed to the coding agent. Use either path; when both return the same issue, treat it as one source. If neither exists, disclose missing roadmap coverage without blocking repository and customer analysis.

Stop gathering when the top risks and revised first slice are stable. Do not sweep every signal, issue, or file.

### 3. Attack the plan from five angles

Test:

1. **Problem:** Is this solving the binding customer or operational constraint?
2. **Mechanism:** Could the implementation produce the intended behavior without worsening a known failure?
3. **Scope:** What hidden state, platform, privacy, accessibility, compatibility, or migration work makes it larger?
4. **Sequence:** Does a prerequisite or more fundamental broken path need to come first?
5. **Learning:** Can the first slice distinguish “works,” “wrong mechanism,” and “measurement broken” quickly and reversibly?

For every risk, name the evidence, consequence, cheapest pre-code test, and exact plan change. Separate a known fact from a plausible failure mode.

### 4. Decide what happens to the plan

Choose exactly one:

- **PROCEED** — no material plan change is needed; add only the proof points.
- **REVISE** — preserve the outcome but change a material mechanism, dependency, or safety contract.
- **NARROW** — preserve the thesis but reduce the first slice to the smallest useful learning or delivery step.
- **STOP** — evidence shows the plan solves the wrong problem, duplicates better work, or cannot responsibly create the intended value.
- **NEEDS ONE ANSWER** — one consequential unknown prevents choosing among the states above.

Prefer `NARROW` or `REVISE` over `STOP` when the outcome is sound and a reversible route remains.

### 5. Return the stronger plan

Read [references/output-contract.md](references/output-contract.md) immediately before responding. State the strongest reason not to build the plan as written, then provide one revised first slice with:

- explicit non-goals;
- pre-code proof or dependency checks;
- user and technical acceptance criteria;
- safe rollout and rollback;
- measurement and instrumentation-trust checks;
- stop or switch condition.

When the plan survives and needs a full experiment contract, offer `goal-to-experiment`. Do not invoke it or duplicate its detailed experiment brief unless requested.

## Degraded behavior

- **Novus unavailable:** stress-test mechanism, scope, sequence, and delivery evidence; mark customer-value confidence low and name the minimum product evidence needed.
- **Linear/Jira unavailable:** say roadmap ownership and duplication are unconfirmed; do not infer intent from code activity.
- **Repository unavailable:** test product thesis, evidence, rollout, and measurement; lower delivery confidence.
- **Instrumentation untrusted:** make a targeted `verify-instrumentation` check a precondition when the plan depends on that metric.
- **Sparse evidence:** return the most reversible narrower plan and its falsifying test instead of generic cautions.

## Scope boundary

Do not use this skill to choose among unrelated portfolio investments, decide an engineer's next task without an existing plan, review implementation after coding, or judge post-release impact. Use `build-investment`, `whats-next`, `ux-review`, or `verify-impact` for those questions.
