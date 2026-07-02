#!/usr/bin/env bash
# Claude Code 스피너 동사 한국어화 — 래퍼.
#
# Claude Code가 자동 업데이트로 새 버전 바이너리를 가져오면 영문 verb가 다시
# 박힌다. 이 스크립트를 매번 새 버전 설치 후 한 번 돌리면 한국어로 재패치된다.
#
# 사용:
#   ~/.claude/scripts/patch-spinner-verbs.sh           # 자동 탐지
#   ~/.claude/scripts/patch-spinner-verbs.sh <path>    # 명시적 바이너리 경로
#
# 백업 생성·미패치 검사·서명 실패 복구는 전부 patch-spinner-verbs.py 가
# 책임진다 — 이 래퍼는 경로 탐지와 사용자 안내만 한다. (BUG-05: 이중 백업 금지)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PY_SCRIPT="$SCRIPT_DIR/patch-spinner-verbs.py"

if [[ ! -f "$PY_SCRIPT" ]]; then
  echo "patch-spinner-verbs.py 없음: $PY_SCRIPT" >&2
  exit 2
fi

# 바이너리 위치 탐지
if [[ $# -ge 1 ]]; then
  BIN="$1"
else
  CLAUDE_CMD="$(command -v claude 2>/dev/null || true)"
  if [[ -z "$CLAUDE_CMD" ]]; then
    echo "claude 명령어를 PATH에서 찾을 수 없음." >&2
    exit 2
  fi
  BIN="$(readlink -f "$CLAUDE_CMD" 2>/dev/null || python3 -c "import os,sys; print(os.path.realpath(sys.argv[1]))" "$CLAUDE_CMD")"
fi

if [[ ! -f "$BIN" ]]; then
  echo "바이너리 없음: $BIN" >&2
  exit 2
fi

# 미패치 검사 — 다중 sentinel (py --check)
EN_COUNT="$(python3 "$PY_SCRIPT" --check "$BIN")" || EN_COUNT=""
if [[ "$EN_COUNT" == "0" ]]; then
  echo "이미 패치됨 (영문 sentinel 0건). skip." >&2
  exit 0
fi

# 패치 (py가 백업 → 치환 → ad-hoc 재서명 → 실패 시 원본 복구까지 수행)
python3 "$PY_SCRIPT" "$BIN"

echo
echo "✓ 패치 완료. 새 claude 세션을 띄워 스피너에서 한국어가 보이는지 확인하세요."
echo "  복구가 필요하면: ./uninstall.sh --restore-bin  (가장 오래된 백업 = 깨끗한 원본)"
