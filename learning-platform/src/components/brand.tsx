"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { IconMoon, IconSun } from "./icons";

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2", className)} aria-label="SkillBloom home">
      <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-primary-fg" aria-hidden>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3c1.5 2 4 3 4 6a4 4 0 0 1-8 0c0-1 .5-2 1-3" />
          <path d="M12 21c-4 0-7-2-7-6 3 0 5 1 7 4 2-3 4-4 7-4 0 4-3 6-7 6Z" />
        </svg>
      </span>
      <span className="font-display text-lg font-semibold tracking-tight text-fg">SkillBloom</span>
    </Link>
  );
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useStore();
  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "inline-grid h-9 w-9 place-items-center rounded-xl border border-border text-fg transition-colors hover:bg-surface-2",
        className,
      )}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? <IconSun width={18} height={18} /> : <IconMoon width={18} height={18} />}
    </button>
  );
}
