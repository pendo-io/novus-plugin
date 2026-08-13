# Novus — agent skills

Novus skills for coding agents. One skill today: **`ux-review`**.

Novus already reviews UX on pull requests. This package moves that review earlier — into the editor, before the PR
exists, in whichever agent you already use.

## What `ux-review` does

Reads your uncommitted or branch-local changes and reports the ones that will hurt users: wrong visual semantics,
settings that silently fail to persist, buried functionality, missing loading and error states, well-used paths being
removed or relocated.

When the Novus MCP server is connected it backs those findings with Novus product analytics — real traffic, adoption,
funnel, and frustration data for the areas you touched. When it is not connected it still runs, reporting only what is
observable in the code. It says which mode it is in, in one line, at the top.

It does **not** post anything to GitHub or Bitbucket. That is the existing Novus PR review, and it still runs on the PR.

## Install

| Agent | Command |
| --- | --- |
| Claude Code | `claude plugin marketplace add pendo-io/novus-plugin` then `claude plugin install novus@pendo` |
| Gemini CLI | `gemini extensions install https://github.com/pendo-io/novus-plugin` |
| Codex CLI | `./install.sh codex` |
| Devin | `./install.sh devin <path-to-repo>`, then commit |

Or clone and run `./install.sh` with no arguments to see all of them.

Full instructions, including how to point at a non-production Novus, are in [docs/install.md](docs/install.md).

## Use it

Ask for it in whatever words you use:

> review the UX of my changes

> will this break anything for users before I open the PR?

The skill activates on its own from the description. In Claude Code you can also invoke it directly with `/ux-review`.

Each run is independent — the skill keeps no memory between runs, so re-running after a fix reviews the changes fresh.

## Layout

```
skills/ux-review/          the skill — one copy, shared by every agent
  SKILL.md                 the workflow
  references/              heuristics, Novus tool map, report format
plugin.json  mcp.json      Agent Plugins 1.0 (Cursor, Copilot, VS Code, Kiro, ChatGPT)
.claude-plugin/  .mcp.json Claude Code
.codex-plugin/             Codex CLI
gemini-extension.json      Gemini CLI
.agents/skills             symlink to skills/ — Devin, and Codex repo scope
```

The package targets [Agent Plugins 1.0](https://agent-plugins.org/), so clients adopting that spec should load it
without changes here. Claude Code and Gemini CLI use their own manifests, which is why there are several — they are
metadata only, and the skill itself is written once.

Supported and tested in v1: Claude Code, Gemini CLI, Codex CLI. Cursor, GitHub Copilot, VS Code, Kiro, and Devin will
pick the skill up through the portable manifest or the `.agents/skills` symlink, but are not yet tested.

## Adding a skill

Create `skills/<name>/SKILL.md`. Every manifest here discovers skills from `skills/`, so there is nothing else to
register and installed users get it on their next update.
