export const APP_NAME = "Sinpoura";

/** Testing deployment for reviewers (also documented in README). Update both when the hostname changes. */
export const DEMO_APP_URL =
  "https://suraj-chavda-sinpoura-ai-multi-purpose-nextjs-a8b3r1cw7.vercel.app/";

export const API = {
  conversations: "/api/conversations",
  chat: "/api/chat",
  register: "/api/auth/register",
  llmConfig: "/api/user/llm-config",
} as const;
