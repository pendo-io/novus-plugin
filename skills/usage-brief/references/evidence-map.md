# Usage Brief evidence map

Novus MCP tool prefixes vary by host (Claude Code exposes `getArtifactMetrics` as `mcp__novus__getArtifactMetrics`). Match on the capability suffix, not the full name.

## The rule that matters

**Lead with current usage, then read whether the change can grow it — and pull only the numbers that inform those two things.** The temptation is to fetch every metric for every artifact and narrate it back. A number earns its place only when it describes current usage of the touched area or the change's potential to move it. "This page has 500 visitors" on its own is not a brief.

## Resolve surfaces

| Need | Capabilities | Guidance |
| --- | --- | --- |
| What does Novus model here? | `listArtifactsByType` (`PAGE`, `FEATURE`, `TRACK_EVENT`, `FUNNEL`) | Match artifacts to the areas the diff/ticket changes, by name and route. |
| Novus IDs for metrics | `getExternalIds`, `getFilterVocabulary` | Metrics calls take resolved IDs; resolve once. |
| Is the surface gated? | flag reads, `listFlags` | A flag or partial rollout caps who can reach the surface — it bounds the reachable population, so it bounds the growth ceiling. |

## Current usage — the headline

Fill the first block with these.

| Question | Capabilities | Notes |
| --- | --- | --- |
| Reach now / trend | `getArtifactMetrics` (`days: 7` and `days: 30`, `dayRange`) | Unique visitors, accounts, and adoption %; include the period-over-period trend. |
| Share of active users | app-usage / MAU reads | Convert raw reach into a share — 40 visitors means nothing without the base. |
| Who uses it | `getArtifactTopUsers` (`kind: visitors` and `kind: accounts`) | Top accounts and visitors; separate internal / test / researcher traffic by name. |
| The touched control's own use | `getArtifactMetrics` on that Feature/Track Event | When the specific control the change touches is instrumented, report its own usage too. |

## Can this change grow usage?

An **estimate**, grounded in evidence — never a predicted number.

- **Headroom** — is usage low or declining (room to grow) or high and saturated (little room)? `getArtifactMetrics` reach + trend. Low usage on a live area means high headroom, not "no potential".
- **Lever** — which way does the change grow usage: **new users**, **deeper use** for people already here, or **neither**? Read it from the growth shape and separate it from the surface's own trajectory:
  - *new users* → account count climbing, new-vs-returning skewing new, a weekly ramp (`getArtifactMetrics` `weekly`, account-count trend, new-vs-returning app reads);
  - *deeper use* → the same users returning (`getRetentionCohorts`; `getArtifactTopUsers` `daysActive`; `getPageRetention` when the host exposes it — some do not, so fall back to `daysActive` + the weekly ramp rather than treating its absence as no retention).
  An in-flow enhancement usually deepens use for existing users even when its surface is being adopted; it rarely acquires new users on its own.
- **Reachable population** — the ceiling: who could adopt this if it works (upstream reach / entry points; the flag gate above). A change capped to a small gated group has a small ceiling regardless of headroom.
- **The number that would show it worked** — name the metric this change could move and its value now; run `verify-instrumentation` on it. If it is not cleanly measurable (missing denominator/completion event), say so and where the number would come from instead.
- **Known friction it addresses** — `listSignals` / `getFunnelAnalysis`: if Novus already flags a problem here (low conversion, a broken step, frustration), closing it raises the potential; cite the signal.

## Resolve the post target

- **Pull request first** — a PR for the current branch, via the git host tools the agent has (GitHub / Bitbucket). Post the comment there.
- **Otherwise the ticket** — the linked Linear/Jira issue (native Novus integration, a direct connector, or the id in the branch/PR).
- **Confirm before posting**, always. If neither resolves, or there is no write access, return the comment for manual paste and say it was not posted. Never guess a target.

## Reading results honestly

- **Zero is not proof of nothing.** A zero-activity result carries a `warnings` array; report the caveat or drop the claim. A genuinely unused surface has *more* headroom, not less — say that, don't render zero as "no potential".
- **No data is not a finding.** If the artifact does not exist in Novus, give a code-only scope; do not report the absence of data as usage.
- **Internal, test, and researcher traffic inflate reach.** Separate it by segment or account name; a ramp that is mostly internal or bug-bounty traffic is not proven customer usage or proven potential.
- **A share needs a denominator.** Never state reach as a share without the active-user base it is a share of, and the window.
- **Say it in product language.** Report every number the way a product person would — "about 118 people / 79 accounts a month, and slipping" — not "numVisitors 118, −15% period-over-period". The metric name, window, and trend math belong in your reasoning, not in the brief.
