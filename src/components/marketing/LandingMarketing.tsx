import Image from "next/image";
import Link from "next/link";
import type { ComponentType } from "react";
import {
  ArrowRight,
  ChevronRight,
  Database,
  FolderGit2,
  KeyRound,
  Layers,
  LayoutDashboard,
  Lock,
  MessageSquareText,
  Sparkles,
  Zap,
} from "lucide-react";
import { NavBreadcrumb } from "@/components/layout/NavBreadcrumb";
import { APP_NAME, DEMO_APP_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

const XOIN_GITHUB = "https://github.com/kanha95/xoin-js";
const XOIN_NPM = "https://www.npmjs.com/package/@xoin/xoin-js";

const eyebrow = "text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:text-[11px]";

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  description: string;
}) {
  return (
    <div
      className={cn(
        "chat-starter-tile motion-safe:transition-[transform,box-shadow,border-color,ring-color,background-color] motion-safe:duration-200",
        "flex flex-col gap-3 p-4 text-left sm:p-5",
        "hover:border-ring/40 hover:bg-accent/35 hover:shadow-md hover:shadow-black/[0.05] hover:ring-ring/25 motion-safe:hover:-translate-y-px",
        "dark:hover:bg-accent/20 dark:hover:ring-white/[0.08]",
      )}
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 ring-1 ring-primary/15 dark:bg-primary/18 dark:ring-primary/25">
        <Icon className="size-5 text-primary" aria-hidden />
      </div>
      <div className="min-w-0 space-y-1">
        <h3 className="font-heading text-sm font-medium tracking-tight text-foreground sm:text-[15px]">{title}</h3>
        <p className="text-pretty text-[13px] leading-relaxed text-muted-foreground sm:text-sm">{description}</p>
      </div>
    </div>
  );
}

