# Changelog

## 0.1.0 — unreleased

First release.

- `ux-review` skill: pre-PR UX review of local changes, with Novus product analytics through the Novus MCP server and
  graceful degradation to code-observable findings when the server is not connected.
- `whats-next` skill: current-work steering backed by engineering context, Novus customer evidence, and either
  Novus-native or directly connected Linear/Jira planning data, with a graceful no-roadmap fallback.
- `build-investment` skill: portfolio-level comparison of planned, built, and experienced investment, with one
  evidence-backed recommendation for where engineering investment should move.
- `goal-to-experiment` skill: turns a selected goal, portfolio bet, or bounded move into a reversible engineering
  experiment with acceptance, rollout, rollback, and measurement guidance.
- Packaging for Claude Code, Gemini CLI, and Codex CLI, plus Agent Plugins 1.0 and Cursor manifests and an
  `.agents/skills` symlink for Devin.

Deferred: cross-run memory, so a re-run reports only what changed since the last review. Tried and cut — agents reliably
produce the report and then skip the bookkeeping write, in `~`, `.git/`, and `$TMPDIR` alike. The first two are also
blocked outright by Codex's sandbox. Revisit when there is a way to make the write intrinsic to producing the report
rather than a step after it.
