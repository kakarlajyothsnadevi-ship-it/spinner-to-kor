#!/usr/bin/env python3
"""
Claude Code 스피너 동사(verb)를 의미 있는 한국어 라벨로 in-place 패치.

설계 원칙:
  Anthropic의 영문 verb 178개는 의미 없는 위트("Pondering", "Schlepping",
  "Boogieing"...)로 모델 추론 대기 시간을 채우는 장식이다. 이걸 그대로
  한국어로 옮기면 "사색중", "끌고가", "춤추기"가 되어 사용자가 "지금 뭐
  하는지" 알 수 없다.

  본 스크립트는 178개 verb 전부를 "모델이 응답을 만드는 중"이라는 단일
  의미로 수렴시키되, byte 길이별 풀에서 동의어를 라운드로빈으로 할당해
  스피너 회전감은 유지한다. 어떤 단어가 떠도 사용자는 즉시 "AI가 답변
  생성 중"임을 안다.

매핑 불변식:
  영문 verb byte 수 == 한국어 라벨 UTF-8 byte 수 (한글 1자=3B, 부족분은
  trailing space로 패딩). 같은 byte 길이라야 surrounding offset이 안전.

원리:
  Claude Code 바이너리(Mach-O Bun compile) 내부에 verb가 두 가지 포맷으로
  embed되어 있다:
    (A) Bun length-prefixed: \\0\\0\\0<len>\\0\\0\\0<len>\\0\\0\\0VERB\\0
    (B) JSON 배열: ,"VERB",

사용:
  patch-spinner-verbs.py <claude-binary-path>
  patch-spinner-verbs.py            # 자동 탐지: ~/.local/bin/claude → readlink
  patch-spinner-verbs.py --check <binary>
      조회 전용 — 영문 sentinel verb 등장 수를 stdout에 출력 (0 == 패치됨).
      파일을 수정하지 않는다. 실패 시 exit 2, stdout 무출력.

재패치 (이미 한국어로 패치된 바이너리는 영문 패턴이 없으니 백업 복구 선행):
  cp -p ~/.local/share/claude/versions/2.1.153.bak.20260618-174657 \\
        ~/.local/share/claude/versions/2.1.153
  patch-spinner-verbs.py
"""
import os
import sys
import shutil
import subprocess
from datetime import datetime
from pathlib import Path

# 영문 verb 원본 목록 — byte 길이별 그룹화
# (Anthropic이 Claude Code 바이너리에 embed한 178개 whimsical verbs)
EN_VERBS_BY_LENGTH: dict[int, list[str]] = {
    6:  ["Baking", "Ebbing", "Musing", "Vibing"],
    7:  ["Beaming", "Booping", "Brewing", "Bunning", "Cooking", "Flowing",
         "Forging", "Forming", "Gusting", "Hashing", "Herding", "Honking",
         "Misting", "Mulling", "Nesting", "Stewing", "Warping", "Working",
         "Zesting"],
    8:  ["Churning", "Clauding", "Crafting", "Creating", "Doodling",
         "Frosting", "Grooving", "Hatching", "Ideating", "Infusing",
         "Ionizing", "Moseying", "Noodling", "Orbiting", "Osmosing",
         "Perusing", "Pouncing", "Proofing", "Puzzling", "Roosting",
         "Spinning", "Swirling", "Swooping", "Thinking", "Twisting",
         "Waddling", "Whirring", "Whisking", "Wibbling"],
    9:  ["Actioning", "Beboppin'", "Billowing", "Blanching", "Boogieing",
         "Burrowing", "Cascading", "Composing", "Computing", "Crunching",
         "Drizzling", "Effecting", "Finagling", "Galloping", "Gitifying",
         "Imagining", "Inferring", "Mustering", "Pondering", "Puttering",
         "Sautéing", "Scurrying", "Sketching", "Smooshing", "Sprouting",
         "Tempering", "Tinkering", "Unfurling", "Wandering", "Wrangling"],
    10: ["Befuddling", "Bloviating", "Canoodling", "Channeling",
         "Coalescing", "Cogitating", "Concocting", "Enchanting",
         "Fermenting", "Flambéing", "Flummoxing", "Fluttering",
         "Frolicking", "Garnishing", "Generating", "Incubating",
         "Levitating", "Marinating", "Meandering", "Nebulizing",
         "Nucleating", "Processing", "Ruminating", "Scampering",
         "Schlepping", "Slithering", "Spelunking", "Symbioting",
         "Thundering", "Undulating", "Zigzagging"],
    11: ["Actualizing", "Calculating", "Catapulting", "Cerebrating",
         "Channelling", "Considering", "Cultivating", "Deciphering",
         "Determining", "Elucidating", "Envisioning", "Evaporating",
         "Germinating", "Harmonizing", "Improvising", "Manifesting",
         "Moonwalking", "Percolating", "Pollinating", "Propagating",
         "Sublimating", "Transmuting", "Unravelling"],
    12: ["Architecting", "Boondoggling", "Caramelizing", "Deliberating",
         "Embellishing", "Gallivanting", "Hyperspacing", "Lollygagging",
         "Newspapering", "Quantumizing", "Reticulating", "Sock-hopping",
         "Synthesizing", "Tomfoolering", "Whirlpooling"],
    13: ["Accomplishing", "Bootstrapping", "Combobulating", "Contemplating",
         "Crystallizing", "Gesticulating", "Jitterbugging", "Orchestrating",
         "Perambulating", "Pontificating", "Precipitating", "Razzmatazzing",
         "Transfiguring"],
    14: ["Choreographing", "Dilly-dallying", "Hullaballooing",
         "Metamorphosing", "Philosophising", "Topsy-turvying"],
    15: ["Fiddle-faddling", "Razzle-dazzling", "Recombobulating"],
    16: ["Discombobulating", "Prestidigitating"],
    17: ["Photosynthesizing"],
    18: ["Flibbertigibbeting", "Whatchamacalliting"],
}

