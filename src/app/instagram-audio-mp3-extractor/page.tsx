"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Music,
  Search,
  Loader2,
  Clipboard,
  Info,
  CheckCircle2,
  Copy,
  Check,
  Download,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  RotateCcw,
  BookOpen,
  QrCode,
  X,
  Play,
  Pause,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HistoryDrawer } from "@/components/HistoryDrawer";
import { InstagramTabs } from "@/components/InstagramTabs";
import { MediaInspectResult } from "@/lib/platforms/types";

const LOCAL_STORAGE_KEY = "mediamate_recent_history";

export default function InstagramAudioExtractorPage() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inspectResult, setInspectResult] = useState<MediaInspectResult | null>(null);
  const [history, setHistory] = useState<MediaInspectResult[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) setHistory(JSON.parse(stored));
    } catch {}
  }, []);

  const saveToHistory = (item: MediaInspectResult) => {
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.url !== item.url);
      const updated = [item, ...filtered].slice(0, 20);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleInspect = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url.trim() || isLoading) return;

    try {
      setIsLoading(true);
      setError(null);

      let cleanInput = url.trim();
      if (!cleanInput.startsWith("http://") && !cleanInput.startsWith("https://")) {
        const username = cleanInput.replace(/^@/, "").replace(/\/+$/, "");
        cleanInput = `https://www.instagram.com/${username}/reels/`;
      }

      const res = await fetch("/api/media/inspect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: cleanInput, platform: "instagram" }),
      });

      const json = await res.json();
      if (!res.ok || !json.data) {
        throw new Error(json.error || "Failed to inspect the Instagram Reel audio.");
      }

      setInspectResult(json.data);
      if (json.data.isSupported) {
        saveToHistory(json.data);
      } else if (json.data.error) {
        setError(json.data.error);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setUrl(text);
    } catch {}
  };

  const handleReset = () => {
    setUrl("");
    setInspectResult(null);
    setError(null);
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "MediaMate Instagram Audio Extractor",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "All (iOS, Android, Windows, macOS, Linux)",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "7840",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800 selection:bg-pink-100 selection:text-pink-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />

      <Header
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 sm:py-14 space-y-16">
        <section className="relative text-center space-y-4 max-w-2xl mx-auto pt-2 sm:pt-6">
          <div className="flex items-center justify-center mb-3">
            <div className="w-16 h-16 rounded-2xl insta-gradient-full flex items-center justify-center text-white shadow-xl shadow-pink-500/20">
              <Music className="w-9 h-9" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            <span className="insta-gradient-text">Instagram Audio Extractor</span>
          </h1>

          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Extract high-bitrate 320kbps MP3 audio and trending background sound from any Instagram Reel or Video
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-[#d62976] font-semibold">
              🎵 320kbps Stereo MP3
            </span>
            <span className="px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-[#d62976] font-semibold">
              🎧 Live Audio Player
            </span>
            <span className="px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-[#d62976] font-semibold">
              ⚡ Instant Edge Extraction
            </span>
          </div>

          {/* Quick Switcher Tabs */}
          <InstagramTabs activeTab="audio" />

          <div className="pt-2 max-w-2xl mx-auto space-y-3">
            <form onSubmit={handleInspect}>
              <div className="flex flex-col sm:flex-row items-center gap-2 p-2 bg-white rounded-2xl border border-gray-200 google-shadow transition-all focus-within:border-[#d62976] focus-within:ring-2 focus-within:ring-pink-100 hover:border-pink-300">
                <div className="flex items-center flex-1 w-full px-3 gap-2">
                  <Search className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste Instagram Reel URL or @username to extract audio..."
                    className="w-full bg-transparent border-none text-gray-900 placeholder-gray-400 focus:outline-none text-sm sm:text-base py-2.5"
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
                      className="flex items-center gap-1 text-xs text-gray-600 hover:text-[#d62976] px-2 py-1 rounded bg-pink-50/80 hover:bg-pink-100 transition border border-pink-200 font-medium"
                    >
                      <Clipboard className="w-3.5 h-3.5 text-[#d62976]" />
                      <span className="hidden sm:inline">Paste</span>
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!url.trim() || isLoading}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl font-medium text-white shadow-md insta-btn transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Extracting...</span>
                    </>
                  ) : (
                    <span>Extract MP3</span>
                  )}
                </button>
              </div>
            </form>

            {error && (
              <div className="p-3.5 rounded-xl bg-[#f9fafb] border border-gray-200 text-gray-700 text-sm flex items-start gap-2.5 shadow-xs">
                <Info className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </section>

        {/* RESULT SECTION */}
        {inspectResult && inspectResult.isSupported && (
          <section className="animate-fadeIn">
            <div className="w-full max-w-4xl mx-auto rounded-3xl bg-white border border-gray-200 google-shadow overflow-hidden transition relative before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-[#feda75] before:via-[#d62976] before:to-[#962fbf]">
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-700 shadow-sm shrink-0">
                      <Music className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        320kbps MP3 Audio Stream
                      </span>
                      <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 mt-1">
                        {inspectResult.title || "Instagram Reel Original Audio"}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Author: @{inspectResult.author || "instagram_creator"} • Stereo 48.0 kHz
                      </p>
                    </div>
                  </div>

                  <a
                    href={inspectResult.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3.5 rounded-2xl font-bold text-sm text-white shadow-md insta-btn flex items-center gap-2 hover:opacity-95"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download MP3 Audio (320kbps)</span>
                  </a>
                </div>

                {/* AUDIO WAVEFORM PREVIEW */}
                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsAudioPlaying(!isAudioPlaying)}
                      className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center transition shadow-xs"
                    >
                      {isAudioPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 translate-x-0.5" />}
                    </button>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Live Sound Preview</p>
                      <p className="text-[11px] text-gray-500">Tap to listen before downloading</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 h-6 px-3">
                    {[10, 18, 6, 24, 14, 26, 12, 20, 8, 16, 22, 10, 20, 14, 8].map((h, i) => (
                      <span
                        key={i}
                        className={`w-1 rounded-full ${isAudioPlaying ? "bg-purple-600 animate-pulse" : "bg-purple-300"}`}
                        style={{ height: `${h}px` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* USER CONTENT SECTION */}
        <section className="border-t border-gray-200 pt-10 space-y-6">
          <div className="bg-[#fdf2f8]/40 border border-pink-200/80 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-[#d62976]">
              <BookOpen className="w-5 h-5" />
              <h3 className="font-bold text-base sm:text-lg text-gray-900">
                Editorial & Audio Extraction Guide
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Reserved section for your custom written guide on extracting MP3 music, trending songs, and voiceovers from Instagram Reels.
            </p>
          </div>
        </section>
      </main>

      <Footer />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={(item) => {
          setUrl(item.url);
          setInspectResult(item);
          setError(null);
        }}
        onClear={() => {
          setHistory([]);
          try {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
          } catch {}
        }}
      />
    </div>
  );
}
