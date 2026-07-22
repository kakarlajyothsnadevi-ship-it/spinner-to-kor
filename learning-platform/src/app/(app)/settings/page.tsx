"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Button, Card, CardBody, Label, Select, SectionHeading } from "@/components/ui";
import { languageLabel, personalityLabel } from "@/lib/utils";
import { isSpeechSupported, speak } from "@/lib/tts";
import type { Language, TutorPersonality } from "@/lib/types";
import { tutors } from "@/lib/data";

const teachingStyles = ["friendly", "calm", "professional", "energetic", "step-by-step", "strict-supportive"] as const;
const speeds = [0.7, 1, 1.3];
const encouragement = ["Gentle", "Balanced", "High energy"];

export default function SettingsPage() {
  const { user, updateUser, theme, toggleTheme, logout } = useStore();
  const router = useRouter();
  if (!user) return null;

  function logoutAndGo() {
    logout();
    router.push("/");
  }

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="font-display text-2xl font-semibold text-fg">Settings</h1>

      {/* Appearance */}
      <section>
        <SectionHeading title="Appearance" />
        <Card>
          <CardBody className="flex items-center justify-between">
            <div>
              <div className="font-medium text-fg">Theme</div>
              <div className="text-sm text-muted">Switch between light and dark mode.</div>
            </div>
            <Button variant="outline" onClick={toggleTheme}>{theme === "dark" ? "🌙 Dark" : "☀️ Light"}</Button>
          </CardBody>
        </Card>
      </section>

      {/* Language */}
      <section>
        <SectionHeading title="Language" subtitle="More languages coming soon" />
        <Card>
          <CardBody>
            <Label htmlFor="lang">App & lesson language</Label>
            <Select id="lang" value={user.language} onChange={(e) => updateUser({ language: e.target.value as Language })}>
              {(Object.keys(languageLabel) as Language[]).map((l) => (
                <option key={l} value={l}>{languageLabel[l]}</option>
              ))}
            </Select>
          </CardBody>
        </Card>
      </section>

      {/* AI tutor customisation */}
      {user.role === "learner" && (
        <section>
          <SectionHeading title="AI tutor" subtitle="Customise how your tutor looks, sounds, and teaches" />
          <Card>
            <CardBody className="space-y-4">
              <div>
                <Label>Tutor appearance</Label>
                <div className="flex gap-2">
                  {tutors.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => updateUser({ avatarColor: t.color })}
                      className={`grid h-12 w-12 place-items-center rounded-full text-xl text-white ring-2 ${user.avatarColor === t.color ? "ring-primary" : "ring-transparent"}`}
                      style={{ backgroundColor: `hsl(${t.color})` }}
                      aria-label={`Tutor look ${t.name}`}
                    >
                      {t.emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="style">Teaching style</Label>
                <Select id="style" value={user.preferredPersonality} onChange={(e) => updateUser({ preferredPersonality: e.target.value as TutorPersonality })}>
                  {teachingStyles.map((s) => (
                    <option key={s} value={s}>{personalityLabel[s]}</option>
                  ))}
                </Select>
              </div>

              <div>
                <Label>Lesson speed</Label>
                <div className="flex gap-2">
                  {speeds.map((s, i) => (
                    <span key={s} className="rounded-full border border-border px-3 py-1.5 text-sm text-fg">{["Slower", "Normal", "Faster"][i]}</span>
                  ))}
                </div>
              </div>

              <div>
                <Label>Encouragement level</Label>
                <div className="flex gap-2">
                  {encouragement.map((e) => (
                    <span key={e} className="rounded-full border border-border px-3 py-1.5 text-sm text-fg">{e}</span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-surface-2 p-3">
                <span className="text-sm text-fg">Voice output {isSpeechSupported() ? "" : "(unavailable in this browser)"}</span>
                <Button variant="outline" size="sm" disabled={!isSpeechSupported()} onClick={() => speak(`Hi ${user.name}, this is how your tutor will sound.`)}>
                  Test voice
                </Button>
              </div>
            </CardBody>
          </Card>
        </section>
      )}

      {/* Notifications */}
      <section>
        <SectionHeading title="Notifications" />
        <Card>
          <CardBody className="space-y-3">
            <Toggle label="Lesson reminders" defaultOn />
            <Toggle label="Homework due alerts" defaultOn />
            <Toggle label="Weekly progress summary" defaultOn />
            <Toggle label="New skill announcements" />
          </CardBody>
        </Card>
      </section>

      {/* Account */}
      <section>
        <SectionHeading title="Account" />
        <Card>
          <CardBody className="flex items-center justify-between">
            <div>
              <div className="font-medium text-fg">Sign out</div>
              <div className="text-sm text-muted">You can log back in anytime.</div>
            </div>
            <Button variant="danger" onClick={logoutAndGo}>Log out</Button>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}

function Toggle({ label, defaultOn }: { label: string; defaultOn?: boolean }) {
  return (
    <label className="flex cursor-pointer items-center justify-between">
      <span className="text-sm text-fg">{label}</span>
      <input type="checkbox" defaultChecked={defaultOn} className="peer sr-only" />
      <span className="relative h-6 w-11 rounded-full bg-border transition-colors peer-checked:bg-primary">
        <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
      </span>
    </label>
  );
}
