import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to Sinpoura AI chat.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
