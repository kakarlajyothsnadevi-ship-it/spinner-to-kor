// Domain types for SkillBloom. These mirror the Prisma schema in prisma/schema.prisma
// so the mock data layer and a future real database stay in sync.

export type Role = "learner" | "parent" | "admin";

export type AgeGroup = "child" | "teen" | "adult" | "senior";

export type ExperienceLevel = "beginner" | "hobby" | "intermediate" | "advanced" | "professional";

export type Language = "en" | "hi" | "te";

export type TutorPersonality =
  | "friendly"
  | "calm"
  | "professional"
  | "energetic"
  | "step-by-step"
  | "strict-supportive";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  ageGroup: AgeGroup;
  age?: number;
  experience: ExperienceLevel;
  goals: string[];
  language: Language;
  lessonDuration: number; // minutes
  materials: string[];
  accessibility: string[];
  preferredPersonality: TutorPersonality;
  avatarColor: string;
  onboarded: boolean;
  // Parent linkage (for child accounts)
  parentId?: string;
  childIds?: string[];
  streak: number;
  points: number;
  level: number;
}

export interface Tutor {
  id: string;
  name: string;
  personality: TutorPersonality;
  tagline: string;
  color: string;
  emoji: string;
  voice: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  emoji: string;
  color: string; // token-ish hsl for accenting cards
  description: string;
}

export interface Lesson {
  id: string;
  title: string;
  objective: string;
  durationMin: number;
  materials: string[];
  safety: string[];
  steps: LessonStep[];
  completed?: boolean;
}

export interface LessonStep {
  id: string;
  title: string;
  instruction: string;
  tutorScript: string; // what the AI tutor "says"
  reference?: { kind: "image" | "diagram" | "video" | "animation"; caption: string };
  tip?: string;
}

export interface Course {
  id: string;
  categoryId: string;
  name: string;
  image: string; // emoji-based illustration key
  tutorId: string;
  ageGroups: AgeGroup[];
  difficulty: Difficulty;
  lessonCount: number;
  estimatedHours: number;
  materials: string[];
  rating: number;
  ratingsCount: number;
  paid: boolean;
  price?: number;
  summary: string;
  outcomes: string[];
  modules: { id: string; title: string; lessonIds: string[] }[];
  lessons: Lesson[];
  finalProject: string;
}

export interface Homework {
  id: string;
  courseId: string;
  lessonId: string;
  title: string;
  prompt: string;
  dueInDays: number;
  submissionTypes: SubmissionType[];
  status: "pending" | "submitted" | "reviewed";
  feedback?: Feedback;
}

export type SubmissionType = "text" | "image" | "video" | "audio" | "document" | "code" | "link";

export interface Feedback {
  wentWell: string;
  toImprove: string;
  safety: string;
  nextStep: string;
  score: number; // 0-100
}

export interface QuizQuestion {
  id: string;
  kind: "multiple-choice" | "image" | "voice" | "reflection";
  prompt: string;
  imageCaption?: string;
  options?: string[];
  correctIndex?: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  questions: QuizQuestion[];
}

export interface Enrollment {
  courseId: string;
  progress: number; // 0-100
  completedLessonIds: string[];
  lastLessonId?: string;
}

export interface Certificate {
  id: string;
  courseName: string;
  tutorName: string;
  issuedOn: string;
  category: string;
}

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  earned: boolean;
}

export interface Plan {
  id: string;
  name: string;
  price: string;
  cadence: string;
  features: string[];
  highlight?: boolean;
  audience: string;
}
