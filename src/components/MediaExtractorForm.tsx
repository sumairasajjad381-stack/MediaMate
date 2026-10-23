"use client";

import React, { useState } from "react";
import { Link2, Sparkles, Loader2, Clipboard, AlertCircle } from "lucide-react";

interface MediaExtractorFormProps {
  onExtract: (url: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function MediaExtractorForm({ onExtract, isLoading, error }: MediaExtractorFormProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || isLoading) return;
    await onExtract(url.trim());
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
      }
    } catch {
      // Clipboard read permission might be denied
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex flex-col sm:flex-row items-center gap-2 p-2 rounded-2xl glass-card shadow-2xl transition border border-gray-700/60 focus-within:border-pink-500/50">
          <div className="flex items-center flex-1 w-full px-3 gap-2">
            <Link2 className="w-5 h-5 text-gray-400 group-focus-within:text-pink-400 transition" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste Instagram link (e.g. https://www.instagram.com/reel/C6XYZ...)"
              className="w-full bg-transparent border-none text-white placeholder-gray-500 focus:outline-none text-sm sm:text-base py-2.5"
              disabled={isLoading}
            />
            {url ? (
              <button
                type="button"
                onClick={() => setUrl("")}
                className="text-xs text-gray-500 hover:text-gray-300 px-2 py-1"
              >
                Clear
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePaste}
                title="Paste from clipboard"
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-white px-2 py-1 rounded bg-gray-800/80 hover:bg-gray-700 transition"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Paste</span>
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={!url.trim() || isLoading}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-medium text-white shadow-lg insta-gradient-bg hover:opacity-95 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Extracting...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Fetch Media</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error Banner */}
      {error && (
        <div className="mt-3 p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Format badges */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-gray-400">
        <span className="text-gray-500">Supports:</span>
        <span className="px-2.5 py-1 rounded-full bg-gray-800/60 border border-gray-700/50">🎥 Reels & Videos</span>
        <span className="px-2.5 py-1 rounded-full bg-gray-800/60 border border-gray-700/50">📸 Photo Posts</span>
        <span className="px-2.5 py-1 rounded-full bg-gray-800/60 border border-gray-700/50">📑 Carousels / Multi-slides</span>
        <span className="px-2.5 py-1 rounded-full bg-gray-800/60 border border-gray-700/50">⚡ Stories</span>
      </div>
    </div>
  );
}
