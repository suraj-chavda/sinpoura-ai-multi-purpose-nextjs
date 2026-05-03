"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BrowserLlmConfigV1, LlmProviderId } from "@/lib/browser-llm-config";
import {
  clearBrowserLlmConfig,
  readBrowserLlmConfig,
  writeBrowserLlmConfig,
} from "@/lib/browser-llm-config";

type Props = {
  open: boolean;
  /** Fires after the native dialog closes. `programmatic` is true for save/clear/parent sync — do not treat as “user dismissed”. */
  onDismiss: (detail: { programmatic: boolean }) => void;
  onAfterSave: () => void | Promise<void>;
};

const PROVIDERS: { id: LlmProviderId; label: string; hint: string; href: string }[] = [
  {
    id: "openai",
    label: "OpenAI",
    hint: "Secret keys start with sk-",
    href: "https://platform.openai.com/api-keys",
  },
  {
    id: "anthropic",
    label: "Anthropic",
    hint: "Keys start with sk-ant-",
    href: "https://console.anthropic.com/settings/keys",
  },
];

function emptyDraft(cfg: BrowserLlmConfigV1 | null): Partial<Record<LlmProviderId, string>> {
  return {
    openai: cfg?.keys.openai ?? "",
    anthropic: cfg?.keys.anthropic ?? "",
  };
}

