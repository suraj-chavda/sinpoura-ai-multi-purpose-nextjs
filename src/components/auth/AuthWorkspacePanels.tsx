"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { APP_NAME, DEMO_APP_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

const eyebrow =
  "text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:text-[11px]";

type Variant = "login" | "register";

const copy: Record<
  Variant,
  {
    eyebrow: string;
    headline: string;
    lede: string;
    bullets: string[];
    cardEyebrow: string;
    cardTitle: string;
    cardHint: string;
  }
> = {
  login: {
    eyebrow: "Secure session",
    headline: "Welcome back to your workspace",
    lede: "Sign in with email and password. Your threads stay in MongoDB—pick up exactly where you left off.",
    bullets: [
      "Persisted conversations and sidebar history",
      "OpenAI & Anthropic through xoin-js's structured multi-LLM layer on the server",
      "Host API keys or bring your own in Model settings",
      "MIT-licensed stack you can fork and extend",
    ],
    cardEyebrow: "Credentials",
    cardTitle: "Sign in",
    cardHint: "Use the email and password you registered with.",
  },
  register: {
    eyebrow: "Create your account",
    headline: "Start chatting in minutes",
    lede: "One account unlocks the full workspace: saved chats, model picker, and BYOK—no credit card for this template.",
    bullets: [
      "Free registration · conversations tied to your account",
      "Threads stored securely—not in anonymous cookies",
      "Configure models after sign-up (env keys or browser BYOK)",
      "Built with Next.js, MongoDB, Auth.js, and Zustand",
    ],
    cardEyebrow: "New account",
    cardTitle: "Create account",
    cardHint: "8+ characters for password. You can add your display name later.",
  },
};

function BulletRow({ text }: { text: string }) {
  return (
    <li className="flex gap-3 text-left">
      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-lg bg-primary/14 ring-1 ring-primary/20 dark:bg-primary/22 dark:ring-primary/30">
        <Check className="size-3.5 text-primary" aria-hidden />
      </span>
      <span className="text-[13px] leading-relaxed text-foreground/95 sm:text-sm">{text}</span>
    </li>
  );
}

