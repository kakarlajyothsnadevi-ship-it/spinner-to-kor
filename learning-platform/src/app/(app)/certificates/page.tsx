"use client";

import { certificates } from "@/lib/data";
import { useStore } from "@/lib/store";
import { Badge, Button, Card, CardBody, EmptyState, LinkButton } from "@/components/ui";
import { Logo } from "@/components/brand";

export default function CertificatesPage() {
  const { user } = useStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-fg">Certificates</h1>
        <p className="mt-1 text-muted">Completed courses earn a shareable certificate.</p>
      </div>

      {certificates.length === 0 ? (
        <EmptyState emoji="🎓" title="No certificates yet" description="Finish a course to earn your first certificate." action={<LinkButton href="/explore">Find a course</LinkButton>} />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {certificates.map((c) => (
            <div key={c.id} className="rounded-2xl border border-border bg-surface p-6 shadow-card">
              {/* Certificate design — bordered, typographic, no decorative gradients */}
              <div className="rounded-xl border-2 border-primary/30 p-6 text-center">
                <Logo href="/certificates" className="justify-center" />
                <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted">Certificate of Completion</p>
                <p className="mt-4 text-sm text-muted">This certifies that</p>
                <p className="mt-1 font-display text-2xl font-semibold text-fg">{user?.name}</p>
                <p className="mt-3 text-sm text-muted">has successfully completed</p>
                <p className="mt-1 text-lg font-semibold text-fg">{c.courseName}</p>
                <div className="mt-4 flex items-center justify-center gap-3 text-xs text-muted">
                  <span>Tutor: {c.tutorName}</span>
                  <span aria-hidden>·</span>
                  <span>Issued {new Date(c.issuedOn).toLocaleDateString()}</span>
                </div>
                <Badge tone="accent" className="mt-3">{c.category}</Badge>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => window.print()}>Download / Print</Button>
                <Button variant="outline" size="sm" className="flex-1">Share</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
