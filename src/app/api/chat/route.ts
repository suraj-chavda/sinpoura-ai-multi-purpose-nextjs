import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { z } from "zod";
import { auth } from "@/auth";
import { connectMongo } from "@/server/db/mongo";
import { ConversationModel, MessageModel } from "@/server/db/models";
import { getChatSystemPrompt } from "@/server/ai/prompts";
import { getXoin } from "@/server/ai/xoin";

const bodySchema = z.object({
  conversationId: z.string().nullable().optional(),
  text: z.string().trim().min(1).max(16000),
});

function titleFromUserText(text: string) {
  const t = text.replace(/\s+/g, " ").trim();
  if (!t.length) return "New chat";
  return t.length > 72 ? `${t.slice(0, 71)}…` : t;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { text } = parsed.data;
  const rawConvId = parsed.data.conversationId ?? null;
  await connectMongo();

  if (rawConvId && !isValidObjectId(rawConvId)) {
    return NextResponse.json({ error: "Invalid conversation" }, { status: 400 });
  }

  let conversationId = rawConvId && isValidObjectId(rawConvId) ? rawConvId : null;
  if (conversationId) {
    const owned = await ConversationModel.findOne({
      _id: conversationId,
      userId: session.user.id,
    }).lean();
    if (!owned) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
  } else {
    const doc = await ConversationModel.create({
      userId: session.user.id,
      title: titleFromUserText(text),
    });
    conversationId = String(doc._id);
  }

  const userDoc = await MessageModel.create({
    conversationId,
    role: "user",
    content: text,
  });

  const convMeta = await ConversationModel.findById(conversationId).lean();
  await ConversationModel.updateOne(
    { _id: conversationId },
    {
      $set: {
        ...(convMeta?.title === "New chat" ? { title: titleFromUserText(text) } : {}),
        updatedAt: new Date(),
      },
    },
  );

  const history = await MessageModel.find({ conversationId })
    .sort({ createdAt: -1 })
    .limit(48)
    .lean();

  history.reverse();

  const messages = history
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

  let assistantText: string;
  try {
    const xoin = getXoin();
    const result = await xoin.generate({
      provider: "openai",
      system: getChatSystemPrompt(),
      messages,
      temperature: 0.4,
      maxTokens: 2048,
    });
    assistantText = result.text?.trim() || "(empty response)";
  } catch (e) {
    const message = e instanceof Error ? e.message : "Model error";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  const assistantDoc = await MessageModel.create({
    conversationId,
    role: "assistant",
    content: assistantText,
  });

  return NextResponse.json({
    conversationId,
    userMessage: {
      id: String(userDoc._id),
      role: "user",
      content: text,
      createdAt: userDoc.createdAt.toISOString(),
    },
    assistantMessage: {
      id: String(assistantDoc._id),
      role: "assistant",
      content: assistantText,
      createdAt: assistantDoc.createdAt.toISOString(),
    },
  });
}
