import crypto from "crypto";

const ALGO = "aes-256-gcm";
const IV_LEN = 16;
const TAG_LEN = 16;

function encryptionKey(): Buffer {
  const secret =
    process.env.AUTH_SECRET ??
    process.env.NEXTAUTH_SECRET ??
    (process.env.NODE_ENV !== "production"
      ? "dev-only-do-not-use-in-production-min-32-chars"
      : "");
  if (!secret) {
    throw new Error("AUTH_SECRET is required to encrypt stored API keys.");
  }
  return crypto.createHash("sha256").update(secret, "utf8").digest();
}

/** Encrypt for MongoDB storage (OpenAI key, etc.). Rotating AUTH_SECRET invalidates ciphertext. */
export function encryptUserSecret(plaintext: string): string {
  const key = encryptionKey();
  const iv = crypto.randomBytes(IV_LEN);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString("base64url");
}

export function decryptUserSecret(blob: string): string {
  const key = encryptionKey();
  const buf = Buffer.from(blob, "base64url");
  const iv = buf.subarray(0, IV_LEN);
  const tag = buf.subarray(IV_LEN, IV_LEN + TAG_LEN);
  const data = buf.subarray(IV_LEN + TAG_LEN);
  const decipher = crypto.createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
}
