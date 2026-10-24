import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Instagram Story Saver - Download Stories & Highlights Anonymously | MediaMate",
  description:
    "Save public Instagram Stories and Highlights in high definition before they expire. Anonymous, fast, free, and no login required.",
  keywords: [
    "instagram story saver",
    "download instagram stories",
    "save instagram story highlights",
    "anonymous instagram story viewer",
    "instagram story downloader hd",
  ],
  openGraph: {
    title: "Instagram Story Saver - Download Stories Anonymously | MediaMate",
    description: "Save public Instagram Stories and Highlights before the 24-hour expiration window closes.",
    url: "https://mediamate.app/instagram-story-saver",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
