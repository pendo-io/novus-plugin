# Writing the report

Your reader is a **builder without deep technical expertise**. Lead with what they care about — the user impact — and
keep the engineering specifics out of the way.

The report is printed into a terminal, so write plain Markdown and nothing else. **No raw HTML**. Novus renders this same finding on the pull
request with its own markup; your job is the content, not GitHub's presentation of it.

## Severity

- **critical** — This will clearly break the experience. Removing a page 60%+ of visitors use; a toggle that does not
  persist so settings silently reset.
- **warning** — This could confuse users or degrade the experience. Wrong colour semantics, burying a well-used action,
  an inconsistent interaction pattern.
- **info** — Worth knowing, not blocking. Contextual analytics, minor pattern inconsistencies, adjacent opportunities.

Severity is a bucket in the report, never a prefix inside the finding text.

## Shape

```markdown
## UX review — <branch> (<n> files reviewed)

<One sentence covering only what this run raises. Not a restatement of each finding.>

### Critical

**`app/settings/page.tsx:42`** — If you turn this setting on and then leave the page, it silently switches itself back
off — nothing is saved. Save the change as soon as the user flips the toggle, or warn them it won't stick.

> The toggle is held in local `useState(false)` and never written to the org settings store — call `updateSettings()`
> to persist it.

### Warning

**`components/status-badge.tsx:18`** — This "on" state is coloured red, which usually means danger or an error. People
will think they've broken something. Use green or the primary brand colour for the active state instead.

```

Rules for the shape:

- Omit any severity heading that has no findings. Never invent a heading the template does not define.
- Order the headings most severe first, and the findings within a heading the same way.
- Anchor every finding to a real `path:line` from the diff.
- The blockquote is optional. Drop it whenever the body already says everything — do not pad.
- When there are no findings, the entire report is one line: `No UX concerns in these changes.` Nothing else.

## When Novus is not connected

The review still runs, but the developer should know what it could not see — and how to fix that. One line at the top
setting expectations, one prompt at the very end, after the findings.

Top of the report, before the summary sentence:

```markdown
Running without Novus data — code-observable findings only.
```

Then close the report with the prompt matching the state from `SKILL.md` step 3.

**Declared but not signed in** — the fix is one action you can take for them, so offer it rather than describing it:

```markdown
---
Novus isn't signed in, so nothing here is backed by real usage — no traffic, adoption, or frustration data for the
areas you changed. Want me to connect it?
```

If they accept, call the `authenticate` tool. Never call it unprompted: it opens a browser, and doing that in the
middle of a review the user did not ask to be interrupted is worse than the missing data.

**Not installed** — there is nothing you can run for them, so keep it to one line and a destination:

```markdown
---
Novus isn't connected, so nothing here is backed by real usage. Installing the Novus plugin for your agent adds
traffic, adoption, and frustration data for the areas you changed — https://novus.pendo.io
```

Rules for the prompt:

- **Last thing in the report, always.** It is a footer, not a header. A developer who wants the findings should never
  have to scroll past a setup pitch to reach them.
- **One line.** No bullet lists of benefits, no explanation of what MCP is, no second sentence about how easy setup is.
- **Every run, not once.** Showing it once would mean remembering across runs, and the skill deliberately keeps no
  state — see the deferred note in `CHANGELOG.md`. One line each time is cheaper than a state file.
- **Never when connected.** If the tools are there, none of this appears.
- **Never instead of findings.** It is appended to a normal report, including the one-line `No UX concerns in these
  changes.` version.

## Writing the body

One to two plain sentences; a third only when the fix genuinely needs it. Lead with what breaks, end with what to do.

**No code identifiers.** No function names, file names, hook names, component names, or framework jargon in the body.
Say "the setting silently switches itself back off", not "`useState(false)` is never written to the store". Impact
numbers are fine when phrased plainly.

**Be ruthless about length.** State the problem and its consequence once. Do not pad with how the user will *feel*
("confused and frustrated", "annoyed"), do not describe who they are ("people who spent time picking a value"), and do
not stack a second "Worse, …" consequence onto the first.

## Writing the technical detail

A blockquote directly under the finding, for the engineer who wants to dig in: the code-level cause (component, state,
file references), the exact metrics you queried, and your methodology. This is the one place code identifiers and tool
names belong. Keep it to a line or two, and omit it entirely when the body already covers it.

## Good findings

- `This "on" state is coloured red, which usually means danger or an error. People will think they've broken something
  or triggered a destructive action. Use green or the primary brand colour for the active state instead.`
  → detail: `Active state uses bg-red-600; red conventionally signals destructive/error states.` (warning)
- `If you turn this setting on and then leave the page, it silently switches itself back off — nothing is saved. Save
  the change as soon as the user flips the toggle, or warn them it won't stick.`
  → detail: `The toggle is held in local useState(false) and never written to the org settings store — call
  updateSettings() to persist it.` (critical)
- `These settings are tucked inside a collapsed section, while every other setting on the page sits out in the open with
  a simple switch. People will have trouble finding them, and the odd-one-out layout is confusing.`
  → detail: `PR review settings use an accordion + button; the rest of the config section uses inline StackItem
  components with switches.` (warning)
- `Removing this page cuts off the main way in for about 1,234 people a week — roughly 65% of visitors. If it's being
  replaced, add a redirect so old bookmarks and links still work.`
  → detail: `Route deletion in the diff; page artifact shows 1,234 weekly visitors at 65% adoption (getPageMetrics).`
  (critical)
- `This moves "Export" out of the toolbar and into a dropdown menu. About 340 people a week use it directly today, so
  the extra click will likely mean fewer people find and use it.`
  → detail: `Export action relocated from toolbar to dropdown; 340 weekly clicks, 42% feature adoption
  (getFeatureMetrics).` (warning)
- `People are repeatedly clicking the submit button on this page in frustration — 23 times in the last week. Your change
  doesn't touch that button, but it might be worth a separate look.`
  → detail: `23 rage clicks in 7 days concentrated on the submit button (listReplays); outside this diff's scope.`
  (info)

## Bad findings — never write these

- `This page has 500 visitors per month.` — So what? That is not a concern.
- `useState(false) is not wired to the settings store, so the value isn't persisted across navigations.` — Leads with
  code jargon; the user impact belongs first and this belongs in the detail block.
- `This modifies the /settings route which is tracked in Pendo.` — Not a UX problem.
- `This file contains changes to a feature with 200 monthly clicks.` — Having clicks is normal, not a problem.
- `The priority and due date fields look like real task settings, but they're silently thrown away the moment you hit
  Add — nothing gets saved, and neither field ever shows up on the task list or detail page. Users who spend time
  choosing a priority or picking a due date will be confused and frustrated when those values vanish. Either remove
  these fields until the backend can store them, or add a note that they're for future use.` — Too wordy: it narrates
  feelings and states the problem twice. Tighten to → `The priority and due date fields are discarded on Add — never
  saved or shown anywhere. Remove them until they can be stored, or label them "coming soon".`
