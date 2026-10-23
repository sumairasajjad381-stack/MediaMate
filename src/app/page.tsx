"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HistoryDrawer } from "@/components/HistoryDrawer";
import { Instagram, Facebook, Video, ArrowRight, ShieldCheck, Zap, Sparkles } from "lucide-react";
import { MediaInspectResult } from "@/lib/platforms/types";

const LOCAL_STORAGE_KEY = "mediamate_recent_history";

export default function HomePage() {
  const [history, setHistory] = useState<MediaInspectResult[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch {}
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      <Header
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-10 sm:py-16 space-y-12">
        {/* Simple Clean Hub Hero */}
        <section className="text-center space-y-4 max-w-2xl mx-auto">
          {/* Google-style Colorful Dots */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-3 h-3 rounded-full bg-[#4285F4]" />
            <span className="w-3 h-3 rounded-full bg-[#EA4335]" />
            <span className="w-3 h-3 rounded-full bg-[#FBBC05]" />
            <span className="w-3 h-3 rounded-full bg-[#34A853]" />
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
            MediaMate — All Social Media Downloaders
          </h1>

          <p className="text-gray-500 text-sm sm:text-base font-medium">
            Select a tool to get started
          </p>
        </section>

        {/* 3 Big Platform Cards (Intent Safe) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Card 1: Instagram Video Downloader */}
          <Link
            href="/instagram-video-downloader"
            className="group block p-6 sm:p-7 rounded-2xl bg-white border border-gray-200 google-shadow transition-all hover:-translate-y-1 hover:shadow-lg relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-[#feda75] before:via-[#d62976] before:to-[#962fbf]"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl insta-gradient-full flex items-center justify-center text-white shadow-md shadow-pink-500/20 group-hover:scale-105 transition-transform">
                <Instagram className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[11px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border border-pink-200 bg-pink-50 text-[#d62976]">
                  Reels • Stories • Photos
                </span>
                <h2 className="text-xl font-bold text-gray-900 group-hover:text-[#d62976] transition-colors mt-2">
                  Instagram Downloader
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
                  Download Instagram Reels, Stories, Photos & Carousels in 1080p HD without watermarks.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-[#d62976] group-hover:gap-2.5 transition-all">
                <span>Open Instagram Tool</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Card 2: Facebook Reels Downloader */}
          <Link
            href="/facebook-reels-downloader"
            className="group block p-6 sm:p-7 rounded-2xl bg-white border border-gray-200 google-shadow transition-all hover:-translate-y-1 hover:shadow-lg relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-[#1877F2]"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#1877F2] flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Facebook className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[11px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border border-blue-200 bg-blue-50 text-[#1877F2]">
                  Reels • Public Video
                </span>
                <h2 className="text-xl font-bold text-gray-900 group-hover:text-[#1877F2] transition-colors mt-2">
                  Facebook Downloader
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
                  Inspect and save public Facebook Reels, video clips, and live recordings in high quality.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-[#1877F2] group-hover:gap-2.5 transition-all">
                <span>Open Facebook Tool</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Card 3: TikTok Video Downloader */}
          <Link
            href="/tiktok-video-downloader"
            className="group block p-6 sm:p-7 rounded-2xl bg-white border border-gray-200 google-shadow transition-all hover:-translate-y-1 hover:shadow-lg relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-[#00f2fe] before:to-[#4facfe]"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center text-white shadow-md shadow-gray-500/20 group-hover:scale-105 transition-transform">
                <Video className="w-6 h-6 text-[#00f2fe]" />
              </div>

              <div>
                <span className="text-[11px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border border-gray-200 bg-gray-100 text-gray-800">
                  HD Video • Audio MP3
                </span>
                <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mt-2">
                  TikTok Downloader
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
                  Extract public TikTok videos and audio tracks with fast authorized inspection.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-gray-900 group-hover:gap-2.5 transition-all">
                <span>Open TikTok Tool</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        </section>

        {/* Minimal Trust Features (No long confusing text) */}
        <section className="border-t border-gray-100 pt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-xs text-gray-500">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-semibold text-gray-800 text-sm">100% Free & Legal</span>
            <p>Operates with official authorized methods and public endpoints.</p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <span className="font-semibold text-gray-800 text-sm">No Accounts or Passwords</span>
            <p>Never asks for your private login credentials or session cookies.</p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-pink-50 text-[#d62976] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-semibold text-gray-800 text-sm">Multi-Device Ready</span>
            <p>Works smoothly on mobile phones, tablets, Mac, and Windows PC.</p>
          </div>
        </section>
      </main>

      <Footer />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={() => setIsHistoryOpen(false)}
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
