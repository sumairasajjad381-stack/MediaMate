"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Youtube,
  Search,
  Loader2,
  Clipboard,
  Info,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Download,
  Play,
  Image as ImageIcon,
  ShieldCheck,
  ChevronDown,
  User,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HistoryDrawer } from "@/components/HistoryDrawer";
import { MediaInspectResult } from "@/lib/platforms/types";

const LOCAL_STORAGE_KEY = "mediamate_recent_history";

export default function YouTubeVideoDownloaderPage() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inspectResult, setInspectResult] = useState<MediaInspectResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<MediaInspectResult[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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

      const res = await fetch("/api/media/inspect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), platform: "youtube" }),
      });

      const json = await res.json();
      if (!res.ok || !json.data) throw new Error(json.error || "Failed to inspect the YouTube link.");

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

  const handleCopyUrl = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const sampleYouTubeUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

  const faqs = [
    {
      q: "Can I download full MP4 video streams directly from YouTube?",
      a: "In strict compliance with YouTube's Developer Terms of Service and copyright laws, direct video stream extraction is not permitted. MediaMate provides verified official oEmbed metadata, authorized privacy-enhanced embed previews, and high-resolution thumbnail downloads.",
    },
    {
      q: "How do I download the high-resolution YouTube thumbnail?",
      a: "Paste any YouTube link, click 'Inspect Link', and use the 'Download Thumbnail' button to save the original high-resolution maximum quality image (maxresdefault.jpg).",
    },
    {
      q: "Does this work with YouTube Shorts?",
      a: "Yes. MediaMate recognizes standard YouTube watch links, shorts links (/shorts/...), and youtu.be short links.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800 selection:bg-red-100 selection:text-red-900">
      <Header
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 sm:py-14 space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-2xl mx-auto pt-2 sm:pt-6">
          <div className="flex items-center justify-center mb-3">
            <div className="w-16 h-16 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-xl shadow-red-500/20">
              <Youtube className="w-9 h-9" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
            YouTube <span className="text-red-600">Video Downloader</span>
          </h1>

          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Inspect YouTube Videos, Shorts, HD Thumbnails & Privacy-Enhanced Embed Previews.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 font-semibold">
              ▶️ Official Embed Player
            </span>
            <span className="px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 font-semibold">
              🖼️ MaxRes HD Thumbnail
            </span>
            <span className="px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 font-semibold">
              ⚡ 100% Free & Legal
            </span>
          </div>

          {/* Input Box */}
          <div className="pt-4 max-w-2xl mx-auto space-y-3">
            <form onSubmit={handleInspect}>
              <div className="flex flex-col sm:flex-row items-center gap-2 p-2 bg-white rounded-2xl border border-gray-200 google-shadow transition-all focus-within:border-red-600 focus-within:ring-2 focus-within:ring-red-100 hover:border-red-300">
                <div className="flex items-center flex-1 w-full px-3 gap-2">
                  <Search className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    type="url"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste YouTube Video or Shorts URL..."
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
                      className="flex items-center gap-1 text-xs text-gray-600 hover:text-red-600 px-2 py-1 rounded bg-red-50 hover:bg-red-100 transition border border-red-200 font-medium"
                    >
                      <Clipboard className="w-3.5 h-3.5 text-red-600" />
                      <span className="hidden sm:inline">Paste</span>
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!url.trim() || isLoading}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl font-medium text-white shadow-md bg-red-600 hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Inspecting...</span>
                    </>
                  ) : (
                    <span>Inspect Link</span>
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

        {/* Results Card */}
        {inspectResult && inspectResult.isSupported && (
          <section className="animate-fadeIn">
            <div className="w-full max-w-2xl mx-auto rounded-2xl bg-white border border-gray-200 google-shadow overflow-hidden transition relative before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-red-600">
              <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2 pt-5">
                <div className="flex items-center gap-2.5">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-red-50 text-red-600 border border-red-200">
                    {inspectResult.platformName}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Verified Link</span>
                  </span>
                </div>

                <a
                  href={inspectResult.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-500 hover:text-red-600 flex items-center gap-1 p-1.5 rounded-lg hover:bg-red-50 transition"
                >
                  <span>Open on YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Embed Player */}
              {inspectResult.previewUrl && (
                <div className="relative bg-gray-50 flex items-center justify-center min-h-[260px] max-h-[480px] overflow-hidden border-b border-gray-100">
                  <iframe
                    src={inspectResult.previewUrl}
                    title={inspectResult.title || "YouTube Preview"}
                    className="w-full h-[320px] sm:h-[420px] border-none"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              <div className="p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-gray-900 leading-snug">
                    {inspectResult.title || "Valid YouTube Video"}
                  </h3>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 w-20 shrink-0">Platform:</span>
                    <span className="text-gray-800 font-medium">{inspectResult.platformName}</span>
                  </div>

                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-semibold text-gray-900 w-20 shrink-0">URL:</span>
                    <span className="text-red-600 truncate font-mono text-xs">{inspectResult.url}</span>
                    <button
                      onClick={() => handleCopyUrl(inspectResult.url)}
                      title="Copy URL"
                      className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition shrink-0"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
                    </button>
                  </div>

                  {inspectResult.author && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 w-20 shrink-0">Creator:</span>
                      <span className="text-gray-800 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-red-600" />
                        <span>{inspectResult.author}</span>
                      </span>
                    </div>
                  )}
                </div>

                {inspectResult.limitationsNotice && (
                  <div className="p-4 rounded-xl bg-[#f9fafb] border border-gray-200 text-xs sm:text-sm text-gray-700 flex items-start gap-3 shadow-xs">
                    <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-semibold text-gray-900 block">Message:</span>
                      <p className="leading-relaxed text-gray-600">{inspectResult.limitationsNotice}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-gray-500 font-medium">Available Actions:</span>

                <div className="flex flex-wrap items-center gap-2.5">
                  {inspectResult.thumbnailUrl && (
                    <a
                      href={`/api/media/download?url=${encodeURIComponent(inspectResult.thumbnailUrl)}`}
                      download
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 shadow flex items-center gap-2 transition"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download HD Thumbnail</span>
                    </a>
                  )}

                  <a
                    href={inspectResult.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl text-xs font-medium text-gray-700 bg-white hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5 transition shadow-xs"
                  >
                    <span>Open on YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* FAQs */}
        <section className="max-w-2xl mx-auto space-y-6 pt-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">YouTube Downloader FAQs</h2>
            <p className="text-xs sm:text-sm text-gray-500">Legal permissions and supported actions for YouTube media</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className="rounded-2xl bg-white border border-gray-200 overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm text-gray-800 hover:text-red-600 transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${isOpen ? "rotate-180 text-red-600" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
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
