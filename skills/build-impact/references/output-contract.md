# Build Impact output contract

Produce one impact decision, not an analytics recap. Default to a compact, Slack-scannable report when the request concerns a builder's recent PRs, a weekly update, or Slack delivery.

## Choose one lens

- **Product-builder lens (default for weekly reports):** lead with the customer problem, improved experience, and observed outcome. Use PRs as evidence.
- **Engineering lens:** lead with the system behavior, invariant, reliability, correctness, or performance improvement, then connect it to the customer outcome.

Render exactly one lens. Do not provide both unless the user explicitly asks to compare them.

## Weekly Slack report

Use exactly this four-part shape:

```markdown
🔎 **Your code in the wild · <person>**

*<One plain-language sentence describing what is better for customers.>*

**What your work adds up to**

- <Customer-facing improvement>. ([PR #123](stable-url))
- <Customer-facing improvement>. ([PR #456](stable-url))

**Released:** <Month D, YYYY> · <release/version link when available>
<Optional one-sentence exposure note when audience or rollout limits matter.>

**What customers are doing**

**Data confidence:** <TRUSTED | DEGRADED | UNTRUSTED | UNKNOWN> · <One short scope or limitation note>.

- <Surface> reached **X% more people**, across **Y% more accounts**, with **Z% more activity** than <comparison window>.
- <Second decision-relevant movement in the same sentence form>.
- <One retention, completion, quality, or guardrail measure when available>.

**The read:** **<Plain-language verdict>.** <One short sentence separating observed movement from attributable impact.>

**Watch next:** <One current signal and the behavior, cohort, or guardrail it makes decision-relevant>. **Next: <plain-language action>.** **Review:** <One anchored condition and the evidence that would change the verdict>.
```

Render the single verdict and action in natural Slack language:

| Decision value | Slack wording |
| --- | --- |
| `WORKED` | **It worked.** |
| `PARTIAL` | **Partly.** |
| `DID NOT WORK` | **It didn't work.** |
| `TOO EARLY` | **Too early.** |
| `CANNOT VERIFY` | **Not proven yet.** |
| `expand` | **Expand it.** |
| `continue` | **Keep watching.** |
| `modify` | **Change it.** |
| `rollback` | **Roll it back.** |
| `repair measurement` | **Fix the measurement.** |

### Slack shape rules

- Aim for 130–180 words and never exceed 220 words, excluding link targets and a compact source line.
- Use only the four content blocks in the template; do not add headings or sections. Fold confidence, action, and review into those blocks.
- Use two to four improvement bullets and name the exact PRs inline.
- Group PRs by customer experience, not by file or commit chronology.
- Render shipping as exactly one `Released` line: the date the final required change made the described experience available. Preserve earlier per-PR dates in the analysis or linked sources.
- Add at most one exposure note. Include it only when a flag, audience, or rollout boundary changes how the metrics should be read.
- Put the affected audience in the opening sentence or exposure note; do not add a separate "Who this helps" section.
- Write customer movement as complete sentences. Prefer "reached 71% more people" to a table or a row of unlabeled percentages.
- Put the instrumentation verdict in the one-line `Data confidence` note before interpreting product metrics. Never infer it from an aggregate or invent a validation result; use `UNKNOWN` when no current check exists.
- Keep the read to the verdict plus one sentence. Put detailed caveats into the evidence selection, not a long audit paragraph.
- Use a relevant Novus signal in `Watch next` to support the action. If the read is early, prefer the behavior that would demonstrate repeat value over another top-line reach count.
- Keep stable PR, issue, release, artifact, flag, rollout, signal, and metric-window identifiers as inline links or a compact source line.

## Decision brief

When the user explicitly asks for a rollout, rollback, experiment, or audit decision rather than a weekly builder report, keep the same order—verdict, proof, outcome, reason, action—but expand only the evidence needed for that decision. Use a comparison table only when four or more measures genuinely need row-by-row comparison.

Always state the last verified shipping state, affected audience, exposure start, measurement window, and instrumentation verdict somewhere in the response. Compress these into the release line, exposure note, metric sentences, and read when using the Slack format.

## Verdict gates

| Verdict | Required gate |
| --- | --- |
| WORKED | Exposed + elapsed window + trusted measurement + improved intended outcome + acceptable guardrails. |
| PARTIAL | Credible benefit, but limited audience/outcome or a material caveat prevents WORKED. |
| DID NOT WORK | Exposed + elapsed window + trusted measurement + no intended improvement or decisive guardrail failure. |
| TOO EARLY | Exposure or expected outcome window is incomplete. |
| CANNOT VERIFY | Exposure, primary measurement, or comparison is too weak to decide. |

`UNKNOWN` or `UNTRUSTED` primary measurement requires `CANNOT VERIFY`. Reserve `TOO EARLY` for verified exposure with `TRUSTED` or decision-fit `DEGRADED` measurement when only the outcome window is incomplete.

## Final check

- The response answers “did it work?” without making the reader parse an audit.
- Merge, exposure, and measurement are not conflated.
- An instrumentation verdict appears before product metrics are interpreted.
- Observed movement and attributable impact are separate.
- The result does not hide internal/test traffic or competing changes.
- Weekly reports name exact PRs and use one release date for the completed experience.
- Weekly reports are scannable in Slack and use no metric table.
- The next action is supported by a current signal when one exists.
- Exactly one next action and one review condition are present.
- No external or live-user change occurs without authority.
