"use client";

import { useState } from "react";
import { getCourse, quizzes } from "@/lib/data";
import { Badge, Button, Card, CardBody, Progress } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { Quiz, QuizQuestion } from "@/lib/types";

export default function QuizzesPage() {
  const [active, setActive] = useState<Quiz | null>(null);

  if (active) return <QuizRunner quiz={active} onExit={() => setActive(null)} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-fg">Quizzes & Knowledge Checks</h1>
        <p className="mt-1 text-muted">Multiple-choice, image, and reflection questions to lock in what you've learned.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((q) => {
          const course = getCourse(q.courseId);
          return (
            <Card key={q.id}>
              <CardBody className="flex h-full flex-col">
                <span className="text-2xl" aria-hidden>{course?.image}</span>
                <h3 className="mt-2 font-semibold text-fg">{q.title}</h3>
                <p className="mt-1 text-xs text-muted">{course?.name}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge tone="neutral">{q.questions.length} questions</Badge>
                  <Badge tone="neutral">~{q.questions.length * 1} min</Badge>
                </div>
                <Button className="mt-4" size="sm" onClick={() => setActive(q)}>Start quiz</Button>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function QuizRunner({ quiz, onExit }: { quiz: Quiz; onExit: () => void }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [checked, setChecked] = useState(false);
  const [finished, setFinished] = useState(false);
  const q = quiz.questions[index];
  const isLast = index === quiz.questions.length - 1;

  const scorable = quiz.questions.filter((qq) => typeof qq.correctIndex === "number");
  const correctCount = scorable.filter((qq) => answers[qq.id] === qq.correctIndex).length;
  const score = scorable.length ? Math.round((correctCount / scorable.length) * 100) : 100;

  function selectOption(i: number) {
    if (checked) return;
    setAnswers((a) => ({ ...a, [q.id]: i }));
  }

  function next() {
    if (isLast) { setFinished(true); return; }
    setIndex((i) => i + 1);
    setChecked(false);
  }

  if (finished) {
    return (
      <div className="mx-auto max-w-lg">
        <Card>
          <CardBody className="space-y-4 text-center">
            <div className="text-5xl" aria-hidden>{score >= 80 ? "🎉" : score >= 50 ? "👍" : "📚"}</div>
            <h2 className="font-display text-2xl font-semibold text-fg">You scored {score}%</h2>
            <p className="text-muted">
              {correctCount} of {scorable.length} scored questions correct.
              {score >= 80 ? " Excellent work!" : score >= 50 ? " Nice — review the ones you missed." : " Revisit the lesson and try again."}
            </p>
            <Progress value={score} />
            <div className="flex justify-center gap-2">
              <Button variant="outline" onClick={onExit}>Back to quizzes</Button>
              <Button onClick={() => { setIndex(0); setAnswers({}); setChecked(false); setFinished(false); }}>Retake</Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={onExit} className="text-sm text-primary hover:underline">← Exit quiz</button>
        <span className="text-sm text-muted">Question {index + 1} of {quiz.questions.length}</span>
      </div>
      <Progress value={((index + (checked ? 1 : 0)) / quiz.questions.length) * 100} />

      <Card>
        <CardBody className="space-y-4">
          <Badge tone="accent" className="capitalize">{q.kind.replace("-", " ")}</Badge>
          <h2 className="text-lg font-semibold text-fg">{q.prompt}</h2>

          {q.imageCaption && (
            <div className="flex items-center gap-2 rounded-xl bg-surface-2 p-4 text-sm text-muted">
              <span className="text-2xl" aria-hidden>🖼️</span> {q.imageCaption}
            </div>
          )}

          {q.options && (
            <div className="space-y-2">
              {q.options.map((opt, i) => {
                const selected = answers[q.id] === i;
                const correct = checked && i === q.correctIndex;
                const wrong = checked && selected && i !== q.correctIndex;
                return (
                  <button
                    key={i}
                    onClick={() => selectOption(i)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                      correct && "border-success bg-success/10 text-success",
                      wrong && "border-danger bg-danger/10 text-danger",
                      !checked && selected && "border-primary bg-primary/10 text-primary",
                      !checked && !selected && "border-border text-fg hover:bg-surface-2",
                      checked && !correct && !wrong && "border-border text-muted",
                    )}
                  >
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-current text-xs">{String.fromCharCode(65 + i)}</span>
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {q.kind === "reflection" && (
            <ReflectionAnswer value={(answers[q.id] as string) ?? ""} onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))} />
          )}

          {checked && q.explanation && (
            <div className="rounded-xl bg-surface-2 p-3 text-sm text-fg">
              <span className="font-medium">Why:</span> {q.explanation}
            </div>
          )}

          <div className="flex justify-end gap-2">
            {q.options && !checked ? (
              <Button onClick={() => setChecked(true)} disabled={answers[q.id] === undefined}>Check answer</Button>
            ) : (
              <Button onClick={next}>{isLast ? "See results" : "Next question"}</Button>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function ReflectionAnswer({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write your reflection… there's no wrong answer here."
        className="min-h-[96px] w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none"
      />
      <p className="mt-1 text-xs text-muted">Reflection answers aren't scored — they help you think it through.</p>
    </div>
  );
}
