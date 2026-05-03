"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { ModeToggle } from "@/components/theme/ModeToggle";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

/** Workspace strip for signed-out routes — matches ChatWorkspaceTopBar chrome (guest nav). */
export function GuestTopBar({ className }: Props) {
  const { data } = useSession();
  const homeHref = data?.user ? "/chat" : "/";

  return (
    <div
      className={cn(
        "relative z-[1] flex h-14 min-h-14 min-w-0 w-full items-center justify-between gap-2 px-3 sm:gap-3 sm:px-4 md:px-5",
        className,
      )}
    >
      <Link
        href={homeHref}
        className="flex min-w-0 shrink-0 items-center gap-2.5 text-sm font-medium tracking-tight text-foreground transition-colors hover:text-primary"
      >
        <Image src="/logo.svg" alt="" width={28} height={28} priority className="size-7 shrink-0" />
        <span className="max-w-[10rem] truncate sm:max-w-none">{APP_NAME}</span>
      </Link>

      <nav className="flex shrink-0 items-center gap-1 sm:gap-2">
        <ModeToggle className="inline-flex shrink-0" />
        {data?.user ? (
          <>
            <span className="hidden max-w-[12rem] truncate text-xs text-muted-foreground md:inline">
              {data.user.email}
            </span>
            <button
              type="button"
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm text-muted-foreground ring-1 ring-border/40 transition-colors",
                "hover:bg-white/15 hover:text-primary dark:ring-white/10 dark:hover:bg-white/[0.06]",
              )}
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm text-muted-foreground ring-1 ring-border/40 transition-colors",
                "hover:bg-white/15 hover:text-primary dark:ring-white/10 dark:hover:bg-white/[0.06]",
              )}
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className={cn(
                "rounded-xl bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-md shadow-primary/25 ring-1 ring-black/5 transition-opacity hover:opacity-95 dark:ring-white/10",
              )}
            >
              Register
            </Link>
          </>
        )}
      </nav>
    </div>
  );
}
