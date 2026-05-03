"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { ModeToggle } from "@/components/theme/ModeToggle";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

/** Workspace strip for signed-out routes — matches ChatWorkspaceTopBar chrome (guest nav). */
export function GuestTopBar({ className }: Props) {
  const pathname = usePathname() ?? "";
  const { data } = useSession();
  const homeHref = data?.user ? "/chat" : "/";
  const onLogin = pathname === "/login";
  const onRegister = pathname === "/register";

  return (
    <div
      className={cn(
        "relative z-[1] flex min-h-14 min-w-0 w-full items-center justify-between gap-2 px-3 sm:h-14 sm:gap-3 sm:px-4 md:px-5",
        className,
      )}
    >
      <Link
        href={homeHref}
        className="touch-manipulation flex min-h-11 min-w-0 shrink-0 items-center gap-2 rounded-lg text-sm font-medium tracking-tight text-foreground transition-colors hover:text-primary sm:min-h-0 sm:gap-2.5"
      >
        <Image src="/logo.svg" alt="" width={28} height={28} priority className="size-7 shrink-0" />
        <span className="truncate max-[380px]:sr-only sm:max-w-none">{APP_NAME}</span>
      </Link>

      <nav className="flex min-w-0 flex-1 justify-end touch-manipulation items-center gap-1 overflow-x-auto sm:gap-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <ModeToggle className="inline-flex shrink-0" />
        {data?.user ? (
          <>
            <span className="hidden max-w-[12rem] truncate text-xs text-muted-foreground md:inline">
              {data.user.email}
            </span>
            <button
              type="button"
              className={cn(
                "inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg px-3 py-2 text-sm text-muted-foreground ring-1 ring-border/40 transition-colors sm:min-h-0 sm:py-1.5",
                "hover:bg-white/15 hover:text-primary active:bg-white/10 dark:ring-white/10 dark:hover:bg-white/[0.06]",
              )}
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            {!onLogin ? (
              <Link
                href="/login"
                className={cn(
                  "inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg px-3 py-2 text-sm text-muted-foreground ring-1 ring-border/40 transition-colors sm:min-h-0 sm:py-1.5",
                  "hover:bg-white/15 hover:text-primary active:bg-white/10 dark:ring-white/10 dark:hover:bg-white/[0.06]",
                )}
              >
                Sign in
              </Link>
            ) : null}
            {!onRegister ? (
              <Link
                href="/register"
                className={cn(
                  "inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-md shadow-primary/25 ring-1 ring-black/5 transition-opacity hover:opacity-95 active:opacity-90 sm:min-h-0 sm:py-1.5 dark:ring-white/10",
                )}
              >
                Register
              </Link>
            ) : null}
          </>
        )}
      </nav>
    </div>
  );
}
