"use client";

import React from "react";
import Link from "next/link";
import { Film, History, ShieldCheck } from "lucide-react";

interface HeaderProps {
  historyCount: number;
  onOpenHistory: () => void;
}

export function Header({ historyCount, onOpenHistory }: HeaderProps) {
  return (
    <header className="border-b border-navy-800 bg-navy-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-emerald flex items-center justify-center shadow-md shadow-brand-blue/20 group-hover:scale-105 transition-transform">
            <Film className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight text-white flex items-center gap-1">
              Media<span className="brand-gradient-text">Mate</span>
            </span>
            <span className="block text-[10px] text-gray-400 font-medium tracking-wider uppercase">
              Free Multi-Platform Media Toolkit
            </span>
          </div>
        </Link>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Free & Legal</span>
          </div>

          <button
            onClick={onOpenHistory}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-850 hover:bg-navy-800 text-gray-200 border border-navy-700/60 text-xs font-medium transition"
            title="View recent history"
          >
            <History className="w-4 h-4 text-brand-sky" />
            <span className="hidden sm:inline">Recent History</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-brand-blue/30 text-brand-sky text-[11px] font-bold">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
