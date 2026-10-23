import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InstaArchiver - High-Performance Instagram Media Downloader",
  description: "Download and archive Instagram Reels, Posts, Carousels, and Stories in original high resolution.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0b0d13] text-gray-100 antialiased selection:bg-pink-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
