import { IPlatformAdapter, MediaInspectResult, MediaFormatType } from "./types";
import { validateSafeUrl } from "../validation/ssrf";

const DIRECT_EXTENSIONS = new Set([
  "mp4", "webm", "mov", "avi", "mkv",
  "jpg", "jpeg", "png", "gif", "webp", "svg",
  "mp3", "wav", "ogg", "aac", "m4a",
]);

const MAX_DIRECT_FILE_SIZE = 100 * 1024 * 1024; // 100 MB max for free tier streaming

export class DirectMediaAdapter implements IPlatformAdapter {
  public platform = "direct" as const;
  public platformName = "Direct Media File";

  matches(url: string): boolean {
    try {
      const parsed = new URL(url);
      const pathname = parsed.pathname.toLowerCase();
      const ext = pathname.split(".").pop();
      return Boolean(ext && DIRECT_EXTENSIONS.has(ext));
    } catch {
      return false;
    }
  }

  async inspect(url: string): Promise<MediaInspectResult> {
    const safeCheck = validateSafeUrl(url);
    if (!safeCheck.isValid) {
      return {
        platform: this.platform,
        platformName: this.platformName,
        url,
        mediaType: "unknown",
        supportedActions: [],
        isSupported: false,
        error: safeCheck.error || "Unsafe URL rejected",
      };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      // Perform a HEAD request to check availability, size, and content type
      const response = await fetch(url, {
        method: "HEAD",
        signal: controller.signal,
        headers: {
          "User-Agent": "MediaMate/1.0 (+https://mediamate.toolkit/bot)",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return {
          platform: this.platform,
          platformName: this.platformName,
          url,
          mediaType: "unknown",
          supportedActions: [],
          isSupported: false,
          error: `Remote server responded with HTTP ${response.status}. The media file may be inaccessible.`,
        };
      }

      const contentType = response.headers.get("content-type") || "";
      const contentLength = response.headers.get("content-length");
      const fileSizeBytes = contentLength ? parseInt(contentLength, 10) : undefined;

      let mediaType: MediaFormatType = "unknown";
      if (contentType.startsWith("video/") || url.match(/\.(mp4|webm|mov)$/i)) {
        mediaType = "video";
      } else if (contentType.startsWith("image/") || url.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i)) {
        mediaType = "image";
      } else if (contentType.startsWith("audio/") || url.match(/\.(mp3|wav|ogg|m4a)$/i)) {
        mediaType = "audio";
      }

      const filename = new URL(url).pathname.split("/").pop() || "media_file";

      if (fileSizeBytes && fileSizeBytes > MAX_DIRECT_FILE_SIZE) {
        return {
          platform: this.platform,
          platformName: this.platformName,
          url,
          title: filename,
          mediaType,
          fileSizeBytes,
          mimeType: contentType,
          supportedActions: ["preview"],
          isSupported: true,
          limitationsNotice: `File size (${(fileSizeBytes / (1024 * 1024)).toFixed(1)} MB) exceeds the 100 MB free proxy download limit. You can still preview or open the direct link directly.`,
        };
      }

      return {
        platform: this.platform,
        platformName: this.platformName,
        url,
        title: filename,
        thumbnailUrl: mediaType === "image" ? url : undefined,
        previewUrl: url,
        directMediaUrl: url,
        mediaType,
        fileSizeBytes,
        mimeType: contentType,
        supportedActions: ["preview", "download_file"],
        isSupported: true,
      };
    } catch (err) {
      return {
        platform: this.platform,
        platformName: this.platformName,
        url,
        mediaType: "unknown",
        supportedActions: [],
        isSupported: false,
        error: (err as Error).name === "AbortError"
          ? "Request timed out while probing the direct media link."
          : "Failed to connect to the media server.",
      };
    }
  }
}
