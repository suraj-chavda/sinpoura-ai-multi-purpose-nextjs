import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Header } from "@/components/layout/Header";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default async function HomePage() {
  const session = await auth();
  if (session?.user) redirect("/chat");

  return (
    <div className={cn("flex min-h-dvh flex-col bg-background app-shell-gradient")}>
      <Header />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-10 px-4 py-16 md:py-24">
        <div className="space-y-4">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Portfolio template</p>
          <h1 className="font-heading text-3xl font-medium tracking-tight text-foreground md:text-4xl">{APP_NAME}</h1>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            Multi-purpose AI chat with MongoDB persistence, Zustand UI state, and{" "}
            <a
              href="https://github.com/kanha95/xoin-js"
              className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary"
              target="_blank"
              rel="noreferrer"
            >
              xoin-js
            </a>{" "}
            on the server. Register, add your keys, and ship.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
          >
            Get started
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Sign in
          </Link>
        </div>
      </main>
    </div>
  );
}
