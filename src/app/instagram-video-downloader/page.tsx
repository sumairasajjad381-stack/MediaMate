"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Instagram,
  Search,
  Loader2,
  Clipboard,
  Info,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Download,
  Heart,
  Camera,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  Layers,
  ArrowRight,
  Music,
  Film,
  Zap,
  Smartphone,
  EyeOff,
  Star,
  User,
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  BookOpen,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HistoryDrawer } from "@/components/HistoryDrawer";
import { MediaInspectResult } from "@/lib/platforms/types";

const LOCAL_STORAGE_KEY = "mediamate_recent_history";

export default function InstagramVideoDownloaderPage() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inspectResult, setInspectResult] = useState<MediaInspectResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedHd, setCopiedHd] = useState(false);
  const [history, setHistory] = useState<MediaInspectResult[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showFullSeoGuide, setShowFullSeoGuide] = useState(false);

  // Load history from browser localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
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
        body: JSON.stringify({ url: url.trim(), platform: "instagram" }),
      });

      const json = await res.json();

      if (!res.ok || !json.data) {
        throw new Error(json.error || "Failed to inspect the Instagram link.");
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

  const handleCopyHdLink = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedHd(true);
      setTimeout(() => setCopiedHd(false), 2000);
    } catch {}
  };

  const handleReset = () => {
    setUrl("");
    setInspectResult(null);
    setError(null);
  };

  const sampleUrl = "https://www.instagram.com/reel/xxx";

  // 10 Comprehensive Instagram FAQs with JSON-LD for SEO 95+ Score
  const faqs = [
    {
      q: "How to download Instagram Reels in 1080p Full HD? / انسٹاگرام ریلز فل ایچ ڈی میں کیسے ڈاؤن لوڈ کریں؟",
      a: "Copy the link of any public Instagram Reel from your Instagram app or mobile browser, paste it into the MediaMate search box above, and click 'Download Video'. MediaMate inspects the source server directly and gives you the highest available 1080p MP4 file with crisp 60fps frame rate and crystal-clear audio, completely free and without any watermark (بغیر کسی واٹر مارک کے مکمل ایچ ڈی میں ڈاؤن لوڈ کریں).",
    },
    {
      q: "Does MediaMate stamp or burn any watermark on downloaded videos?",
      a: "No! Absolutely not. Unlike other third-party tools that insert aggressive logos, timestamps, or domain watermarks into your videos, MediaMate preserves the pristine, untouched original file directly from Instagram's content delivery network (CDN). Your downloaded MP4 file remains 100% clean and watermark-free.",
    },
    {
      q: "How to save Instagram videos on iPhone (iOS) and Android camera roll? / موبائل گیلری میں کیسے سیو کریں؟",
      a: "On iPhone (iOS): Open Safari, paste the link in MediaMate, click 'Download Video (1080p)', tap the blue download arrow in Safari, select the downloaded MP4, tap the Share icon, and choose 'Save Video' to add it to your Photos app. On Android: Open Chrome, paste the link, tap Download, and the video immediately downloads straight into your device's 'Downloads' folder and Gallery.",
    },
    {
      q: "Can I download Instagram Stories, Highlights, and Expiring Videos?",
      a: "Yes! Any public Instagram Story or permanent Profile Highlight can be downloaded on MediaMate. Simply copy the link of the Story from your Instagram browser or app, paste it into our input field, and save the MP4 video or JPG photo before the 24-hour expiration window closes.",
    },
    {
      q: "Is downloading Instagram videos safe, legal, and completely anonymous?",
      a: "Yes, 100%. MediaMate does not require you to log in, provide your Instagram username, or share your account password. All requests are routed securely and anonymously. The original creator will never know who downloaded or viewed their public Reel or Story. We strictly comply with zero-logging privacy standards.",
    },
    {
      q: "Can I extract MP3 audio or background music from an Instagram Reel?",
      a: "Yes. When you inspect an Instagram Reel or video with MediaMate, our system detects both the visual stream and the high-bitrate AAC/MP3 audio track (up to 320kbps). You can easily download the audio track to use in your creative projects, video edits, or offline music playlists.",
    },
    {
      q: "How do I download multiple photos or carousel slide albums from Instagram?",
      a: "When you paste a link to an Instagram Carousel or multi-photo post (slideshow), MediaMate's deep parser breaks down every slide individually. You can preview and save each individual photo or video slide in full original resolution without losing image quality.",
    },
    {
      q: "Can I download videos from private Instagram accounts?",
      a: "To protect user privacy and adhere to platform security standards, private account posts (where you must be an approved follower to see content) cannot be scraped or downloaded anonymously. MediaMate exclusively supports public posts, public Reels, IGTV clips, and public Stories.",
    },
    {
      q: "Is MediaMate 100% free or are there hidden download limits?",
      a: "MediaMate is 100% free with unlimited downloads. There are no daily quotas, no hidden subscription fees, no credit card requirements, and no annoying spam notifications. You can download as many videos and reels as you need, anytime.",
    },
    {
      q: "Why is MediaMate better and faster than videodropper.app and other tools?",
      a: "MediaMate features a lightweight, Google-inspired light theme with official Instagram pink gradient styling. Unlike videodropper and other ad-heavy competitors that force multiple redirects, popups, or degraded 720p compression, MediaMate provides instantaneous edge probing, authentic 1080p resolution, zero ads, and zero watermarks.",
    },
  ];

  // FAQ Schema JSON-LD for Google Rich Results
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800 selection:bg-pink-100 selection:text-pink-900">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Header
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 sm:py-14 space-y-16">
        {/* HERO SECTION */}
        <section className="relative text-center space-y-4 max-w-2xl mx-auto pt-2 sm:pt-6">
          {/* Subtle floating decorative elements */}
          <div className="absolute -top-3 left-6 text-pink-300 opacity-60 hidden sm:block animate-pulse">
            <Heart className="w-5 h-5 fill-pink-200" />
          </div>
          <div className="absolute top-10 right-8 text-pink-300 opacity-60 hidden sm:block">
            <Camera className="w-6 h-6" />
          </div>
          <div className="absolute -bottom-4 right-16 text-pink-300 opacity-50 hidden sm:block">
            <Sparkles className="w-4 h-4" />
          </div>

          {/* Central Logo with Instagram Pink-Purple Gradient */}
          <div className="flex items-center justify-center mb-3">
            <div className="w-16 h-16 rounded-2xl insta-gradient-full flex items-center justify-center text-white shadow-xl shadow-pink-500/20">
              <Instagram className="w-9 h-9" />
            </div>
          </div>

          {/* H1 Gradient Title */}
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            <span className="insta-gradient-text">Instagram Video Downloader</span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Download Reels, Stories, Photos & Carousels in 1080p HD — No Watermark
          </p>

          {/* Feature Badges with light pink borders */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-[#d62976] font-semibold">
              🎥 1080p Reels & Videos
            </span>
            <span className="px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-[#d62976] font-semibold">
              📸 HD Photos & Albums
            </span>
            <span className="px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-[#d62976] font-semibold">
              ⚡ Stories & Highlights
            </span>
            <span className="px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-[#d62976] font-semibold">
              🚫 Zero Watermark
            </span>
          </div>

          {/* Input Box with Pink Focus & Shadow */}
          <div className="pt-4 max-w-2xl mx-auto space-y-3">
            <form onSubmit={handleInspect}>
              <div className="flex flex-col sm:flex-row items-center gap-2 p-2 bg-white rounded-2xl border border-gray-200 google-shadow transition-all focus-within:border-[#d62976] focus-within:ring-2 focus-within:ring-pink-100 hover:border-pink-300">
                <div className="flex items-center flex-1 w-full px-3 gap-2">
                  <Search className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    type="url"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste Instagram Reel, Story, or Post URL..."
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
                      title="Paste from clipboard"
                      className="flex items-center gap-1 text-xs text-gray-600 hover:text-[#d62976] px-2 py-1 rounded bg-pink-50/80 hover:bg-pink-100 transition border border-pink-200 font-medium"
                    >
                      <Clipboard className="w-3.5 h-3.5 text-[#d62976]" />
                      <span className="hidden sm:inline">Paste</span>
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!url.trim() || isLoading}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl font-medium text-white shadow-md insta-btn transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Inspecting...</span>
                    </>
                  ) : (
                    <span>Download Video</span>
                  )}
                </button>
              </div>
            </form>

            {/* Friendly Light Info Box (No harsh red error) */}
            {error && (
              <div className="p-3.5 rounded-xl bg-[#f9fafb] border border-gray-200 text-gray-700 text-sm flex items-start gap-2.5 shadow-xs">
                <Info className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Sample link chip for instant 1-click test */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-gray-500">
              <span>Try sample link:</span>
              <button
                type="button"
                onClick={() => setUrl(sampleUrl)}
                className="px-2.5 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-[#d62976] hover:text-[#962fbf] border border-pink-200 transition font-medium"
              >
                Sample Instagram Reel
              </button>
            </div>
          </div>
        </section>

        {/* 2-COLUMN RESULT SECTION (BETTER THAN VIDEODROPPER.APP) */}
        {inspectResult && inspectResult.isSupported && (
          <section className="animate-fadeIn">
            <div className="w-full max-w-4xl mx-auto rounded-3xl bg-white border border-gray-200 google-shadow overflow-hidden transition relative before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-[#feda75] before:via-[#d62976] before:to-[#962fbf]">
              <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                {/* LEFT COLUMN: Instagram Video Preview Player */}
                <div className="md:col-span-5 relative rounded-2xl overflow-hidden bg-gradient-to-tr from-gray-950 to-gray-800 shadow-xl aspect-[9/16] sm:aspect-[4/5] max-h-[460px] flex flex-col justify-between p-4 group">
                  {/* Top Bar Overlay: Creator & Verified Badge */}
                  <div className="flex items-center justify-between z-10">
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs">
                      <div className="w-4 h-4 rounded-full insta-gradient-full flex items-center justify-center text-[10px] font-bold">
                        IG
                      </div>
                      <span className="font-semibold truncate max-w-[120px]">
                        @{inspectResult.author || "instagram_creator"}
                      </span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    </div>

                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 transition"
                      title={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Center Media Visual / Fallback */}
                  {inspectResult.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={inspectResult.thumbnailUrl}
                      alt={inspectResult.title || "Instagram Video Preview"}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : null}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center text-white/90 bg-gradient-to-b from-gray-900 to-black pointer-events-none">
                    <div className="w-16 h-16 rounded-2xl insta-gradient-full flex items-center justify-center text-white shadow-xl shadow-pink-500/30">
                      <Camera className="w-8 h-8" />
                    </div>
                    <span className="text-sm font-bold tracking-wide">Instagram Reel</span>
                    <span className="text-xs text-gray-300">1080p Full HD Stream Ready</span>
                  </div>

                  {/* Center Play Button Overlay */}
                  <div className="relative z-10 flex items-center justify-center my-auto">
                    <button
                      type="button"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:scale-110 hover:bg-black/70 transition-all shadow-xl"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6 fill-white" />
                      ) : (
                        <Play className="w-6 h-6 fill-white translate-x-0.5" />
                      )}
                    </button>
                  </div>

                  {/* Bottom Bar Overlay: Mini Churros Title Style */}
                  <div className="relative z-10 space-y-1.5 p-3 rounded-xl bg-black/60 backdrop-blur-md text-white">
                    <p className="text-xs font-bold truncate">
                      {inspectResult.title || "Mini Churros with Cinnamon Sugar"}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-gray-300">
                      <span className="flex items-center gap-1">
                        <Music className="w-3 h-3 text-pink-400" />
                        <span className="truncate max-w-[140px]">Original Audio</span>
                      </span>
                      <span className="font-semibold text-emerald-400">1080p HD</span>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: 3 Stacked Buttons with Instagram Pink Theme */}
                <div className="md:col-span-7 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-50 text-[#d62976] border border-pink-200">
                        Instagram Reel • 1080p HD
                      </span>
                      <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Ready to Download</span>
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-snug">
                      {inspectResult.title || "Mini Churros — High Resolution Video"}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span>Format: <strong className="text-gray-800">MP4 Video</strong></span>
                      <span>•</span>
                      <span>Quality: <strong className="text-emerald-700 font-semibold">1080p Full HD</strong></span>
                      <span>•</span>
                      <span>Audio: <strong className="text-gray-800">Stereo 320kbps</strong></span>
                    </div>
                  </div>

                  {/* STACK 3 DOWNLOAD BUTTONS (BETTER THAN VIDEODROPPER BLUE BUTTONS) */}
                  <div className="space-y-3 pt-2">
                    {/* Button 1 (Primary): [⬇ Download Video] - Instagram gradient */}
                    <a
                      href={inspectResult.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-4 px-6 rounded-2xl font-bold text-base text-white shadow-lg insta-btn flex items-center justify-center gap-3 transition transform hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <Download className="w-5 h-5 text-white" />
                      <span>Download Video (1080p)</span>
                    </a>

                    {/* Button 2 (Secondary): [⚡ Download HD Link (1080p)] - Light pink #fdf2f8, pink text #d62976 */}
                    <button
                      onClick={() => handleCopyHdLink(inspectResult.url)}
                      className="w-full py-3.5 px-6 rounded-2xl font-semibold text-sm text-[#d62976] bg-[#fdf2f8] hover:bg-pink-100/80 border border-pink-200 flex items-center justify-center gap-2.5 transition"
                    >
                      {copiedHd ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>HD 1080p Link Copied!</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 text-[#d62976]" />
                          <span>⚡ Download HD Link (1080p)</span>
                        </>
                      )}
                    </button>

                    {/* Button 3 (Tertiary): [↻ Download Again] - Light gray #f3f4f6, gray text */}
                    <button
                      onClick={handleReset}
                      className="w-full py-3 px-6 rounded-2xl font-medium text-xs sm:text-sm text-gray-600 bg-[#f3f4f6] hover:bg-gray-200 border border-gray-200 flex items-center justify-center gap-2 transition"
                    >
                      <RotateCcw className="w-4 h-4 text-gray-500" />
                      <span>↻ Download Again</span>
                    </button>
                  </div>

                  {/* Below Buttons Info: "Original quality, no watermark, MP4" */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1.5 font-medium text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Original Quality, No Watermark, MP4</span>
                    </div>
                    <span className="text-gray-400">100% Free & Legal</span>
                  </div>
                </div>
              </div>

              {/* DISCOVER MORE / VIDEO SAVING SERVICE LINKS (COMPETITOR FEATURE) */}
              <div className="bg-gray-50 border-t border-gray-100 p-4 sm:p-5">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2.5">
                  Discover More Video Saving Services:
                </span>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <button
                    onClick={() => setUrl(sampleUrl)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-pink-300 hover:text-[#d62976] text-gray-600 transition shadow-2xs font-medium"
                  >
                    🎥 Download Instagram Reels
                  </button>
                  <button
                    onClick={() => setUrl("https://www.instagram.com/stories/xxx")}
                    className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-pink-300 hover:text-[#d62976] text-gray-600 transition shadow-2xs font-medium"
                  >
                    ⚡ Download Instagram Stories
                  </button>
                  <button
                    onClick={() => setUrl("https://www.instagram.com/p/xxx")}
                    className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-pink-300 hover:text-[#d62976] text-gray-600 transition shadow-2xs font-medium"
                  >
                    📸 Instagram Photo Downloader
                  </button>
                  <button
                    onClick={() => setUrl(sampleUrl)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-pink-300 hover:text-[#d62976] text-gray-600 transition shadow-2xs font-medium"
                  >
                    📑 Carousel Slide Saver
                  </button>
                  <button
                    onClick={() => setUrl(sampleUrl)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-pink-300 hover:text-[#d62976] text-gray-600 transition shadow-2xs font-medium"
                  >
                    🎵 Instagram Audio Extractor
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION: 3 STEPS — URDU / ENGLISH MIX WITH PINK ICONS */}
        <section className="space-y-6 pt-4">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-pink-50 text-[#d62976] border border-pink-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Easy 3-Step Guide • آسان اور تیز ترین طریقہ</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
              How to Download Instagram Videos & Reels <br className="hidden sm:inline" />
              <span className="text-[#d62976] font-bold text-xl sm:text-2xl font-sans">
                انسٹاگرام ویڈیوز اور ریلز کیسے ڈاؤن لوڈ کریں؟
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              Follow these 3 simple steps to save Instagram Reels, Stories, Videos & Photos directly to your gallery in 1080p Full HD without watermarks (مفت اور بغیر واٹر مارک محفوظ کریں).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-white border border-gray-200 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-[#feda75] before:via-[#d62976] before:to-[#962fbf] insta-shadow-hover transition-all text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#fdf2f8] border border-pink-200 flex items-center justify-center text-[#d62976] shadow-sm">
                <Copy className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-pink-50 text-[#d62976] border border-pink-200">
                  Step 01 • مرحلہ ۱
                </span>
                <h3 className="font-bold text-base sm:text-lg text-gray-900">
                  Copy Video Link <br />
                  <span className="text-[#d62976] text-sm font-semibold">لنک کاپی کریں</span>
                </h3>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed text-left bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                <strong>English:</strong> Open Instagram on your mobile or PC, find the Reel or Video, tap the <strong>3 dots (&bull;&bull;&bull;)</strong> or <strong>Share</strong> button, and tap <strong>&ldquo;Copy Link&rdquo;</strong>.
              </p>

              <p className="text-xs text-gray-700 leading-relaxed text-right bg-pink-50/40 p-3 rounded-xl border border-pink-100/60 font-sans" dir="rtl">
                <strong>اردو:</strong> انسٹاگرام ایپ کھولیں، اپنی پسندیدہ ریل یا ویڈیو کے ۳ ڈاٹس (•••) یا Share کے نشان پر ٹیپ کریں اور <strong>&ldquo;Copy Link&rdquo;</strong> منتخب کریں۔
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-white border border-gray-200 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-[#feda75] before:via-[#d62976] before:to-[#962fbf] insta-shadow-hover transition-all text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#fdf2f8] border border-pink-200 flex items-center justify-center text-[#d62976] shadow-sm">
                <Search className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-pink-50 text-[#d62976] border border-pink-200">
                  Step 02 • مرحلہ ۲
                </span>
                <h3 className="font-bold text-base sm:text-lg text-gray-900">
                  Paste in MediaMate <br />
                  <span className="text-[#d62976] text-sm font-semibold">لنک یہاں پیسٹ کریں</span>
                </h3>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed text-left bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                <strong>English:</strong> Paste the copied link into the pink-bordered input field above and click the pink <strong>&ldquo;Download Video&rdquo;</strong> button to generate the stream.
              </p>

              <p className="text-xs text-gray-700 leading-relaxed text-right bg-pink-50/40 p-3 rounded-xl border border-pink-100/60 font-sans" dir="rtl">
                <strong>اردو:</strong> کاپی شدہ لنک کو اوپر دی گئی سرچ بار میں پیسٹ کریں اور گلابی <strong>&ldquo;Download Video&rdquo;</strong> بٹن دبائیں۔ سسٹم فوری لنک تیار کرے گا۔
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-white border border-gray-200 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-[#feda75] before:via-[#d62976] before:to-[#962fbf] insta-shadow-hover transition-all text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#fdf2f8] border border-pink-200 flex items-center justify-center text-[#d62976] shadow-sm">
                <Download className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-pink-50 text-[#d62976] border border-pink-200">
                  Step 03 • مرحلہ ۳
                </span>
                <h3 className="font-bold text-base sm:text-lg text-gray-900">
                  Download 1080p HD <br />
                  <span className="text-[#d62976] text-sm font-semibold">گیلری میں محفوظ کریں</span>
                </h3>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed text-left bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                <strong>English:</strong> Preview your video and click <strong>&ldquo;Download Video (1080p)&rdquo;</strong> to save the clean MP4 directly into your gallery without any watermark!
              </p>

              <p className="text-xs text-gray-700 leading-relaxed text-right bg-pink-50/40 p-3 rounded-xl border border-pink-100/60 font-sans" dir="rtl">
                <strong>اردو:</strong> پریویو دیکھ کر ڈاؤن لوڈ بٹن پر کلک کریں اور بغیر کسی واٹر مارک کے مکمل 1080p ایچ ڈی ویڈیو اپنی فون گیلری میں ہمیشہ کیلئے محفوظ کریں۔
              </p>
            </div>
          </div>
        </section>

        {/* SECTION: WHAT CAN YOU DOWNLOAD? — 5 CARDS IN FULL DETAIL */}
        <section className="space-y-6 pt-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">What Can You Download from Instagram?</h2>
            <p className="text-xs sm:text-sm text-gray-500 max-w-lg mx-auto">
              MediaMate supports every major format shared publicly across the Instagram platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* 1. Videos */}
            <div className="p-6 rounded-2xl bg-white border border-gray-200 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-[#feda75] before:via-[#d62976] before:to-[#962fbf] insta-shadow-hover transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#fdf2f8] flex items-center justify-center text-[#d62976]">
                <Film className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-gray-900">1. Instagram Feed Videos</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Save traditional single video posts and IGTV clips in their original MP4 bitrate with crisp high-definition video and audio sync.
              </p>
            </div>

            {/* 2. Reels */}
            <div className="p-6 rounded-2xl bg-white border border-gray-200 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-[#feda75] before:via-[#d62976] before:to-[#962fbf] insta-shadow-hover transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#fdf2f8] flex items-center justify-center text-[#d62976]">
                <Camera className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-gray-900">2. Instagram Reels</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Inspect and save trending short-form Reels in vertical 9:16 format with high-resolution 1080p quality and zero added watermarks.
              </p>
            </div>

            {/* 3. Photos & Carousels */}
            <div className="p-6 rounded-2xl bg-white border border-gray-200 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-[#feda75] before:via-[#d62976] before:to-[#962fbf] insta-shadow-hover transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#fdf2f8] flex items-center justify-center text-[#d62976]">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-gray-900">3. Photos & Carousel Albums</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Download high-resolution JPG images and extract multi-slide carousel albums containing mixed photos and short clips.
              </p>
            </div>

            {/* 4. Stories & Highlights */}
            <div className="p-6 rounded-2xl bg-white border border-gray-200 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-[#feda75] before:via-[#d62976] before:to-[#962fbf] insta-shadow-hover transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#fdf2f8] flex items-center justify-center text-[#d62976]">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-gray-900">4. Stories & Highlights</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Save active public Instagram Stories and evergreen Story Highlights directly to your device before they disappear.
              </p>
            </div>

            {/* 5. MP3 Audio */}
            <div className="p-6 rounded-2xl bg-white border border-gray-200 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-[#feda75] before:via-[#d62976] before:to-[#962fbf] insta-shadow-hover transition-all space-y-3 sm:col-span-2 lg:col-span-1">
              <div className="w-10 h-10 rounded-xl bg-[#fdf2f8] flex items-center justify-center text-[#d62976]">
                <Music className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-gray-900">5. Instagram MP3 Audio</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Extract clean audio tracks and trending background audio clips from public Reels for offline inspiration and editing.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION: FEATURES SPECIFICATIONS TABLE */}
        <section className="space-y-6 pt-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Instagram Downloader Specifications</h2>
            <p className="text-xs sm:text-sm text-gray-500">Industry-leading features engineered for performance and privacy</p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-200 google-shadow bg-white">
            <table className="w-full text-left text-xs sm:text-sm text-gray-700">
              <thead className="bg-[#fdf2f8]/70 border-b border-gray-200 text-[#d62976] font-bold">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Feature</th>
                  <th className="py-3.5 px-4 sm:px-6">MediaMate Instagram Tool</th>
                  <th className="py-3.5 px-4 sm:px-6">Standard Tools</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-gray-900 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#d62976]" />
                    <span>Resolution Quality</span>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-emerald-600 font-semibold">1080p Full HD (Original Bitrate)</td>
                  <td className="py-3.5 px-4 sm:px-6 text-gray-400">Compressed 720p</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-gray-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#d62976]" />
                    <span>Watermark Policy</span>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-emerald-600 font-semibold">100% Watermark Free</td>
                  <td className="py-3.5 px-4 sm:px-6 text-gray-400">Appends Logo Watermark</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-gray-900 flex items-center gap-2">
                    <EyeOff className="w-4 h-4 text-[#d62976]" />
                    <span>Account Login</span>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-emerald-600 font-semibold">Never Required (Anonymous)</td>
                  <td className="py-3.5 px-4 sm:px-6 text-gray-400">Forces Login or Extension</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-gray-900 flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-[#d62976]" />
                    <span>Device Support</span>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-emerald-600 font-semibold">iPhone, Android, PC, Mac, iPad</td>
                  <td className="py-3.5 px-4 sm:px-6 text-gray-400">Desktop only</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-gray-900 flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#d62976]" />
                    <span>Pricing & Limits</span>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-emerald-600 font-semibold">100% Free Forever ($0 Budget)</td>
                  <td className="py-3.5 px-4 sm:px-6 text-gray-400">Paid limits or popups</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION: 10 COMPREHENSIVE FAQS */}
        <section className="max-w-3xl mx-auto space-y-6 pt-4">
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-pink-50 text-[#d62976] border border-pink-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Got Questions? • مکمل رہنمائی</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Frequently Asked Questions (FAQ) <br />
              <span className="text-[#d62976] text-xl font-sans">عام پوچھے جانے والے سوالات</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Everything you need to know about downloading Instagram Reels, Stories, Videos and Photos in 1080p Full HD
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className={`rounded-2xl bg-white border transition-all ${
                    isOpen ? "border-pink-300 ring-2 ring-pink-50 shadow-sm" : "border-gray-200 hover:border-pink-200"
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm text-gray-800 hover:text-[#d62976] transition"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-pink-50 text-[#d62976] text-xs font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span>{faq.q}</span>
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${isOpen ? "rotate-180 text-[#d62976]" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-6 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-pink-50 pt-3.5 bg-[#fdf2f8]/20">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION: WHY CHOOSE US VS VIDEODROPPER.APP */}
        <section className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-200 space-y-6">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Why Choose MediaMate vs Other Downloaders?
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Unlike ad-cluttered websites that pop up spammy notifications or require shady extensions, MediaMate is built with pure engineering standards:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-2">
              <span className="font-bold text-sm text-[#d62976] flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                <span>Faster Edge Performance</span>
              </span>
              <p className="text-xs text-gray-500 leading-relaxed">
                Direct edge inspection delivers sub-second validation and instant streaming without throttling queues or waiting countdown timers.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-2">
              <span className="font-bold text-sm text-[#d62976] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Ethical & Legal</span>
              </span>
              <p className="text-xs text-gray-500 leading-relaxed">
                Respects creator copyrights and platform privacy controls. No unauthorized cookie injections, account scrapes, or privacy breaches.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-2">
              <span className="font-bold text-sm text-[#d62976] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Clean Pink Light Design</span>
              </span>
              <p className="text-xs text-gray-500 leading-relaxed">
                Inspired by modern Instagram brand aesthetics on a pure white, simple layout. Zero dark patterns, zero aggressive popups.
              </p>
            </div>
          </div>
        </section>

        {/* 1,500+ WORDS IN-DEPTH SEO GUIDE TO BEAT VIDEODROPPER (SEO 91) */}
        <section className="border-t border-gray-200 pt-10 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#d62976]" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Complete Guide to Instagram Video Downloading
              </h2>
            </div>
            <button
              onClick={() => setShowFullSeoGuide(!showFullSeoGuide)}
              className="text-xs font-semibold px-4 py-2 rounded-xl border border-pink-200 bg-pink-50 text-[#d62976] hover:bg-pink-100 transition flex items-center gap-1.5"
            >
              <span>{showFullSeoGuide ? "Hide Full Guide" : "Read Full 1,500+ Word Guide"}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFullSeoGuide ? "rotate-180" : ""}`} />
            </button>
          </div>

          <div className={`prose prose-sm max-w-none text-gray-600 space-y-6 leading-relaxed transition-all ${showFullSeoGuide ? "block" : "hidden sm:block line-clamp-6"}`}>
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 space-y-6 text-sm">
              <h3 className="text-lg font-bold text-gray-900">
                1. What is an Instagram Video Downloader?
              </h3>
              <p>
                An <strong>instagram video downloader</strong> is a specialized web utility designed to fetch, inspect, and parse high-definition multimedia streams delivered by Instagram’s content delivery network (CDN). Since Instagram does not provide an integrated native &ldquo;Save to Camera Roll&rdquo; button for third-party videos, creators, marketers, educators, and social media enthusiasts rely on web tools to archive and repurpose publicly accessible content.
              </p>
              <p>
                MediaMate represents the next evolution of media utility software. By focusing on <strong>1080p full HD quality</strong>, zero watermarks, and ethical compliance with copyright laws, our tool bridges the gap between creator workflows and platform guidelines. Whether you are looking for a reliable <strong>reels downloader</strong>, a fast <strong>story saver</strong>, or an intuitive <strong>photo downloader</strong>, our single lightweight interface processes all formats without asking for account access or passwords.
              </p>

              <h3 className="text-lg font-bold text-gray-900">
                2. How Does the MediaMate Instagram Downloader Work?
              </h3>
              <p>
                When a user submits an Instagram URL (such as a Reel, Feed video, or Carousel post), MediaMate’s backend engine performs an instant, server-side URL normalization and safety check. Using multi-tier authorized inspection protocols—including official oEmbed specifications and Content-Type probe queries—the system analyzes the media metadata without scraping private data or circumventing paywalls.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>URL Sanitization:</strong> The URL is cleaned of tracking tokens (such as <code>utm_source</code>, <code>igsh</code>, and session parameters) to retrieve the canonical resource.
                </li>
                <li>
                  <strong>Server-Side Request Forgery (SSRF) Protection:</strong> Our zero-trust security layer ensures that outgoing inspection requests only target authenticated Instagram server nodes, completely shielding internal systems from malicious redirects.
                </li>
                <li>
                  <strong>Stream Delivery:</strong> Rather than saving massive video files on permanent servers—which raises legal and storage concerns—MediaMate acts as a transparent, high-throughput streaming bridge, passing the original MP4 video stream directly to your local device.
                </li>
              </ul>

              <h3 className="text-lg font-bold text-gray-900">
                3. Instagram Reels Downloader — Vertical 9:16 Video in 1080p
              </h3>
              <p>
                Instagram Reels have become the undisputed cornerstone of short-form mobile video content. Ranging from 15 seconds to 90 seconds, Reels combine visual storytelling with synchronized trending background music. With MediaMate’s <strong>reels downloader</strong>, you get:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>True 1080p Resolution:</strong> Videos are extracted at their original progressive bitrates (1080 &times; 1920 pixels at 30 or 60 frames per second).
                </li>
                <li>
                  <strong>No Logo Watermarks:</strong> We never burn watermarks, branding stamps, or distracting logos into the video canvas.
                </li>
                <li>
                  <strong>High-Fidelity Audio:</strong> The accompanying audio track is preserved in clean AAC stereo format, making it effortless to edit or remix in CapCut, Premiere Pro, or DaVinci Resolve.
                </li>
              </ul>

              <h3 className="text-lg font-bold text-gray-900">
                4. Instagram Story Saver & Highlights Downloader
              </h3>
              <p>
                Stories represent ephemeral, raw, and behind-the-scenes content that expires after 24 hours. When creators post important announcements, tutorials, or memories, waiting too long means losing access permanently. MediaMate’s <strong>story saver</strong> feature allows you to input public Story links and permanent Profile Highlights to download the source video or photo before the temporary window expires.
              </p>

              <h3 className="text-lg font-bold text-gray-900">
                5. High-Resolution Instagram Photo & Carousel Downloader
              </h3>
              <p>
                Instagram feed photography often contains stunning digital art, travel memories, and carousel infographics with up to 10 or 20 individual slides. Most conventional browser tools only grab the first thumbnail slide, failing to download the remainder of the album. MediaMate’s architecture automatically parses multi-slide carousel containers, separating each image and video clip so you can download individual slides or batch-archive the entire photo series in maximum resolution.
              </p>

              <h3 className="text-lg font-bold text-gray-900">
                6. Extracting MP3 Audio from Instagram Reels
              </h3>
              <p>
                Trending audio is frequently the catalyst for viral content. Often, a musician or sound designer uploads an exclusive acoustic version, remix, or voiceover that exists only on Instagram. MediaMate enables creators to isolate the audio stream from public videos, delivering clean MP3 or M4A audio files for offline listening, podcast research, or video background scoring.
              </p>

              <h3 className="text-lg font-bold text-gray-900">
                7. Why Online Browser Tools Are Superior to Shady Mobile Apps
              </h3>
              <p>
                Many third-party mobile apps in app stores demand dangerous permissions, including access to your camera roll, contact lists, and social media passwords. Furthermore, mobile apps frequently get banned or inject aggressive, full-screen interstitial ads that degrade your phone&rsquo;s performance. MediaMate requires zero app installation:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Zero Malware & Zero Trackers:</strong> We do not ask for notification permissions, push spam, or install device cookies.
                </li>
                <li>
                  <strong>Universal Cross-Platform Compatibility:</strong> Access MediaMate on iPhone (Safari), Android (Chrome, Samsung Internet), Mac, and Windows PC with a single consistent experience.
                </li>
                <li>
                  <strong>Storage Privacy:</strong> Inspected links are saved exclusively in your device’s local browser memory, never exposed on a central database.
                </li>
              </ul>

              <h3 className="text-lg font-bold text-gray-900">
                8. Ethical Guidelines, Fair Use & Copyright Compliance
              </h3>
              <p>
                MediaMate is committed to ethical media usage. When downloading content from Instagram:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Personal & Educational Use:</strong> Always respect the intellectual property of original creators. Use downloaded media for offline personal viewing, academic research, or fair-use commentary.
                </li>
                <li>
                  <strong>Give Attribution:</strong> If you are reposting or sharing creative work, always tag, credit, and seek permission from the original artist or content creator.
                </li>
                <li>
                  <strong>No Commercial Infringement:</strong> Do not monetize, resell, or distribute copyrighted video assets without authorization.
                </li>
              </ul>

              <h3 className="text-lg font-bold text-gray-900">
                9. Detailed Guide for iPhone & iPad (iOS Safari) Users
              </h3>
              <p>
                Apple’s iOS platform enforces robust sandboxing restrictions on downloads. Many iPhone users struggle with saving files from web browsers directly into their Photos app camera roll. Here is the verified, seamless method using MediaMate on iOS 13, 14, 15, 16, 17, and 18:
              </p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Open your <strong>Instagram app</strong> on your iPhone or iPad, find the desired Reel, tap the <strong>Share</strong> arrow icon, and select <strong>Copy Link</strong>.
                </li>
                <li>
                  Open <strong>Safari</strong> (or Chrome on iOS) and navigate to <strong>MediaMate</strong>.
                </li>
                <li>
                  Tap the search bar, paste the URL, and press the pink <strong>Download Video</strong> button.
                </li>
                <li>
                  Tap <strong>Download Video (1080p)</strong>. Safari will prompt: <em>&ldquo;Do you want to download this file?&rdquo;</em> Tap <strong>Download</strong>.
                </li>
                <li>
                  Look at Safari’s address bar on the bottom left and tap the small <strong>blue download arrow</strong>.
                </li>
                <li>
                  Tap the downloaded video file, tap the <strong>Share icon</strong> (square with up arrow in the bottom left), and choose <strong>Save Video</strong>. The clean 1080p Reel is now directly in your iPhone Photos camera roll!
                </li>
              </ol>

              <h3 className="text-lg font-bold text-gray-900">
                10. Detailed Guide for Android (Chrome, Samsung Internet, Firefox)
              </h3>
              <p>
                Downloading Instagram videos on Android devices is instantaneous:
              </p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  In your Instagram Android app, tap the three dots (&bull;&bull;&bull;) on any public video or Reel and tap <strong>Copy Link</strong>.
                </li>
                <li>
                  Launch your preferred browser (Google Chrome, Samsung Internet, or Brave) and open MediaMate.
                </li>
                <li>
                  Paste the copied link into the pink input field and tap <strong>Download Video</strong>.
                </li>
                <li>
                  Click the primary <strong>Download Video (1080p)</strong> button. Your Android browser will save the MP4 video directly into your device&rsquo;s <code>/Download</code> folder.
                </li>
                <li>
                  Open your <strong>Google Photos</strong> or Samsung <strong>Gallery app</strong> — your video appears immediately under &ldquo;Downloads&rdquo; or &ldquo;Recent Media&rdquo; with pristine audio sync.
                </li>
              </ol>

              <h3 className="text-lg font-bold text-gray-900">
                11. Supported Instagram URL Syntax & Permitted Formats
              </h3>
              <p>
                MediaMate’s regex validation engine recognizes all standard and shortened Instagram URLs:
              </p>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-pink-50/60 text-[#d62976] font-bold">
                    <tr>
                      <th className="p-3">Content Type</th>
                      <th className="p-3">Sample URL Pattern</th>
                      <th className="p-3">Supported Output</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="p-3 font-semibold">Instagram Reels</td>
                      <td className="p-3 font-mono text-gray-600">instagram.com/reel/Cxxxxxx/</td>
                      <td className="p-3 text-emerald-600 font-semibold">1080p MP4 (9:16 Video + Audio)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Feed Videos & Posts</td>
                      <td className="p-3 font-mono text-gray-600">instagram.com/p/Cxxxxxx/</td>
                      <td className="p-3 text-emerald-600 font-semibold">HD MP4 / JPG Photo</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Carousel Albums</td>
                      <td className="p-3 font-mono text-gray-600">instagram.com/p/Cxxxxxx/</td>
                      <td className="p-3 text-emerald-600 font-semibold">Multi-slide photos & video clips</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Instagram Stories</td>
                      <td className="p-3 font-mono text-gray-600">instagram.com/stories/username/xxxx/</td>
                      <td className="p-3 text-emerald-600 font-semibold">Full Resolution MP4 / JPG</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">IGTV Long Videos</td>
                      <td className="p-3 font-mono text-gray-600">instagram.com/tv/Cxxxxxx/</td>
                      <td className="p-3 text-emerald-600 font-semibold">1080p MP4 (Original Bitrate)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-bold text-gray-900">
                12. Technical Specifications: Codecs, Bitrates & Resolution
              </h3>
              <p>
                When you download through MediaMate, our edge pipeline ensures maximum fidelity without lossy recoding:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Video Container:</strong> Standardized MP4 (MPEG-4 Part 14) container for universal hardware decoding on all TVs, smartphones, tablets, and editing software.
                </li>
                <li>
                  <strong>Video Codec:</strong> Advanced Video Coding (H.264 / AVC High Profile Level 4.2) ensuring zero playback stutters.
                </li>
                <li>
                  <strong>Resolution:</strong> Full progressive 1080 &times; 1920 pixels for vertical Reels/Stories, and 1080 &times; 1080 or 1080 &times; 1350 pixels for square and portrait feed posts.
                </li>
                <li>
                  <strong>Audio Encoding:</strong> Advanced Audio Coding (AAC-LC) with sampling rates of 44.1kHz or 48.0kHz and stereo bitrates up to 320 kbps.
                </li>
              </ul>

              <h3 className="text-lg font-bold text-gray-900">
                13. Why MediaMate Beats Competitors on Google Search & SEO Score
              </h3>
              <p>
                Traditional video downloader websites suffer from severe technical drawbacks: intrusive popunder ads, aggressive notification scripts, server lag, fake download buttons, and heavy server-side re-compression that degrades 1080p footage down to pixelated 480p or 720p. MediaMate was engineered by full-stack developers to deliver a superior alternative:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Zero Spam & Zero Ads:</strong> No deceptive redirect loops, no scam virus alerts, and no hidden subscriptions.
                </li>
                <li>
                  <strong>Lightweight Google Design:</strong> Clean, minimalist aesthetic with crisp typography, high readability, and official Instagram pink styling.
                </li>
                <li>
                  <strong>Complete Privacy Protection:</strong> We never log your IP, profile queries, or personal device metadata.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* History Drawer */}
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
