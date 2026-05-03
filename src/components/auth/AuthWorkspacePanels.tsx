"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, ChevronRight, Sparkles } from "lucide-react";
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
    mobileTagline: string;
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
    mobileTagline: "Multi-model chat · MongoDB threads · Auth.js",
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
    mobileTagline: "Free account · Real persistence · Production-shaped API",
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

function AsideContent({ variant, compact }: { variant: Variant; compact?: boolean }) {
  const c = copy[variant];
  return (
    <div className={cn("relative z-[1] flex flex-col", compact ? "gap-5" : "h-full justify-between gap-8")}>
      <div className="space-y-5">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 text-sm font-medium tracking-tight text-foreground transition-colors hover:text-primary"
        >
          <Image src="/logo.svg" alt="" width={28} height={28} className="size-7 shrink-0" />
          <span>{APP_NAME}</span>
        </Link>
        {!compact ? (
          <>
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
          </>
        ) : (
          <div className="space-y-2">
            <p className={eyebrow}>{c.eyebrow}</p>
            <p className="text-pretty text-sm font-medium leading-snug text-foreground">{c.headline}</p>
            <p className="text-pretty text-xs leading-relaxed text-muted-foreground sm:text-[13px]">{c.mobileTagline}</p>
          </div>
        )}
      </div>

      {!compact ? (
        <div className="space-y-5 border-t border-border/50 pt-8 dark:border-white/[0.08]">
          <a
            href={DEMO_APP_URL}
            className="inline-flex items-center gap-1 text-sm font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary"
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
      ) : (
        <a
          href={DEMO_APP_URL}
          className="inline-flex items-center gap-1 text-xs font-medium text-foreground underline underline-offset-4 hover:text-primary sm:text-sm"
          target="_blank"
          rel="noreferrer"
        >
          Live demo
          <ChevronRight className="size-3.5 opacity-70" aria-hidden />
        </a>
      )}
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
      {/* Mobile / tablet intro — fixed height band; does not scroll with the form */}
      <div
        className={cn(
          "relative shrink-0 overflow-hidden border-b border-border/70 lg:hidden",
          "bg-gradient-to-br from-sidebar-primary/[0.14] via-background to-sidebar-accent/30 dark:from-sidebar-primary/22 dark:via-background dark:to-sidebar-accent/18",
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_120%_at_100%_-20%,var(--sidebar-primary)_0%,transparent_55%)] opacity-[0.35] dark:opacity-[0.45]"
        />
        <div className="relative px-4 py-7 sm:px-6 sm:py-8">
          <AsideContent variant={variant} compact />
        </div>
      </div>

      {/* Desktop aside — independent scroll only if marketing copy exceeds viewport */}
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
          <AsideContent variant={variant} />
        </div>
      </aside>

      {/* Form column — only this pane scrolls (heading + card + footer together) */}
      <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden lg:min-h-0">
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 opacity-[0.4] lg:opacity-[0.35]",
            "bg-[radial-gradient(ellipse_70%_55%_at_70%_15%,var(--accent)_0%,transparent_68%)]",
          )}
        />

        <div
          className={cn(
            "relative z-[1] flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain",
            "px-4 pt-6 sm:px-8 sm:pt-8 lg:px-10 lg:pt-8 xl:px-14",
            "pb-[max(1.25rem,env(safe-area-inset-bottom))] lg:pb-10",
          )}
        >
          <div className="mx-auto w-full max-w-[440px] pb-4 pt-1">
            <div className="mb-6 text-center lg:text-left">
              <div className="mb-4 inline-flex lg:hidden">
                <span className="chat-starter-tile flex size-12 items-center justify-center rounded-2xl">
                  <Sparkles className="size-6 text-primary" aria-hidden />
                </span>
              </div>
              <p className={eyebrow}>{c.cardEyebrow}</p>
              <h1 className="font-heading mt-2 text-balance text-2xl font-medium tracking-tight text-foreground sm:text-[1.65rem]">
                {c.cardTitle}
              </h1>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">{c.cardHint}</p>
              <p className="mt-4 text-sm text-muted-foreground">
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
                  "border-b border-border/70 bg-gradient-to-r from-sidebar-primary/[0.12] via-transparent to-sidebar-accent/25 px-6 py-3 dark:border-white/[0.06] dark:from-sidebar-primary/18 dark:to-sidebar-accent/15 sm:px-8",
                )}
              >
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  {variant === "login" ? "Email sign-in" : "Registration"}
                </p>
              </div>
              <div className="p-6 sm:p-8">{children}</div>
            </div>

            <p className="mt-8 pb-2 text-center text-xs leading-relaxed text-muted-foreground lg:text-left">
              <Link href="/" className="font-medium text-foreground underline underline-offset-4 hover:text-primary">
                ← Back to home
              </Link>
              <span className="mx-2 text-border">·</span>
              Sessions use secure cookies via Auth.js—never share your password.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
