"use client";

import { useState } from "react";
import { getTutor, tutors } from "@/lib/data";
import { useStore } from "@/lib/store";
import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";

type Msg = { from: "tutor" | "me"; text: string };

const seed: Record<string, Msg[]> = {
  "t-nova": [
    { from: "tutor", text: "Lovely work on your nail base coat! Ready for the colour coats when you are. 💅" },
    { from: "me", text: "Thanks Nova! My second coat looked a bit streaky." },
    { from: "tutor", text: "That usually means the coat was a touch thick or not fully dry. Thin coats and a little patience fix it every time." },
  ],
  "t-maya": [
    { from: "tutor", text: "Hi! Whenever you're ready for the everyday makeup class, I'm here. No rush at all. 🎨" },
  ],
  "t-kai": [
    { from: "tutor", text: "Your first heading rendered perfectly. Next we'll add a paragraph and a list." },
  ],
};

export default function MessagesPage() {
  const { user } = useStore();
  const [activeId, setActiveId] = useState(tutors[0].id);
  const [threads, setThreads] = useState<Record<string, Msg[]>>(seed);
  const [input, setInput] = useState("");
  const active = getTutor(activeId);
  const msgs = threads[activeId] ?? [];

  function send() {
    const text = input.trim();
    if (!text) return;
    setThreads((t) => ({ ...t, [activeId]: [...(t[activeId] ?? []), { from: "me", text }] }));
    setInput("");
    setTimeout(() => {
      setThreads((t) => ({
        ...t,
        [activeId]: [...(t[activeId] ?? []), { from: "tutor", text: `Great question, ${user?.name ?? "there"} — I'll walk you through it in our next class. Keep it up!` }],
      }));
    }, 500);
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-semibold text-fg">Messages</h1>
      <Card className="grid overflow-hidden md:grid-cols-[220px_1fr]" >
        {/* Tutor list */}
        <div className="border-b border-border md:border-b-0 md:border-r">
          {tutors.map((t) => {
            const last = (threads[t.id] ?? [])[(threads[t.id] ?? []).length - 1];
            return (
              <button
                key={t.id}
                onClick={() => setActiveId(t.id)}
                className={cn("flex w-full items-center gap-3 border-b border-border p-3 text-left last:border-b-0", activeId === t.id ? "bg-surface-2" : "hover:bg-surface-2/60")}
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-lg text-white" style={{ backgroundColor: `hsl(${t.color})` }} aria-hidden>{t.emoji}</span>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-fg">{t.name}</div>
                  <div className="truncate text-xs text-muted">{last?.text ?? "Say hello"}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Thread */}
        <div className="flex min-h-[24rem] flex-col">
          <div className="flex items-center gap-2 border-b border-border p-3">
            <span className="grid h-8 w-8 place-items-center rounded-full text-white" style={{ backgroundColor: `hsl(${active?.color})` }} aria-hidden>{active?.emoji}</span>
            <div>
              <div className="text-sm font-medium text-fg">{active?.name}</div>
              <div className="text-xs text-muted">{active?.tagline}</div>
            </div>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto p-4 scroll-slim">
            {msgs.map((m, i) => (
              <div key={i} className={cn("flex", m.from === "me" ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-[80%] rounded-2xl px-3 py-2 text-sm", m.from === "me" ? "bg-primary text-primary-fg" : "bg-surface-2 text-fg")}>{m.text}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 border-t border-border p-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={`Message ${active?.name}…`}
              className="flex-1 rounded-xl border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none"
            />
            <button onClick={send} className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-fg hover:bg-primary/90">Send</button>
          </div>
        </div>
      </Card>
    </div>
  );
}
