---
name: verify-instrumentation
description: Use when someone asks whether product analytics, events, Pages, Features, Track Events, funnels, journeys, goals, or post-release measurements are accurate, complete, firing, mapped correctly, or trustworthy enough for a decision.
---

# Verify Instrumentation

Answer one question: **Can this product measurement be trusted for the decision at hand?** Check the smallest relevant feature or flow by default; do not turn a targeted request into an application-wide audit.

## Core model

Configured is not firing. Firing is not recognized. Recognized is not necessarily semantically correct or complete.

Return one verdict:

- **TRUSTED** — the measurement is fit for the stated decision.
- **DEGRADED** — a bounded conclusion remains safe, with named limits.
- **UNTRUSTED** — a known instrumentation defect can reverse or materially distort the conclusion.
- **UNKNOWN** — evidence or access is insufficient to test trust.

Keep tools read-only by default. Do not tag artifacts, change Pendo definitions, start recording, modify code, or sync anything unless the surrounding task authorizes that action.

## Workflow

### 1. Resolve the decision and target

Infer the target from the named feature, flow, goal, issue, PR, current diff, or metric under discussion. State:

- one application and audience;
- the decision this data will support;
- the Pages, Features, Track Events, funnel/journey steps, or goal measures that must be trustworthy;
- the observation window or live test session.

Ask at most one question only when competing targets would change the check. Never merge applications.

### 2. Use Novus Data Validation first

Read [references/data-validation.md](references/data-validation.md). Prefer a first-class Novus instrumentation-check or Data Validation capability when the host exposes one. Otherwise compose the check from Novus raw events, artifacts, external references, event properties, metrics, repository code, and the current issue or PR.

Follow the in-product Data Validation model:

1. Confirm raw events are arriving for the selected app.
2. Observe a focused live path when possible.
3. Match meaningful events to Novus artifacts.
4. Treat unmatched meaningful events as gaps, not customer zeros.
5. Identify the smallest repair, then re-run the same path.

Do not claim the full in-product audit ran when only component tools were available. State the actual coverage.

### 3. Check the trust chain

Read [references/evidence-map.md](references/evidence-map.md). Evaluate only layers relevant to the decision:

1. **Arrival** — expected events reach Pendo in the selected app.
2. **Recognition** — Page loads, Feature clicks, and Track Events match the intended artifacts.
3. **Definition** — URL rules, selectors, event names, properties, and external references represent the intended behavior.
4. **Continuity** — renamed events, selector changes, routes, releases, and sync failures do not split the measurement window.
5. **Audience** — app, segment, account/visitor identity, and employee/test filtering fit the decision.
6. **Coverage** — every decision-critical step is observed in the right order; duplicate or alternate client paths are accounted for.

Test semantic correctness against repository code or an observed path when available. A technically matching event with the wrong business meaning is not trustworthy.

### 4. Classify the effect of every gap

For each gap, state whether it:

- blocks the decision;
- narrows the safe conclusion;
- is irrelevant to this decision.

Use `UNTRUSTED` when a primary measure or critical flow step is known broken. Use `UNKNOWN` when it could be broken but cannot be tested. Never reinterpret missing events as no use, no conversion, or no impact.

### 5. Return the verdict and repair

Read [references/output-contract.md](references/output-contract.md) immediately before responding. Lead with the verdict and the decision it permits or blocks.

Recommend one smallest repair or validation action. When a Page or Feature gap is visible and the in-product capability is available, offer the focused **Teach Novus** flow. For Track Event naming gaps, identify the exact code or definition change instead; do not pretend the Page/Feature tagging workflow repairs custom event semantics.

After any repair, require the same observed path to re-match before upgrading trust. Configuration success alone is not proof.

## Degraded behavior

- **No first-class Data Validation MCP tool:** compose from `getRawEvents`, artifact definitions, external IDs, metrics, and repository evidence; disclose partial coverage.
- **Raw-event recording off:** use existing historical/definition evidence. If a live capture is required, request the one exact recording action or admin permission needed.
- **Novus unavailable:** perform a static code and definition review; return `UNKNOWN` or `DEGRADED`, never full trust.
- **No repository:** validate arrival and matching, but label semantic code coverage unavailable.
- **No representative traffic:** use a controlled test session and keep audience-level trust `UNKNOWN` until representative evidence exists.
- **Tool failure:** retry a read once, then preserve the gap in the verdict.

## Handoffs

- `verify-impact` must consume this verdict before interpreting a Pendo outcome.
- `whats-next` and `build-investment` must lower confidence or avoid conclusions that rely on untrusted measurements.
- `goal-to-experiment` should turn the exact repair and recheck into pre-launch acceptance criteria when measurement blocks the experiment.

## Scope boundary

Do not use this skill to add broad new tracking, automatically instrument the entire application, decide whether a product change worked, or assess portfolio allocation. Novus automatically instruments supported surfaces; this skill verifies whether the resulting evidence can be trusted.
