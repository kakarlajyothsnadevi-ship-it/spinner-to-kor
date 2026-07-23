"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { badges, courses, getCourse, getTutor, homeworks, quizzes } from "@/lib/data";
import { Badge, Card, CardBody, LinkButton, Progress, SectionHeading, StatTile } from "@/components/ui";
import { CourseCard } from "@/components/course-card";
import { IconFlame } from "@/components/icons";
import { relativeDue } from "@/lib/utils";

export default function DashboardPage() {
  const { user, enrollments, homeworks: hw } = useStore();
  if (!user) return null;

  const pendingHw = hw.filter((h) => h.status !== "reviewed");
  const active = enrollments.filter((e) => e.progress < 100);
  const recommended = courses.filter((c) => !enrollments.some((e) => e.courseId === c.id)).slice(0, 3);
  const earnedBadges = badges.filter((b) => b.earned);
  const continueCourse = active[0] ? getCourse(active[0].courseId) : undefined;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-surface p-6 shadow-card sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-semibold text-fg">{greeting}, {user.name} 👋</h1>
          <p className="mt-1 text-muted">
            {active.length > 0
              ? `You're ${active.length} course${active.length > 1 ? "s" : ""} into your journey. Keep the momentum going!`
              : "Ready to pick up a new skill today?"}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-warning/15 px-4 py-3 text-warning">
          <IconFlame />
          <div>
            <div className="text-xl font-semibold leading-none">{user.streak} days</div>
            <div className="text-xs">learning streak</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile emoji="⭐" label="Points" value={user.points} hint={`Level ${user.level}`} />
        <StatTile emoji="📚" label="Active courses" value={active.length} />
        <StatTile emoji="📝" label="Pending homework" value={pendingHw.length} />
        <StatTile emoji="🏅" label="Badges" value={earnedBadges.length} hint={`of ${badges.length}`} />
      </div>

      {/* Continue learning */}
      {continueCourse && active[0] && (
        <section>
          <SectionHeading title="Continue learning" subtitle="Right where you left off" />
          <Card>
            <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-primary/10 text-3xl" aria-hidden>
                {continueCourse.image}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-fg">{continueCourse.name}</h3>
                  <Badge tone="neutral">with {getTutor(continueCourse.tutorId)?.name}</Badge>
                </div>
                <Progress value={active[0].progress} className="mt-2" label="Course progress" />
              </div>
              <LinkButton href={`/classroom/${continueCourse.id}`} className="shrink-0">Resume class</LinkButton>
            </CardBody>
          </Card>
        </section>
      )}

      {/* Two column: upcoming + homework */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <SectionHeading title="Upcoming lessons" action={<Link href="/classes" className="text-sm text-primary hover:underline">All classes</Link>} />
          <div className="space-y-3">
            {active.length === 0 && (
              <Card><CardBody className="text-sm text-muted">No active lessons yet. Explore a skill to begin.</CardBody></Card>
            )}
            {active.map((e) => {
              const course = getCourse(e.courseId);
              if (!course) return null;
              const nextLesson = course.lessons.find((l) => !e.completedLessonIds.includes(l.id)) ?? course.lessons[0];
              return (
                <Card key={e.courseId}>
                  <CardBody className="flex items-center gap-3">
                    <span className="text-2xl" aria-hidden>{course.image}</span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium text-fg">{nextLesson.title}</div>
                      <div className="text-xs text-muted">{course.name} · {nextLesson.durationMin} min</div>
                    </div>
                    <LinkButton href={`/classroom/${course.id}`} variant="outline" size="sm">Start</LinkButton>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </section>

        <section>
          <SectionHeading title="Homework & quizzes" action={<Link href="/homework" className="text-sm text-primary hover:underline">View all</Link>} />
          <div className="space-y-3">
            {pendingHw.map((h) => {
              const course = getCourse(h.courseId);
              return (
                <Card key={h.id}>
                  <CardBody className="flex items-center gap-3">
                    <span className="text-2xl" aria-hidden>📝</span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium text-fg">{h.title}</div>
                      <div className="text-xs text-muted">{course?.name} · {relativeDue(h.dueInDays)}</div>
                    </div>
                    <LinkButton href="/homework" variant="outline" size="sm">Open</LinkButton>
                  </CardBody>
                </Card>
              );
            })}
            <Card>
              <CardBody className="flex items-center gap-3">
                <span className="text-2xl" aria-hidden>🧠</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium text-fg">{quizzes.length} quizzes ready</div>
                  <div className="text-xs text-muted">Check your knowledge after each lesson</div>
                </div>
                <LinkButton href="/quizzes" variant="outline" size="sm">Take a quiz</LinkButton>
              </CardBody>
            </Card>
          </div>
        </section>
      </div>

      {/* Recommended */}
      <section>
        <SectionHeading title="Recommended for you" subtitle="Based on your goals and level" action={<Link href="/explore" className="text-sm text-primary hover:underline">Explore all</Link>} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommended.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </section>

      {/* Weekly summary */}
      <section>
        <SectionHeading title="This week" />
        <Card>
          <CardBody className="grid gap-4 sm:grid-cols-3">
            <div>
              <div className="text-sm text-muted">Lessons completed</div>
              <div className="text-2xl font-semibold text-fg">{enrollments.reduce((s, e) => s + e.completedLessonIds.length, 0)}</div>
            </div>
            <div>
              <div className="text-sm text-muted">Minutes learning</div>
              <div className="text-2xl font-semibold text-fg">{enrollments.reduce((s, e) => s + e.completedLessonIds.length, 0) * 14}</div>
            </div>
            <div>
              <div className="text-sm text-muted">Badges earned</div>
              <div className="flex gap-1 pt-1 text-xl">{earnedBadges.map((b) => <span key={b.id} aria-hidden>{b.emoji}</span>)}</div>
            </div>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
