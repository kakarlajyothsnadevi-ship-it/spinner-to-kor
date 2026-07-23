"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Enrollment, Homework, User } from "./types";
import { homeworks as seedHomeworks } from "./data";

// ---------------------------------------------------------------------------
// Demo accounts. In a real app these come from the database + auth provider;
// here they let you explore every role instantly.
// ---------------------------------------------------------------------------
const demoUsers: Record<string, User> = {
  learner: {
    id: "u-aanya",
    name: "Aanya",
    email: "learner@skillbloom.app",
    role: "learner",
    ageGroup: "teen",
    age: 15,
    experience: "beginner",
    goals: ["Learn nail art", "Build confidence", "Try coding"],
    language: "en",
    lessonDuration: 15,
    materials: ["Base coat", "Colour polish", "A computer"],
    accessibility: ["Larger text"],
    preferredPersonality: "friendly",
    avatarColor: "6 78% 57%",
    onboarded: true,
    parentId: "u-parent",
    streak: 4,
    points: 320,
    level: 3,
  },
  parent: {
    id: "u-parent",
    name: "Priya",
    email: "parent@skillbloom.app",
    role: "parent",
    ageGroup: "adult",
    experience: "beginner",
    goals: [],
    language: "en",
    lessonDuration: 15,
    materials: [],
    accessibility: [],
    preferredPersonality: "friendly",
    avatarColor: "258 68% 58%",
    onboarded: true,
    childIds: ["u-aanya"],
    streak: 0,
    points: 0,
    level: 1,
  },
  admin: {
    id: "u-admin",
    name: "Admin",
    email: "admin@skillbloom.app",
    role: "admin",
    ageGroup: "adult",
    experience: "professional",
    goals: [],
    language: "en",
    lessonDuration: 15,
    materials: [],
    accessibility: [],
    preferredPersonality: "professional",
    avatarColor: "205 80% 45%",
    onboarded: true,
    streak: 0,
    points: 0,
    level: 1,
  },
};

const seedEnrollments: Enrollment[] = [
  { courseId: "course-nail-101", progress: 66, completedLessonIds: ["l-nl-1", "l-nl-2"], lastLessonId: "l-nl-2" },
  { courseId: "course-coding-101", progress: 33, completedLessonIds: ["l-cd-1"], lastLessonId: "l-cd-1" },
];

type Theme = "light" | "dark";

interface StoreValue {
  user: User | null;
  theme: Theme;
  enrollments: Enrollment[];
  homeworks: Homework[];
  ready: boolean;
  login: (email: string) => User;
  signup: (name: string, email: string) => User;
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
  toggleTheme: () => void;
  enroll: (courseId: string) => void;
  completeLesson: (courseId: string, lessonId: string, totalLessons: number) => void;
  submitHomework: (homeworkId: string) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

const LS_USER = "sb_user";
const LS_THEME = "sb_theme";
const LS_ENROLL = "sb_enrollments";
const LS_HW = "sb_homeworks";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<Theme>("light");
  const [enrollments, setEnrollments] = useState<Enrollment[]>(seedEnrollments);
  const [homeworks, setHomeworks] = useState<Homework[]>(seedHomeworks);
  const [ready, setReady] = useState(false);

