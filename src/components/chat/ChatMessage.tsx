import type { ChatMessageDTO } from "@/features/chat/types";
import { formatChatMessageTime } from "@/lib/format-chat-time";
import { cn } from "@/lib/utils";
import { AssistantLogoMark, UserAvatarMark } from "./ChatParticipantMarks";

type Props = { message: ChatMessageDTO; userInitials: string };

export function ChatMessage({ message, userInitials }: Props) {
  const isUser = message.role === "user";
  const when = formatChatMessageTime(message.createdAt);
  return (
    <div className={cn("flex w-full gap-2 items-start", isUser ? "justify-end" : "justify-start")}>
      {!isUser ? <AssistantLogoMark /> : null}
      <div className={cn("flex min-w-0 flex-col gap-1", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "max-w-[min(100%,42rem)] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ring-1 ring-border/45 shadow-sm",
            isUser
              ? "bg-primary text-primary-foreground shadow-md shadow-primary/15 ring-transparent"
              : "bg-card/95 text-card-foreground backdrop-blur-[2px] dark:bg-card/75",
          )}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        {when ? (
          <time
            dateTime={message.createdAt}
            className={cn(
              "px-1 text-[10px] font-medium tabular-nums tracking-wide text-muted-foreground",
              isUser ? "text-right" : "text-left",
            )}
          >
            {when}
          </time>
        ) : null}
      </div>
      {isUser ? <UserAvatarMark initials={userInitials} /> : null}
    </div>
  );
}
