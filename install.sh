#!/usr/bin/env bash
# Install the Pendo Novus skills into a coding agent.
#
#   ./install.sh              show every option
#   ./install.sh claude       Claude Code
#   ./install.sh gemini       Gemini CLI
#   ./install.sh codex        Codex CLI
#   ./install.sh devin [dir]  copy the skills into a repo for Devin to pick up

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_URL="https://github.com/pendo-io/novus-plugin"

claude_install() {
  cat <<EOF
Claude Code — run these:

  claude plugin marketplace add pendo-io/novus-plugin
  claude plugin install novus@pendo

Or from this clone:

  claude plugin marketplace add $ROOT
  claude plugin install novus@pendo

Restart Claude Code, then ask for a UX review, what to build next, or a build investment review. On the first Novus tool call
Claude opens a browser to sign in to Pendo and pick a subscription + app.
EOF
}

gemini_install() {
  cat <<EOF
Gemini CLI — run one of these:

  gemini extensions install $REPO_URL
  gemini extensions link $ROOT      # development: symlink this clone

Restart Gemini CLI, then ask for a UX review, what to build next, or a build investment review.
EOF
}

codex_install() {
  local skill_dir skill_name target
  mkdir -p "$HOME/.agents/skills"
  for skill_dir in "$ROOT"/skills/*; do
    [[ -d "$skill_dir" ]] || continue
    skill_name="${skill_dir##*/}"
    target="$HOME/.agents/skills/$skill_name"
    ln -sfn "$skill_dir" "$target"
  done
  cat <<EOF
Codex CLI — preferred, installs the skill and the Novus MCP server together:

  codex plugin marketplace add pendo-io/novus-plugin
  codex plugin add novus@pendo

Or from this clone:

  codex plugin marketplace add $ROOT
  codex plugin add novus@pendo

Fallback for Codex builds without \`codex plugin\` — linked every skill at user
scope, skills only:

  $HOME/.agents/skills/<skill-name> -> $ROOT/skills/<skill-name>

On that path, add the Novus MCP server yourself:

  codex mcp add novus --transport streamable-http --url https://novus-api.pendo.io/mcp

Restart Codex, then ask for a UX review, what to build next, or a build investment review.
EOF
}

devin_install() {
  local dest="${1:-}"
  if [[ -z "$dest" ]]; then
    echo "Usage: ./install.sh devin <path-to-repo>" >&2
    exit 1
  fi
  if [[ ! -d "$dest" ]]; then
    echo "Not a directory: $dest" >&2
    exit 1
  fi
  mkdir -p "$dest/.agents/skills"
  cp -R "$ROOT/skills/." "$dest/.agents/skills/"
  cat <<EOF
Copied the Novus skills to $dest/.agents/skills/

Commit it. Devin discovers skills under .agents/skills/ in every connected
repository — there is nothing else to install.
EOF
}

case "${1:-}" in
  claude) claude_install ;;
  gemini) gemini_install ;;
  codex) codex_install ;;
  devin) devin_install "${2:-}" ;;
  "")
    claude_install
    echo
    gemini_install
    echo
    echo "Codex CLI    — run: codex plugin marketplace add pendo-io/novus-plugin"
    echo "               then: codex plugin add novus@pendo"
    echo "Devin        — run: ./install.sh devin <path-to-repo>"
    ;;
  *)
    echo "Unknown host: $1 (expected claude, gemini, codex, or devin)" >&2
    exit 1
    ;;
esac
