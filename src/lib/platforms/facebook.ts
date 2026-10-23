import { IPlatformAdapter, MediaInspectResult } from "./types";

export class FacebookAdapter implements IPlatformAdapter {
  public platform = "facebook" as const;
  public platformName = "Facebook";

  matches(url: string): boolean {
    try {
      const host = new URL(url).hostname.toLowerCase();
      return host.includes("facebook.com") || host.includes("fb.watch");
    } catch {
      return false;
    }
  }

  async inspect(url: string): Promise<MediaInspectResult> {
    const isReel = url.toLowerCase().includes("/reel/") || url.includes("fb.watch");
    return {
      platform: this.platform,
      platformName: this.platformName,
      url,
      title: isReel ? "Valid Facebook Reel" : "Valid Facebook Link",
      mediaType: "embed",
      supportedActions: [],
      isSupported: true,
      limitationsNotice:
        "Facebook requires login to preview reels and media. This is a valid public post. To save: Open post > 3 dots > Copy Link, then if it's your own content, use direct media URL or screen capture (ethical method).",
    };
  }
}
