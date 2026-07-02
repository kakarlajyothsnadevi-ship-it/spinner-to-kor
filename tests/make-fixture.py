#!/usr/bin/env python3
"""테스트용 가짜 Claude 바이너리(fixture) 생성기.

실제 Claude Code 바이너리(~205MB, Mach-O)와 같은 두 가지 verb embed 포맷을
수 KB 파일로 재현한다:
  (A) Bun length-prefixed 유사: \\0\\0\\0<len>\\0VERB\\0
  (B) JSON 배열: ["VERB","VERB",...]

경계 없는 decoy 문자열(부분 일치 오치환 검증용)도 포함한다.

사용:
  make-fixture.py <출력경로> [--patched]
  (모듈로 import 시 build_fixture() 사용)
"""
import importlib.util
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# 패치 시 절대 변하면 안 되는 decoy — verb가 경계 패턴 없이 등장
DECOYS = [
    b"XPonderingX",          # 앞뒤 문자 밀착
    b"PonderingTail",        # 접두 일치
    b"HeadPondering",        # 접미 일치
    b"\x00NotAVerbAtAll\x00",  # NUL 경계지만 verb 아님
]


def load_patcher():
    """src/patch-spinner-verbs.py 를 하이픈 파일명 그대로 로드."""
    spec = importlib.util.spec_from_file_location(
        "patch_spinner_verbs", ROOT / "src" / "patch-spinner-verbs.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def build_fixture(path, patched: bool = False, extra_verbs=None, omit=()) -> Path:
    """fixture 생성. patched=True면 생성 직후 실제 패치 코드 경로로 한국어화."""
    m = load_patcher()
    verbs = [v for vs in m.EN_VERBS_BY_LENGTH.values() for v in vs if v not in omit]
    if extra_verbs:
        verbs = verbs + list(extra_verbs)

    chunks = [b"\xcf\xfa\xed\xfe FAKE-MACHO-HEADER \x00\x00\x00\x00"]
    for v in verbs:
        b = v.encode("utf-8")
        chunks.append(b"\x00\x00\x00" + bytes([len(b)]) + b"\x00" + b + b"\x00")
    chunks.append(b'["' + b'","'.join(v.encode("utf-8") for v in verbs) + b'"]')
    chunks.extend(DECOYS)
    chunks.append(b"\nPADDING" * 64 + b"\n")

    path = Path(path)
    path.write_bytes(b"".join(chunks))
    os.chmod(path, 0o755)

    if patched:
        m.patch_binary(path)
    return path


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if a != "--patched"]
    if not args:
        print("사용: make-fixture.py <출력경로> [--patched]", file=sys.stderr)
        sys.exit(2)
    build_fixture(args[0], patched="--patched" in sys.argv)
    print(args[0])
