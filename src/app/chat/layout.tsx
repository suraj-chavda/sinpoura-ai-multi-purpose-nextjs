import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat",
  description: "Your Sinpoura conversations.",
  robots: { index: false, follow: false },
};

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return children;
}
