# Novus — agent skills

Novus skills for coding agents, backed by Pendo product analytics.

Novus automatically instruments supported product surfaces. These skills help builders decide what to finish next, whether shipped work created customer value, and whether portfolio investment matches customer need, backed by product, planning, and delivery evidence.

## Skills

### `build-impact`

Answers: **What did this shipped work add up to, did it create customer value, and what should we do now?**

It works for one change or a builder's recent PRs. It reconstructs the intended outcome, verifies the trail from proposed to merged to exposed to measured, checks instrumentation trust, separates observed movement from attributable impact, and returns one verdict: `WORKED`, `PARTIAL`, `DID NOT WORK`, `TOO EARLY`, or `CANNOT VERIFY`. Weekly builder reports use a compact Slack-first "Your code in the wild" format with exact PRs, one release date, customer movement, and one signal-backed next check. It recommends one next action without changing rollout or production state.

### `whats-next`

Answers: **Given what I am working on and what customers need, what should I do next?**

It infers the current objective from the active task, plan, issues, pull requests, and repository context; then compares that work with Novus customer evidence and Linear/Jira planning context. It recommends one move, separating what to finish, what to build next, what to defer, and when to reassess. It checks measurement trust and shipping state before behavioral or post-release evidence can change the choice.

The skill can use Novus-native Linear/Jira integrations, direct Linear/Jira connectors exposed to the coding agent, or degrade safely when neither is available.

### `build-investment`

Answers: **Overall, are we investing engineering effort in the right product areas?**

It compares three layers across product areas:

- **Planned** — Linear/Jira initiatives, priorities, cycles, and intended capacity.
- **Built** — completed work and merged changes, estimated with team-level scope and complexity rather than surveillance metrics such as lines of code or raw PR counts.
- **Experienced** — Novus signals, adoption, funnels, frustration, feedback, account reach, and post-release outcomes.

The result is a short engineer-to-engineer focus brief: where customers are struggling, where the team is investing instead, what should change, what stays protected, and why that choice beats the strongest alternative. It stays read-only until the user approves a planning or delivery action and never invents a capacity tradeoff when planning evidence does not identify one.

### `ux-review`

Reviews uncommitted or branch-local changes for UX problems before a PR exists: wrong visual semantics, settings that silently fail to persist, buried functionality, missing loading and error states, or well-used paths being removed.

When Novus MCP is connected, it backs findings with real traffic, adoption, funnel, and frustration evidence. Without Novus data it still reports code-observable findings. It never posts to GitHub or Bitbucket.

## Choose the right decision

- Use `build-impact` when the question is what shipped work added up to and whether it created customer value.
- Use `build-investment` when the question is whether the portfolio is funding the right product areas.
- Use `whats-next` when the question is what one builder should finish, build, or defer next.
- Use `ux-review` when the question is whether local changes introduce a customer-facing UX problem.

## Install

| Agent | Command |
| --- | --- |
| Claude Code | `claude plugin marketplace add pendo-io/novus-plugin` then `claude plugin install novus@pendo` |
| Gemini CLI | `gemini extensions install https://github.com/pendo-io/novus-plugin` |
| Codex CLI | `codex plugin marketplace add pendo-io/novus-plugin` then `codex plugin add novus@pendo` |
| Devin | `./install.sh devin <path-to-repo>`, then commit |

Or clone and run `./install.sh` with no arguments to see every option.

Full instructions, including how to point at a non-production Novus, are in [docs/install.md](docs/install.md).

## Use

Ask naturally:

> did this shipped change work, and should we roll it out further?

> show me what my recent PRs added up to, whether customers are using the experience, and what to watch next

> what should I build next?

> compare what we planned, built, and customers experienced this quarter

> review the UX of my changes

The skills activate from their descriptions. In clients with slash commands, invoke `/build-impact`, `/whats-next`, `/build-investment`, or `/ux-review` directly.

## Layout

```
skills/
  build-impact/           post-release customer-outcome decision
  whats-next/             current-work steering and validated decision record
  build-investment/       portfolio investment focus brief
  ux-review/              pre-PR UX review workflow and references
plugin.json  mcp.json     Agent Plugins 1.0 (Cursor, Copilot, VS Code, Kiro, ChatGPT)
.claude-plugin/  .mcp.json
                         Claude Code
.codex-plugin/           Codex CLI
gemini-extension.json    Gemini CLI
.agents/skills           symlink to skills/ — Devin and Codex repo scope
```

The package targets [Agent Plugins 1.0](https://agent-plugins.org/). Claude Code and Gemini CLI use their own manifests; the skill instructions themselves are written once under `skills/`.

Supported and tested in v1: Claude Code, Gemini CLI, Codex CLI. Cursor, GitHub Copilot, VS Code, Kiro, and Devin should load the skills through the portable manifest or `.agents/skills` symlink, but are not yet tested.

## Adding a skill

Create `skills/<name>/SKILL.md`. Every manifest discovers skills from `skills/`, so there is nothing else to register.
