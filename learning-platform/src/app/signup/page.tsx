"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Logo, ThemeToggle } from "@/components/brand";
import { Button, Card, CardBody, Input, Label } from "@/components/ui";

export default function SignupPage() {
  const { signup } = useStore();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Please tell us your name.";
    if (!email.includes("@")) next.email = "Please enter a valid email.";
    if (password.length < 6) next.password = "Use at least 6 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;
    signup(name.trim(), email);
    router.push("/onboarding");
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Logo />
        <ThemeToggle />
      </header>
      <div className="mx-auto flex max-w-md flex-col px-4 py-10 sm:px-6">
        <h1 className="font-display text-3xl font-semibold text-fg">Create your account</h1>
        <p className="mt-1 text-muted">Free to start. We'll personalise your learning next.</p>

        <Card className="mt-6">
          <CardBody>
            <form onSubmit={submit} className="space-y-4" noValidate>
              <div>
                <Label htmlFor="name">Your name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Aanya" />
                {errors.name && <p className="mt-1 text-sm text-danger">{errors.name}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                {errors.email && <p className="mt-1 text-sm text-danger">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
                {errors.password && <p className="mt-1 text-sm text-danger">{errors.password}</p>}
              </div>
              <Button type="submit" className="w-full" size="lg">Create account</Button>
              <p className="text-center text-xs text-muted">
                By continuing you agree to our friendly, demo-only Terms. For child accounts, a parent should complete setup.
              </p>
            </form>
          </CardBody>
        </Card>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
