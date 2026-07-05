#!/usr/bin/env python3
"""settings.json hooks.PreToolUse 무간섭 머지/제거 — install.sh·uninstall.sh 공용.

핵심 계약 (FR-12/17, NFR-03, BUG-02/06):
  1) 사용자가 직접 등록한 hook은 어떤 경우에도 파괴·변형하지 않는다.
     동일 matcher의 사용자 hook이 있어도 교체하지 않고 별도 entry로 공존한다
     (Claude Code는 같은 matcher의 entry를 모두 실행한다).
  2) 우리 entry 식별은 command 안의 마커("true # spinner-to-kor")로 한다 —
     settings 스키마에 비표준 키를 추가하지 않기 위해 command 주석을 쓴다.
  3) 마커 없는 구버전 설치본(command == "true" + 알려진 한국어 라벨)은
     레거시로 인식해 in-place 업그레이드/제거한다 — 기존 사용자는 재설치 불필요.
  4) 어떤 실패(깨진 JSON, 비정상 구조)에서도 settings.json을 쓰지 않는다.
     쓰기는 tmp 파일 + atomic replace.

사용:
  merge-hooks.py install --settings <path> --snippet <path>
  merge-hooks.py remove  --settings <path>
"""
import argparse
import json
import os
import sys
import tempfile

MARKER = "spinner-to-kor"

# Claude Code 공식 spinnerVerbs 설정(2.1.x)으로 스피너 verb 풀을 교체한다.
# 바이너리 패치(Layer B)와 달리 byte 길이 제약이 없어 동작별 라벨이 가능하다.
# 주의: verb는 응답 턴마다 랜덤 1개가 선택돼 턴 끝까지 고정된다(활동 연동 아님).
# 소유 판정은 아래 목록 exact-match — 목록을 바꾸는 릴리스는 직전 목록을
# LEGACY_VERB_SETS 에 추가해야 기존 설치 사용자가 in-place 갱신/제거된다.
SPINNER_VERBS = [
    "파일 분석중", "파일 작성중", "파일 검토중", "파일 리팩토링중", "파일 정리중",
    "코드 분석중", "코드 생성중", "코드 검토중", "코드 리팩토링중",
    "명령어 실행중", "테스트 실행중", "디버깅중", "오류 분석중", "로그 분석중",
    "서버 실행중", "문서 작성중", "문서 분석중",
    "구조 파악중", "계획 수립중", "컨텍스트 분석중", "요구사항 검토중",
    "추론중", "사고중", "응답 생성중", "답변 작성중",
]

# 과거 배포본이 쓴 verb 목록들 — 고정값, 목록 추가만 하고 수정 금지 (LEGACY_LABELS 선례).
LEGACY_VERB_SETS: tuple = ()

# 구버전(마커 도입 전) 설치본이 사용한 statusMessage — 레거시 식별 폴백.
# 이 목록은 과거 배포본 고정값이므로 새 라벨을 추가하지 않는다.
LEGACY_LABELS = frozenset((
    "파일 읽는 중", "파일 검색 중", "코드 검색 중", "파일 편집 중", "파일 작성 중",
    "노트북 편집 중", "쉘 명령 실행 중", "서브에이전트 실행 중", "웹 페이지 조회 중",
    "웹 검색 중", "작업 관리 중", "스킬 실행 중", "도구 스키마 로드 중", "사용자 확인 대기",
    "계획 모드 전환 중", "워크트리 전환 중", "예약 작업 관리 중", "예약 깨우기 설정 중",
    "MCP 리소스 조회 중", "MCP 도구 호출 중",
))


def sub_is_ours(sub) -> bool:
    if not isinstance(sub, dict):
        return False
    cmd = sub.get("command", "")
    if isinstance(cmd, str) and MARKER in cmd:
        return True
    return cmd == "true" and sub.get("statusMessage") in LEGACY_LABELS


def spinner_verbs_is_ours(cur) -> bool:
    """현재 또는 과거 배포본의 spinnerVerbs 인지 — 사용자 자작 설정은 False."""
    if not isinstance(cur, dict) or cur.get("mode") != "replace":
        return False
    verbs = cur.get("verbs")
    return verbs == SPINNER_VERBS or any(verbs == list(s) for s in LEGACY_VERB_SETS)


def entry_is_ours(entry) -> bool:
    """entry의 모든 sub-hook이 우리 것일 때만 통째 소유로 판정."""
    if not isinstance(entry, dict):
        return False
    subs = entry.get("hooks", [])
    return bool(subs) and all(sub_is_ours(s) for s in subs)


def load_settings(path: str) -> dict:
    if not os.path.exists(path):
        return {}
    with open(path) as f:
        settings = json.load(f)  # 깨진 JSON → JSONDecodeError → 무변경 중단
    if not isinstance(settings, dict):
        raise ValueError("settings.json 최상위가 객체가 아님")
    return settings


def get_pretooluse(settings: dict) -> list:
    hooks = settings.setdefault("hooks", {})
    if not isinstance(hooks, dict):
        raise ValueError("settings.hooks 가 객체가 아님")
    pre = hooks.setdefault("PreToolUse", [])
    if not isinstance(pre, list):
        raise ValueError("settings.hooks.PreToolUse 가 배열이 아님")
    return pre


