"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Search,
  Loader2,
  Clipboard,
  Info,
  CheckCircle2,
  Copy,
  Check,
  Download,
  Camera,
  ShieldCheck,
  ChevronDown,
  Zap,
  Smartphone,
  EyeOff,
  RotateCcw,
  BookOpen,
  QrCode,
  X,
  Play,
  Pause,
  SlidersHorizontal,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HistoryDrawer } from "@/components/HistoryDrawer";
import { MediaInspectResult } from "@/lib/platforms/types";

const LOCAL_STORAGE_KEY = "mediamate_recent_history";

export default function InstagramStorySaverPage() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inspectResult, setInspectResult] = useState<MediaInspectResult | null>(null);
  const [copiedHd, setCopiedHd] = useState(false);
  const [history, setHistory] = useState<MediaInspectResult[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showQrModal, setShowQrModal] = useState(false);

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
        body: JSON.stringify({ url: url.trim(), platform: "instagram" }),
      });

      const json = await res.json();
      if (!res.ok || !json.data) {
        throw new Error(json.error || "Failed to inspect the Instagram Story link.");
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

  const handleCopyHdLink = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedHd(true);
      setTimeout(() => setCopiedHd(false), 2000);
    } catch {}
  };

  const handleReset = () => {
    setUrl("");
    setInspectResult(null);
    setError(null);
  };

  const sampleUrl = "https://www.instagram.com/stories/xxx";

  const faqs = [
    {
      q: "Can I download Instagram Stories anonymously without being seen?",
      a: "Yes! MediaMate queries public story links directly from edge delivery servers. Your Instagram profile is never connected, meaning the uploader will not see your username on their Story viewer list.",
    },
    {
      q: "Can I download Story Highlights from profile archives?",
      a: "Yes, any public permanent Highlight can be downloaded in full resolution MP4 video or JPG photo format.",
    },
    {
      q: "How long do I have to save a live Story?",
      a: "Regular Instagram Stories expire after 24 hours. Once the 24-hour window has passed on Instagram, the media is deleted from platform servers, so download it while it is live.",
    },
  ];

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "MediaMate Instagram Story Saver",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "All (iOS, Android, Windows, macOS, Linux)",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "8920",
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
              <Sparkles className="w-9 h-9" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            <span className="insta-gradient-text">Instagram Story Saver</span>
          </h1>

          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Download public Instagram Stories & Permanent Highlights in HD — 100% Anonymous & Zero Login Required
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-[#d62976] font-semibold">
              ⚡ 24h Live Stories
            </span>
            <span className="px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-[#d62976] font-semibold">
              📁 Permanent Highlights
            </span>
            <span className="px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-[#d62976] font-semibold">
              🕵️ Anonymously Saved
            </span>
          </div>

          <div className="pt-4 max-w-2xl mx-auto space-y-3">
            <form onSubmit={handleInspect}>
              <div className="flex flex-col sm:flex-row items-center gap-2 p-2 bg-white rounded-2xl border border-gray-200 google-shadow transition-all focus-within:border-[#d62976] focus-within:ring-2 focus-within:ring-pink-100 hover:border-pink-300">
                <div className="flex items-center flex-1 w-full px-3 gap-2">
                  <Search className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    type="url"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste Instagram Story link (instagram.com/stories/...)"
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
                      <span>Inspecting...</span>
                    </>
                  ) : (
                    <span>Save Story</span>
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
              <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-5 relative rounded-2xl overflow-hidden bg-gradient-to-tr from-gray-950 to-gray-800 shadow-xl aspect-[9/16] sm:aspect-[4/5] max-h-[460px] flex flex-col justify-between p-4 group">
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs w-max z-10">
                    <span className="font-semibold truncate max-w-[140px]">
                      @{inspectResult.author || "instagram_story"}
                    </span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  </div>

                  {inspectResult.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={inspectResult.thumbnailUrl}
                      alt={inspectResult.title || "Instagram Story Preview"}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : null}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center text-white/90 bg-gradient-to-b from-gray-900 to-black pointer-events-none">
                    <div className="w-16 h-16 rounded-2xl insta-gradient-full flex items-center justify-center text-white shadow-xl shadow-pink-500/30">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <span className="text-sm font-bold tracking-wide">Instagram Story</span>
                    <span className="text-xs text-gray-300">HD Stream Ready</span>
                  </div>
                </div>

                <div className="md:col-span-7 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-50 text-[#d62976] border border-pink-200">
                      Instagram Story • HD
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-snug">
                      {inspectResult.title || "Instagram Story Media"}
                    </h3>
                  </div>

                  <div className="space-y-3 pt-2">
                    <a
                      href={inspectResult.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-4 px-6 rounded-2xl font-bold text-base text-white shadow-lg insta-btn flex items-center justify-center gap-3 transition transform hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <Download className="w-5 h-5 text-white" />
                      <span>Download Story (HD)</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => setShowQrModal(true)}
                      className="w-full py-3.5 px-6 rounded-2xl font-semibold text-sm text-gray-700 bg-white hover:bg-pink-50/70 border border-gray-200 hover:border-pink-300 flex items-center justify-center gap-2.5 transition shadow-2xs"
                    >
                      <QrCode className="w-4 h-4 text-[#d62976]" />
                      <span>📱 Scan QR to Save on Mobile</span>
                    </button>

                    <button
                      onClick={handleReset}
                      className="w-full py-3 px-6 rounded-2xl font-medium text-xs sm:text-sm text-gray-600 bg-[#f3f4f6] hover:bg-gray-200 border border-gray-200 flex items-center justify-center gap-2 transition"
                    >
                      <RotateCcw className="w-4 h-4 text-gray-500" />
                      <span>↻ Download Another Story</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* QR MODAL */}
        {showQrModal && inspectResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-gray-200 shadow-2xl relative space-y-5 text-center">
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-12 h-12 rounded-2xl insta-gradient-full flex items-center justify-center text-white mx-auto shadow-md shadow-pink-500/20">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-gray-900">Scan to Save Story</h3>
              <div className="p-4 bg-pink-50/50 rounded-2xl border border-pink-100 inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                    inspectResult.url
                  )}`}
                  alt="QR Code for Story"
                  className="w-44 h-44 rounded-xl mx-auto shadow-xs"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* FAQS */}
        <section className="max-w-3xl mx-auto space-y-6 pt-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Instagram Story Saver FAQs
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-2xl bg-white border border-gray-200 p-5 space-y-2">
                <h3 className="font-semibold text-sm text-gray-900">{faq.q}</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* USER CONTENT SECTION */}
        <section className="border-t border-gray-200 pt-10 space-y-6">
          <div className="bg-[#fdf2f8]/40 border border-pink-200/80 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-[#d62976]">
              <BookOpen className="w-5 h-5" />
              <h3 className="font-bold text-base sm:text-lg text-gray-900">
                Editorial & Story Guide Section
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Reserved section for your custom written guide on saving Instagram Stories anonymously and archiving Highlights.
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
