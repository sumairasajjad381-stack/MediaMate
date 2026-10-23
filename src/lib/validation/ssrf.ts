import { URL } from "url";
import net from "net";

/**
 * High-Security SSRF Protection
 * Blocks requests targeting localhost, private subnets, cloud metadata endpoints,
 * and dangerous protocols.
 */

const BLOCKED_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "::1",
  "0.0.0.0",
  "169.254.169.254", // AWS/GCP/Azure instance metadata
  "metadata.google.internal",
]);

/**
 * Checks if an IPv4 address is in a private/internal range
 */
function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
    return true; // malformed IP
  }

  // 10.0.0.0/8
  if (parts[0] === 10) return true;
  // 127.0.0.0/8 (loopback)
  if (parts[0] === 127) return true;
  // 172.16.0.0/12
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  // 192.168.0.0/16
  if (parts[0] === 192 && parts[1] === 168) return true;
  // 169.254.0.0/16 (link-local & cloud metadata)
  if (parts[0] === 169 && parts[1] === 254) return true;
  // 0.0.0.0/8
  if (parts[0] === 0) return true;

  return false;
}

export function validateSafeUrl(rawUrl: string): { isValid: boolean; normalizedUrl?: string; error?: string } {
  try {
    const trimmed = rawUrl.trim();
    if (!trimmed) {
      return { isValid: false, error: "Please enter a valid URL." };
    }

    const parsed = new URL(trimmed);

    // Only allow HTTP and HTTPS
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return { isValid: false, error: "Only HTTP and HTTPS URLs are supported." };
    }

    const hostname = parsed.hostname.toLowerCase();

    // Check blocked exact hostnames
    if (BLOCKED_HOSTS.has(hostname) || hostname.endsWith(".internal") || hostname.endsWith(".local")) {
      return { isValid: false, error: "Access to private or local network hosts is prohibited." };
    }

    // If it's an IP address, verify it's not private
    if (net.isIP(hostname)) {
      if (isPrivateIPv4(hostname)) {
        return { isValid: false, error: "Access to private IP addresses is prohibited." };
      }
    }

    return { isValid: true, normalizedUrl: parsed.toString() };
  } catch {
    return { isValid: false, error: "Malformed URL provided. Please check the link and try again." };
  }
}
