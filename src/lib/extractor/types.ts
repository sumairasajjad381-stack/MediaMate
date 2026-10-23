export type InstagramMediaType = "POST" | "REEL" | "STORY" | "CAROUSEL" | "PROFILE";

export interface ExtractedMediaFile {
  type: "IMAGE" | "VIDEO";
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  downloadUrl?: string;
  filename?: string;
}

export interface ExtractedMetadata {
  shortcode: string;
  mediaType: InstagramMediaType;
  url: string;
  caption?: string;
  authorUsername: string;
  authorFullName?: string;
  authorAvatarUrl?: string;
  likeCount?: number;
  commentCount?: number;
  viewCount?: number;
  timestamp?: number;
  files: ExtractedMediaFile[];
}
