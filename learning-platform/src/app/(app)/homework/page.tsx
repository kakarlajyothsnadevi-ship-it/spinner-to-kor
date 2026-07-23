"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { getCourse } from "@/lib/data";
import { Badge, Button, Card, CardBody, EmptyState, Textarea } from "@/components/ui";
import { IconUpload } from "@/components/icons";
import { relativeDue } from "@/lib/utils";
import type { Homework, SubmissionType } from "@/lib/types";

const typeLabel: Record<SubmissionType, string> = {
  text: "Text",
  image: "Image",
  video: "Video",
  audio: "Audio",
  document: "Document",
  code: "Code",
  link: "Link",
};

export default function HomeworkPage() {
  const { homeworks } = useStore();
  const pending = homeworks.filter((h) => h.status !== "reviewed");
  const reviewed = homeworks.filter((h) => h.status === "reviewed");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-fg">Homework</h1>
        <p className="mt-1 text-muted">Submit your work and get structured feedback from your AI tutor.</p>
      </div>

      {pending.length === 0 && reviewed.length === 0 && (
        <EmptyState emoji="📭" title="No homework yet" description="Complete a lesson to receive practice homework." />
      )}

      {pending.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">To do</h2>
          {pending.map((h) => <HomeworkItem key={h.id} hw={h} />)}
        </section>
      )}

      {reviewed.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Reviewed</h2>
          {reviewed.map((h) => <HomeworkItem key={h.id} hw={h} />)}
        </section>
      )}
    </div>
  );
}

function HomeworkItem({ hw }: { hw: Homework }) {
  const { submitHomework } = useStore();
  const course = getCourse(hw.courseId);
  const [open, setOpen] = useState(hw.status === "reviewed");
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const reviewed = hw.status === "reviewed";

  return (
    <Card>
      <CardBody className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-fg">{hw.title}</h3>
              {reviewed ? (
                <Badge tone="success">Reviewed · {hw.feedback?.score}/100</Badge>
              ) : (
                <Badge tone="warning">{relativeDue(hw.dueInDays)}</Badge>
              )}
            </div>
            <p className="text-xs text-muted">{course?.name}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setOpen((o) => !o)}>{open ? "Hide" : "Open"}</Button>
        </div>

        {open && (
          <div className="space-y-4 border-t border-border pt-3">
            <p className="text-sm text-fg">{hw.prompt}</p>

            <div className="flex flex-wrap gap-1.5">
              {hw.submissionTypes.map((t) => (
                <Badge key={t} tone="neutral">{typeLabel[t]}</Badge>
              ))}
            </div>

            {!reviewed && (
              <>
                {hw.submissionTypes.includes("text") || hw.submissionTypes.includes("code") ? (
                  <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={hw.submissionTypes.includes("code") ? "Paste your code here…" : "Write your response…"}
                  />
                ) : null}

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border bg-surface-2/40 p-4 text-sm text-muted hover:bg-surface-2">
                  <IconUpload />
                  <span>{fileName ?? "Attach a file (image, video, audio, document, or code)"}</span>
                  <input type="file" className="hidden" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)} />
                </label>

                <Button
                  onClick={() => submitHomework(hw.id)}
                  disabled={!text.trim() && !fileName}
                >
                  Submit for review
                </Button>
                {!text.trim() && !fileName && <p className="text-xs text-muted">Add a response or a file to submit.</p>}
              </>
            )}

            {reviewed && hw.feedback && (
              <div className="space-y-3 rounded-xl border border-border bg-surface-2/50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-fg">Tutor feedback</span>
                  <Badge tone="success">Score {hw.feedback.score}/100</Badge>
                </div>
                <Row tone="success" label="What was done well" text={hw.feedback.wentWell} />
                <Row tone="warning" label="What can be improved" text={hw.feedback.toImprove} />
                <Row tone="danger" label="Safety / technique" text={hw.feedback.safety} />
                <Row tone="accent" label="Suggested next step" text={hw.feedback.nextStep} />
              </div>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

function Row({ tone, label, text }: { tone: "success" | "warning" | "danger" | "accent"; label: string; text: string }) {
  return (
    <div>
      <Badge tone={tone}>{label}</Badge>
      <p className="mt-1 text-sm text-fg">{text}</p>
    </div>
  );
}
