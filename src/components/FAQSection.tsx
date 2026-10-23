"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Why can't I download video files directly from YouTube?",
      a: "In strict compliance with YouTube's Terms of Service and developer guidelines, direct stream ripping without partner rights is prohibited. MediaMate provides official oEmbed metadata, authorized privacy-enhanced video embed previews, and verified high-resolution thumbnail downloads.",
    },
    {
      q: "How does Direct Media inspection work?",
      a: "When you supply a direct link ending in a media extension (like .mp4, .webm, .png, .mp3), MediaMate issues a lightweight HEAD probe to verify the remote server status, Content-Type, and Content-Length. Permitted files under 100 MB can then be previewed and downloaded.",
    },
    {
      q: "Where is my link history stored?",
      a: "Your history is stored 100% locally in your web browser's localStorage. MediaMate does not store your inspected URLs on any permanent server database, maintaining your privacy on a $0 budget.",
    },
    {
      q: "Why are some platforms labelled 'Not Supported'?",
      a: "Platforms like Pinterest and Facebook restrict automated media extraction and require paid enterprise developer partner access. Because MediaMate runs on an honest $0 free budget and never uses fragile, unauthorized scraping hacks, we clearly label unsupported platforms rather than showing fake buttons.",
    },
    {
      q: "Does MediaMate ask for social media passwords or session cookies?",
      a: "Never. MediaMate will never ask you for passwords, cookies, or personal tokens. All operations use public endpoints and authorized integration standards.",
    },
  ];

  return (
    <section className="max-w-2xl mx-auto space-y-6 pt-10">
      <div className="text-center space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
        <p className="text-xs sm:text-sm text-gray-500">Transparent answers about legal permissions and supported tools.</p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="rounded-2xl bg-white border border-gray-200 overflow-hidden transition"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm text-gray-800 hover:text-blue-600 transition"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${isOpen ? "rotate-180 text-blue-600" : ""}`} />
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
  );
}
