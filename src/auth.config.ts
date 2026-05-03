import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

const authSecret =
  process.env.AUTH_SECRET ??
  process.env.NEXTAUTH_SECRET ??
  (process.env.NODE_ENV !== "production"
    ? "dev-only-do-not-use-in-production-min-32-chars"
    : undefined);

export const authConfig: NextAuthConfig = {
  secret: authSecret,
  providers: [],
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 14 },
  pages: { signIn: "/login" },
  trustHost: true,
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
    authorized({ auth, request }) {
      const path = request.nextUrl.pathname;
      if (path.startsWith("/chat")) return !!auth?.user;
      if (path === "/login" || path === "/register") {
        if (auth?.user) {
          return NextResponse.redirect(new URL("/chat", request.url));
        }
      }
      return true;
    },
  },
};
