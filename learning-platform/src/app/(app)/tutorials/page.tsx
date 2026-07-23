"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { categories, getCategory, tutorials } from "@/lib/data";
import { Badge, Button, Card, CardBody, EmptyState } from "@/components/ui";
import { IconClose, IconPlay, IconVolume } from "@/components/icons";
import { isSpeechSupported, primeVoices, speak, stopSpeaking } from "@/lib/tts";
import { cn } from "@/lib/utils";
import type { Tutorial } from "@/lib/types";

const durations = [
  { id: "all", label: "Any length" },
  { id: "short", label: "≤ 3 min" },
  { id: "long", label: "4 min +" },
] as const;

export default function TutorialsPage() {
  const [category, setCategory] = useState("all");
  const [duration, setDuration] = useState<(typeof durations)[number]["id"]>("all");
  const [active, setActive] = useState<Tutorial | null>(null);

  const filtered = useMemo(
    () =>
      tutorials.filter((t) => {
        if (category !== "all" && t.categoryId !== category) return false;
        if (duration === "short" && t.durationMin > 3) return false;
        if (duration === "long" && t.durationMin < 4) return false;
        return true;
      }),
    [category, duration],
  );

  // Only show categories that actually have tutorials.
  const cats = categories.filter((c) => tutorials.some((t) => t.categoryId === c.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-fg">Tutorial Library</h1>
        <p className="mt-1 text-muted">Short, step-by-step tutorials your tutor walks you through — with voice narration.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <FilterChip active={category === "all"} onClick={() => setCategory("all")}>All skills</FilterChip>
        {cats.map((c) => (
          <FilterChip key={c.id} active={category === c.id} onClick={() => setCategory(c.id)}>
            <span aria-hidden className="mr-1">{c.emoji}</span>{c.name}
          </FilterChip>
        ))}
        <span className="mx-2 h-4 w-px bg-border" />
        {durations.map((d) => (
          <FilterChip key={d.id} small active={duration === d.id} onClick={() => setDuration(d.id)}>{d.label}</FilterChip>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState emoji="🎬" title="No tutorials here yet" description="Try a different skill or length." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => {
            const cat = getCategory(t.categoryId);
            return (
              <Card key={t.id} className="flex flex-col overflow-hidden">
                <div className="flex h-24 items-center justify-center text-4xl" style={{ backgroundColor: `hsl(${cat?.color ?? "258 68% 58%"} / 0.12)` }} aria-hidden>
                  {t.image}
                </div>
                <CardBody className="flex flex-1 flex-col">
                  <div className="mb-1 flex items-center gap-2">
                    <Badge tone="neutral">{cat?.name}</Badge>
                    <Badge tone="neutral" className="capitalize">{t.difficulty}</Badge>
                  </div>
                  <h3 className="font-semibold leading-snug text-fg">{t.title}</h3>
                  <p className="mt-1 flex-1 text-sm text-muted">{t.summary}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-muted">{t.steps.length} steps · ~{t.durationMin} min</span>
                    <Button size="sm" onClick={() => setActive(t)}>
                      <IconPlay width={14} height={14} /> Watch
                    </Button>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      {active && <TutorialPlayer tutorial={active} onClose={() => setActive(null)} />}
    </div>
  );
}

function TutorialPlayer({ tutorial, onClose }: { tutorial: Tutorial; onClose: () => void }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const step = tutorial.steps[index];
  const isLast = index === tutorial.steps.length - 1;

  useEffect(() => {
    primeVoices();
    return () => {
      stopSpeaking();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Narrate + auto-advance when playing.
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    stopSpeaking();
    if (!playing) return;

    const advance = () => {
      if (isLast) {
        setPlaying(false);
      } else {
        setIndex((i) => i + 1);
      }
    };
    if (!muted && isSpeechSupported()) {
      // Speak the narration; advance shortly after it ends.
      speak(`${step.title}. ${step.narration}`, { onEnd: () => (timerRef.current = setTimeout(advance, 700)) });
      // Safety net if speech never fires an end event.
      timerRef.current = setTimeout(advance, 9000);
    } else {
      timerRef.current = setTimeout(advance, 3500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, index, muted]);

  function go(next: number) {
    setPlaying(false);
    stopSpeaking();
    setIndex(Math.max(0, Math.min(tutorial.steps.length - 1, next)));
  }

  function hearThis() {
    primeVoices();
    speak(`${step.title}. ${step.narration}`);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface shadow-pop animate-fade-in">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-fg">{tutorial.title}</div>
            <div className="text-xs text-muted">Step {index + 1} of {tutorial.steps.length}</div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted hover:bg-surface-2 hover:text-fg" aria-label="Close tutorial">
            <IconClose />
          </button>
        </div>

        {/* Stage */}
        <div className="flex flex-col items-center justify-center gap-3 bg-accent/5 px-6 py-8 text-center">
          <div className="grid h-28 w-28 place-items-center rounded-2xl bg-surface text-6xl shadow-card" aria-hidden>{step.visual}</div>
          <h3 className="text-lg font-semibold text-fg">{step.title}</h3>
          <p className="max-w-sm text-sm text-muted">{step.narration}</p>
          <button onClick={hearThis} className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1.5 text-xs font-medium text-fg hover:bg-border/60">
            <IconVolume width={14} height={14} /> Hear this step
          </button>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 py-3">
          {tutorial.steps.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Go to step ${i + 1}`}
              className={cn("h-2 rounded-full transition-all", i === index ? "w-6 bg-primary" : "w-2 bg-border hover:bg-muted")}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between border-t border-border p-3">
          <Button variant="ghost" size="sm" onClick={() => go(index - 1)} disabled={index === 0}>Back</Button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMuted((m) => !m)}
              className={cn("inline-grid h-9 w-9 place-items-center rounded-xl border border-border", muted ? "text-muted" : "text-primary")}
              aria-label={muted ? "Unmute narration" : "Mute narration"}
              title={muted ? "Narration off" : "Narration on"}
            >
              <IconVolume width={18} height={18} />
            </button>
            <Button size="sm" onClick={() => { primeVoices(); setPlaying((p) => !p); }}>
              {playing ? "Pause" : isLast ? "Replay" : "Play"}
            </Button>
          </div>
          {isLast ? (
            <Button variant="ghost" size="sm" onClick={onClose}>Done</Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => go(index + 1)}>Next</Button>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterChip({ active, small, onClick, children }: { active: boolean; small?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border font-medium transition-colors",
        small ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-sm",
        active ? "border-primary bg-primary/10 text-primary" : "border-border bg-surface text-fg hover:bg-surface-2",
      )}
    >
      {children}
    </button>
  );
}
