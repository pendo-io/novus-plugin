# Usage Brief evidence map

Novus MCP tool prefixes vary by host (Claude Code exposes `getArtifactMetrics` as `mcp__novus__getArtifactMetrics`). Match on the capability suffix, not the full name.

## The rule that matters

**Query the surfaces the change touches, and only the numbers that change the rating.** The temptation is to pull every metric for every artifact and narrate it back. A number earns its place only when it moves the severity/test-emphasis verdict or names the adoption-vs-stickiness lever. "This page has 500 visitors" is not a brief.

## Resolve surfaces

| Need | Capabilities | Guidance |
| --- | --- | --- |
| What does Novus model here? | `listArtifactsByType` (`PAGE`, `FEATURE`, `TRACK_EVENT`, `FUNNEL`) | Match artifacts to the areas the diff/ticket changes, by name and route. |
| Novus IDs for metrics | `getExternalIds`, `getFilterVocabulary` | Metrics calls take resolved IDs; resolve once. |
| Is the surface itself gated? | flag reads, `listFlags` | A partial rollout caps a bug's blast radius — record the rollout %. |

## Usage of the associated parts

| Question | Capabilities | Notes |
| --- | --- | --- |
| Reach now / trend | `getArtifactMetrics` (`days: 7` and `days: 30`, `dayRange`) | Report unique visitors, accounts, and adoption %; include the period-over-period trend. |
| Share of active users | app-usage / MAU reads | Convert raw reach into a share — 40 visitors means nothing without the denominator. |
| Who uses it | `getArtifactTopUsers` (`kind: visitors` and `kind: accounts`) | The top accounts and visitors; read `daysActive` for stickiness, not just events. |
| Journey | `getVisitorActivity`, `getVisitorActivityForArtifact` | Trace one representative user's path to and through the surface when a path is legible. |
| Weekly ramp | `getArtifactMetrics` (`period: weekly`) | The shape over 6–8 weeks distinguishes a step-change from steady state. |

## Adoption vs. stickiness

Classify with numbers, not adjectives.

- **Adoption-leaning** — new accounts/visitors arriving faster than repeat use grows: account count climbing, new-vs-returning skewing new, a weekly ramp. Capabilities: `getArtifactMetrics` (`weekly`), new-vs-returning app reads, account-count trend.
- **Stickiness-leaning** — the same users returning: retention holding, `daysActive` high across the top users, repeat depth rising while unique reach is flat. Capabilities: `getRetentionCohorts` (weekly cohort retention, per page/feature via `artifactId`) and `getArtifactTopUsers` (`daysActive`); `getPageRetention` (7-day return rate) when the host exposes it — some deployments do not, so fall back to `daysActive` + the weekly ramp rather than treating its absence as no retention.
- **Both / Neither / Unknown** — say which, and separate the *surface's* trajectory from the *change's* lever: an in-flow enhancement usually deepens use for existing users (stickiness) even when its surface is being adopted; it rarely acquires new users on its own.

## Severity and test emphasis

Base rating:

- **Reach** — share of active users on the touched surfaces. Higher share → more emphasis.
- **Criticality** — is the surface in a critical or irreversible path (auth, onboarding, billing, a data write, an outbound delivery)? Use `listSignals`/`getFunnelAnalysis` to see if it sits on a tracked funnel and whether that funnel is already fragile.
- **Action type** — read-only view < state-changing write < outbound/irreversible effect.

Modifiers:

- **Reachability** — a flag or partial rollout scales a bug's blast radius *down* to that population.
- **Concentration / account value** — a few high-value or at-risk accounts scale stakes *up*, even at low reach (`getArtifactTopUsers` by account; segment/account reads).
- **Data-scale coupling** — does a break worsen as per-account volume grows?
- **Trend** — a fast-rising surface warrants more emphasis than a flat or declining one; a declining surface may warrant questioning the ticket.

Then run `verify-instrumentation` on the surface and carry its verdict as the measurability note: can this change's own impact be measured after it ships, or is a denominator/completion event missing?

## Reading results honestly

- **Zero is not proof of nothing.** A zero-activity result carries a `warnings` array; report the caveat or drop the claim. A genuinely unused surface lowers reach but can still be high-stakes on an irreversible action.
- **No data is not a finding.** If the artifact does not exist in Novus, fall back to a code-only scope; do not report the absence of data as usage.
- **Internal, test, and researcher traffic inflate reach.** Separate it by segment or account name; a ramp that is mostly internal or bug-bounty traffic is not proven customer adoption.
- **A share needs a denominator.** Never state reach as a share without the active-user base it is a share of, and the window.
- **Say it in product language.** Report every number the way a product person would — "about 118 people / 79 accounts a month, and slipping" — not "numVisitors 118, −15% period-over-period". The metric name, window, and trend math belong in your reasoning, not in the brief.
