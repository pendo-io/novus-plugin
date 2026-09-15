# Novus — agent skills

Novus skills for coding agents, backed by Pendo product analytics.

Novus automatically instruments supported product surfaces. These skills help builders decide what to finish next, whether shipped work created customer value, and whether portfolio investment matches customer need, backed by product, planning, and delivery evidence.

## Skills

### `build-impact`

Answers: **What do this team's improvements add up to for customers, why do they matter, and what evidence supports their value?**

The default report is **Build Value**, focused on a product area or customer workflow over a defined period. It connects related contributions across the team, explains the customer benefit or remaining gap, and interprets adoption against the people who could encounter the changes. Completion, reduced effort, and reliability can matter even when usage does not grow. Product rationale, observed outcomes, and causal attribution stay separate.

The `/build-impact` command is unchanged. Specific-change decisions and explicitly requested individual reports remain available as **Build Impact**. All views verify release state and measurement, including identity migrations and unreleased branch work. An individual report stays private unless sharing is separately requested. See the [Build Value examples](skills/build-impact/references/examples.md).

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

The result is a short leadership brief recommending whether to sustain, increase, redirect, reduce, or defer judgment. It considers current customer needs, deliberate strategic shifts, intended future audiences, and fixed commitments. A supported decision to stay the course is a valid result. Any proposed displacement comes from actual planning evidence.

It can use relevant strategy documents or product/leadership meeting context supplied by the caller or available through connected sources, and revises its conclusion when that context is corrected. By default it returns a response suitable for an existing meeting pre-read; it can produce a different audience format or artifact when requested. The analysis stays read-only and does not automatically publish, schedule, or change the roadmap.

### `ux-review`

Reviews uncommitted or branch-local changes for UX problems before a PR exists: wrong visual semantics, settings that silently fail to persist, buried functionality, missing loading and error states, or well-used paths being removed.

When Novus MCP is connected, it backs findings with real traffic, adoption, funnel, and frustration evidence. Without Novus data it still reports code-observable findings. It never posts to GitHub or Bitbucket.

### `usage-brief`

Answers: **How is the area my PR touches used today, who could benefit from this change, and what would show it helped?**

From a description, issue, or PR/branch, it resolves the relevant surfaces and leads with trustworthy current usage, including customer eligibility and traffic exclusions. It explains the proposed benefit and an appropriate success measure: reach, completion, efficiency, reliability, or reduced errors. Low usage alone does not establish high potential. If measurement is invalid, it leads with that gap. It can post the brief as a PR or ticket comment only after confirmation of the exact text and target.

### `verify-instrumentation`

Answers: **Is the surface this work touches instrumented well enough to trust its Pendo data?**

The measurement-trust sub-check the other skills lean on. It runs a six-link trust chain — arrival, recognition, definition, continuity, audience, and decision-critical coverage — and returns one verdict, `TRUSTED`, `DEGRADED`, `UNTRUSTED`, or `UNKNOWN`, plus the single smallest repair that would raise it. It never renders zero events as zero use, never treats a missing artifact as a broken one, and never adds instrumentation itself. Read-only.

## Choose the right decision

- Use `usage-brief` for current usage and the possible benefit of a proposed change.
- Use `build-impact` for a Build Value review of a product area's shipped work, a specific impact decision, or an explicitly requested individual report.
- Use `build-investment` when the question is whether the portfolio is funding the right product areas.
- Use `whats-next` when the question is what one builder should finish, build, or defer next.
- Use `ux-review` when the question is whether local changes introduce a customer-facing UX problem.
- Use `verify-instrumentation` when the question is whether a surface's Pendo data can be trusted for a decision.

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

> give me a Build Value report for the Analytics improvements our team shipped last month

> use Build Investment for our product-meeting pre-read, including the strategy decisions from our last three product meetings

> what should I build next?

> compare what we planned, built, and customers experienced this quarter

> review the UX of my changes

> how used is the area my PR touches, and would this change make the task easier or more reliable?

> is this surface instrumented well enough to trust its numbers?

The skills activate from their descriptions. In clients with slash commands, invoke `/build-impact`, `/whats-next`, `/build-investment`, `/ux-review`, `/usage-brief`, or `/verify-instrumentation` directly.

## Layout

```
skills/
  build-impact/           Build Value area review + specific/individual impact
  whats-next/             current-work steering and validated decision record
  build-investment/       portfolio investment focus brief
  ux-review/              pre-PR UX review workflow and references
  usage-brief/            current usage + proposed benefit, optional PR/ticket comment
  verify-instrumentation/ measurement-trust check for a surface
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
