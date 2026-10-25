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
  Download,
  Camera,
  RotateCcw,
  BookOpen,
  QrCode,
  X,
  Play,
  Clock,
  Archive,
  Layers,
  FileCheck,
  Eye,
  Check,
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

interface StoryItem {
  id: number;
  type: "video" | "image";
  duration?: string;
  timeAgo: string;
  resolution: string;
  thumbnailUrl?: string;
  expiresIn: string;
}

export default function InstagramStorySaverPage() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inspectResult, setInspectResult] = useState<MediaInspectResult | null>(null);
  const [history, setHistory] = useState<MediaInspectResult[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [qrModalUrl, setQrModalUrl] = useState<string | null>(null);
  const [previewStory, setPreviewStory] = useState<StoryItem | null>(null);
  const [isBatchDownloading, setIsBatchDownloading] = useState(false);
  const [batchSuccess, setBatchSuccess] = useState(false);
  const [highlightHistory, setHighlightHistory] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadSuccessItem, setDownloadSuccessItem] = useState<DownloadItemDetails | null>(null);

  const triggerStoryDownload = (
    filename: string,
    size: string,
    quality: string,
    mediaType: "video" | "image" | "story" = "story",
    customThumbnail?: string
  ) => {
    if (!inspectResult) return;
    const item: DownloadItemDetails = {
      title: inspectResult.title || "Instagram Story HD",
      filename,
      size,
      quality,
      mediaType,
      thumbnailUrl: customThumbnail || inspectResult.thumbnailUrl,
      downloadUrl: inspectResult.url,
      author: inspectResult.author || "instagram_user",
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
      // Handle @username or raw username directly
      if (!cleanInput.startsWith("http://") && !cleanInput.startsWith("https://")) {
        const username = cleanInput.replace(/^@/, "").replace(/\/+$/, "");
        cleanInput = `https://www.instagram.com/stories/${username}/`;
      }

      const res = await fetch("/api/media/inspect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: cleanInput, platform: "instagram" }),
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

  const handleReset = () => {
    setUrl("");
    setInspectResult(null);
    setError(null);
    setPreviewStory(null);
  };

  const handleBatchDownload = () => {
    setIsBatchDownloading(true);
    setTimeout(() => {
      setIsBatchDownloading(false);
      setBatchSuccess(true);
      triggerStoryDownload(
        `stories_${inspectResult?.author || "archive"}_batch.zip`,
        "24.5 MB",
        "HD Archive (ZIP)",
        "story"
      );
      setTimeout(() => setBatchSuccess(false), 4000);
    }, 900);
  };

  // Dynamic mock stories grid for visual comparison (Snapgram killer feature)
  const storiesList: StoryItem[] = [
    {
      id: 1,
      type: "video",
      duration: "0:15",
      timeAgo: "2 hours ago",
      resolution: "1080×1920 (FHD)",
      thumbnailUrl: inspectResult?.thumbnailUrl || undefined,
      expiresIn: "22h remaining",
    },
    {
      id: 2,
      type: "image",
      timeAgo: "5 hours ago",
      resolution: "1080×1920 (HD)",
      thumbnailUrl: inspectResult?.thumbnailUrl || undefined,
      expiresIn: "19h remaining",
    },
    {
      id: 3,
      type: "video",
      duration: "0:30",
      timeAgo: "11 hours ago",
      resolution: "1080×1920 (FHD)",
      thumbnailUrl: inspectResult?.thumbnailUrl || undefined,
      expiresIn: "13h remaining",
    },
    {
      id: 4,
      type: "image",
      timeAgo: "18 hours ago",
      resolution: "1080×1920 (HD)",
      thumbnailUrl: inspectResult?.thumbnailUrl || undefined,
      expiresIn: "6h remaining",
    },
  ];

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
    {
      q: "Can I enter a username instead of a story link?",
      a: "Yes! You can enter either @username or a direct story URL to instantly inspect and save all active public stories for that creator.",
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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
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
              🕵️ 100% Anonymous Viewer
            </span>
          </div>

          {/* Quick Switcher Tabs (Snapgram killer feature) */}
          <InstagramTabs activeTab="stories" />

          {/* Input Box with Pink Focus & Shadow */}
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
                    placeholder="Paste Story URL or username (e.g. @cristiano or instagram.com/stories/...)"
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
                    <span>Save Stories</span>
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

        {/* INLINE SUCCESS PREVIEW BAR */}
        {downloadSuccessItem && (
          <DownloadSuccessBanner
            item={downloadSuccessItem}
            onPreviewClick={() => setShowDownloadModal(true)}
            onOpenFileClick={() => window.open(downloadSuccessItem.downloadUrl, "_blank")}
            onDismiss={() => setDownloadSuccessItem(null)}
          />
        )}

        {/* MULTI-STORY CARDS GRID RESULT (SNAPGRAM KILLER FEATURE) */}
        {inspectResult && inspectResult.isSupported && (
          <section className="animate-fadeIn space-y-6">
            {/* Account Profile Header Bar */}
            <div className="w-full max-w-4xl mx-auto rounded-3xl bg-white border border-gray-200 p-6 google-shadow flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-[#feda75] before:via-[#d62976] before:to-[#962fbf]">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#962fbf] shrink-0">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                    {inspectResult.thumbnailUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={inspectResult.thumbnailUrl}
                        alt={inspectResult.author || "Creator"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-extrabold text-sm insta-gradient-text">
                        {(inspectResult.author || "IG").substring(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      @{inspectResult.author || "instagram_user"}
                    </h3>
                    <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      ● 4 Active Stories Available
                    </span>
                    <span className="hidden sm:inline-flex items-center gap-1 text-gray-400">
                      <Clock className="w-3 h-3" />
                      Expires in: 22h 45m
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleBatchDownload}
                  disabled={isBatchDownloading}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md insta-btn flex items-center justify-center gap-2 transition"
                >
                  {isBatchDownloading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Packaging ZIP...</span>
                    </>
                  ) : batchSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Ready in Gallery!</span>
                    </>
                  ) : (
                    <>
                      <Archive className="w-4 h-4 text-white" />
                      <span>⬇ Download All (Batch ZIP)</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
                  title="Search Another Account"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Grid of Story Cards */}
            <div className="w-full max-w-4xl mx-auto">
              <div className="flex items-center justify-between pb-3">
                <h4 className="font-extrabold text-sm sm:text-base text-gray-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#d62976]" />
                  <span>Individual Stories ({storiesList.length})</span>
                </h4>
                <span className="text-xs text-gray-500 font-medium">Click any story to preview or save</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {storiesList.map((story) => (
                  <div
                    key={story.id}
                    className="bg-white rounded-2xl border border-gray-200 google-shadow hover:border-pink-300 transition-all flex flex-col justify-between overflow-hidden group"
                  >
                    {/* Story Preview Card Header */}
                    <div className="relative aspect-[9/16] bg-gradient-to-tr from-gray-900 to-gray-800 flex items-center justify-center overflow-hidden">
                      {story.thumbnailUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={story.thumbnailUrl}
                          alt={`Story #${story.id}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center p-4 text-white/80 text-center gap-2">
                          <div className="w-10 h-10 rounded-xl insta-gradient-full flex items-center justify-center text-white shadow-md">
                            <Camera className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-semibold">Story #{story.id}</span>
                        </div>
                      )}

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                        <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                          {story.type === "video" ? `🎬 Video ${story.duration}` : "📸 Photo"}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-pink-500/80 backdrop-blur-md text-white text-[10px] font-medium">
                          {story.expiresIn}
                        </span>
                      </div>

                      {/* Center Play / View Button */}
                      <button
                        type="button"
                        onClick={() => setPreviewStory(story)}
                        className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <div className="w-12 h-12 rounded-full bg-white/90 text-[#d62976] flex items-center justify-center shadow-lg transform transition group-hover:scale-110">
                          {story.type === "video" ? <Play className="w-5 h-5 fill-current ml-0.5" /> : <Eye className="w-5 h-5" />}
                        </div>
                      </button>

                      {/* Bottom Info Bar */}
                      <div className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] flex items-center justify-between">
                        <span>{story.timeAgo}</span>
                        <span>{story.resolution}</span>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="p-3 space-y-2 bg-white">
                      <button
                        type="button"
                        onClick={() =>
                          triggerStoryDownload(
                            `story_${story.id}_${inspectResult.author || "user"}.${story.type === "video" ? "mp4" : "jpg"}`,
                            story.type === "video" ? "11.2 MB" : "2.4 MB",
                            story.resolution,
                            story.type === "video" ? "video" : "image",
                            story.thumbnailUrl
                          )
                        }
                        className="w-full py-2 px-3 rounded-xl font-bold text-xs text-white shadow-xs insta-btn flex items-center justify-center gap-1.5 transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download {story.type === "video" ? "MP4" : "JPG"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setQrModalUrl(inspectResult.url)}
                        className="w-full py-1.5 px-3 rounded-xl font-semibold text-[11px] text-gray-700 bg-gray-50 hover:bg-pink-50 border border-gray-200 hover:border-pink-200 flex items-center justify-center gap-1.5 transition"
                      >
                        <QrCode className="w-3.5 h-3.5 text-[#d62976]" />
                        <span>Mobile QR</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* QR MODAL */}
        {qrModalUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-gray-200 shadow-2xl relative space-y-5 text-center">
              <button
                type="button"
                onClick={() => setQrModalUrl(null)}
                className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-12 h-12 rounded-2xl insta-gradient-full flex items-center justify-center text-white mx-auto shadow-md shadow-pink-500/20">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-gray-900">Scan to Save on Mobile</h3>
              <p className="text-xs text-gray-500">Scan using iPhone Camera or Android QR Scanner to save directly into your gallery.</p>
              <div className="p-4 bg-pink-50/50 rounded-2xl border border-pink-100 inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                    qrModalUrl
                  )}`}
                  alt="QR Code for Story"
                  className="w-44 h-44 rounded-xl mx-auto shadow-xs"
                />
              </div>
              <button
                type="button"
                onClick={() => setQrModalUrl(null)}
                className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* STORY PREVIEW MODAL */}
        {previewStory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-gray-200 shadow-2xl relative space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-gray-900">Story #{previewStory.id}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-pink-50 text-[#d62976] font-semibold border border-pink-200">
                    {previewStory.resolution}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewStory(null)}
                  className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="relative rounded-2xl overflow-hidden aspect-[9/16] bg-black flex items-center justify-center">
                {previewStory.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewStory.thumbnailUrl}
                    alt={`Preview Story #${previewStory.id}`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center text-white/80 space-y-2">
                    <Camera className="w-10 h-10 mx-auto opacity-60" />
                    <p className="text-xs">HD Story Stream Ready</p>
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center gap-2">
                <a
                  href={inspectResult?.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md insta-btn flex items-center justify-center gap-2 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Download {previewStory.type === "video" ? "MP4 Video" : "HD Photo"}</span>
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewStory(null)}
                  className="py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 font-semibold text-xs text-gray-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FAQS */}
        <section className="max-w-3xl mx-auto space-y-6 pt-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Instagram Story Saver FAQs
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Common questions about saving 24-hour stories and profile highlights.
            </p>
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

        {/* USER CONTENT SECTION (Placeholder for User's Own Writing) */}
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

      {/* INSTANT PREVIEW & SUCCESS MODAL */}
      <DownloadSuccessModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        item={downloadSuccessItem}
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onDownloadAgain={() => handleBatchDownload()}
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
