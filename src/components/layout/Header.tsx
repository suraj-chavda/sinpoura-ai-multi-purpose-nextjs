"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { APP_NAME } from "@/lib/constants";

export function Header() {
  const { data } = useSession();
  const homeHref = data?.user ? "/chat" : "/";
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-200/80 bg-white/90 px-4 backdrop-blur dark:border-zinc-800/80 dark:bg-zinc-950/90">
      <Link
        href={homeHref}
        className="flex items-center gap-2 text-sm tracking-tight text-zinc-900 dark:text-zinc-100"
      >
        <Image src="/logo.svg" alt="" width={28} height={28} priority className="shrink-0" />
        <span>{APP_NAME}</span>
      </Link>
      <nav className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
        {data?.user ? (
          <>
            <span className="hidden max-w-[10rem] truncate sm:inline">{data.user.email}</span>
            <button
              type="button"
              className="rounded-lg border border-zinc-200 px-3 py-1.5 text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-lg border border-zinc-200 px-3 py-1.5 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
