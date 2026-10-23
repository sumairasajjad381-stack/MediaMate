"use client";

import React, { useState } from "react";
import { Download, RefreshCw, FileArchive, CheckSquare, Square, Trash2, Video, Image as ImageIcon } from "lucide-react";

interface HistoryJob {
  id: string;
  url: string;
  shortcode: string | null;
  mediaType: string;
  status: string;
  authorUsername: string | null;
  caption: string | null;
  createdAt: string;
  files: Array<{
    id: string;
    fileType: string;
    sizeBytes: number;
    mimeType: string;
    storagePath: string;
  }>;
}

interface DownloadHistoryListProps {
  jobs: HistoryJob[];
  isLoading: boolean;
  onRefresh: () => void;
}

export function DownloadHistoryList({ jobs, isLoading, onRefresh }: DownloadHistoryListProps) {
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [isZipping, setIsZipping] = useState(false);

  const toggleSelectFile = (id: string) => {
    setSelectedFileIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const allFileIds = jobs.flatMap((j) => j.files.map((f) => f.id));
    if (selectedFileIds.length === allFileIds.length) {
      setSelectedFileIds([]);
    } else {
      setSelectedFileIds(allFileIds);
    }
  };

  const handleBatchZipDownload = async () => {
    if (selectedFileIds.length === 0 || isZipping) return;

    try {
      setIsZipping(true);
      const res = await fetch("/api/media/batch-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaFileIds: selectedFileIds }),
      });

      if (!res.ok) {
        throw new Error("Batch zip generation failed");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `instagram_batch_${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert("Failed to create zip file: " + (err as Error).message);
    } finally {
      setIsZipping(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-12 rounded-2xl glass-card border border-gray-800 overflow-hidden shadow-xl">
      {/* Header */}
      <div className="p-5 border-b border-gray-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-lg text-white">Archived Media Library</h3>
          <p className="text-xs text-gray-400">Your downloaded Instagram assets stored with SHA-256 deduplication</p>
        </div>

        <div className="flex items-center gap-3">
          {jobs.length > 0 && (
            <>
              <button
                onClick={handleSelectAll}
                className="text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg border border-gray-700 bg-gray-800/60 transition"
              >
                {selectedFileIds.length > 0 ? "Deselect All" : "Select All"}
              </button>

              {selectedFileIds.length > 0 && (
                <button
                  onClick={handleBatchZipDownload}
                  disabled={isZipping}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white flex items-center gap-1.5 transition shadow"
                >
                  <FileArchive className="w-3.5 h-3.5" />
                  <span>{isZipping ? "Creating Zip..." : `Download Zip (${selectedFileIds.length})`}</span>
                </button>
              )}
            </>
          )}

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition border border-gray-800"
            title="Refresh History"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Jobs Table / Cards */}
      {jobs.length === 0 ? (
        <div className="p-12 text-center text-gray-500">
          <p className="text-sm">No media archived yet. Enter an Instagram link above to extract and archive.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-800/60">
          {jobs.map((job) => (
            <div key={job.id} className="p-4 sm:p-5 hover:bg-gray-900/30 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-gray-200">
                    @{job.authorUsername || "instagram_user"}
                  </span>
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-gray-800 text-pink-400 border border-gray-700">
                    {job.mediaType}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {job.caption && (
                  <p className="text-xs text-gray-400 truncate max-w-xl">
                    {job.caption}
                  </p>
                )}
              </div>

              {/* Files in this job */}
              <div className="flex flex-wrap items-center gap-2">
                {job.files.map((file, idx) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800/80 border border-gray-700 text-xs text-gray-300"
                  >
                    <button
                      onClick={() => toggleSelectFile(file.id)}
                      className="text-gray-400 hover:text-white"
                    >
                      {selectedFileIds.includes(file.id) ? (
                        <CheckSquare className="w-3.5 h-3.5 text-pink-500" />
                      ) : (
                        <Square className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {file.fileType === "VIDEO" ? (
                      <Video className="w-3.5 h-3.5 text-blue-400" />
                    ) : (
                      <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                    )}

                    <span>{formatBytes(file.sizeBytes)}</span>

                    <a
                      href={`/api/media/${file.id}/download`}
                      download
                      className="text-pink-400 hover:text-pink-300 p-1"
                      title="Download File"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
