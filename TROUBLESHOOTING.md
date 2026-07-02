# Troubleshooting

`./verify.sh` 를 먼저 돌려 5개 항목 중 어디서 ✗ 가 나오는지 확인하면 거의 모든 증상이 빠르게 분류된다.

---

## 증상 1 — 새 세션에서도 영문 verb가 보인다

**가장 흔한 원인: Claude Code 자동 업데이트로 새 바이너리가 도착했는데 LaunchAgent가 미트리거됐다.**

### 진단

```bash
./verify.sh
```

- `[2] 영문 verb 잔존` 에 0이 아닌 수가 나오면 → 미패치
- `[5] 최근 패치 로그` 의 마지막 줄이 `patched=0 skipped=N` 이면 → LaunchAgent는 트리거됐지만 skip 로직이 새 바이너리를 못 잡았음

### 즉시 해결

```bash
# 모든 versions/ 바이너리를 강제 스캔 + 패치
~/.claude/scripts/auto-patch-claude.sh

# 또는 단일 바이너리 명시 (활성 버전이 2.1.170 이라면)
~/.claude/scripts/patch-spinner-verbs.sh ~/.local/share/claude/versions/2.1.170
```

### 쓰기 진행 중 파일은 자동 연기된다 (v1.0+)

자동 업데이트가 새 파일을 쓰는 **도중**에 FSEvents가 트리거되면 검사가 부정확할 수 있다. v1.0부터 `auto-patch-claude.sh` 가 mtime 안정화 대기를 내장한다:

- 최근 10초 내 변경된 파일은 2초(기본, `SPINNER_PATCH_SETTLE_SECS`로 조정) 대기 후 mtime 재측정
- 여전히 변하는 중이면 `쓰기 진행 중 — 연기` 로그를 남기고 skip → 다음 FSEvents 트리거가 다시 잡는다
- 로그 마지막 줄의 `deferred=N` 이 이 경로의 횟수

그래도 영문이 남아 있으면 (FSEvents 자체 누락 — 절전 등) 수동 실행으로 즉시 복구된다.

### 미패치 판정 방식 (v1.0+)

판정은 `patch-spinner-verbs.py --check <bin>` 한 곳에 일원화됐다 — 다중 sentinel(Pondering·Thinking·Generating)의 경계 패턴 등장 수를 세며, 0이면 패치 완료다. 셸에서 직접 `strings | grep` 하지 말 것.

---

## 증상 2 — verb는 한국어인데 도구별 라벨("파일 읽는 중")이 안 보인다

### 진단

```bash
./verify.sh   # [4] settings.json 한국어 hook
```

✗ 가 나오면 hook이 머지되지 않았거나 JSON 문법 깨짐.

### 복구

```bash
# 1. JSON 문법 검증
python3 -m json.tool ~/.claude/settings.json

# 2. 가장 최근 백업으로 복원 후 재설치
ls -lt ~/.claude/settings.json.bak.* | head -3
cp ~/.claude/settings.json.bak.<timestamp> ~/.claude/settings.json
./install.sh
```

---

## 증상 3 — `claude` 실행 시 `killed: 9` 또는 즉시 종료

ad-hoc 서명을 Gatekeeper가 거부하거나, 엔터프라이즈 MDM 정책이 차단하는 경우.

### 즉시 복구

```bash
# 가장 오래된 .bak (= 깨끗한 원본 Apple Developer 서명 보존) 으로 복원
./uninstall.sh --restore-bin

# 검증
claude --version
```

엔터프라이즈 환경이면 IT 관리자에게 **"ad-hoc 서명된 로컬 바이너리 허용"** 정책을 요청해야 한다.

---

## 증상 4 — LaunchAgent가 트리거돼도 패치가 안 된다

### 진단

```bash
tail -50 ~/.claude/logs/spinner-patch.log
tail -50 ~/.claude/logs/spinner-patch.stderr
```

