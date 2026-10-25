"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { History, ShieldCheck, Instagram, Facebook } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

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
    <header className="border-b border-gray-200/80 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md sticky top-0 z-40 transition-colors">
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
            <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white flex items-center">
              Media<span className="text-[#2563eb] dark:text-blue-400">Mate</span>
            </span>
          </div>
        </Link>

        {/* Center Navigation Links (Intent Safe) */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-medium">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-lg transition ${
              isHome
                ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/60"
            }`}
          >
            Home
          </Link>

          <Link
            href="/instagram-video-downloader"
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              isInstagram
                ? "bg-pink-50 dark:bg-pink-950/40 text-[#d62976] dark:text-pink-400 font-semibold border border-pink-200 dark:border-pink-800/60 shadow-2xs"
                : "text-gray-600 dark:text-gray-300 hover:text-[#d62976] dark:hover:text-pink-400 hover:bg-pink-50/50 dark:hover:bg-pink-950/20"
            }`}
          >
            <Instagram className="w-3.5 h-3.5 text-[#d62976]" />
            <span>Instagram Downloader</span>
          </Link>

          <Link
            href="/facebook-reels-downloader"
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              isFacebook
                ? "bg-blue-50 dark:bg-blue-950/40 text-[#1877F2] dark:text-blue-400 font-semibold border border-blue-200 dark:border-blue-800/60 shadow-2xs"
                : "text-gray-600 dark:text-gray-300 hover:text-[#1877F2] dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/20"
            }`}
          >
            <Facebook className="w-3.5 h-3.5 text-[#1877F2]" />
            <span>Facebook Reels</span>
          </Link>

          <Link
            href="/tiktok-video-downloader"
            className={`px-3 py-1.5 rounded-lg transition ${
              isTikTok
                ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold border border-gray-300 dark:border-gray-700 shadow-2xs"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/60"
            }`}
          >
            TikTok
          </Link>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs font-medium text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Free & Legal</span>
          </div>

          {/* Theme Toggle (Dark / Light Mode) */}
          <ThemeToggle />

          <button
            onClick={onOpenHistory}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition relative ${
              highlightHistory
                ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-2 border-emerald-400 ring-2 ring-emerald-200 dark:ring-emerald-800 animate-pulse font-bold"
                : "bg-gray-50 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
            }`}
            title="View recent history"
          >
            <History className={`w-4 h-4 ${highlightHistory ? "text-emerald-600" : "text-gray-500 dark:text-gray-400"}`} />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[11px] font-bold ${
                  highlightHistory
                    ? "bg-emerald-600 text-white"
                    : "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
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
      <div className="md:hidden flex items-center justify-around border-t border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/60 backdrop-blur-md px-2 py-1.5 text-xs font-medium overflow-x-auto">
        <Link
          href="/"
          className={`px-2.5 py-1 rounded-md transition ${isHome ? "text-blue-600 dark:text-blue-400 font-bold" : "text-gray-600 dark:text-gray-400"}`}
        >
          Home
        </Link>
        <Link
          href="/instagram-video-downloader"
          className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
            isInstagram ? "text-[#d62976] dark:text-pink-400 font-bold bg-pink-50 dark:bg-pink-950/40" : "text-gray-600 dark:text-gray-400"
          }`}
        >
          <Instagram className="w-3 h-3 text-[#d62976]" />
          <span>Instagram</span>
        </Link>
        <Link
          href="/facebook-reels-downloader"
          className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
            isFacebook ? "text-[#1877F2] dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-950/40" : "text-gray-600 dark:text-gray-400"
          }`}
        >
          <Facebook className="w-3 h-3 text-[#1877F2]" />
          <span>Facebook</span>
        </Link>
        <Link
          href="/tiktok-video-downloader"
          className={`px-2.5 py-1 rounded-md transition ${isTikTok ? "text-gray-900 dark:text-white font-bold bg-gray-200 dark:bg-gray-800" : "text-gray-600 dark:text-gray-400"}`}
        >
          TikTok
        </Link>
      </div>
    </header>
  );
}
