import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Instagram Video Downloader - Download Reels, Stories & Photos in 1080p HD | MediaMate",
  description:
    "Free online Instagram Video Downloader. Save Instagram Reels, Stories, Photos, and IGTV videos in 1080p Full HD without watermark. Fast, anonymous, and no login required.",
  keywords: [
    "instagram video downloader",
    "download instagram reels",
    "instagram story saver",
    "instagram photo downloader",
    "instagram to mp4",
    "no watermark",
    "1080p full hd",
  ],
  openGraph: {
    title: "Instagram Video Downloader - 1080p HD No Watermark | MediaMate",
    description: "Download Instagram Reels, Stories & Photos in original 1080p quality without watermarks.",
    url: "https://mediamate.app/instagram-video-downloader",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
