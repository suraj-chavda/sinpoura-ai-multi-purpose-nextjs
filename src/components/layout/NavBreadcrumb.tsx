"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type NavCrumb = { label: string; href?: string };

type Props = {
  items: NavCrumb[];
  className?: string;
};

export function NavBreadcrumb({ items, className }: Props) {
  return (
    <nav aria-label="Breadcrumb" className={cn("min-w-0 max-w-full", className)}>
      <ol className="flex min-w-0 max-w-full flex-nowrap items-center gap-x-1 text-xs sm:text-sm">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li
              key={`${item.label}-${i}`}
              className={cn(
                "flex min-w-0 items-center gap-1",
                isLast ? "flex-1 overflow-hidden" : "shrink-0",
              )}
            >
              {i > 0 ? (
                <ChevronRight className="size-3.5 shrink-0 text-muted-foreground opacity-70" aria-hidden />
              ) : null}
              {item.href ? (
                <Link
                  href={item.href}
                  className={cn(
                    "truncate text-muted-foreground transition-colors hover:text-foreground",
                    isLast && "min-w-0 flex-1",
                  )}
                  title={item.label}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    "truncate font-medium tracking-tight text-foreground",
                    isLast && "min-w-0 flex-1",
                  )}
                  title={item.label}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
