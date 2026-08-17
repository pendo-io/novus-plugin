# Novus — agent skills

Novus skills for coding agents, backed by Pendo product analytics.

## Skills

### `ux-review`

Reviews uncommitted or branch-local changes for UX problems before a PR exists: wrong visual semantics, settings that
silently fail to persist, buried functionality, missing loading and error states, or well-used paths being removed.

When Novus MCP is connected, it backs findings with real traffic, adoption, funnel, and frustration evidence. Without
Novus data it still reports code-observable findings. It never posts to GitHub or Bitbucket.

### `whats-next`

Answers: **Given what I am working on and what customers need, what should I do next?**

It infers the current objective from the active task, plan, issues, pull requests, and repository context; then compares
that work with Novus customer evidence and Linear/Jira planning context. It recommends one move, separating what to
finish, what to build next, what to defer, and when to reassess. It can use Novus-native Linear/Jira integrations,
direct Linear/Jira connectors exposed to the coding agent, or degrade safely when neither is available.

### `build-investment`

Answers: **Overall, are we investing engineering effort in the right product areas?**

It compares three layers across product areas:

- **Planned** — Linear/Jira initiatives, priorities, cycles, and intended capacity.
- **Built** — completed work and merged changes, estimated with team-level scope and complexity rather than surveillance
  metrics such as lines of code or raw PR counts.
- **Experienced** — Novus signals, adoption, funnels, frustration, feedback, account reach, and post-release outcomes.

The result is one generated thesis, an investment map, an evidence-rich investigation of the largest meaningful gap,
and one recommended portfolio bet. It creates a shareable standalone HTML report when file output is available and
stays read-only until the user approves a planning or delivery action. Like `whats-next`, it can use Novus-native
Linear/Jira integrations, direct connectors exposed to the coding agent, or a disclosed fallback when neither exists.

### `goal-to-experiment`

Takes a goal, provisional outcome, portfolio bet, or bounded next move that has already been selected and turns it into
one reversible engineering experiment. It specifies user and technical acceptance criteria, exact instrumentation,
rollout, rollback, evaluation window, and the rule for expanding, modifying, or stopping.

The skills form two decision entry points and one downstream execution step:

- `build-investment` chooses where portfolio investment should move.
- `whats-next` chooses the next bounded move in an engineer's current context.
- Either can hand its selected goal, provisional outcome, or bounded move to `goal-to-experiment`, which defines how to test it safely.

You do not need to run both decision skills first. Use the one that matches the altitude of the question.

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

> review the UX of my changes

> what should I build next?

> compare what we planned, built, and customers experienced this quarter

> where are we under-investing, and what should we build next?

> turn this goal into an experiment we can safely ship and evaluate

The skills activate from their descriptions. In clients with slash commands, invoke `/ux-review`, `/whats-next`,
`/build-investment`, or `/goal-to-experiment` directly.

## Layout

```
skills/
  ux-review/              pre-PR UX review workflow and references
  whats-next/             current-work steering and validated decision record
  build-investment/       portfolio investment workflow and report contract
  goal-to-experiment/     selected-goal experiment, rollout, and evaluation brief
plugin.json  mcp.json     Agent Plugins 1.0 (Cursor, Copilot, VS Code, Kiro, ChatGPT)
.claude-plugin/  .mcp.json
                         Claude Code
.codex-plugin/           Codex CLI
gemini-extension.json    Gemini CLI
.agents/skills           symlink to skills/ — Devin and Codex repo scope
```

The package targets [Agent Plugins 1.0](https://agent-plugins.org/). Claude Code and Gemini CLI use their own manifests;
the skill instructions themselves are written once under `skills/`.

Supported and tested in v1: Claude Code, Gemini CLI, Codex CLI. Cursor, GitHub Copilot, VS Code, Kiro, and Devin should
load the skills through the portable manifest or `.agents/skills` symlink, but are not yet tested.

## Adding a skill

Create `skills/<name>/SKILL.md`. Every manifest discovers skills from `skills/`, so there is nothing else to register.
