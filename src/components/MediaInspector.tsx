"use client";

import React, { useState } from "react";
import { Search, Loader2, Clipboard, Globe, AlertCircle } from "lucide-react";

interface MediaInspectorProps {
  onInspect: (url: string, platform?: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function MediaInspector({ onInspect, isLoading, error }: MediaInspectorProps) {
  const [url, setUrl] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("auto");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || isLoading) return;
    await onInspect(url.trim(), selectedPlatform === "auto" ? undefined : selectedPlatform);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setUrl(text);
    } catch {
      // Clipboard read permission might be blocked
    }
  };

  const sampleLinks = [
    { label: "Direct MP4 Video", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
    { label: "Direct PNG Image", url: "https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png" },
    { label: "YouTube Video", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-2 p-2 rounded-2xl glow-card shadow-2xl border border-navy-700/80 focus-within:border-brand-sky/60 transition">
          {/* Platform Selector */}
          <div className="flex items-center px-3 py-2 rounded-xl bg-navy-900 border border-navy-750 text-xs text-gray-300 w-full sm:w-auto shrink-0">
            <Globe className="w-3.5 h-3.5 mr-2 text-brand-sky" />
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="bg-transparent text-gray-200 focus:outline-none cursor-pointer"
            >
              <option value="auto" className="bg-navy-900">Auto Detect</option>
              <option value="direct" className="bg-navy-900">Direct File (MP4/PNG/MP3)</option>
              <option value="youtube" className="bg-navy-900">YouTube</option>
              <option value="tiktok" className="bg-navy-900">TikTok</option>
              <option value="instagram" className="bg-navy-900">Instagram</option>
              <option value="pinterest" className="bg-navy-900">Pinterest</option>
              <option value="facebook" className="bg-navy-900">Facebook</option>
            </select>
          </div>

          {/* URL Input */}
          <div className="flex items-center flex-1 w-full px-3 gap-2">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste any supported media link or direct URL..."
              className="w-full bg-transparent border-none text-white placeholder-gray-500 focus:outline-none text-sm sm:text-base py-2"
              disabled={isLoading}
            />
            {url ? (
              <button
                type="button"
                onClick={() => setUrl("")}
                className="text-xs text-gray-400 hover:text-gray-200 px-2 py-1"
              >
                Clear
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePaste}
                title="Paste from clipboard"
                className="flex items-center gap-1 text-xs text-gray-300 hover:text-white px-2 py-1 rounded bg-navy-850 hover:bg-navy-800 transition"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Paste</span>
              </button>
            )}
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={!url.trim() || isLoading}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-medium text-white shadow-lg brand-button-gradient transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Checking...</span>
              </>
            ) : (
              <span>Check Link</span>
            )}
          </button>
        </div>
      </form>

      {/* Error Message Display */}
      {error && (
        <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-sm flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Sample Try-it Links for Beginners */}
      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-gray-400">
        <span className="text-gray-500">Try sample link:</span>
        {sampleLinks.map((sample, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setUrl(sample.url)}
            className="px-2.5 py-1 rounded-lg bg-navy-850 hover:bg-navy-800 text-brand-sky hover:text-white border border-navy-700/60 transition"
          >
            {sample.label}
          </button>
        ))}
      </div>
    </div>
  );
}
