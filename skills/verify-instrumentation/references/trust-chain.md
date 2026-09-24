# Verify Instrumentation trust chain

Novus MCP tool prefixes vary by host (Claude Code exposes `getArtifactMetrics` as `mcp__novus__getArtifactMetrics`). Match on the capability suffix, not the full name.

## The rule that matters

**Check only as far as the decision requires, and stop at the first broken link.** A surface can have healthy arrival and recognition and still be `UNTRUSTED` because the one event the decision hinges on was never added. Do not narrate all six checks when the decision fails at link 3.

Each link resolves to `pass` (holds for this decision), `limited` (holds but bounded — feeds `DEGRADED`), `fail` (breaks the decision — feeds `UNTRUSTED`), or `unknown` (could not establish — feeds `UNKNOWN`).

## The six links

| # | Link | The question | Novus capabilities | `fail` looks like |
| --- | --- | --- | --- | --- |
| 1 | **Arrival** | Do events for this surface reach Pendo at all? | `getRawEvents`, recording controls, `getArtifactMetrics` (nonzero) | No events in the window and no reason to expect exclusion. |
| 2 | **Recognition** | Do they map to a defined, synced artifact? | `listArtifactsByType`, `getArtifact`, `getExternalIds` | Traffic exists but no tagged Page/Feature/Track Event — untagged blob. |
| 3 | **Definition** | Does the artifact/funnel/goal mean what the decision assumes? | `getArtifact`, `getEventProperties`, `getFunnelAnalytics`, goal reads | A renamed or split event; a funnel step tagged to the wrong element; a "count" that is really two behaviors. |
| 4 | **Continuity** | Is coverage stable across the whole decision window? | `getArtifactMetrics` (`daily`/`weekly` series), Data Validation when exposed | A rename, retag, or SDK change mid-window that splits or drops the series. |
| 5 | **Audience** | Does the measured population match the exposed one? | `getArtifactTopUsers`, `listVisitors`/`listAccounts`, segment reads, exclude-list mode | Internal/test/researcher traffic dominates; the exclude list hides or inflates the exposed audience. |
| 6 | **Decision-critical coverage** | Do the one or two events the decision hinges on exist and fire? | `getFilterVocabulary`, `getArtifactMetrics`, `getEventProperties` | The denominator or completion event was never instrumented, so the rate the decision needs cannot be computed. |

## Order of operations

1. Resolve artifacts for the surface (`listArtifactsByType` → `getExternalIds`) — cheap, and tells you immediately if recognition fails.
2. Confirm arrival on those artifacts (nonzero metrics, or raw events).
3. Test definition and decision-critical coverage against what the decision actually needs — this is where most real failures live.
4. Only then check continuity and audience, and only when they could change the verdict.

## Reading results honestly

- **Zero is not proof of nothing.** A zero-activity result carries a `warnings` array. Report it as an *arrival* observation and hold at `UNKNOWN` unless independent evidence shows the event should have fired.
- **Not-found is not broken.** An artifact that does not exist in Novus is `unknown` recognition, not a `fail`. Name the artifact type that would need to exist.
- **A rename splits a metric.** Do not merge two event definitions to make coverage look complete; a split is a continuity `fail` or `limited`, not a clean pass.
- **Adjacent coverage is not decision coverage.** "The page is tagged" does not satisfy a decision that needs a completion or a denominator event. Judge link 6 against the exact rate the decision computes.
- **Internal and test traffic move the audience link, not the others.** A surface can be perfectly tagged and still mislead if researchers or test accounts dominate the window.
