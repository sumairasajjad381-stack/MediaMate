import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MediaMate — Free Multi-Platform Media Toolkit",
  description: "Your all-in-one media toolkit. Inspect, preview, and download supported media across platforms using official, authorized methods on a $0 budget.",
  keywords: ["media toolkit", "media inspector", "video preview", "direct media download", "youtube thumbnail grabber", "oembed viewer"],
  authors: [{ name: "MediaMate Team" }],
  openGraph: {
    title: "MediaMate — Free Multi-Platform Media Toolkit",
    description: "Inspect, preview, and download supported media across platforms using official, authorized methods.",
    url: "https://mediamate.toolkit",
    siteName: "MediaMate",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#060913] text-gray-100 antialiased selection:bg-sky-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
