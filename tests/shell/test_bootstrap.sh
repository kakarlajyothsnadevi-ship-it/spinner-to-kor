#!/usr/bin/env bash
# 원격 한 줄 설치(bootstrap.sh) + 스냅샷 + CLI update/uninstall — 배포 E2E.
# SPINNER_SOURCE_TARBALL 로 로컬 tarball 주입 → 네트워크 없이 curl 설치 흐름 검증.
source "$(dirname "${BASH_SOURCE[0]}")/helpers.sh"

echo "== test_bootstrap.sh =="
setup_sandbox
trap teardown_sandbox EXIT
export SPINNER_PLATFORM=darwin

TARBALL="$SANDBOX/src.tar.gz"
make_tarball "$TARBALL"

BIN="$VERSIONS/2.1.170"
SNAPSHOT="$HOME/.claude/spinner-to-kor"
ENTRY="$HOME/.local/bin/spinner-to-kor"

# ── 부트스트랩 설치 (curl | bash 대응) ──────────────────
OUT="$(SPINNER_SOURCE_TARBALL="$TARBALL" bash "$REPO_DIR/bootstrap.sh" 2>&1)"; RC=$?
assert_eq "0" "$RC" "bootstrap.sh 정상 종료"
assert_file_exists "$ENTRY" "PATH 진입점 ~/.local/bin/spinner-to-kor 생성"
assert_file_exists "$SNAPSHOT/spinner-to-kor" "스냅샷에 CLI 보관"
assert_file_exists "$SNAPSHOT/uninstall.sh" "스냅샷에 uninstall.sh 보관 (자립 제거용)"
assert_file_exists "$SNAPSHOT/bootstrap.sh" "스냅샷에 bootstrap.sh 보관 (자립 업데이트용)"
assert_file_exists "$SNAPSHOT/src/platform.sh" "스냅샷에 src/ 보관"
assert_eq "0" "$(en_count "$BIN")" "바이너리 패치 완료"
assert_eq "20" "$(count_ours)" "hook 머지 완료"
assert_eq "$(cat "$REPO_DIR/VERSION")" "$(cat "$HOME/.claude/scripts/.spinner-to-kor-version")" "버전 스탬프"

# ── PATH 진입점으로 실행 (설치 디렉터리 밖에서) ─────────
OUT="$(cd "$SANDBOX" && "$ENTRY" status 2>&1)"
assert_contains "$OUT" "$(cat "$REPO_DIR/VERSION")" "진입점 status 실행 (repo 밖에서)"

# ── CLI update = 부트스트랩 재실행 (자립) ───────────────
# 스탬프를 구버전으로 되돌려 업데이트가 실제로 재설치하는지 확인
echo "0.0.1" > "$HOME/.claude/scripts/.spinner-to-kor-version"
OUT="$(SPINNER_SOURCE_TARBALL="$TARBALL" "$ENTRY" update 2>&1)"; RC=$?
assert_eq "0" "$RC" "spinner-to-kor update 정상 종료"
assert_eq "$(cat "$REPO_DIR/VERSION")" "$(cat "$HOME/.claude/scripts/.spinner-to-kor-version")" "update 후 스탬프 최신화"

# ── 사용자 hook 무간섭 (업데이트 재설치가 사용자 설정 보존) ──
python3 - "$SETTINGS" <<'PY'
import json, sys
s = json.load(open(sys.argv[1]))
s["hooks"].setdefault("PreToolUse", []).append(
    {"matcher": "Bash", "hooks": [{"type": "command", "command": "./my-guard.sh"}]})
json.dump(s, open(sys.argv[1], "w"), ensure_ascii=False, indent=2)
PY
SPINNER_SOURCE_TARBALL="$TARBALL" "$ENTRY" update >/dev/null 2>&1
assert_contains "$(cat "$SETTINGS")" "my-guard.sh" "update 재설치가 사용자 hook 보존"

# ── CLI uninstall = 스냅샷·진입점·자산 정리 ─────────────
OUT="$("$ENTRY" uninstall --restore-bin 2>&1)"; RC=$?
assert_eq "0" "$RC" "spinner-to-kor uninstall 정상 종료"
assert_file_absent "$ENTRY" "제거 후 PATH 진입점 삭제"
assert_file_absent "$SNAPSHOT" "제거 후 스냅샷 삭제"
assert_file_absent "$HOME/.claude/scripts/patch-spinner-verbs.py" "제거 후 패치 스크립트 삭제"

# ── 엣지: tarball 없음 → 명확한 실패 ────────────────────
OUT="$(SPINNER_SOURCE_TARBALL="$SANDBOX/nope.tar.gz" bash "$REPO_DIR/bootstrap.sh" 2>&1)"; RC=$?
if [[ "$RC" != "0" ]]; then pass "없는 tarball → 비정상 종료"; else fail "없는 tarball인데 성공"; fi

report
