"use client";

import { useEffect, useRef, useState } from "react";

/**
 * NativeAd — isolated Adsterra Native Banner integration point.
 * Real Adsterra code (do NOT modify):
 * <script async="async" data-cfasync="false" src="https://pl31209749.profitableratecpmnetwork.com/839a36ce65a197c2f9ac39c8e70ca81e/invoke.js"></script>
 * <div id="container-839a36ce65a197c2f9ac39c8e70ca81e"></div>
 *
 * SECURITY:
 * - Only this file loads the Adsterra script.
 * - Do NOT put script in /api/chat, middleware, layout, or global HTML.
 * - Do NOT use NEXT_PUBLIC_GROQ_API_KEY.
 * - Script is public ad code, separate from private GROQ_API_KEY.
 */

const ADSTERRA_CONTAINER_ID = "container-839a36ce65a197c2f9ac39c8e70ca81e";
const ADSTERRA_SCRIPT_SRC =
  "https://pl31209749.profitableratecpmnetwork.com/839a36ce65a197c2f9ac39c8e70ca81e/invoke.js";
const ADSTERRA_SCRIPT_ID = "adsterra-native-banner-script";

type NativeAdProps = {
  slot?: string;
  onError?: () => void;
};

export default function NativeAd({ slot, onError }: NativeAdProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scriptInjectedRef = useRef(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    // Guard against React Strict Mode double-mount
    if (scriptInjectedRef.current) return;

    // If script already exists globally (e.g., previous mount / one ad per session), don't inject again
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${ADSTERRA_SCRIPT_SRC}"]`
    );
    if (existing) {
      scriptInjectedRef.current = true;
      return;
    }

    // Only inject after container is in DOM
    const container = document.getElementById(ADSTERRA_CONTAINER_ID);
    if (!container && !wrapperRef.current) {
      // Container not yet rendered — defer one tick
      const t = setTimeout(() => {
        // retry logic delegated to next effect run not needed; container is rendered synchronously
      }, 50);
      return () => clearTimeout(t);
    }

    try {
      const script = document.createElement("script");
      script.id = ADSTERRA_SCRIPT_ID;
      script.async = true;
      script.setAttribute("data-cfasync", "false");
      script.src = ADSTERRA_SCRIPT_SRC;
      script.onerror = () => {
        setFailed(true);
        onError?.();
      };
      // Do not break chat on load failure; just collapse
      // Append to wrapper to keep DOM scoped, or head — both work. Wrapper keeps cleanup simple.
      // Spec: append after container exists. Container is sibling inside wrapper.
      wrapperRef.current?.appendChild(script);
      // Also ensure script is discoverable globally
      scriptInjectedRef.current = true;

      return () => {
        // Do not remove global script on unmount to avoid duplicate re-injection race
        // but cleanup listeners
        script.onerror = null;
      };
    } catch {
      setFailed(true);
      onError?.();
    }
  }, [onError]);

  if (failed) return null;

  return (
    <div
      ref={wrapperRef}
      data-ad-slot={slot ?? ADSTERRA_CONTAINER_ID}
      className="w-full min-w-0"
      aria-label="Advertisement"
    >
      {/* Required Adsterra container — ID must remain exactly as provided, single instance */}
      <div
        id={ADSTERRA_CONTAINER_ID}
        className="w-full min-w-0 overflow-hidden"
        // Adsterra injects its native creative here
      />
      {/* Script is injected dynamically via useEffect above */}
    </div>
  );
}
