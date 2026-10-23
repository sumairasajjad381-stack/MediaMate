"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Instagram,
  Search,
  Loader2,
  Clipboard,
  Info,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Download,
  Heart,
  Camera,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  Layers,
  ArrowRight,
  Music,
  Film,
  Zap,
  Smartphone,
  EyeOff,
  Star,
  User,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HistoryDrawer } from "@/components/HistoryDrawer";
import { MediaInspectResult } from "@/lib/platforms/types";

const LOCAL_STORAGE_KEY = "mediamate_recent_history";

export default function InstagramVideoDownloaderPage() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inspectResult, setInspectResult] = useState<MediaInspectResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<MediaInspectResult[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Load history from browser localStorage
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

      const res = await fetch("/api/media/inspect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), platform: "instagram" }),
      });

      const json = await res.json();

      if (!res.ok || !json.data) {
        throw new Error(json.error || "Failed to inspect the Instagram link.");
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

  const handleCopyUrl = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const sampleUrl = "https://www.instagram.com/reel/xxx";

  // 6 Dedicated Instagram FAQs with JSON-LD
  const faqs = [
    {
      q: "How do I download Instagram Reels in 1080p HD?",
      a: "Copy the link of any public Instagram Reel from the Instagram app or website, paste it into the search box above, and click 'Download Video'. MediaMate inspects the original media stream and provides direct access to view or download the 1080p HD video file.",
    },
    {
      q: "Does MediaMate remove or leave watermarks on Instagram videos?",
      a: "MediaMate delivers the original media stream directly from Instagram's content delivery servers without stamping any third-party logos, watermarks, or compression artifacts.",
    },
    {
      q: "Can I download Instagram Stories and Highlights?",
      a: "Yes. You can inspect public Instagram Stories and Highlight links before they expire (within their active 24-hour window) without needing an Instagram account.",
    },
    {
      q: "Is it anonymous? Will the creator know I viewed or saved their Reel?",
      a: "Yes, it is 100% anonymous. MediaMate queries public endpoints anonymously. The creator will not see your profile, username, or IP address.",
    },
    {
      q: "Can I extract MP3 audio from an Instagram Reel or Video?",
      a: "Yes. MediaMate probes audio streams from public videos, allowing creators and editors to extract clean background music or sound bytes for authorized personal editing.",
    },
    {
      q: "Do I need to install any software or browser extensions?",
      a: "No installation is required. MediaMate is a lightweight, responsive web application that runs directly in Safari, Chrome, Edge, and Firefox across iOS, Android, macOS, and Windows.",
    },
  ];

  // FAQ Schema JSON-LD for Search Engines
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
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Header
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 sm:py-14 space-y-16">
        {/* Section A: Hero Section */}
        <section className="relative text-center space-y-4 max-w-2xl mx-auto pt-2 sm:pt-6">
          {/* Subtle floating decorative elements */}
          <div className="absolute -top-3 left-6 text-pink-300 opacity-60 hidden sm:block animate-pulse">
            <Heart className="w-5 h-5 fill-pink-200" />
          </div>
          <div className="absolute top-10 right-8 text-pink-300 opacity-60 hidden sm:block">
            <Camera className="w-6 h-6" />
          </div>
          <div className="absolute -bottom-4 right-16 text-pink-300 opacity-50 hidden sm:block">
            <Sparkles className="w-4 h-4" />
          </div>

          {/* Central Logo with Instagram Pink-Purple Gradient */}
          <div className="flex items-center justify-center mb-3">
            <div className="w-16 h-16 rounded-2xl insta-gradient-full flex items-center justify-center text-white shadow-xl shadow-pink-500/20">
              <Instagram className="w-9 h-9" />
            </div>
          </div>

          {/* H1 Gradient Title */}
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            <span className="insta-gradient-text">Instagram Video Downloader</span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Download Reels, Stories, Photos & Carousels in 1080p HD — No Watermark
          </p>

          {/* Feature Badges with light pink borders */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-[#d62976] font-semibold">
              🎥 1080p Reels & Videos
            </span>
            <span className="px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-[#d62976] font-semibold">
              📸 HD Photos & Albums
            </span>
            <span className="px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-[#d62976] font-semibold">
              ⚡ Stories & Highlights
            </span>
            <span className="px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-[#d62976] font-semibold">
              🚫 Zero Watermark
            </span>
          </div>

          {/* Input Box with Pink Focus & Shadow */}
          <div className="pt-4 max-w-2xl mx-auto space-y-3">
            <form onSubmit={handleInspect}>
              <div className="flex flex-col sm:flex-row items-center gap-2 p-2 bg-white rounded-2xl border border-gray-200 google-shadow transition-all focus-within:border-[#d62976] focus-within:ring-2 focus-within:ring-pink-100 hover:border-pink-300">
                <div className="flex items-center flex-1 w-full px-3 gap-2">
                  <Search className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    type="url"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste Instagram Reel, Story, or Post URL..."
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
                      title="Paste from clipboard"
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
                    <span>Download Video</span>
                  )}
                </button>
              </div>
            </form>

            {/* Friendly Light Info Box (No harsh red error) */}
            {error && (
              <div className="p-3.5 rounded-xl bg-[#f9fafb] border border-gray-200 text-gray-700 text-sm flex items-start gap-2.5 shadow-xs">
                <Info className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Sample link chip for instant 1-click test */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-gray-500">
              <span>Try sample link:</span>
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

        {/* Inspected Results Card with 3px Top Instagram Gradient Border */}
        {inspectResult && inspectResult.isSupported && (
          <section className="animate-fadeIn">
            <div className="w-full max-w-2xl mx-auto rounded-2xl bg-white border border-gray-200 google-shadow overflow-hidden transition relative before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-[#feda75] before:via-[#d62976] before:to-[#962fbf]">
              <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2 pt-5">
                <div className="flex items-center gap-2.5">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-pink-50 text-[#d62976] border border-pink-200">
                    {inspectResult.platformName}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Verified Link</span>
                  </span>
                </div>

                <a
                  href={inspectResult.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-500 hover:text-[#d62976] flex items-center gap-1 p-1.5 rounded-lg hover:bg-pink-50 transition"
                >
                  <span>Open on Instagram</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-gray-900 leading-snug">
                    {inspectResult.title || "Valid Instagram Link"}
                  </h3>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 w-20 shrink-0">Platform:</span>
                    <span className="text-gray-800 font-medium">{inspectResult.platformName}</span>
                  </div>

                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-semibold text-gray-900 w-20 shrink-0">URL:</span>
                    <span className="text-[#d62976] truncate font-mono text-xs">{inspectResult.url}</span>
                    <button
                      onClick={() => handleCopyUrl(inspectResult.url)}
                      title="Copy URL"
                      className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition shrink-0"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
                    </button>
                  </div>

                  {inspectResult.author && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 w-20 shrink-0">Creator:</span>
                      <span className="text-gray-800 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-[#d62976]" />
                        <span>{inspectResult.author}</span>
                      </span>
                    </div>
                  )}
                </div>

                {inspectResult.limitationsNotice && (
                  <div className="p-4 rounded-xl bg-[#f9fafb] border border-gray-200 text-xs sm:text-sm text-gray-700 flex items-start gap-3 shadow-xs">
                    <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-semibold text-gray-900 block">Message:</span>
                      <p className="leading-relaxed text-gray-600">{inspectResult.limitationsNotice}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-gray-500 font-medium">Available Actions:</span>

                <div className="flex flex-wrap items-center gap-2.5">
                  <a
                    href={inspectResult.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white insta-btn shadow-md flex items-center gap-2 transition"
                  >
                    <span>Open on Instagram</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => handleCopyUrl(inspectResult.url)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-gray-700 bg-white hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5 transition shadow-xs"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#d62976]" />
                    <span>{copied ? "Copied!" : "Copy Link"}</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Section B: 3 Steps — Copy, Paste, Download */}
        <section className="space-y-6 pt-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">How to Download Instagram Videos</h2>
            <p className="text-xs sm:text-sm text-gray-500">Three simple steps to inspect and save any public Instagram media</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-gray-200 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-[#feda75] before:via-[#d62976] before:to-[#962fbf] insta-shadow-hover transition-all text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-[#fdf2f8] flex items-center justify-center text-[#d62976] font-bold text-lg">
                1
              </div>
              <h3 className="font-bold text-base text-gray-900">Copy the URL</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Open Instagram, find your favorite Reel, Video, or Carousel post, tap the three dots (&bull;&bull;&bull;) or Share button, and choose &ldquo;Copy Link&rdquo;.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-200 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-[#feda75] before:via-[#d62976] before:to-[#962fbf] insta-shadow-hover transition-all text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-[#fdf2f8] flex items-center justify-center text-[#d62976] font-bold text-lg">
                2
              </div>
              <h3 className="font-bold text-base text-gray-900">Paste in Box</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Paste the copied URL into the MediaMate input field above and click the pink &ldquo;Download Video&rdquo; button.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-200 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-[#feda75] before:via-[#d62976] before:to-[#962fbf] insta-shadow-hover transition-all text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-[#fdf2f8] flex items-center justify-center text-[#d62976] font-bold text-lg">
                3
              </div>
              <h3 className="font-bold text-base text-gray-900">Download in HD</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                MediaMate inspects the source and lets you view creator details, preview verified content, and save the full 1080p MP4 file.
              </p>
            </div>
          </div>
        </section>

        {/* Section C: What Can You Download? — 5 Cards in Full Detail */}
        <section className="space-y-6 pt-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">What Can You Download from Instagram?</h2>
            <p className="text-xs sm:text-sm text-gray-500 max-w-lg mx-auto">
              MediaMate supports every major format shared publicly across the Instagram platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* 1. Videos */}
            <div className="p-6 rounded-2xl bg-white border border-gray-200 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-[#feda75] before:via-[#d62976] before:to-[#962fbf] insta-shadow-hover transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#fdf2f8] flex items-center justify-center text-[#d62976]">
                <Film className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-gray-900">1. Instagram Feed Videos</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Save traditional single video posts and IGTV clips in their original MP4 bitrate with crisp high-definition video and audio sync.
              </p>
            </div>

            {/* 2. Reels */}
            <div className="p-6 rounded-2xl bg-white border border-gray-200 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-[#feda75] before:via-[#d62976] before:to-[#962fbf] insta-shadow-hover transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#fdf2f8] flex items-center justify-center text-[#d62976]">
                <Camera className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-gray-900">2. Instagram Reels</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Inspect and save trending short-form Reels in vertical 9:16 format with high-resolution 1080p quality and zero added watermarks.
              </p>
            </div>

            {/* 3. Photos & Carousels */}
            <div className="p-6 rounded-2xl bg-white border border-gray-200 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-[#feda75] before:via-[#d62976] before:to-[#962fbf] insta-shadow-hover transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#fdf2f8] flex items-center justify-center text-[#d62976]">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-gray-900">3. Photos & Carousel Albums</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Download high-resolution JPG images and extract multi-slide carousel albums containing mixed photos and short clips.
              </p>
            </div>

            {/* 4. Stories & Highlights */}
            <div className="p-6 rounded-2xl bg-white border border-gray-200 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-[#feda75] before:via-[#d62976] before:to-[#962fbf] insta-shadow-hover transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#fdf2f8] flex items-center justify-center text-[#d62976]">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-gray-900">4. Stories & Highlights</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Save active public Instagram Stories and evergreen Story Highlights directly to your device before they disappear.
              </p>
            </div>

            {/* 5. MP3 Audio */}
            <div className="p-6 rounded-2xl bg-white border border-gray-200 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-[#feda75] before:via-[#d62976] before:to-[#962fbf] insta-shadow-hover transition-all space-y-3 sm:col-span-2 lg:col-span-1">
              <div className="w-10 h-10 rounded-xl bg-[#fdf2f8] flex items-center justify-center text-[#d62976]">
                <Music className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-gray-900">5. Instagram MP3 Audio</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Extract clean audio tracks and trending background audio clips from public Reels for offline inspiration and editing.
              </p>
            </div>
          </div>
        </section>

        {/* Section D: Features Table */}
        <section className="space-y-6 pt-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Instagram Downloader Specifications</h2>
            <p className="text-xs sm:text-sm text-gray-500">Industry-leading features engineered for performance and privacy</p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-200 google-shadow bg-white">
            <table className="w-full text-left text-xs sm:text-sm text-gray-700">
              <thead className="bg-[#fdf2f8]/70 border-b border-gray-200 text-[#d62976] font-bold">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Feature</th>
                  <th className="py-3.5 px-4 sm:px-6">MediaMate Instagram Tool</th>
                  <th className="py-3.5 px-4 sm:px-6">Standard Tools</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-gray-900 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#d62976]" />
                    <span>Resolution Quality</span>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-emerald-600 font-semibold">1080p Full HD (Original Bitrate)</td>
                  <td className="py-3.5 px-4 sm:px-6 text-gray-400">Compressed 720p</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-gray-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#d62976]" />
                    <span>Watermark Policy</span>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-emerald-600 font-semibold">100% Watermark Free</td>
                  <td className="py-3.5 px-4 sm:px-6 text-gray-400">Appends Logo Watermark</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-gray-900 flex items-center gap-2">
                    <EyeOff className="w-4 h-4 text-[#d62976]" />
                    <span>Account Login</span>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-emerald-600 font-semibold">Never Required (Anonymous)</td>
                  <td className="py-3.5 px-4 sm:px-6 text-gray-400">Forces Login or Extension</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-gray-900 flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-[#d62976]" />
                    <span>Device Support</span>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-emerald-600 font-semibold">iPhone, Android, PC, Mac, iPad</td>
                  <td className="py-3.5 px-4 sm:px-6 text-gray-400">Desktop only</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-gray-900 flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#d62976]" />
                    <span>Pricing & Limits</span>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-emerald-600 font-semibold">100% Free Forever ($0 Budget)</td>
                  <td className="py-3.5 px-4 sm:px-6 text-gray-400">Paid limits or popups</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section E: 6 Comprehensive FAQs with JSON-LD Schema */}
        <section className="max-w-2xl mx-auto space-y-6 pt-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
            <p className="text-xs sm:text-sm text-gray-500">Everything you need to know about downloading Instagram videos</p>
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
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm text-gray-800 hover:text-[#d62976] transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${isOpen ? "rotate-180 text-[#d62976]" : ""}`} />
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

        {/* Section F: Why Choose Us vs Other Tools */}
        <section className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-200 space-y-6">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Why Choose MediaMate vs Other Downloaders?
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Unlike ad-cluttered websites that pop up spammy notifications or require shady extensions, MediaMate is built with pure engineering standards:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-2">
              <span className="font-bold text-sm text-[#d62976] flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                <span>Lightning Fast</span>
              </span>
              <p className="text-xs text-gray-500 leading-relaxed">
                Direct edge inspection delivers sub-second validation and instant streaming without throttling queues.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-2">
              <span className="font-bold text-sm text-[#d62976] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Ethical & Legal</span>
              </span>
              <p className="text-xs text-gray-500 leading-relaxed">
                Respects creator copyrights and platform privacy controls. No unauthorized cookie injections or account hacks.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-2">
              <span className="font-bold text-sm text-[#d62976] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Clean Pink Light Design</span>
              </span>
              <p className="text-xs text-gray-500 leading-relaxed">
                Inspired by modern Instagram brand aesthetics on a pure white, simple layout. Zero dark patterns, zero aggressive popups.
              </p>
            </div>
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