export function LlmApiKeyDialog({ open, onDismiss, onAfterSave }: Props) {
  const ref = React.useRef<HTMLDialogElement>(null);
  const closeCauseRef = React.useRef<"programmatic" | "user">("user");
  const [activeProvider, setActiveProvider] = React.useState<LlmProviderId>("openai");
  const [draftKeys, setDraftKeys] = React.useState<Partial<Record<LlmProviderId, string>>>({
    openai: "",
    anthropic: "",
  });
  const [busy, setBusy] = React.useState(false);
  const [localError, setLocalError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open) {
      if (!el.open) el.showModal();
    } else if (el.open) {
      closeCauseRef.current = "programmatic";
      el.close();
    }
  }, [open]);

  React.useEffect(() => {
    if (!open) {
      setLocalError(null);
      setBusy(false);
      return;
    }
    const cfg = readBrowserLlmConfig();
    setActiveProvider(cfg?.activeProvider ?? "openai");
    setDraftKeys(emptyDraft(cfg));
  }, [open]);

  function handleCloseEvent() {
    const programmatic = closeCauseRef.current === "programmatic";
    closeCauseRef.current = "user";
    onDismiss({ programmatic });
  }

  function closeAsUser() {
    closeCauseRef.current = "user";
    ref.current?.close();
  }

  function closeProgrammaticallyAfterSuccess() {
    closeCauseRef.current = "programmatic";
    ref.current?.close();
  }

  function patchDraft(provider: LlmProviderId, value: string) {
    setDraftKeys((prev) => ({ ...prev, [provider]: value }));
  }

  function validateSave(): string | null {
    const key = draftKeys[activeProvider]?.trim() ?? "";
    if (key.length < 20) return "Enter a valid API key for the selected provider.";
    if (activeProvider === "openai" && !key.startsWith("sk-")) {
      return "OpenAI secret keys usually start with sk-. Double-check you pasted the full key.";
    }
    if (activeProvider === "anthropic" && !key.startsWith("sk-ant-")) {
      return "Anthropic API keys usually start with sk-ant-. Double-check you pasted the full key.";
    }
    return null;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLocalError(null);
    const err = validateSave();
    if (err) {
      setLocalError(err);
      return;
    }
    setBusy(true);
    try {
      const next: BrowserLlmConfigV1 = {
        v: 1,
        activeProvider,
        keys: {
          openai: draftKeys.openai?.trim() || undefined,
          anthropic: draftKeys.anthropic?.trim() || undefined,
        },
      };
      writeBrowserLlmConfig(next);
      await onAfterSave();
      closeProgrammaticallyAfterSuccess();
    } finally {
      setBusy(false);
    }
  }

  async function handleClearBrowserKeys() {
    setLocalError(null);
    clearBrowserLlmConfig();
    setDraftKeys({ openai: "", anthropic: "" });
    await onAfterSave();
    closeProgrammaticallyAfterSuccess();
  }

  const activeMeta = PROVIDERS.find((p) => p.id === activeProvider)!;
  const activeValue = draftKeys[activeProvider] ?? "";

  return (
    <dialog
      ref={ref}
      onClose={handleCloseEvent}
      className={cn(
        "fixed left-1/2 top-1/2 z-[200] max-h-[min(92dvh,40rem)] w-[min(calc(100vw-2rem),28rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-background p-0 shadow-2xl ring-1 ring-border/55 backdrop:bg-transparent dark:bg-card",
        "[&::backdrop]:bg-black/45 [&::backdrop]:backdrop-blur-[2px]",
      )}
      aria-labelledby="llm-key-title"
    >
      <div className="flex flex-col gap-5 p-6">
        <div>
          <h2 id="llm-key-title" className="font-heading text-lg font-medium tracking-tight text-foreground">
            Model &amp; API keys
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Keys stay in <span className="font-medium text-foreground/90">this browser only</span> (localStorage).
            They are sent over HTTPS with each chat request and are{" "}
            <span className="font-medium text-foreground/90">not stored on the server</span>. Anyone with access to
            this device can read them—avoid shared computers.
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground/90">
            Server deployments can instead set <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.7rem]">OPENAI_API_KEY</code>{" "}
            or{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.7rem]">ANTHROPIC_API_KEY</code> so guests do
            not need to paste keys.
          </p>
        </div>

        <div className="flex rounded-xl border border-border/80 bg-muted/20 p-1 dark:bg-muted/10">
          {PROVIDERS.map((p) => (
            <button
              key={p.id}
              type="button"
              disabled={busy}
              onClick={() => setActiveProvider(p.id)}
              className={cn(
                "flex-1 rounded-lg px-3 py-2 text-center text-sm font-medium transition-colors",
                activeProvider === p.id
                  ? "bg-background text-foreground shadow-sm ring-1 ring-border/60 dark:bg-card"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3">
          <div>
            <label htmlFor="llm-api-key-input" className="mb-1.5 block text-xs font-medium text-muted-foreground">
              {activeMeta.label} API key
            </label>
            <input
              id="llm-api-key-input"
              type="password"
              autoComplete="off"
              value={activeValue}
              onChange={(e) => patchDraft(activeProvider, e.target.value)}
              placeholder={activeProvider === "openai" ? "sk-..." : "sk-ant-..."}
              disabled={busy}
              className={cn(
                "w-full rounded-xl border border-input bg-muted/30 px-3 py-2.5 font-mono text-sm text-foreground outline-none ring-ring/30 placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/35 dark:bg-muted/15",
                localError && "border-destructive/70",
              )}
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              {activeMeta.hint} ·{" "}
              <a
                href={activeMeta.href}
                className="font-medium text-primary underline-offset-4 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                Get a key
              </a>
            </p>
          </div>

          <p className="rounded-xl border border-border/60 bg-muted/15 px-3 py-2 text-[0.7rem] leading-relaxed text-muted-foreground dark:bg-muted/10">
            Chat uses{" "}
            <a
              href="https://github.com/kanha95/xoin-js"
              className="font-medium text-primary underline-offset-4 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              xoin-js
            </a>{" "}
            with the provider you select. Other providers can be wired the same way if needed.
          </p>

          {localError ? (
            <p className="text-xs font-medium text-destructive" role="alert">
              {localError}
            </p>
          ) : null}

          <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:flex-wrap">
            <button
              type="submit"
              disabled={busy || activeValue.trim().length < 20}
              className={cn(
                "inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-md transition-opacity disabled:pointer-events-none disabled:opacity-40 sm:flex-none",
              )}
            >
              {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
              Save &amp; use {activeMeta.label}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={closeAsUser}
              className="inline-flex flex-1 items-center justify-center rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-50 sm:flex-none"
            >
              Cancel
            </button>
          </div>

          <button
            type="button"
            disabled={busy}
            onClick={() => void handleClearBrowserKeys()}
            className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-destructive hover:underline disabled:opacity-50"
          >
            Remove keys from this browser
          </button>
        </form>
      </div>
    </dialog>
  );
}
