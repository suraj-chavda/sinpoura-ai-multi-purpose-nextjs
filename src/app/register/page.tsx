"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState, type FormEvent } from "react";
import { API } from "@/lib/constants";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";

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

  const fieldClass =
    "rounded-xl border border-input bg-muted/40 px-3 py-2 text-sm text-foreground outline-none transition-[box-shadow,border-color] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/35";

  return (
    <div className={cn("flex min-h-dvh flex-col bg-background app-shell-gradient")}>
      <Header />
      <div className="flex flex-1 items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card/90 p-8 shadow-lg shadow-black/5 backdrop-blur-md dark:bg-card/80 dark:shadow-black/40">
          <h1 className="text-xl font-medium tracking-tight text-card-foreground">Create account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Already registered?{" "}
            <Link href="/login" className="font-medium text-foreground underline underline-offset-4 hover:text-primary">
              Sign in
            </Link>
          </p>
          <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">
            {error ? (
              <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            ) : null}
            <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
              Name (optional)
              <input type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={fieldClass} />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
              Email
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={fieldClass}
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
              Password (8+ characters)
              <input
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={fieldClass}
              />
            </label>
            <button
              type="submit"
              disabled={pending}
              className="mt-1 rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-45"
            >
              {pending ? "Creating…" : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
