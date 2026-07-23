# SkillBloom 🌸

An AI-powered learning platform for **creative and extracurricular skills** — makeup,
nail art, coding, baking, photography, music, public speaking and more. Every learner,
from child to senior, gets a friendly AI tutor that greets them by name, demonstrates
step by step, reviews their work, and adapts to their age, experience, and safety needs.

> This is a polished **MVP**. It runs with **zero external services** — AI tutor replies,
> voice, avatars, and data are all mocked so you can explore the full experience locally.
> Every mock has a clear seam where a real service (LLM, TTS, database, auth, payments)
> plugs in.

## Quick start

```bash
npm install
npm run dev
# open http://localhost:3000
```

On the login page use **Learner / Parent / Admin** demo buttons to jump straight into each role,
or sign up to walk through onboarding.

## Enabling the real AI tutor (optional)

The Live AI Classroom chat can be powered by a real Claude model. It runs **server-side**
through a Next.js API route (`src/app/api/tutor/route.ts`), so the API key is never exposed
to the browser.

```bash
cp .env.example .env.local
# then set ANTHROPIC_API_KEY=... in .env.local
npm run dev
```

- **With a key:** the classroom chat calls the Anthropic API (`claude-opus-4-8`). The tutor
  answers in character (using the learner's chosen personality, age group, experience, and
  language), stays on the current lesson/step, and is held to the platform's safety rules
  (no medical claims; age-appropriate; folds in allergy/hygiene/heat/tool safety). A green
  **✦ AI live** badge appears on the chat.
- **Without a key:** everything still works — the chat falls back to the built-in offline
  tutor (`src/lib/tutor-brain.ts`) and shows a **Demo mode** badge. The API route returns
  `{ configured: false }` and the client degrades gracefully. The same fallback covers rate
  limits and network errors.

## Tech stack

| Area | Choice |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS with CSS-variable design tokens (light + dark) |
| State | React Context + `localStorage` (mock persistence) |
| AI tutor | Anthropic `@anthropic-ai/sdk` (`claude-opus-4-8`) via a server API route, with offline fallback |
| Voice | Browser Web Speech API (graceful fallback to text) |
| Camera | `getUserMedia` with permission handling + fallback |
| DB (planned) | PostgreSQL + Prisma (`prisma/schema.prisma`) |
| Fonts | Plus Jakarta Sans (UI) + Fraunces (display) — friendly yet premium, not childish |

## What's included (MVP feature list)

1. Landing page
2. Sign-up & login (with demo accounts)
3. Learner onboarding (5-step personalised path builder)
4. Learner dashboard (streak, stats, continue-learning, homework, recommendations, weekly summary)
5. Explore Skills page (search + category / level / price filters)
6. Three sample categories with a full playable course each: **Makeup**, **Nail Art**, **Coding**
7. Course details page (curriculum, outcomes, tutor, materials, safety)
8. **Live AI Classroom** — tutor avatar, camera preview, mic/camera controls, chat, TTS,
   step-by-step lesson, progress, and the *Ask a Question / Repeat That / Show Me Again /
   Slow Down / I Completed This Step / End Class* controls
9. Guided Practice (upload work → structured AI feedback)
10. Project Mode (projects broken into checkable steps)
11. Homework (multi-type submission + structured feedback: what went well / to improve / safety / next step / score)
12. Quiz system (multiple-choice, image, and reflection questions with scoring)
13. Progress tracking (streak, level, weekly chart, skill bars, badges)
14. Certificates
15. Messages (per-tutor threads)
16. Parent dashboard (progress, safety controls, course approvals, homework review, weekly report)
17. Admin dashboard (overview analytics, courses, tutors, learners, moderation)
18. Profile & Settings (AI tutor customisation, language, theme, notifications)
19. Subscription page (Free / Monthly / Annual / Family + extras)

## Roles & access

Role-based navigation and routing:

- **Learner** — full learning experience
- **Parent** — parent dashboard with safety controls for linked child accounts
- **Admin** — content, user, and moderation management

The route group `src/app/(app)/` is guarded by `AppShell`, which redirects unauthenticated
users to `/login` and renders role-appropriate navigation.

## Safety-first by design

Skills like makeup, nail art, cooking, and hairstyling surface allergy, hygiene, age, heat,
chemical, and tool-safety warnings, and the tutor **never makes medical claims**. Feedback is
constructive and specific. Child accounts get shorter lessons, simpler language, and parental controls.

## Accessibility & UX

- Light and dark themes (no flash on load), respects `prefers-color-scheme`
- Visible focus rings, ARIA roles/labels, `prefers-reduced-motion` support
- Responsive from mobile to desktop; large tap targets and readable typography
- Loading, empty, and error states throughout (e.g. `not-found`, empty homework/classes/certificates)

## Project structure

```
src/
  app/
    page.tsx                  landing
    login / signup / onboarding
    (app)/                    authenticated shell (sidebar + topbar)
      dashboard, explore, explore/[courseId]
      classroom/[courseId]    the Live AI Classroom
      classes, practice, projects, homework, quizzes
      progress, certificates, messages
      parent, admin
      profile, settings, subscription
  components/                 ui primitives, app shell, icons, cards
  lib/                        types, mock data, store, tts, tutor-brain
prisma/schema.prisma          intended PostgreSQL schema
```

## Connecting real services (next steps)

- **AI chat**: ✅ done — the classroom calls a real Claude model via `src/app/api/tutor/route.ts` when `ANTHROPIC_API_KEY` is set, with `src/lib/tutor-brain.ts` as the offline fallback. Extend the same pattern to Guided Practice feedback and the Messages page next.
- **Auth + DB**: swap `src/lib/store.tsx` mock for Prisma + a secure auth provider.
- **TTS/avatar/video**: `src/lib/tts.ts` already uses Web Speech; swap for a hosted voice/avatar service.
- **Payments**: wire the subscription page to a payment provider.

## Languages

UI is built to be localised. Language preference (English / हिन्दी / తెలుగు) is captured in
onboarding and settings; the system is structured to expand to more languages.
