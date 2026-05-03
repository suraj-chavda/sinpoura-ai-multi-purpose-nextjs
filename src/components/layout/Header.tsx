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

export function Header({ className }: Props) {
  const { data } = useSession();
  const homeHref = data?.user ? "/chat" : "/";

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex min-h-14 shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border bg-background/85 px-4 py-2 backdrop-blur-md supports-backdrop-filter:bg-background/70 sm:flex-nowrap sm:py-0",
        className,
      )}
    >
      <Link
        href={homeHref}
        className="flex shrink-0 items-center gap-2.5 text-sm font-medium tracking-tight text-foreground transition-opacity hover:opacity-90"
      >
        <Image src="/logo.svg" alt="" width={28} height={28} priority className="size-7 shrink-0" />
        <span className="max-w-[10rem] truncate sm:max-w-none">{APP_NAME}</span>
      </Link>

      <nav className="flex shrink-0 items-center gap-2 sm:gap-3">
        <ModeToggle />
        {data?.user ? (
          <>
            <span className="hidden max-w-[14rem] truncate text-sm text-muted-foreground lg:inline">
              {data.user.email}
            </span>
            <button
              type="button"
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
            >
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
