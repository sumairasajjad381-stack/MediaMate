import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 py-10 mt-20 text-xs text-gray-500">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
              <span className="w-2 h-2 rounded-full bg-[#EA4335]" />
              <span className="w-2 h-2 rounded-full bg-[#FBBC05]" />
              <span className="w-2 h-2 rounded-full bg-[#34A853]" />
            </div>
            <span className="font-bold text-sm text-gray-800">
              Media<span className="text-[#2563eb]">Mate</span>
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-gray-900 transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-900 transition">Terms of Use</Link>
            <a href="mailto:support@mediamate.toolkit" className="hover:text-gray-900 transition">Contact</a>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-400">
          <p>&copy; {new Date().getFullYear()} MediaMate. All rights reserved.</p>
          <p>Operates strictly in compliance with platform developer terms and public oEmbed specifications.</p>
        </div>
      </div>
    </footer>
  );
}
