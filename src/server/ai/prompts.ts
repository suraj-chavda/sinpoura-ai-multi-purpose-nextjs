import { readFileSync } from "node:fs";
import { join } from "node:path";
import yaml from "js-yaml";

type YamlTemplate = { template?: string };

let cachedSystem: string | null = null;

export function getChatSystemPrompt(): string {
  if (cachedSystem) return cachedSystem;
  const path = join(process.cwd(), "src/server/ai/templates/chat-system.yml");
  const raw = readFileSync(path, "utf8");
  const doc = yaml.load(raw) as YamlTemplate;
  cachedSystem = (doc.template ?? "").trim();
  if (!cachedSystem) {
    cachedSystem = "You are a helpful assistant.";
  }
  return cachedSystem;
}
