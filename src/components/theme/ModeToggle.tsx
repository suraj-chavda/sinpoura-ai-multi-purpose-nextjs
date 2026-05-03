"use client";

import * as React from "react";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const modes = [
  { value: "light" as const, icon: Sun, label: "Light" },
  { value: "dark" as const, icon: Moon, label: "Dark" },
  { value: "system" as const, icon: Laptop, label: "System" },
];

export function ModeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        className={cn("h-11 w-[7.75rem] animate-pulse rounded-lg bg-muted/80 ring-1 ring-border/60 sm:h-9 sm:w-[6.75rem]", className)}
        aria-hidden
      />
    );
  }

  const active = theme ?? "system";

  return (
    <div
      className={cn(
        "inline-flex rounded-lg bg-muted/60 p-0.5 ring-1 ring-border/70 backdrop-blur-sm dark:bg-muted/40",
        className,
      )}
      role="group"
      aria-label="Theme"
    >
      {modes.map(({ value, icon: Icon, label }) => {
        const isOn = active === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            title={label}
            aria-pressed={isOn}
            className={cn(
              "flex min-h-11 min-w-11 items-center justify-center rounded-md text-muted-foreground transition-colors sm:size-8 sm:min-h-0 sm:min-w-0",
              isOn && "bg-background text-foreground shadow-sm ring-1 ring-border/80",
              !isOn && "hover:text-foreground",
            )}
          >
            <Icon className="size-4" aria-hidden />
            <span className="sr-only">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
