# Novus Data Validation behavior

Use this reference to mirror the existing in-product instrumentation check without overclaiming its coverage.

## Existing product flow

The Novus Data Validation page checks a selected Pendo application and:

1. probes whether raw events are arriving;
2. shows the live raw-event stream;
3. optionally shows **Novus's view** behind the `data-validation-novus-view` feature flag;
4. annotates meaningful events with their matched Novus artifact or an explicit gap;
5. offers **Teach Novus** for observed Page and Feature gaps.

The flag gates Novus's annotated view, not the existence of every raw-event capability. MCP hosts may expose all, some, or none of this flow.

## Matching semantics

- **Track Events:** match a Novus Track Event artifact by exact event name. An unknown name remains a gap.
- **Feature clicks:** match the observed element path against Pendo's compiled selector rules. A click with no Feature match remains a Feature gap; it does not fall back to a Page match.
- **Page views:** only `load` events match Pages, using the most specific compatible URL pattern.
- **Other UI events:** focus, change, blur, submit, and similar events remain visible in raw data but are not narrated as Page or Feature actions.
- **Page context:** a click may separately carry the Page it occurred on even when the click itself is an unmatched Feature gap.

Equivalent events may be collapsed for display. Preserve counts and inspect raw occurrences when duplicates, ordering, or intermittent firing matters.

## Focused repair

For an observed Page or Feature gap, **Teach Novus** starts a focused workflow that:

1. uses the observed URL and, for a click, the element fingerprint and known Page context;
2. inspects the linked repository for that one surface;
3. reuses existing Pages/Features when possible;
4. creates the needed artifact and syncs it to Pendo;
5. refreshes the live view so the observed event can prove the repair by matching.

This is a mutating workflow. Offer or invoke it only with authority. It does not repair an inconsistent custom Track Event name; resolve that through code and artifact-definition continuity.

## Honest limits

The in-product view primarily proves live arrival and artifact recognition for an observed session. By itself it does not prove:

- representative production coverage;
- correct employee/test filtering;
- historical continuity across renamed events or changed selectors;
- semantic correctness of every event property;
- complete coverage of unobserved alternate paths;
- causal validity of a product outcome.

Combine it with repository, artifact-definition, audience, and window checks before returning `TRUSTED` for a decision.
