#!/usr/bin/env bash
# Claude Code 한국어 스피너 — 제거.
#
# 사용:
#   ./uninstall.sh                # LaunchAgent + hooks + 스크립트 제거 (바이너리는 그대로 두고 영문 복귀 안 함)
#   ./uninstall.sh --restore-bin  # 위 + 가장 오래된 .bak 으로 바이너리 복원(영문 verb 복귀)
#
# 주의: settings.json은 install.sh가 만든 가장 최근 백업으로 복원 시도. 없으면 hook 청크만 제거.
set -euo pipefail

RESTORE_BIN=0
for arg in "$@"; do
  [[ "$arg" == "--restore-bin" ]] && RESTORE_BIN=1
done

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPTS_DEST="$HOME/.claude/scripts"
SETTINGS="$HOME/.claude/settings.json"
PLIST_DEST="$HOME/Library/LaunchAgents/dev.claude-spinner-patch.plist"
LEGACY_PLIST="$HOME/Library/LaunchAgents/dev.codevillain.claude-spinner-patch.plist"

# 머지/제거 로직 단일 소스 — repo 사본 우선, 없으면 설치본 폴백
MERGE_PY="$REPO_DIR/src/merge-hooks.py"
[[ -f "$MERGE_PY" ]] || MERGE_PY="$SCRIPTS_DEST/merge-hooks.py"

bold()  { printf "\033[1m%s\033[0m\n" "$*"; }
green() { printf "\033[32m%s\033[0m\n" "$*"; }
yel()   { printf "\033[33m%s\033[0m\n" "$*"; }

# 1. LaunchAgent 제거 (신규/구버전 라벨 모두)
bold "== 1) LaunchAgent unload + 제거 =="
for p in "$PLIST_DEST" "$LEGACY_PLIST"; do
  if [[ -f "$p" ]]; then
    launchctl unload "$p" 2>/dev/null || true
    rm -f "$p"
    green "✓ 제거: $p"
  fi
done

# 2. hooks 청크만 settings.json에서 제거 (백업 보존)
bold "== 2) settings.json 에서 한국어 hook 청크 제거 =="
if [[ -f "$SETTINGS" ]]; then
  cp -p "$SETTINGS" "${SETTINGS}.bak.uninstall-$(date +%Y%m%d-%H%M%S)"
  # 마커(spinner-to-kor)·레거시 라벨 기반 제거 — 사용자 hook 보존 (BUG-02/06)
  if python3 "$MERGE_PY" remove --settings "$SETTINGS"; then
    green "✓ hook 청크 제거 완료"
  else
    yel "hook 제거 실패 — settings.json 은 변경되지 않았습니다. 수동 확인 필요."
  fi
fi

# 3. 스크립트 삭제
bold "== 3) ~/.claude/scripts/ 한국어 스피너 스크립트 제거 =="
for f in patch-spinner-verbs.py patch-spinner-verbs.sh auto-patch-claude.sh merge-hooks.py; do
  if [[ -f "$SCRIPTS_DEST/$f" ]]; then
    rm -f "$SCRIPTS_DEST/$f"
    green "✓ 삭제: $f"
  fi
done
rm -f "$SCRIPTS_DEST/.spinner-to-kor-version"

# 4. 바이너리 복원 (옵션)
if [[ "$RESTORE_BIN" == "1" ]]; then
  bold "== 4) 바이너리를 가장 오래된 .bak (= 깨끗한 원본) 으로 복원 =="
  VERSIONS_DIR="$HOME/.local/share/claude/versions"
  if [[ -d "$VERSIONS_DIR" ]]; then
    for bin in "$VERSIONS_DIR"/*; do
      [[ -f "$bin" ]] || continue
      case "$bin" in *.bak.*|*.tmp) continue;; esac
      # 같은 prefix .bak 중 가장 오래된 (깨끗한 원본 추정)
      OLDEST_BAK="$(ls -1tr "${bin}".bak.* 2>/dev/null | head -1 || true)"
      if [[ -n "$OLDEST_BAK" && -f "$OLDEST_BAK" ]]; then
        cp -p "$OLDEST_BAK" "$bin"
        green "✓ 복원: $(basename "$bin") <- $(basename "$OLDEST_BAK")"
      else
        yel "  $(basename "$bin"): 백업 없음, skip"
      fi
    done
  fi
else
  yel "== 4) 바이너리는 그대로 둡니다. 영문 복귀를 원하면 './uninstall.sh --restore-bin' 사용 =="
fi

echo
bold "제거 완료. 새 터미널에서 claude 를 실행해 영문 스피너 복귀 여부를 확인하세요."
