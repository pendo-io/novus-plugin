# Verify Instrumentation output contract

Produce one trust verdict and the single repair that would raise it — not an audit of everything checked. Another skill (or a person) will carry the verdict into a decision, so it must be unambiguous and reusable.

## Shape

```markdown
**Instrumentation: <TRUSTED | DEGRADED | UNTRUSTED | UNKNOWN>** · <surface> · <window>

<One sentence: what the decision needed to measure, and whether it can.>

**Trust chain:** arrival <status> · recognition <status> · definition <status> · continuity <status> · audience <status> · decision-critical <status>

**Smallest repair:** <the one specific event, tag, funnel step, or exclusion that would raise the verdict — or "none needed" when TRUSTED>.
```

- `<status>` is one of `pass` / `limited` / `fail` / `unknown` / `n/a` (not reached because an earlier link already decided it).
- Render the chain on one line. Expand a link into prose only when it is the one that set the verdict.
- Keep it under ~90 words plus the chain line. This is a sub-result, not a report.

## Verdict gates

| Verdict | Required gate |
| --- | --- |
| TRUSTED | Every decision-critical link is `pass`. No limitation can reverse the specific conclusion. |
| DEGRADED | A `limited` link exists; the conclusion still holds within a stated bound (e.g. directional only, one segment only). |
| UNTRUSTED | A decision-critical link is `fail`. The measurement cannot carry the conclusion. |
| UNKNOWN | The chain could not be established — Novus unavailable, no matching artifact, or no arrival evidence. Never a substitute for `UNTRUSTED`. |

- A single decision-critical `fail` forces `UNTRUSTED` regardless of how healthy the other links are.
- `unknown` on a decision-critical link forces `UNKNOWN`, not `UNTRUSTED` — absence of proof is not proof of a break.
- `DEGRADED` must name the bound it is degraded to; a limitation with no stated bound is `UNTRUSTED`.

## Final check

- Exactly one verdict, drawn from the four values.
- The verdict names the surface and window it applies to.
- The chain shows where it broke; a `fail`/`limited` link is explained, the rest are not narrated.
- Exactly one smallest repair (or "none needed").
- No zero-activity result was rendered as zero use.
- No artifact was invented, and "not found" was not reported as `UNTRUSTED`.
- No instrumentation, artifact, or rollout was changed.
