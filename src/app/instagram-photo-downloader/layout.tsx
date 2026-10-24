import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Instagram Photo & Carousel Downloader - Download Full HD Photos | MediaMate",
  description:
    "Free online Instagram Photo Downloader. Save full-resolution JPG photos and multi-slide Carousel albums without quality compression. Fast, anonymous, and free.",
  keywords: [
    "instagram photo downloader",
    "instagram carousel saver",
    "download instagram slides",
    "save instagram images hd",
    "instagram album downloader",
  ],
  openGraph: {
    title: "Instagram Photo & Carousel Downloader - Full HD Photos | MediaMate",
    description: "Download high-resolution Instagram photos and carousel slide albums in original quality.",
    url: "https://mediamate.app/instagram-photo-downloader",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
