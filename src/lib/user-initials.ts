/** Two-letter uppercase initials for chat avatar chips (e.g. “Suraj Chavda” → SC). */
export function deriveChatParticipantInitials(
  name?: string | null,
  email?: string | null,
): string {
  const trimmedName = (name ?? "").trim();
  if (trimmedName.length > 0) {
    const parts = trimmedName.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      const first = parts[0]?.[0];
      const last = parts[parts.length - 1]?.[0];
      if (first && last) return `${first}${last}`.toUpperCase();
    }
    const word = parts[0] ?? trimmedName;
    if (word.length >= 2) return word.slice(0, 2).toUpperCase();
    const one = word[0]?.toUpperCase() ?? "?";
    return `${one}${one}`;
  }

  const local = (email ?? "").split("@")[0]?.trim() ?? "";
  if (local.length >= 2) return local.slice(0, 2).toUpperCase();
  if (local.length === 1) {
    const u = local.toUpperCase();
    return `${u}${u}`;
  }

  return "?";
}