| 로그 단서 | 조치 |
|---|---|
| `patched=0 skipped=N` (N≥1) | 정상 — 이미 패치된 파일만 있음 |
| `deferred=N` (N≥1) | 정상 — 쓰기 진행 중 파일 연기, 다음 트리거에서 재시도 |
| `patched=0 skipped=N` 인데 verify가 ✗ | 증상 1 — 수동 패치로 복구 |
| `errors > 0` | 실패한 파일 식별 → 백업에서 복원 후 수동 패치 재시도 |
| `python3: command not found` | Python3 미설치 — `xcode-select --install` 또는 Homebrew |
| `codesign: ... not allowed` | macOS 정책 변경. 수동 `codesign -s - --force <bin>` 시도 |

---

## 증상 5 — 자동 업데이트 후 며칠 동안 영문 verb

LaunchAgent throttle은 10초지만 시스템 절전·로그아웃 등으로 FSEvents 자체가 누락될 수 있다.

```bash
# 강제 스캔
~/.claude/scripts/auto-patch-claude.sh

# 로그에서 결과 확인
tail ~/.claude/logs/spinner-patch.log
```

이 작업을 cron 또는 별도 LaunchAgent에 일일 1회 등록해도 좋다(현재 배포본엔 미포함).

---

## 증상 6 — `install.sh` 가 실패한다

### 흔한 원인

| 메시지 | 해결 |
|---|---|
| `claude 명령어를 PATH에서 찾을 수 없습니다` | Claude Code 먼저 설치 (`https://docs.claude.com/en/docs/claude-code/install`) |
| `python3 가 필요합니다` | `xcode-select --install` 또는 `brew install python3` |
| `LaunchAgent 로드 실패` | `launchctl load -w ~/Library/LaunchAgents/dev.claude-spinner-patch.plist` 수동 실행, 또는 로그아웃 후 재로그인 |

---

## 증상 7 — 한국어 매핑이 마음에 안 든다

### 매핑 수정 절차

1. `src/patch-spinner-verbs.py` 의 `KO_LABEL_POOLS` dict 수정 (해당 byte 길이만)
2. **byte 불변식 유지**: 한글 1자 = 3 byte, 부족분은 trailing space (한 풀 내 모든 항목 같은 byte 수)
3. 매핑 검증:

```bash
python3 -c "
import sys; sys.path.insert(0, '$HOME/.claude/scripts')
from importlib import import_module
m = import_module('patch-spinner-verbs')
m.validate_map()
print(f'OK — {len(m.VERB_MAP)}개 매핑 byte 길이 일치')
"
```

4. 깨끗한 백업으로 바이너리 복구 후 재패치 (이미 한국어 바이너리는 영문 패턴이 없으니 재패치 안 됨):

```bash
ls -1t ~/.local/share/claude/versions/2.1.170.bak.* | tail -1   # 가장 오래된 = 깨끗한 원본
cp -p ~/.local/share/claude/versions/2.1.170.bak.<oldest> ~/.local/share/claude/versions/2.1.170
~/.claude/scripts/patch-spinner-verbs.sh ~/.local/share/claude/versions/2.1.170
```

---

## 증상 8 — 다른 머신에 옮기고 싶다

```bash
# 1. 새 머신에 repo clone
git clone <this-repo>
cd <repo>/docs/spinner

# 2. 그 머신의 ${HOME}·HOMEBREW_PREFIX 로 install.sh 가 자동 치환
./install.sh
```

`templates/LaunchAgent.plist.template` 의 `{{HOME}}`·`{{HOMEBREW_PREFIX}}` 가 install.sh 안에서 해당 머신 값으로 sed 치환된다. `src/dev.codevillain.claude-spinner-patch.plist` (codevillain 하드코딩본) 은 원본 보존용이므로 새 머신에서 직접 쓰지 말 것.

---

## 완전 롤백

```bash
./uninstall.sh --restore-bin
```

이 명령 하나로 LaunchAgent · settings.json hook · 스크립트 · 바이너리 (가장 오래된 .bak으로) 모두 원상 복귀.
