"use client";

import { useEffect, useRef, useState } from "react";

const ADSTERRA_SRC =
  "https://pl31209749.profitableratecpmnetwork.com/839a36ce65a197c2f9ac39c8e70ca81e/invoke.js";
const CONTAINER_ID = "container-839a36ce65a197c2f9ac39c8e70ca81e";

type Status = "idle" | "loading" | "content" | "empty" | "error";
type Props = {
  turnId?: string;
};

/**
 * NativeAd — Phase 3 premium native + fresh load per completed assistant turn.
 * Preserves exact Adsterra URL/container, no fake/iframe/proxy.
 * Each turnId (key) creates a fresh instance: old script/container cleaned, new script injected.
 * Premium lighter shell, premium spacing, empty collapses.
 */
export default function NativeAd({ turnId }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const hasContent = status === "content";

  // Fresh script per turn — scoped cleanup, duplicate protection, StrictMode safe
  useEffect(() => {
    setStatus("loading");

    // Remove any stale script from previous instance to allow fresh inventory request
    const stale = document.querySelector(`script[src="${ADSTERRA_SRC}"]`) as HTMLScriptElement | null;
    if (stale) stale.remove();

    const s = document.createElement("script");
    s.async = true;
    s.setAttribute("data-cfasync", "false");
    s.src = ADSTERRA_SRC;
    if (turnId) s.setAttribute("data-ad-turn", turnId);
    s.onerror = () => setStatus("error");
    document.body.appendChild(s);

    // Debug impression ready (internal, no analytics sent)
    // console.debug(`[NativeAd] turn ${turnId} script injected`);

    return () => {
      // Cleanup this instance's script on unmount / key change
      s.remove();
      // Do not globally delete unrelated elements — scoped to this script only
    };
  }, [turnId]);

  // Observe container for real inventory — collapse if empty
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const check = () => {
      const childCount = el.children.length;
      const htmlLen = el.innerHTML.trim().length;
      const h = el.getBoundingClientRect().height;
      if (childCount > 0 && (h > 20 || htmlLen > 300)) {
        setStatus("content");
        return true;
      }
      return false;
    };

    if (check()) return;

    const mo = new MutationObserver(() => {
      if (check()) {
        mo.disconnect();
      }
    });
    mo.observe(el, { childList: true, subtree: true });

    const ro = new ResizeObserver(() => {
      check();
    });
    ro.observe(el);

    const interval = setInterval(() => {
      if (check()) clearInterval(interval);
    }, 600);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      // If still no content after 12s, mark empty and collapse
      if (!check()) setStatus((prev) => (prev === "content" ? prev : "empty"));
    }, 12000);

    return () => {
      mo.disconnect();
      ro.disconnect();
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [turnId]);

  // Premium native shell — light, no banner look, conversation-native
  return (
    <div
      className={`w-full max-w-full overflow-hidden transition-all duration-300 ease-out ${
        hasContent ? "mt-6 opacity-100" : "pointer-events-none max-h-0 opacity-0 m-0 p-0"
      }`}
      aria-label="Sponsored advertisement"
      data-has-content={hasContent ? "true" : "false"}
      data-turn-id={turnId}
      data-status={status}
    >
      <div
        className={`rounded-2xl border bg-zinc-900/30 backdrop-blur-sm ${
          hasContent ? "border-zinc-800/50 p-2.5 sm:p-3" : "border-transparent p-0"
        }`}
      >
        {/* Subtle premium header — 8-12px above ad */}
        <div className="flex items-center gap-2 px-1 pb-2">
          <span className="text-[11px] font-medium tracking-widest uppercase text-zinc-500">
            Sponsored
          </span>
          <span className="h-3 w-px bg-zinc-800/60" aria-hidden />
          <span className="text-[11px] tracking-wide text-zinc-600">Advertisement</span>
        </div>

        {/* Real Adsterra — untouched creative */}
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-950 overflow-hidden">
          <div
            ref={containerRef}
            id={CONTAINER_ID}
            className="w-full max-w-full [&_img]:max-w-full [&_img]:h-auto"
          />
        </div>

        <p className="mt-2 px-1 text-[10px] leading-none text-zinc-500/80">
          Sponsored • Not an AI recommendation
        </p>
      </div>
    </div>
  );
}
