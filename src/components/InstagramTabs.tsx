import React from "react";
import Link from "next/link";

interface InstagramTabsProps {
  activeTab: "all" | "reels" | "stories" | "photos" | "audio";
}

export function InstagramTabs({ activeTab }: InstagramTabsProps) {
  const tabs = [
    { id: "all", label: "All-in-One", href: "/instagram-video-downloader", icon: "✨" },
    { id: "reels", label: "Reels", href: "/instagram-reels-downloader", icon: "🎬" },
    { id: "stories", label: "Stories", href: "/instagram-story-saver", icon: "⚡" },
    { id: "photos", label: "Photos", href: "/instagram-photo-downloader", icon: "📸" },
    { id: "audio", label: "Audio MP3", href: "/instagram-audio-mp3-extractor", icon: "🎵" },
  ];

  return (
    <div className="pt-2 flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap max-w-xl mx-auto">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            prefetch={true}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isActive
                ? "insta-btn text-white shadow-md shadow-pink-500/25 scale-[1.02]"
                : "bg-white hover:bg-pink-50 text-gray-700 hover:text-[#d62976] border border-gray-200"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
