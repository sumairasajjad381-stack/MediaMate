"use client";

import React, { useState } from "react";
import { Download, ExternalLink, Info, CheckCircle2, FileText, User, Copy, Check } from "lucide-react";
import { MediaInspectResult } from "@/lib/platforms/types";

interface ResultDisplayProps {
  result: MediaInspectResult;
}

export function ResultDisplay({ result }: ResultDisplayProps) {
  const [copied, setCopied] = useState(false);

  const formatBytes = (bytes?: number) => {
    if (!bytes || bytes === 0) return null;
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formattedSize = formatBytes(result.fileSizeBytes);

  const handleDownloadThumbnail = () => {
    if (!result.thumbnailUrl) return;
    const a = document.createElement("a");
    a.href = `/api/media/download?url=${encodeURIComponent(result.thumbnailUrl)}`;
    a.download = `${result.title || "thumbnail"}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(result.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl bg-white border border-gray-200 google-shadow overflow-hidden transition">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100">
            {result.platformName}
          </span>
          <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Verified Source</span>
          </span>
        </div>

        <a
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1 p-1.5 rounded-lg hover:bg-gray-100 transition"
        >
          <span>Open on {result.platformName}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Media Preview Viewport (Only when real visual stream exists) */}
      {result.previewUrl && result.previewUrl.includes("youtube-nocookie.com") ? (
        <div className="relative bg-gray-50 flex items-center justify-center min-h-[260px] max-h-[480px] overflow-hidden border-b border-gray-100">
          <iframe
            src={result.previewUrl}
            title={result.title || "YouTube Preview"}
            className="w-full h-[320px] sm:h-[420px] border-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : result.mediaType === "video" && result.directMediaUrl ? (
        <div className="relative bg-gray-50 flex items-center justify-center min-h-[260px] max-h-[480px] overflow-hidden border-b border-gray-100">
          <video
            controls
            playsInline
            src={result.directMediaUrl}
            className="w-full max-h-[460px] object-contain"
          />
        </div>
      ) : result.mediaType === "audio" && result.directMediaUrl ? (
        <div className="p-10 w-full flex flex-col items-center justify-center gap-4 bg-gray-50 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-700">{result.title}</p>
          <audio controls src={result.directMediaUrl} className="w-full max-w-md" />
        </div>
      ) : result.thumbnailUrl ? (
        <div className="relative bg-gray-50 flex items-center justify-center min-h-[260px] max-h-[480px] overflow-hidden border-b border-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={result.thumbnailUrl}
            alt={result.title || "Media Preview"}
            className="w-full max-h-[460px] object-contain"
          />
        </div>
      ) : null}

      {/* Main Details Section */}
      <div className="p-5 sm:p-6 space-y-4">
        {/* Title & Verified Checkmark */}
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold text-gray-900 leading-snug">
            {result.title || "Valid Media Link"}
          </h3>
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
        </div>

        {/* Structured Info: Platform & URL */}
        <div className="space-y-2 text-xs sm:text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900 w-20 shrink-0">Platform:</span>
            <span className="text-gray-800 font-medium">{result.platformName}</span>
          </div>

          <div className="flex items-center gap-2 min-w-0">
            <span className="font-semibold text-gray-900 w-20 shrink-0">URL:</span>
            <span className="text-blue-600 truncate font-mono text-xs">{result.url}</span>
            <button
              onClick={handleCopyUrl}
              title="Copy URL"
              className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {result.author && (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 w-20 shrink-0">Creator:</span>
              <span className="text-gray-800 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>{result.author}</span>
              </span>
            </div>
          )}

          {formattedSize && (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 w-20 shrink-0">File Size:</span>
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span>{formattedSize}</span>
              </span>
            </div>
          )}
        </div>

        {/* Message / Limitations Notice: Clean Light Gray Info Box with Blue Info Icon */}
        {result.limitationsNotice && (
          <div className="p-4 rounded-xl bg-[#f9fafb] border border-gray-200 text-xs sm:text-sm text-gray-700 flex items-start gap-3 shadow-xs">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-gray-900 block">Message:</span>
              <p className="leading-relaxed text-gray-600">{result.limitationsNotice}</p>
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-gray-500 font-medium">Available Actions:</span>

        <div className="flex flex-wrap items-center gap-2.5">
          {result.supportedActions.includes("download_file") && result.directMediaUrl && (
            <a
              href={`/api/media/download?url=${encodeURIComponent(result.directMediaUrl)}`}
              download
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white google-btn shadow flex items-center gap-2 transition"
            >
              <Download className="w-4 h-4" />
              <span>Download Media File</span>
            </a>
          )}

          {result.supportedActions.includes("download_thumbnail") && result.thumbnailUrl && (
            <button
              onClick={handleDownloadThumbnail}
              className="px-4 py-2 rounded-xl text-xs font-medium text-gray-700 bg-white hover:bg-gray-100 border border-gray-200 flex items-center gap-2 transition shadow-xs"
            >
              <Download className="w-4 h-4 text-blue-600" />
              <span>Download Thumbnail</span>
            </button>
          )}

          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl text-xs font-medium text-gray-700 bg-white hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5 transition shadow-xs"
          >
            <span>Open on {result.platformName}</span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
          </a>
        </div>
      </div>
    </div>
  );
}
