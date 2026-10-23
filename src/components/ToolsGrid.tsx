import React from "react";
import { HardDrive, Youtube, Video, ShieldCheck, Image as ImageIcon, Music } from "lucide-react";

export function ToolsGrid() {
  const tools = [
    {
      icon: HardDrive,
      title: "Direct Media Prober",
      desc: "Inspect real-time HTTP headers, detect exact byte size, probe MIME types, and stream authorized files.",
      badge: "Full Download",
      color: "text-brand-sky",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    {
      icon: Youtube,
      title: "YouTube Hub",
      desc: "Official oEmbed metadata inspection, privacy-enhanced video embed player, and max-resolution thumbnail downloader.",
      badge: "Embed & Thumbnail",
      color: "text-red-400",
      badgeColor: "bg-brand-blue/10 text-brand-sky border-brand-blue/20",
    },
    {
      icon: Video,
      title: "TikTok & Reels Explorer",
      desc: "Authorized preview and creator attribution for public short-form videos without requiring private session cookies.",
      badge: "Preview & Meta",
      color: "text-brand-emerald",
      badgeColor: "bg-brand-blue/10 text-brand-sky border-brand-blue/20",
    },
    {
      icon: ShieldCheck,
      title: "SSRF Security Filter",
      desc: "Zero-trust link validation that blocks localhost, internal subnets, and cloud instance metadata attacks.",
      badge: "Built-In",
      color: "text-amber-400",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
  ];

  return (
    <section className="space-y-6 pt-10">
      <div className="text-center space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Available Media Tools</h2>
        <p className="text-xs sm:text-sm text-gray-400 max-w-lg mx-auto">
          Built on a modular adapter architecture designed for compliant, $0 budget operation.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tools.map((tool, i) => {
          const Icon = tool.icon;
          return (
            <div
              key={i}
              className="p-5 rounded-2xl glow-card border border-navy-750 flex flex-col justify-between space-y-3 transition hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-9 h-9 rounded-xl bg-navy-900 border border-navy-700/80 flex items-center justify-center ${tool.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${tool.badgeColor}`}>
                    {tool.badge}
                  </span>
                </div>
                <h3 className="font-semibold text-sm text-gray-100">{tool.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{tool.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
