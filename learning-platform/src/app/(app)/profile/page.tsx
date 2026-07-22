"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Avatar } from "@/components/ui";
import { Badge, Button, Card, CardBody, Input, Label } from "@/components/ui";
import { ageGroupLabel, languageLabel, personalityLabel } from "@/lib/utils";
import { badges, certificates } from "@/lib/data";

export default function ProfilePage() {
  const { user, updateUser } = useStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [goalsText, setGoalsText] = useState(user?.goals.join(", ") ?? "");
  if (!user) return null;

  function save() {
    updateUser({ name: name.trim() || user!.name, goals: goalsText.split(",").map((g) => g.trim()).filter(Boolean) });
    setEditing(false);
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-fg">Profile</h1>

      <Card>
        <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar name={user.name} color={user.avatarColor} size={72} />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-fg">{user.name}</h2>
              <Badge tone="neutral" className="capitalize">{user.role}</Badge>
            </div>
            <p className="text-sm text-muted">{user.email}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge tone="primary">🔥 {user.streak}-day streak</Badge>
              <Badge tone="accent">⭐ {user.points} points</Badge>
              <Badge tone="neutral">Level {user.level}</Badge>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setEditing((e) => !e)}>{editing ? "Cancel" : "Edit profile"}</Button>
        </CardBody>
      </Card>

      {editing && (
        <Card>
          <CardBody className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="goals">Learning goals (comma separated)</Label>
              <Input id="goals" value={goalsText} onChange={(e) => setGoalsText(e.target.value)} />
            </div>
            <Button onClick={save}>Save changes</Button>
          </CardBody>
        </Card>
      )}

      {/* Learning profile */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardBody className="space-y-3">
            <h3 className="font-semibold text-fg">Learning profile</h3>
            <Field label="Age group" value={ageGroupLabel[user.ageGroup]} />
            <Field label="Experience" value={user.experience} capitalize />
            <Field label="Language" value={languageLabel[user.language]} />
            <Field label="Lesson length" value={`${user.lessonDuration} min`} />
            <Field label="Tutor style" value={personalityLabel[user.preferredPersonality]} />
          </CardBody>
        </Card>
        <Card>
          <CardBody className="space-y-3">
            <h3 className="font-semibold text-fg">Goals & materials</h3>
            <div>
              <div className="text-xs text-muted">Goals</div>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {user.goals.length ? user.goals.map((g) => <Badge key={g} tone="neutral">{g}</Badge>) : <span className="text-sm text-muted">None set</span>}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted">Materials</div>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {user.materials.length ? user.materials.map((m) => <Badge key={m} tone="neutral">{m}</Badge>) : <span className="text-sm text-muted">None set</span>}
              </div>
            </div>
            {user.accessibility.length > 0 && (
              <div>
                <div className="text-xs text-muted">Accessibility</div>
                <div className="mt-1 flex flex-wrap gap-1.5">{user.accessibility.map((a) => <Badge key={a} tone="accent">{a}</Badge>)}</div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardBody>
          <h3 className="font-semibold text-fg">Achievements</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {badges.filter((b) => b.earned).map((b) => (
              <span key={b.id} className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1.5 text-sm text-fg" title={b.description}>
                <span aria-hidden>{b.emoji}</span> {b.name}
              </span>
            ))}
            {certificates.map((c) => (
              <span key={c.id} className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5 text-sm text-accent">🎓 {c.courseName}</span>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function Field({ label, value, capitalize }: { label: string; value: string; capitalize?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-2 last:border-b-0 last:pb-0">
      <span className="text-sm text-muted">{label}</span>
      <span className={`text-sm font-medium text-fg ${capitalize ? "capitalize" : ""}`}>{value}</span>
    </div>
  );
}
