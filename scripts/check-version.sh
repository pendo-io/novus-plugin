#!/usr/bin/env bash
# Fail if the plugin version disagrees across the manifests that carry it.
# Run in CI or before a release to catch a half-applied bump.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

FILES=(
  "plugin.json"
  ".claude-plugin/plugin.json"
  ".codex-plugin/plugin.json"
  ".cursor-plugin/plugin.json"
  "gemini-extension.json"
)

seen=""
rc=0
for f in "${FILES[@]}"; do
  v="$(perl -ne 'print $1 if /"version"\s*:\s*"([0-9]+\.[0-9]+\.[0-9]+)"/' "$ROOT/$f" 2>/dev/null || true)"
  if [[ -z "$v" ]]; then
    echo "no version found in $f" >&2
    rc=1
    continue
  fi
  printf '%-32s %s\n' "$f" "$v"
  if [[ -z "$seen" ]]; then
    seen="$v"
  elif [[ "$v" != "$seen" ]]; then
    rc=1
  fi
done

if [[ $rc -ne 0 ]]; then
  echo "VERSION MISMATCH — run scripts/set-version.sh <x.y.z>" >&2
else
  echo "ok: all manifests at $seen"
fi
exit $rc
