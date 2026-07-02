# TRD — Claude Code 한국어 스피너 기술 설계

> 작성일: 2026-07-02 · 대상 버전: M1(v1.0)~M4(v2.0)
> 관련 문서: [PRD](./PRD.md) · [REQUIREMENTS](./REQUIREMENTS.md) · [MILESTONES](./MILESTONES.md) · [ARCHITECTURE](../ARCHITECTURE.md)

## 1. 현재 시스템 구조 (M0 기준)

```
사용자 입력
    │
    ▼
[Layer A] Hook statusMessage          ~/.claude/settings.json (PreToolUse 20 matcher)
    │        도구 호출 → 한국어 라벨 ("파일 읽는 중" 등). command는 no-op("true").
    ▼
[Layer B] 바이너리 verb 치환           ~/.local/share/claude/versions/<버전>
    │        178 verb → byte 동일 길이 한국어 라운드로빈. 치환 후 ad-hoc 재서명.
    ▼
[Layer C] LaunchAgent 자동 재패치      ~/Library/LaunchAgents/dev.claude-spinner-patch.plist
             WatchPaths(FSEvents) → throttle 10s → auto-patch-claude.sh → 전체 스캔(idempotent)
```

### 1.1 컴포넌트 책임

| 컴포넌트 | 책임 | 비책임 |
|---|---|---|
| `patch-spinner-verbs.py` | 매핑 정의·검증(`validate_map`)·바이너리 탐지·치환·백업·재서명 | 다중 파일 스캔 (auto-patch 몫) |
| `patch-spinner-verbs.sh` | 단일 바이너리 대상 사전검사(sentinel)·백업·py 호출 | 매핑 로직 |
| `auto-patch-claude.sh` | versions/ 전체 스캔, 미패치 파일만 처리, 로그 기록, 실패 시 백업 복구 | 사용자 대면 출력 |
| `install.sh` | 스크립트 배치 → hook 머지 → LaunchAgent 등록 → 즉시 패치 → verify | 바이너리 로직 |
| `uninstall.sh` | LaunchAgent 제거 → hook 제거(KO 마커) → 스크립트 삭제 → (옵션) 바이너리 복원 | — |
| `verify.sh` | 5항목 진단 (바이너리 경로·verb 잔존·LaunchAgent·hook·로그) | 자동 복구 |

### 1.2 핵심 불변식과 그 이유

```
영문 verb UTF-8 byte 수 == 한국어 라벨 UTF-8 byte 수
```

Claude Code 바이너리는 Bun compile된 Mach-O(arm64, ~205MB, hardened runtime)다. verb는 두 포맷으로 embed된다:

- (A) Bun length-prefixed: `\0...\0<len>\0...\0VERB\0` — 길이 필드가 **바뀌지 않아야** 문자열 테이블이 유효
- (B) JSON 배열: `,"VERB",`

같은 byte 길이 치환이면 파일 크기·모든 offset·section header가 보존되어 Mach-O 구조 분석 없이 안전하다. 치환 후 Apple Developer 서명이 무효화되므로 `codesign -s - --force --preserve-metadata=entitlements,flags`로 ad-hoc 재서명한다.

### 1.3 경계 패턴 치환의 안전성

`b'"VERB"'`와 `b'\x00VERB\x00'` 두 경계 패턴만 치환하므로, verb가 다른 단어의 부분 문자열로 등장해도(예: 소스맵·주석) 오치환되지 않는다. 실측: 2.1.153 기준 538 occurrence.

## 2. 알려진 결함 — 기술적 원인 분석 (**v1.0.0에서 전량 수정 완료**)

상세 ID·수용 기준은 [REQUIREMENTS.md §4](./REQUIREMENTS.md) 버그 레지스터, 실제 수정 내역은 [CHANGELOG](../CHANGELOG.md) 참조. 아래 "수정 방향"은 전부 구현·회귀 테스트 완료됨. 단, "우리 것" 식별 마커는 설계 시점의 `_source` 키 대신 **`command` 안 `# spinner-to-kor` 주석**으로 구현했다 — settings 스키마에 비표준 키를 추가하지 않기 위해서다.

