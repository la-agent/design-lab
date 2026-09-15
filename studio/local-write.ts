const loopback = new Set(["localhost", "127.0.0.1", "[::1]"]);
export function isLocalStudioWrite(request: Request) {
  if (process.env.NODE_ENV !== "development") return false;
  try {
    const url = new URL(request.url);
    const origin = new URL(request.headers.get("origin") ?? "");
    const host = request.headers.get("host") ?? url.host;
    // Next may normalize request.url to localhost; Host retains the browser's address.
    return (
      loopback.has(url.hostname) &&
      loopback.has(origin.hostname) &&
      origin.origin === `${url.protocol}//${host}` &&
      origin.port === url.port
    );
  } catch {
    return false;
  }
}
