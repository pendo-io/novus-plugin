# Changelog

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
