# PRD — Claude Code 한국어 스피너 (spinner-to-kor)

> 작성일: 2026-07-02 · 작성자: villainscode · 상태: v1.0 계획 확정
> 관련 문서: [TRD](./TRD.md) · [REQUIREMENTS](./REQUIREMENTS.md) · [MILESTONES](./MILESTONES.md)

## 1. 문제 정의

Claude Code CLI는 모델 응답 대기 중 178개의 영문 위트 동사("Pondering...", "Schlepping...", "Boogieing...")를 무작위 회전시킨다. 이 단어들은:

1. **정보를 전달하지 않는다** — 어떤 verb가 떠도 실제 의미는 전부 "모델이 응답 생성 중"이다.
2. **한국어 사용자에게 이중 부담이다** — 생소한 영어 어휘(Flibbertigibbeting, Whatchamacalliting)를 해독해야 하고, 해독해도 얻는 정보가 없다.
3. **바이너리에 하드코딩되어 있다** — `settings.json` 등 공식 설정으로는 교체할 수 없다.

## 2. 제품 비전

Claude Code를 쓰는 한국어 사용자가 **스피너를 보는 순간 "지금 AI가 무엇을 하는지"를 즉시 이해**하게 한다. 설치·업데이트·제거는 명령 한 줄로 끝나고, Claude Code 자동 업데이트가 끼어들어도 사용자 개입 없이 한국어 상태가 유지된다.

## 3. 대상 사용자

| 페르소나 | 니즈 | 핵심 시나리오 |
|---|---|---|
| 한국어 개발자 (주 사용자) | 영문 위트 대신 의미 있는 한국어 상태 표시 | `./install.sh` 한 번 → 이후 신경 끄기 |
| 팀/프로젝트 관리자 | 특정 프로젝트에만 적용, 팀원 온보딩 간소화 | 프로젝트 단위 hook 설치 (M2) |
| 커스터마이저 | 라벨 문구를 취향대로 변경 | 매핑 override 파일 편집 (M3) |
| 비-macOS 사용자 | Linux/WSL 지원 | systemd 기반 자동 재패치 (M4) |

## 4. 제품 원칙

1. **가역성** — 모든 변경은 백업이 선행되고, 명령 한 줄로 완전 복원된다 (`uninstall.sh --restore-bin`).
2. **멱등성** — install·patch·uninstall을 몇 번 실행해도 결과가 같다.
3. **무간섭** — 사용자가 직접 추가한 settings.json hook·설정을 절대 파괴하지 않는다.
4. **의미 우선** — 라벨은 위트 번역이 아니라 "지금 뭐 하는지"를 전달한다 (2026-06-19 의미 통일 개정의 원칙 유지).
5. **자가 진단 가능** — 문제가 생기면 `verify.sh` 한 번으로 어느 레이어가 깨졌는지 알 수 있다.

## 5. 기능 범위

### 5.1 현재 제공 중 (M0 — 완료)

- 3-레이어 동작: 도구별 한국어 라벨(hook 20개) + 바이너리 verb 178개 한국어 치환 + LaunchAgent 자동 재패치
- 원클릭 설치(`install.sh`) / 제거(`uninstall.sh [--restore-bin]`) / 자가 진단(`verify.sh`)
- byte 길이 불변식 기반 안전 패치 + ad-hoc 재서명
- 전 과정 백업 자동 생성, 한국어 문서 5종 (README·ARCHITECTURE·MAPPING·TROUBLESHOOTING·작업 가이드)

### 5.2 로드맵 (요약 — 상세는 [MILESTONES.md](./MILESTONES.md))

| 마일스톤 | 버전 | 테마 | 핵심 기능 |
|---|---|---|---|
| M1 | v1.0 | 안정화 | 알려진 버그 6건 수정, 백업 보존 정책, 테스트 하네스, 문서 정합화 |
| M2 | v1.1 | 설치 UX | 프로젝트/전역 설치 선택, 업데이트 명령, 버전 스탬프, 단일 CLI 진입점 |
| M3 | v1.2 | 매핑 확장 | 신규 verb 자동 감지, 사용자 커스텀 매핑, 위트/의미 스타일 선택 |
| M4 | v2.0 | 플랫폼 확장 | Linux(systemd)·WSL 지원, CI 자동화 |

### 5.3 비목표 (Non-Goals)

- Claude Code의 **verb 이외 UI 문자열** 번역 (메뉴·에러 메시지 등) — 범위 밖.
- 네이티브 Windows 지원 — 코드 서명·바이너리 구조가 달라 별도 프로젝트 수준.
- Anthropic 공식 배포 채널 편입 — 로컬 바이너리 수정 도구라는 성격상 비공식 유지.
- 실시간 번역·동적 라벨 생성 — 정적 매핑으로 충분.

## 6. 사용자 경험 요구

| 항목 | 기준 |
|---|---|
| 설치 | 명령 1개, 3분 이내, 사전 요구는 macOS + Claude Code + python3뿐 |
| 업데이트 반영 | Claude Code 자동 업데이트 후 사용자 개입 0회로 한국어 유지 (10초 throttle + 재시도) |
| 제거 | 명령 1개로 설치 전 상태 완전 복원 |
| 진단 | `verify.sh` 출력만으로 고장 레이어 특정 가능, 거짓 양성/음성 0 |
| 실패 시 | 어떤 실패도 Claude Code 자체를 못 쓰게 만들지 않는다 (백업 자동 복구 경로 항상 존재) |

## 7. 성공 지표

- `verify.sh` 5항목 전부 ✓ 상태가 Claude Code 자동 업데이트를 가로질러 유지되는 비율 ≥ 99% (로그 기반 측정)
- 신규 머신 클린 설치 성공률 100% (Apple Silicon / Intel 각 1회 이상 검증)
- `uninstall.sh --restore-bin` 후 원본 sha256 일치율 100%
- 이슈 재현 → `TROUBLESHOOTING.md` 내 해결 경로 존재율 100%

## 8. 리스크 (제품 관점)

| 리스크 | 영향 | 대응 |
|---|---|---|
| Anthropic이 바이너리 packaging 변경 (압축·암호화) | Layer B 전면 무효화 | 로그에 `patched=0 errors=N` 누적 감지 → M3의 verb 감지 도구로 조기 경보, Layer A는 계속 동작 |
| macOS가 ad-hoc 서명 정책 강화 | 패치된 바이너리 실행 차단 | `--restore-bin` 즉시 복구 + README 면책 고지 유지 |
| 엔터프라이즈 MDM 차단 | 일부 사용자 사용 불가 | 사전 고지 + `--no-patch` 모드(Layer A만) 제공 |
| verb 목록 변동 (추가·삭제) | 일부 영문 잔존 | M3 자동 감지 리포트로 매핑 갱신 주기 단축 |
