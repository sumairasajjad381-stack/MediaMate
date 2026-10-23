"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { MediaExtractorForm } from "@/components/MediaExtractorForm";
import { MediaPreviewCard } from "@/components/MediaPreviewCard";
import { DownloadHistoryList } from "@/components/DownloadHistoryList";
import { AuthModal } from "@/components/AuthModal";
import { ExtractedMetadata } from "@/lib/extractor/types";
import { ShieldCheck, Zap, Layers, HardDrive } from "lucide-react";

export default function HomePage() {
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [extractedMetadata, setExtractedMetadata] = useState<ExtractedMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isArchiving, setIsArchiving] = useState(false);
  const [archiveSuccess, setArchiveSuccess] = useState(false);
  const [historyJobs, setHistoryJobs] = useState([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  // Check auth status on load
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data?.data?.user) {
          setUser(data.data.user);
        }
      })
      .catch(() => {});
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      setIsHistoryLoading(true);
      const res = await fetch("/api/history?limit=15");
      const data = await res.json();
      if (data.success && data.data?.jobs) {
        setHistoryJobs(data.data.jobs);
      }
    } catch {
      // Ignore background history fetch errors
    } finally {
      setIsHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory, user]);

  const handleExtract = async (url: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setArchiveSuccess(false);
      setExtractedMetadata(null);

      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.error?.message || "Failed to extract Instagram media");
      }

      setExtractedMetadata(data.data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchive = async () => {
    if (!extractedMetadata) return;

    try {
      setIsArchiving(true);
      const res = await fetch("/api/archive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: extractedMetadata.url }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.error?.message || "Failed to archive media on server");
      }

      setArchiveSuccess(true);
      fetchHistory(); // Refresh library
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setIsArchiving(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    fetchHistory();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0d13]">
      <Navbar
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 sm:py-14 space-y-10">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-xs font-semibold text-pink-400">
            <Zap className="w-3.5 h-3.5" />
            <span>High-Throughput Archiver & Media Extractor</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Download Any Instagram <br />
            <span className="insta-gradient-text">Video, Reel, or Photo</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Fast, high-fidelity media extraction with direct stream downloads, carousel multi-slide support, and deduplicated server archival.
          </p>
        </div>

        {/* Input Form */}
        <MediaExtractorForm
          onExtract={handleExtract}
          isLoading={isLoading}
          error={error}
        />

        {/* Extracted Preview Card */}
        {extractedMetadata && (
          <div className="animate-fadeIn transition">
            <MediaPreviewCard
              metadata={extractedMetadata}
              onArchive={handleArchive}
              isArchiving={isArchiving}
              archiveSuccess={archiveSuccess}
            />
          </div>
        )}

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          <div className="p-4 rounded-xl glass-card border border-gray-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400">
              <Zap className="w-4 h-4" />
            </div>
            <h4 className="font-semibold text-sm text-gray-200">Instant Streaming</h4>
            <p className="text-xs text-gray-400">Zero delay stream-piping directly from content delivery networks.</p>
          </div>

          <div className="p-4 rounded-xl glass-card border border-gray-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Layers className="w-4 h-4" />
            </div>
            <h4 className="font-semibold text-sm text-gray-200">Carousel Support</h4>
            <p className="text-xs text-gray-400">Extract all slides from multi-photo and multi-video posts at once.</p>
          </div>

          <div className="p-4 rounded-xl glass-card border border-gray-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <HardDrive className="w-4 h-4" />
            </div>
            <h4 className="font-semibold text-sm text-gray-200">SHA-256 Deduplication</h4>
            <p className="text-xs text-gray-400">Smart content-addressed storage prevents storing identical files twice.</p>
          </div>

          <div className="p-4 rounded-xl glass-card border border-gray-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="font-semibold text-sm text-gray-200">Security Hardened</h4>
            <p className="text-xs text-gray-400">SSRF mitigation, rate limiting, and zero hardcoded secrets.</p>
          </div>
        </div>

        {/* Media Archive & History */}
        <DownloadHistoryList
          jobs={historyJobs}
          isLoading={isHistoryLoading}
          onRefresh={fetchHistory}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-6 mt-16 text-center text-xs text-gray-500">
        <p>InstaArchiver Engine &bull; Built with Next.js, Prisma, and Tailwind CSS &bull; Senior Engineering Standards</p>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(loggedUser) => {
          setUser(loggedUser);
          fetchHistory();
        }}
      />
    </div>
  );
}
