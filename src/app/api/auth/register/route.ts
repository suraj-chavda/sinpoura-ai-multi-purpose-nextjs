import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { connectMongo } from "@/server/db/mongo";
import { UserModel } from "@/server/db/models";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  name: z.string().trim().max(80).optional(),
});

export async function POST(req: Request) {
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
  const { email, password, name } = parsed.data;

  try {
    await connectMongo();
    const existing = await UserModel.findOne({ email }).lean();
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }
    const passwordHash = await hash(password, 10);
    await UserModel.create({ email, passwordHash, name: name ?? "" });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[register]", err);
    const msg = err instanceof Error ? err.message : String(err);
    const dnsBroken =
      msg.includes("EBADNAME") ||
      msg.includes("querySrv") ||
      msg.includes("ENOTFOUND") ||
      msg.includes("getaddrinfo");
    const configHint =
      msg.includes("MONGODB_URI") ||
      msg.includes("percent-encoded") ||
      msg.includes("SRV host") ||
      msg.includes("contains \"#\"");

    if (dnsBroken || configHint) {
      return NextResponse.json(
        {
          error:
            "Database connection misconfigured. On Atlas, copy the connection string again. If your password has # @ : / ? or spaces, use the URI from “Connect” (Atlas encodes them) or encode manually (e.g. # → %23). Check MONGODB_URI in Vercel.",
          code: "DB_CONFIG",
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: "Registration temporarily unavailable. Try again in a moment.", code: "DB_UNAVAILABLE" },
      { status: 503 },
    );
  }
}
