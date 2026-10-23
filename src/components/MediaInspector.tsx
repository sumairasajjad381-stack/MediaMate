"use client";

import React, { useState } from "react";
import { Search, Loader2, Clipboard, Globe, Info } from "lucide-react";

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
    { label: "Sample MP4 Video", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
    { label: "Sample PNG Image", url: "https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png" },
    { label: "Sample YouTube", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row items-center gap-2 p-2 bg-white rounded-2xl border border-gray-200 google-shadow transition-shadow hover:border-gray-300">
          {/* Platform Selector */}
          <div className="flex items-center px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 w-full sm:w-auto shrink-0">
            <Globe className="w-3.5 h-3.5 mr-2 text-blue-600" />
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="bg-transparent text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="auto">Auto Detect</option>
              <option value="direct">Direct File (MP4/PNG/MP3)</option>
              <option value="youtube">YouTube</option>
              <option value="tiktok">TikTok</option>
              <option value="instagram">Instagram</option>
              <option value="pinterest">Pinterest</option>
              <option value="facebook">Facebook</option>
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
              placeholder="Paste any supported media link..."
              className="w-full bg-transparent border-none text-gray-900 placeholder-gray-400 focus:outline-none text-sm sm:text-base py-2"
              disabled={isLoading}
            />
            {url ? (
              <button
                type="button"
                onClick={() => setUrl("")}
                className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1"
              >
                Clear
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePaste}
                title="Paste from clipboard"
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 transition"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Paste</span>
              </button>
            )}
          </div>

          {/* Clean Primary Blue Button */}
          <button
            type="submit"
            disabled={!url.trim() || isLoading}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-medium text-white shadow google-btn transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0"
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

      {/* Friendly Light Info Box (No harsh red errors) */}
      {error && (
        <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 text-sm flex items-start gap-2.5 shadow-xs">
          <Info className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Sample Links for Instant Testing */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-gray-500">
        <span>Try sample:</span>
        {sampleLinks.map((sample, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setUrl(sample.url)}
            className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-blue-600 hover:text-blue-800 border border-gray-200 transition"
          >
            {sample.label}
          </button>
        ))}
      </div>
    </div>
  );
}
