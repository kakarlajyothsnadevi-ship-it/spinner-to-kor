import Link from "next/link";
import type { Course } from "@/lib/types";
import { getCategory, getTutor } from "@/lib/data";
import { Badge } from "./ui";
import { cn } from "@/lib/utils";

type TeaserLike = Pick<
  Course,
  | "id"
  | "categoryId"
  | "name"
  | "image"
  | "tutorId"
  | "ageGroups"
  | "difficulty"
  | "lessonCount"
  | "estimatedHours"
  | "rating"
  | "ratingsCount"
  | "paid"
> & { price?: number; summary: string };

const ageLabel: Record<string, string> = { child: "Kids", teen: "Teens", adult: "Adults", senior: "Seniors" };

export function CourseCard({ course }: { course: TeaserLike }) {
  const category = getCategory(course.categoryId);
  const tutor = getTutor(course.tutorId);
  const accent = category?.color ?? "258 68% 58%";

  return (
    <Link
      href={`/explore/${course.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition-colors hover:border-accent/50"
    >
      <div
        className="flex h-28 items-center justify-center text-5xl"
        style={{ backgroundColor: `hsl(${accent} / 0.12)` }}
        aria-hidden
      >
        {course.image}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center gap-2">
          <Badge tone="neutral">{category?.name}</Badge>
          <Badge tone="success">Free</Badge>
        </div>
        <h3 className="font-semibold leading-snug text-fg">{course.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{course.summary}</p>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          <span className="capitalize">{course.difficulty}</span>
          <span aria-hidden>·</span>
          <span>{course.lessonCount} lessons</span>
          <span aria-hidden>·</span>
          <span>~{course.estimatedHours}h</span>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-2 text-xs text-muted">
            <span
              className="inline-grid h-6 w-6 place-items-center rounded-full text-white"
              style={{ backgroundColor: `hsl(${tutor?.color ?? accent})` }}
              aria-hidden
            >
              {tutor?.emoji}
            </span>
            {tutor?.name}
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span className="text-warning" aria-hidden>★</span>
            <span className="font-medium text-fg">{course.rating}</span>
            <span className="text-muted">({course.ratingsCount})</span>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {course.ageGroups.map((a) => (
            <span key={a} className={cn("rounded-full bg-surface-2 px-2 py-0.5 text-[11px] text-muted")}>
              {ageLabel[a]}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
