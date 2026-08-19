---
name: verify-instrumentation
description: Audit product tagging coverage by comparing Novus product memory and, when available, observed traffic with configured Pages, Features (click events), and Track Events. Use when someone asks what is tagged, what is untagged, whether instrumentation coverage is complete, where memory- or traffic-backed gaps exist, or requests a coverage breakdown for a feature, flow, product area, or an entire app. Return a concise coverage analysis and optionally create a shareable visual HTML report.
---

# Verify Instrumentation Coverage

Answer: **What does Novus know the product contains, how much of it is tagged, what traffic is recognized, and where are the highest-impact gaps?**

This is a coverage audit, not an impact evaluation. Keep reads non-mutating. Do not start capture, create or sync artifacts, change definitions, or modify product code unless separately authorized.

## 1. Resolve scope

Select exactly one application. Never combine apps.

- If the user names a feature, flow, or product area, audit that scope.
- If the user supplies a PR, issue, or diff, use it only to identify the relevant product area unless the user explicitly requests a diff-only audit.
- If the user gives no scope, audit the full selected app. Do not infer a narrow target from the current diff.
- Use current app context when unambiguous. If several apps are plausible and no current app exists, ask one app-selection question.

Use the requested observation window. Otherwise default to the most recent representative window available, normally 7 days for area/app audits and a focused live session for a single flow. State exact boundaries and whether the sample is exhaustive or bounded by tool limits.

## 2. Build the expected-surface inventory from memory

Read [references/coverage-model.md](references/coverage-model.md) before gathering data.

Use `getMemory` as the primary expected-product map. Memory describes what the product contains; it does not prove traffic.

- For a whole-app audit, read `overview`, `product_areas`, `flows`, `sitemap`, and `integrations`.
- For a named feature, flow, or product area, query memory for that scope and read the relevant full sections needed to avoid a narrow keyword-only result.
- Extract concrete routes/Pages, meaningful interactions, flow milestones, and custom/server events. Preserve the memory section and wording that support each expected surface.
- Include only specific, taggable behaviors. Do not turn vague capabilities, personas, or outcomes into invented tags.
- When memory is unavailable, use repository routes and product-flow evidence as a fallback and label memory coverage unavailable.

## 3. Inventory configured instrumentation

For the selected app and scope, inventory:

- Page artifacts and URL rules;
- Feature/click-event artifacts, selectors, and Page context;
- Track Event artifacts, exact event names, required properties, and known code locations;
- relevant funnel or journey steps when the scope names a flow;
- sync/external-reference status when exposed.

For product-area scope, connect artifacts using names, descriptions, routes, Page containment, source paths, and repository ownership. Label uncertain membership rather than silently excluding it.

Compare the configured inventory with memory before using traffic. Classify every concrete memory surface as tagged, untagged, conflicting, or unresolved.

## 4. Observe traffic when available

Prefer a first-class Novus Data Validation or instrumentation-check capability. Otherwise compose the audit from `getRawEvents`, configured artifacts, external references, event properties, metrics, and repository evidence.

1. Confirm events are arriving for the selected app.
2. Gather the broadest representative raw-event sample available for the window.
3. Preserve event counts, URLs, element fingerprints/selectors, Track Event names, timestamps, and Page context.
4. Exclude non-meaningful UI noise such as focus, blur, and change from the coverage denominator unless explicitly requested.
5. Disclose pagination, recording, retention, sampling, or audience-filter limits.

Do not interpret an empty result as no usage. It may mean no traffic, capture unavailable, filtering, retention limits, or broken emission.

Traffic is an additional evidence layer, not a prerequisite for a coverage audit. If capture is unavailable or unrepresentative, continue with memory alignment and state the traffic limitation.

## 5. Match traffic to tags

Apply the matching rules in [references/coverage-model.md](references/coverage-model.md):

- Page coverage uses observed `load` events and the most-specific compatible URL rule.
- Feature coverage uses observed clicks and compiled selector matching. A Page match does not make its clicks tagged.
- Track Event coverage uses exact event-name matching; verify required properties when the decision depends on them.

Classify every meaningful observed surface as:

1. **Recognized** — observed traffic matches the intended artifact.
2. **Unmatched** — meaningful traffic arrived but no artifact recognized it.
3. **Misrecognized** — traffic matched an artifact with the wrong business meaning or scope.
4. **Ambiguous** — multiple definitions or insufficient evidence prevent a reliable match.

Separately classify configured artifacts with no observed traffic as **configured, not observed**. Do not count them as tagging gaps without further evidence.

## 6. Calculate coverage

Report memory alignment first, then traffic coverage when available. Do not collapse them into one score:

- **Memory alignment coverage** = concretely taggable memory surfaces with a matching intended tag / all concretely taggable memory surfaces evaluated.
- **Traffic surface coverage** = recognized distinct observed surfaces / all distinct observable surfaces.
- **Traffic-weighted coverage** = recognized meaningful event occurrences / all meaningful observed event occurrences.

Calculate overall and Page/Feature/Track Event breakdowns. If a reliable traffic denominator cannot be formed, report memory alignment plus observed/configured counts and label traffic coverage unavailable. Do not mix types, apps, audiences, or windows.

Rank gaps by observed traffic share, flow criticality, and confidence. Distinguish:

- traffic-bearing gaps that need tagging;
- broken or overly broad definitions;
- duplicate/overlapping tags;
- stale-tag candidates supported by repository removal, history, or conflicting memory;
- evidence limitations that need another capture.

Also report configured tags that have no corresponding concrete memory surface as **not reflected in memory**. Treat these as memory-maintenance or stale-tag review candidates, not automatic tagging defects.

## 7. Return the coverage report

Read [references/output-contract.md](references/output-contract.md). Return the text coverage breakdown first unless the user already asked for HTML.

End an interactive text report with: **Would you like me to create a shareable HTML report?** Do not create the file until the user opts in.

If the user requests HTML initially or accepts the offer, read [references/data-contract.md](references/data-contract.md), build the renderer input, and create the standalone file:

```bash
python3 scripts/render_coverage_report.py <coverage.json> <coverage.html>
```

Resolve the script relative to this skill directory. Save the HTML in the user's requested location. If unspecified, use the current workspace's artifact, output, or visualization directory.

- In Codex or another filesystem-capable host, return a clickable absolute path and display/open the report when supported.
- In an artifact-capable Claude host, return the same self-contained HTML as an artifact.
- If neither is possible, return the concise text summary required by the output contract.

Do not include secrets, tokens, raw private conversations, or unnecessary visitor identifiers in the report.

## 8. Verify and hand off

Before responding:

- when HTML was requested, open the generated file and verify desktop and mobile layout;
- confirm overall totals reconcile with the type breakdown;
- confirm memory-backed and traffic-backed evidence remain visibly distinct;
- confirm every surfaced gap has observed evidence or is clearly labeled uncertain;
- confirm configured-but-unobserved artifacts are not counted as missing tags;
- confirm the report names the app, scope, window, sample limits, and data sources.

Lead the response with coverage, not process. Include the highest-impact gaps and exact limits of the audit. Include the HTML link only after the user opts in.

## Repair boundary

Recommend focused repairs, but do not perform them without authorization. For a Page or Feature gap, offer Teach Novus when available. For Track Events, name the exact event-name/property/code correction. Require the same path or traffic source to match after repair before calling the gap closed.
