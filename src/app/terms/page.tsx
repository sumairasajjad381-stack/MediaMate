import React from "react";
import Link from "next/link";
import { ArrowLeft, FileCheck } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 py-12 px-4 sm:px-6 max-w-3xl mx-auto space-y-8">
      <Link href="/" className="inline-flex items-center gap-2 text-xs text-blue-600 hover:underline">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to MediaMate</span>
      </Link>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-emerald-700">
          <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Terms & Authorized Usage</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Terms of Use</h1>
        <p className="text-xs text-gray-500">Last updated: October 2026</p>
      </div>

      <div className="space-y-6 text-sm text-gray-600 leading-relaxed bg-gray-50 p-6 rounded-2xl border border-gray-200">
        <section className="space-y-2">
          <h2 className="text-base font-semibold text-gray-900">1. Permitted and Authorized Use Only</h2>
          <p>
            MediaMate is an educational and utility toolkit. Users may only inspect and download media assets they have the right or explicit permission to access.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-gray-900">2. Respect for Platform Guidelines & DRM</h2>
          <p>
            MediaMate strictly abides by platform developer guidelines. We do not bypass paywalls, DRM protection, or private account restrictions. Where direct stream downloading is restricted (such as on YouTube or TikTok), MediaMate provides authorized embeds and thumbnail previews instead.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-gray-900">3. Disclaimer of Warranties</h2>
          <p>
            MediaMate is provided on an &quot;as-is&quot; basis on free-tier infrastructure. We make no guarantees that all third-party URLs will remain accessible if third-party platforms modify their public endpoints.
          </p>
        </section>
      </div>
    </div>
  );
}
