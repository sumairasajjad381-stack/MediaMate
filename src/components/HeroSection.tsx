import React from "react";

export function HeroSection() {
  return (
    <section className="text-center space-y-4 max-w-2xl mx-auto pt-6 sm:pt-10">
      {/* Google-style Center Dots */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="w-3.5 h-3.5 rounded-full bg-[#4285F4] animate-pulse" />
        <span className="w-3.5 h-3.5 rounded-full bg-[#EA4335]" />
        <span className="w-3.5 h-3.5 rounded-full bg-[#FBBC05]" />
        <span className="w-3.5 h-3.5 rounded-full bg-[#34A853]" />
      </div>

      {/* Big Simple Bold Heading */}
      <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900">
        Media<span className="text-[#2563eb]">Mate</span>
      </h1>

      {/* Small Light Gray Subtitle */}
      <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
        Simple, fast, and legal multi-platform media toolkit. Inspect, preview, and download supported media files.
      </p>

      {/* Light Clean Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-gray-600">
        <span className="px-3 py-1 rounded-full bg-gray-100 border border-gray-200">
          YouTube
        </span>
        <span className="px-3 py-1 rounded-full bg-gray-100 border border-gray-200">
          Direct MP4 & MP3
        </span>
        <span className="px-3 py-1 rounded-full bg-gray-100 border border-gray-200">
          Direct Images
        </span>
        <span className="px-3 py-1 rounded-full bg-gray-100 border border-gray-200">
          TikTok & Instagram
        </span>
      </div>
    </section>
  );
}
