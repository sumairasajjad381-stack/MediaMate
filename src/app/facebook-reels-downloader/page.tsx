"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Facebook,
  Search,
  Loader2,
  Clipboard,
  Info,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Film,
  Zap,
  ShieldCheck,
  ChevronDown,
  User,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HistoryDrawer } from "@/components/HistoryDrawer";
import { MediaInspectResult } from "@/lib/platforms/types";

const LOCAL_STORAGE_KEY = "mediamate_recent_history";

export default function FacebookReelsDownloaderPage() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inspectResult, setInspectResult] = useState<MediaInspectResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<MediaInspectResult[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) setHistory(JSON.parse(stored));
    } catch {}
  }, []);

  const saveToHistory = (item: MediaInspectResult) => {
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.url !== item.url);
      const updated = [item, ...filtered].slice(0, 20);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleInspect = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url.trim() || isLoading) return;

    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch("/api/media/inspect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), platform: "facebook" }),
      });

      const json = await res.json();
      if (!res.ok || !json.data) throw new Error(json.error || "Failed to inspect the Facebook link.");

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

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setUrl(text);
    } catch {}
  };

  const handleCopyUrl = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const sampleFacebookUrl = "https://www.facebook.com/reel/1025252600137666";

  const faqs = [
    {
      q: "How to download Facebook Reels in HD?",
      a: "Copy the link of any public Facebook Reel, paste it into the field above, and click 'Download Reel'. MediaMate inspects the link and provides safe options to access the video.",
    },
    {
      q: "Can I download Facebook Reels from private groups or profiles?",
      a: "No. Facebook's privacy controls protect private group posts and friends-only videos. MediaMate strictly supports public Facebook Reels and public Page videos.",
    },
    {
      q: "Does MediaMate save copies of Facebook videos on a server?",
      a: "No. MediaMate operates on a $0 zero-storage budget. We never store copies of your downloaded videos on server disks.",
    },
    {
      q: "Is there any limit on how many Facebook Reels I can check?",
      a: "There are no limits. MediaMate is completely free with unlimited public link inspections.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800 selection:bg-blue-100 selection:text-blue-900">
      <Header
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 sm:py-14 space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-2xl mx-auto pt-2 sm:pt-6">
          <div className="flex items-center justify-center mb-3">
            <div className="w-16 h-16 rounded-2xl bg-[#1877F2] flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
              <Facebook className="w-9 h-9" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
            Facebook <span className="text-[#1877F2]">Reels Downloader</span>
          </h1>

          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Download Facebook Reels & Videos in HD 1080p — Fast, Free & Anonymous.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1877F2] font-semibold">
              🎥 Public Facebook Reels
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1877F2] font-semibold">
              📺 Page Videos & Clips
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1877F2] font-semibold">
              ⚡ 100% Free & Legal
            </span>
          </div>

          {/* Input Box */}
          <div className="pt-4 max-w-2xl mx-auto space-y-3">
            <form onSubmit={handleInspect}>
              <div className="flex flex-col sm:flex-row items-center gap-2 p-2 bg-white rounded-2xl border border-gray-200 google-shadow transition-all focus-within:border-[#1877F2] focus-within:ring-2 focus-within:ring-blue-100 hover:border-blue-300">
                <div className="flex items-center flex-1 w-full px-3 gap-2">
                  <Search className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    type="url"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste Facebook Reel URL (e.g. facebook.com/reel/1025252600137666)..."
                    className="w-full bg-transparent border-none text-gray-900 placeholder-gray-400 focus:outline-none text-sm sm:text-base py-2.5"
                    disabled={isLoading}
                  />
                  {url ? (
                    <button
                      type="button"
                      onClick={() => setUrl("")}
                      className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1"
                    >
                      Clear
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handlePaste}
                      className="flex items-center gap-1 text-xs text-gray-600 hover:text-[#1877F2] px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 transition border border-blue-200 font-medium"
                    >
                      <Clipboard className="w-3.5 h-3.5 text-[#1877F2]" />
                      <span className="hidden sm:inline">Paste</span>
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!url.trim() || isLoading}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl font-medium text-white shadow-md bg-[#1877F2] hover:bg-[#166fe5] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Checking...</span>
                    </>
                  ) : (
                    <span>Download Reel</span>
                  )}
                </button>
              </div>
            </form>

            {error && (
              <div className="p-3.5 rounded-xl bg-[#f9fafb] border border-gray-200 text-gray-700 text-sm flex items-start gap-2.5 shadow-xs">
                <Info className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-gray-500">
              <span>Try test link:</span>
              <button
                type="button"
                onClick={() => setUrl(sampleFacebookUrl)}
                className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#1877F2] border border-blue-200 transition font-medium"
              >
                Sample Facebook Reel
              </button>
            </div>
          </div>
        </section>

        {/* Results Card */}
        {inspectResult && inspectResult.isSupported && (
          <section className="animate-fadeIn">
            <div className="w-full max-w-2xl mx-auto rounded-2xl bg-white border border-gray-200 google-shadow overflow-hidden transition relative before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-[#1877F2]">
              <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2 pt-5">
                <div className="flex items-center gap-2.5">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-50 text-[#1877F2] border border-blue-200">
                    {inspectResult.platformName}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Verified Link</span>
                  </span>
                </div>

                <a
                  href={inspectResult.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-500 hover:text-[#1877F2] flex items-center gap-1 p-1.5 rounded-lg hover:bg-blue-50 transition"
                >
                  <span>Open on Facebook</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-gray-900 leading-snug">
                    {inspectResult.title || "Valid Facebook Reel"}
                  </h3>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 w-20 shrink-0">Platform:</span>
                    <span className="text-gray-800 font-medium">{inspectResult.platformName}</span>
                  </div>

                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-semibold text-gray-900 w-20 shrink-0">URL:</span>
                    <span className="text-[#1877F2] truncate font-mono text-xs">{inspectResult.url}</span>
                    <button
                      onClick={() => handleCopyUrl(inspectResult.url)}
                      title="Copy URL"
                      className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition shrink-0"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
                    </button>
                  </div>
                </div>

                {inspectResult.limitationsNotice && (
                  <div className="p-4 rounded-xl bg-[#f9fafb] border border-gray-200 text-xs sm:text-sm text-gray-700 flex items-start gap-3 shadow-xs">
                    <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-semibold text-gray-900 block">Message:</span>
                      <p className="leading-relaxed text-gray-600">{inspectResult.limitationsNotice}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-gray-500 font-medium">Available Actions:</span>

                <div className="flex flex-wrap items-center gap-2.5">
                  <a
                    href={inspectResult.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#1877F2] hover:bg-[#166fe5] shadow flex items-center gap-2 transition"
                  >
                    <span>Open on Facebook</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => handleCopyUrl(inspectResult.url)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-gray-700 bg-white hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5 transition shadow-xs"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#1877F2]" />
                    <span>{copied ? "Copied!" : "Copy Link"}</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Facebook 3 Steps */}
        <section className="space-y-6 pt-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">How to Download Facebook Reels</h2>
            <p className="text-xs sm:text-sm text-gray-500">Fast, 3-step inspection for public Facebook videos</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-gray-200 text-center space-y-3 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-[#1877F2] hover:shadow-md transition">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 flex items-center justify-center text-[#1877F2] font-bold text-lg">
                1
              </div>
              <h3 className="font-bold text-base text-gray-900">Copy Reel Link</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Click Share &gt; Copy Link on any public Facebook Reel or video post.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-200 text-center space-y-3 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-[#1877F2] hover:shadow-md transition">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 flex items-center justify-center text-[#1877F2] font-bold text-lg">
                2
              </div>
              <h3 className="font-bold text-base text-gray-900">Paste in MediaMate</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Paste the URL into the search field above and click &ldquo;Download Reel&rdquo;.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-200 text-center space-y-3 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-[#1877F2] hover:shadow-md transition">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 flex items-center justify-center text-[#1877F2] font-bold text-lg">
                3
              </div>
              <h3 className="font-bold text-base text-gray-900">Access in HD</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Verify the post link and open or save the video stream safely.
              </p>
            </div>
          </div>
        </section>

        {/* Facebook FAQs */}
        <section className="max-w-2xl mx-auto space-y-6 pt-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Facebook Reels Downloader FAQs</h2>
            <p className="text-xs sm:text-sm text-gray-500">Common questions about Facebook video links</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className="rounded-2xl bg-white border border-gray-200 overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm text-gray-800 hover:text-[#1877F2] transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${isOpen ? "rotate-180 text-[#1877F2]" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={(item) => {
          setUrl(item.url);
          setInspectResult(item);
          setError(null);
        }}
        onClear={() => {
          setHistory([]);
          try {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
          } catch {}
        }}
      />
    </div>
  );
}
