import { NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * Reports which provider API keys exist on the server.
 * Browser-side BYOK is invisible here by design—clients gate prompts using localStorage + these flags.
 */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ envOpenAi: false, envAnthropic: false });
  }
  return NextResponse.json({
    envOpenAi: Boolean(process.env.OPENAI_API_KEY?.trim()),
    envAnthropic: Boolean(process.env.ANTHROPIC_API_KEY?.trim()),
  });
}