function AsidePanel({ variant }: { variant: Variant }) {
  const c = copy[variant];
  return (
    <div className="relative z-[1] flex flex-col justify-between gap-8">
      <div className="space-y-5">
        <Link
          href="/"
          className="inline-flex touch-manipulation items-center gap-2.5 text-sm font-medium tracking-tight text-foreground transition-colors hover:text-primary"
        >
          <Image src="/logo.svg" alt="" width={28} height={28} className="size-7 shrink-0" />
          <span>{APP_NAME}</span>
        </Link>
        <div>
          <p className={eyebrow}>{c.eyebrow}</p>
          <h2 className="font-heading mt-3 text-balance text-2xl font-medium tracking-tight text-foreground xl:text-3xl">
            {c.headline}
          </h2>
          <p className="mt-3 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
            {c.lede}
          </p>
        </div>
        <ul className="flex flex-col gap-3.5 pt-1">
          {c.bullets.map((b, i) => (
            <BulletRow key={i} text={b} />
          ))}
        </ul>
      </div>

      <div className="space-y-5 border-t border-border/50 pt-8 dark:border-white/[0.08]">
        <a
          href={DEMO_APP_URL}
          className="inline-flex touch-manipulation items-center gap-1 text-sm font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary"
          target="_blank"
          rel="noreferrer"
        >
          Try the hosted demo first
          <ChevronRight className="size-4 opacity-70" aria-hidden />
        </a>
        <div className="flex flex-wrap gap-2">
          {["MIT", "Next.js", "MongoDB", "Auth.js"].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border/70 bg-background/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur-sm dark:bg-background/35"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

type Props = {
  variant: Variant;
  /** Alternate auth link shown under the card title */
  alternateAuth: { href: string; label: string; prefix: string };
  children: ReactNode;
};

export function AuthWorkspacePanels({ variant, alternateAuth, children }: Props) {
  const c = copy[variant];

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col lg:flex-row lg:items-stretch">
      {/* Desktop aside only — mobile uses GuestTopBar + single-column form (no duplicate hero band). */}
      <aside
        className={cn(
          "relative hidden min-h-0 lg:flex lg:w-[min(42%,26rem)] xl:w-[min(40%,28rem)] lg:shrink-0 lg:flex-col lg:overflow-y-auto lg:overscroll-contain",
          "border-border/70 bg-gradient-to-br from-sidebar-primary/[0.1] via-background to-sidebar-accent/25 dark:border-white/[0.06] dark:from-sidebar-primary/[0.14] dark:to-sidebar-accent/14 lg:border-r",
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_90%_at_0%_0%,var(--sidebar-primary)_0%,transparent_58%)] opacity-[0.2] dark:opacity-[0.28]"
        />
        <div className="relative flex flex-col p-10 xl:p-12">
          <AsidePanel variant={variant} />
        </div>
      </aside>

      {/* Mobile + desktop form column — one scroll region on mobile (full width); inset pane on lg */}
      <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden">
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 opacity-[0.35] lg:opacity-[0.35]",
            "bg-[radial-gradient(ellipse_70%_55%_at_70%_15%,var(--accent)_0%,transparent_68%)]",
          )}
        />

        <div
          className={cn(
            "relative z-[1] flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain",
            "px-4 sm:px-6 lg:px-10 lg:pt-8 xl:px-14",
            "pb-[max(1rem,env(safe-area-inset-bottom))] lg:pb-10",
          )}
        >
          {/* Mobile / tablet: flex spacers vertically center the form when it fits; collapse when content scrolls. */}
          <div className="flex min-h-full flex-col lg:block lg:min-h-0">
            <div className="min-h-0 flex-1 basis-0 lg:hidden" aria-hidden />
            <div className="mx-auto w-full max-w-[440px] shrink-0 py-5 sm:py-6 lg:py-0 lg:pb-4 lg:pt-1">
              <div className="mb-5 text-center lg:mb-6 lg:text-left">
                <p className={eyebrow}>{c.cardEyebrow}</p>
                <h1 className="font-heading mt-2 text-balance text-[1.375rem] font-medium leading-snug tracking-tight text-foreground sm:text-2xl sm:text-[1.65rem]">
                  {c.cardTitle}
                </h1>
                <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">{c.cardHint}</p>
                <p className="mt-3 text-sm text-muted-foreground">
                  {alternateAuth.prefix}{" "}
                  <Link
                    href={alternateAuth.href}
                    className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary"
                  >
                    {alternateAuth.label}
                  </Link>
                </p>
              </div>

              <div
                className={cn(
                  "chat-composer-surface overflow-hidden shadow-lg shadow-black/[0.06] dark:shadow-black/30",
                  "ring-1 ring-border/60 dark:ring-white/[0.07]",
                )}
              >
                <div
                  className={cn(
                    "border-b border-border/70 bg-gradient-to-r from-sidebar-primary/[0.12] via-transparent to-sidebar-accent/25 px-5 py-2.5 dark:border-white/[0.06] dark:from-sidebar-primary/18 dark:to-sidebar-accent/15 sm:px-8 sm:py-3",
                  )}
                >
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    {variant === "login" ? "Email sign-in" : "Registration"}
                  </p>
                </div>
                <div className="p-5 sm:p-8">{children}</div>
              </div>

              <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground lg:mt-8 lg:text-left">
                <Link href="/" className="touch-manipulation font-medium text-foreground underline underline-offset-4 hover:text-primary">
                  ← Back to home
                </Link>
                <span className="mx-2 text-border">·</span>
                <span className="inline sm:inline">Sessions use secure cookies via Auth.js.</span>
              </p>
            </div>
            <div className="min-h-0 flex-1 basis-0 lg:hidden" aria-hidden />
          </div>
        </div>
      </div>
    </div>
  );
}
