import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { auth } from "@/auth";
import { connectMongo } from "@/server/db/mongo";
import { ConversationModel, MessageModel } from "@/server/db/models";

type RouteCtx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: RouteCtx) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await connectMongo();
  const conv = await ConversationModel.findOne({ _id: id, userId: session.user.id }).lean();
  if (!conv) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const messages = await MessageModel.find({ conversationId: id }).sort({ createdAt: 1 }).lean();
  const payload = messages.map((m) => ({
    id: String(m._id),
    role: m.role,
    content: m.content,
    createdAt: (m.createdAt ?? new Date()).toISOString(),
  }));
  return NextResponse.json(payload);
}

export async function DELETE(_req: Request, ctx: RouteCtx) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await connectMongo();
  const conv = await ConversationModel.findOneAndDelete({ _id: id, userId: session.user.id });
  if (!conv) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await MessageModel.deleteMany({ conversationId: id });
  return NextResponse.json({ ok: true });
}
