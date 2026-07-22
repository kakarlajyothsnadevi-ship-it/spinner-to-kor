"use client";

import Link from "next/link";
import { cn, initials } from "@/lib/utils";
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

// --------------------------------------------------------------------------
// Button
// --------------------------------------------------------------------------
type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const buttonBase =
  "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-fg hover:bg-primary/90",
  secondary: "bg-surface-2 text-fg hover:bg-border/60",
  ghost: "text-fg hover:bg-surface-2",
  outline: "border border-border text-fg hover:bg-surface-2",
  danger: "bg-danger text-white hover:bg-danger/90",
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "text-sm px-3 py-1.5",
  md: "text-sm px-4 py-2.5",
  lg: "text-base px-6 py-3",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return (
    <button className={cn(buttonBase, buttonVariants[variant], buttonSizes[size], className)} {...props}>
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={cn(buttonBase, buttonVariants[variant], buttonSizes[size], className)}>
      {children}
    </Link>
  );
}

// --------------------------------------------------------------------------
// Card
// --------------------------------------------------------------------------
export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("rounded-2xl border border-border bg-surface shadow-card", className)}>{children}</div>
  );
}

export function CardBody({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("p-5", className)}>{children}</div>;
}

// --------------------------------------------------------------------------
// Badge / Pill
// --------------------------------------------------------------------------
type BadgeTone = "neutral" | "primary" | "accent" | "success" | "warning" | "danger";
const badgeTones: Record<BadgeTone, string> = {
  neutral: "bg-surface-2 text-muted",
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/10 text-accent",
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/10 text-danger",
};

export function Badge({ tone = "neutral", className, children }: { tone?: BadgeTone; className?: string; children: ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", badgeTones[tone], className)}>
      {children}
    </span>
  );
}

// --------------------------------------------------------------------------
// Progress bar
// --------------------------------------------------------------------------
export function Progress({ value, className, label }: { value: number; className?: string; label?: string }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={className}>
      {label && (
        <div className="mb-1 flex justify-between text-xs text-muted">
          <span>{label}</span>
          <span>{v}%</span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// Avatar
// --------------------------------------------------------------------------
export function Avatar({ name, color, size = 40, emoji }: { name: string; color?: string; size?: number; emoji?: string }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
      style={{ width: size, height: size, backgroundColor: color ? `hsl(${color})` : "hsl(var(--accent))", fontSize: size * 0.4 }}
      aria-hidden
    >
      {emoji ?? initials(name)}
    </span>
  );
}

// --------------------------------------------------------------------------
// Form fields
// --------------------------------------------------------------------------
export function Label({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-fg">
      {children}
    </label>
  );
}

const fieldBase =
  "w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none focus-visible:outline-none";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(fieldBase, props.className)} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(fieldBase, "min-h-[96px] resize-y", props.className)} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(fieldBase, "appearance-none pr-8", props.className)} />;
}

// --------------------------------------------------------------------------
// Section heading
// --------------------------------------------------------------------------
export function SectionHeading({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-lg font-semibold text-fg">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// --------------------------------------------------------------------------
// Empty state
// --------------------------------------------------------------------------
export function EmptyState({ emoji, title, description, action }: { emoji: string; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface/50 px-6 py-12 text-center">
      <div className="mb-3 text-4xl" aria-hidden>
        {emoji}
      </div>
      <h3 className="text-base font-semibold text-fg">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// --------------------------------------------------------------------------
// Safety note — used across makeup / nail / cooking / coding lessons.
// --------------------------------------------------------------------------
export function SafetyNote({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="rounded-xl border border-warning/40 bg-warning/10 p-4">
      <div className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-warning">
        <span aria-hidden>⚠️</span> Safety first
      </div>
      <ul className="space-y-1 text-sm text-fg/90">
        {items.map((s, i) => (
          <li key={i} className="flex gap-2">
            <span aria-hidden className="text-warning">•</span>
            <span>{s}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// --------------------------------------------------------------------------
// Stat tile
// --------------------------------------------------------------------------
export function StatTile({ label, value, hint, emoji }: { label: string; value: ReactNode; hint?: string; emoji?: string }) {
  return (
    <Card>
      <CardBody className="p-4">
        <div className="flex items-center gap-2 text-sm text-muted">
          {emoji && <span aria-hidden>{emoji}</span>}
          {label}
        </div>
        <div className="mt-1 text-2xl font-semibold text-fg">{value}</div>
        {hint && <div className="mt-0.5 text-xs text-muted">{hint}</div>}
      </CardBody>
    </Card>
  );
}

// --------------------------------------------------------------------------
// Spinner (loading)
// --------------------------------------------------------------------------
export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted" role="status">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-primary" />
      {label}…
    </div>
  );
}
