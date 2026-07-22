import Link from "next/link";
import { Logo } from "@/components/brand";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-bg px-4 text-center">
      <div>
        <Logo className="justify-center" />
        <div className="mt-6 text-5xl" aria-hidden>🧭</div>
        <h1 className="mt-3 font-display text-2xl font-semibold text-fg">Page not found</h1>
        <p className="mt-1 text-muted">That page wandered off. Let's get you back on track.</p>
        <Link href="/" className="mt-5 inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-fg hover:bg-primary/90">
          Back to home
        </Link>
      </div>
    </div>
  );
}
