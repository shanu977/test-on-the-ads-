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
 * NativeAd — Premium native conversational ad (refined for Nexuss/ChatGPT-style).
 *
 * INVARIANTS preserved:
 * - Exact Adsterra URL/container
 * - No fake/iframe/proxy
 * - No creative manipulation
 *
 * Lifecycle:
 * - key={completedAssistantTurnId} ensures EXACTLY ONE fresh instance per completed turn
 * - Cleanup scoped to instance
 * - StrictMode safe
 * - /ad-test untouched
 *
 * Placeholder:
 * - Fixed 336x280 on Adsterra creative itself (not outer card)
 * - Disclosure sits outside fixed box, so creative is exact 336x280
 * - max-w-full keeps it responsive on smaller screens
 * - Real Adsterra creative remains directly injected
 *
 * Empty inventory:
 * - Collapses to 0px
 * - No empty box/loader
 */
export default function NativeAd({ turnId }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  const hasContent = status === "content";

  // Fresh script per completed turn — scoped, no global purge of unrelated scripts
  useEffect(() => {
    const s = document.createElement("script");

    s.async = true;
    s.setAttribute("data-cfasync", "false");
    s.src = ADSTERRA_SRC;

    if (turnId) {
      s.setAttribute("data-ad-turn", turnId);
    }

    s.onerror = () => setStatus("error");

    scriptRef.current = s;
    document.body.appendChild(s);

    return () => {
      // Scoped cleanup: remove only the script this instance created
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.remove();
      }

      scriptRef.current = null;
    };
  }, [turnId]);

  // Empty-inventory detection — smooth collapse, no loader shown
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

    mo.observe(el, {
      childList: true,
      subtree: true,
    });

    const ro = new ResizeObserver(() => {
      check();
    });

    ro.observe(el);

    const interval = setInterval(() => {
      if (check()) {
        clearInterval(interval);
      }
    }, 600);

    const timeout = setTimeout(() => {
      clearInterval(interval);

      if (!check()) {
        setStatus((prev) => (prev === "content" ? prev : "empty"));
      }
    }, 12000);

    return () => {
      mo.disconnect();
      ro.disconnect();
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [turnId]);

  return (
    <div
      className={`w-full max-w-full overflow-hidden font-sans transition-opacity duration-200 ease-out ${
        hasContent ? "mt-2 opacity-100" : "pointer-events-none max-h-0 opacity-0 m-0 p-0"
      }`}
      aria-label="Sponsored advertisement"
      data-has-content={hasContent ? "true" : "false"}
      data-turn-id={turnId}
      data-status={status}
    >
      {/* Sponsored shell — auto height, disclosure outside fixed ad box */}
      <div
        className={`rounded-xl border bg-zinc-900/20 ${
          hasContent ? "border-zinc-800/30 w-[336px] max-w-full p-2 sm:p-2.5" : "border-transparent p-0"
        }`}
      >
        {/* Disclosure — outside fixed 336x280, so creative is exact */}
        <div className="flex items-center gap-1.5 px-0.5 pb-2">
          <span className="text-[11px] font-normal tracking-wide text-zinc-500">Sponsored</span>
          <span className="text-zinc-600 text-[11px]" aria-hidden>
            ·
          </span>
          <span className="text-[11px] font-normal tracking-wide text-zinc-500">Advertisement</span>
        </div>

        {/* Real Adsterra — EXACT 336x280 */}
        <div className="rounded-lg border border-zinc-800/30 bg-zinc-900/10 overflow-hidden w-[336px] max-w-full h-[280px]">
          <div
            ref={containerRef}
            id={CONTAINER_ID}
            className="w-full h-full max-w-full [&_img]:max-w-full [&_img]:h-auto"
          />
        </div>
      </div>
    </div>
  );
}
