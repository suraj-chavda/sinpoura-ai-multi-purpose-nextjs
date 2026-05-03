import { createOpenAIProvider, createXoin, type Xoin } from "@xoin/xoin-js";

let xoinClient: Xoin | null = null;

export function getXoin(): Xoin {
  if (xoinClient) return xoinClient;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }
  xoinClient = createXoin({
    defaultProvider: "openai",
    providers: {
      openai: createOpenAIProvider({
        apiKey,
        defaultModel: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
      }),
    },
  });
  return xoinClient;
}
