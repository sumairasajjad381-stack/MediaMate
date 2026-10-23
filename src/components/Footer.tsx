import React from "react";
import Link from "next/link";
import { Film } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-navy-800 bg-navy-950/80 py-10 mt-20 text-xs text-gray-400">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-blue flex items-center justify-center text-white">
              <Film className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-white">
              Media<span className="brand-gradient-text">Mate</span>
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms of Use</Link>
            <a href="mailto:support@mediamate.toolkit" className="hover:text-white transition">Contact</a>
          </div>
        </div>

        <div className="border-t border-navy-850 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-500">
          <p>&copy; {new Date().getFullYear()} MediaMate. All rights reserved.</p>
          <p>Operates strictly in compliance with platform developer terms and public oEmbed specifications.</p>
        </div>
      </div>
    </footer>
  );
}
