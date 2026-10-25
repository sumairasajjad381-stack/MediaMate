"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Film,
  Search,
  Loader2,
  Clipboard,
  Info,
  CheckCircle2,
  Copy,
  Check,
  Download,
  Heart,
  Camera,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  Layers,
  Music,
  Zap,
  Smartphone,
  EyeOff,
  Star,
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  BookOpen,
  QrCode,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HistoryDrawer } from "@/components/HistoryDrawer";
import { InstagramTabs } from "@/components/InstagramTabs";
import {
  DownloadSuccessModal,
  DownloadSuccessBanner,
  DownloadItemDetails,
} from "@/components/DownloadSuccessModal";
import { MediaInspectResult } from "@/lib/platforms/types";

const LOCAL_STORAGE_KEY = "mediamate_recent_history";

export default function InstagramReelsDownloaderPage() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inspectResult, setInspectResult] = useState<MediaInspectResult | null>(null);
  const [copiedHd, setCopiedHd] = useState(false);
  const [history, setHistory] = useState<MediaInspectResult[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showQrModal, setShowQrModal] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [highlightHistory, setHighlightHistory] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadSuccessItem, setDownloadSuccessItem] = useState<DownloadItemDetails | null>(null);

  const triggerDownload = (
    quality: string = "1080p Full HD",
    size: string = "12.8 MB",
    mediaType: "video" | "image" | "audio" = "video"
  ) => {
    if (!inspectResult) return;
    const filename =
      mediaType === "audio"
        ? "instagram_reel_audio.mp3"
        : "instagram_reel_1080p.mp4";

    const item: DownloadItemDetails = {
      title: inspectResult.title || "Instagram Reel HD",
      filename,
      size,
      quality,
      mediaType,
      thumbnailUrl: inspectResult.thumbnailUrl,
      downloadUrl: inspectResult.url,
      author: inspectResult.author || "instagram_creator",
      platform: "instagram",
    };

    setDownloadSuccessItem(item);
    setShowDownloadModal(true);
    saveToHistory(inspectResult);
    setHighlightHistory(true);
    setTimeout(() => setHighlightHistory(false), 4500);

    window.open(inspectResult.url, "_blank");
  };

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
        throw new Error(json.error || "Failed to inspect the Instagram Reel.");
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

  const sampleUrl = "https://www.instagram.com/reel/xxx";

  const faqs = [
    {
      q: "How to download Instagram Reels in 1080p Full HD?",
      a: "Copy the link of any public Instagram Reel from your Instagram app, paste it into the search box above, and click 'Download Reel'. MediaMate inspects the source server directly and lets you save the full-resolution 1080p MP4 file with audio, free and without watermarks.",
    },
    {
      q: "Are the downloaded Reels watermark-free?",
      a: "Yes. Unlike other tools that add third-party logos or branding, MediaMate downloads the clean, original video file directly from the content delivery network with zero added watermarks.",
    },
    {
      q: "Can I save Reels directly to iPhone or Android camera roll?",
      a: "Yes. On iOS Safari, tap 'Download Video (1080p)', open the Safari download manager, tap the share icon, and select 'Save Video'. On Android Chrome, the MP4 file automatically saves into your device's Downloads folder and Gallery.",
    },
    {
      q: "Can I extract only the audio (MP3) from an Instagram Reel?",
      a: "Yes. In the format table below your Reel preview, click 'Extract MP3' to download the 320kbps stereo soundtrack separately.",
    },
    {
      q: "Is it safe and anonymous to download Reels?",
      a: "Yes, 100%. We never ask for your Instagram login or personal information. The creator will never be notified that their Reel was saved.",
    },
  ];

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "MediaMate Instagram Reels Downloader",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "All (iOS, Android, Windows, macOS, Linux)",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "11540",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Download Instagram Reels",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Copy Reel Link",
        text: "Open the Instagram app, find the Reel you want to save, tap the 3 dots (...) or Share icon, and select Copy Link.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Paste URL in MediaMate",
        text: "Paste the link into the search box and click Download Reel.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Save in 1080p HD",
        text: "Click Download Reel (1080p) to save the clean MP4 file directly to your camera roll.",
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800 selection:bg-pink-100 selection:text-pink-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Header
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        highlightHistory={highlightHistory}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 sm:py-14 space-y-16">
        {/* HERO SECTION */}
        <section className="relative text-center space-y-4 max-w-2xl mx-auto pt-2 sm:pt-6">
          <div className="flex items-center justify-center mb-3">
            <div className="w-16 h-16 rounded-2xl insta-gradient-full flex items-center justify-center text-white shadow-xl shadow-pink-500/20">
              <Film className="w-9 h-9" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            <span className="insta-gradient-text">Instagram Reels Downloader</span>
          </h1>

          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Download vertical 9:16 Instagram Reels in 1080p Full HD with crystal-clear audio — 100% Watermark Free
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-[#d62976] font-semibold">
              🎥 Vertical 9:16 Format
            </span>
            <span className="px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-[#d62976] font-semibold">
              ⚡ 1080p 60fps HD
            </span>
            <span className="px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-[#d62976] font-semibold">
              🎵 Clean Audio Sync
            </span>
            <span className="px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-[#d62976] font-semibold">
              🚫 Zero Watermark
            </span>
          </div>

          {/* Quick Switcher Tabs */}
          <InstagramTabs activeTab="reels" />

          {/* INPUT FORM */}
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
                    placeholder="Paste Instagram Reel link or @username..."
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
                    <span>Download Reel</span>
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

            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-gray-500">
              <span>Try sample Reel:</span>
              <button
                type="button"
                onClick={() => setUrl(sampleUrl)}
                className="px-2.5 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-[#d62976] hover:text-[#962fbf] border border-pink-200 transition font-medium"
              >
                Sample Instagram Reel
              </button>
            </div>
          </div>
        </section>

        {/* INLINE SUCCESS PREVIEW BAR */}
        {downloadSuccessItem && (
          <DownloadSuccessBanner
            item={downloadSuccessItem}
            onPreviewClick={() => setShowDownloadModal(true)}
            onOpenFileClick={() => window.open(downloadSuccessItem.downloadUrl, "_blank")}
            onDismiss={() => setDownloadSuccessItem(null)}
          />
        )}

        {/* 2-COLUMN RESULT SECTION */}
        {inspectResult && inspectResult.isSupported && (
          <section className="animate-fadeIn">
            <div className="w-full max-w-4xl mx-auto rounded-3xl bg-white border border-gray-200 google-shadow overflow-hidden transition relative before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-[#feda75] before:via-[#d62976] before:to-[#962fbf]">
              <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                {/* LEFT: Reel Player */}
                <div className="md:col-span-5 relative rounded-2xl overflow-hidden bg-gradient-to-tr from-gray-950 to-gray-800 shadow-xl aspect-[9/16] sm:aspect-[4/5] max-h-[460px] flex flex-col justify-between p-4 group">
                  <div className="flex items-center justify-between z-10">
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs">
                      <div className="w-4 h-4 rounded-full insta-gradient-full flex items-center justify-center text-[10px] font-bold">
                        IG
                      </div>
                      <span className="font-semibold truncate max-w-[120px]">
                        @{inspectResult.author || "instagram_creator"}
                      </span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    </div>

                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 transition"
                      title={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>

                  {inspectResult.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={inspectResult.thumbnailUrl}
                      alt={inspectResult.title || "Instagram Reel Preview"}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : null}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center text-white/90 bg-gradient-to-b from-gray-900 to-black pointer-events-none">
                    <div className="w-16 h-16 rounded-2xl insta-gradient-full flex items-center justify-center text-white shadow-xl shadow-pink-500/30">
                      <Film className="w-8 h-8" />
                    </div>
                    <span className="text-sm font-bold tracking-wide">Instagram Reel</span>
                    <span className="text-xs text-gray-300">1080p Full HD Ready</span>
                  </div>

                  <div className="relative z-10 flex items-center justify-center my-auto">
                    <button
                      type="button"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:scale-110 hover:bg-black/70 transition-all shadow-xl"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6 fill-white" />
                      ) : (
                        <Play className="w-6 h-6 fill-white translate-x-0.5" />
                      )}
                    </button>
                  </div>

                  <div className="relative z-10 space-y-1.5 p-3 rounded-xl bg-black/60 backdrop-blur-md text-white">
                    <p className="text-xs font-bold truncate">
                      {inspectResult.title || "Instagram Reel Video"}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-gray-300">
                      <span className="flex items-center gap-1">
                        <Music className="w-3 h-3 text-pink-400" />
                        <span className="truncate max-w-[140px]">Original Audio</span>
                      </span>
                      <span className="font-semibold text-emerald-400">1080p HD</span>
                    </div>
                  </div>
                </div>

                {/* RIGHT: Actions */}
                <div className="md:col-span-7 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-50 text-[#d62976] border border-pink-200">
                        Instagram Reel • 1080p HD
                      </span>
                      <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Ready to Download</span>
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-snug">
                      {inspectResult.title || "Instagram Reel — High Definition Video"}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span>Format: <strong className="text-gray-800">MP4 Video</strong></span>
                      <span>•</span>
                      <span>Quality: <strong className="text-emerald-700 font-semibold">1080p Full HD</strong></span>
                      <span>•</span>
                      <span>Audio: <strong className="text-gray-800">Stereo 320kbps</strong></span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <button
                      type="button"
                      onClick={() => triggerDownload("1080p Full HD", "12.8 MB", "video")}
                      className="w-full py-4 px-6 rounded-2xl font-bold text-base text-white shadow-lg insta-btn flex items-center justify-center gap-3 transition transform hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <Download className="w-5 h-5 text-white" />
                      <span>Download Reel (1080p)</span>
                    </button>

                    <button
                      onClick={() => handleCopyHdLink(inspectResult.url)}
                      className="w-full py-3.5 px-6 rounded-2xl font-semibold text-sm text-[#d62976] bg-[#fdf2f8] hover:bg-pink-100/80 border border-pink-200 flex items-center justify-center gap-2.5 transition"
                    >
                      {copiedHd ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>HD 1080p Link Copied!</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 text-[#d62976]" />
                          <span>⚡ Download HD Link (1080p)</span>
                        </>
                      )}
                    </button>

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
                      <span>↻ Download Again</span>
                    </button>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1.5 font-medium text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Original Quality, No Watermark, MP4</span>
                    </div>
                    <span className="text-gray-400">100% Free & Anonymous</span>
                  </div>
                </div>
              </div>

              {/* FORMAT OPTIONS TABLE */}
              <div className="border-t border-gray-200 p-6 bg-white space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-[#d62976]" />
                    <h4 className="font-bold text-sm text-gray-900">
                      Available Reel Formats:
                    </h4>
                  </div>
                  <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Direct High-Speed CDN Links
                  </span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#fdf2f8]/60 text-gray-700 font-bold border-b border-gray-200">
                      <tr>
                        <th className="p-3">Format / Stream</th>
                        <th className="p-3">Resolution & Specs</th>
                        <th className="p-3">File Size</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr className="hover:bg-gray-50/80 transition">
                        <td className="p-3 font-bold text-gray-900 flex items-center gap-2">
                          <Film className="w-4 h-4 text-[#d62976]" />
                          <span>1080p Full HD Reel</span>
                          <span className="text-[10px] bg-pink-100 text-[#d62976] font-extrabold px-1.5 py-0.5 rounded">
                            BEST
                          </span>
                        </td>
                        <td className="p-3 text-gray-600 font-medium">1080 &times; 1920 (MP4, 60fps)</td>
                        <td className="p-3 text-gray-500">~14.2 MB</td>
                        <td className="p-3 text-right">
                          <a
                            href={inspectResult.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white font-semibold insta-btn text-xs shadow-2xs hover:opacity-95"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download MP4</span>
                          </a>
                        </td>
                      </tr>

                      <tr className="hover:bg-gray-50/80 transition">
                        <td className="p-3 font-bold text-gray-900 flex items-center gap-2">
                          <Music className="w-4 h-4 text-purple-600" />
                          <span>320kbps MP3 Reel Audio</span>
                        </td>
                        <td className="p-3 text-gray-600 font-medium">Stereo 48.0 kHz (Audio MP3)</td>
                        <td className="p-3 text-gray-500">~2.6 MB</td>
                        <td className="p-3 text-right">
                          <a
                            href={inspectResult.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-semibold text-xs"
                          >
                            <Music className="w-3.5 h-3.5" />
                            <span>Extract MP3</span>
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200/80 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsAudioPlaying(!isAudioPlaying)}
                      className="w-9 h-9 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center transition shadow-xs"
                    >
                      {isAudioPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 translate-x-0.5" />}
                    </button>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Reel Audio Preview</p>
                      <p className="text-[11px] text-gray-500">320kbps MP3 Audio extracted directly from Reels source</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 h-5 px-3">
                    {[12, 20, 8, 24, 16, 28, 14, 22, 10, 18, 26, 12].map((h, i) => (
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

              <div className="space-y-1">
                <h3 className="font-extrabold text-lg text-gray-900">
                  Scan to Download Reel on Mobile
                </h3>
                <p className="text-xs text-gray-500">
                  Open your iPhone Camera or Android Scanner to download this Reel directly to your gallery.
                </p>
              </div>

              <div className="p-4 bg-pink-50/50 rounded-2xl border border-pink-100 inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                    inspectResult.url
                  )}`}
                  alt="QR Code for Mobile Download"
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

        {/* 3 STEPS GUIDE */}
        <section className="space-y-6 pt-4">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-pink-50 text-[#d62976] border border-pink-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Easy 3-Step Guide • Fast & Simple</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
              How to Download Instagram Reels
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              Follow these 3 simple steps to save Instagram Reels directly to your mobile gallery or PC in 1080p Full HD without watermarks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-gray-200 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-[#feda75] before:via-[#d62976] before:to-[#962fbf] insta-shadow-hover transition-all text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#fdf2f8] border border-pink-200 flex items-center justify-center text-[#d62976] shadow-sm">
                <Copy className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-pink-50 text-[#d62976] border border-pink-200">
                  Step 01
                </span>
                <h3 className="font-bold text-base sm:text-lg text-gray-900">Copy Reel Link</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed bg-gray-50/70 p-3.5 rounded-xl border border-gray-100">
                Open Instagram, find the Reel you want to save, tap the 3 dots (...) or Share icon, and tap &ldquo;Copy Link&rdquo;.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-200 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-[#feda75] before:via-[#d62976] before:to-[#962fbf] insta-shadow-hover transition-all text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#fdf2f8] border border-pink-200 flex items-center justify-center text-[#d62976] shadow-sm">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-pink-50 text-[#d62976] border border-pink-200">
                  Step 02
                </span>
                <h3 className="font-bold text-base sm:text-lg text-gray-900">Paste in MediaMate</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed bg-gray-50/70 p-3.5 rounded-xl border border-gray-100">
                Paste the copied Reel URL into the input field above and click the pink &ldquo;Download Reel&rdquo; button.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-200 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-[#feda75] before:via-[#d62976] before:to-[#962fbf] insta-shadow-hover transition-all text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#fdf2f8] border border-pink-200 flex items-center justify-center text-[#d62976] shadow-sm">
                <Download className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-pink-50 text-[#d62976] border border-pink-200">
                  Step 03
                </span>
                <h3 className="font-bold text-base sm:text-lg text-gray-900">Save 1080p HD</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed bg-gray-50/70 p-3.5 rounded-xl border border-gray-100">
                Preview your Reel and click &ldquo;Download Reel (1080p)&rdquo; to save the file directly to your gallery without watermarks!
              </p>
            </div>
          </div>
        </section>

        {/* FAQS */}
        <section className="max-w-3xl mx-auto space-y-6 pt-4">
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-pink-50 text-[#d62976] border border-pink-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Got Questions? • Quick Answers</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Instagram Reels Downloader FAQs
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Frequently asked questions about downloading vertical 9:16 Instagram Reels
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className={`rounded-2xl bg-white border transition-all ${
                    isOpen ? "border-pink-300 ring-2 ring-pink-50 shadow-sm" : "border-gray-200 hover:border-pink-200"
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm text-gray-800 hover:text-[#d62976] transition"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-pink-50 text-[#d62976] text-xs font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span>{faq.q}</span>
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${isOpen ? "rotate-180 text-[#d62976]" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-6 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-pink-50 pt-3.5 bg-[#fdf2f8]/20">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* USER CONTENT WRITING SECTION (RESERVED FOR USER CONTENT) */}
        <section className="border-t border-gray-200 pt-10 space-y-6">
          <div className="bg-[#fdf2f8]/40 border border-pink-200/80 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-[#d62976]">
              <BookOpen className="w-5 h-5" />
              <h3 className="font-bold text-base sm:text-lg text-gray-900">
                Editorial & Content Section
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Welcome to the dedicated Instagram Reels Downloader tool. Here you can paste your custom written articles, tutorials, creator tips, and keyword-rich editorial content whenever you are ready.
            </p>
          </div>
        </section>
      </main>

      {/* INSTANT PREVIEW & SUCCESS MODAL */}
      <DownloadSuccessModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        item={downloadSuccessItem}
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onDownloadAgain={() => triggerDownload()}
        theme="instagram"
      />

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
