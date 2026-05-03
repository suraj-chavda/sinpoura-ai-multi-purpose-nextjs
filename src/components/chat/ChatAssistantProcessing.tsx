"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { AssistantLogoMark } from "./ChatParticipantMarks";

const CAPTIONS = [
  "Thinking…",
  "Reading your message…",
  "Finding the best answer…",
  "Almost there…",
];

export function ChatAssistantProcessing({ className }: { className?: string }) {
  const [i, setI] = React.useState(0);

  React.useEffect(() => {
    const t = window.setInterval(() => {
      setI((n) => (n + 1) % CAPTIONS.length);
    }, 2200);
    return () => window.clearInterval(t);
  }, []);

  return (
    <div className={cn("flex w-full items-start justify-start gap-2", className)}>
      <AssistantLogoMark animated />
      <div
        className="max-w-[min(100%,42rem)] rounded-2xl border border-border/50 bg-card/80 px-4 py-3 text-sm shadow-sm ring-1 ring-border/35 backdrop-blur-[2px] dark:bg-card/60"
        role="status"
        aria-live="polite"
        aria-label="Assistant is responding"
      >
        <p key={CAPTIONS[i]} className="mb-2 font-medium text-foreground motion-safe:transition-opacity motion-safe:duration-300">
          {CAPTIONS[i]}
        </p>
        <div className="flex items-center gap-1.5">
          <span className="sr-only">Processing</span>
          {[0, 1, 2].map((dot) => (
            <span
              key={dot}
              className="size-2 animate-bounce rounded-full bg-primary/60 motion-reduce:animate-none"
              style={{ animationDelay: `${dot * 140}ms` }}
              aria-hidden
            />
          ))}
        </div>
      </div>
    </div>
  );
}
