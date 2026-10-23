"use client";

import React from "react";
import { Download, ExternalLink, Info, CheckCircle2, AlertTriangle, FileText, User } from "lucide-react";
import { MediaInspectResult } from "@/lib/platforms/types";

interface ResultDisplayProps {
  result: MediaInspectResult;
}

export function ResultDisplay({ result }: ResultDisplayProps) {
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

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl glow-card border border-navy-700/80 overflow-hidden shadow-2xl transition">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-navy-800 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-brand-blue/20 text-brand-sky border border-brand-blue/30">
            {result.platformName}
          </span>
          <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified Source</span>
          </span>
        </div>

        <a
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-400 hover:text-white flex items-center gap-1 p-1.5 rounded-lg hover:bg-navy-800 transition"
        >
          <span>Original Link</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Media Preview Viewport */}
      <div className="relative bg-black flex items-center justify-center min-h-[280px] max-h-[500px] overflow-hidden">
        {result.previewUrl && result.previewUrl.includes("youtube-nocookie.com") ? (
          <iframe
            src={result.previewUrl}
            title={result.title || "YouTube Preview"}
            className="w-full h-[360px] sm:h-[450px] border-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : result.mediaType === "video" && result.directMediaUrl ? (
          <video
            controls
            playsInline
            src={result.directMediaUrl}
            className="w-full max-h-[480px] object-contain"
          />
        ) : result.mediaType === "audio" && result.directMediaUrl ? (
          <div className="p-10 w-full flex flex-col items-center justify-center gap-4 bg-navy-900">
            <p className="text-sm font-medium text-gray-300">{result.title}</p>
            <audio controls src={result.directMediaUrl} className="w-full max-w-md" />
          </div>
        ) : result.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={result.thumbnailUrl}
            alt={result.title || "Media Preview"}
            className="w-full max-h-[480px] object-contain"
          />
        ) : (
          <div className="p-12 text-center text-gray-500">
            <p className="text-sm">No visual preview available for this media format.</p>
          </div>
        )}
      </div>

      {/* Metadata Details */}
      <div className="p-4 sm:p-5 space-y-3">
        <h3 className="text-lg font-bold text-white leading-snug">
          {result.title || "Untitled Media"}
        </h3>

        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300">
          {result.author && (
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-brand-sky" />
              <span>{result.author}</span>
            </div>
          )}

          {formattedSize && (
            <div className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-brand-emerald" />
              <span>{formattedSize}</span>
            </div>
          )}

          {result.mimeType && (
            <span className="px-2 py-0.5 rounded bg-navy-800 text-gray-400 border border-navy-700">
              {result.mimeType}
            </span>
          )}
        </div>

        {/* Limitations Notice Banner */}
        {result.limitationsNotice && (
          <div className="p-3.5 rounded-xl bg-navy-900/80 border border-navy-700/80 text-xs text-gray-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-brand-sky shrink-0 mt-0.5" />
            <p className="leading-relaxed">{result.limitationsNotice}</p>
          </div>
        )}
      </div>

      {/* Action Footer (Only shows genuinely supported actions) */}
      <div className="p-4 sm:p-5 bg-navy-900/90 border-t border-navy-800 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-gray-400">Available Actions:</span>

        <div className="flex flex-wrap items-center gap-2.5">
          {result.supportedActions.includes("download_file") && result.directMediaUrl && (
            <a
              href={`/api/media/download?url=${encodeURIComponent(result.directMediaUrl)}`}
              download
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white brand-button-gradient shadow-md flex items-center gap-2 transition"
            >
              <Download className="w-4 h-4" />
              <span>Download Media File</span>
            </a>
          )}

          {result.supportedActions.includes("download_thumbnail") && result.thumbnailUrl && (
            <button
              onClick={handleDownloadThumbnail}
              className="px-4 py-2 rounded-xl text-xs font-medium text-gray-200 bg-navy-800 hover:bg-navy-750 border border-navy-700 flex items-center gap-2 transition"
            >
              <Download className="w-4 h-4 text-brand-sky" />
              <span>Download Thumbnail</span>
            </button>
          )}

          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white bg-navy-850 hover:bg-navy-800 border border-navy-700/60 flex items-center gap-1.5 transition"
          >
            <span>Open Source</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
