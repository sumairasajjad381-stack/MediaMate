"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { MediaInspector } from "@/components/MediaInspector";
import { ResultDisplay } from "@/components/ResultDisplay";
import { ToolsGrid } from "@/components/ToolsGrid";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import { HistoryDrawer } from "@/components/HistoryDrawer";
import { MediaInspectResult } from "@/lib/platforms/types";

const LOCAL_STORAGE_KEY = "mediamate_recent_history";

export default function HomePage() {
  const [inspectResult, setInspectResult] = useState<MediaInspectResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<MediaInspectResult[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Load history from browser localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch {
      // Ignore localStorage read errors in private browsing modes
    }
  }, []);

  const saveToHistory = (item: MediaInspectResult) => {
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.url !== item.url);
      const updated = [item, ...filtered].slice(0, 20);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore quota errors
      }
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {}
  };

  const handleInspect = async (url: string, platform?: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch("/api/media/inspect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, platform }),
      });

      const json = await res.json();

      if (!res.ok || !json.data) {
        throw new Error(json.error || "Failed to inspect the media URL.");
      }

      setInspectResult(json.data);

      if (json.data.isSupported) {
        saveToHistory(json.data);
      } else if (json.data.error) {
        setError(json.data.error);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      <Header
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 sm:py-14 space-y-12">
        {/* Google-Style Clean Hero */}
        <HeroSection />

        {/* Clean URL Input Form */}
        <MediaInspector
          onInspect={handleInspect}
          isLoading={isLoading}
          error={error}
        />

        {/* Inspected Results */}
        {inspectResult && inspectResult.isSupported && (
          <div className="animate-fadeIn">
            <ResultDisplay result={inspectResult} />
          </div>
        )}

        {/* Minimal Supported Media Tools */}
        <ToolsGrid />

        {/* Transparent FAQs */}
        <FAQSection />
      </main>

      <Footer />

      {/* Local History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={(item) => {
          setInspectResult(item);
          setError(null);
        }}
        onClear={clearHistory}
      />
    </div>
  );
}
