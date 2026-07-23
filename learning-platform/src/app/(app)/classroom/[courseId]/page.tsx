"use client";

import { use, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { getCourse, getTutor } from "@/lib/data";
import { useStore } from "@/lib/store";
import { Badge, Button, Card, CardBody, Progress, SafetyNote } from "@/components/ui";
import {
  IconCamera,
  IconCameraOff,
  IconCheck,
  IconMic,
  IconMicOff,
  IconVolume,
} from "@/components/icons";
import { isSpeechSupported, speak, stopSpeaking } from "@/lib/tts";
import { greeting, tutorReply } from "@/lib/tutor-brain";
import type { TutorPromptContext, TutorTurn } from "@/lib/tutor-api";

type ChatMsg = { id: number; from: "tutor" | "learner"; text: string };

export default function ClassroomPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const router = useRouter();
  const course = getCourse(courseId);
  const { user, enrollments, completeLesson, enroll } = useStore();

  const enrollment = enrollments.find((e) => e.courseId === courseId);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [rate, setRate] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  const [camOn, setCamOn] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [camError, setCamError] = useState<string | null>(null);
  const [thinking, setThinking] = useState(false);
  const [aiMode, setAiMode] = useState<"live" | "offline" | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const msgId = useRef(0);
  const greeted = useRef(false);

  const lesson = course?.lessons[lessonIndex];
  const step = lesson?.steps[stepIndex];

  // Start at the first not-completed lesson.
  useEffect(() => {
    if (!course) return;
    const firstIncomplete = course.lessons.findIndex((l) => !enrollment?.completedLessonIds.includes(l.id));
    setLessonIndex(firstIncomplete === -1 ? 0 : firstIncomplete);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course?.id]);

  const personality = user?.preferredPersonality ?? "friendly";
  const learnerName = user?.name ?? "there";

  function pushTutor(text: string, doSpeak = true) {
    msgId.current += 1;
    setMessages((m) => [...m, { id: msgId.current, from: "tutor", text }]);
    if (doSpeak) {
      setSpeaking(true);
      speak(text, { rate, onEnd: () => setSpeaking(false) });
    }
  }
  function pushLearner(text: string) {
    msgId.current += 1;
    setMessages((m) => [...m, { id: msgId.current, from: "learner", text }]);
  }

  // Greet once the lesson is known.
  useEffect(() => {
    if (course && lesson && !greeted.current) {
      greeted.current = true;
      pushTutor(greeting(learnerName, lesson.title, personality));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course, lesson]);

  // Auto-scroll chat.
  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Camera lifecycle.
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      stopSpeaking();
    };
  }, []);

  async function toggleCam() {
    if (camOn) {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setCamOn(false);
      setMicOn(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCamOn(true);
      setCamError(null);
    } catch {
      setCamError("Camera unavailable or permission denied. You can still take the class — upload photos in Guided Practice instead.");
    }
  }

  if (!course) return notFound();
  if (!lesson || !step) return null;
  const tutor = getTutor(course.tutorId);

  const totalSteps = lesson.steps.length;
  const isLastStep = stepIndex === totalSteps - 1;
  const isLastLesson = lessonIndex === course.lessons.length - 1;

  function offlineReply(text: string) {
    pushTutor(tutorReply(text, { lesson: lesson!, step: step!, personality, learnerName, seed: msgId.current }));
  }

  async function send() {
    const text = input.trim();
    if (!text || thinking) return;
    pushLearner(text);
    setInput("");

    // Build the conversation history in the API's role format (tutor→assistant,
    // learner→user), then append the new learner turn.
    const history: TutorTurn[] = [
      ...messages.map((m) => ({ role: (m.from === "tutor" ? "assistant" : "user") as TutorTurn["role"], content: m.text })),
      { role: "user", content: text },
    ];
    const context: TutorPromptContext = {
      learnerName,
      ageGroup: user?.ageGroup ?? "adult",
      experience: user?.experience ?? "beginner",
      personality,
      language: user?.language ?? "en",
      courseName: course!.name,
      lessonTitle: lesson!.title,
      lessonObjective: lesson!.objective,
      stepTitle: step!.title,
      stepInstruction: step!.instruction,
      stepTip: step!.tip,
      materials: lesson!.materials,
      safety: lesson!.safety,
    };

    setThinking(true);
    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, context }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.reply) {
        setAiMode("live");
        pushTutor(data.reply);
      } else {
        // Key not configured, rate-limited, or error → offline tutor.
        setAiMode("offline");
        offlineReply(text);
      }
    } catch {
      setAiMode("offline");
      offlineReply(text);
    } finally {
      setThinking(false);
    }
  }

  function repeatThat() {
    pushTutor(step!.tutorScript);
  }
  function showAgain() {
    pushTutor(`Look here — ${step!.reference?.caption ?? step!.instruction}. Watch closely and try it with me.`);
  }
  function slowDown() {
    const nr = Math.max(0.6, rate - 0.2);
    setRate(nr);
    pushTutor(`No problem, ${learnerName}. I'll slow down. ${step!.instruction}`);
  }
  function askQuestion() {
    pushTutor(`Here's a question for you: can you tell me what we're doing in "${step!.title}", and why it matters?`, true);
  }

  function completeStep() {
    if (!enrollment) enroll(course!.id);
    if (isLastStep) {
      completeLesson(course!.id, lesson!.id, course!.lessons.length);
      if (isLastLesson) {
        pushTutor(`That's the whole course, ${learnerName}! Incredible work. 🎉 You've earned points and you're ready for your final project: ${course!.finalProject}`);
        setTimeout(() => router.push("/progress"), 2500);
      } else {
        pushTutor(`Lesson complete — beautifully done! Let's move on to "${course!.lessons[lessonIndex + 1].title}".`);
        setLessonIndex((i) => i + 1);
        setStepIndex(0);
      }
    } else {
      pushTutor(`Perfect. On to the next step.`);
      setStepIndex((i) => i + 1);
    }
  }

  const overallProgress = Math.round(
    ((lessonIndex + (stepIndex + 1) / totalSteps) / course.lessons.length) * 100,
  );

  return (
    <div className="space-y-4">
      {/* Class header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-danger opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-danger" />
            </span>
            <span className="text-sm font-medium text-danger">Live AI Class</span>
          </div>
          <h1 className="mt-0.5 font-display text-xl font-semibold text-fg">{course.name}</h1>
        </div>
        <Link href="/dashboard">
          <Button variant="danger" size="sm">End Class</Button>
        </Link>
      </div>

      <Progress value={overallProgress} label={`Lesson ${lessonIndex + 1} of ${course.lessons.length} · Step ${stepIndex + 1} of ${totalSteps}`} />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Left: video area */}
        <div className="space-y-4 lg:col-span-2">
          {/* Tutor stage */}
          <Card className="overflow-hidden">
            <div className="relative flex aspect-video flex-col items-center justify-center bg-accent/10 p-6 text-center">
              <span
                className={`grid h-24 w-24 place-items-center rounded-full text-5xl text-white transition-transform ${speaking ? "scale-105" : ""}`}
                style={{ backgroundColor: `hsl(${tutor?.color})` }}
                aria-hidden
              >
                {tutor?.emoji}
              </span>
              <div className="mt-3 flex items-center gap-2">
                <span className="font-medium text-fg">{tutor?.name}</span>
                {speaking && (
                  <span className="inline-flex items-center gap-1 text-xs text-accent">
                    <IconVolume width={14} height={14} /> speaking…
                  </span>
                )}
              </div>
              <p className="mt-3 max-w-md text-sm text-fg/90">
                {messages.filter((m) => m.from === "tutor").slice(-1)[0]?.text ?? step.tutorScript}
              </p>
              {!isSpeechSupported() && (
                <p className="mt-2 text-xs text-muted">Voice output isn't available in this browser — the tutor's words appear here as text.</p>
              )}
            </div>

            {/* Controls bar */}
            <div className="flex flex-wrap items-center justify-center gap-2 border-t border-border p-3">
              <ControlButton active={micOn} onClick={() => setMicOn((v) => !v)} onIcon={<IconMic width={18} height={18} />} offIcon={<IconMicOff width={18} height={18} />} label="Mic" />
              <ControlButton active={camOn} onClick={toggleCam} onIcon={<IconCamera width={18} height={18} />} offIcon={<IconCameraOff width={18} height={18} />} label="Camera" />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => (speaking ? (stopSpeaking(), setSpeaking(false)) : repeatThat())}
              >
                <IconVolume width={16} height={16} /> {speaking ? "Stop voice" : "Play voice"}
              </Button>
            </div>
          </Card>

          {/* Learner camera preview */}
          <Card>
            <CardBody className="flex items-center gap-4">
              <div className="relative grid h-24 w-32 shrink-0 place-items-center overflow-hidden rounded-xl bg-surface-2">
                <video ref={videoRef} autoPlay playsInline muted className={`h-full w-full object-cover ${camOn ? "" : "hidden"}`} />
                {!camOn && <span className="text-sm text-muted">Camera off</span>}
              </div>
              <div className="min-w-0 flex-1 text-sm">
                <div className="font-medium text-fg">Your camera</div>
                <p className="mt-0.5 text-muted">
                  {camError ?? "Turn on your camera so your tutor can guide you — or keep it off and follow along. Nothing is recorded in this demo."}
                </p>
              </div>
            </CardBody>
          </Card>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <Button variant="outline" size="sm" onClick={askQuestion}>❓ Ask a Question</Button>
            <Button variant="outline" size="sm" onClick={repeatThat}>🔁 Repeat That</Button>
            <Button variant="outline" size="sm" onClick={showAgain}>👀 Show Me Again</Button>
            <Button variant="outline" size="sm" onClick={slowDown}>🐢 Slow Down</Button>
            <Button size="sm" className="col-span-2 sm:col-span-1" onClick={completeStep}>
              <IconCheck width={16} height={16} /> I Completed This Step
            </Button>
          </div>
        </div>

        {/* Right: step + chat + materials */}
        <div className="space-y-4">
          {/* Current step */}
          <Card>
            <CardBody>
              <div className="mb-1 flex items-center justify-between">
                <Badge tone="primary">Step {stepIndex + 1}/{totalSteps}</Badge>
                <span className="text-xs text-muted">{lesson.title}</span>
              </div>
              <h3 className="font-semibold text-fg">{step.title}</h3>
              <p className="mt-1 text-sm text-muted">{step.instruction}</p>
              {step.reference && (
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-surface-2 p-3 text-xs text-muted">
                  <span aria-hidden className="text-lg">
                    {step.reference.kind === "video" ? "🎬" : step.reference.kind === "animation" ? "✨" : step.reference.kind === "diagram" ? "📐" : "🖼️"}
                  </span>
                  <span><span className="font-medium capitalize text-fg">{step.reference.kind}:</span> {step.reference.caption}</span>
                </div>
              )}
              {step.tip && <p className="mt-2 text-xs text-accent">💡 {step.tip}</p>}
            </CardBody>
          </Card>

          {/* Chat */}
          <Card className="flex flex-col">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <span className="text-sm font-medium text-fg">Chat with {tutor?.name}</span>
              {aiMode === "live" ? (
                <Badge tone="success">✦ AI live</Badge>
              ) : aiMode === "offline" ? (
                <Badge tone="neutral">Demo mode</Badge>
              ) : null}
            </div>
            <div ref={chatRef} className="max-h-72 min-h-[12rem] flex-1 space-y-2 overflow-y-auto p-3 scroll-slim">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.from === "learner" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                      m.from === "learner" ? "bg-primary text-primary-fg" : "bg-surface-2 text-fg"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {thinking && (
                <div className="flex justify-start" aria-live="polite">
                  <div className="flex items-center gap-1 rounded-2xl bg-surface-2 px-3 py-2.5">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.2s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.1s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted" />
                    <span className="sr-only">{tutor?.name} is typing</span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 border-t border-border p-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder={thinking ? `${tutor?.name} is thinking…` : micOn ? "Listening… (type your answer)" : "Type a message or question…"}
                disabled={thinking}
                className="flex-1 rounded-xl border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none disabled:opacity-60"
                aria-label="Message your tutor"
              />
              <Button size="sm" onClick={send} disabled={thinking}>Send</Button>
            </div>
          </Card>

          {/* Materials + safety */}
          <Card>
            <CardBody>
              <h3 className="text-sm font-semibold text-fg">Lesson materials</h3>
              <ul className="mt-2 space-y-1 text-sm text-muted">
                {lesson.materials.map((m) => (
                  <li key={m} className="flex gap-2"><span aria-hidden>•</span>{m}</li>
                ))}
              </ul>
            </CardBody>
          </Card>
          <SafetyNote items={lesson.safety} />
        </div>
      </div>
    </div>
  );
}

function ControlButton({
  active,
  onClick,
  onIcon,
  offIcon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  onIcon: React.ReactNode;
  offIcon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
        active ? "bg-primary/10 text-primary" : "bg-surface-2 text-muted hover:text-fg"
      }`}
      aria-pressed={active}
    >
      {active ? onIcon : offIcon} {label}
    </button>
  );
}
