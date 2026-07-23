// A small deterministic "AI tutor" reply generator. No external LLM required —
// it composes safe, on-topic responses from the current lesson + personality.
// In production this would call an AI chat endpoint; the interface stays the same.

import type { Lesson, LessonStep, TutorPersonality } from "./types";

const openers: Record<TutorPersonality, string[]> = {
  friendly: ["Great question!", "Ooh, I love this one —", "You've got it!"],
  calm: ["That's a thoughtful question.", "Let's take this slowly.", "No rush at all."],
  professional: ["Good question.", "Here's the key idea.", "Let's be precise."],
  energetic: ["Yes! Let's go!", "Awesome —", "Love the energy!"],
  "step-by-step": ["Step by step:", "Let's break it down.", "One piece at a time."],
  "strict-supportive": ["Focus here.", "This matters, so listen closely.", "You can do this."],
};

const encouragers: Record<TutorPersonality, string> = {
  friendly: "You're doing wonderfully. 💛",
  calm: "Take all the time you need.",
  professional: "Solid progress.",
  energetic: "Keep that momentum!",
  "step-by-step": "On to the next step when you're ready.",
  "strict-supportive": "Good. Now do it once more to lock it in.",
};

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

export interface TutorContext {
  lesson: Lesson;
  step: LessonStep;
  personality: TutorPersonality;
  learnerName: string;
  seed: number;
}

export function tutorReply(message: string, ctx: TutorContext): string {
  const { lesson, step, personality, learnerName, seed } = ctx;
  const opener = pick(openers[personality], seed);
  const m = message.toLowerCase();

  if (/repeat|again|didn't get|confus/.test(m)) {
    return `${opener} Let me repeat it. ${step.tutorScript}`;
  }
  if (/slow|too fast|wait|pause/.test(m)) {
    return `Of course, ${learnerName}. We'll slow right down. ${step.instruction} Tell me when you're ready.`;
  }
  if (/safe|danger|hurt|allerg|burn|cut/.test(m) && lesson.safety.length) {
    return `Safety first — ${lesson.safety[0]} ${encouragers[personality]}`;
  }
  if (/material|need|tool|what.*use/.test(m)) {
    return `For this lesson you'll want: ${lesson.materials.join(", ")}. Do you have those handy?`;
  }
  if (/why|how come|reason/.test(m)) {
    return `${opener} ${step.tip ?? "It helps us get a clean, reliable result."} That's why this step matters for "${lesson.objective.toLowerCase()}".`;
  }
  if (/done|finished|complete|ready|next/.test(m)) {
    return `Wonderful, ${learnerName}! ${encouragers[personality]} Tap "I Completed This Step" and we'll continue.`;
  }
  if (/hi|hello|hey|thanks|thank you/.test(m)) {
    return `${opener} I'm right here with you, ${learnerName}. Ask me anything about this step.`;
  }
  // Default: reframe the current step as an answer.
  return `${opener} For "${step.title}": ${step.instruction} ${step.tip ? `Tip: ${step.tip}` : ""}`.trim();
}

export function greeting(learnerName: string, lessonTitle: string, personality: TutorPersonality): string {
  const opener = pick(openers[personality], learnerName.length);
  return `Hi ${learnerName}! ${opener} Welcome to today's class. We're going to learn "${lessonTitle}". I'll show you each step, and you can pause, repeat, or ask me anything at any time. Ready? Let's begin!`;
}
