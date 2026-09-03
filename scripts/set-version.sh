#!/usr/bin/env bash
# Set the plugin version across every manifest that carries it, in lockstep.
#
# The version lives, by hand, in five manifests (one per packaging target).
# Editing them individually drifts; this sets all five from one command.
#
#   scripts/set-version.sh 0.3.0
#
# marketplace.json carries no version by design, and per-skill SKILL.md files
# are versioned at the plugin level, so neither is touched here.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [[ $# -ne 1 ]]; then
  echo "usage: scripts/set-version.sh <x.y.z>" >&2
  exit 2
fi
VERSION="$1"
if [[ ! "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "error: '$VERSION' is not a semver x.y.z" >&2
  exit 2
fi

FILES=(
  "plugin.json"
  ".claude-plugin/plugin.json"
  ".codex-plugin/plugin.json"
  ".cursor-plugin/plugin.json"
  "gemini-extension.json"
)

for f in "${FILES[@]}"; do
  path="$ROOT/$f"
  if [[ ! -f "$path" ]]; then
    echo "error: missing $f" >&2
    exit 1
  fi
  perl -i -pe 's/("version"\s*:\s*")[0-9]+\.[0-9]+\.[0-9]+(")/${1}'"$VERSION"'${2}/' "$path"
  echo "set $f -> $VERSION"
done

echo "done. run scripts/check-version.sh to confirm, and add a CHANGELOG entry."
