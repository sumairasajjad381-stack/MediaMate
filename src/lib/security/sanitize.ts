/**
 * Security & Sanitization Utilities
 * Protects against Server-Side Request Forgery (SSRF), XSS, and parameter pollution.
 */

const ALLOWED_INSTAGRAM_HOSTS = new Set([
  "instagram.com",
  "www.instagram.com",
  "m.instagram.com",
  "instagr.am",
  "www.instagr.am",
]);

/**
 * Validates and strictly prevents SSRF attacks.
 * Ensures the target URL resolves ONLY to public Instagram domains.
 */
export function validateInstagramHost(inputUrl: string): { isValid: boolean; normalizedUrl?: string; error?: string } {
  try {
    const parsed = new URL(inputUrl.trim());

    // Protocol must strictly be HTTPS or HTTP
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return { isValid: false, error: "Only HTTPS and HTTP protocols are allowed" };
    }

    // Host must match authorized Instagram domains (no localhost, private IPs, or DNS rebinding)
    const hostname = parsed.hostname.toLowerCase();
    if (!ALLOWED_INSTAGRAM_HOSTS.has(hostname)) {
      return { isValid: false, error: `Invalid host '${hostname}'. Expected an official Instagram URL.` };
    }

    // Strip all tracking parameters (utm_*, igsh, etc.)
    const cleanUrl = new URL(parsed.origin + parsed.pathname);
    return { isValid: true, normalizedUrl: cleanUrl.toString() };
  } catch {
    return { isValid: false, error: "Malformed URL provided." };
  }
}

/**
 * Basic XSS sanitizer for user-provided text (captions, names)
 */
export function sanitizeText(text: string | null | undefined): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
