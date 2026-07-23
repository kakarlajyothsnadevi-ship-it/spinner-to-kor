"use client";

import { freeIncludes } from "@/lib/data";
import { Badge, Card, CardBody, LinkButton } from "@/components/ui";

const faqs = [
  {
    q: "Is it really free?",
    a: "Yes. Every course, AI class, quiz, project, certificate, and dashboard is free for all learners. There is no paywall and no card required.",
  },
  {
    q: "Will you charge me later?",
    a: "No hidden fees and no trial that expires. SkillBloom is free to use, for every age group.",
  },
  {
    q: "What about the AI tutor?",
    a: "The AI tutor is included free. A built-in offline tutor works with no setup; a smarter live AI can be connected by the site owner.",
  },
];

export default function SubscriptionPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="text-center">
        <Badge tone="success" className="mb-3">100% free</Badge>
        <h1 className="font-display text-2xl font-semibold text-fg">Your membership</h1>
        <p className="mt-1 text-muted">Everything on SkillBloom is free — nothing is locked behind a payment.</p>
      </div>

      {/* Free plan card */}
      <Card className="border-primary">
        <CardBody className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-fg">Free plan</h2>
                <Badge tone="success">Active</Badge>
              </div>
              <p className="text-sm text-muted">Your current — and only — plan.</p>
            </div>
            <div className="text-right">
              <div className="font-display text-3xl font-semibold text-fg">₹0</div>
              <div className="text-xs text-muted">forever</div>
            </div>
          </div>

          <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {freeIncludes.map((f) => (
              <li key={f} className="flex gap-2 text-sm text-fg">
                <span className="text-success" aria-hidden>✓</span> {f}
              </li>
            ))}
          </ul>

          <LinkButton href="/explore" className="mt-6 w-full" size="lg">
            Explore free courses
          </LinkButton>
        </CardBody>
      </Card>

      {/* FAQ */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Good to know</h2>
        {faqs.map((f) => (
          <Card key={f.q}>
            <CardBody>
              <div className="font-medium text-fg">{f.q}</div>
              <p className="mt-1 text-sm text-muted">{f.a}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
