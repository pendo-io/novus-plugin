# Coverage report data contract

Pass one JSON object to `render_coverage_report.py` after the user opts into HTML.

```json
{
  "meta": {
    "appName": "Novus Production",
    "appId": "-323232",
    "scope": "Signals",
    "scopeType": "product-area",
    "windowStart": "2026-08-11T12:00:00Z",
    "windowEnd": "2026-08-18T12:00:00Z",
    "generatedAt": "2026-08-18T12:05:00Z",
    "coverageLabel": "Memory audit plus bounded traffic sample",
    "memorySections": ["product_areas", "flows", "sitemap"],
    "dataSources": ["Novus memory", "Novus raw events", "Novus artifacts"]
  },
  "summary": {
    "memoryCoverage": 76.5,
    "taggedMemorySurfaces": 26,
    "memorySurfaces": 34,
    "trafficCoverage": 91.2,
    "recognizedEvents": 4180,
    "meaningfulEvents": 4584
  },
  "types": [
    {
      "type": "Pages",
      "memoryCoverage": 88.9,
      "taggedMemorySurfaces": 8,
      "memorySurfaces": 9,
      "trafficCoverage": null,
      "recognizedEvents": 0,
      "meaningfulEvents": 0
    }
  ],
  "gaps": [
    {
      "priority": "High",
      "type": "Feature",
      "surface": "Create PR button",
      "context": "/signals/:id",
      "state": "Known in memory but untagged",
      "evidenceSource": "Memory + Traffic",
      "eventCount": 142,
      "trafficShare": 3.1,
      "evidence": "The Signals flow names Create PR, and observed clicks did not match a Feature.",
      "repair": "Teach Novus the stable data-testid selector.",
      "proof": "Repeat both click paths and confirm the intended Feature matches."
    }
  ],
  "tagsNotInMemory": [
    {
      "type": "Feature",
      "surface": "Legacy origin filter",
      "definition": "button[data-filter='origin']",
      "note": "Review memory or confirm this tag is obsolete; absence from memory is not proof of staleness."
    }
  ],
  "configuredNotObserved": [],
  "limitations": [
    "Raw events were capped at the newest 200 events.",
    "Memory does not prove that a surface still ships or receives traffic."
  ],
  "nextAction": "Repair the highest-confidence memory-backed gap, then replay the same path."
}
```

## Required fields

- `meta.appName`, `meta.scope`, `meta.scopeType`, `coverageLabel`, `memorySections`, and `dataSources`.
- Traffic window boundaries when traffic was checked; use empty strings when unavailable.
- Memory coverage with numerator and denominator.
- Traffic coverage with numerator and denominator; set `trafficCoverage` to `null` when unavailable.
- `types` entries for every audited type. A type-level traffic percentage may be `null`.
- `gaps`, `tagsNotInMemory`, `configuredNotObserved`, and `limitations`; use empty arrays when none.
- `nextAction` as one focused action.

Percentages are numbers from 0 through 100 or `null` only where traffic is unavailable. Counts are non-negative integers. The renderer validates inputs and fails instead of inventing missing values.
