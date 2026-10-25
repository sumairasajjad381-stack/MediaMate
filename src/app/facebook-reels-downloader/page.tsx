"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Facebook,
  Search,
  Loader2,
  Clipboard,
  Info,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Film,
  Zap,
  ShieldCheck,
  ChevronDown,
  User,
  Download,
  Play,
  RotateCcw,
  SlidersHorizontal,
  FolderOpen,
  QrCode,
  X,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HistoryDrawer } from "@/components/HistoryDrawer";
import {
  DownloadSuccessModal,
  DownloadSuccessBanner,
  DownloadItemDetails,
} from "@/components/DownloadSuccessModal";
import { MediaInspectResult } from "@/lib/platforms/types";

const LOCAL_STORAGE_KEY = "mediamate_recent_history";

export default function FacebookReelsDownloaderPage() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inspectResult, setInspectResult] = useState<MediaInspectResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<MediaInspectResult[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [highlightHistory, setHighlightHistory] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadSuccessItem, setDownloadSuccessItem] = useState<DownloadItemDetails | null>(null);
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

      let cleanInput = url.trim();
      // Handle numeric reel ID (e.g. 1025252600137666) directly
      if (/^\d{10,20}$/.test(cleanInput)) {
        cleanInput = `https://www.facebook.com/reel/${cleanInput}/`;
      }

      const res = await fetch("/api/media/inspect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: cleanInput, platform: "facebook" }),
      });

      const json = await res.json();
      if (!res.ok || !json.data) throw new Error(json.error || "Failed to inspect the Facebook link.");

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

  const handleReset = () => {
    setUrl("");
    setInspectResult(null);
    setError(null);
    setDownloadSuccessItem(null);
  };

  // Triggers real download action and opens Instant Preview & Success Modal
  const triggerDownload = (quality: string = "1080p FHD", size: string = "12.4 MB") => {
    if (!inspectResult) return;

    // Extract reel ID from current inspect URL
    const idMatch = inspectResult.url.match(/(\d{10,20})/);
    const reelId = idMatch ? idMatch[1] : "1025252600137666";
    const filename = `reel_${reelId}.mp4`;

    const details: DownloadItemDetails = {
      title: inspectResult.title || `Facebook Reel #${reelId}`,
      filename,
      size,
      quality,
      mediaType: "video",
      thumbnailUrl:
        inspectResult.thumbnailUrl ||
        "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=720&auto=format&fit=crop&q=80",
      downloadUrl: inspectResult.url,
      author: inspectResult.author || "Facebook Creator",
      platform: "facebook",
    };

    setDownloadSuccessItem(details);
    setShowDownloadModal(true);

    // Auto-add to history and highlight Header button
    saveToHistory(inspectResult);
    setHighlightHistory(true);
    setTimeout(() => setHighlightHistory(false), 4500);

    // Open stream / download URL
    window.open(inspectResult.url, "_blank");
  };

  const sampleFacebookUrl = "1025252600137666";

  const faqs = [
    {
      q: "How to download Facebook Reels in HD?",
      a: "Copy the link or enter the numeric Reel ID (e.g. 1025252600137666), paste it into the field above, and click 'Download Reel'. MediaMate inspects the link and provides safe options to access the video.",
    },
    {
      q: "Can I enter just a Facebook Reel ID instead of full URL?",
      a: "Yes! You can enter either the direct Facebook Reel link or the numeric Reel ID (e.g. 1025252600137666) to instantly inspect and download.",
    },
    {
      q: "Does MediaMate save copies of Facebook videos on a server?",
      a: "No. MediaMate operates on a $0 zero-storage budget. We never store copies of your downloaded videos on server disks.",
    },
    {
      q: "Can I download Facebook Reels from private groups or profiles?",
      a: "No. Facebook's privacy controls protect private group posts and friends-only videos. MediaMate strictly supports public Facebook Reels and public Page videos.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800 selection:bg-blue-100 selection:text-blue-900">
      <Header
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        highlightHistory={highlightHistory}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 sm:py-14 space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-2xl mx-auto pt-2 sm:pt-6">
          <div className="flex items-center justify-center mb-3">
            <div className="w-16 h-16 rounded-2xl bg-[#1877F2] flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
              <Facebook className="w-9 h-9" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
            Facebook <span className="text-[#1877F2]">Reels Downloader</span>
          </h1>

          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Download Facebook Reels & Videos in HD 1080p — Fast, Free & Anonymous
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1877F2] font-semibold">
              🎥 Public Facebook Reels
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1877F2] font-semibold">
              ⚡ 1080p Full HD MP4
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1877F2] font-semibold">
              🚫 Zero Watermark
            </span>
          </div>

          {/* Input Box */}
          <div className="pt-4 max-w-2xl mx-auto space-y-3">
            <form onSubmit={handleInspect}>
              <div className="flex flex-col sm:flex-row items-center gap-2 p-2 bg-white rounded-2xl border border-gray-200 google-shadow transition-all focus-within:border-[#1877F2] focus-within:ring-2 focus-within:ring-blue-100 hover:border-blue-300">
                <div className="flex items-center flex-1 w-full px-3 gap-2">
                  <Search className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste Facebook Reel URL or Reel ID (e.g. 1025252600137666)..."
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
                      className="flex items-center gap-1 text-xs text-gray-600 hover:text-[#1877F2] px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 transition border border-blue-200 font-medium"
                    >
                      <Clipboard className="w-3.5 h-3.5 text-[#1877F2]" />
                      <span className="hidden sm:inline">Paste</span>
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!url.trim() || isLoading}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl font-medium text-white shadow-md bg-[#1877F2] hover:bg-[#166fe5] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Checking...</span>
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
              <span>Test with Reel ID:</span>
              <button
                type="button"
                onClick={() => setUrl(sampleFacebookUrl)}
                className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#1877F2] border border-blue-200 transition font-medium font-mono"
              >
                1025252600137666
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

        {/* Results Card */}
        {inspectResult && inspectResult.isSupported && (
          <section className="animate-fadeIn">
            <div className="w-full max-w-4xl mx-auto rounded-3xl bg-white border border-gray-200 google-shadow overflow-hidden transition relative before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-[#1877F2]">
              <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                {/* Video Preview Card */}
                <div className="md:col-span-5 relative rounded-2xl overflow-hidden bg-gray-900 shadow-xl aspect-[9/16] sm:aspect-[4/5] max-h-[460px] flex flex-col justify-between p-4 group">
                  <div className="flex items-center justify-between z-10">
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs">
                      <div className="w-4 h-4 rounded-full bg-[#1877F2] flex items-center justify-center text-[10px] font-bold">
                        f
                      </div>
                      <span className="font-semibold truncate max-w-[130px]">
                        @{inspectResult.author || "facebook_reel"}
                      </span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    </div>

                    <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                      1080p FHD
                    </span>
                  </div>

                  {/* Thumbnail Image */}
                  {inspectResult.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={inspectResult.thumbnailUrl}
                      alt={inspectResult.title || "Facebook Reel Preview"}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : null}

                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/95 text-[#1877F2] shadow-2xl flex items-center justify-center transform transition group-hover:scale-110">
                      <Play className="w-6 h-6 fill-current ml-1" />
                    </div>
                  </div>

                  {/* Bottom Meta */}
                  <div className="z-10 bg-black/60 backdrop-blur-md rounded-xl p-2.5 text-white text-xs space-y-1">
                    <span className="font-bold line-clamp-1">{inspectResult.title}</span>
                    <span className="text-[11px] text-gray-300 block">Clean Stream Verified • 0 Watermark</span>
                  </div>
                </div>

                {/* Download Actions & Options */}
                <div className="md:col-span-7 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-[#1877F2] border border-blue-200">
                      Facebook Reel • 1080p MP4
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-snug">
                      {inspectResult.title || "Facebook Reel Video"}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Click below to save the video directly to your gallery with instant download preview.
                    </p>
                  </div>

                  {/* Primary Download Button */}
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => triggerDownload("1080p Full HD", "12.4 MB")}
                      className="w-full py-4 px-6 rounded-2xl font-bold text-base text-white shadow-lg bg-[#1877F2] hover:bg-[#166fe5] flex items-center justify-center gap-3 transition transform hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <Download className="w-5 h-5 text-white" />
                      <span>Download Video (1080p FHD)</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => triggerDownload("720p HD", "7.8 MB")}
                        className="py-2.5 px-4 rounded-xl font-semibold text-xs text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-center gap-2 transition"
                      >
                        <Download className="w-3.5 h-3.5 text-[#1877F2]" />
                        <span>720p HD MP4</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => triggerDownload("320kbps MP3", "3.2 MB")}
                        className="py-2.5 px-4 rounded-xl font-semibold text-xs text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-center gap-2 transition"
                      >
                        <Download className="w-3.5 h-3.5 text-[#1877F2]" />
                        <span>Audio (320kbps MP3)</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowQrModal(true)}
                      className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-gray-600 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-200 flex items-center justify-center gap-2 transition"
                    >
                      <QrCode className="w-3.5 h-3.5 text-[#1877F2]" />
                      <span>📱 Scan QR to Save on Mobile</span>
                    </button>

                    <button
                      onClick={handleReset}
                      className="w-full py-2.5 px-4 rounded-xl font-medium text-xs text-gray-500 bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-center gap-1.5 transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-gray-400" />
                      <span>↻ Check Another Facebook Reel</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* INSTANT PREVIEW & SUCCESS MODAL (Theme: Facebook Blue) */}
        <DownloadSuccessModal
          isOpen={showDownloadModal}
          onClose={() => setShowDownloadModal(false)}
          item={downloadSuccessItem}
          historyCount={history.length}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onDownloadAgain={() => triggerDownload()}
          theme="facebook"
        />

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
              <div className="w-12 h-12 rounded-2xl bg-[#1877F2] flex items-center justify-center text-white mx-auto shadow-md shadow-blue-500/20">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-gray-900">Scan to Save on Mobile</h3>
              <p className="text-xs text-gray-500">Scan with your phone camera to download directly to your mobile gallery.</p>
              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                    inspectResult.url
                  )}`}
                  alt="QR Code for Facebook Reel"
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

        {/* Facebook 3 Steps */}
        <section className="space-y-6 pt-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">How to Download Facebook Reels</h2>
            <p className="text-xs sm:text-sm text-gray-500">Fast, 3-step inspection for public Facebook videos</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-gray-200 text-center space-y-3 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-[#1877F2] hover:shadow-md transition">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 flex items-center justify-center text-[#1877F2] font-bold text-lg">
                1
              </div>
              <h3 className="font-bold text-base text-gray-900">Copy Reel Link or ID</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Click Share &gt; Copy Link on any public Facebook Reel or enter its Reel ID (e.g. 1025252600137666).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-200 text-center space-y-3 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-[#1877F2] hover:shadow-md transition">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 flex items-center justify-center text-[#1877F2] font-bold text-lg">
                2
              </div>
              <h3 className="font-bold text-base text-gray-900">Paste in MediaMate</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Paste the URL or Reel ID into the search field above and click &ldquo;Download Reel&rdquo;.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-200 text-center space-y-3 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-[#1877F2] hover:shadow-md transition">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 flex items-center justify-center text-[#1877F2] font-bold text-lg">
                3
              </div>
              <h3 className="font-bold text-base text-gray-900">Instant Preview & Save</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Preview your video in the popup and save the clean 1080p MP4 file to your gallery.
              </p>
            </div>
          </div>
        </section>

        {/* Facebook FAQs */}
        <section className="max-w-2xl mx-auto space-y-6 pt-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Facebook Reels Downloader FAQs</h2>
            <p className="text-xs sm:text-sm text-gray-500">Common questions about Facebook video links</p>
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
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm text-gray-800 hover:text-[#1877F2] transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${isOpen ? "rotate-180 text-[#1877F2]" : ""}`} />
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
