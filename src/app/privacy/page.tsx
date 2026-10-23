import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-navy-950 text-gray-200 py-12 px-4 sm:px-6 max-w-4xl mx-auto space-y-8">
      <Link href="/" className="inline-flex items-center gap-2 text-xs text-brand-sky hover:underline">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to MediaMate</span>
      </Link>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/30 text-xs text-brand-sky">
          <Shield className="w-3.5 h-3.5" />
          <span>Privacy & Data Protection</span>
        </div>
        <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
        <p className="text-xs text-gray-400">Last updated: October 2026</p>
      </div>

      <div className="space-y-6 text-sm text-gray-300 leading-relaxed glow-card p-6 rounded-2xl border border-navy-800">
        <section className="space-y-2">
          <h2 className="text-base font-semibold text-white">1. $0 Budget Zero-Storage Guarantee</h2>
          <p>
            MediaMate does not store your inspected URLs, personal queries, or media files on server databases.
            All link histories are stored exclusively in your local web browser’s <code>localStorage</code>. You can purge this at any time with a single click.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-white">2. No Account or Credentials Needed</h2>
          <p>
            MediaMate never asks for your passwords, session cookies, or personal access tokens from third-party social media platforms.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-white">3. Third-Party Platform oEmbed Calls</h2>
          <p>
            When you inspect a link, our server queries the public oEmbed endpoint of the respective platform (e.g., YouTube or TikTok). These queries contain only the public URL you submitted and no personal tracking data.
          </p>
        </section>
      </div>
    </div>
  );
}
