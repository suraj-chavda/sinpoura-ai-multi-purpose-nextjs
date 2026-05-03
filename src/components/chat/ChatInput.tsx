"use client";

import { useEffect, useLayoutEffect, useRef, useState, type FormEvent } from "react";
import { SendHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_CHARS = 16_000;

type Props = {
  disabled?: boolean;
  /** True while POST /api/chat is in flight (composer stays locked but copy differs from “no chat”). */
  sending?: boolean;
  /** Server / send failures surfaced next to the composer */
  sendError?: string | null;
  onClearSendError?: () => void;
  onSend: (text: string) => void | Promise<void>;
  /** Quick prompts set text here; `nonce` bumps when the same string is chosen again. */
  composerSeed?: { text: string; nonce: number } | null;
  onComposerSeedConsumed?: () => void;
};

export function ChatInput({
  disabled,
  sending,
  sendError,
  onClearSendError,
  onSend,
  composerSeed,
  onComposerSeedConsumed,
}: Props) {
  const [value, setValue] = useState("");
  const taRef = useRef<HTMLTextAreaElement>(null);

  const trimmed = value.trim();
  const len = value.length;
  const nearLimit = len > MAX_CHARS * 0.9;
  const canSend = !disabled && trimmed.length > 0;

  useEffect(() => {
    if (!composerSeed) return;
    const next = composerSeed.text.slice(0, MAX_CHARS);
    setValue(next);
    if (sendError && onClearSendError) onClearSendError();
    queueMicrotask(() => {
      taRef.current?.focus({ preventScroll: false });
    });
    onComposerSeedConsumed?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only refill when `composerSeed` changes (starter click)
  }, [composerSeed]);

  useLayoutEffect(() => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "auto";
    const next = Math.min(el.scrollHeight, 200);
    el.style.height = `${Math.max(next, 44)}px`;
  }, [value]);

  async function trySend() {
    if (!canSend) return;
    const toSend = trimmed;
    try {
      await Promise.resolve(onSend(toSend));
      setValue("");
    } catch {
      /* Error copy lives in sendError / store */
    }
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    void trySend();
  }

  return (
    <form
      onSubmit={submit}
      className={cn(
        "relative z-[1] shrink-0 bg-transparent",
        /* Match transcript gutters; extra bottom room + safe-area for home indicator */
        "px-4 pt-3 pb-[max(1.25rem,calc(0.75rem+env(safe-area-inset-bottom,0px)))]",
        "sm:px-5 md:px-6 md:pb-5 md:pt-3",
      )}
      aria-label="Send a message"
    >
      <div className="mx-auto w-full max-w-3xl">
        <div
          className={cn(
            "chat-composer-surface relative",
            "focus-within:border-ring focus-within:shadow-lg focus-within:shadow-primary/5 focus-within:ring-2 focus-within:ring-ring/30",
            sendError &&
              "border-destructive/55 ring-destructive/25 focus-within:border-destructive/70 focus-within:ring-destructive/25",
            disabled && "opacity-[0.72]",
          )}
        >
          <textarea
            ref={taRef}
            id="chat-message-input"
            rows={1}
            value={value}
            disabled={disabled}
            maxLength={MAX_CHARS}
            onChange={(e) => {
              setValue(e.target.value);
              if (sendError && onClearSendError) onClearSendError();
            }}
            placeholder={
              sending ? "Sending your message…" : disabled ? "Select a chat to continue…" : "Ask anything…"
            }
            aria-describedby={sendError ? "chat-input-hint chat-send-error" : "chat-input-hint"}
            className={cn(
              "chat-composer-textarea max-h-[200px] min-h-[44px] w-full resize-none rounded-2xl bg-transparent py-3 pl-4 pr-[3.25rem] text-[15px] leading-relaxed text-foreground outline-none md:text-sm",
              "placeholder:text-muted-foreground",
              disabled && "cursor-not-allowed",
            )}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void trySend();
              }
            }}
          />
          <button
            type="submit"
            disabled={!canSend}
            title="Send message"
            aria-label="Send message"
            className={cn(
              "absolute bottom-2.5 right-2.5 inline-flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/25 ring-1 ring-black/5 transition-[transform,opacity,box-shadow] hover:opacity-95 hover:shadow-lg active:scale-[0.97] sm:bottom-2 sm:right-2 dark:ring-white/10",
              "disabled:pointer-events-none disabled:opacity-35",
            )}
          >
            <SendHorizontal className="size-4" aria-hidden />
          </button>
        </div>
        {sendError ? (
          <p
            id="chat-send-error"
            className="mt-2 px-0.5 text-xs font-medium leading-snug text-destructive"
            role="alert"
            aria-live="assertive"
          >
            {sendError}
          </p>
        ) : null}
        <div
          id="chat-input-hint"
          className="mt-2.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 px-0.5 pb-0.5 text-[11px] leading-snug text-muted-foreground sm:mt-2"
        >
          <span>
            <kbd className="rounded border border-border/80 bg-muted/50 px-1 font-mono text-[10px] text-foreground/80">
              Enter
            </kbd>{" "}
            send ·{" "}
            <kbd className="rounded border border-border/80 bg-muted/50 px-1 font-mono text-[10px] text-foreground/80">
              Shift
            </kbd>
            +
            <kbd className="rounded border border-border/80 bg-muted/50 px-1 font-mono text-[10px] text-foreground/80">
              Enter
            </kbd>{" "}
            new line
          </span>
          <span
            className={cn(
              "tabular-nums tracking-tight",
              nearLimit && "font-medium text-amber-700 dark:text-amber-400",
            )}
            aria-live="polite"
          >
            {len.toLocaleString()}
            <span className="text-muted-foreground">/{MAX_CHARS.toLocaleString()}</span>
          </span>
        </div>
      </div>
    </form>
  );
}
