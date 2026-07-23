"use client";

import { useMemo, useState } from "react";
import { catalogTeasers, categories, courses } from "@/lib/data";
import { CourseCard } from "@/components/course-card";
import { EmptyState, SectionHeading } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { Difficulty } from "@/lib/types";

const allCourses = [...courses, ...catalogTeasers];
const difficulties: (Difficulty | "all")[] = ["all", "beginner", "intermediate", "advanced"];

export default function ExplorePage() {
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return allCourses.filter((c) => {
      if (category !== "all" && c.categoryId !== category) return false;
      if (difficulty !== "all" && c.difficulty !== difficulty) return false;
      if (query && !c.name.toLowerCase().includes(query.toLowerCase()) && !c.summary.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [category, difficulty, query]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-fg">Explore skills</h1>
        <p className="mt-1 text-muted">Browse courses by category, difficulty, and more.</p>
      </div>

      {/* Search */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search courses…"
        className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none"
        aria-label="Search courses"
      />

      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        <FilterChip active={category === "all"} onClick={() => setCategory("all")}>All skills</FilterChip>
        {categories.map((c) => (
          <FilterChip key={c.id} active={category === c.id} onClick={() => setCategory(c.id)}>
            <span aria-hidden className="mr-1">{c.emoji}</span>{c.name}
          </FilterChip>
        ))}
      </div>

      {/* Secondary filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-muted">Level</span>
        {difficulties.map((d) => (
          <FilterChip key={d} small active={difficulty === d} onClick={() => setDifficulty(d)}>
            <span className="capitalize">{d}</span>
          </FilterChip>
        ))}
        <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
          ✓ Every course is free
        </span>
      </div>

      <SectionHeading title={`${filtered.length} course${filtered.length === 1 ? "" : "s"}`} />

      {filtered.length === 0 ? (
        <EmptyState emoji="🔍" title="No courses match" description="Try clearing a filter or searching for something else." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({ active, small, onClick, children }: { active: boolean; small?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border font-medium transition-colors",
        small ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-sm",
        active ? "border-primary bg-primary/10 text-primary" : "border-border bg-surface text-fg hover:bg-surface-2",
      )}
    >
      {children}
    </button>
  );
}
