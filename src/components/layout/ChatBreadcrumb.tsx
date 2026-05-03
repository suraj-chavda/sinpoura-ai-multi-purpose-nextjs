"use client";

import { NavBreadcrumb } from "@/components/layout/NavBreadcrumb";

type Props = {
  activeTitle: string | null;
  activeId: string | null;
};

export function ChatBreadcrumb({ activeTitle, activeId }: Props) {
  const leaf =
    activeTitle?.trim() ||
    (activeId ? "Untitled conversation" : "Inbox");

  return (
    <NavBreadcrumb
      items={[
        { label: "Chat", href: "/chat" },
        { label: leaf },
      ]}
    />
  );
}
