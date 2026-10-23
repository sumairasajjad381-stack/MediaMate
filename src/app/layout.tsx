import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "MediaMate — Free Multi-Platform Media Toolkit",
  description: "A fast, clean, and free media toolkit. Inspect, preview, and download supported media across platforms with official methods.",
  keywords: ["media toolkit", "free video preview", "media inspector", "image download", "youtube thumbnail"],
  openGraph: {
    title: "MediaMate — Free Multi-Platform Media Toolkit",
    description: "Simple, clean, and fast media toolkit. 100% free with zero registration required.",
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
    <html lang="en">
      <body className="bg-white text-gray-800 antialiased selection:bg-blue-100 selection:text-blue-900">
        {children}
      </body>
    </html>
  );
}
