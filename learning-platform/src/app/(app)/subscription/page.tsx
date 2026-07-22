"use client";

import { useState } from "react";
import { plans } from "@/lib/data";
import { Badge, Button, Card, CardBody } from "@/components/ui";

const extraPlans = [
  { id: "course", name: "Single course", price: "₹299", cadence: "one-time", audience: "One skill", features: ["Lifetime access to one course", "All lessons & projects", "Certificate on completion"] },
  { id: "children", name: "Children's plan", price: "₹399", cadence: "per month", audience: "Under 13", features: ["Age-appropriate courses", "Parental controls", "Extra safety review", "Shorter lessons"] },
  { id: "premium", name: "Premium tutor", price: "₹1,299", cadence: "per month", audience: "1:1 focus", features: ["Priority AI reviews", "Advanced projects", "Career guidance", "Everything in Annual"] },
];

export default function SubscriptionPage() {
  const [current, setCurrent] = useState("free");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-fg">Subscription</h1>
        <p className="mt-1 text-muted">You're on the <span className="font-medium text-fg capitalize">{current}</span> plan. Upgrade anytime.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((p) => (
          <Card key={p.id} className={p.highlight ? "border-primary" : ""}>
            <CardBody className="flex h-full flex-col">
              {p.highlight && <Badge tone="primary" className="mb-2 self-start">Most popular</Badge>}
              {current === p.id && <Badge tone="success" className="mb-2 self-start">Current plan</Badge>}
              <h3 className="font-semibold text-fg">{p.name}</h3>
              <p className="mt-1 text-2xl font-semibold text-fg">{p.price}<span className="text-sm font-normal text-muted"> / {p.cadence}</span></p>
              <p className="mt-1 text-xs text-muted">{p.audience}</p>
              <ul className="mt-4 flex-1 space-y-2 text-sm text-muted">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2"><span className="text-success" aria-hidden>✓</span>{f}</li>
                ))}
              </ul>
              <Button
                variant={current === p.id ? "outline" : p.highlight ? "primary" : "outline"}
                size="sm"
                className="mt-5"
                disabled={current === p.id}
                onClick={() => setCurrent(p.id)}
              >
                {current === p.id ? "Current" : `Choose ${p.name}`}
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>

      <h2 className="pt-2 text-sm font-semibold uppercase tracking-wide text-muted">More options</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {extraPlans.map((p) => (
          <Card key={p.id}>
            <CardBody className="flex h-full flex-col">
              <h3 className="font-semibold text-fg">{p.name}</h3>
              <p className="mt-1 text-xl font-semibold text-fg">{p.price}<span className="text-sm font-normal text-muted"> / {p.cadence}</span></p>
              <p className="mt-1 text-xs text-muted">{p.audience}</p>
              <ul className="mt-3 flex-1 space-y-1.5 text-sm text-muted">
                {p.features.map((f) => <li key={f} className="flex gap-2"><span className="text-success" aria-hidden>✓</span>{f}</li>)}
              </ul>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => setCurrent(p.id)}>Select</Button>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <CardBody className="text-sm text-muted">
          <span className="font-medium text-fg">Demo billing.</span> No real payment is processed. In production this connects to a payment provider with secure checkout, invoices, and family seat management.
        </CardBody>
      </Card>
    </div>
  );
}
