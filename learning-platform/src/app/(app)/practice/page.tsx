"use client";

import { useState } from "react";
import { courses } from "@/lib/data";
import { useStore } from "@/lib/store";
import { Badge, Button, Card, CardBody, SafetyNote } from "@/components/ui";
import { IconUpload } from "@/components/icons";

// Guided Practice: tutor gives a cue, learner uploads/captures, AI gives feedback.
export default function PracticePage() {
  const { user } = useStore();
  const [courseId, setCourseId] = useState(courses[0].id);
  const [preview, setPreview] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<null | { well: string; improve: string; safety: string; next: string }>(null);
  const [analysing, setAnalysing] = useState(false);
  const course = courses.find((c) => c.id === courseId)!;
  const cue = practiceCues[courseId] ?? "Try the step, then show me your result when you're ready.";

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setFeedback(null);
  }

  function analyse() {
    setAnalysing(true);
    setFeedback(null);
    setTimeout(() => {
      setAnalysing(false);
      setFeedback(feedbackByCourse[courseId]);
    }, 1400);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-fg">Guided Practice</h1>
        <p className="mt-1 text-muted">Practise on your own — your tutor watches your result and gives safe, specific feedback.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {courses.map((c) => (
          <button
            key={c.id}
            onClick={() => { setCourseId(c.id); setPreview(null); setFeedback(null); }}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${courseId === c.id ? "border-primary bg-primary/10 text-primary" : "border-border bg-surface text-fg hover:bg-surface-2"}`}
          >
            <span aria-hidden className="mr-1">{c.image}</span>{c.name}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Tutor cue */}
        <Card>
          <CardBody className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-accent/10 text-2xl" aria-hidden>{course.image}</span>
              <div>
                <div className="font-medium text-fg">Your tutor says</div>
                <div className="text-xs text-muted">Guided practice · {course.name}</div>
              </div>
            </div>
            <div className="rounded-xl bg-surface-2 p-4 text-sm text-fg">“{user?.name ? `${user.name}, ` : ""}{cue}”</div>
            <SafetyNote items={course.lessons[0].safety.slice(0, 2)} />
          </CardBody>
        </Card>

        {/* Upload / capture */}
        <Card>
          <CardBody className="space-y-4">
            <h3 className="font-semibold text-fg">Show your work</h3>
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Your uploaded work" className="max-h-56 w-full rounded-xl object-cover" />
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-surface-2/50 p-8 text-center text-sm text-muted hover:bg-surface-2">
                <IconUpload />
                <span>Upload a photo or use your camera</span>
                <span className="text-xs">JPG or PNG · nothing is stored in this demo</span>
                <input type="file" accept="image/*" className="hidden" onChange={onFile} />
              </label>
            )}
            {preview && (
              <div className="flex gap-2">
                <Button onClick={analyse} disabled={analysing} className="flex-1">
                  {analysing ? "Analysing your work…" : "Get tutor feedback"}
                </Button>
                <label className="cursor-pointer">
                  <span className="inline-flex items-center rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-fg hover:bg-surface-2">Replace</span>
                  <input type="file" accept="image/*" className="hidden" onChange={onFile} />
                </label>
              </div>
            )}

            {feedback && (
              <div className="space-y-3 rounded-xl border border-border bg-surface-2/50 p-4">
                <FeedbackRow tone="success" label="What went well" text={feedback.well} />
                <FeedbackRow tone="warning" label="What to improve" text={feedback.improve} />
                <FeedbackRow tone="danger" label="Safety & technique" text={feedback.safety} />
                <FeedbackRow tone="accent" label="Next step" text={feedback.next} />
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function FeedbackRow({ tone, label, text }: { tone: "success" | "warning" | "danger" | "accent"; label: string; text: string }) {
  return (
    <div>
      <Badge tone={tone}>{label}</Badge>
      <p className="mt-1 text-sm text-fg">{text}</p>
    </div>
  );
}

const practiceCues: Record<string, string> = {
  "course-makeup-101": "apply your base on one cheek first, then show me your nails— I mean your cheek — when you're ready.",
  "course-nail-101": "apply the base coat first. Show me your nails when you are ready.",
  "course-coding-101": "write one heading and one paragraph in HTML, then upload a screenshot of your page.",
};

const feedbackByCourse: Record<string, { well: string; improve: string; safety: string; next: string }> = {
  "course-makeup-101": {
    well: "Your base looks even and natural — lovely, light coverage.",
    improve: "Blend a little more along the jawline so there's no visible edge.",
    safety: "Reminder: patch-test new products and never share applicators.",
    next: "You're ready to add blush on the apples of your cheeks.",
  },
  "course-nail-101": {
    well: "Clean, even base coat with no pooling at the edges — nicely done!",
    improve: "Keep the layer just a touch thinner so it dries faster and smoother.",
    safety: "Great job keeping polish off the skin. Work in a ventilated space.",
    next: "Move on to your first thin colour coat.",
  },
  "course-coding-101": {
    well: "Your heading and paragraph render correctly — the structure is right.",
    improve: "Add a blank line between elements to keep your code readable.",
    safety: "Only run and download tools from official, trusted sources.",
    next: "Try adding a bullet list with <ul> and <li>.",
  },
};
