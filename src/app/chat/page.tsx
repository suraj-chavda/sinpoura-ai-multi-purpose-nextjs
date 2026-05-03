import { Suspense } from "react";
import { ChatScreen } from "@/components/chat/ChatScreen";

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-background" aria-hidden />}>
      <ChatScreen />
    </Suspense>
  );
}
