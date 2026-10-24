import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Instagram Reels Downloader - Download 1080p Reels No Watermark | MediaMate",
  description:
    "Best Instagram Reels Downloader to save vertical 9:16 Reels in full HD MP4 with audio. 100% free, fast, anonymous, and watermark-free.",
  keywords: [
    "instagram reels downloader",
    "download instagram reels 1080p",
    "reels video saver",
    "reels without watermark",
    "save reels with audio",
    "instagram reels mp4",
  ],
  openGraph: {
    title: "Instagram Reels Downloader - 1080p HD No Watermark | MediaMate",
    description: "Save public Instagram Reels in vertical 9:16 1080p Full HD with synchronized sound.",
    url: "https://mediamate.app/instagram-reels-downloader",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