| ID | 위치 | 원인 | 수정 방향 |
|---|---|---|---|
| BUG-01 | `verify.sh:32` | `set -o pipefail` 하에서 `grep -c`가 0건 매치 시 `0` 출력 + exit 1 → `\|\| echo 0` 중복 실행 → `PONDER_COUNT="0\n0"` → 패치 완료 상태를 ✗ 미패치로 오판 (재현 확인됨) | `grep -c` 결과만 취하고 exit code 무시: `... \| grep -c '^Pondering$' \|\| true` 제거하고 `PONDER_COUNT=$(... ; true)` 또는 `awk` 집계로 교체 |
| BUG-02 | `install.sh` hook 머지 | 동일 matcher 존재 시 entry 전체를 덮어씀 → 사용자가 직접 등록한 동일 matcher hook(예: Bash 보안 검사) 파괴 | "우리 것" 식별 마커(`_source: "spinner-to-kor"` 등) 도입, 우리 entry만 교체·추가. 사용자 entry는 무조건 보존 |
| BUG-03 | `patch-spinner-verbs.py:150` | `autodetect_binary()` 폴백이 `f.name.endswith(".bak")`로 필터 — 실제 백업명은 `.bak.<ts>`라 필터 통과, 백업 파일을 활성 바이너리로 오탐 가능 | `".bak." in f.name or f.name.endswith((".bak", ".tmp"))` 로 필터 강화 |
| BUG-04 | `auto-patch-claude.sh` + FSEvents | 자동 업데이트가 파일을 쓰는 도중 트리거되면 `strings` 부분 출력 → sentinel 미검출 → skip (TROUBLESHOOTING 증상 1) | mtime 2회 측정 안정화 대기(문서에 이미 설계 존재) + 실패 시 지수 백오프 재시도 1회 |
| BUG-05 | `auto-patch-claude.sh:55` + `patch-spinner-verbs.py:228` | 양쪽 모두 백업 생성 → 실행당 최대 2개(각 ~205MB) 중복 백업, 보존 정책 없음 → 디스크 누수 | 백업은 py 한 곳으로 일원화, "가장 오래된 .bak 1개(깨끗한 원본) + 최신 1개" 보존 정책 추가 |
| BUG-06 | `uninstall.sh` `KO_MARKERS` | snippets의 statusMessage 목록과 수동 중복 — 라벨 변경 시 제거 누락 위험 | BUG-02의 `_source` 마커 기반 제거로 전환 (마커 없는 구버전 설치본은 KO_MARKERS 폴백 유지) |
| DOC-01 | `README.md` | 폴더 구조가 `docs/spinner/` 기준으로 기술 — 실제 repo 루트 구조와 불일치. snippet `_comment`의 "jq 머지" 언급도 실제(Python 머지)와 불일치 | 실제 구조로 갱신 |

### 2.1 단일 sentinel의 취약성 (M1)

미패치 판정이 `strings | grep '^Pondering$'` 하나에 의존한다. Anthropic이 verb 목록에서 Pondering을 제거하면 전체 감지가 무너진다. **다중 sentinel** (예: `Pondering`·`Thinking`·`Generating` 중 1개 이상 검출)로 전환하고, sentinel 정의를 py 한 곳에 두고 셸에서는 py를 호출해 판정한다 (3곳 중복 제거).

## 3. 신규 기능 기술 설계

### 3.1 M2 — 설치 스코프 분리 (전역/프로젝트)

Claude Code 설정 우선순위: 프로젝트 `.claude/settings.json` > 사용자 `~/.claude/settings.json`. Layer A(hook)는 이 구조를 그대로 탄다.

```bash
./install.sh                  # 전역 (기본, 현행 유지)
./install.sh --project [DIR]  # DIR/.claude/settings.json 에 hook만 머지 (기본 DIR=$PWD)
```

- `--project`는 **Layer A만** 설치한다. Layer B/C(바이너리·LaunchAgent)는 머신 전역 자원이므로 프로젝트 스코프 개념이 없다 — 이미 전역 설치돼 있으면 그대로 쓰고, 없으면 안내만 출력.
- hook 머지 로직을 `src/merge-hooks.py`로 추출해 install/uninstall이 공유 (BUG-02·06 수정과 동일 코드 경로).
- `uninstall.sh --project [DIR]` 대칭 제공.

### 3.2 M2 — 버전 스탬프와 업데이트

- repo 루트에 `VERSION` 파일 (semver). `install.sh`가 `~/.claude/scripts/.spinner-to-kor-version`으로 복사.
- `./install.sh --update` (별칭 `update.sh`): git pull 여부는 사용자 몫, 스크립트는 "설치본 버전 ≠ repo 버전"이면 재배치 + hook 재머지 + 필요 시 재패치. 전 과정 멱등이므로 사실상 install 재실행 + 버전 비교 리포트.
- `verify.sh`에 [6] 항목 추가: 설치본 버전 == repo 버전.

### 3.3 M2 — 단일 CLI 진입점 (선택 채택)

```
./spinner-to-kor <install|uninstall|update|verify|patch|status> [옵션]
```

기존 스크립트를 서브커맨드로 위임하는 얇은 디스패처. 기존 진입점(install.sh 등)은 하위 호환으로 유지. 문서·안내 메시지의 명령 표면을 하나로 수렴시키는 것이 목적.

### 3.4 M3 — 신규 verb 자동 감지

새 Claude Code 버전이 verb를 추가하면 매핑 밖 영문이 잔존한다. 감지 도구:

```bash
python3 src/detect-verbs.py <binary>
```

- 바이너리에서 `\0[A-Z][a-z'-]{4,17}\0` + `"..."` 경계 패턴으로 gerund 후보 추출 → `EN_VERBS_BY_LENGTH`와 diff → 미매핑 verb 리포트 (byte 길이 포함, 풀에 넣기만 하면 되는 형태로 출력).
- `auto-patch-claude.sh`가 패치 후 이 도구를 호출해 미매핑 verb 발견 시 로그에 `WARN unmapped=N` 기록 — 조기 경보.

