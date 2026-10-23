"use client";

import React, { useState } from "react";
import { Download, Archive, Heart, MessageCircle, Eye, ExternalLink, FileArchive, CheckCircle2 } from "lucide-react";
import { ExtractedMetadata, ExtractedMediaFile } from "@/lib/extractor/types";

interface MediaPreviewCardProps {
  metadata: ExtractedMetadata;
  onArchive: () => Promise<void>;
  isArchiving: boolean;
  archiveSuccess: boolean;
}

export function MediaPreviewCard({
  metadata,
  onArchive,
  isArchiving,
  archiveSuccess,
}: MediaPreviewCardProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const currentFile: ExtractedMediaFile | undefined = metadata.files[activeSlide] || metadata.files[0];

  const handleDirectDownload = (file: ExtractedMediaFile, index: number) => {
    const ext = file.type === "VIDEO" ? "mp4" : "jpg";
    const filename = `${metadata.shortcode || "instagram"}_${index + 1}.${ext}`;
    
    // Create an invisible anchor tag to trigger download
    const link = document.createElement("a");
    link.href = file.url;
    link.target = "_blank";
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl glass-card border border-gray-800 overflow-hidden shadow-2xl">
      {/* Author and Post Header */}
      <div className="p-4 sm:p-5 border-b border-gray-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {metadata.authorAvatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={metadata.authorAvatarUrl}
              alt={metadata.authorUsername}
              className="w-11 h-11 rounded-full object-cover border-2 border-pink-500/40"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-pink-500 to-yellow-500 flex items-center justify-center font-bold text-white text-base">
              {metadata.authorUsername.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-100">@{metadata.authorUsername}</span>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded-md bg-pink-500/10 text-pink-400 border border-pink-500/20">
                {metadata.mediaType}
              </span>
            </div>
            {metadata.authorFullName && (
              <span className="text-xs text-gray-400 block">{metadata.authorFullName}</span>
            )}
          </div>
        </div>

        <a
          href={metadata.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-400 hover:text-white flex items-center gap-1 p-2 rounded-lg hover:bg-gray-800/60 transition"
        >
          <span>View on Instagram</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Media Viewport */}
      <div className="relative bg-black flex items-center justify-center min-h-[340px] max-h-[580px] overflow-hidden">
        {currentFile?.type === "VIDEO" ? (
          <video
            controls
            playsInline
            poster={currentFile.thumbnailUrl}
            src={currentFile.url}
            className="w-full max-h-[580px] object-contain"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={currentFile?.url}
            alt="Instagram media preview"
            className="w-full max-h-[580px] object-contain"
          />
        )}

        {/* Carousel Slide Indicators */}
        {metadata.files.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5 z-10">
            {metadata.files.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`h-2 rounded-full transition-all ${
                  activeSlide === i ? "w-6 bg-pink-500" : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Stats Bar */}
      {(metadata.likeCount !== undefined || metadata.commentCount !== undefined || metadata.viewCount !== undefined) && (
        <div className="px-5 py-3 border-b border-gray-800/80 flex items-center gap-6 text-xs text-gray-400">
          {metadata.likeCount !== undefined && (
            <div className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-pink-400" />
              <span>{metadata.likeCount.toLocaleString()} likes</span>
            </div>
          )}
          {metadata.commentCount !== undefined && (
            <div className="flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-blue-400" />
              <span>{metadata.commentCount.toLocaleString()} comments</span>
            </div>
          )}
          {metadata.viewCount !== undefined && (
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>{metadata.viewCount.toLocaleString()} views</span>
            </div>
          )}
        </div>
      )}

      {/* Caption snippet */}
      {metadata.caption && (
        <div className="p-5 border-b border-gray-800/80 text-sm text-gray-300 leading-relaxed max-h-32 overflow-y-auto">
          <p className="whitespace-pre-line">{metadata.caption}</p>
        </div>
      )}

      {/* Action Controls */}
      <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 bg-gray-900/40">
        <div className="flex items-center gap-2">
          {metadata.files.length > 1 && (
            <span className="text-xs text-gray-400">
              Slide {activeSlide + 1} of {metadata.files.length}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Download Current File */}
          <button
            onClick={() => handleDirectDownload(currentFile, activeSlide)}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-800 hover:bg-gray-700 text-white flex items-center gap-2 transition border border-gray-700"
          >
            <Download className="w-4 h-4 text-pink-400" />
            <span>Download {currentFile?.type === "VIDEO" ? "Video (MP4)" : "Photo (JPG)"}</span>
          </button>

          {/* Archive to Server & Database */}
          <button
            onClick={onArchive}
            disabled={isArchiving || archiveSuccess}
            className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition ${
              archiveSuccess
                ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/30"
                : "insta-gradient-bg text-white hover:opacity-90 shadow-md"
            }`}
          >
            {archiveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Saved to Server Archive</span>
              </>
            ) : (
              <>
                <Archive className="w-4 h-4" />
                <span>{isArchiving ? "Archiving..." : "Archive to Server"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
