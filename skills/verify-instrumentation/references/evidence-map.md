# Verify Instrumentation evidence map

Novus MCP tool prefixes vary by host. Match capability suffixes rather than full names.

## Preferred source order

| Need | Preferred capability or source | Evidence produced |
| --- | --- | --- |
| Selected app | `listApps`, current app context | Stable app ID and platform. |
| Live arrival | first-class Data Validation status/events, `getRawEvents`, recording status | Fresh observed event and time. |
| Artifact recognition | annotated Data Validation events | Matched artifact ID/type or explicit gap. |
| Definitions | `listArtifactsByType`, `getArtifact`, `getExternalIds`, `getEventProperties` | URL pattern, selector, event name/properties, sync state. |
| Flow completeness | funnel/journey definition plus raw events and metrics | Ordered decision-critical steps and gaps. |
| Audience correctness | account/visitor/segment reads and filters | Included population and internal/test handling. |
| Semantic correctness | repository diff/code, linked issue/PR, observed user path | What behavior actually emits each event. |
| Existing problems | `listSignals`, `getSignal` | Known instrumentation or data-quality findings. |

## Capability resolution

1. Prefer a first-class `checkInstrumentation`, instrumentation health, or Data Validation tool when exposed.
2. Otherwise use raw-event arrival plus Novus artifact matching/definitions.
3. When annotated matching is unavailable, conservatively reconcile raw event names, URLs, and click context against artifacts and code; label this inferred rather than product-verified matching.
4. Use direct Pendo/Novus MCP evidence before issue descriptions or documentation claims.
5. Use Linear/Jira only to understand intended behavior or known gaps. An issue status does not prove a repair works.

## Decision-critical tests

- **Page:** observe the intended route and verify the correct, most-specific Page definition matches.
- **Feature:** perform the intended click and verify a Feature—not merely its parent Page—matches.
- **Track Event:** exercise every relevant client/server path and verify one intended name and required properties.
- **Funnel/Journey:** verify each critical step independently before interpreting conversion or completion.
- **Goal/impact metric:** trace the goal measure to its underlying artifact definitions and audience filters.

## Evidence honesty

- No events can mean no traffic, recording unavailable, filtering, wrong app, broken installation, or broken emission.
- A Page match does not prove its clicks are tagged.
- A matched event does not prove its properties or business meaning are correct.
- A single internal session can prove mechanics, not representative audience coverage.
- A successful artifact sync does not prove a future event will match.
- Old and new event names are separate measurements until continuity is explicitly established.
- Preserve app ID, artifact IDs, event names, URLs/selectors, timestamps, session/account context, and checked code paths.
