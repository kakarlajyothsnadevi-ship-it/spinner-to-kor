"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Logo, ThemeToggle } from "@/components/brand";
import { Button, Card, CardBody, Input, Label, Progress } from "@/components/ui";
import { categories } from "@/lib/data";
import { cn, ageGroupLabel, languageLabel, personalityLabel } from "@/lib/utils";
import type { AgeGroup, ExperienceLevel, Language, TutorPersonality } from "@/lib/types";

const experiences: { id: ExperienceLevel; label: string }[] = [
  { id: "beginner", label: "Complete beginner" },
  { id: "hobby", label: "Hobbyist" },
  { id: "intermediate", label: "Some experience" },
  { id: "advanced", label: "Advanced" },
  { id: "professional", label: "Professional" },
];

const goalOptions = ["Learn for fun", "Build confidence", "Start a hobby", "Improve a skill", "Career or business", "Teach others"];
const materialOptions = ["Basic supplies at home", "A computer / phone", "Professional tools", "Just getting started"];
const accessibilityOptions = ["Larger text", "High contrast", "Voice narration", "Extra time on steps", "None"];
const durations = [10, 15, 25, 40];

const STEPS = ["About you", "Skills", "Experience & goals", "Preferences", "Your AI tutor"];

export default function OnboardingPage() {
  const { user, updateUser, ready } = useStore();
  const router = useRouter();
  const [step, setStep] = useState(0);

  const [ageGroup, setAgeGroup] = useState<AgeGroup>("adult");
  const [age, setAge] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [experience, setExperience] = useState<ExperienceLevel>("beginner");
  const [goals, setGoals] = useState<string[]>([]);
  const [language, setLanguage] = useState<Language>("en");
  const [duration, setDuration] = useState(15);
  const [materials, setMaterials] = useState<string[]>([]);
  const [accessibility, setAccessibility] = useState<string[]>([]);
  const [personality, setPersonality] = useState<TutorPersonality>("friendly");

  useEffect(() => {
    if (ready && !user) router.replace("/signup");
  }, [ready, user, router]);

  function toggle(list: string[], set: (v: string[]) => void, value: string) {
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  function finish() {
    updateUser({
      ageGroup,
      age: age ? Number(age) : undefined,
      experience,
      goals,
      language,
      lessonDuration: duration,
      materials,
      accessibility: accessibility.filter((a) => a !== "None"),
      preferredPersonality: personality,
      onboarded: true,
    });
    router.push("/dashboard");
  }

  const canNext =
    (step === 0) ||
    (step === 1 && skills.length > 0) ||
    (step === 2) ||
    (step === 3) ||
    step === 4;

  return (
    <div className="min-h-screen bg-bg">
      <header className="mx-auto flex max-w-2xl items-center justify-between px-4 py-5 sm:px-6">
        <Logo />
        <ThemeToggle />
      </header>

      <div className="mx-auto max-w-2xl px-4 pb-16 sm:px-6">
        <Progress value={((step + 1) / STEPS.length) * 100} className="mb-2" />
        <p className="mb-6 text-sm text-muted">Step {step + 1} of {STEPS.length} · {STEPS[step]}</p>

        <Card>
          <CardBody className="p-6">
            {step === 0 && (
              <div className="space-y-5">
                <h1 className="font-display text-2xl font-semibold text-fg">Hi {user?.name}! Let's personalise your learning.</h1>
                <div>
                  <Label>Which age group fits you?</Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {(Object.keys(ageGroupLabel) as AgeGroup[]).map((g) => (
                      <ChoiceButton key={g} active={ageGroup === g} onClick={() => setAgeGroup(g)}>
                        {ageGroupLabel[g]}
                      </ChoiceButton>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="age">Exact age (optional)</Label>
                  <Input id="age" type="number" min={3} max={110} value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 15" className="max-w-[140px]" />
                  {ageGroup === "child" && (
                    <p className="mt-2 rounded-lg bg-accent/10 p-2 text-xs text-accent">
                      For children, lessons are shorter and simpler, activities are extra safe, and a parent can add controls later.
                    </p>
                  )}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <h1 className="font-display text-2xl font-semibold text-fg">What would you love to learn?</h1>
                <p className="text-sm text-muted">Pick one or more. You can always add skills later.</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {categories.map((c) => (
                    <ChoiceButton key={c.id} active={skills.includes(c.id)} onClick={() => toggle(skills, setSkills, c.id)}>
                      <span aria-hidden className="mr-1">{c.emoji}</span> {c.name}
                    </ChoiceButton>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <h1 className="font-display text-2xl font-semibold text-fg">Where are you starting from?</h1>
                <div>
                  <Label>Your experience level</Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {experiences.map((e) => (
                      <ChoiceButton key={e.id} active={experience === e.id} onClick={() => setExperience(e.id)}>
                        {e.label}
                      </ChoiceButton>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>What are your goals?</Label>
                  <div className="flex flex-wrap gap-2">
                    {goalOptions.map((g) => (
                      <ChoiceChip key={g} active={goals.includes(g)} onClick={() => toggle(goals, setGoals, g)}>{g}</ChoiceChip>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <h1 className="font-display text-2xl font-semibold text-fg">A few preferences</h1>
                <div>
                  <Label>Preferred language</Label>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {(Object.keys(languageLabel) as Language[]).map((l) => (
                      <ChoiceButton key={l} active={language === l} onClick={() => setLanguage(l)}>{languageLabel[l]}</ChoiceButton>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Preferred lesson length</Label>
                  <div className="flex flex-wrap gap-2">
                    {durations.map((d) => (
                      <ChoiceChip key={d} active={duration === d} onClick={() => setDuration(d)}>{d} min</ChoiceChip>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Materials you have</Label>
                  <div className="flex flex-wrap gap-2">
                    {materialOptions.map((m) => (
                      <ChoiceChip key={m} active={materials.includes(m)} onClick={() => toggle(materials, setMaterials, m)}>{m}</ChoiceChip>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Accessibility needs</Label>
                  <div className="flex flex-wrap gap-2">
                    {accessibilityOptions.map((a) => (
                      <ChoiceChip key={a} active={accessibility.includes(a)} onClick={() => toggle(accessibility, setAccessibility, a)}>{a}</ChoiceChip>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h1 className="font-display text-2xl font-semibold text-fg">Choose your AI tutor's style</h1>
                <p className="text-sm text-muted">This sets how your tutor speaks and encourages you. You can change it anytime.</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {(Object.keys(personalityLabel) as TutorPersonality[]).map((p) => (
                    <ChoiceButton key={p} active={personality === p} onClick={() => setPersonality(p)}>
                      {personalityLabel[p]}
                    </ChoiceButton>
                  ))}
                </div>
                <div className="rounded-xl bg-surface-2 p-4 text-sm text-muted">
                  We'll build a personalised path from your answers — starting with your first skill, at your pace, with safe activities for your age.
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center justify-between">
              <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
                Back
              </Button>
              {step < STEPS.length - 1 ? (
                <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext}>
                  Continue
                </Button>
              ) : (
                <Button onClick={finish}>Build my learning path</Button>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function ChoiceButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors",
        active ? "border-primary bg-primary/10 text-primary" : "border-border bg-surface text-fg hover:bg-surface-2",
      )}
    >
      {children}
    </button>
  );
}

function ChoiceChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
        active ? "border-primary bg-primary/10 text-primary" : "border-border bg-surface text-fg hover:bg-surface-2",
      )}
    >
      {children}
    </button>
  );
}
