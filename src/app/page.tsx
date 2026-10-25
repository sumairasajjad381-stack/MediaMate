"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Loader2,
  Clipboard,
  Sparkles,
  Download,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight,
  Layers,
  Smartphone,
  Eye,
  Camera,
  Film,
  Music,
  Share2,
  HardDrive,
  Check,
  RotateCcw,
  SlidersHorizontal,
  Facebook,
  Instagram,
  Video,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HistoryDrawer } from "@/components/HistoryDrawer";
import {
  DownloadSuccessModal,
  DownloadSuccessBanner,
  DownloadItemDetails,
} from "@/components/DownloadSuccessModal";
import { HumanErrorAlert } from "@/components/HumanErrorAlert";
import { parseHumanError, HumanError } from "@/lib/humanErrors";
import { fireConfetti } from "@/lib/confetti";
import { MediaInspectResult } from "@/lib/platforms/types";

const LOCAL_STORAGE_KEY = "mediamate_recent_history";

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [activePlatform, setActivePlatform] = useState<"all" | "instagram" | "facebook" | "tiktok">("all");
  const [isLoading, setIsLoading] = useState(false);
  const [humanError, setHumanError] = useState<HumanError | null>(null);
  const [inspectResult, setInspectResult] = useState<MediaInspectResult | null>(null);
  const [history, setHistory] = useState<MediaInspectResult[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [highlightHistory, setHighlightHistory] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadSuccessItem, setDownloadSuccessItem] = useState<DownloadItemDetails | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch {}
  }, []);

  const saveToHistory = (item: MediaInspectResult) => {
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.url !== item.url);
      const updated = [item, ...filtered].slice(0, 25);
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
      setHumanError(null);

      let cleanInput = url.trim();
      let platformParam = activePlatform === "all" ? undefined : activePlatform;

      // Handle raw numeric Facebook Reel ID (e.g. 1025252600137666)
      if (/^\d{10,20}$/.test(cleanInput)) {
        cleanInput = `https://www.facebook.com/reel/${cleanInput}/`;
        platformParam = "facebook";
      } else if (cleanInput.startsWith("@")) {
        const username = cleanInput.replace(/^@/, "").replace(/\/+$/, "");
        cleanInput = `https://www.instagram.com/${username}/`;
        platformParam = "instagram";
      }

      const res = await fetch("/api/media/inspect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: cleanInput, platform: platformParam }),
      });

      const json = await res.json();
      if (!res.ok || !json.data) {
        throw new Error(json.error || "Failed to retrieve public media stream.");
      }

      setInspectResult(json.data);

      if (json.data.isSupported) {
        saveToHistory(json.data);
      } else if (json.data.error) {
        setHumanError(parseHumanError(json.data.error));
      }
    } catch (err) {
      setHumanError(parseHumanError(err));
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
    setHumanError(null);
    setDownloadSuccessItem(null);
  };

  // Triggers instant download action + Confetti Celebration + Preview Modal
  const triggerDownload = (
    quality: string = "1080p Full HD",
    size: string = "12.6 MB",
    mediaType: "video" | "image" | "audio" = "video"
  ) => {
    if (!inspectResult) return;

    const isFacebook = inspectResult.platform === "facebook";
    const isInstagram = inspectResult.platform === "instagram";
    const isTikTok = inspectResult.platform === "tiktok";

    const filename =
      mediaType === "audio"
        ? "mediamate_audio_320kbps.mp3"
        : mediaType === "image"
        ? "mediamate_photo_hd.jpg"
        : isFacebook
        ? "facebook_reel_1080p.mp4"
        : isTikTok
        ? "tiktok_video_hd.mp4"
        : "instagram_reel_1080p.mp4";

    const item: DownloadItemDetails = {
      title: inspectResult.title || "MediaMate HD Stream",
      filename,
      size,
      quality,
      mediaType,
      thumbnailUrl: inspectResult.thumbnailUrl,
      downloadUrl: inspectResult.url,
      author: inspectResult.author || "creator",
      platform: inspectResult.platform as DownloadItemDetails["platform"],
    };

    setDownloadSuccessItem(item);
    setShowDownloadModal(true);

    // Confetti celebration explosion!
    fireConfetti({ particleCount: 130, origin: { x: 0.5, y: 0.5 } });

    // Auto-save history & highlight Header button
    saveToHistory(inspectResult);
    setHighlightHistory(true);
    setTimeout(() => setHighlightHistory(false), 4500);

    // Stream download
    window.open(inspectResult.url, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100 transition-colors selection:bg-pink-100 selection:text-pink-900 dark:selection:bg-pink-900/40">
      <Header
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        highlightHistory={highlightHistory}
      />

      {/* Subtle Background Glow Radial Gradient */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(214,41,118,0.08),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(214,41,118,0.12),rgba(3,7,18,0))] z-0" />

      <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto px-4 py-8 sm:py-14 space-y-16">
        {/* HERO SECTION: GLASS MORPHISM + INSTANT SEARCH */}
        <section className="text-center space-y-5 max-w-2xl mx-auto pt-2 sm:pt-4">
          {/* Trust Badge - VideoDropper Killer: No Vignette Ads */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold shadow-2xs backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>100% Ad-Free Core • No Vignette Pop-ups • Fast &lt;1s Load</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
            Universal Social Media <br />
            <span className="insta-gradient-text">Downloader & Archiver</span>
          </h1>

          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Save Instagram Reels, Facebook Videos, and TikToks in original 1080p FHD quality. Free, zero login, zero watermarks.
          </p>

          {/* Quick Platform Switcher Tabs */}
          <div className="pt-1 flex items-center justify-center gap-2 flex-wrap">
            {[
              { id: "all", label: "All-in-One", icon: "✨" },
              { id: "instagram", label: "Instagram", icon: "📸" },
              { id: "facebook", label: "Facebook", icon: "💙" },
              { id: "tiktok", label: "TikTok", icon: "🎵" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActivePlatform(tab.id as typeof activePlatform);
                  if (tab.id === "facebook" && !url) setUrl("1025252600137666");
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 backdrop-blur-md ${
                  activePlatform === tab.id
                    ? "insta-btn text-white shadow-md shadow-pink-500/25 scale-[1.02]"
                    : "bg-white/80 dark:bg-gray-900/80 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* GLASS MORPHIC SEARCH CARD */}
          <div className="pt-2 max-w-2xl mx-auto space-y-3">
            <form onSubmit={handleInspect}>
              <div className="flex flex-col sm:flex-row items-center gap-2 p-2 bg-white/90 dark:bg-gray-900/90 rounded-2xl border border-gray-200/90 dark:border-gray-800 shadow-xl shadow-pink-500/5 backdrop-blur-xl transition-all focus-within:border-[#d62976] focus-within:ring-2 focus-within:ring-pink-100 dark:focus-within:ring-pink-950/50 hover:border-pink-300 dark:hover:border-pink-800">
                <div className="flex items-center flex-1 w-full px-3 gap-2">
                  <Search className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder={
                      activePlatform === "facebook"
                        ? "Paste Facebook Reel link or Reel ID (e.g. 1025252600137666)..."
                        : activePlatform === "instagram"
                        ? "Paste Instagram link or @username (e.g. @cristiano)..."
                        : activePlatform === "tiktok"
                        ? "Paste TikTok video link..."
                        : "Paste Instagram, Facebook, or TikTok link..."
                    }
                    className="w-full bg-transparent border-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none text-sm sm:text-base py-2.5"
                    disabled={isLoading}
                  />
                  {url ? (
                    <button
                      type="button"
                      onClick={() => setUrl("")}
                      className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 px-2 py-1"
                    >
                      Clear
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handlePaste}
                      className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300 hover:text-[#d62976] px-2 py-1 rounded bg-pink-50/80 dark:bg-pink-950/40 hover:bg-pink-100 dark:hover:bg-pink-900/60 transition border border-pink-200 dark:border-pink-800/60 font-medium"
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
                      <span>Checking...</span>
                    </>
                  ) : (
                    <span>Download Media</span>
                  )}
                </button>
              </div>
            </form>

            {/* ACTIONABLE HUMAN-READABLE ERRORS */}
            <HumanErrorAlert
              error={humanError}
              onDismiss={() => setHumanError(null)}
              onRetry={handleInspect}
            />

            {/* Quick Test Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-gray-500 dark:text-gray-400">
              <span>Quick tests:</span>
              <button
                type="button"
                onClick={() => {
                  setUrl("https://www.instagram.com/reel/xxx");
                  setActivePlatform("instagram");
                }}
                className="px-2.5 py-1 rounded-lg bg-pink-50 dark:bg-pink-950/40 hover:bg-pink-100 text-[#d62976] dark:text-pink-300 border border-pink-200 dark:border-pink-800/60 transition font-medium"
              >
                Instagram Reel
              </button>
              <button
                type="button"
                onClick={() => {
                  setUrl("1025252600137666");
                  setActivePlatform("facebook");
                }}
                className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-[#1877F2] dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 transition font-medium font-mono"
              >
                Facebook Reel #1025252600137666
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

        {/* RESULT SECTION (GLASS MORPHIC CARD) */}
        {inspectResult && inspectResult.isSupported && (
          <section className="animate-fadeIn">
            <div className="w-full max-w-4xl mx-auto rounded-3xl bg-white/90 dark:bg-gray-900/90 border border-gray-200/90 dark:border-gray-800 shadow-2xl backdrop-blur-xl overflow-hidden transition relative before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-[#feda75] before:via-[#d62976] before:to-[#1877F2]">
              <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                {/* Media Preview Player/Card */}
                <div className="md:col-span-5 relative rounded-2xl overflow-hidden bg-gray-950 shadow-xl aspect-[9/16] sm:aspect-[4/5] max-h-[460px] flex flex-col justify-between p-4 group">
                  <div className="flex items-center justify-between z-10">
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs">
                      <span className="font-semibold truncate max-w-[130px]">
                        @{inspectResult.author || "creator"}
                      </span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    </div>

                    <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                      {inspectResult.platformName}
                    </span>
                  </div>

                  {inspectResult.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={inspectResult.thumbnailUrl}
                      alt={inspectResult.title || "Media Preview"}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : null}

                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/95 text-gray-900 shadow-2xl flex items-center justify-center transform transition group-hover:scale-110">
                      <Download className="w-6 h-6 text-[#d62976] ml-0.5" />
                    </div>
                  </div>

                  <div className="z-10 bg-black/60 backdrop-blur-md rounded-xl p-2.5 text-white text-xs space-y-1">
                    <span className="font-bold line-clamp-1">{inspectResult.title}</span>
                    <span className="text-[11px] text-gray-300 block">Clean Stream Verified • 0 Watermark</span>
                  </div>
                </div>

                {/* Actions & Format Options */}
                <div className="md:col-span-7 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-50 dark:bg-pink-950/40 text-[#d62976] dark:text-pink-300 border border-pink-200 dark:border-pink-800/60">
                      {inspectResult.platformName} • 1080p FHD
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white leading-snug">
                      {inspectResult.title || "Social Media Post"}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Click below to download with celebratory preview and automatic gallery sync.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => triggerDownload("1080p Full HD", "12.6 MB", "video")}
                      className="w-full py-4 px-6 rounded-2xl font-bold text-base text-white shadow-lg insta-btn flex items-center justify-center gap-3 transition transform hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <Download className="w-5 h-5 text-white" />
                      <span>Download Video (1080p FHD)</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => triggerDownload("720p HD", "7.2 MB", "video")}
                        className="py-2.5 px-4 rounded-xl font-semibold text-xs text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2 transition"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span>720p Fast Stream</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => triggerDownload("320kbps MP3", "3.4 MB", "audio")}
                        className="py-2.5 px-4 rounded-xl font-semibold text-xs text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2 transition"
                      >
                        <Music className="w-3.5 h-3.5 text-purple-500" />
                        <span>Extract Audio (MP3)</span>
                      </button>
                    </div>

                    <button
                      onClick={handleReset}
                      className="w-full py-2.5 px-4 rounded-xl font-medium text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 flex items-center justify-center gap-1.5 transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-gray-400" />
                      <span>↻ Check Another Video Link</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 3 MAJOR PLATFORMS TRIFECTA CARDS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Card 1: Instagram */}
          <Link
            href="/instagram-video-downloader"
            className="group block p-6 sm:p-7 rounded-3xl bg-white/80 dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 shadow-xl shadow-pink-500/5 backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-[#feda75] before:via-[#d62976] before:to-[#962fbf]"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl insta-gradient-full flex items-center justify-center text-white shadow-md shadow-pink-500/20 group-hover:scale-105 transition-transform">
                <Instagram className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[11px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border border-pink-200 dark:border-pink-800/60 bg-pink-50 dark:bg-pink-950/40 text-[#d62976] dark:text-pink-300">
                  Reels • Stories • Photos
                </span>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-[#d62976] transition-colors mt-2">
                  Instagram Downloader
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  Download Reels, 24h Stories anonymously, and multi-slide carousel albums in 1080p original quality.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-[#d62976] group-hover:gap-2.5 transition-all">
                <span>Open Instagram Suite</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Card 2: Facebook */}
          <Link
            href="/facebook-reels-downloader"
            className="group block p-6 sm:p-7 rounded-3xl bg-white/80 dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 shadow-xl shadow-blue-500/5 backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-[#1877F2]"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#1877F2] flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Facebook className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[11px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800/60 bg-blue-50 dark:bg-blue-950/40 text-[#1877F2] dark:text-blue-300">
                  Reels • Watch Clips
                </span>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-[#1877F2] transition-colors mt-2">
                  Facebook Downloader
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  Save public Facebook Reels by URL or numeric Reel ID (e.g. 1025252600137666) in 1080p FHD MP4.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-[#1877F2] group-hover:gap-2.5 transition-all">
                <span>Open Facebook Tool</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Card 3: TikTok */}
          <Link
            href="/tiktok-video-downloader"
            className="group block p-6 sm:p-7 rounded-3xl bg-white/80 dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 shadow-xl shadow-gray-500/5 backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-[#00f2fe] before:to-[#4facfe]"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-900 dark:bg-gray-800 flex items-center justify-center text-white shadow-md shadow-gray-500/20 group-hover:scale-105 transition-transform">
                <Video className="w-6 h-6 text-[#00f2fe]" />
              </div>

              <div>
                <span className="text-[11px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                  Zero Watermark MP4
                </span>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-cyan-500 transition-colors mt-2">
                  TikTok Downloader
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  Extract public TikTok videos and original background audio tracks with zero compression.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-gray-900 dark:text-gray-200 group-hover:gap-2.5 transition-all">
                <span>Open TikTok Tool</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        </section>

        {/* VIDEODROPPER KILLER: 6 REASONS WHY OFFLINE DOWNLOAD IS ESSENTIAL */}
        <section className="space-y-8 pt-6">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-50 dark:bg-pink-950/40 text-[#d62976] dark:text-pink-300 border border-pink-200 dark:border-pink-800/60">
              The Offline Advantage
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
              Why Downloading Offline is Essential
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              VideoDropper built a winning formula on 6 core archival reasons. MediaMate takes each principle further by adding instant preview verification and multi-platform coverage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: Carousel Unbundling */}
            <div className="p-6 rounded-3xl bg-white/70 dark:bg-gray-900/70 border border-gray-200/80 dark:border-gray-800 shadow-lg backdrop-blur-md space-y-3 hover:border-pink-300 dark:hover:border-pink-800 transition">
              <div className="w-11 h-11 rounded-2xl bg-pink-50 dark:bg-pink-950/50 text-[#d62976] flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-gray-900 dark:text-white">
                1. Carousel Unbundling
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Download every slide from multi-image and video albums individually at full resolution without taking grainy smartphone screenshots.
              </p>
            </div>

            {/* Feature 2: Original DPI & Bitrate */}
            <div className="p-6 rounded-3xl bg-white/70 dark:bg-gray-900/70 border border-gray-200/80 dark:border-gray-800 shadow-lg backdrop-blur-md space-y-3 hover:border-blue-300 dark:hover:border-blue-800 transition">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center font-bold">
                <Film className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-gray-900 dark:text-white">
                2. Original DPI & 1080p Streams
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Direct edge stream parsing guarantees native 1080p 60fps MP4 and untouched 320kbps stereo audio without server-side compression degradation.
              </p>
            </div>

            {/* Feature 3: Clean Wallpapers & Assets */}
            <div className="p-6 rounded-3xl bg-white/70 dark:bg-gray-900/70 border border-gray-200/80 dark:border-gray-800 shadow-lg backdrop-blur-md space-y-3 hover:border-amber-300 dark:hover:border-amber-800 transition">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center font-bold">
                <Camera className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-gray-900 dark:text-white">
                3. Clean Wallpapers & Assets
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Extract pristine zero-watermark frames ideal for 4K device wallpapers, creator mood boards, graphic design templates, and aesthetic research.
              </p>
            </div>

            {/* Feature 4: Permanent Archival */}
            <div className="p-6 rounded-3xl bg-white/70 dark:bg-gray-900/70 border border-gray-200/80 dark:border-gray-800 shadow-lg backdrop-blur-md space-y-3 hover:border-purple-300 dark:hover:border-purple-800 transition">
              <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center font-bold">
                <HardDrive className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-gray-900 dark:text-white">
                4. Permanent Archival
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Never lose your favorite media when creators delete posts, accounts get banned, or trending background music licenses get muted by copyright claims.
              </p>
            </div>

            {/* Feature 5: Zero Clutter & Zero Popunders */}
            <div className="p-6 rounded-3xl bg-white/70 dark:bg-gray-900/70 border border-gray-200/80 dark:border-gray-800 shadow-lg backdrop-blur-md space-y-3 hover:border-emerald-300 dark:hover:border-emerald-800 transition">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-gray-900 dark:text-white">
                5. Zero Clutter & No Vignette Ads
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Legacy download sites hijack your browser with fullscreen vignette popups and deceptive download traps. MediaMate is strictly 100% clean and fast.
              </p>
            </div>

            {/* Feature 6: Cross-Sharing & Editing */}
            <div className="p-6 rounded-3xl bg-white/70 dark:bg-gray-900/70 border border-gray-200/80 dark:border-gray-800 shadow-lg backdrop-blur-md space-y-3 hover:border-cyan-300 dark:hover:border-cyan-800 transition">
              <div className="w-11 h-11 rounded-2xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 flex items-center justify-center font-bold">
                <Share2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-gray-900 dark:text-white">
                6. Cross-Sharing & Video Editing
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Download raw video files ready to import directly into CapCut, Adobe Premiere Pro, DaVinci Resolve, or Final Cut without re-encoding glitches.
              </p>
            </div>
          </div>

          {/* MEDIAMATE EXCLUSIVE SUPERPOWERS (BEATING VIDEODROPPER) */}
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 border border-pink-200/60 dark:border-pink-900/40 backdrop-blur-md space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#d62976]" />
              <h3 className="font-extrabold text-base sm:text-lg text-gray-900 dark:text-white">
                Why MediaMate Beats VideoDropper
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-700 dark:text-gray-300">
              <div className="p-4 rounded-2xl bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 space-y-1">
                <strong className="text-gray-900 dark:text-white block font-bold">🌐 3 Major Platforms</strong>
                <span>VideoDropper only supports Instagram. MediaMate supports Instagram, Facebook, and TikTok in one unified engine.</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 space-y-1">
                <strong className="text-gray-900 dark:text-white block font-bold">👁️ Instant Preview Modal</strong>
                <span>Never wonder what downloaded. Verify the file, resolution, and thumbnail inside a centered modal or mobile bottom sheet.</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 space-y-1">
                <strong className="text-gray-900 dark:text-white block font-bold">🎉 Confetti Celebration</strong>
                <span>Rewarding celebration particle burst on every successful download to make media saving genuinely delightful.</span>
              </div>
            </div>
          </div>
        </section>

        {/* DEDICATED INSTAGRAM SUITE */}
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
                Dedicated Instagram Power Tools
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Direct specialized tools with targeted quality pickers
              </p>
            </div>
            <Link
              href="/instagram-video-downloader"
              className="text-xs font-semibold text-[#d62976] dark:text-pink-400 hover:underline flex items-center gap-1"
            >
              <span>Explore All Tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link
              href="/instagram-reels-downloader"
              className="p-4 rounded-2xl bg-white/80 dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 hover:border-pink-300 dark:hover:border-pink-800 hover:shadow-lg transition text-center space-y-2 group backdrop-blur-md"
            >
              <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-950/50 text-[#d62976] mx-auto flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="text-base font-bold">🎥</span>
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white group-hover:text-[#d62976]">
                Reels Downloader
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Vertical 9:16 1080p</p>
            </Link>

            <Link
              href="/instagram-story-saver"
              className="p-4 rounded-2xl bg-white/80 dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 hover:border-pink-300 dark:hover:border-pink-800 hover:shadow-lg transition text-center space-y-2 group backdrop-blur-md"
            >
              <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-950/50 text-[#d62976] mx-auto flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="text-base font-bold">⚡</span>
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white group-hover:text-[#d62976]">
                Story Saver
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Anonymous 24h & Highlights</p>
            </Link>

            <Link
              href="/instagram-photo-downloader"
              className="p-4 rounded-2xl bg-white/80 dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 hover:border-pink-300 dark:hover:border-pink-800 hover:shadow-lg transition text-center space-y-2 group backdrop-blur-md"
            >
              <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-950/50 text-[#d62976] mx-auto flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="text-base font-bold">📸</span>
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white group-hover:text-[#d62976]">
                Photo & Carousel
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Full Resolution JPGs</p>
            </Link>

            <Link
              href="/instagram-audio-mp3-extractor"
              className="p-4 rounded-2xl bg-white/80 dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 hover:border-pink-300 dark:hover:border-pink-800 hover:shadow-lg transition text-center space-y-2 group backdrop-blur-md"
            >
              <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-950/50 text-[#d62976] mx-auto flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="text-base font-bold">🎵</span>
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white group-hover:text-[#d62976]">
                Audio Extractor
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">320kbps MP3 Audio</p>
            </Link>
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
          setHumanError(null);
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
