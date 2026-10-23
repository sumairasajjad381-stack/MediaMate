import { env } from "../config";
import { logger } from "../logger";
import { InstagramExtractionError } from "../errors";
import { parseInstagramUrl } from "./parser";
import { ExtractedMetadata, ExtractedMediaFile, InstagramMediaType } from "./types";

/**
 * High-Throughput Instagram Scraper Engine
 * Employs multi-tier extraction strategies:
 * 1. Direct JSON endpoint / GraphQL info
 * 2. HTML embedded metadata & OpenGraph tags
 * 3. Fallback Embed API
 */
export class InstagramScraper {
  private userAgent = env.INSTAGRAM_USER_AGENT;

  /**
   * Main entry point to extract media metadata from any valid Instagram URL
   */
  async extract(url: string): Promise<ExtractedMetadata> {
    const parsed = parseInstagramUrl(url);

    try {
      // Strategy 1: Attempt JSON/GraphQL extraction with browser headers
      const metadata = await this.fetchWithJsonEndpoint(parsed.cleanUrl, parsed.shortcode, parsed.mediaType);
      if (metadata && metadata.files.length > 0) {
        return metadata;
      }
    } catch (err) {
      logger.warn("JSON endpoint strategy failed, attempting HTML fallback", {
        shortcode: parsed.shortcode,
        error: (err as Error).message,
      });
    }

    try {
      // Strategy 2: Attempt HTML scraping & OpenGraph fallback
      const htmlMetadata = await this.fetchWithHtmlScrape(parsed.cleanUrl, parsed.shortcode, parsed.mediaType);
      if (htmlMetadata && htmlMetadata.files.length > 0) {
        return htmlMetadata;
      }
    } catch (err) {
      logger.warn("HTML fallback strategy failed, attempting Embed API", {
        shortcode: parsed.shortcode,
        error: (err as Error).message,
      });
    }

    try {
      // Strategy 3: Official oEmbed API fallback (for author and preview thumbnail)
      return await this.fetchWithEmbedApi(parsed.cleanUrl, parsed.shortcode, parsed.mediaType);
    } catch (err) {
      logger.error("All extraction strategies exhausted", err as Error, { url });
      throw new InstagramExtractionError(
        "Unable to fetch Instagram media. The post may be private, removed, or temporarily rate-limited."
      );
    }
  }

