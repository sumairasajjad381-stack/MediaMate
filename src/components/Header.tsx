"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { History, ShieldCheck, Instagram, Facebook } from "lucide-react";

interface HeaderProps {
  historyCount: number;
  onOpenHistory: () => void;
  highlightHistory?: boolean;
}

export function Header({ historyCount, onOpenHistory, highlightHistory }: HeaderProps) {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isInstagram = pathname === "/instagram-video-downloader";
  const isFacebook = pathname === "/facebook-reels-downloader";
  const isTikTok = pathname === "/tiktok-video-downloader";

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo with Google Dots */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4285F4]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#EA4335]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FBBC05]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#34A853]" />
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight text-gray-900 flex items-center">
              Media<span className="text-[#2563eb]">Mate</span>
            </span>
          </div>
        </Link>

        {/* Center Navigation Links (Intent Safe) */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-medium">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-lg transition ${
              isHome
                ? "bg-gray-100 text-gray-900 font-semibold"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            Home
          </Link>

          <Link
            href="/instagram-video-downloader"
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              isInstagram
                ? "bg-pink-50 text-[#d62976] font-semibold border border-pink-200 shadow-2xs"
                : "text-gray-600 hover:text-[#d62976] hover:bg-pink-50/50"
            }`}
          >
            <Instagram className="w-3.5 h-3.5 text-[#d62976]" />
            <span>Instagram Downloader</span>
          </Link>

          <Link
            href="/facebook-reels-downloader"
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              isFacebook
                ? "bg-blue-50 text-[#1877F2] font-semibold border border-blue-200 shadow-2xs"
                : "text-gray-600 hover:text-[#1877F2] hover:bg-blue-50/50"
            }`}
          >
            <Facebook className="w-3.5 h-3.5 text-[#1877F2]" />
            <span>Facebook Reels</span>
          </Link>

          <Link
            href="/tiktok-video-downloader"
            className={`px-3 py-1.5 rounded-lg transition ${
              isTikTok
                ? "bg-gray-100 text-gray-900 font-semibold border border-gray-300 shadow-2xs"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            TikTok
          </Link>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-700">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Free & Legal</span>
          </div>

          <button
            onClick={onOpenHistory}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition relative ${
              highlightHistory
                ? "bg-emerald-50 text-emerald-800 border-2 border-emerald-400 ring-2 ring-emerald-200 animate-pulse font-bold"
                : "bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200"
            }`}
            title="View recent history"
          >
            <History className={`w-4 h-4 ${highlightHistory ? "text-emerald-600" : "text-gray-500"}`} />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[11px] font-bold ${
                  highlightHistory
                    ? "bg-emerald-600 text-white"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {historyCount}
              </span>
            )}
            {highlightHistory && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-gray-100 bg-gray-50/60 px-2 py-1.5 text-xs font-medium overflow-x-auto">
        <Link
          href="/"
          className={`px-2.5 py-1 rounded-md transition ${isHome ? "text-blue-600 font-bold" : "text-gray-600"}`}
        >
          Home
        </Link>
        <Link
          href="/instagram-video-downloader"
          className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
            isInstagram ? "text-[#d62976] font-bold bg-pink-50" : "text-gray-600"
          }`}
        >
          <Instagram className="w-3 h-3 text-[#d62976]" />
          <span>Instagram</span>
        </Link>
        <Link
          href="/facebook-reels-downloader"
          className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
            isFacebook ? "text-[#1877F2] font-bold bg-blue-50" : "text-gray-600"
          }`}
        >
          <Facebook className="w-3 h-3 text-[#1877F2]" />
          <span>Facebook</span>
        </Link>
        <Link
          href="/tiktok-video-downloader"
          className={`px-2.5 py-1 rounded-md transition ${isTikTok ? "text-gray-900 font-bold bg-gray-200" : "text-gray-600"}`}
        >
          TikTok
        </Link>
      </div>
    </header>
  );
}