# 한국어 라벨 풀 — byte 길이별, 모두 "모델이 응답을 만드는 중" 의미로 수렴
# 한글 1자 = 3B, 부족분은 trailing space(1B)로 패딩
KO_LABEL_POOLS: dict[int, list[str]] = {
    6:  ["추론", "사고", "응답", "생성"],
    7:  ["추론 ", "사고 ", "응답 ", "생성 ", "분석 ", "처리 ", "작업 "],
    8:  ["추론  ", "사고  ", "응답  ", "생성  ", "분석  ", "처리  ", "작업  ", "검토  "],
    9:  ["추론중", "사고중", "응답중", "생성중", "분석중", "처리중", "작업중", "검토중", "준비중"],
    10: ["추론중 ", "사고중 ", "응답중 ", "생성중 ", "분석중 ", "처리중 ", "작업중 ", "검토중 "],
    11: ["추론중  ", "사고중  ", "응답중  ", "생성중  ", "분석중  ", "처리중  ", "작업중  "],
    12: ["답변추론", "응답생성", "코드작성", "문맥분석", "결과정리", "추론진행", "답변구성"],
    13: ["답변추론 ", "응답생성 ", "코드작성 ", "문맥분석 ", "결과정리 ", "추론진행 "],
    14: ["답변추론  ", "응답생성  ", "코드작성  ", "문맥분석  "],
    15: ["답변생성중", "응답생성중", "코드작성중"],
    16: ["답변생성중 ", "응답생성중 "],
    17: ["답변생성중  "],
    18: ["답변을생성중", "응답을생성중"],
}


def _build_verb_map() -> dict[str, str]:
    """영문 verb를 byte 길이별 한국어 풀에서 라운드로빈으로 매핑."""
    m: dict[str, str] = {}
    for length, verbs in EN_VERBS_BY_LENGTH.items():
        pool = KO_LABEL_POOLS[length]
        for i, verb in enumerate(verbs):
            m[verb] = pool[i % len(pool)]
    return m


# 5B "Doing"은 한글 1자(3B)로 의미 부족 → 매핑 제외(영문 유지)
VERB_MAP: dict[str, str] = _build_verb_map()

# 미패치 판정 sentinel — 다중화 (Anthropic이 verb 하나를 빼도 감지 유지).
# 셸 스크립트는 자체 grep 대신 반드시 `--check` 로 이 정의를 사용한다.
SENTINEL_VERBS: list[str] = ["Pondering", "Thinking", "Generating"]


def count_english_verbs(data: bytes, verbs: list[str] | None = None) -> int:
    """경계 패턴 기준 영문 sentinel verb 등장 수. 0 == 패치 완료."""
    total = 0
    for verb in verbs or SENTINEL_VERBS:
        b = verb.encode("utf-8")
        total += data.count(b'"' + b + b'"')
        total += data.count(b"\x00" + b + b"\x00")
    return total


def prune_backups(binary_path: Path, keep_edges: int = 2) -> list[Path]:
    """백업 보존 정책: 가장 오래된(깨끗한 원본) + 최신만 유지, 중간 삭제.

    백업명의 timestamp(YYYYmmdd-HHMMSS)는 사전순 == 시간순.
    """
    baks = sorted(binary_path.parent.glob(binary_path.name + ".bak.*"))
    if len(baks) <= keep_edges:
        return []
    doomed = baks[1:-1]
    for p in doomed:
        p.unlink()
        print(f"백업 정리: {p.name}", file=sys.stderr)
    return doomed


def validate_map() -> None:
    """모든 매핑이 영문 byte 수 == UTF-8 byte 수 invariant를 만족하는지 강제."""
    errors = []
    for en, ko in VERB_MAP.items():
        en_len = len(en.encode("utf-8"))
        ko_len = len(ko.encode("utf-8"))
        if en_len != ko_len:
            errors.append(f"  {en!r} ({en_len}B) != {ko!r} ({ko_len}B)")
    if errors:
        print("매핑 byte 길이 불일치 (불변식 위반):", file=sys.stderr)
        print("\n".join(errors), file=sys.stderr)
        sys.exit(2)


