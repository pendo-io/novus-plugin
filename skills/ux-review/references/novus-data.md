# Backing a finding with Novus data

These tools come from the Novus MCP server. Hosts namespace MCP tools differently — Claude Code exposes
`listSignals` as `mcp__novus__listSignals` — so match on the tool-name suffix, not the full string.

## The rule that matters

**Query only where the diff already made you suspicious.** The temptation is to look up every artifact the change
touches and narrate the numbers back. That produces "this page has 500 visitors per month", which is not a finding and
actively trains the developer to ignore you.

A metric earns its place in the report only when it *is* the argument — when the number is the reason the change is a
problem.

## Tool map

| Question | Tool | Notes |
| --- | --- | --- |
| What does Novus know about this area? | `listArtifactsByType` | Types worth checking: `PAGE`, `FEATURE`, `TRACK_EVENT`, `FUNNEL`. Match artifacts to the areas the diff changes. Every tool below takes the artifact UUIDs this returns. |
| Is there a known problem here already? | `listSignals`, `getSignal` | Signals flagging frustration, declining usage, or UX issues are the most relevant. `listSignals` filters by domain (`product` / `guide`). |
| How much is this used? | `getArtifactMetrics` | One tool for `PAGE`, `FEATURE`, and `TRACK_EVENT` artifacts; pass the artifact UUID as `artifactId`. Visitors, accounts, events, adoption rates, trend against the previous period. |
| Does this break a flow? | `getFunnelAnalytics` | Pass the `FUNNEL` artifact UUID as `funnelArtifactId`. Visitors per step, conversion and drop-off between steps, time to complete. For changes that remove or reorder a step in a tracked funnel. |
| Do people come back? | `getRetentionCohorts` | Pass the page or feature artifact UUID as `artifactId`. `mode: "returnRate"` gives a single week-over-week return rate; the default gives first-visit weekly cohorts. Useful when a change restructures a landing or entry point. |
| Are people already frustrated here? | `listReplays` | Rage clicks, dead clicks, U-turns. Filterable by page/feature/track-event artifact UUIDs, date range, duration, frustration type. |
| Has Novus flagged this before? | `listUxReviews` | Past UX findings on this app's pull requests, newest first, with severity and resolution state. Use it to avoid repeating a concern the team has already litigated. |
| What is this artifact's Pendo ID? | `getExternalIds` | Only for cross-referencing the Pendo MCP server or the Pendo UI. The Novus tools above take artifact UUIDs directly, so this is never a prerequisite. |

## Order of operations

1. `listArtifactsByType` to find the artifacts matching the changed areas.
2. `listSignals` — cheap, and often tells you the problem is already known.
3. Metrics, funnel, retention, or replays — **only** for the specific suspicion you are testing.

## Reading results honestly

**Zero is not proof of nothing.** When a metrics result comes back with no recorded activity, the response includes a
`warnings` array saying so — the page may exist but be unused, or simply not be firing. Never turn that into "nobody uses
this page". Either surface the caveat or drop the finding.

**No data is not a finding.** If the artifact does not exist in Novus, or the query returns nothing usable, fall back to
whether the change is a problem on the code alone. Do not report the absence of data.

**Numbers go in the body, method goes in the details.** Phrase the impact plainly where the developer reads it — "about
1,200 people open this page every week" — and push the query, the ID, and the window into the technical detail block.

## When the server is not connected

Say so once, in one line, at the top of the review. Then:

- Work only from the code-observable half of `heuristics.md`.
- Do not speculate about traffic, adoption, or frustration.
- Close the report with the connect prompt from `report-format.md` — one line, at the very end, after the findings.
  One prompt covers both a signed-out server and a missing one; `SKILL.md` step 3 explains why the tool list cannot tell
  them apart.

Raise it in the footer and nowhere else. Not in a finding, not mid-review, and never as a reason to stop — a
code-observable review is a useful review, and the prompt is an offer, not a precondition.
