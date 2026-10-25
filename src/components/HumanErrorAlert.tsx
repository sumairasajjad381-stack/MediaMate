"use client";

import React from "react";
import { AlertCircle, Lock, WifiOff, Search, X } from "lucide-react";
import { HumanError } from "@/lib/humanErrors";

interface HumanErrorAlertProps {
  error: HumanError | null;
  onDismiss: () => void;
  onRetry?: () => void;
}

export function HumanErrorAlert({ error, onDismiss, onRetry }: HumanErrorAlertProps) {
  if (!error) return null;

  const renderIcon = () => {
    switch (error.icon) {
      case "lock":
        return <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />;
      case "wifi":
        return <WifiOff className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />;
      case "search":
        return <Search className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />;
      default:
        return <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 rounded-2xl bg-white dark:bg-gray-900 border border-rose-200 dark:border-rose-900/60 shadow-lg shadow-rose-500/5 backdrop-blur-md space-y-2 text-left animate-fadeIn">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {renderIcon()}
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">
              {error.title}
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              {error.message}
            </p>
            {error.hint && (
              <p className="text-[11px] text-gray-500 dark:text-gray-400 italic pt-0.5">
                💡 <span className="font-semibold text-gray-700 dark:text-gray-300">Suggestion:</span> {error.hint}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition shrink-0"
          title="Dismiss error"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {onRetry && (
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onRetry}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition"
          >
            Retry Inspection
          </button>
        </div>
      )}
    </div>
  );
}
