import Link from "next/link";
import { Logo, ThemeToggle } from "@/components/brand";
import { LinkButton, Badge } from "@/components/ui";
import { categories, courses, plans } from "@/lib/data";
import { CourseCard } from "@/components/course-card";

const modes = [
  { emoji: "🎥", title: "Live AI Class", text: "Join a friendly AI tutor in a video-style classroom that greets you by name and teaches step by step." },
  { emoji: "🖐️", title: "Guided Practice", text: "Practise on your own while the tutor watches your uploads and gives safe, specific feedback." },
  { emoji: "📚", title: "Tutorial Library", text: "Short tutorials filtered by skill, age, difficulty, time, and the materials you already have." },
  { emoji: "🛠️", title: "Project Mode", text: "Build real projects — a nail-art design, a first web page, a beginner cake — one manageable step at a time." },
  { emoji: "🧠", title: "Quizzes & Checks", text: "Multiple-choice, image, voice, and reflection questions that adapt to what you're learning." },
];

const audiences = [
  { emoji: "🧒", title: "Children", text: "Shorter lessons, simpler language, safe activities, and parental controls." },
  { emoji: "🧑", title: "Teens & Adults", text: "Beginner, hobby, advanced, professional, or business-focused paths." },
  { emoji: "👵", title: "Seniors", text: "Comfortable pacing, larger text, and clear step-by-step guidance." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-border bg-bg/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
            <a href="#modes" className="hover:text-fg">How it works</a>
            <a href="#skills" className="hover:text-fg">Skills</a>
            <a href="#pricing" className="hover:text-fg">Pricing</a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login" className="hidden px-3 py-2 text-sm font-medium text-fg hover:text-primary sm:inline">
              Log in
            </Link>
            <LinkButton href="/signup" size="sm">Get started</LinkButton>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-8 pt-14 sm:px-6 sm:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <Badge tone="primary" className="mb-4">✨ AI tutors for real-world creative skills</Badge>
            <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-fg sm:text-5xl">
              Learn the skills hobby classes teach — with a tutor who joins your call.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted">
              Makeup, nail art, coding, baking, photography and more. SkillBloom gives every learner — child to senior —
              a friendly AI tutor that greets you by name, demonstrates step by step, and reviews your work.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <LinkButton href="/signup" size="lg">Start learning free</LinkButton>
              <LinkButton href="/explore" variant="outline" size="lg">Explore skills</LinkButton>
            </div>
            <p className="mt-4 text-sm text-muted">No credit card needed · 3 free courses · Works in English, हिन्दी & తెలుగు</p>
          </div>

          {/* Classroom preview mock */}
          <div className="rounded-2xl border border-border bg-surface p-3 shadow-pop">
            <div className="flex items-center gap-2 border-b border-border px-2 pb-2 text-xs text-muted">
              <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
              <span className="ml-2">Live AI Class · Nail Art for Beginners</span>
            </div>
            <div className="grid gap-2 p-2 sm:grid-cols-3">
              <div className="col-span-2 flex aspect-video flex-col items-center justify-center rounded-xl bg-accent/10 text-center">
                <div className="text-5xl" aria-hidden>💅</div>
                <p className="mt-2 px-4 text-sm font-medium text-fg">“Great! Now show me your nails when the base coat is on.”</p>
                <span className="mt-1 text-xs text-muted">Nova · your tutor</span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-1 items-center justify-center rounded-xl bg-surface-2 text-2xl" aria-hidden>🙂</div>
                <div className="rounded-xl bg-surface-2 p-2 text-[11px] text-muted">
                  <div className="mb-1 font-medium text-fg">Step 2 of 3</div>
                  Apply base coat · then upload a photo
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modes */}
      <section id="modes" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-2xl font-semibold text-fg sm:text-3xl">Five ways to learn</h2>
        <p className="mt-2 max-w-2xl text-muted">Interactive, personal, and conversational — not another recorded video to watch passively.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modes.map((m) => (
            <div key={m.title} className="rounded-2xl border border-border bg-surface p-5 shadow-card">
              <div className="text-3xl" aria-hidden>{m.emoji}</div>
              <h3 className="mt-3 font-semibold text-fg">{m.title}</h3>
              <p className="mt-1 text-sm text-muted">{m.text}</p>
            </div>
          ))}
          <div className="flex flex-col justify-center rounded-2xl border border-dashed border-border bg-surface/50 p-5">
            <p className="text-sm text-muted">And every lesson ends with feedback, homework, and a recommended next step.</p>
            <Link href="/signup" className="mt-3 text-sm font-medium text-primary hover:underline">Create your free account →</Link>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="border-y border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-2xl font-semibold text-fg sm:text-3xl">Skills you'll actually use</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((c) => (
              <span key={c.id} className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-fg">
                <span aria-hidden>{c.emoji}</span> {c.name}
              </span>
            ))}
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        </div>
      </section>

      {/* Audiences */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-2xl font-semibold text-fg sm:text-3xl">Built for every age</h2>
        <p className="mt-2 max-w-2xl text-muted">Lessons adapt to the learner's age, experience, goals, and safety needs — no fixed age limit.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {audiences.map((a) => (
            <div key={a.title} className="rounded-2xl border border-border bg-surface p-5 shadow-card">
              <div className="text-3xl" aria-hidden>{a.emoji}</div>
              <h3 className="mt-3 font-semibold text-fg">{a.title}</h3>
              <p className="mt-1 text-sm text-muted">{a.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-2xl font-semibold text-fg sm:text-3xl">Simple, fair pricing</h2>
          <p className="mt-2 text-muted">Start free. Upgrade when you're ready.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((p) => (
              <div
                key={p.id}
                className={`flex flex-col rounded-2xl border bg-surface p-5 shadow-card ${p.highlight ? "border-primary" : "border-border"}`}
              >
                {p.highlight && <Badge tone="primary" className="mb-2 self-start">Most popular</Badge>}
                <h3 className="font-semibold text-fg">{p.name}</h3>
                <p className="mt-1 text-2xl font-semibold text-fg">
                  {p.price} <span className="text-sm font-normal text-muted">/ {p.cadence}</span>
                </p>
                <p className="mt-1 text-xs text-muted">{p.audience}</p>
                <ul className="mt-4 flex-1 space-y-2 text-sm text-muted">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-success" aria-hidden>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <LinkButton href="/signup" variant={p.highlight ? "primary" : "outline"} className="mt-5" size="sm">
                  Choose {p.name}
                </LinkButton>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
        <h2 className="font-display text-3xl font-semibold text-fg">Your next skill is one class away.</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted">Join thousands of learners discovering makeup, nail art, coding and more — with a tutor who's always patient.</p>
        <div className="mt-6 flex justify-center gap-3">
          <LinkButton href="/signup" size="lg">Get started free</LinkButton>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted sm:flex-row sm:px-6">
          <Logo />
          <p>© {new Date().getFullYear()} SkillBloom. A demo AI learning platform.</p>
        </div>
      </footer>
    </div>
  );
}
