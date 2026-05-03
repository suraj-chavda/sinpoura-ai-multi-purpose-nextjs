"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState, type FormEvent } from "react";
import { API } from "@/lib/constants";
import { Header } from "@/components/layout/Header";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const res = await fetch(API.register, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: name || undefined, email, password }),
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      setError(body.error ?? "Registration failed");
      setPending(false);
      return;
    }
    const sign = await signIn("credentials", { email, password, redirect: false });
    setPending(false);
    if (sign?.error) {
      setError("Account created but sign-in failed. Try logging in.");
      return;
    }
    router.replace("/chat");
    router.refresh();
  }

  return (
    <div className="flex min-h-full flex-col bg-zinc-100 dark:bg-zinc-950">
      <Header />
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h1 className="text-lg tracking-tight text-zinc-900 dark:text-zinc-100">Create account</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Already registered?{" "}
            <Link href="/login" className="text-zinc-800 underline dark:text-zinc-200">
              Sign in
            </Link>
          </p>
          <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
            {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
            <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
              Name (optional)
              <input
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-900 outline-none ring-zinc-400/30 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
              Email
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-900 outline-none ring-zinc-400/30 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
              Password (8+ characters)
              <input
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-900 outline-none ring-zinc-400/30 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </label>
            <button
              type="submit"
              disabled={pending}
              className="mt-2 rounded-lg bg-zinc-900 py-2.5 text-sm text-zinc-50 transition enabled:hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:enabled:hover:bg-zinc-200"
            >
              {pending ? "Creating…" : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