def write_settings(path: str, settings: dict) -> None:
    """tmp + atomic replace — 중간 실패로 파일이 잘리는 일 방지."""
    d = os.path.dirname(path) or "."
    os.makedirs(d, exist_ok=True)
    fd, tmp = tempfile.mkstemp(dir=d, prefix=".settings-", suffix=".tmp")
    try:
        with os.fdopen(fd, "w") as f:
            json.dump(settings, f, indent=2, ensure_ascii=False)
            f.write("\n")
        os.replace(tmp, path)
    except BaseException:
        os.unlink(tmp)
        raise


def do_install(settings_path: str, snippet_path: str) -> str:
    with open(snippet_path) as f:
        snippet = json.load(f)

    settings = load_settings(settings_path)
    pre = get_pretooluse(settings)

    added = updated = deduped = 0
    for new_entry in snippet["PreToolUse"]:
        matcher = new_entry.get("matcher")
        ours_idx = [i for i, e in enumerate(pre)
                    if isinstance(e, dict) and e.get("matcher") == matcher
                    and entry_is_ours(e)]
        if ours_idx:
            # in-place 갱신 (기존 사용자 업데이트 경로) + 과거 중복 정리
            pre[ours_idx[0]] = new_entry
            updated += 1
            for i in reversed(ours_idx[1:]):
                del pre[i]
                deduped += 1
        else:
            # 사용자 entry에 섞여 들어간 우리 sub-hook만 회수 후 새 entry 추가.
            # 우리가 비운 entry만 삭제 — 원래 비어 있던 사용자 entry는 보존.
            survivors = []
            for e in pre:
                if isinstance(e, dict) and e.get("matcher") == matcher \
                        and isinstance(e.get("hooks"), list) \
                        and any(sub_is_ours(s) for s in e["hooks"]):
                    kept = [s for s in e["hooks"] if not sub_is_ours(s)]
                    if kept:
                        survivors.append({**e, "hooks": kept})
                else:
                    survivors.append(e)
            pre[:] = survivors
            pre.append(new_entry)
            added += 1

    cur = settings.get("spinnerVerbs")
    if cur is None or spinner_verbs_is_ours(cur):
        settings["spinnerVerbs"] = {"mode": "replace", "verbs": list(SPINNER_VERBS)}
        sv_msg = f"spinnerVerbs 적용({len(SPINNER_VERBS)}개)"
    else:
        sv_msg = "사용자 spinnerVerbs 보존(미변경)"

    write_settings(settings_path, settings)
    return (f"추가 {added}건, 갱신 {updated}건, 중복 정리 {deduped}건 "
            f"(총 PreToolUse {len(pre)}개) · {sv_msg}")


def do_remove(settings_path: str) -> str:
    if not os.path.exists(settings_path):
        return "settings.json 없음 — 제거할 것 없음"

    settings = load_settings(settings_path)
    hooks = settings.get("hooks")
    pre = hooks.get("PreToolUse") if isinstance(hooks, dict) else None

    removed = stripped = 0
    new_pre = []
    if isinstance(pre, list):
        for entry in pre:
            if entry_is_ours(entry):
                removed += 1
                continue
            if isinstance(entry, dict) and isinstance(entry.get("hooks"), list) \
                    and any(sub_is_ours(s) for s in entry["hooks"]):
                entry = {**entry, "hooks": [s for s in entry["hooks"] if not sub_is_ours(s)]}
                stripped += 1
            new_pre.append(entry)

        hooks["PreToolUse"] = new_pre
        # 우리가 비운 컨테이너만 정리 — 사용자 원형 복원 (왕복 무흔적)
        if not new_pre:
            del hooks["PreToolUse"]
        if not hooks:
            del settings["hooks"]

    sv_removed = spinner_verbs_is_ours(settings.get("spinnerVerbs"))
    if sv_removed:
        del settings["spinnerVerbs"]

    if not isinstance(pre, list) and not sv_removed:
        return "PreToolUse·spinnerVerbs 없음 — 제거할 것 없음"

    write_settings(settings_path, settings)
    sv_msg = "spinnerVerbs 제거" if sv_removed else "spinnerVerbs 해당 없음"
    return (f"제거 {removed}건, 혼합 entry 정리 {stripped}건 "
            f"(잔여 PreToolUse {len(new_pre)}개) · {sv_msg}")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", choices=["install", "remove"])
    parser.add_argument("--settings", required=True)
    parser.add_argument("--snippet")
    args = parser.parse_args()

    if args.action == "install" and not args.snippet:
        print("install 에는 --snippet 이 필요합니다.", file=sys.stderr)
        return 2

    try:
        if args.action == "install":
            msg = do_install(args.settings, args.snippet)
        else:
            msg = do_remove(args.settings)
    except (json.JSONDecodeError, ValueError, OSError) as e:
        print(f"중단 — settings.json 무변경: {e}", file=sys.stderr)
        return 2

    print(f"  {msg}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
