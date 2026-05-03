export type MessageRole = "user" | "assistant" | "system";

export type ChatMessageDTO = {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
};

export type ConversationDTO = {
  id: string;
  title: string;
  updatedAt: string;
};
