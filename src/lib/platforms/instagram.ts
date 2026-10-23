import { IPlatformAdapter, MediaInspectResult } from "./types";

export class InstagramAdapter implements IPlatformAdapter {
  public platform = "instagram" as const;
  public platformName = "Instagram";

  matches(url: string): boolean {
    try {
      const host = new URL(url).hostname.toLowerCase();
      return host.includes("instagram.com") || host.includes("instagr.am");
    } catch {
      return false;
    }
  }

  async inspect(url: string): Promise<MediaInspectResult> {
    try {
      // Instagram public oEmbed endpoint
      const oembedUrl = `https://api.instagram.com/oembed/?url=${encodeURIComponent(url)}`;
      const res = await fetch(oembedUrl, {
        headers: { "User-Agent": "MediaMate/1.0" },
      });

      if (!res.ok) {
        return {
          platform: this.platform,
          platformName: this.platformName,
          url,
          mediaType: "unknown",
          supportedActions: [],
          isSupported: false,
          error: "Instagram post not found, private, or restricted by platform rate limits.",
        };
      }

      const data = await res.json();

      return {
        platform: this.platform,
        platformName: this.platformName,
        url,
        title: data.title || "Instagram Post",
        author: data.author_name || "Instagram Creator",
        authorUrl: data.author_url,
        thumbnailUrl: data.thumbnail_url,
        mediaType: "image",
        supportedActions: ["preview", "download_thumbnail"],
        isSupported: true,
        limitationsNotice:
          "Public Instagram media details are provided via the authorized oEmbed specification. Media on private accounts or stories requiring user cookies cannot be accessed without violating platform security controls.",
      };
    } catch {
      return {
        platform: this.platform,
        platformName: this.platformName,
        url,
        mediaType: "unknown",
        supportedActions: [],
        isSupported: false,
        error: "Failed to query Instagram metadata service.",
      };
    }
  }
}