  private getRequestHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "User-Agent": this.userAgent,
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-Dest": "document",
      "Cache-Control": "max-age=0",
    };

    // Include session cookie if configured
    if (env.INSTAGRAM_SESSION_ID) {
      headers["Cookie"] = `sessionid=${env.INSTAGRAM_SESSION_ID}; ${env.INSTAGRAM_CSRF_TOKEN ? `csrftoken=${env.INSTAGRAM_CSRF_TOKEN};` : ""}`;
    }

    return headers;
  }

  /**
   * Extract using Instagram's internal data endpoint (?__a=1&__d=dis)
   */
  private async fetchWithJsonEndpoint(
    cleanUrl: string,
    shortcode: string,
    mediaType: InstagramMediaType
  ): Promise<ExtractedMetadata | null> {
    const jsonUrl = `${cleanUrl}?__a=1&__d=dis`;
    const res = await fetch(jsonUrl, {
      headers: {
        ...this.getRequestHeaders(),
        "X-Requested-With": "XMLHttpRequest",
        "Referer": "https://www.instagram.com/",
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    const item = data?.graphql?.shortcode_media || data?.items?.[0];

    if (!item) {
      return null;
    }

    return this.normalizeItemData(item, cleanUrl, shortcode, mediaType);
  }

  /**
   * Extract from page HTML (script tags and meta tags)
   */
  private async fetchWithHtmlScrape(
    cleanUrl: string,
    shortcode: string,
    mediaType: InstagramMediaType
  ): Promise<ExtractedMetadata | null> {
    const res = await fetch(cleanUrl, {
      headers: this.getRequestHeaders(),
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      return null;
    }

    const html = await res.text();

    // Check if we hit a login block
    if (html.includes("login/?next=") && !env.INSTAGRAM_SESSION_ID) {
      logger.info("Encountered Instagram login wall without session cookie");
    }

    // Try finding video_url in page scripts
    const videoMatches = Array.from(html.matchAll(/"video_url":"([^"]+)"/g));
    const displayMatches = Array.from(html.matchAll(/"display_url":"([^"]+)"/g));
    const ogVideo = html.match(/<meta property="og:video" content="([^"]+)"/i)?.[1];
    const ogImage = html.match(/<meta property="og:image" content="([^"]+)"/i)?.[1];
    const ogTitle = html.match(/<meta property="og:title" content="([^"]+)"/i)?.[1];
    const ogDescription = html.match(/<meta property="og:description" content="([^"]+)"/i)?.[1];

    const files: ExtractedMediaFile[] = [];

    // If video found
    if (ogVideo) {
      files.push({
        type: "VIDEO",
        url: this.cleanJsonUrl(ogVideo),
        thumbnailUrl: ogImage ? this.cleanJsonUrl(ogImage) : undefined,
      });
    } else if (videoMatches.length > 0) {
      const videoUrl = this.cleanJsonUrl(videoMatches[0][1]);
      files.push({
        type: "VIDEO",
        url: videoUrl,
        thumbnailUrl: displayMatches.length > 0 ? this.cleanJsonUrl(displayMatches[0][1]) : undefined,
      });
    } else if (ogImage) {
      files.push({
        type: "IMAGE",
        url: this.cleanJsonUrl(ogImage),
      });
    }

    if (files.length === 0) {
      return null;
    }

    // Parse author username from og:title if possible
    let authorUsername = "instagram_user";
    if (ogTitle) {
      const match = ogTitle.match(/on Instagram: "(.*)"/i) || ogTitle.match(/@([a-zA-Z0-9_.]+)/);
      if (match && match[1]) {
        authorUsername = match[1].split(" ")[0].replace("@", "");
      }
    }

    return {
      shortcode,
      mediaType: files[0].type === "VIDEO" ? "REEL" : mediaType,
      url: cleanUrl,
      caption: ogDescription || ogTitle || undefined,
      authorUsername,
      files,
    };
  }

  /**
   * Fallback using public oEmbed API
   */
  private async fetchWithEmbedApi(
    cleanUrl: string,
    shortcode: string,
    mediaType: InstagramMediaType
  ): Promise<ExtractedMetadata> {
    const oembedUrl = `https://api.instagram.com/oembed/?url=${encodeURIComponent(cleanUrl)}`;
    const res = await fetch(oembedUrl);
    if (!res.ok) {
      throw new InstagramExtractionError("Failed to fetch media metadata from Instagram");
    }

    const data = await res.json();
    const files: ExtractedMediaFile[] = [];

    if (data.thumbnail_url) {
      files.push({
        type: "IMAGE",
        url: data.thumbnail_url,
      });
    }

    return {
      shortcode,
      mediaType,
      url: cleanUrl,
      caption: data.title,
      authorUsername: data.author_name || "instagram_user",
      authorFullName: data.author_name,
      files,
    };
  }

  private normalizeItemData(
    item: any,
    url: string,
    shortcode: string,
    mediaType: InstagramMediaType
  ): ExtractedMetadata {
    const isVideo = Boolean(item.is_video || item.video_versions);
    const files: ExtractedMediaFile[] = [];

    // Carousel support: edge_sidecar_to_children or carousel_media
    const carouselItems = item.edge_sidecar_to_children?.edges || item.carousel_media;

    if (carouselItems && carouselItems.length > 0) {
      for (const edge of carouselItems) {
        const node = edge.node || edge;
        if (node.is_video && node.video_url) {
          files.push({
            type: "VIDEO",
            url: node.video_url,
            thumbnailUrl: node.display_url,
            width: node.dimensions?.width,
            height: node.dimensions?.height,
          });
        } else if (node.display_url) {
          files.push({
            type: "IMAGE",
            url: node.display_url,
            width: node.dimensions?.width,
            height: node.dimensions?.height,
          });
        }
      }
    } else if (isVideo) {
      const videoUrl = item.video_url || item.video_versions?.[0]?.url;
      const displayUrl = item.display_url || item.image_versions2?.candidates?.[0]?.url;
      if (videoUrl) {
        files.push({
          type: "VIDEO",
          url: videoUrl,
          thumbnailUrl: displayUrl,
        });
      }
    } else {
      const displayUrl = item.display_url || item.image_versions2?.candidates?.[0]?.url;
      if (displayUrl) {
        files.push({
          type: "IMAGE",
          url: displayUrl,
        });
      }
    }

    const author = item.owner || item.user || {};
    const captionText = item.edge_media_to_caption?.edges?.[0]?.node?.text || item.caption?.text;

    return {
      shortcode: item.shortcode || shortcode,
      mediaType: carouselItems ? "CAROUSEL" : isVideo ? "REEL" : mediaType,
      url,
      caption: captionText,
      authorUsername: author.username || "instagram_user",
      authorFullName: author.full_name,
      authorAvatarUrl: author.profile_pic_url,
      likeCount: item.edge_media_preview_like?.count || item.like_count,
      commentCount: item.edge_media_to_comment?.count || item.comment_count,
      viewCount: item.video_view_count || item.play_count,
      files,
    };
  }

  private cleanJsonUrl(raw: string): string {
    return raw.replace(/\\u0026/g, "&").replace(/\\/g, "");
  }
}

export const scraper = new InstagramScraper();