  // Hydrate from localStorage once on mount.
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(LS_USER);
      if (savedUser) setUser(JSON.parse(savedUser));
      const savedTheme = (localStorage.getItem(LS_THEME) as Theme) || null;
      const prefersDark =
        window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      const t = savedTheme ?? (prefersDark ? "dark" : "light");
      setTheme(t);
      const savedEnroll = localStorage.getItem(LS_ENROLL);
      if (savedEnroll) setEnrollments(JSON.parse(savedEnroll));
      const savedHw = localStorage.getItem(LS_HW);
      if (savedHw) setHomeworks(JSON.parse(savedHw));
    } catch {
      /* ignore corrupted storage */
    }
    setReady(true);
  }, []);

  // Reflect theme on <html> and persist.
  useEffect(() => {
    if (!ready) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(LS_THEME, theme);
  }, [theme, ready]);

  const persistUser = useCallback((u: User | null) => {
    if (u) localStorage.setItem(LS_USER, JSON.stringify(u));
    else localStorage.removeItem(LS_USER);
  }, []);

  const login = useCallback(
    (email: string): User => {
      const key = email.includes("parent")
        ? "parent"
        : email.includes("admin")
          ? "admin"
          : "learner";
      const u = demoUsers[key];
      setUser(u);
      persistUser(u);
      return u;
    },
    [persistUser],
  );

  const signup = useCallback(
    (name: string, email: string): User => {
      const u: User = {
        ...demoUsers.learner,
        id: `u-${Date.now()}`,
        name: name || "Learner",
        email,
        onboarded: false,
        streak: 0,
        points: 0,
        level: 1,
        goals: [],
        materials: [],
        accessibility: [],
        parentId: undefined,
      };
      setUser(u);
      persistUser(u);
      return u;
    },
    [persistUser],
  );

  const logout = useCallback(() => {
    setUser(null);
    persistUser(null);
  }, [persistUser]);

  const updateUser = useCallback(
    (patch: Partial<User>) => {
      setUser((prev) => {
        if (!prev) return prev;
        const next = { ...prev, ...patch };
        persistUser(next);
        return next;
      });
    },
    [persistUser],
  );

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  const enroll = useCallback((courseId: string) => {
    setEnrollments((prev) => {
      if (prev.some((e) => e.courseId === courseId)) return prev;
      const next = [...prev, { courseId, progress: 0, completedLessonIds: [] }];
      localStorage.setItem(LS_ENROLL, JSON.stringify(next));
      return next;
    });
  }, []);

  const completeLesson = useCallback(
    (courseId: string, lessonId: string, totalLessons: number) => {
      setEnrollments((prev) => {
        const existing = prev.find((e) => e.courseId === courseId);
        let next: Enrollment[];
        if (!existing) {
          next = [
            ...prev,
            {
              courseId,
              completedLessonIds: [lessonId],
              lastLessonId: lessonId,
              progress: Math.round((1 / totalLessons) * 100),
            },
          ];
        } else {
          const completed = existing.completedLessonIds.includes(lessonId)
            ? existing.completedLessonIds
            : [...existing.completedLessonIds, lessonId];
          next = prev.map((e) =>
            e.courseId === courseId
              ? {
                  ...e,
                  completedLessonIds: completed,
                  lastLessonId: lessonId,
                  progress: Math.round((completed.length / totalLessons) * 100),
                }
              : e,
          );
        }
        localStorage.setItem(LS_ENROLL, JSON.stringify(next));
        return next;
      });
      // Reward points for completing a step.
      setUser((prev) => {
        if (!prev) return prev;
        const nextU = { ...prev, points: prev.points + 20 };
        persistUser(nextU);
        return nextU;
      });
    },
    [persistUser],
  );

  const submitHomework = useCallback((homeworkId: string) => {
    setHomeworks((prev) => {
      const next = prev.map((h) =>
        h.id === homeworkId
          ? {
              ...h,
              status: "reviewed" as const,
              feedback: h.feedback ?? {
                wentWell: "You followed the steps carefully and it shows — nice attention to detail.",
                toImprove: "Try slowing down on the final step for an even cleaner finish.",
                safety: "Good safety habits. Keep tools clean and work in a ventilated space.",
                nextStep: "You're ready to move on to the next lesson.",
                score: 85,
              },
            }
          : h,
      );
      localStorage.setItem(LS_HW, JSON.stringify(next));
      return next;
    });
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      user,
      theme,
      enrollments,
      homeworks,
      ready,
      login,
      signup,
      logout,
      updateUser,
      toggleTheme,
      enroll,
      completeLesson,
      submitHomework,
    }),
    [user, theme, enrollments, homeworks, ready, login, signup, logout, updateUser, toggleTheme, enroll, completeLesson, submitHomework],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
