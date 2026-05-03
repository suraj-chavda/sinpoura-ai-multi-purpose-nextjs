import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { APP_NAME } from "@/lib/constants";
import { Header } from "@/components/layout/Header";

export default async function HomePage() {
  const session = await auth();
  if (session?.user) redirect("/chat");

  return (
    <div className="flex min-h-full flex-col bg-zinc-100 dark:bg-zinc-950">
      <Header />
      <main className="mx-auto flex max-w-2xl flex-1 flex-col justify-center gap-8 px-4 py-16">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-wide text-zinc-500 dark:text-zinc-500">Portfolio template</p>
          <h1 className="text-3xl tracking-tight text-zinc-900 dark:text-zinc-100">{APP_NAME}</h1>
          <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Multi-purpose AI chat with MongoDB persistence, Zustand UI state, and{" "}
            <a
              href="https://github.com/kanha95/xoin-js"
              className="text-zinc-800 underline dark:text-zinc-200"
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
            className="rounded-xl bg-zinc-900 px-5 py-2.5 text-sm text-zinc-50 transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Get started
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-zinc-300 px-5 py-2.5 text-sm text-zinc-800 transition hover:bg-white dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
          >
            Sign in
          </Link>
        </div>
      </main>
    </div>
  );
}
