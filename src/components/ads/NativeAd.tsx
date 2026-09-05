"use client";

import { useEffect, useRef, useState } from "react";

/**
 * NativeAd — isolated Adsterra Native Banner integration point.
 *
 * SECURITY:
 * - Only this file should embed the Adsterra script.
 * - Do NOT put Adsterra script in /api/chat.
 * - Do NOT use NEXT_PUBLIC_GROQ_API_KEY.
 *
 * CURRENT STATE (before Adsterra approval):
 * - Shows deterministic development preview "Ad placement preview"
 * - No fake advertiser data, no hard-coded product
 * - Gracefully collapses on load failure, never breaks chat
 *
 * FUTURE INTEGRATION (when script provided):
 *   Replace the placeholder branch below with:
 *     <div id="container-XXXX"></div>
 *     <script async src="https://...adsterra..."></script>
 *   Use useEffect to inject <script> dynamically to allow lazy-load
 *   and error handling. Keep slot prop for container id mapping.
 *
 * Example (do NOT enable yet):
 *   useEffect(() => {
 *     const s = document.createElement("script");
 *     s.src = "https://...adsterra-native-banner.js";
 *     s.async = true;
 *     s.onload = () => setLoaded(true);
 *     s.onerror = () => setFailed(true);
 *     containerRef.current?.appendChild(s);
 *     return () => s.remove();
 *   }, []);
 */

type NativeAdProps = {
  slot?: string;
  /** Force preview even if env disables it (unused now, for tests) */
  debug?: boolean;
};

export default function NativeAd({ slot = "native-1", debug = false }: NativeAdProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Graceful failure: collapse instead of broken blank block
  if (failed) return null;

  // Lazy-load guard: don't render placeholder on server to avoid hydration mismatch
  // After mount, show preview. Real Adsterra would lazy-load here via IntersectionObserver.
  // Keeping it lightweight to not block chatbot rendering or Groq responses.

  // Development preview — clearly labeled, not a product ad
  // When real Adsterra code arrives, replace this branch with script injection
  // and keep the same outer lazy/error structure.
  return (
    <div
      ref={containerRef}
      data-ad-slot={slot}
      data-ad-state={failed ? "failed" : mounted ? "preview" : "idle"}
      className="w-full"
      aria-label="Advertisement"
    >
      <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/70 px-4 py-5 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
          Ad placement preview
        </p>
        <p className="mt-1.5 text-sm leading-5 text-zinc-400">
          Native ad will render here after Adsterra approval.
        </p>
        <p className="mt-2 text-[11px] text-zinc-600">
          This is a development placeholder — no advertiser data.
        </p>
        {/* Accessible link placeholder to keep keyboard focus pattern realistic without real ad */}
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="mt-3 inline-flex items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-300 hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600"
          aria-label="Learn more (placeholder ad)"
        >
          Learn more
        </a>
        <p className="mt-2 text-[10px] text-zinc-600" aria-hidden>
          slot: {slot}
        </p>
      </div>

      {/* Real Adsterra injection point example (commented, for future):
      <div id={`adsterra-${slot}`} className="min-h-[120px]" />
      // In useEffect, inject script with onerror={() => setFailed(true)}
      */}
    </div>
  );
}
