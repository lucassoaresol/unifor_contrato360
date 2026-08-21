#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

fail() {
  echo "vendor test: $*" >&2
  exit 1
}

bash -n scripts/update-vendored-skill.sh || fail "script de atualização tem sintaxe inválida"

jq -e '
  ."tlc-spec-driven"
  | .repository == "https://github.com/tech-leads-club/agent-skills.git"
  and .source_path == "packages/skills-catalog/skills/(development)/tlc-spec-driven"
  and .target_path == ".agents/skills/tlc-spec-driven"
  and .strategy == "three-way-merge"
  and (.base_ref | test("^[0-9a-f]{40}$"))
  and .upstream_version == "3.3.0"
  and (.local_customizations | length > 0)
' .agents/vendor.json >/dev/null || fail "manifesto de vendorização incompleto"

grep -q '^name: tlc-spec-driven$' .agents/skills/tlc-spec-driven/SKILL.md \
  || fail "skill local ausente ou com nome inesperado"
grep -q 'Adaptado do Tech Lead' .agents/skills/tlc-spec-driven/SKILL.md \
  || fail "atribuição da adaptação ausente"

echo "vendor test: PASS"

