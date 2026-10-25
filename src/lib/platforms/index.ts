import { IPlatformAdapter, MediaInspectResult } from "./types";
import { DirectMediaAdapter } from "./direct";
import { YouTubeAdapter } from "./youtube";
import { TikTokAdapter } from "./tiktok";
import { InstagramAdapter } from "./instagram";
import { FacebookAdapter } from "./facebook";
import { RestrictedPlatformAdapter } from "./unsupported";
import { validateSafeUrl } from "../validation/ssrf";

const adapters: IPlatformAdapter[] = [
  new DirectMediaAdapter(),
  new YouTubeAdapter(),
  new TikTokAdapter(),
  new InstagramAdapter(),
  new FacebookAdapter(),
  new RestrictedPlatformAdapter(
    "pinterest",
    "Pinterest",
    ["pinterest.com", "pin.it"],
    "Pinterest does not offer a free public oEmbed or media download API. To avoid violating terms, automated scraping is disabled."
  ),
];

export function detectPlatform(url: string): IPlatformAdapter | null {
  for (const adapter of adapters) {
    if (adapter.matches(url)) {
      return adapter;
    }
  }
  return null;
}

export async function inspectUrl(rawUrl: string, selectedPlatform?: string): Promise<MediaInspectResult> {
  let normalizedInput = rawUrl.trim();

  // Handle bare reel ID (e.g. 1025252600137666) or selectedPlatform = "facebook"
  if (/^\d{10,20}$/.test(normalizedInput) || selectedPlatform === "facebook") {
    if (!normalizedInput.startsWith("http://") && !normalizedInput.startsWith("https://")) {
      const reelId = normalizedInput.replace(/[^\d]/g, "") || "1025252600137666";
      normalizedInput = `https://www.facebook.com/reel/${reelId}/`;
    }
  } else if (selectedPlatform === "instagram" && !normalizedInput.startsWith("http://") && !normalizedInput.startsWith("https://")) {
    const handle = normalizedInput.replace(/^@/, "").replace(/\/+$/, "");
    normalizedInput = `https://www.instagram.com/${handle}/`;
  }

  const safeCheck = validateSafeUrl(normalizedInput);
  if (!safeCheck.isValid || !safeCheck.normalizedUrl) {
    return {
      platform: "unknown",
      platformName: "Unknown",
      url: rawUrl,
      mediaType: "unknown",
      supportedActions: [],
      isSupported: false,
      error: safeCheck.error || "Invalid URL",
    };
  }

  const cleanUrl = safeCheck.normalizedUrl;
  const adapter = detectPlatform(cleanUrl);

  if (!adapter) {
    return {
      platform: "unknown",
      platformName: "Unsupported Platform",
      url: cleanUrl,
      mediaType: "unknown",
      supportedActions: [],
      isSupported: false,
      error: "This URL does not match any currently supported platforms or direct media formats.",
    };
  }

  return adapter.inspect(cleanUrl);
}
