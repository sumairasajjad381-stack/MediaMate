import React from "react";
import Link from "next/link";
import { ArrowLeft, FileCheck } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-navy-950 text-gray-200 py-12 px-4 sm:px-6 max-w-4xl mx-auto space-y-8">
      <Link href="/" className="inline-flex items-center gap-2 text-xs text-brand-sky hover:underline">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to MediaMate</span>
      </Link>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400">
          <FileCheck className="w-3.5 h-3.5" />
          <span>Terms & Authorized Usage</span>
        </div>
        <h1 className="text-3xl font-bold text-white">Terms of Use</h1>
        <p className="text-xs text-gray-400">Last updated: October 2026</p>
      </div>

      <div className="space-y-6 text-sm text-gray-300 leading-relaxed glow-card p-6 rounded-2xl border border-navy-800">
        <section className="space-y-2">
          <h2 className="text-base font-semibold text-white">1. Permitted and Authorized Use Only</h2>
          <p>
            MediaMate is an educational and utility toolkit. Users may only inspect and download media assets they have the right or explicit permission to access.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-white">2. Respect for Platform Guidelines & DRM</h2>
          <p>
            MediaMate strictly abides by platform developer guidelines. We do not bypass paywalls, DRM protection, or private account restrictions. Where direct stream downloading is restricted (such as on YouTube or TikTok), MediaMate provides authorized embeds and thumbnail previews instead.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-white">3. Disclaimer of Warranties</h2>
          <p>
            MediaMate is provided on an &quot;as-is&quot; basis on free-tier infrastructure. We make no guarantees that all third-party URLs will remain accessible if third-party platforms modify their public endpoints.
          </p>
        </section>
      </div>
    </div>
  );
}
