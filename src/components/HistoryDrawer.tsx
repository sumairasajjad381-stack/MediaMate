"use client";

import React from "react";
import { X, Trash2, ExternalLink, ArrowRight, Clock } from "lucide-react";
import { MediaInspectResult } from "@/lib/platforms/types";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: MediaInspectResult[];
  onSelect: (item: MediaInspectResult) => void;
  onClear: () => void;
}

export function HistoryDrawer({
  isOpen,
  onClose,
  history,
  onSelect,
  onClear,
}: HistoryDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md h-full bg-navy-950 border-l border-navy-800 p-5 flex flex-col justify-between shadow-2xl">
        {/* Top bar */}
        <div className="flex items-center justify-between pb-4 border-b border-navy-800">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-sky" />
            <h3 className="font-semibold text-sm text-white">Recent Link History</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-navy-850 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {history.length === 0 ? (
            <div className="py-20 text-center text-gray-500 text-xs">
              <p>No links inspected yet.</p>
              <p className="mt-1">Links you check are saved securely in your browser.</p>
            </div>
          ) : (
            history.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-navy-900 border border-navy-800 hover:border-navy-700 space-y-2 transition cursor-pointer group"
                onClick={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-navy-800 text-brand-sky border border-navy-700">
                    {item.platformName}
                  </span>
                  <span className="text-xs text-gray-400 group-hover:text-white flex items-center gap-1">
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
                <p className="text-xs font-medium text-gray-200 line-clamp-1">
                  {item.title || item.url}
                </p>
                <p className="text-[11px] text-gray-500 truncate">{item.url}</p>
              </div>
            ))
          )}
        </div>

        {/* Bottom Bar */}
        {history.length > 0 && (
          <div className="pt-4 border-t border-navy-800">
            <button
              onClick={onClear}
              className="w-full py-2.5 rounded-xl text-xs font-medium text-red-300 hover:text-red-200 bg-red-950/30 hover:bg-red-950/60 border border-red-500/20 flex items-center justify-center gap-2 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Local History</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