def autodetect_binary() -> Path:
    """~/.local/bin/claude 심볼릭 링크를 따라가 실제 Mach-O 바이너리 탐지."""
    candidate = Path.home() / ".local" / "bin" / "claude"
    if candidate.exists():
        resolved = candidate.resolve()
        if resolved.is_file():
            return resolved
    versions_dir = Path.home() / ".local" / "share" / "claude" / "versions"
    if versions_dir.exists():
        files = sorted(versions_dir.iterdir(), key=lambda p: p.stat().st_mtime, reverse=True)
        for f in files:
            if not f.is_file():
                continue
            # 백업(.bak.<ts>)·임시(.tmp)·숨김 파일은 활성 바이너리가 아니다 (BUG-03)
            if f.name.startswith(".") or ".bak." in f.name \
                    or f.name.endswith((".bak", ".tmp")):
                continue
            return f.resolve()
    print("Claude Code 바이너리를 자동 탐지하지 못함. 인자로 경로를 지정하세요.",
          file=sys.stderr)
    sys.exit(2)


def patch_binary(binary_path: Path) -> tuple[int, int]:
    """
    바이너리 in-place 패치.

    각 verb에 대해 두 가지 boundary 패턴으로 안전 치환:
      (1) b'"VERB"' (JSON 배열용)
      (2) b'\\0VERB\\0' (Bun length-prefixed용)

    Returns: (총 verb 수, 치환된 occurrence 수)
    """
    print(f"바이너리 읽는 중: {binary_path}", file=sys.stderr)
    data = bytearray(binary_path.read_bytes())
    original_size = len(data)

    total_replacements = 0
    for en, ko in VERB_MAP.items():
        en_bytes = en.encode("utf-8")
        ko_bytes = ko.encode("utf-8")
        assert len(en_bytes) == len(ko_bytes), f"invariant broken at {en}"

        pat1_old = b'"' + en_bytes + b'"'
        pat1_new = b'"' + ko_bytes + b'"'
        count1 = data.count(pat1_old)
        if count1 > 0:
            data = bytearray(bytes(data).replace(pat1_old, pat1_new))
            total_replacements += count1

        pat2_old = b"\x00" + en_bytes + b"\x00"
        pat2_new = b"\x00" + ko_bytes + b"\x00"
        count2 = data.count(pat2_old)
        if count2 > 0:
            data = bytearray(bytes(data).replace(pat2_old, pat2_new))
            total_replacements += count2

    assert len(data) == original_size, "바이너리 크기 변경 — 위험 (오프셋 시프트)"

    tmp_path = binary_path.with_suffix(binary_path.suffix + ".tmp")
    tmp_path.write_bytes(bytes(data))
    tmp_path.chmod(0o755)
    tmp_path.replace(binary_path)
    print(f"패치 완료: {total_replacements} occurrence 치환", file=sys.stderr)
    return len(VERB_MAP), total_replacements


def adhoc_sign(binary_path: Path) -> bool:
    """Apple 서명 무효화 — ad-hoc(self) 재서명. macOS 한정."""
    if sys.platform != "darwin":
        return True
    print("ad-hoc 재서명 중 (codesign -s - --force)...", file=sys.stderr)
    result = subprocess.run(
        ["codesign", "-s", "-", "--force", "--preserve-metadata=entitlements,flags", str(binary_path)],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        print(f"재서명 실패: {result.stderr}", file=sys.stderr)
        return False
    return True


def main() -> int:
    validate_map()

    args = sys.argv[1:]
    check_only = False
    if args and args[0] == "--check":
        check_only = True
        args = args[1:]

    if args:
        binary_path = Path(args[0]).expanduser().resolve()
    else:
        binary_path = autodetect_binary()

    if not binary_path.is_file():
        print(f"바이너리 없음: {binary_path}", file=sys.stderr)
        return 2

    en_count = count_english_verbs(binary_path.read_bytes())

    if check_only:
        # 조회 전용 계약: 성공 시에만 stdout에 숫자 1개 (BUG-01류 이중 출력 방지)
        print(en_count)
        return 0

    if en_count == 0:
        print("이미 패치됨 (영문 sentinel 0건) — skip.", file=sys.stderr)
        return 0

    # 백업은 여기 한 곳에서만 생성한다 (BUG-05: 셸 래퍼와의 이중 백업 금지)
    backup = binary_path.with_name(
        f"{binary_path.name}.bak.{datetime.now():%Y%m%d-%H%M%S}"
    )
    if not backup.exists():
        print(f"백업 생성: {backup.name}", file=sys.stderr)
        shutil.copy2(binary_path, backup)

    verb_count, replacements = patch_binary(binary_path)
    if not adhoc_sign(binary_path):
        # 실행 불능 상태로 방치 금지 — 원본(유효 서명 보존) 즉시 복원 (NFR-04)
        print(f"재서명 실패 — 백업에서 자동 복구: {backup.name}", file=sys.stderr)
        shutil.copy2(backup, binary_path)
        return 3

    prune_backups(binary_path)
    print(f"✓ 완료: {verb_count}개 verb 매핑, {replacements}개 위치 치환 (백업: {backup.name})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
