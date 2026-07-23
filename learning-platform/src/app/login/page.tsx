"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Logo, ThemeToggle } from "@/components/brand";
import { Button, Card, CardBody, Input, Label } from "@/components/ui";

export default function LoginPage() {
  const { login } = useStore();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    const user = login(email);
    router.push(user.role === "parent" ? "/parent" : user.role === "admin" ? "/admin" : "/dashboard");
  }

  function quick(role: string) {
    const user = login(`${role}@skillbloom.app`);
    router.push(user.role === "parent" ? "/parent" : user.role === "admin" ? "/admin" : "/dashboard");
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Logo />
        <ThemeToggle />
      </header>
      <div className="mx-auto flex max-w-md flex-col px-4 py-10 sm:px-6">
        <h1 className="font-display text-3xl font-semibold text-fg">Welcome back</h1>
        <p className="mt-1 text-muted">Log in to continue learning.</p>

        <Card className="mt-6">
          <CardBody>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
              </div>
              {error && <p className="text-sm text-danger" role="alert">{error}</p>}
              <Button type="submit" className="w-full" size="lg">Log in</Button>
            </form>
          </CardBody>
        </Card>

        <div className="mt-5">
          <p className="mb-2 text-center text-xs uppercase tracking-wide text-muted">Or try a demo account</p>
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" onClick={() => quick("learner")}>Learner</Button>
            <Button variant="outline" size="sm" onClick={() => quick("parent")}>Parent</Button>
            <Button variant="outline" size="sm" onClick={() => quick("admin")}>Admin</Button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          New here?{" "}
          <Link href="/signup" className="font-medium text-primary hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
