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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("mediamate_theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100 antialiased selection:bg-blue-100 selection:text-blue-900 transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
