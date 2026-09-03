# Usage Brief output contract

Produce one verification-emphasis decision for the change, backed by the smallest evidence that supports it — not a metrics dashboard. The reader is a builder deciding how carefully to test, before they ship.

## Shape

```markdown
**Usage brief: <HEAVY | STANDARD | LIGHT> verification** · <area> · <window>

*<One sentence: how used this area is and what makes the change risky or safe.>*

**Usage of the associated parts**

- <Surface> reaches **X visitors / Y accounts** (~**Z% of active users**), <trend> vs <comparison window>.
- Top usage: <top accounts/visitors, with the internal/test/researcher split named>.
- <Journey sentence, when a path is legible.>

**Adoption vs. stickiness:** **<ADOPTION-LEANING | STICKINESS-LEANING | BOTH | NEITHER | UNKNOWN>.** <One sentence with the number behind it, and which lever *this change* pulls.>

**Why <HEAVY|STANDARD|LIGHT>:** <reach × criticality × action, plus the decisive modifier — reachability, concentration, or trend>.

**Measurability:** <verify-instrumentation verdict> — <can this change's own impact be measured after it ships; if not, the missing event>.

**Test the <specific path> hardest.** <The one path that carries the risk, not "test everything".>
```

- Aim for 120–180 words, never over 220, excluding link targets and a compact source line.
- Lead with the verdict; a builder should get the emphasis level in the first line.
- Write movement as complete sentences ("reaches ~18% of active users, up 166% over 30 days"), not a row of bare percentages or a table.
- Name exact accounts/visitors only as far as the rating needs; always separate internal/test/researcher traffic from customer reach.

## Verdicts

| Verdict | Meaning |
| --- | --- |
| **HEAVY** | High reach or a critical/irreversible path, or a small but high-value/at-risk audience. Verify the risky path thoroughly before shipping. |
| **STANDARD** | Moderate reach, reversible action, no concentrated high-value dependency. Normal verification. |
| **LIGHT** | Low reach, read-only or trivially reversible, no concentrated stakes. Light verification; say so plainly. |

Render exactly one. Reachability (a partial rollout) can lower the verdict; account concentration or a fast-rising trend can raise it past what raw reach implies — name the modifier that moved it.

| Classification | Meaning |
| --- | --- |
| **ADOPTION-LEANING** | New accounts/visitors arriving faster than repeat use grows. |
| **STICKINESS-LEANING** | The same users returning; repeat depth rising while reach is flat. |
| **BOTH** | Both signals present and material. |
| **NEITHER** | Flat or declining on both — consider whether the work is worth its cost. |
| **UNKNOWN** | Not enough trustworthy data to classify. |

## Final check

- Exactly one verification verdict and one adoption/stickiness classification.
- Reach is stated as a share of active users, with the window — never a bare count.
- Internal, test, and researcher traffic is separated from customer reach, not hidden.
- The change's lever (adoption vs. stickiness) is distinguished from the surface's own trajectory.
- The rating names the decisive modifier when reach alone would mislead (low reach + high-value account, or a partial rollout).
- A measurability note carries the `verify-instrumentation` verdict; a missing denominator/completion event is called out before it ships, not after.
- The emphasis points at a specific path, not "test everything".
- No usage claim exceeds what the measurement supports; no zero was rendered as zero use.
- Nothing external or live was changed.
