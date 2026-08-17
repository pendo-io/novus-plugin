# Novus — agent skills

Novus skills for coding agents, backed by Pendo product analytics.

Novus automatically instruments supported product surfaces. These skills help builders challenge plans before coding, verify that the resulting data is trustworthy, decide whether shipped work mattered, and steer individual or portfolio investment with evidence.

## Skills

### `verify-impact`

Answers: **Did this shipped change actually work, and what should we do now?**

It reconstructs the intended outcome, verifies the trail from proposed to merged to exposed to measured, checks instrumentation trust, separates observed movement from attributable impact, and returns one verdict: `WORKED`, `PARTIAL`, `DID NOT WORK`, `TOO EARLY`, or `CANNOT VERIFY`. It recommends one next action without changing rollout or production state.

### `verify-instrumentation`

Answers: **Can I trust the data for this feature, flow, goal, or decision?**

It uses Novus Data Validation semantics: confirm live event arrival, match Page loads, Feature clicks, and exact-name Track Events, surface unmatched events as gaps, check definitions and continuity, and identify the smallest repair. When available, it can offer Novus’s focused **Teach Novus** flow for observed Page or Feature gaps. It does not confuse automatic instrumentation with trustworthy measurement, and it never interprets an untrusted zero as customer behavior.

### `stress-test-plan`

Answers: **What could make this a bad build before I start coding?**

It challenges an existing plan against customer reality, roadmap ownership, repository constraints, sequencing, rollout safety, and measurement. It asks at most one consequential question, ranks no more than three plan-breaking risks, and returns a stronger first slice with a `PROCEED`, `REVISE`, `NARROW`, `STOP`, or `NEEDS ONE ANSWER` decision.

### `whats-next`

Answers: **Given what I am working on and what customers need, what should I do next?**

It infers the current objective from the active task, plan, issues, pull requests, and repository context; then compares that work with Novus customer evidence and Linear/Jira planning context. It recommends one move, separating what to finish, what to build next, what to defer, and when to reassess. It consumes instrumentation and prior-impact verdicts when those measurements affect the choice.

The skill can use Novus-native Linear/Jira integrations, direct Linear/Jira connectors exposed to the coding agent, or degrade safely when neither is available.

### `build-investment`

Answers: **Overall, are we investing engineering effort in the right product areas?**

It compares three layers across product areas:

- **Planned** — Linear/Jira initiatives, priorities, cycles, and intended capacity.
- **Built** — completed work and merged changes, estimated with team-level scope and complexity rather than surveillance metrics such as lines of code or raw PR counts.
- **Experienced** — Novus signals, adoption, funnels, frustration, feedback, account reach, and post-release outcomes.

The result is one generated thesis, an investment map with evidence-trust states, an investigation of the largest meaningful gap, and one recommended portfolio bet. It creates a shareable standalone HTML report when file output is available and stays read-only until the user approves a planning or delivery action. It never invents a capacity tradeoff when the planning evidence does not identify one.

### `goal-to-experiment`

Takes a goal, provisional outcome, portfolio bet, or bounded next move that has already been selected and turns it into one reversible engineering experiment. It specifies user and technical acceptance criteria, safe rollout and rollback, existing automatic Novus instrumentation, any genuinely missing measurement, and the contract that `verify-impact` will evaluate after exposure.

### `ux-review`

Reviews uncommitted or branch-local changes for UX problems before a PR exists: wrong visual semantics, settings that silently fail to persist, buried functionality, missing loading and error states, or well-used paths being removed.

When Novus MCP is connected, it backs findings with real traffic, adoption, funnel, and frustration evidence. Without Novus data it still reports code-observable findings. It never posts to GitHub or Bitbucket.

## How the skills fit together

Use the skill that matches the decision in front of you:

1. `build-investment` chooses where portfolio investment should move, or `whats-next` chooses one builder’s next bounded move.
2. `stress-test-plan` challenges a concrete plan before implementation.
3. `goal-to-experiment` turns the selected outcome into a reversible rollout and evaluation contract.
4. Novus automatically instruments supported surfaces; `verify-instrumentation` proves whether the resulting evidence is fit for the decision.
5. `verify-impact` decides whether exposed work produced the intended outcome.

You do not need to run this entire sequence. Each skill works as a direct entry point, and only offers the immediate next gate when useful.

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

> can I trust the signup funnel data?

> stress-test this implementation plan before I start coding

> what should I build next?

> compare what we planned, built, and customers experienced this quarter

> turn this goal into an experiment we can safely ship and evaluate

> review the UX of my changes

The skills activate from their descriptions. In clients with slash commands, invoke `/verify-impact`, `/verify-instrumentation`, `/stress-test-plan`, `/whats-next`, `/build-investment`, `/goal-to-experiment`, or `/ux-review` directly.

## Layout

```
skills/
  verify-impact/          post-release outcome and rollout decision
  verify-instrumentation/ targeted product-data trust check
  stress-test-plan/       pre-build plan challenge and stronger first slice
  whats-next/             current-work steering and validated decision record
  build-investment/       portfolio investment workflow and report contract
  goal-to-experiment/     selected-goal experiment, rollout, and evaluation brief
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
