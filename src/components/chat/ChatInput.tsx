"use client";

import { useState, type FormEvent } from "react";

type Props = {
  disabled?: boolean;
  onSend: (text: string) => void;
};

export function ChatInput({ disabled, onSend }: Props) {
  const [value, setValue] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    if (disabled) return;
    const t = value.trim();
    if (!t) return;
    onSend(t);
    setValue("");
  }

  return (
    <form onSubmit={submit} className="border-t border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-3xl gap-2">
        <textarea
          rows={2}
          value={value}
          disabled={disabled}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Message…"
          className="min-h-[2.75rem] flex-1 resize-y rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-400/30 placeholder:text-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="self-end rounded-xl bg-zinc-900 px-4 py-2 text-sm text-zinc-50 transition enabled:hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 dark:enabled:hover:bg-zinc-200"
        >
          Send
        </button>
      </div>
    </form>
  );
}
