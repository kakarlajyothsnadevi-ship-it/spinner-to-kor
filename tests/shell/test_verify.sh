#!/usr/bin/env bash
# verify.sh 회귀 테스트 — BUG-01(거짓 미패치)·FR-21(거짓 양성/음성 0).
source "$(dirname "${BASH_SOURCE[0]}")/helpers.sh"

echo "== test_verify.sh =="
setup_sandbox
trap teardown_sandbox EXIT

BIN="$VERSIONS/2.1.170"

# ── 미패치 상태: [2]는 ✗ 미패치 ─────────────────────────
OUT="$("$REPO_DIR/verify.sh" 2>&1)"
assert_contains "$OUT" "미패치" "미패치 fixture → [2] ✗ 미패치 보고"
assert_not_contains "$OUT" $'0\n0 건' "BUG-01: 이중 0 출력 없음"

# ── 패치 후: [2]는 ✓ 패치됨 (BUG-01 핵심 회귀) ──────────
python3 "$REPO_DIR/src/patch-spinner-verbs.py" "$BIN" >/dev/null 2>&1
OUT="$("$REPO_DIR/verify.sh" 2>&1)"
assert_contains "$OUT" "패치됨" "패치된 fixture → [2] ✓ 패치됨 (BUG-01 회귀)"
V2_SECTION="$(printf '%s\n' "$OUT" | sed -n '/\[2\]/,/\[3\]/p')"
assert_not_contains "$V2_SECTION" "미패치" "패치 상태에서 [2]에 미패치 문구 없음"

report
