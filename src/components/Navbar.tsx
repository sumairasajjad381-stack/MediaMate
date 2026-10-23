"use client";

import React from "react";
import { DownloadCloud, Shield, User as UserIcon, LogOut } from "lucide-react";

interface NavbarProps {
  user: { username: string; email: string } | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export function Navbar({ user, onOpenAuth, onLogout }: NavbarProps) {
  return (
    <header className="border-b border-gray-800 bg-[#12151e]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl insta-gradient-bg flex items-center justify-center shadow-lg shadow-pink-500/20">
            <DownloadCloud className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight text-white flex items-center gap-1.5">
              Insta<span className="insta-gradient-text">Archiver</span>
            </span>
            <span className="block text-[10px] text-gray-400 font-medium tracking-wider uppercase">
              Production Scalable Engine
            </span>
          </div>
        </div>

        {/* Right Action */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400">
            <Shield className="w-3.5 h-3.5" />
            <span>Guest Ready (No Login Required)</span>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-sm">
                <UserIcon className="w-4 h-4 text-pink-400" />
                <span className="font-medium text-gray-200">@{user.username}</span>
              </div>
              <button
                onClick={onLogout}
                title="Log Out"
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="text-sm font-medium px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 transition"
            >
              Sign In / Register
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
