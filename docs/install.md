# Installing

Every agent below reads the same skill directory, `skills/ux-review/`. What differs is the manifest each one looks for
and how it installs.

## Claude Code

```bash
claude plugin marketplace add pendo-io/novus-plugin
claude plugin install novus@pendo
```

Restart Claude Code. `/ux-review` appears in the skill list, and the `novus` MCP server connects on first use.

From a local clone instead:

```bash
claude plugin marketplace add ~/Code/pendo/novus-plugin
claude plugin install novus@pendo
```

## Gemini CLI

```bash
gemini extensions install https://github.com/pendo-io/novus-plugin
```

For development against a clone, `gemini extensions link ~/Code/pendo/novus-plugin` symlinks it so edits take effect
without reinstalling.

## Codex CLI

```bash
codex plugin marketplace add pendo-io/novus-plugin
codex plugin add novus@pendo
```

Restart Codex. This installs the skill and registers the `novus` MCP server in one step — `codex mcp list` should show
`novus` as enabled, not logged in. Verified on codex-cli 0.146.0.

From a local clone instead:

```bash
codex plugin marketplace add ~/Code/pendo/novus-plugin
codex plugin add novus@pendo
```

Codex resolves the marketplace from `.claude-plugin/marketplace.json` — it prefers `.agents/plugins/marketplace.json`
and falls back to the Claude manifest, which is why there is no Codex-specific marketplace file here. The plugin itself
comes from `.codex-plugin/plugin.json`.

**Fallback for Codex builds without `codex plugin`** — links `skills/ux-review` into `~/.agents/skills/`, where Codex
looks at user scope:

```bash
./install.sh codex
```

That installs the skill only, so add the MCP server yourself:

```bash
codex mcp add novus --transport streamable-http --url https://novus-api.pendo.io/mcp
```

## Devin

Devin scans `.agents/skills/` in every connected repository, so the skill is committed rather than installed:

```bash
./install.sh devin ~/Code/pendo/your-repo
```

Then commit `.agents/skills/ux-review/`.

## Authentication

Novus MCP is at `https://novus-api.pendo.io/mcp` and uses OAuth 2.1 with dynamic client registration. There is no API
key to configure and nothing secret in this repository. The first time the agent calls a Novus tool it opens a browser,
you sign in to Novus, pick a subscription and app, and the client stores the resulting token itself.

If tools stop working, the token has usually expired — remove and re-add the server to start a fresh sign-in.

For Gemini CLI, add the same server under `mcpServers` in `~/.gemini/settings.json`.

## Verifying it works

Ask for a UX review in a repo with UI changes in the working tree. You should see either a short report anchored to
`path:line`, or the single line `No UX concerns in these changes.`

If the report opens with `Running without Novus data — code-observable findings only.`, the skill loaded but the MCP
server did not connect. The review is still valid; it just has no analytics behind it. It will close with a one-line
prompt to connect — offering to sign you in if the server is installed but signed out, or pointing you here if it is
not installed at all.
