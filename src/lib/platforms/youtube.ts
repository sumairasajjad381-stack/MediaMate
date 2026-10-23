import { IPlatformAdapter, MediaInspectResult } from "./types";

export class YouTubeAdapter implements IPlatformAdapter {
  public platform = "youtube" as const;
  public platformName = "YouTube";

  matches(url: string): boolean {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.toLowerCase();
      return (
        host === "youtube.com" ||
        host === "www.youtube.com" ||
        host === "m.youtube.com" ||
        host === "youtu.be"
      );
    } catch {
      return false;
    }
  }

  async inspect(url: string): Promise<MediaInspectResult> {
    try {
      // Official YouTube oEmbed API (100% legal, free, permitted)
      const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
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
          error: "Video not found or is set to private on YouTube.",
        };
      }

      const data = await res.json();

      // Extract video ID for clean embed player and high-res thumbnail
      const videoId = this.extractVideoId(url);
      const highResThumbnail = videoId
        ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
        : data.thumbnail_url;
      const embedUrl = videoId
        ? `https://www.youtube-nocookie.com/embed/${videoId}`
        : undefined;

      return {
        platform: this.platform,
        platformName: this.platformName,
        url,
        title: data.title || "YouTube Video",
        author: data.author_name,
        authorUrl: data.author_url,
        thumbnailUrl: highResThumbnail || data.thumbnail_url,
        previewUrl: embedUrl,
        mediaType: "video",
        supportedActions: ["preview", "download_thumbnail", "open_embed"],
        isSupported: true,
        limitationsNotice:
          "In adherence to YouTube Developer Policies and copyright laws, direct video stream extraction is not permitted. You can preview the authorized video or download the verified high-resolution thumbnail.",
      };
    } catch (err) {
      return {
        platform: this.platform,
        platformName: this.platformName,
        url,
        mediaType: "unknown",
        supportedActions: [],
        isSupported: false,
        error: "Failed to connect to YouTube's authorized metadata service.",
      };
    }
  }

  private extractVideoId(url: string): string | null {
    try {
      const parsed = new URL(url);
      if (parsed.hostname.includes("youtu.be")) {
        return parsed.pathname.slice(1).split("/")[0] || null;
      }
      if (parsed.pathname.includes("/shorts/")) {
        return parsed.pathname.split("/shorts/")[1]?.split("/")[0] || null;
      }
      return parsed.searchParams.get("v");
    } catch {
      return null;
    }
  }
}
