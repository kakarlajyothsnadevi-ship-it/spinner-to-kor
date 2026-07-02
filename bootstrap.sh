#!/usr/bin/env bash
# spinner-to-kor 원격 한 줄 설치·업데이트 부트스트랩.
#
#   curl -fsSL https://raw.githubusercontent.com/claude-code-expert/spinner/main/bootstrap.sh | bash
#
# 동작:
#   1) GitHub 최신 release 의 소스 tarball 다운로드 (버전 고정·재현 가능)
#   2) 임시 디렉터리에 풀고 install.sh 실행 (인자 그대로 투과)
#   3) install.sh 가 배포 스냅샷을 ~/.claude/spinner-to-kor/ 에 보관하고
#      PATH 진입점 ~/.local/bin/spinner-to-kor 를 심는다
#
# 테스트/오프라인:
#   SPINNER_SOURCE_TARBALL=<로컬 tar.gz>  → release 조회를 건너뛰고 그 파일 사용
#   SPINNER_REPO=<owner/repo>             → 기본 claude-code-expert/spinner 재지정
set -euo pipefail

REPO="${SPINNER_REPO:-claude-code-expert/spinner}"

err() { printf "\033[31m%s\033[0m\n" "$*" >&2; }

for cmd in curl tar python3; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    err "필수 명령 없음: $cmd"
    exit 2
  fi
done

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
TARBALL="$TMP/src.tar.gz"

if [[ -n "${SPINNER_SOURCE_TARBALL:-}" ]]; then
  # 오프라인/테스트 경로 — 로컬 tarball 사용
  if [[ ! -f "$SPINNER_SOURCE_TARBALL" ]]; then
    err "SPINNER_SOURCE_TARBALL 파일 없음: $SPINNER_SOURCE_TARBALL"
    exit 2
  fi
  cp "$SPINNER_SOURCE_TARBALL" "$TARBALL"
else
  API="https://api.github.com/repos/$REPO/releases/latest"
  printf "최신 release 조회: %s\n" "$REPO" >&2
  # tarball_url 만 뽑음 (jq 불필요). release 없으면 실패.
  TARBALL_URL="$(curl -fsSL "$API" \
    | python3 -c 'import json,sys; print(json.load(sys.stdin).get("tarball_url",""))' 2>/dev/null || true)"
  if [[ -z "$TARBALL_URL" ]]; then
    err "release tarball URL 조회 실패. release 가 아직 없으면 다음으로 설치하세요:"
    err "  git clone https://github.com/$REPO && cd spinner && ./install.sh"
    exit 1
  fi
  printf "다운로드: %s\n" "$TARBALL_URL" >&2
  curl -fsSL "$TARBALL_URL" -o "$TARBALL"
fi

tar -xzf "$TARBALL" -C "$TMP"
# github tarball 은 <owner>-<repo>-<sha>/ 형태의 단일 최상위 디렉터리를 갖는다
SRC_DIR="$(find "$TMP" -maxdepth 1 -mindepth 1 -type d | head -1)"
if [[ -z "$SRC_DIR" || ! -f "$SRC_DIR/install.sh" ]]; then
  err "tarball 에서 install.sh 를 찾지 못함"
  exit 1
fi

chmod +x "$SRC_DIR/install.sh" 2>/dev/null || true
exec bash "$SRC_DIR/install.sh" "$@"
