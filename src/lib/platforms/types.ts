export type PlatformType =
  | "direct"
  | "youtube"
  | "tiktok"
  | "instagram"
  | "pinterest"
  | "facebook"
  | "unknown";

export type MediaFormatType = "video" | "image" | "audio" | "embed" | "unknown";

export type SupportedAction =
  | "preview"
  | "download_file"
  | "download_thumbnail"
  | "open_embed";

export interface MediaInspectResult {
  platform: PlatformType;
  platformName: string;
  url: string;
  title?: string;
  author?: string;
  authorUrl?: string;
  thumbnailUrl?: string;
  previewUrl?: string;
  directMediaUrl?: string;
  mediaType: MediaFormatType;
  fileSizeBytes?: number;
  mimeType?: string;
  supportedActions: SupportedAction[];
  limitationsNotice?: string;
  isSupported: boolean;
  error?: string;
}

export interface IPlatformAdapter {
  platform: PlatformType;
  platformName: string;
  matches(url: string): boolean;
  inspect(url: string): Promise<MediaInspectResult>;
}