### 3.5 M3 — 사용자 커스텀 매핑

- `~/.claude/spinner-map.json` (선택 파일): `{"pools": {"9": ["탐색중", ...]}, "overrides": {"Pondering": "추론중"}}`.
- `patch-spinner-verbs.py`가 존재 시 로드 → 기본 풀에 오버레이 → `validate_map()`이 byte 불변식을 동일하게 강제 (위반 시 exit 2 + 어떤 entry가 몇 byte 초과인지 출력).
- 스타일 프리셋: `--style semantic`(기본, 현행) / `--style witty`(가이드 §5-옛의 위트 1:1 매핑 부활). 위트 매핑은 이미 문서에 완성본이 있어 데이터화만 필요.

### 3.6 M4 — Linux/WSL

| macOS 구성요소 | Linux 대체 |
|---|---|
| LaunchAgent WatchPaths | systemd path unit (`PathModified=~/.local/share/claude/versions`) |
| codesign ad-hoc 재서명 | 불필요 (ELF, 서명 없음) — 재서명 단계 no-op |
| Mach-O 구조 | ELF — byte 동일 길이 치환 원리는 동일, sentinel·경계 패턴 재검증 필요 |

`install.sh`가 `uname`으로 분기, 플랫폼별 유닛 파일은 `templates/`에 병렬 배치. WSL은 Linux 경로와 동일(단, Windows 쪽 Claude Code가 아닌 WSL 내 설치본만 대상).

### 3.7 M1 — 테스트 하네스

바이너리 패치 도구 특성상 "진짜 Claude 바이너리" 없이 검증 가능해야 한다:

- **fixture 바이너리 생성기** `tests/make-fixture.py`: 두 embed 포맷(JSON 배열·NUL 경계)으로 verb를 심은 수 KB짜리 가짜 파일 생성.
- **Python 단위 테스트** (`tests/test_patch.py`, unittest): `validate_map` 전수 통과, fixture 패치 후 (a) 크기 불변 (b) 영문 잔존 0 (c) 한국어 존재 (d) 비-verb 영역 무변경, autodetect의 `.bak.` 필터.
- **셸 테스트** (bats-core): install→verify→uninstall 왕복을 `$HOME`을 tmpdir로 위장해 dry-run, hook 머지 멱등성, 사용자 hook 보존(BUG-02 회귀 테스트), verify.sh grep 버그 회귀 테스트.
- codesign·launchctl은 macOS 실기 전용이므로 CI에서는 mock(PATH 앞에 가짜 codesign 배치), 로컬에서 실기 스모크.

## 4. 기술 결정 기록 (ADR 요약)

| 결정 | 대안 | 채택 이유 |
|---|---|---|
| byte 동일 길이 in-place 치환 | Mach-O 재빌드, 바이너리 리패키징 | 구조 분석 불요·크기 불변·가역적. 재빌드는 Bun 내부 포맷 의존이라 취약 |
| ad-hoc 재서명 | 자체 인증서 서명, 서명 제거 | hardened runtime 바이너리는 서명 필수. ad-hoc이 유일한 무자격 경로 |
| Python(표준 라이브러리만) 패치 본체 | jq, perl, 바이너리 도구 | macOS 기본 탑재(xcode CLT), 의존성 0, byte 연산 명확 |
| LaunchAgent WatchPaths | cron 주기 폴링, claude 래퍼 스크립트 | 이벤트 기반이라 지연 최소·유휴 비용 0. 래퍼는 PATH 조작이라 침습적 |
| hook command `"true"` no-op | 실제 로직 실행 | statusMessage 표시만 목적 — 부작용·지연 0 보장 |
| 라운드로빈 풀 매핑 | 178개 1:1 수동 매핑 | 풀만 관리하면 신규 verb 자동 흡수, 의미 통일 원칙 코드화 |

## 5. 보안·안전 고려사항

- 패치 대상은 **사용자 소유 로컬 바이너리 한정**. 시스템 경로·타 계정 접근 없음. sudo 불요.
- 재서명은 ad-hoc(자기 서명) — 배포·공증 우회가 아니라 로컬 실행 유지 목적. 엔터프라이즈 MDM이 차단할 수 있음을 문서에 고지 유지.
- `install.sh`의 settings.json 머지는 쓰기 전 백업 필수 (현행 유지). JSON 파싱 실패 시 원본 무변경으로 중단.
- LaunchAgent는 사용자 세션 권한으로만 동작. 스크립트 경로는 `$HOME` 하위 고정.

## 6. 성능·용량

| 항목 | 실측/목표 |
|---|---|
| 바이너리 패치 소요 | 205MB 읽기+치환+쓰기+재서명 ≈ 수 초 (충분) |
| 백업 용량 | 버전당 205MB × 백업 수 — **M1 보존 정책 필수** (원본 1 + 최신 1 = 버전당 최대 ~410MB) |
| hook 오버헤드 | `command: "true"` — 프로세스 spawn 1회/도구 호출, 무시 가능 |
| LaunchAgent 유휴 비용 | 0 (이벤트 대기), throttle 10s |
