import React from "react";
import { HardDrive, Youtube, Video, ShieldCheck } from "lucide-react";

export function ToolsGrid() {
  const tools = [
    {
      icon: HardDrive,
      title: "Direct Media Prober",
      desc: "Detect exact byte size, probe MIME types, and stream authorized MP4, WebM, and audio files.",
      badge: "Full Download",
      iconBg: "bg-blue-50 text-blue-600",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      icon: Youtube,
      title: "YouTube Hub",
      desc: "Official oEmbed metadata inspection, clean privacy-enhanced embed player, and thumbnail downloader.",
      badge: "Embed & Thumbnail",
      iconBg: "bg-red-50 text-red-600",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      icon: Video,
      title: "TikTok & Reels Explorer",
      desc: "Official public preview and creator attribution for short-form social videos without logging in.",
      badge: "Preview & Meta",
      iconBg: "bg-emerald-50 text-emerald-600",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      icon: ShieldCheck,
      title: "SSRF Security Filter",
      desc: "Zero-trust link validation that blocks localhost, internal subnets, and cloud instance metadata attacks.",
      badge: "Built-In",
      iconBg: "bg-amber-50 text-amber-600",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
  ];

  return (
    <section className="space-y-6 pt-10">
      <div className="text-center space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Supported Media Tools</h2>
        <p className="text-xs sm:text-sm text-gray-500 max-w-lg mx-auto">
          Clean, verified tools that operate strictly with permitted public methods.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tools.map((tool, i) => {
          const Icon = tool.icon;
          return (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white border border-gray-200 flex flex-col justify-between space-y-3 transition-shadow hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${tool.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${tool.badgeColor}`}>
                    {tool.badge}
                  </span>
                </div>
                <h3 className="font-semibold text-sm text-gray-900">{tool.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{tool.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
