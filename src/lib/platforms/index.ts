import { IPlatformAdapter, MediaInspectResult, PlatformType } from "./types";
import { DirectMediaAdapter } from "./direct";
import { YouTubeAdapter } from "./youtube";
import { TikTokAdapter } from "./tiktok";
import { InstagramAdapter } from "./instagram";
import { RestrictedPlatformAdapter } from "./unsupported";
import { validateSafeUrl } from "../validation/ssrf";

const adapters: IPlatformAdapter[] = [
  new DirectMediaAdapter(),
  new YouTubeAdapter(),
  new TikTokAdapter(),
  new InstagramAdapter(),
  new RestrictedPlatformAdapter(
    "pinterest",
    "Pinterest",
    ["pinterest.com", "pin.it"],
    "Pinterest does not offer a free public oEmbed or media download API. To avoid violating terms, automated scraping is disabled."
  ),
  new RestrictedPlatformAdapter(
    "facebook",
    "Facebook",
    ["facebook.com", "fb.watch"],
    "Facebook Graph API requires registered Meta App review and commercial credentials, which cannot be provided on a $0 budget."
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
  const safeCheck = validateSafeUrl(rawUrl);
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
