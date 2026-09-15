# Build Investment output contract

Return one leadership recommendation: **sustain, increase, redirect, reduce, or defer judgment**. Lead with the decision supported by the evidence. Do not require a mismatch, displaced work, or a new bet when staying the course is justified.

## Focus brief

Title the output **Build Investment · <scope> · <planning period>** and put this purpose line directly below it: **Are we putting engineering effort in the right places?** The report must identify itself when copied into a meeting pre-read without the surrounding chat.

Aim for 180–260 words, at most 300 unless the caller asks for detail. Lead with a concrete recommendation, such as “Keep the organization onboarding work in the October release.” Use these three short headings:

1. **Where effort is going:** describe the material planned or in-flight workstreams and what they build. Distinguish merged work from customer availability. When no planning source exists, say what delivery evidence shows and that planned investment is unconfirmed.
2. **How that compares with customer needs:** explain the customer problem or strategic opportunity, whether the investment addresses it, and the strongest relevant alternative. Separate current usage from a deliberate bet on future customers. Name a mismatch when supported; explain alignment when supported.
3. **What should change:** give one sequencing decision, what moves later and what stays protected when those are known, and one next check. For sustain, use **What should stay the same**. For an unresolved decision, use **What we need to decide**. A locked release makes this a recommendation for the next open planning decision, not an instruction to disrupt the release.

This is the original investment-versus-customer-need comparison, with room for strategy and fixed commitments. Do not replace it with a general product-health summary, a retrospective justification of one fix, or a measurement audit. Missing analytics may limit an impact claim without preventing a strategy-backed sequencing recommendation. Preserve uncertainty that could actually reverse the decision.

If the caller specifies another format, retain the title, purpose, recommendation, and the three questions in that format. Use bold labels for a short Slack version.

Make the recommendation clear in the opening paragraph. Within the first 100 words, connect the actual investment to the customer need or intended strategic benefit. For a redirect, explain both sides of the gap. For sustain, explain why the current focus remains justified. For defer judgment, state the evidence or strategic choice that prevents a decision.

## Tiffany writing style

When `tiffany-style` is available, read and apply it before drafting. The rules here remain usable when that personal skill is not installed.

Write as a capable colleague preparing a product meeting: direct recommendation, concrete work, customer consequence, next decision. Use short complete sentences, meaningful bullets, and the headings above. Describe work before citing records. Prefer “we have not confirmed customers received the fix” to “production exposure remains unverified,” and “keep the current focus” to “sustain the investment allocation.” Keep necessary uncertainty beside the claim in one direct sentence; put supporting measurement detail in sources or a requested appendix. Leave unusable numbers out of the main brief instead of listing and retracting them.

Before returning it, read the draft aloud mentally. Remove repeated conclusions, generic praise, em dashes, dramatic fragments, consultancy language, and manufactured “not X, but Y” contrasts. Every paragraph should help the reader understand the investment, the customer need, or the decision. Headings do not excuse abstract or padded prose.

## Adapt to the recommendation

| Direction | Required reasoning |
| --- | --- |
| Sustain | Why the current work serves an important need, what remains protected, and what evidence would reopen the decision. No invented displaced work. |
| Increase or redirect | The next workstream, actual displaced work when known, protected commitments, and why this beats the strongest evidenced alternative. If funding is unresolved, say so. |
| Reduce | What next increment should shrink or stop, why its expected benefit no longer justifies it, and the obligations or dependencies that remain. |
| Defer judgment | The missing evidence or unresolved strategic choice, who owns it when known, and the smallest step and condition needed to decide. No forced allocation verdict. |

Use one to three decision-carrying measures. Interpret reach against eligible populations and intended outcomes. Completion, reduced effort, and reliability may justify work without usage growth. For UI versus agent/MCP investment, explain who needs each experience and whether shared capabilities benefit both. Do not assume the groups are mutually exclusive or infer commercial value from usage alone.

## Evidence requirements

- Use credible estimate or capacity denominators for allocation percentages. Keep planned capacity separate from completed-scope share and state coverage. Never use raw PR, commit, line, issue, or hour counts as effort proxies.
- Carry a measurement-trust verdict for decision-critical behavior; expose it when it changes the recommendation.
- Verify exposure, elapsed lag, trustworthy outcome movement, and guardrails before calling shipped work successful or failed. State attribution limits where they qualify the conclusion.
- Keep goals, customer requests, and leadership rationale distinct from realized impact. Missing strategic context can make an apparent mismatch inconclusive.
- State a material strategic shift and the intended future audience. Do not judge new-audience investment only by old-audience adoption. Reconcile stale planning dates and locked release scope with current decisions before recommending displacement.
- Exclude growth or retention comparisons invalidated by visitor/account-ID migrations or changed organization definitions. Do not make them the headline and try to retract them with a caveat.
- Use real planned or movable work to support a displacement recommendation. If none is visible, identify the remaining planning decision.
- Keep stable source references and metric windows. Several summaries of one source are not independent evidence.

## Detail and handoff

Default to a brief in the response. It should stand alone as a product-meeting pre-read with source links for deeper review. If the caller requests detail, add the area map, planned/built/experienced/release evidence, and material coverage gaps. If they request an artifact or a format tailored to a named audience, honor that request and retain the same evidence requirements. Do not create, publish, or schedule a report without a request or an existing authorized workflow.

When strategy or measurement context is corrected, explain the revised conclusion and its reason. Use context supplied by the calling workflow; do not require a new saved goal or a Novus UI visit to complete the review. Do not claim persistent memory unless the host provides it.

When the caller asks to continue into experiment design, pass the selected outcome, related goal or provisional outcome, reason selected, source evidence and windows, protected and deferred scope, validation window, and invalidation condition. Do not manufacture a selected bet when the recommendation is to defer judgment.

## Final check

- The recommendation follows from the evidence and can be sustain or defer judgment.
- The reader can explain who benefits and why the investment fits or misses the need.
- Any displaced work and competing alternative come from actual planning evidence.
- The brief contains a useful next action and review condition without automatic reprioritization.
- Uncertainty is explicit where it could change the decision.
