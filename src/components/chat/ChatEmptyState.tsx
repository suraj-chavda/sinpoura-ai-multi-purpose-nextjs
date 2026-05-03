"use client";

import type { CSSProperties } from "react";
import { ArrowRight, MessageSquareQuote, Sparkles } from "lucide-react";
import type { ChatStarter } from "@/lib/chat-starters";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Props = {
  variant: "fresh" | "idle";
  starters: ChatStarter[];
  onSelectStarter: (query: string) => void;
  busy?: boolean;
};

export function ChatEmptyState({ variant, starters, onSelectStarter, busy }: Props) {
  const isIdle = variant === "idle";

  return (
    <div className="relative flex w-full flex-col items-center justify-start px-0 py-5 sm:py-7 md:flex-1 md:justify-center md:py-10">
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 opacity-[0.55]",
          "bg-[radial-gradient(ellipse_70%_50%_at_50%_20%,var(--accent)_0%,transparent_68%)]",
        )}
      />
      <div className="relative mx-auto flex w-full max-w-2xl flex-col items-center text-center">
        <div className="chat-starter-tile mb-4 flex size-12 shrink-0 items-center justify-center sm:mb-5 sm:size-14">
          {isIdle ? (
            <MessageSquareQuote className="size-7 text-primary" aria-hidden />
          ) : (
            <Sparkles className="size-7 text-primary" aria-hidden />
          )}
        </div>
        <h2 className="font-heading text-balance text-lg font-medium tracking-tight text-foreground sm:text-xl md:text-2xl">
          {isIdle ? `Pick up where you left off · ${APP_NAME}` : "What should we tackle first?"}
        </h2>
        <p className="mt-2 max-w-md text-pretty text-[13px] leading-relaxed text-muted-foreground sm:text-sm md:text-[15px]">
          {isIdle
            ? "Pick a thread from your inbox or start fresh — starter prompts below drop text into the composer."
            : "Tap a starter to fill the composer, edit if you like, then send. Responses stream with your configured provider."}
        </p>

        <div className="mt-5 w-full sm:mt-7 md:mt-8">
          <p className="mb-2 text-left text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:mb-3 sm:text-[11px]">
            Quick prompts
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {starters.map((s, index) => (
              <button
                key={s.label}
                type="button"
                disabled={busy}
                onClick={() => onSelectStarter(s.query)}
                style={
                  {
                    "--chat-starter-scan-delay": `${index * 140}ms`,
                  } as CSSProperties
                }
                className={cn(
                  "chat-starter-tile chat-starter-card motion-safe:transition-[transform,box-shadow,border-color,ring-color,background-color] motion-safe:duration-200",
                  "group touch-manipulation flex items-start gap-2.5 px-3 py-3 text-left sm:gap-3 sm:px-4 sm:py-3.5",
                  "hover:border-ring/40 hover:bg-accent/35 hover:shadow-md hover:shadow-black/[0.05] hover:ring-ring/25 motion-safe:hover:-translate-y-px",
                  "dark:hover:bg-accent/20 dark:hover:ring-white/[0.08]",
                  "active:translate-y-0",
                  "disabled:pointer-events-none disabled:opacity-50",
                )}
              >
                <span className="relative z-[1] flex min-w-0 flex-1 flex-col gap-1 text-left">
                  <span className="text-sm font-medium tracking-tight text-foreground">{s.label}</span>
                  <span className="text-xs leading-snug text-muted-foreground">
                    Uses your model · fills composer — Enter to send
                  </span>
                </span>
                <ArrowRight
                  className="relative z-[1] mt-1 size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary"
                  aria-hidden
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
