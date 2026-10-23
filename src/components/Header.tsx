"use client";

import React from "react";
import Link from "next/link";
import { History, ShieldCheck } from "lucide-react";

interface HeaderProps {
  historyCount: number;
  onOpenHistory: () => void;
}

export function Header({ historyCount, onOpenHistory }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo with Google-style Colorful Dots */}
        <Link href="/" className="flex items-center gap-3 group">
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
            <span className="block text-[10px] text-gray-500 font-medium tracking-wide uppercase">
              Free Multi-Platform Media Toolkit
            </span>
          </div>
        </Link>

        {/* Right Navigation */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-700">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Free & Legal</span>
          </div>

          <button
            onClick={onOpenHistory}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 text-xs font-medium transition"
            title="View recent history"
          >
            <History className="w-4 h-4 text-gray-500" />
            <span className="hidden sm:inline">Recent History</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 text-[11px] font-bold">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
