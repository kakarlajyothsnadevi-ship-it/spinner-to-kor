"use client";

import { useStore } from "@/lib/store";
import { badges, getCourse } from "@/lib/data";
import { Badge, Card, CardBody, Progress, SectionHeading, StatTile } from "@/components/ui";

const weekly = [
  { day: "Mon", mins: 20 },
  { day: "Tue", mins: 35 },
  { day: "Wed", mins: 0 },
  { day: "Thu", mins: 25 },
  { day: "Fri", mins: 40 },
  { day: "Sat", mins: 15 },
  { day: "Sun", mins: 30 },
];

export default function ProgressPage() {
  const { user, enrollments } = useStore();
  if (!user) return null;
  const maxMins = Math.max(...weekly.map((w) => w.mins), 1);
  const totalLessons = enrollments.reduce((s, e) => s + e.completedLessonIds.length, 0);
  const nextLevelAt = user.level * 200;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-fg">Your progress</h1>
        <p className="mt-1 text-muted">Track your streak, skills, and milestones.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile emoji="🔥" label="Streak" value={`${user.streak} days`} />
        <StatTile emoji="⭐" label="Points" value={user.points} hint={`Level ${user.level}`} />
        <StatTile emoji="✅" label="Lessons done" value={totalLessons} />
        <StatTile emoji="🏅" label="Badges" value={badges.filter((b) => b.earned).length} hint={`of ${badges.length}`} />
      </div>

      {/* Level progress */}
      <Card>
        <CardBody>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-semibold text-fg">Level {user.level}</h2>
            <span className="text-sm text-muted">{user.points} / {nextLevelAt} pts to level {user.level + 1}</span>
          </div>
          <Progress value={(user.points / nextLevelAt) * 100} />
        </CardBody>
      </Card>

      {/* Weekly summary */}
      <section>
        <SectionHeading title="This week's learning" subtitle="Minutes spent per day" />
        <Card>
          <CardBody>
            <div className="flex items-end justify-between gap-2" style={{ height: 160 }}>
              {weekly.map((w) => (
                <div key={w.day} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-t-lg bg-primary/80"
                      style={{ height: `${(w.mins / maxMins) * 100}%`, minHeight: w.mins ? 4 : 0 }}
                      title={`${w.mins} min`}
                    />
                  </div>
                  <span className="text-xs text-muted">{w.day}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted">Total this week: <span className="font-medium text-fg">{weekly.reduce((s, w) => s + w.mins, 0)} minutes</span> across {weekly.filter((w) => w.mins).length} days.</p>
          </CardBody>
        </Card>
      </section>

      {/* Skills progress */}
      <section>
        <SectionHeading title="Skills in progress" />
        <div className="space-y-3">
          {enrollments.map((e) => {
            const course = getCourse(e.courseId);
            if (!course) return null;
            return (
              <Card key={e.courseId}>
                <CardBody className="flex items-center gap-3">
                  <span className="text-2xl" aria-hidden>{course.image}</span>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-fg">{course.name}</div>
                    <Progress value={e.progress} className="mt-1.5" />
                  </div>
                  <span className="text-sm font-semibold text-fg">{e.progress}%</span>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Badges */}
      <section>
        <SectionHeading title="Badges" subtitle="Earn these as you learn" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {badges.map((b) => (
            <Card key={b.id} className={b.earned ? "" : "opacity-50"}>
              <CardBody className="p-4 text-center">
                <div className="text-3xl" aria-hidden>{b.emoji}</div>
                <div className="mt-1 text-sm font-medium text-fg">{b.name}</div>
                <div className="mt-0.5 text-xs text-muted">{b.description}</div>
                {b.earned && <Badge tone="success" className="mt-2">Earned</Badge>}
              </CardBody>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
