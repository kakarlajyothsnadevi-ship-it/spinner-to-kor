"use client";

import { useState } from "react";
import { categories, courses, tutors } from "@/lib/data";
import { Badge, Button, Card, CardBody, StatTile } from "@/components/ui";
import { cn } from "@/lib/utils";

const tabs = ["Overview", "Courses", "Tutors", "Learners", "Moderation"] as const;
type Tab = (typeof tabs)[number];

const learners = [
  { name: "Aanya", plan: "Free", courses: 2, active: "Today", flagged: false },
  { name: "Rohan", plan: "Free", courses: 4, active: "Yesterday", flagged: false },
  { name: "Meera", plan: "Free", courses: 1, active: "3 days ago", flagged: false },
  { name: "Dev", plan: "Free", courses: 6, active: "Today", flagged: true },
];

const flagged = [
  { id: "f1", type: "Uploaded image", course: "Nail Art for Beginners", reason: "Auto-flag: possible skin injury", status: "Needs review" },
  { id: "f2", type: "Chat message", course: "Everyday Makeup", reason: "Reported by learner", status: "Needs review" },
];

export default function AdminDashboardPage() {
  const [tab, setTab] = useState<Tab>("Overview");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-fg">Admin Dashboard</h1>
        <p className="mt-1 text-muted">Manage skills, courses, tutors, learners, and safety.</p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn("border-b-2 px-3 py-2 text-sm font-medium transition-colors", tab === t ? "border-primary text-primary" : "border-transparent text-muted hover:text-fg")}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatTile emoji="👩‍🎓" label="Learners" value="4,820" hint="+124 this week" />
            <StatTile emoji="📚" label="Courses" value={courses.length + 5} />
            <StatTile emoji="✅" label="Completion rate" value="72%" />
            <StatTile emoji="🚩" label="Flagged items" value={flagged.length} hint="Needs review" />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardBody>
                <h3 className="font-semibold text-fg">Course completion</h3>
                <div className="mt-3 space-y-3">
                  {courses.map((c, i) => {
                    const rate = [78, 64, 81][i] ?? 70;
                    return (
                      <div key={c.id}>
                        <div className="mb-1 flex justify-between text-sm"><span className="text-fg">{c.name}</span><span className="text-muted">{rate}%</span></div>
                        <div className="h-2 rounded-full bg-surface-2"><div className="h-full rounded-full bg-primary" style={{ width: `${rate}%` }} /></div>
                      </div>
                    );
                  })}
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <h3 className="font-semibold text-fg">AI tutor performance</h3>
                <div className="mt-3 space-y-2">
                  {tutors.map((t, i) => (
                    <div key={t.id} className="flex items-center justify-between rounded-xl bg-surface-2 p-3">
                      <div className="flex items-center gap-2">
                        <span className="grid h-8 w-8 place-items-center rounded-full text-white" style={{ backgroundColor: `hsl(${t.color})` }} aria-hidden>{t.emoji}</span>
                        <span className="text-sm font-medium text-fg">{t.name}</span>
                      </div>
                      <span className="text-sm text-muted">★ {[4.8, 4.7, 4.9][i]} · {[1240, 980, 2100][i]} ratings</span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      )}

      {tab === "Courses" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-fg">Skill categories & courses</h3>
            <Button size="sm">+ Add course</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <span key={c.id} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm text-fg"><span aria-hidden>{c.emoji}</span>{c.name}</span>
            ))}
            <button className="rounded-full border border-dashed border-border px-3 py-1.5 text-sm text-muted hover:text-fg">+ Add category</button>
          </div>
          <Card>
            <div className="divide-y divide-border">
              {courses.map((c) => (
                <div key={c.id} className="flex items-center gap-3 p-4">
                  <span className="text-2xl" aria-hidden>{c.image}</span>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-fg">{c.name}</div>
                    <div className="text-xs text-muted">{c.lessonCount} lessons · <span className="capitalize">{c.difficulty}</span> · Free</div>
                  </div>
                  <Badge tone="success">Published</Badge>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === "Tutors" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-fg">AI tutors</h3>
            <Button size="sm">+ Create tutor</Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {tutors.map((t) => (
              <Card key={t.id}>
                <CardBody className="text-center">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-full text-2xl text-white" style={{ backgroundColor: `hsl(${t.color})` }} aria-hidden>{t.emoji}</span>
                  <div className="mt-2 font-medium text-fg">{t.name}</div>
                  <div className="text-xs capitalize text-muted">{t.personality.replace("-", " ")}</div>
                  <p className="mt-2 text-xs text-muted">{t.tagline}</p>
                  <Button variant="outline" size="sm" className="mt-3 w-full">Configure</Button>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab === "Learners" && (
        <Card>
          <div className="overflow-x-auto scroll-slim">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted">
                  <th className="p-3 font-medium">Learner</th>
                  <th className="p-3 font-medium">Plan</th>
                  <th className="p-3 font-medium">Courses</th>
                  <th className="p-3 font-medium">Last active</th>
                  <th className="p-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {learners.map((l) => (
                  <tr key={l.name} className="border-b border-border last:border-b-0">
                    <td className="p-3 font-medium text-fg">{l.name}</td>
                    <td className="p-3 text-muted">{l.plan}</td>
                    <td className="p-3 text-muted">{l.courses}</td>
                    <td className="p-3 text-muted">{l.active}</td>
                    <td className="p-3">{l.flagged ? <Badge tone="warning">Review</Badge> : <Badge tone="success">Active</Badge>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === "Moderation" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-fg">Flagged content</h3>
            <Button variant="outline" size="sm">Send notification to learners</Button>
          </div>
          {flagged.map((f) => (
            <Card key={f.id}>
              <CardBody className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge tone="danger">{f.type}</Badge>
                    <span className="text-sm font-medium text-fg">{f.course}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{f.reason}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Dismiss</Button>
                  <Button variant="danger" size="sm">Remove content</Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
