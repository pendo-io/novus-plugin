# Changelog

## 0.1.0 — unreleased

First release.

- `ux-review` skill: pre-PR UX review of local changes, with Novus product analytics through the Novus MCP server and
  graceful degradation to code-observable findings when the server is not connected.
- Packaging for Claude Code, Gemini CLI, and Codex CLI, plus Agent Plugins 1.0 and Cursor manifests and an
  `.agents/skills` symlink for Devin.

Deferred: cross-run memory, so a re-run reports only what changed since the last review. Tried and cut — agents reliably
produce the report and then skip the bookkeeping write, in `~`, `.git/`, and `$TMPDIR` alike. The first two are also
blocked outright by Codex's sandbox. Revisit when there is a way to make the write intrinsic to producing the report
rather than a step after it.
