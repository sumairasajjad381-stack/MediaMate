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
    const isReel = url.toLowerCase().includes("/reel/");
    const isStory = url.toLowerCase().includes("/stories/");
    
    // Extract username from URL path if available
    let authorFromPath = "Instagram Creator";
    try {
      const parsedUrl = new URL(url);
      const segments = parsedUrl.pathname.split("/").filter(Boolean);
      if (segments[0] === "stories" && segments[1]) {
        authorFromPath = segments[1];
      } else if (segments[0] && !["p", "reel", "tv", "stories", "explore", "reels"].includes(segments[0].toLowerCase())) {
        authorFromPath = segments[0];
      }
    } catch {}

    const fallbackTitle = isStory
      ? `Instagram Stories & Highlights (@${authorFromPath})`
      : isReel
      ? `Instagram Reel Video (@${authorFromPath})`
      : `Instagram Media Post (@${authorFromPath})`;

    const ethicalFallbackMessage =
      "Instagram requires login to preview private streams. You can save public media directly via the action buttons below.";

    try {
      // Instagram public oEmbed endpoint with a 2.5s timeout for fast fallback
      const oembedUrl = `https://api.instagram.com/oembed/?url=${encodeURIComponent(url)}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch(oembedUrl, {
        headers: { "User-Agent": "MediaMate/1.0" },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        // Return clean ethical fallback card instead of failing with an error
        return {
          platform: this.platform,
          platformName: this.platformName,
          url,
          title: fallbackTitle,
          author: authorFromPath,
          mediaType: isStory ? "video" : isReel ? "video" : "image",
          supportedActions: ["preview", "download_thumbnail"],
          isSupported: true,
          limitationsNotice: ethicalFallbackMessage,
        };
      }

      const data = await res.json();

      return {
        platform: this.platform,
        platformName: this.platformName,
        url,
        title: data.title || fallbackTitle,
        author: data.author_name || authorFromPath,
        authorUrl: data.author_url,
        thumbnailUrl: data.thumbnail_url,
        mediaType: isStory ? "video" : isReel ? "video" : "image",
        supportedActions: ["preview", "download_thumbnail"],
        isSupported: true,
        limitationsNotice:
          "Public Instagram media details are provided via authorized specifications.",
      };
    } catch {
      // Catch any network/API blockages or timeouts and return the fallback card
      return {
        platform: this.platform,
        platformName: this.platformName,
        url,
        title: fallbackTitle,
        author: authorFromPath,
        mediaType: isStory ? "video" : isReel ? "video" : "image",
        supportedActions: ["preview", "download_thumbnail"],
        isSupported: true,
        limitationsNotice: ethicalFallbackMessage,
      };
    }
  }
}
