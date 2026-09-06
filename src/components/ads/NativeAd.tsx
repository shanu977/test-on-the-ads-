"use client";

import { useEffect } from "react";

const ADSTERRA_SRC =
  "https://pl31209749.profitableratecpmnetwork.com/839a36ce65a197c2f9ac39c8e70ca81e/invoke.js";
const CONTAINER_ID = "container-839a36ce65a197c2f9ac39c8e70ca81e";

/**
 * NativeAd — reuses exact proven Adsterra implementation from /ad-test.
 * /ad-test proves: script + container id 839a36... renders real creatives (Firefox).
 * This component preserves that exact script URL and container id.
 * Script is injected once (guarded against StrictMode double-mount) after container exists.
 */
export default function NativeAd() {
  useEffect(() => {
    // Guard against duplicate injection across re-renders / StrictMode / navigation
    if (document.querySelector(`script[src="${ADSTERRA_SRC}"]`)) return;

    const s = document.createElement("script");
    s.async = true;
    s.setAttribute("data-cfasync", "false");
    s.src = ADSTERRA_SRC;
    // Append to body so container already exists in DOM when script executes
    document.body.appendChild(s);
  }, []);

  // Exact container from Adsterra dashboard — do not change id
  return <div id={CONTAINER_ID} />;
}
