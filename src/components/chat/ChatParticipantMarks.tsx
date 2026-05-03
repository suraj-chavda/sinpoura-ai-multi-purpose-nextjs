import Image from "next/image";
import { cn } from "@/lib/utils";

/** Sinpoura mark beside assistant rows */
export function AssistantLogoMark({
  className,
  animated = false,
}: {
  className?: string;
  /** Softer ambient pulse on the frame (respects reduced motion). */
  animated?: boolean;
}) {
  return (
    <span
      className={cn(
        "chat-assistant-logo-mark shrink-0 overflow-hidden rounded-xl shadow-sm shadow-black/10 ring-1 ring-border/55 dark:shadow-black/45",
        animated && "chat-assistant-logo-mark--pulse",
        className,
      )}
      aria-hidden
    >
      <Image src="/logo.svg" alt="" width={32} height={32} className="size-8 object-cover" />
    </span>
  );
}

export function UserAvatarMark({
  initials,
  className,
}: {
  initials: string;
  className?: string;
}) {
  const label = initials.trim().slice(0, 2).toUpperCase() || "?";

  return (
    <span
      className={cn(
        "chat-user-avatar-mark shrink-0 inline-flex size-8 select-none items-center justify-center rounded-full",
        "bg-gradient-to-br from-primary via-primary to-sidebar-accent text-[11px] font-medium uppercase tracking-tight text-primary-foreground",
        "shadow-md shadow-primary/20 ring-2 ring-primary/35 ring-offset-2 ring-offset-background dark:shadow-primary/18 dark:ring-primary/45",
        "chat-user-avatar-mark-animate",
        className,
      )}
      aria-hidden
    >
      {label}
    </span>
  );
}
