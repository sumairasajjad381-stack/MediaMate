"use client";

import React, { useState, useEffect } from "react";
import { fireConfetti } from "@/lib/confetti";
import {
  CheckCircle2,
  X,
  Play,
  Pause,
  Download,
  History,
  ExternalLink,
  FolderOpen,
  Eye,
  Music,
  Camera,
  Film,
  Layers,
  Sparkles,
} from "lucide-react";

export interface DownloadItemDetails {
  title: string;
  filename: string;
  size?: string;
  quality?: string;
  mediaType: "video" | "image" | "audio" | "story" | "carousel";
  thumbnailUrl?: string;
  downloadUrl: string;
  author?: string;
  platform?: "instagram" | "facebook" | "tiktok" | "youtube" | "general";
}

interface DownloadSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: DownloadItemDetails | null;
  historyCount: number;
  onOpenHistory: () => void;
  onDownloadAgain?: () => void;
  theme?: "instagram" | "facebook" | "default";
}

export function DownloadSuccessModal({
  isOpen,
  onClose,
  item,
  historyCount,
  onOpenHistory,
  onDownloadAgain,
  theme = "instagram",
}: DownloadSuccessModalProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fireConfetti({ particleCount: 120, origin: { x: 0.5, y: 0.55 } });
    }
  }, [isOpen]);

  if (!isOpen || !item) return null;

  const isFacebook = theme === "facebook" || item.platform === "facebook";
  const primaryBgClass = isFacebook
    ? "bg-[#1877F2] hover:bg-[#166fe5] text-white shadow-blue-500/30"
    : "insta-btn text-white shadow-pink-500/30";

  const borderColorClass = isFacebook ? "border-[#1877F2]/40" : "border-pink-500/40";
  const badgeColorClass = isFacebook
    ? "bg-blue-50 text-[#1877F2] border-blue-200"
    : "bg-pink-50 text-[#d62976] border-pink-200";

  const defaultThumbnail = isFacebook
    ? "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=720&auto=format&fit=crop&q=80"
    : "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=720&auto=format&fit=crop&q=80";

  const activeThumbnail = item.thumbnailUrl || defaultThumbnail;

  const handleOpenFile = () => {
    if (item.downloadUrl) {
      window.open(item.downloadUrl, "_blank");
    }
  };

  const handleDownloadAgain = () => {
    if (onDownloadAgain) {
      onDownloadAgain();
    } else if (item.downloadUrl) {
      window.open(item.downloadUrl, "_blank");
    }
  };

  const handleViewHistory = () => {
    onClose();
    onOpenHistory();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs transition-opacity duration-300 animate-fadeIn p-0 sm:p-4">
      {/* Background click to dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Card (Center on desktop, Bottom-sheet on mobile) */}
      <div
        className={`relative z-10 w-full sm:max-w-lg bg-white dark:bg-gray-900 rounded-t-[24px] sm:rounded-[20px] border-2 ${borderColorClass} shadow-2xl p-6 sm:p-8 space-y-5 transform transition-all duration-300 max-h-[92vh] overflow-y-auto ${
          isFacebook ? "focus:ring-blue-100 dark:focus:ring-blue-950" : "focus:ring-pink-100 dark:focus:ring-pink-950"
        }`}
        style={{
          animation: "modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* TOP: Green tick animation + Title */}
        <div className="text-center space-y-2 pt-1">
          <div className="relative inline-flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-md animate-bounce-short">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
            </div>
            <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping pointer-events-none" />
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Download Successful!
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Saved to your device gallery / download folder
          </p>
        </div>

        {/* MIDDLE: PREVIEW OF DOWNLOADED ITEM */}
        <div className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4 space-y-3">
          {/* Video or Reel Preview */}
          {(item.mediaType === "video" || item.mediaType === "story") && (
            <div className="space-y-2">
              <div
                className="relative rounded-xl overflow-hidden aspect-video sm:aspect-[16/9] bg-gray-900 flex items-center justify-center group cursor-pointer"
                onClick={() => setShowFullPreview(true)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeThumbnail}
                  alt={item.title || item.filename}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/95 text-gray-900 shadow-xl flex items-center justify-center transform transition group-hover:scale-110">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>

                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Film className="w-3 h-3 text-emerald-400" />
                  <span>{item.quality || "1080p FHD"}</span>
                </div>

                {item.author && (
                  <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold">
                    @{item.author}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Photo or Carousel Preview */}
          {(item.mediaType === "image" || item.mediaType === "carousel") && (
            <div className="space-y-2">
              <div
                className="relative rounded-xl overflow-hidden aspect-[4/3] bg-gray-900 flex items-center justify-center group cursor-pointer"
                onClick={() => setShowFullPreview(true)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeThumbnail}
                  alt={item.title || item.filename}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Camera className="w-3 h-3 text-pink-400" />
                  <span>{item.mediaType === "carousel" ? "Carousel Album" : "HD Original"}</span>
                </div>
              </div>
            </div>
          )}

          {/* Audio MP3 Preview */}
          {item.mediaType === "audio" && (
            <div className="p-4 rounded-xl bg-white border border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="w-10 h-10 rounded-full bg-pink-100 text-[#d62976] flex items-center justify-center shadow-sm hover:scale-105 transition"
                  >
                    {isPlayingAudio ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                  </button>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 truncate max-w-[200px]">
                      {item.title || "Instagram Audio Track"}
                    </h4>
                    <span className="text-[11px] text-gray-500 font-medium">
                      320kbps High-Bitrate Stereo MP3
                    </span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                  Ready
                </span>
              </div>

              {/* Simulated Live Audio Wave */}
              <div className="flex items-center gap-1 h-7 pt-1 px-1">
                {[40, 70, 95, 60, 80, 45, 90, 100, 75, 50, 85, 65, 95, 55, 70, 40].map(
                  (height, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-full transition-all duration-300 ${
                        isPlayingAudio
                          ? "bg-gradient-to-t from-[#d62976] to-[#962fbf] animate-pulse"
                          : "bg-gray-200"
                      }`}
                      style={{
                        height: isPlayingAudio ? `${height}%` : "30%",
                        animationDelay: `${i * 0.08}s`,
                      }}
                    />
                  )
                )}
              </div>
            </div>
          )}

          {/* Metadata Bar */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-1 text-xs text-gray-600">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-mono font-bold text-gray-900 truncate max-w-[220px]">
                {item.filename}
              </span>
            </div>

            <div className="flex items-center gap-1.5 font-semibold text-[11px]">
              <span className={`px-2 py-0.5 rounded-full border ${badgeColorClass}`}>
                {item.quality || "1080p FHD"}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-gray-200/80 text-gray-700">
                {item.size || "12.4 MB"}
              </span>
            </div>
          </div>
        </div>

        {/* BOTTOM: 3 ACTION BUTTONS */}
        <div className="space-y-2.5 pt-1">
          {/* Button 1: [Open File] */}
          <button
            type="button"
            onClick={handleOpenFile}
            className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2.5 transition transform hover:scale-[1.01] active:scale-[0.99] ${primaryBgClass}`}
          >
            <FolderOpen className="w-4 h-4 text-white" />
            <span>Open File / Gallery Preview</span>
          </button>

          {/* Button 2: [Download Again] */}
          <button
            type="button"
            onClick={handleDownloadAgain}
            className="w-full py-3 px-6 rounded-xl font-semibold text-xs sm:text-sm text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2 transition"
          >
            <Download className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            <span>Download Again</span>
          </button>

          {/* Button 3: [View in History (4)] */}
          <button
            type="button"
            onClick={handleViewHistory}
            className="w-full py-2.5 px-6 rounded-xl font-medium text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/60 flex items-center justify-center gap-2 transition"
          >
            <History className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>View in History ({historyCount})</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * INLINE SUCCESS BANNER
 * Visible right below the download button area
 */
interface DownloadSuccessBannerProps {
  item: DownloadItemDetails | null;
  onPreviewClick: () => void;
  onOpenFileClick: () => void;
  onDismiss: () => void;
}

export function DownloadSuccessBanner({
  item,
  onPreviewClick,
  onOpenFileClick,
  onDismiss,
}: DownloadSuccessBannerProps) {
  if (!item) return null;

  return (
    <div className="w-full max-w-2xl mx-auto p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-gray-800 dark:text-gray-100 text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs animate-fadeIn backdrop-blur-md">
      <div className="flex items-center gap-2.5 min-w-0 w-full sm:w-auto">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <div className="truncate">
          <span className="font-bold text-emerald-900 dark:text-emerald-300">✓ Downloaded: </span>
          <span className="font-mono text-gray-700 dark:text-gray-300">{item.filename}</span>
          <span className="text-gray-400 dark:text-gray-600 mx-1.5">|</span>
          <span className="text-gray-600 dark:text-gray-400">Size: {item.size || "8.2MB"}</span>
          <span className="text-gray-400 dark:text-gray-600 mx-1.5">|</span>
          <span className="text-gray-600 dark:text-gray-400">Quality: {item.quality || "1080p"}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
        <button
          type="button"
          onClick={onPreviewClick}
          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 transition shadow-2xs"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Preview</span>
        </button>

        <button
          type="button"
          onClick={onOpenFileClick}
          className="px-3 py-1.5 rounded-lg bg-white dark:bg-gray-900 hover:bg-emerald-100 dark:hover:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-semibold text-xs flex items-center gap-1 transition"
        >
          <FolderOpen className="w-3.5 h-3.5" />
          <span>Open File</span>
        </button>

        <button
          type="button"
          onClick={onDismiss}
          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
          title="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
