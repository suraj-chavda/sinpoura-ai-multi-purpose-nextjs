import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { connectMongo } from "@/server/db/mongo";
import { ConversationModel } from "@/server/db/models";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectMongo();
  const rows = await ConversationModel.find({ userId: session.user.id })
    .sort({ updatedAt: -1 })
    .lean();
  const payload = rows.map((c) => ({
    id: String(c._id),
    title: c.title,
    updatedAt: (c.updatedAt ?? c.createdAt).toISOString(),
  }));
  return NextResponse.json(payload);
}

const postSchema = z.object({
  title: z.string().trim().max(120).optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    json = {};
  }
  const parsed = postSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  await connectMongo();
  const doc = await ConversationModel.create({
    userId: session.user.id,
    title: parsed.data.title?.length ? parsed.data.title : "New chat",
  });
  return NextResponse.json({ id: String(doc._id) }, { status: 201 });
}
