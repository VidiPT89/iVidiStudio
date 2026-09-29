// HTTP Basic auth for the dashboard: the building holds real business data.

/** Constant-time string comparison (works in every runtime, no Node crypto needed). */
function safeEqual(a: string, b: string) {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

export type AuthResult = "ok" | "denied" | "not-configured";

export function checkBasicAuth(header: string | null, user?: string, password?: string): AuthResult {
  if (!user || !password) return "not-configured";
  if (!header?.startsWith("Basic ")) return "denied";
  let decoded: string;
  try {
    decoded = atob(header.slice(6));
  } catch {
    return "denied";
  }
  const sep = decoded.indexOf(":");
  if (sep < 0) return "denied";
  const okUser = safeEqual(decoded.slice(0, sep), user);
  const okPass = safeEqual(decoded.slice(sep + 1), password);
  return okUser && okPass ? "ok" : "denied";
}
