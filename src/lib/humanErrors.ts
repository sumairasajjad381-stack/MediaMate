export interface HumanError {
  type: "not_found" | "unsupported" | "network" | "private" | "unknown";
  title: string;
  message: string;
  hint?: string;
  icon: "alert" | "lock" | "wifi" | "search";
}

export function parseHumanError(rawError: string | Error | unknown): HumanError {
  const errStr = (typeof rawError === "string" ? rawError : (rawError as Error)?.message || "").toLowerCase();

  // 1. Video / Post Not Found
  if (
    errStr.includes("not found") ||
    errStr.includes("404") ||
    errStr.includes("does not exist") ||
    errStr.includes("deleted")
  ) {
    return {
      type: "not_found",
      title: "Video or Story Not Found",
      message:
        "This Reel, Story, or Post may have been deleted by the owner, or expired (Stories vanish after 24 hours).",
      hint: "Check that the URL is spelled correctly and the post is still visible on the platform.",
      icon: "search",
    };
  }

  // 2. Private Content or Login Required
  if (
    errStr.includes("private") ||
    errStr.includes("login") ||
    errStr.includes("protected") ||
    errStr.includes("permission")
  ) {
    return {
      type: "private",
      title: "Private Account / Group Protected",
      message:
        "This post belongs to a private profile or closed group. MediaMate strictly respects user privacy and cannot bypass login security.",
      hint: "Only public Reels, public Stories, and public page posts can be downloaded.",
      icon: "lock",
    };
  }

  // 3. Network or Timeout Issue
  if (
    errStr.includes("timeout") ||
    errStr.includes("network") ||
    errStr.includes("failed to fetch") ||
    errStr.includes("econnrefused") ||
    errStr.includes("abort") ||
    errStr.includes("504") ||
    errStr.includes("502")
  ) {
    return {
      type: "network",
      title: "Network Timeout / CDN Busy",
      message:
        "The social network's edge servers did not respond within the time limit. This is usually temporary.",
      hint: "Wait 3-5 seconds and click the download button again.",
      icon: "wifi",
    };
  }

  // 4. Unsupported Platform or Malformed URL
  if (
    errStr.includes("unsupported") ||
    errStr.includes("invalid url") ||
    errStr.includes("prohibited") ||
    errStr.includes("malformed") ||
    errStr.includes("ssrf") ||
    errStr.includes("protocol")
  ) {
    return {
      type: "unsupported",
      title: "Unsupported Platform or Invalid Link",
      message:
        "The link entered does not match a supported public Instagram, Facebook, or TikTok post format.",
      hint: "Make sure you paste a link like instagram.com/reel/..., facebook.com/reel/..., or a valid Reel ID.",
      icon: "alert",
    };
  }

  // 5. Default Friendly Error
  return {
    type: "unknown",
    title: "Media Could Not Be Retrieved",
    message:
      typeof rawError === "string" && rawError.length > 5
        ? rawError
        : "The platform media stream is currently unavailable. Please check the link and try again.",
    hint: "Ensure the link is from a public post, not a private direct message or story archive.",
    icon: "alert",
  };
}
