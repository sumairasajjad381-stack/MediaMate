"use client";

import React from "react";
import { X, Trash2, ArrowRight, Clock } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-xs">
      <div className="w-full max-w-md h-full bg-white border-l border-gray-200 p-5 flex flex-col justify-between shadow-2xl">
        {/* Top bar */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-sm text-gray-900">Recent Link History</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {history.length === 0 ? (
            <div className="py-20 text-center text-gray-400 text-xs">
              <p>No links inspected yet.</p>
              <p className="mt-1">Links you check are saved securely in your browser.</p>
            </div>
          ) : (
            history.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-gray-50 border border-gray-200 hover:border-gray-300 space-y-2 transition cursor-pointer group hover:bg-gray-100/70"
                onClick={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                    {item.platformName}
                  </span>
                  <span className="text-xs text-gray-400 group-hover:text-blue-600 flex items-center gap-1 font-medium">
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  {item.thumbnailUrl ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-900 shrink-0 border border-gray-200 shadow-2xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title || ""}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    </div>
                  ) : null}
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <p className="text-xs font-semibold text-gray-900 line-clamp-1">
                      {item.title || item.url}
                    </p>
                    <p className="text-[11px] text-gray-400 truncate">{item.url}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Bar */}
        {history.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={onClear}
              className="w-full py-2.5 rounded-xl text-xs font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 flex items-center justify-center gap-2 transition"
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
