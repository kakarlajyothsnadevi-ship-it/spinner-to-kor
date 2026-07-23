"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { courses, getCourse } from "@/lib/data";
import { Badge, Button, Card, CardBody, Progress, SectionHeading } from "@/components/ui";
import { IconCheck } from "@/components/icons";

// Project Mode: each course's final project, broken into manageable steps by the AI.
const projectSteps: Record<string, string[]> = {
  "course-makeup-101": ["Prep and moisturise your skin", "Apply an even base", "Add blush and mascara", "Take before/after photos", "Submit for tutor review"],
  "course-nail-101": ["Shape nails and apply base coat", "Two thin colour coats", "Add the polka-dot pattern", "Seal with top coat", "Photograph both hands and submit"],
  "course-coding-101": ["Create the HTML file", "Add heading, photo caption, and bio", "Add a CSS style block", "Style colours and layout", "Submit your code or link"],
};

export default function ProjectsPage() {
  const { enrollments } = useStore();
  const active = enrollments.length ? enrollments : [{ courseId: "course-nail-101", progress: 0, completedLessonIds: [] }];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-fg">My Projects</h1>
        <p className="mt-1 text-muted">Every project is broken into small, manageable steps. Check them off as you go.</p>
      </div>

      <SectionHeading title="Your current projects" />
      <div className="grid gap-4 lg:grid-cols-2">
        {active.map((e) => {
          const course = getCourse(e.courseId);
          if (!course) return null;
          return <ProjectCard key={e.courseId} courseId={course.id} title={course.finalProject} image={course.image} steps={projectSteps[course.id] ?? []} />;
        })}
      </div>

      <SectionHeading title="Starter project ideas" subtitle="Pick one and your tutor will scaffold the steps" />
      <div className="grid gap-4 sm:grid-cols-3">
        {courses.map((c) => (
          <Card key={c.id}>
            <CardBody>
              <div className="text-2xl" aria-hidden>{c.image}</div>
              <h3 className="mt-2 font-semibold text-fg">{c.finalProject.split(" and ")[0].replace(/\.$/, "")}</h3>
              <p className="mt-1 text-xs text-muted">{c.name}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ courseId, title, image, steps }: { courseId: string; title: string; image: string; steps: string[] }) {
  const [done, setDone] = useState<Set<number>>(new Set());
  const progress = steps.length ? Math.round((done.size / steps.length) * 100) : 0;

  return (
    <Card>
      <CardBody className="space-y-4">
        <div className="flex items-start gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent/10 text-2xl" aria-hidden>{image}</span>
          <div>
            <h3 className="font-semibold text-fg">{title}</h3>
            <Badge tone={progress === 100 ? "success" : "accent"} className="mt-1">{progress === 100 ? "Ready to submit" : `${progress}% complete`}</Badge>
          </div>
        </div>
        <Progress value={progress} />
        <ul className="space-y-2">
          {steps.map((s, i) => {
            const isDone = done.has(i);
            return (
              <li key={i}>
                <button
                  onClick={() => setDone((prev) => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; })}
                  className="flex w-full items-center gap-3 rounded-xl border border-border px-3 py-2 text-left text-sm transition-colors hover:bg-surface-2"
                >
                  <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${isDone ? "border-success bg-success text-white" : "border-border text-transparent"}`}>
                    <IconCheck width={12} height={12} />
                  </span>
                  <span className={isDone ? "text-muted line-through" : "text-fg"}>{s}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <Button variant={progress === 100 ? "primary" : "outline"} className="w-full" size="sm" disabled={progress !== 100}>
          {progress === 100 ? "Submit project for review" : "Complete all steps to submit"}
        </Button>
      </CardBody>
    </Card>
  );
}
