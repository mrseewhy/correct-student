import { isIP } from "node:net";

// Vercel overwrites x-forwarded-for. On a VPS, configure the reverse proxy to
// overwrite x-real-ip and opt in with TRUST_PROXY_IP_HEADERS=true.
export function clientIp(headers: Headers): string | null {
  const vercel = process.env.VERCEL === "1";
  const trustedVpsProxy = process.env.TRUST_PROXY_IP_HEADERS === "true";
  if (!vercel && !trustedVpsProxy) return process.env.NODE_ENV === "development" ? "127.0.0.1" : null;
  const value = vercel ? headers.get("x-forwarded-for") : headers.get("x-real-ip");
  const candidate = value?.split(",")[0]?.trim();
  return candidate && isIP(candidate) ? candidate : null;
}
