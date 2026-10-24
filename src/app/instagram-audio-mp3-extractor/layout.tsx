import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Instagram Audio & MP3 Extractor - 320kbps Audio Download | MediaMate",
  description:
    "Convert Instagram Reels and videos to high-bitrate 320kbps MP3 audio tracks. Fast, online, free audio extraction with live audio preview player.",
  keywords: [
    "instagram audio extractor",
    "instagram reels mp3",
    "extract audio from instagram",
    "instagram sound downloader 320kbps",
    "instagram to mp3 converter",
  ],
  openGraph: {
    title: "Instagram Audio & MP3 Extractor - 320kbps Audio | MediaMate",
    description: "Extract clean MP3 audio tracks from public Instagram Reels with live audio preview.",
    url: "https://mediamate.app/instagram-audio-mp3-extractor",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
