"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ComponentType, type SVGProps } from "react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Logo, ThemeToggle } from "./brand";
import { Avatar, Spinner } from "./ui";
import {
  IconAdmin,
  IconBell,
  IconCertificate,
  IconClasses,
  IconClose,
  IconExplore,
  IconFlame,
  IconHome,
  IconHomework,
  IconMenu,
  IconMessages,
  IconParent,
  IconProfile,
  IconProgress,
  IconProjects,
  IconQuiz,
  IconSettings,
  IconSubscription,
} from "./icons";
import type { Role } from "@/lib/types";

type NavItem = { href: string; label: string; icon: ComponentType<SVGProps<SVGSVGElement>>; roles: Role[] };

const NAV: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: IconHome, roles: ["learner"] },
  { href: "/explore", label: "Explore Skills", icon: IconExplore, roles: ["learner"] },
  { href: "/classes", label: "My Classes", icon: IconClasses, roles: ["learner"] },
  { href: "/practice", label: "Guided Practice", icon: IconProjects, roles: ["learner"] },
  { href: "/projects", label: "My Projects", icon: IconProjects, roles: ["learner"] },
  { href: "/homework", label: "Homework", icon: IconHomework, roles: ["learner"] },
  { href: "/quizzes", label: "Quizzes", icon: IconQuiz, roles: ["learner"] },
  { href: "/progress", label: "Progress", icon: IconProgress, roles: ["learner"] },
  { href: "/certificates", label: "Certificates", icon: IconCertificate, roles: ["learner"] },
  { href: "/messages", label: "Messages", icon: IconMessages, roles: ["learner"] },
  { href: "/parent", label: "Parent Dashboard", icon: IconParent, roles: ["parent"] },
  { href: "/admin", label: "Admin Dashboard", icon: IconAdmin, roles: ["admin"] },
];

const NAV_BOTTOM: NavItem[] = [
  { href: "/subscription", label: "Subscription", icon: IconSubscription, roles: ["learner", "parent"] },
  { href: "/profile", label: "Profile", icon: IconProfile, roles: ["learner", "parent", "admin"] },
  { href: "/settings", label: "Settings", icon: IconSettings, roles: ["learner", "parent", "admin"] },
];

function NavLink({ item, active, onClick }: { item: NavItem; active: boolean; onClick?: () => void }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
        active ? "bg-primary/10 text-primary" : "text-muted hover:bg-surface-2 hover:text-fg",
      )}
    >
      <Icon width={19} height={19} />
      {item.label}
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, ready } = useStore();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (!ready || !user) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Spinner label="Preparing your space" />
      </div>
    );
  }

  const role = user.role;
  const items = NAV.filter((n) => n.roles.includes(role));
  const bottom = NAV_BOTTOM.filter((n) => n.roles.includes(role));
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between px-4">
        <Logo href={role === "learner" ? "/dashboard" : role === "parent" ? "/parent" : "/admin"} />
        <button
          className="rounded-lg p-1.5 text-muted hover:bg-surface-2 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <IconClose />
        </button>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2 scroll-slim">
        {items.map((it) => (
          <NavLink key={it.href} item={it} active={isActive(it.href)} onClick={() => setMobileOpen(false)} />
        ))}
        <div className="my-3 border-t border-border" />
        {bottom.map((it) => (
          <NavLink key={it.href} item={it} active={isActive(it.href)} onClick={() => setMobileOpen(false)} />
        ))}
      </nav>
      <div className="border-t border-border p-3">
        <Link href="/profile" className="flex items-center gap-3 rounded-xl p-2 hover:bg-surface-2">
          <Avatar name={user.name} color={user.avatarColor} size={36} />
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-fg">{user.name}</div>
            <div className="truncate text-xs capitalize text-muted">{role}</div>
          </div>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-surface lg:block">{sidebar}</aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 border-r border-border bg-surface animate-fade-in">{sidebar}</aside>
        </div>
      )}

      <div className="lg:pl-64">
        <TopBar onMenu={() => setMobileOpen(true)} />
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

function TopBar({ onMenu }: { onMenu: () => void }) {
  const { user } = useStore();
  if (!user) return null;
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-bg/80 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button className="rounded-lg p-1.5 text-fg hover:bg-surface-2 lg:hidden" onClick={onMenu} aria-label="Open menu">
          <IconMenu />
        </button>
        <div className="lg:hidden">
          <Logo />
        </div>
      </div>
      <div className="flex items-center gap-2">
        {user.role === "learner" && (
          <span className="hidden items-center gap-1.5 rounded-full bg-warning/15 px-3 py-1.5 text-sm font-medium text-warning sm:inline-flex">
            <IconFlame width={16} height={16} /> {user.streak}-day streak
          </span>
        )}
        {user.role === "learner" && (
          <span className="hidden items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5 text-sm font-medium text-accent sm:inline-flex">
            ⭐ {user.points} pts
          </span>
        )}
        <button className="relative inline-grid h-9 w-9 place-items-center rounded-xl border border-border text-fg hover:bg-surface-2" aria-label="Notifications">
          <IconBell width={18} height={18} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
