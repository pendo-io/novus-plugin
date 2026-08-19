# Coverage audit output contract

## Lead summary

Lead with memory alignment and add traffic coverage when available:

> **Tagging coverage: X% of concrete memory surfaces are tagged. Traffic coverage: Y% of observed surfaces and Z% of meaningful events recognized.**

When traffic is unavailable, say so without weakening or suppressing memory alignment. Always include numerators and denominators, app, scope, memory sections checked, exact traffic window when applicable, and whether each result is exhaustive or sampled.

## Required text report

1. Memory alignment coverage, overall and by Page/Feature/Track Event.
2. Traffic surface and traffic-weighted coverage when available.
3. Ranked gaps labeled `Memory`, `Traffic`, or `Memory + Traffic`, with evidence, repair, and proof.
4. Configured tags not reflected in memory and configured tags not observed, separated from actual gaps.
5. Evidence limitations and one next action.

End an interactive report with: **Would you like me to create a shareable HTML report?** Do not create HTML unless the user requested it or opts in.

## Required HTML sections after opt-in

1. Memory alignment plus optional traffic coverage.
2. Page, Feature, and Track Event memory/traffic cards.
3. Ranked gaps with visible evidence-source labels.
4. Tags not reflected in memory and tags not observed, separated from actual gaps.
5. Evidence limitations and one next action.

Use color plus text labels; never rely on color alone. Make the file responsive, accessible, printable, self-contained, and free of external runtime dependencies.

## Interpretation rules

- Say `observed but unmatched`, not `unused`, for traffic-bearing gaps.
- Say `known in memory but untagged` for a concrete memory-backed gap.
- Say `tag not reflected in memory`, not `stale`, when memory has no counterpart.
- Say `configured, not observed in this window`, not `broken`, for quiet tags.
- Say `coverage unavailable` when the denominator cannot be tested.
- Never treat missing events as zero customer behavior.
- Never present memory as proof of production traffic.
- Do not claim an app-wide audit if the raw-event sample or artifact inventory was partial.
