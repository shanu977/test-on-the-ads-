"use client";

import NativeAd from "./NativeAd";

type SponsoredCardProps = {
  slot?: string;
  onError?: () => void;
};

/**
 * Polished native sponsored container inspired by ChatGPT reference.
 * - Sponsored label
 * - subtle three-dot menu visual
 * - clean divider
 * - rounded card, subtle background, compact, responsive
 * - Does NOT imitate ChatGPT branding, not an AI message
 */
export default function SponsoredCard({ slot = "native-1", onError }: SponsoredCardProps) {
  return (
    <div
      className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 shadow-sm overflow-hidden"
      role="group"
      aria-label="Sponsored content"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
          <span className="h-1.5 w-1.5 rounded-full bg-zinc-600" aria-hidden />
          Sponsored
        </span>
        {/* three-dot menu visual (non-functional, accessible) */}
        <button
          type="button"
          aria-label="Sponsored options"
          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 transition"
          tabIndex={0}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <circle cx="3.2" cy="8" r="1.6" />
            <circle cx="8" cy="8" r="1.6" />
            <circle cx="12.8" cy="8" r="1.6" />
          </svg>
        </button>
      </div>

      <div className="h-px bg-zinc-800" aria-hidden />

      {/* Content */}
      <div className="p-4">
        {/* Isolated Adsterra integration point */}
        <NativeAd slot={slot} onError={onError} />
      </div>
    </div>
  );
}
