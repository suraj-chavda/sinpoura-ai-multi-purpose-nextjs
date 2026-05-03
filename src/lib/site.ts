function pickSiteRaw(): string {
  const candidates = [
    process.env.SITE_URL?.trim(),
    process.env.AUTH_URL?.trim(),
    process.env.NEXT_PUBLIC_SITE_URL?.trim(),
  ];
  for (const c of candidates) {
    if (c) return c;
  }
  return "http://localhost:3000";
}

export function getSiteUrl(): string {
  let base = pickSiteRaw().replace(/\/+$/, "");
  if (!/^https?:\/\//i.test(base)) {
    base = `https://${base}`;
  }
  return base;
}
