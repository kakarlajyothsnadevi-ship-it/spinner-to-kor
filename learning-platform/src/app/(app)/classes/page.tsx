"use client";

import { useStore } from "@/lib/store";
import { getCourse, getTutor } from "@/lib/data";
import { Badge, Card, CardBody, EmptyState, LinkButton, Progress } from "@/components/ui";

export default function ClassesPage() {
  const { enrollments } = useStore();

  if (enrollments.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-semibold text-fg">My Classes</h1>
        <EmptyState emoji="🎓" title="No classes yet" description="Enrol in a course to see it here." action={<LinkButton href="/explore">Explore skills</LinkButton>} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-fg">My Classes</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {enrollments.map((e) => {
          const course = getCourse(e.courseId);
          if (!course) return null;
          const tutor = getTutor(course.tutorId);
          const done = e.progress >= 100;
          return (
            <Card key={e.courseId}>
              <CardBody className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-primary/10 text-2xl" aria-hidden>{course.image}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-semibold text-fg">{course.name}</h3>
                      {done && <Badge tone="success">Completed</Badge>}
                    </div>
                    <p className="text-xs text-muted">with {tutor?.name} · {course.lessonCount} lessons</p>
                  </div>
                </div>
                <Progress value={e.progress} label="Progress" />
                <div className="flex gap-2">
                  <LinkButton href={`/classroom/${course.id}`} size="sm" className="flex-1">
                    {done ? "Review class" : e.progress > 0 ? "Resume" : "Start"}
                  </LinkButton>
                  <LinkButton href={`/explore/${course.id}`} variant="outline" size="sm">Details</LinkButton>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
