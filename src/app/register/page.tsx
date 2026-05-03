"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ArrowRight } from "lucide-react";
import { useState, type FormEvent } from "react";
import { AuthWorkspacePanels } from "@/components/auth/AuthWorkspacePanels";
import { GuestWorkspaceShell } from "@/components/layout/GuestWorkspaceShell";
import { API } from "@/lib/constants";
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
    "rounded-xl border border-input/70 bg-background/65 px-3 py-2.5 text-sm text-foreground outline-none backdrop-blur-sm transition-[box-shadow,border-color,ring-color] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/35 dark:bg-background/35";

  return (
    <GuestWorkspaceShell mainClassName="p-0" mainScroll={false} showBottomGlow={false}>
      <AuthWorkspacePanels
        variant="register"
        alternateAuth={{
          href: "/login",
          label: "Sign in instead",
          prefix: "Already have an account?",
        }}
      >
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          {error ? (
            <div
              className="rounded-xl border border-destructive/45 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              role="alert"
              aria-live="assertive"
            >
              {error}
            </div>
          ) : null}

          <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
            Display name{" "}
            <span className="text-xs font-normal text-muted-foreground">(optional — shows in chat)</span>
            <input
              type="text"
              autoComplete="name"
              placeholder="Alex"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={fieldClass}
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
            Email address
            <input
              type="email"
              autoComplete="email"
              required
              inputMode="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={fieldClass}
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
            Password
            <input
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={fieldClass}
            />
            <span className="text-xs font-normal leading-relaxed text-muted-foreground">
              Use a unique password; credentials are hashed before storage.
            </span>
          </label>

          <button
            type="submit"
            disabled={pending}
            className={cn(
              "mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground shadow-md shadow-primary/25 ring-1 ring-black/5 transition-opacity hover:opacity-95 disabled:pointer-events-none disabled:opacity-45 dark:ring-white/10",
            )}
          >
            {pending ? (
              "Creating your workspace…"
            ) : (
              <>
                Create account & enter chat
                <ArrowRight className="size-4 opacity-90" aria-hidden />
              </>
            )}
          </button>

          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            After registration we sign you in automatically and redirect to chat. Passwords are hashed before storage.
          </p>
        </form>
      </AuthWorkspacePanels>
    </GuestWorkspaceShell>
  );
}
