import { InstagramMediaType } from "./types";
import { validateInstagramHost } from "../security/sanitize";
import { ValidationError } from "../errors";

export interface ParsedInstagramUrl {
  cleanUrl: string;
  shortcode: string;
  mediaType: InstagramMediaType;
  username?: string;
  storyId?: string;
}

/**
 * Parses and validates an Instagram URL.
 * Supports:
 * - Posts: /p/{shortcode}/
 * - Reels: /reel/{shortcode}/ or /reels/{shortcode}/
 * - TV: /tv/{shortcode}/
 * - Stories: /stories/{username}/{storyId}/
 */
export function parseInstagramUrl(rawUrl: string): ParsedInstagramUrl {
  const validation = validateInstagramHost(rawUrl);
  if (!validation.isValid || !validation.normalizedUrl) {
    throw new ValidationError(validation.error || "Invalid Instagram URL");
  }

  const parsed = new URL(validation.normalizedUrl);
  const pathParts = parsed.pathname.split("/").filter(Boolean);

  if (pathParts.length === 0) {
    throw new ValidationError("Instagram URL does not specify a post, reel, or media path.");
  }

  const firstSegment = pathParts[0].toLowerCase();

  // Reels: /reel/{shortcode} or /reels/{shortcode}
  if (firstSegment === "reel" || firstSegment === "reels") {
    const shortcode = pathParts[1];
    if (!shortcode) {
      throw new ValidationError("Missing reel shortcode in URL.");
    }
    return {
      cleanUrl: `https://www.instagram.com/reel/${shortcode}/`,
      shortcode,
      mediaType: "REEL",
    };
  }

  // Posts or IGTV: /p/{shortcode} or /tv/{shortcode}
  if (firstSegment === "p" || firstSegment === "tv") {
    const shortcode = pathParts[1];
    if (!shortcode) {
      throw new ValidationError("Missing post shortcode in URL.");
    }
    return {
      cleanUrl: `https://www.instagram.com/p/${shortcode}/`,
      shortcode,
      mediaType: "POST",
    };
  }

  // Stories: /stories/{username}/{storyId}
  if (firstSegment === "stories") {
    const username = pathParts[1];
    const storyId = pathParts[2] || "";
    if (!username) {
      throw new ValidationError("Missing username in story URL.");
    }
    return {
      cleanUrl: storyId ? `https://www.instagram.com/stories/${username}/${storyId}/` : `https://www.instagram.com/stories/${username}/`,
      shortcode: storyId || username,
      mediaType: "STORY",
      username,
      storyId,
    };
  }

  // Profile URL fallback or unknown format
  if (pathParts.length === 1 && !["explore", "direct", "accounts"].includes(firstSegment)) {
    return {
      cleanUrl: `https://www.instagram.com/${firstSegment}/`,
      shortcode: firstSegment,
      mediaType: "PROFILE",
      username: firstSegment,
    };
  }

  throw new ValidationError(
    `Unsupported Instagram URL pattern. Supported: /p/{code}, /reel/{code}, /stories/{user}/{id}`
  );
}
