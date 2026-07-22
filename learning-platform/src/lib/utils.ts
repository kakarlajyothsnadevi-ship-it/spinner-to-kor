// Tiny classnames helper (no external dependency).
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function relativeDue(days: number): string {
  if (days <= 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `Due in ${days} days`;
}

export const ageGroupLabel: Record<string, string> = {
  child: "Child (under 13)",
  teen: "Teen (13–17)",
  adult: "Adult (18–64)",
  senior: "Senior (65+)",
};

export const languageLabel: Record<string, string> = {
  en: "English",
  hi: "हिन्दी (Hindi)",
  te: "తెలుగు (Telugu)",
};

export const personalityLabel: Record<string, string> = {
  friendly: "Friendly & playful",
  calm: "Calm & patient",
  professional: "Professional",
  energetic: "Energetic",
  "step-by-step": "Step-by-step",
  "strict-supportive": "Strict but supportive",
};