export function LandingMarketing() {
  return (
    <div className="relative flex min-h-full w-full flex-col pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]">
      {/* Wayfinding — mirrors chat breadcrumb rhythm; especially helpful on small screens below the top bar. */}
      <div className="border-b border-border/60 bg-background/90 px-4 py-2.5 backdrop-blur-md supports-[backdrop-filter]:bg-background/75 sm:px-6 md:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <NavBreadcrumb
            items={[
              { label: APP_NAME },
              { label: "Product overview" },
            ]}
          />
        </div>
      </div>

      {/* Hero */}
      <section className="relative px-4 pb-16 pt-7 sm:px-6 sm:pb-20 sm:pt-12 md:px-8 md:pb-24 md:pt-16">
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 opacity-[0.55]",
            "bg-[radial-gradient(ellipse_72%_52%_at_50%_14%,var(--accent)_0%,transparent_68%)]",
          )}
        />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
          <div className="chat-starter-tile mb-5 flex size-14 shrink-0 items-center justify-center sm:mb-6 sm:size-[3.75rem]">
            <Image src="/logo.svg" alt="" width={36} height={36} className="size-9 sm:size-10" priority />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className={cn(eyebrow, "rounded-full border border-border/80 bg-background/60 px-3 py-1 backdrop-blur-sm")}>
              Open source · MIT
            </span>
            <span className={cn(eyebrow, "rounded-full border border-border/80 bg-background/60 px-3 py-1 backdrop-blur-sm")}>
              Next.js App Router
            </span>
          </div>

          <p className={cn(eyebrow, "mt-5")}>
            Multi-model AI chat ·{" "}
            <a
              href={DEMO_APP_URL}
              className="inline-flex items-center gap-0.5 font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary"
              target="_blank"
              rel="noreferrer"
            >
              Try the live demo
              <ChevronRight className="size-3.5 opacity-70" aria-hidden />
            </a>
          </p>

          <h1 className="font-heading mt-3 max-w-[22rem] text-balance text-3xl font-medium tracking-tight text-foreground sm:max-w-2xl sm:text-4xl md:text-[2.65rem] md:leading-[1.12]">
            Ship a real chat product—not a weekend prototype
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-[15px] leading-relaxed text-muted-foreground sm:text-lg">
            <strong>{APP_NAME}</strong> is a full-stack AI workspace: accounts, persisted threads in MongoDB, and
            generation through{" "}
            <a href={XOIN_GITHUB} className="font-medium text-foreground underline decoration-border underline-offset-4 hover:text-primary">
              xoin-js
            </a>
            —a powerful structured multi-LLM toolkit so OpenAI, Anthropic, and other providers share one coherent server
            runtime. Use host keys, bring-your-own-key from the browser, or both—then own the UI and routes on top.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/register"
              className={cn(
                "touch-manipulation inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-md shadow-primary/25 ring-1 ring-black/5 transition-opacity hover:opacity-95 active:opacity-90 dark:ring-white/10",
              )}
            >
              Create free account
              <ArrowRight className="size-4 opacity-90" aria-hidden />
            </Link>
            <Link
              href="/login"
              className={cn(
                "chat-starter-tile touch-manipulation motion-safe:transition-[transform,box-shadow,border-color,ring-color,background-color] motion-safe:duration-200",
                "inline-flex min-h-[44px] items-center justify-center rounded-xl px-6 py-3 text-sm font-medium text-foreground",
                "hover:border-ring/40 hover:bg-accent/35 hover:shadow-md hover:shadow-black/[0.05] hover:ring-ring/25 motion-safe:hover:-translate-y-px active:opacity-90",
                "dark:hover:bg-accent/20 dark:hover:ring-white/[0.08]",
              )}
            >
              Sign in
            </Link>
          </div>

          <p className="mt-6 max-w-md text-center text-xs leading-relaxed text-muted-foreground">
            Package:{" "}
            <a href={XOIN_NPM} className="font-medium text-foreground underline underline-offset-2 hover:text-primary">
              @xoin/xoin-js
            </a>
            —full multi-provider docs and APIs ship with the library; Sinpoura shows how to wire them in production.
          </p>
        </div>
      </section>

      {/* Stack */}
      <section className="relative border-y border-border/60 bg-sidebar-primary/[0.06] px-4 py-8 dark:bg-sidebar-primary/[0.09] sm:px-6 md:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-4">
          <p className={cn(eyebrow, "text-center")}>Built with</p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {[
              "Next.js 16",
              "React 19",
              "MongoDB",
              "Auth.js",
              "Zustand",
              "Tailwind v4",
              "xoin-js",
            ].map((label) => (
              <span
                key={label}
                className={cn(
                  "rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-sm",
                  "ring-1 ring-border/40 dark:bg-background/40 dark:ring-white/[0.06]",
                )}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative px-4 py-16 sm:px-6 md:px-8 md:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-48 opacity-[0.35] bg-[radial-gradient(ellipse_80%_70%_at_50%_0%,var(--accent)_0%,transparent_75%)]"
        />
        <div className="relative mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className={eyebrow}>Why teams pick this template</p>
            <h2 className="font-heading mt-3 text-balance text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
              Persistence, auth, and LLMs—already wired
            </h2>
            <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
              Skip rebuilding login walls and message stores. Focus on prompts, models, and the product layer on top.
            </p>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            <FeatureCard
              icon={Database}
              title="MongoDB conversations"
              description="Threads and messages live in the database—reload, revisit, and delete with real CRUD, not session-only state."
            />
            <FeatureCard
              icon={Layers}
              title="Structured multi-model runtime"
              description="xoin-js orchestrates OpenAI, Anthropic, and more behind one powerful generate-shaped pipeline—add providers without forking your UI."
            />
            <FeatureCard
              icon={KeyRound}
              title="Hosted keys or BYOK"
              description="Set API keys on the server for shared quotas, or let users paste keys stored only in the browser—secrets never land in MongoDB."
            />
            <FeatureCard
              icon={Lock}
              title="Credentials auth"
              description="Registration and sign-in run through Auth.js with middleware protecting /chat—sessions are ready for stricter RBAC later."
            />
            <FeatureCard
              icon={LayoutDashboard}
              title="Workspace-grade UI"
              description="Sidebar, drawer on mobile, themes, quick prompts into the composer, and avatars—polished enough to demo or deploy internally."
            />
            <FeatureCard
              icon={FolderGit2}
              title="Readable codebase"
              description="Feature slice under features/chat, typed API routes with Zod, and YAML-backed system prompts—easy to fork and extend."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative px-4 pb-16 pt-4 sm:px-6 md:px-8 md:pb-20">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-xl text-center">
            <p className={eyebrow}>How it works</p>
            <h2 className="font-heading mt-3 text-balance text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
              From zero to first reply in minutes
            </h2>
          </div>

          <ol className="mt-10 grid gap-4 md:grid-cols-3 md:gap-6">
            {[
              {
                step: "01",
                title: "Register",
                body: "Create an account—sessions gate the chat workspace so conversations stay yours.",
                icon: MessageSquareText,
              },
              {
                step: "02",
                title: "Configure LLM access",
                body: "Add OPENAI_API_KEY / ANTHROPIC_API_KEY on the host, or open Model settings and paste a browser-only key.",
                icon: Zap,
              },
              {
                step: "03",
                title: "Chat with persistence",
                body: "Every send hits POST /api/chat: validation, ownership, history, then generation via xoin-js's structured LLM layer—assistant rows persist like production.",
                icon: Sparkles,
              },
            ].map(({ step, title, body, icon: Icon }) => (
              <li
                key={step}
                className={cn(
                  "chat-starter-tile relative flex flex-col gap-3 p-5 sm:p-6",
                  "motion-safe:transition-[border-color,box-shadow] motion-safe:duration-200",
                  "hover:border-ring/30 hover:shadow-md hover:shadow-black/[0.04] dark:hover:shadow-black/20",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-mono text-[11px] font-medium tabular-nums tracking-wider text-primary/90">{step}</span>
                  <Icon className="size-5 shrink-0 text-muted-foreground" aria-hidden />
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading text-base font-medium tracking-tight text-foreground">{title}</h3>
                  <p className="text-pretty text-[13px] leading-relaxed text-muted-foreground sm:text-sm">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative px-4 pb-[max(3.5rem,env(safe-area-inset-bottom,1rem))] pt-2 sm:px-6 md:px-8 md:pb-[max(4rem,env(safe-area-inset-bottom,1rem))]">
        <div className="relative mx-auto max-w-2xl">
          <div className="chat-composer-surface px-6 py-10 text-center sm:px-10 sm:py-12">
            <h2 className="font-heading text-xl font-medium tracking-tight text-foreground sm:text-2xl">
              Ready to own your AI chat stack?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
              Spin up {APP_NAME} locally with MongoDB and an auth secret, or explore the hosted demo—then fork and ship.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/register"
                className={cn(
                  "touch-manipulation inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-md shadow-primary/25 ring-1 ring-black/5 transition-opacity hover:opacity-95 active:opacity-90 dark:ring-white/10",
                )}
              >
                Get started free
                <ArrowRight className="size-4 opacity-90" aria-hidden />
              </Link>
              <a
                href={DEMO_APP_URL}
                className={cn(
                  "touch-manipulation inline-flex min-h-[44px] items-center justify-center rounded-xl border border-border/90 bg-background/50 px-6 py-3 text-sm font-medium text-foreground backdrop-blur-sm transition-colors",
                  "hover:bg-accent/40 hover:text-accent-foreground active:opacity-90 dark:border-white/10 dark:hover:bg-white/[0.06]",
                )}
                target="_blank"
                rel="noreferrer"
              >
                Open live demo
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
