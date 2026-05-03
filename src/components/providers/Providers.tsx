"use client";

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

type Props = {
  children: React.ReactNode;
  session: Session | null;
};

export function Providers({ children, session }: Props) {
  return (
    <SessionProvider session={session}>
      {/* `enableColorScheme={false}` avoids inline `color-scheme` on `<html>` before hydrate; use CSS `color-scheme` on `:root` / `.dark`. */}
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme={false}
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
