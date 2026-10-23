import React from "react";
import { Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="text-center space-y-4 max-w-3xl mx-auto pt-6 sm:pt-10">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-blue/10 border border-brand-blue/30 text-xs font-semibold text-brand-sky">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Ethical & Permitted Media Inspection</span>
      </div>

      <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
        Your All-in-One <br />
        <span className="brand-gradient-text">Media Toolkit</span>
      </h1>

      <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
        Inspect, preview, and download supported media across platforms using official, authorized methods. Honest verification with zero fake download buttons.
      </p>

      {/* Quick platform indicator pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
        <span className="px-2.5 py-1 rounded-full bg-navy-850 border border-navy-700 text-gray-300">
          ▶️ YouTube (Embed & Thumbnails)
        </span>
        <span className="px-2.5 py-1 rounded-full bg-navy-850 border border-navy-700 text-gray-300">
          🔗 Direct Video & Audio (MP4, MP3, WebM)
        </span>
        <span className="px-2.5 py-1 rounded-full bg-navy-850 border border-navy-700 text-gray-300">
          📸 Direct Images (JPG, PNG, WebP)
        </span>
        <span className="px-2.5 py-1 rounded-full bg-navy-850 border border-navy-700 text-gray-300">
          🎵 TikTok & Instagram (Public oEmbed)
        </span>
      </div>
    </section>
  );
}
