# What counts as a UX problem

Ask yourself one question about every candidate finding: **"Would a UX designer flag this in a design review?"** If the
answer is no, drop it. That question, applied honestly, is most of this file.

There are two kinds of concern worth raising.

## 1. Code-observable problems

You can identify these by reading the diff. No analytics needed.

**Wrong visual semantics.** Red or danger colours for active and positive states, green for destructive actions, warning
icons on neutral information, other colour/icon mismatches that will make users think they broke something.

**Unpersisted UI state.** A toggle or setting held in local component state that should be persisted — to a store, an
API, or local storage. The user changes it, navigates away, comes back, and it has silently reset.

**Poor discoverability.** Important functionality buried in collapsed accordions, nested menus, or behind a non-obvious
interaction when it should be prominent.

**Inconsistent patterns.** A different interaction pattern for something the rest of the UI already handles with an
established one — an accordion plus a button where every neighbouring setting is an inline switch.

**Missing loading and error states.** Interactive elements that give no indication they are working, or that an action
failed.

**Confusing interaction models.** A button that looks like a toggle but is not. A destructive action with no
confirmation. Ambiguous labels where the user cannot predict what will happen.

**Accessibility issues.** Missing labels, non-interactive elements carrying click handlers, contrast problems apparent
from the code.

## 2. Data-backed concerns

These need Novus analytics to know whether the change actually matters. Skip this section entirely when the Novus MCP
server is not connected — never guess at the numbers.

**Removing or breaking a high-traffic path.** A route, button, or flow many users depend on is being removed, renamed, or
restructured.

**Adding redundant UI.** A new button or link duplicates functionality that already exists and is well adopted.

**Ignoring known frustration.** The change touches an area with rage clicks, high drop-off, or open signals, and does not
address the underlying issue.

**Breaking a funnel or flow.** The change removes or restructures a step in a tracked funnel or journey.

**Burying a well-used feature.** A high-adoption action moves to a less visible location.

## Not problems — do not report these

This list exists because the failure mode of a UX reviewer is noise, not blindness.

- Code that adds a new page or feature in a reasonable location. That is normal development.
- Style and CSS changes that do not meaningfully affect usability or layout.
- Internal refactoring that leaves the user-facing experience unchanged.
- Track-event or analytics changes that are purely instrumentation.
- A page having low traffic. Low traffic is not a defect in the diff.
- Anything you would phrase as "consider whether…" or "it might be worth thinking about…". If you cannot name the user
  impact, there is no finding.
- Engineering opinions wearing a UX costume: file structure, naming, DRYness, framework choice, performance.
