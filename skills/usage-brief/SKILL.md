---
name: usage-brief
description: Use when a builder wants current usage for the product area a PR, ticket, or proposed feature touches, and an evidence-based read of the customer benefit it could create. Can prepare a PR or ticket comment and post it after confirmation. Use build-impact to evaluate shipped outcomes.
---

# Usage Brief

Show a builder how the relevant product area is used today, who could benefit from the proposed change, and what would demonstrate that benefit. Lead with available usage evidence and explain the intended outcome in plain language. Do not judge shipped impact or choose the next task.

## Core rules

- Potential is a hypothesis grounded in customer need, the change's mechanism, and the population it can reach. Low usage alone does not establish high potential, and high usage does not rule out gains in completion, efficiency, or reliability.
- Use the benefit the change intends to create: reach, successful completion, less effort, fewer errors, reliability, or repeat value. More activity is not always better.
- Keep reads read-only. Posting a comment to a PR or ticket requires confirmation of the exact text and target. Do not change code, planning records, rollout, or production.

## 1. Resolve the surfaces and intent

Resolve the work from a description, issue, PR, branch, or diff. Read [references/evidence-map.md](references/evidence-map.md). Map the user-visible or operational behavior to Novus pages, features, events, or funnels. If no artifact resolves, describe the code-supported scope and missing Novus coverage. Use trustworthy caller-supplied or other available evidence when it maps to the same surface, audience, and window; otherwise disclose that usage is unavailable.

Read the intended outcome from the caller, PR, issue, or related goal. Keep inferred intent provisional. Establish which audience has the need and can reach the change; do not treat every active app user as a potential adopter. Keep current usage separate from an intended future audience or unreleased branch.

## 2. Establish current usage

Use the last 7 days for recent usage and complete, comparable 30-day windows for trend, unless the caller or release history requires a different window. Inspect:

- unique customer users and accounts, with a matching active-user or account denominator for overall reach;
- the specific control or flow and the eligible population that could encounter it;
- account concentration and relevant audience differences;
- internal, test, bot, and researcher traffic, excluded using reliable filters or disclosed when unresolved.

Keep units, eligibility, and windows consistent. Do not add overlapping feature audiences. Distinguish all-app reach from adoption among eligible users. Show only measures that help assess this change, with counts beside percentages.

Before interpreting decision-critical behavioral data, reuse a current `verify-instrumentation` verdict or run that skill when available. If unavailable, use the equivalent trust check in the evidence map. Unknown or untrusted measurement cannot support a usage or potential conclusion; report the gap. A limitation that invalidates a headline belongs before that headline, not after it.

## 3. Explain the possible benefit

- **Need and opportunity:** is there evidence of demand, failure, effort, or a planned strategic need? Low activity may reflect narrow demand, poor discovery, limited exposure, or a data problem. Check which explanation fits before calling it headroom.
- **Mechanism:** explain what the change would let customers do better. Separate the surface's existing trend from the proposed change's contribution.
- **Reach:** identify who could benefit under current access and rollout conditions. A reachable population bounds possible adoption; it is not a forecast of uptake or business value.
- **Success measure:** name one outcome appropriate to the intended benefit, its trustworthy baseline when available, and a target only if supported by evidence or supplied by the user. Do not invent an adoption benchmark or require a growth ceiling for an efficiency fix.
- **Known friction:** use a relevant Novus signal or customer evidence when available. Confirm that the proposed change actually addresses it.

Missing usage for a future audience does not disprove a strategic rationale. State what is known today and what evidence would test that rationale later. Fewer clicks or less time can indicate success if the task is completed with acceptable quality.

## 4. Write and share

Read [references/output-contract.md](references/output-contract.md) immediately before composing. Return a brief the reader can use without translating analytics jargon. Offer the current branch's PR as the comment target, or the linked Linear/Jira issue if there is no PR. Show the exact text and target, then post only after confirmation. Never guess a target or auto-post.

If no target or write access exists, return the brief for manual use and state that it was not posted. If usage or a trustworthy success measure is unavailable, give the supported scope, proposed benefit, and exact evidence needed without inventing numbers.

Use `build-impact` for shipped outcomes, `build-investment` for portfolio decisions, `whats-next` for task selection, and `ux-review` for UX review. Do not add tracking or expand posting permission beyond the confirmed comment.
