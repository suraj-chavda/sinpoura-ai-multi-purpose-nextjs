/**
 * Cheap structural checks before mongoose connects — catches common production mistakes
 * (especially `#` in passwords truncating `mongodb+srv://…` URIs → EBADNAME / `_mongodb._tcp.#…`).
 */
export function assertValidMongoConnectionString(rawUri: string): void {
  const uri = rawUri.trim();
  if (!uri) throw new Error("MONGODB_URI is empty");

  const isSrv = uri.startsWith("mongodb+srv://");
  const isStandard = uri.startsWith("mongodb://");
  if (!isSrv && !isStandard) {
    throw new Error("MONGODB_URI must start with mongodb:// or mongodb+srv://");
  }

  const schemeLen = isSrv ? "mongodb+srv://".length : "mongodb://".length;
  const withoutScheme = uri.slice(schemeLen);

  const q = withoutScheme.indexOf("?");
  const slash = withoutScheme.indexOf("/");
  let authorityEnd = withoutScheme.length;
  if (slash !== -1) authorityEnd = Math.min(authorityEnd, slash);
  if (q !== -1 && q < authorityEnd) authorityEnd = q;

  const authority = withoutScheme.slice(0, authorityEnd);
  const at = authority.lastIndexOf("@");
  const host = (at === -1 ? authority : authority.slice(at + 1)).trim();
  const userinfo = at === -1 ? "" : authority.slice(0, at);

  if (userinfo.includes("#") && !/%23/i.test(userinfo)) {
    throw new Error(
      'MONGODB_URI contains "#" in the username or password fragment that is not percent-encoded. Replace # with %23 (and encode @ : / ? # [ ] as needed per RFC 3986).',
    );
  }

  if (!host) throw new Error("MONGODB_URI is missing the host (nothing after @).");

  if (isSrv) {
    if (!/^[a-zA-Z0-9.-]+$/.test(host)) {
      throw new Error(
        `MONGODB_URI SRV host "${host}" is invalid. Common fix: your Mongo password contains "#" or another reserved character — paste the URI from Atlas again or percent-encode those characters.`,
      );
    }
    return;
  }

  // mongodb://host:port or mongodb://host
  if (!/^[a-zA-Z0-9.-]+(?::\d+)?$/.test(host)) {
    throw new Error(`MONGODB_URI host "${host}" is invalid. Check the connection string in your hosting dashboard.`);
  }
}
