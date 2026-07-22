"use client";

import { useState } from "react";
import { courses, getCourse, homeworks } from "@/lib/data";
import { Badge, Button, Card, CardBody, Progress, SectionHeading, StatTile } from "@/components/ui";

// Basic parent dashboard for a linked child account (Aanya).
const child = { name: "Aanya", age: 15, streak: 4, points: 320, weeklyMinutes: 165 };

export default function ParentDashboardPage() {
  const [controls, setControls] = useState({ camera: true, microphone: true, timeLimit: 45 });
  const [approved, setApproved] = useState<Record<string, boolean>>({ "course-nail-101": true, "course-coding-101": true });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-fg">Parent Dashboard</h1>
        <p className="mt-1 text-muted">Overseeing <span className="font-medium text-fg">{child.name}</span>'s learning ({child.age} years).</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile emoji="🔥" label="Streak" value={`${child.streak} days`} />
        <StatTile emoji="⭐" label="Points" value={child.points} />
        <StatTile emoji="⏱️" label="This week" value={`${child.weeklyMinutes} min`} />
        <StatTile emoji="📚" label="Active courses" value={2} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Progress */}
        <section>
          <SectionHeading title="Progress" />
          <div className="space-y-3">
            {["course-nail-101", "course-coding-101"].map((id) => {
              const course = getCourse(id);
              if (!course) return null;
              const progress = id === "course-nail-101" ? 66 : 33;
              return (
                <Card key={id}>
                  <CardBody className="flex items-center gap-3">
                    <span className="text-2xl" aria-hidden>{course.image}</span>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-fg">{course.name}</div>
                      <Progress value={progress} className="mt-1.5" />
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Controls */}
        <section>
          <SectionHeading title="Safety controls" />
          <Card>
            <CardBody className="space-y-3">
              <ControlToggle label="Camera access" on={controls.camera} onToggle={() => setControls((c) => ({ ...c, camera: !c.camera }))} />
              <ControlToggle label="Microphone access" on={controls.microphone} onToggle={() => setControls((c) => ({ ...c, microphone: !c.microphone }))} />
              <div className="flex items-center justify-between">
                <span className="text-sm text-fg">Daily lesson-time limit</span>
                <div className="flex items-center gap-2">
                  {[30, 45, 60].map((m) => (
                    <button key={m} onClick={() => setControls((c) => ({ ...c, timeLimit: m }))} className={`rounded-lg border px-2.5 py-1 text-sm ${controls.timeLimit === m ? "border-primary bg-primary/10 text-primary" : "border-border text-fg"}`}>{m}m</button>
                  ))}
                </div>
              </div>
              <div className="rounded-xl bg-surface-2 p-3 text-xs text-muted">Content is restricted to age-appropriate, safety-reviewed courses for under-18 accounts.</div>
            </CardBody>
          </Card>
        </section>
      </div>

      {/* Course approvals */}
      <section>
        <SectionHeading title="Course approvals" subtitle="Approve which courses your child can take" />
        <div className="grid gap-3 sm:grid-cols-3">
          {courses.map((c) => (
            <Card key={c.id}>
              <CardBody className="flex items-center gap-3">
                <span className="text-2xl" aria-hidden>{c.image}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-fg">{c.name}</div>
                  <div className="text-xs text-muted capitalize">{c.difficulty}</div>
                </div>
                <Button
                  size="sm"
                  variant={approved[c.id] ? "outline" : "primary"}
                  onClick={() => setApproved((a) => ({ ...a, [c.id]: !a[c.id] }))}
                >
                  {approved[c.id] ? "Approved" : "Approve"}
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* Homework review + weekly report */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <SectionHeading title="Homework & feedback" />
          <div className="space-y-3">
            {homeworks.map((h) => {
              const course = getCourse(h.courseId);
              return (
                <Card key={h.id}>
                  <CardBody className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-fg">{h.title}</div>
                      <div className="text-xs text-muted">{course?.name}</div>
                    </div>
                    <Badge tone={h.status === "reviewed" ? "success" : "warning"}>{h.status === "reviewed" ? `Reviewed · ${h.feedback?.score}/100` : "Pending"}</Badge>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </section>
        <section>
          <SectionHeading title="Weekly report" />
          <Card>
            <CardBody className="space-y-2 text-sm">
              <p className="text-fg">📈 {child.name} learned <span className="font-medium">{child.weeklyMinutes} minutes</span> across 5 days this week.</p>
              <p className="text-muted">Strongest area: Nail Art (66% complete). Newest skill: Coding.</p>
              <p className="text-muted">Homework score average: 88/100. No safety flags this week.</p>
              <Button variant="outline" size="sm" className="mt-2">Email me weekly reports</Button>
            </CardBody>
          </Card>
        </section>
      </div>
    </div>
  );
}

function ControlToggle({ label, on, onToggle }: { label: string; on: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-fg">{label}</span>
      <button onClick={onToggle} className={`relative h-6 w-11 rounded-full transition-colors ${on ? "bg-primary" : "bg-border"}`} aria-pressed={on} aria-label={label}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${on ? "left-0.5 translate-x-5" : "left-0.5"}`} />
      </button>
    </div>
  );
}
