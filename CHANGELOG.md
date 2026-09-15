# Changelog

## 0.4.0 — unreleased

- `build-impact` now defaults to **Build Value**, a product-area report connecting related team contributions to
  customer benefit. Specific-change decisions and explicitly requested individual reports remain available under
  the same command. Added examples and guidance for eligible adoption, staggered releases, and incomplete workflows.
- `build-investment` can recommend sustaining investment or deferring judgment. It now considers strategic shifts,
  future audiences, stale planning dates, and fixed release commitments, and supports requested audience formats.
- Build and usage reports check identity migrations before interpreting growth, distinguish unreleased branch work
  from customer exposure, and recognize efficiency and reliability benefits without requiring usage growth.
- Updated report instructions to use direct sentences, concrete customer outcomes, and nearby evidence limits.

- `usage-brief` refocused on product usage. It now leads with the current usage
  of the area a change touches (reach as a share of active users, top accounts,
  internal/test/researcher traffic separated out), then reads whether the change
  has potential to grow that usage — headroom, the lever it pulls (new users vs.
  deeper use), the number that would show it worked, and any known friction it
  closes. The testability / verification-emphasis output was removed.
- `usage-brief` can now **post the brief** as a comment on the PR (or the linked
  Linear/Jira ticket) — the only skill in the plugin that writes, and only after
  the user confirms the exact text and target. Degrades to "here's the comment to
  paste" when no PR/ticket resolves or there is no write access. The other skills
  remain strictly read-only.

## 0.3.1 — unreleased

- `usage-brief`: render a plain-language, product-voice brief instead of a
  labelled/enum report. The skill still reasons in the `HEAVY`/`STANDARD`/`LIGHT`
  and adoption/stickiness tiers internally, but renders them as plain sentences,
  describes the risky path by what it does (not by function/service names), and
  shows the measurability line only when a change's impact is not cleanly
  measurable. Realigns the skill to the repo's house voice ("lead with user
  impact; keep engineering specifics out of the way") after a live run read like
  an engineering audit.

## 0.3.0 — unreleased

- `verify-instrumentation` skill: read-only measurement-trust check over a six-link chain (arrival, recognition,
  definition, continuity, audience, decision-critical coverage), returning `TRUSTED` / `DEGRADED` / `UNTRUSTED` /
  `UNKNOWN` and the single smallest repair. This is the sub-check `build-impact` already referenced; it never renders
  zero events as zero use, treats a missing artifact as broken, or adds instrumentation itself.
- `usage-brief` skill: pre-build read of a change's associated surfaces — usage (reach as a share of active users, top
  accounts and visitors, journey), an adoption-vs-stickiness classification, and one verification-emphasis verdict
  (`HEAVY` / `STANDARD` / `LIGHT`) modified by reachability, account concentration, and trend so low traffic is not
  mistaken for low risk. Carries a `verify-instrumentation` verdict so it can flag when a change's own impact will not
  be measurable. Read-only.
- `scripts/set-version.sh` and `scripts/check-version.sh`: set and verify the plugin version in lockstep across the
  five manifests that carry it (previously edited by hand, with no guard against drift).

## 0.1.0 — unreleased

First release.

- `ux-review` skill: pre-PR UX review of local changes, with Novus product analytics through the Novus MCP server and
  graceful degradation to code-observable findings when the server is not connected.
- `whats-next` skill: current-work steering backed by engineering context, Novus customer evidence, and either
  Novus-native or directly connected Linear/Jira planning data, with a graceful no-roadmap fallback.
- `build-investment` skill: portfolio-level comparison of planned, built, and experienced investment, with one
  evidence-backed recommendation for where engineering investment should move.
- Packaging for Claude Code, Gemini CLI, and Codex CLI, plus Agent Plugins 1.0 and Cursor manifests and an
  `.agents/skills` symlink for Devin.

Deferred: cross-run memory, so a re-run reports only what changed since the last review. Tried and cut — agents reliably
produce the report and then skip the bookkeeping write, in `~`, `.git/`, and `$TMPDIR` alike. The first two are also
blocked outright by Codex's sandbox. Revisit when there is a way to make the write intrinsic to producing the report
rather than a step after it.
