#!/usr/bin/env python3
"""merge-hooks.py 단위 테스트 — 무간섭(in-place) 설치·업데이트·제거.

대상 요구사항·버그: FR-12/17, NFR-03, BUG-02/06
핵심 계약:
  1) 사용자가 직접 등록한 hook은 어떤 경우에도 파괴·변형하지 않는다.
  2) 기존 설치 사용자는 재설치·삭제 없이 새 버전 hook으로 in-place 갱신된다.
  3) 실패(깨진 JSON 등) 시 settings.json을 단 1바이트도 쓰지 않는다.
"""
import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MERGE = ROOT / "src" / "merge-hooks.py"
SNIPPET = ROOT / "snippets" / "settings-hooks.json"

USER_BASH_HOOK = {
    "matcher": "Bash",
    "hooks": [{"type": "command",
               "command": "/usr/local/bin/my-security-check.sh",
               "statusMessage": "보안 검사"}],
}
LEGACY_READ_HOOK = {  # 구버전(마커 없음) 설치본 형식
    "matcher": "Read",
    "hooks": [{"type": "command", "command": "true", "statusMessage": "파일 읽는 중"}],
}


class MergeHooksTest(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp(prefix="spinner-merge-"))
        self.addCleanup(lambda: __import__("shutil").rmtree(self.tmp, True))
        self.settings = self.tmp / "settings.json"
        with open(SNIPPET) as f:
            self.snippet = json.load(f)

    def run_cmd(self, action, settings=None):
        args = [sys.executable, str(MERGE), action,
                "--settings", str(settings or self.settings)]
        if action == "install":
            args += ["--snippet", str(SNIPPET)]
        return subprocess.run(args, capture_output=True, text=True)

    def write_settings(self, obj):
        self.settings.write_text(json.dumps(obj, ensure_ascii=False, indent=2))

    def read_settings(self):
        return json.loads(self.settings.read_text())

    def pretooluse(self):
        return self.read_settings().get("hooks", {}).get("PreToolUse", [])

    def our_entries(self, pre=None):
        pre = self.pretooluse() if pre is None else pre
        return [e for e in pre if isinstance(e, dict)
                and any("spinner-to-kor" in str(s.get("command", ""))
                        for s in e.get("hooks", []) if isinstance(s, dict))]

    # ── 설치 ──────────────────────────────────────────────

    def test_install_creates_settings_when_absent(self):
        r = self.run_cmd("install")
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertEqual(len(self.our_entries()), len(self.snippet["PreToolUse"]))

    def test_install_is_idempotent(self):
        self.run_cmd("install")
        first = self.pretooluse()
        r = self.run_cmd("install")
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertEqual(self.pretooluse(), first)

    def test_install_preserves_user_hook_with_same_matcher(self):
        """BUG-02: 동일 matcher 사용자 hook 파괴 금지 — 별도 entry로 공존."""
        self.write_settings({"hooks": {"PreToolUse": [USER_BASH_HOOK]}})
        r = self.run_cmd("install")
        self.assertEqual(r.returncode, 0, r.stderr)
        pre = self.pretooluse()
        self.assertIn(USER_BASH_HOOK, pre)  # 원형 그대로
        bash_ours = [e for e in self.our_entries(pre) if e.get("matcher") == "Bash"]
        self.assertEqual(len(bash_ours), 1)

    def test_install_preserves_unrelated_settings(self):
        self.write_settings({
            "model": "opus",
            "hooks": {"Stop": [{"hooks": [{"type": "command", "command": "say done"}]}]},
        })
        self.run_cmd("install")
        s = self.read_settings()
        self.assertEqual(s["model"], "opus")
        self.assertEqual(s["hooks"]["Stop"][0]["hooks"][0]["command"], "say done")

    def test_install_upgrades_legacy_entries_without_duplicates(self):
        """FR-17: 구버전(마커 없음) 설치 사용자 — 재설치 없이 in-place 갱신, 중복 0."""
        self.write_settings({"hooks": {"PreToolUse": [LEGACY_READ_HOOK]}})
        r = self.run_cmd("install")
        self.assertEqual(r.returncode, 0, r.stderr)
        read_entries = [e for e in self.pretooluse()
                        if isinstance(e, dict) and e.get("matcher") == "Read"]
        self.assertEqual(len(read_entries), 1)
        self.assertIn("spinner-to-kor", read_entries[0]["hooks"][0]["command"])

    def test_install_dedupes_multiple_stale_copies(self):
        """과거 중복 설치로 같은 우리 entry가 여럿 → 1개로 수렴."""
        self.write_settings({"hooks": {"PreToolUse": [LEGACY_READ_HOOK, LEGACY_READ_HOOK]}})
        self.run_cmd("install")
        read_entries = [e for e in self.pretooluse()
                        if isinstance(e, dict) and e.get("matcher") == "Read"]
        self.assertEqual(len(read_entries), 1)

    def test_install_preserves_non_dict_garbage(self):
        self.write_settings({"hooks": {"PreToolUse": ["oops-string", 42]}})
        r = self.run_cmd("install")
        self.assertEqual(r.returncode, 0, r.stderr)
        pre = self.pretooluse()
        self.assertIn("oops-string", pre)
        self.assertIn(42, pre)

    def test_install_aborts_on_invalid_json_without_writing(self):
        """실패 시 무변경 — 깨진 설정을 더 깨뜨리지 않는다."""
        self.settings.write_text("{broken json!!")
        r = self.run_cmd("install")
        self.assertNotEqual(r.returncode, 0)
        self.assertEqual(self.settings.read_text(), "{broken json!!")

    def test_install_aborts_when_pretooluse_not_a_list(self):
        self.write_settings({"hooks": {"PreToolUse": {"weird": True}}})
        before = self.settings.read_text()
        r = self.run_cmd("install")
        self.assertNotEqual(r.returncode, 0)
        self.assertEqual(self.settings.read_text(), before)

    # ── 제거 ──────────────────────────────────────────────

    def test_remove_deletes_only_ours(self):
        self.write_settings({"hooks": {"PreToolUse": [USER_BASH_HOOK]}})
        self.run_cmd("install")
        r = self.run_cmd("remove")
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertEqual(self.our_entries(), [])
        self.assertIn(USER_BASH_HOOK, self.pretooluse())

    def test_remove_handles_legacy_entries(self):
        """BUG-06: 마커 없는 구버전 설치본도 제거 가능 (라벨 폴백)."""
        self.write_settings({"hooks": {"PreToolUse": [LEGACY_READ_HOOK, USER_BASH_HOOK]}})
        r = self.run_cmd("remove")
        self.assertEqual(r.returncode, 0, r.stderr)
        pre = self.pretooluse()
        self.assertNotIn(LEGACY_READ_HOOK, pre)
        self.assertIn(USER_BASH_HOOK, pre)

    def test_remove_strips_our_subhook_from_mixed_entry(self):
        """사용자가 우리 entry에 자기 sub-hook을 추가한 경우 — 사용자 것만 남긴다."""
        mixed = {
            "matcher": "Read",
            "hooks": [
                {"type": "command", "command": "true # spinner-to-kor",
                 "statusMessage": "파일 읽는 중"},
                {"type": "command", "command": "echo user-extra"},
            ],
        }
        self.write_settings({"hooks": {"PreToolUse": [mixed]}})
        self.run_cmd("remove")
        pre = self.pretooluse()
        self.assertEqual(len(pre), 1)
        self.assertEqual(pre[0]["hooks"], [{"type": "command", "command": "echo user-extra"}])

    def test_remove_on_clean_settings_is_noop(self):
        self.write_settings({"model": "opus"})
        r = self.run_cmd("remove")
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertEqual(self.read_settings(), {"model": "opus"})

    def test_install_then_remove_roundtrip_restores_original(self):
        """왕복 후 사용자 설정 원형 복원 (빈 컨테이너 정리 포함)."""
        original = {"model": "opus", "hooks": {"PreToolUse": [USER_BASH_HOOK]}}
        self.write_settings(original)
        self.run_cmd("install")
        self.run_cmd("remove")
        self.assertEqual(self.read_settings(), original)


if __name__ == "__main__":
    unittest.main()
