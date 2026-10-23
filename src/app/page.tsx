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
      // Avoid duplicate URLs at top
      const filtered = prev.filter((h) => h.url !== item.url);
      const updated = [item, ...filtered].slice(0, 20); // Keep last 20
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
    <div className="min-h-screen flex flex-col bg-navy-950 text-gray-100 selection:bg-brand-blue selection:text-white">
      <Header
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 sm:py-12 space-y-12">
        {/* Hero Headline */}
        <HeroSection />

        {/* URL Input Form */}
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

        {/* Supported Media Tools */}
        <ToolsGrid />

        {/* FAQs */}
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
