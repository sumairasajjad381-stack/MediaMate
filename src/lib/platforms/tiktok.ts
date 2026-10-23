import { IPlatformAdapter, MediaInspectResult } from "./types";

export class TikTokAdapter implements IPlatformAdapter {
  public platform = "tiktok" as const;
  public platformName = "TikTok";

  matches(url: string): boolean {
    try {
      const host = new URL(url).hostname.toLowerCase();
      return host.includes("tiktok.com");
    } catch {
      return false;
    }
  }

  async inspect(url: string): Promise<MediaInspectResult> {
    try {
      // Official TikTok oEmbed API
      const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
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
          error: "TikTok video not found or privacy restrictions prevent public access.",
        };
      }

      const data = await res.json();

      return {
        platform: this.platform,
        platformName: this.platformName,
        url,
        title: data.title || "TikTok Video",
        author: data.author_name,
        authorUrl: data.author_url,
        thumbnailUrl: data.thumbnail_url,
        mediaType: "video",
        supportedActions: ["preview", "download_thumbnail"],
        isSupported: true,
        limitationsNotice:
          "TikTok's official oEmbed API provides authorized preview and thumbnail data. Bypassing platform watermarks or downloading raw video files directly violates TikTok's Developer Terms.",
      };
    } catch (err) {
      return {
        platform: this.platform,
        platformName: this.platformName,
        url,
        mediaType: "unknown",
        supportedActions: [],
        isSupported: false,
        error: "Failed to query TikTok's oEmbed endpoint.",
      };
    }
  }
}
