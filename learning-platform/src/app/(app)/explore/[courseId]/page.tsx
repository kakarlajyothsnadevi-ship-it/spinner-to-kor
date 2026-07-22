"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { catalogTeasers, getCategory, getCourse, getTutor } from "@/lib/data";
import { useStore } from "@/lib/store";
import { Badge, Button, Card, CardBody, LinkButton, SafetyNote } from "@/components/ui";
import { IconCheck } from "@/components/icons";

export default function CourseDetailsPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const { enrollments, enroll } = useStore();
  const course = getCourse(courseId);

  // Teaser (browse-only) course: show a lightweight "coming soon" details view.
  if (!course) {
    const teaser = catalogTeasers.find((t) => t.id === courseId);
    if (!teaser) return notFound();
    const cat = getCategory(teaser.categoryId);
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Link href="/explore" className="text-sm text-primary hover:underline">← Back to Explore</Link>
        <div className="rounded-2xl border border-border bg-surface p-8 text-center shadow-card">
          <div className="text-5xl" aria-hidden>{teaser.image}</div>
          <h1 className="mt-3 font-display text-2xl font-semibold text-fg">{teaser.name}</h1>
          <p className="mt-1 text-muted">{teaser.summary}</p>
          <Badge tone="accent" className="mt-4">{cat?.name} · Full course coming soon</Badge>
          <p className="mt-4 text-sm text-muted">This skill is in our catalogue. The three MVP courses (Makeup, Nail Art, Coding) are fully playable — try one from Explore.</p>
          <LinkButton href="/explore" className="mt-5" variant="outline">Browse playable courses</LinkButton>
        </div>
      </div>
    );
  }

  const category = getCategory(course.categoryId);
  const tutor = getTutor(course.tutorId);
  const enrolled = enrollments.some((e) => e.courseId === course.id);

  return (
    <div className="space-y-6">
      <Link href="/explore" className="text-sm text-primary hover:underline">← Back to Explore</Link>

      {/* Header */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-start gap-4">
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl text-4xl" style={{ backgroundColor: `hsl(${category?.color} / 0.12)` }} aria-hidden>
              {course.image}
            </div>
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge tone="neutral">{category?.name}</Badge>
                <Badge tone={course.paid ? "accent" : "success"}>{course.paid ? `₹${(course.price ?? 0) * 80}` : "Free"}</Badge>
                <Badge tone="neutral"><span className="capitalize">{course.difficulty}</span></Badge>
              </div>
              <h1 className="font-display text-3xl font-semibold text-fg">{course.name}</h1>
              <p className="mt-2 text-muted">{course.summary}</p>
            </div>
          </div>

          {/* Meta */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Meta label="Lessons" value={String(course.lessonCount)} />
            <Meta label="Duration" value={`~${course.estimatedHours}h`} />
            <Meta label="Rating" value={`★ ${course.rating}`} />
            <Meta label="Level" value={course.difficulty} capitalize />
          </div>

          {/* Outcomes */}
          <Card className="mt-6">
            <CardBody>
              <h2 className="font-semibold text-fg">What you'll be able to do</h2>
              <ul className="mt-3 space-y-2">
                {course.outcomes.map((o) => (
                  <li key={o} className="flex items-start gap-2 text-sm text-fg">
                    <span className="mt-0.5 text-success"><IconCheck width={18} height={18} /></span>
                    {o}
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          {/* Curriculum */}
          <div className="mt-6">
            <h2 className="mb-3 font-semibold text-fg">Course content</h2>
            <div className="space-y-3">
              {course.modules.map((m, mi) => (
                <Card key={m.id}>
                  <CardBody>
                    <div className="mb-2 text-sm font-semibold text-fg">Module {mi + 1}: {m.title}</div>
                    <ul className="divide-y divide-border">
                      {m.lessonIds.map((lid) => {
                        const lesson = course.lessons.find((l) => l.id === lid);
                        if (!lesson) return null;
                        return (
                          <li key={lid} className="flex items-center justify-between py-2.5">
                            <div className="flex items-center gap-2 text-sm text-fg">
                              <span aria-hidden>📖</span> {lesson.title}
                            </div>
                            <span className="text-xs text-muted">{lesson.durationMin} min</span>
                          </li>
                        );
                      })}
                    </ul>
                  </CardBody>
                </Card>
              ))}
              <Card>
                <CardBody className="flex items-center gap-2 text-sm">
                  <span aria-hidden>🏆</span>
                  <span className="font-medium text-fg">Final project:</span>
                  <span className="text-muted">{course.finalProject}</span>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardBody className="space-y-4">
              {enrolled ? (
                <LinkButton href={`/classroom/${course.id}`} className="w-full" size="lg">Continue class</LinkButton>
              ) : (
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => enroll(course.id)}
                >
                  {course.paid ? `Enrol · ₹${(course.price ?? 0) * 80}` : "Start course — free"}
                </Button>
              )}
              {enrolled && <p className="text-center text-xs text-success">✓ You're enrolled</p>}
              <LinkButton href={`/classroom/${course.id}`} variant="outline" className="w-full">Preview AI classroom</LinkButton>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h3 className="text-sm font-semibold text-fg">Your AI tutor</h3>
              <div className="mt-3 flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-full text-2xl text-white" style={{ backgroundColor: `hsl(${tutor?.color})` }} aria-hidden>
                  {tutor?.emoji}
                </span>
                <div>
                  <div className="font-medium text-fg">{tutor?.name}</div>
                  <div className="text-xs text-muted">{tutor?.tagline}</div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h3 className="text-sm font-semibold text-fg">Materials you'll need</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-muted">
                {course.materials.map((m) => (
                  <li key={m} className="flex gap-2"><span aria-hidden>•</span>{m}</li>
                ))}
              </ul>
            </CardBody>
          </Card>

          <SafetyNote items={course.lessons[0].safety.slice(0, 2)} />

          <Card>
            <CardBody>
              <h3 className="text-sm font-semibold text-fg">Recommended for</h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {course.ageGroups.map((a) => (
                  <Badge key={a} tone="neutral"><span className="capitalize">{a}s</span></Badge>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Meta({ label, value, capitalize }: { label: string; value: string; capitalize?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-3 text-center">
      <div className="text-xs text-muted">{label}</div>
      <div className={`mt-0.5 font-semibold text-fg ${capitalize ? "capitalize" : ""}`}>{value}</div>
    </div>
  );
}
