# Tagging coverage model

## Scope modes

| Input | Audit scope |
| --- | --- |
| Named feature or flow | Its Pages, clicks, Track Events, and ordered critical steps |
| Named product area | Routes, contained artifacts, relevant event names, and repository-owned surfaces |
| No scope | All observable surfaces in the selected app |

Never silently narrow a no-scope request to the current diff.

## Evidence priority

Use two independent evidence axes:

1. **Expected product surface:** Novus memory, then repository routes/flows when memory is unavailable or ambiguous.
2. **Observed behavior:** annotated Data Validation events, then raw events reconciled with artifact definitions.

Use artifact definitions, external references, metrics, and repository code to resolve either axis. Documentation or issue descriptions are supporting evidence only.

State when matching is inferred rather than product-verified.

## Memory semantics

Read memory through `getMemory`:

- `sitemap` identifies concrete routes and Pages.
- `flows` identifies ordered interactions and decision-critical milestones.
- `product_areas` identifies area boundaries and key capabilities.
- `integrations` identifies meaningful connection and lifecycle behaviors.
- `overview` supplies context and an index; it is not a complete surface list.

Normalize each concrete memory item into one expected surface with:

- expected type: Page, Feature, Track Event, or unresolved;
- name and route/interaction/event identity when available;
- product area or flow context;
- source section and supporting wording;
- confidence: high for explicit routes/events, medium for specific interactions, low for inferred tag types.

Exclude vague outcomes such as “improve adoption,” broad capabilities with no concrete interaction, and persona descriptions. Never invent selectors or event names from prose.

Classify the memory-to-tag comparison:

| State | Meaning | Counts as memory-aligned |
| --- | --- | ---: |
| Memory-backed, tagged | Intended artifact represents the concrete memory surface | Yes |
| Memory-backed, untagged | Concrete memory surface has no intended artifact | No |
| Memory/tag conflict | Artifact exists but its route, selector, event name, or semantics conflict | No |
| Memory unresolved | Memory is too vague to determine the intended tag | Exclude from denominator |
| Tag not reflected in memory | Configured tag has no concrete memory counterpart | Separate review queue; not automatically a defect |

## Meaningful event units

### Pages

- Include observed `load` events with a usable URL.
- Normalize only volatile URL values that Page rules intentionally abstract, such as IDs represented by wildcards.
- Match the most-specific compatible Page rule.
- Treat overlapping equally specific rules as ambiguous.

### Features

- Include intentional click/tap events with an element fingerprint or selector evidence.
- Match the observed element against compiled Pendo selector rules and Page context.
- Do not count focus, blur, change, mouse movement, or generic container clicks by default.
- A click without a Feature match remains unmatched even when its Page matches.

### Track Events

- Include custom Track Event occurrences by exact event name.
- Compare case, punctuation, separators, and version suffixes exactly.
- Treat old and new names as separate surfaces unless explicit continuity exists.
- When required properties are part of the intended measurement, split `recognized` from `recognized but incomplete properties`.

## Coverage states

| State | Meaning | Included in observed denominator | Counts as covered |
| --- | --- | ---: | ---: |
| Recognized | Intended artifact matched | Yes | Yes |
| Unmatched | Meaningful traffic arrived without a match | Yes | No |
| Misrecognized | Match exists but semantics are wrong | Yes | No |
| Ambiguous | Matching cannot be resolved reliably | Yes, when observable | No; show separately |
| Configured, not observed | Artifact exists but no sampled traffic appeared | No | No; not a gap by itself |
| Not observable | Capture/access cannot test the surface | No | No; disclose as limitation |

## Metrics

Calculate per type and overall:

```text
memoryAlignmentCoverage = taggedConcreteMemorySurfaces / concreteMemorySurfacesEvaluated
trafficSurfaceCoverage = recognizedDistinctObservedSurfaces / observableDistinctSurfaces
trafficWeightedCoverage = recognizedMeaningfulEvents / meaningfulObservedEvents
```

A memory surface is one concrete, taggable route, interaction, or event named by memory. An observed surface is a normalized URL, clickable element identity in Page context, or exact Track Event name. Always provide numerator and denominator next to a percentage.

Never combine memory alignment and traffic coverage into one percentage. Memory answers whether the known product is represented; traffic answers whether captured behavior is recognized.

Do not manufacture precision from a truncated sample. When raw-event tools expose only the newest N events, label the result `sample coverage` and include N.

## Gap ranking

Rank using these factors in order:

1. Critical flow step or primary conversion outcome.
2. Gap supported by both memory and observed traffic.
3. Share and count of observed meaningful traffic.
4. Explicitness and confidence of the memory evidence.
5. Breadth across routes, visitors, or client variants.

Use priorities:

- **Critical** — missing or wrong recognition at a required flow/outcome step.
- **High** — material traffic-bearing gap or broadly broken definition.
- **Medium** — bounded traffic gap, ambiguity, or duplicate definition.
- **Low** — stale tag or low-volume issue that does not affect a critical flow.

## Honest limits

- Recent raw traffic proves mechanics and sampled coverage, not historical continuity.
- Memory is a product-understanding model, not proof that a surface shipped, still exists, or receives traffic.
- A surface absent from memory may expose stale memory rather than a stale tag.
- No observed traffic does not prove a configured tag is stale.
- A high traffic-weighted score can hide many low-volume untagged surfaces; show surface coverage too.
- A high surface score can hide one very large untagged surface; show traffic-weighted coverage too.
- Internal/test traffic can prove matching mechanics but not customer coverage.
- Repository evidence clarifies semantics but does not prove production firing.
