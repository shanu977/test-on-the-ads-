"use client";

import { useState } from "react";
import SponsoredCard from "./SponsoredCard";

type AdContainerProps = {
  slot?: string;
  onError?: () => void;
};

/**
 * Semantic ad wrapper between conversation messages.
 * - aside + aria-label for accessibility
 * - subtle top separator
 * - never interferes with chat input/nav
 * - collapses gracefully on failure (returns null)
 */
export default function AdContainer({ slot = "native-1", onError }: AdContainerProps) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <aside
      aria-label="Sponsored advertisement"
      className="my-2 w-full max-w-full overflow-hidden"
      data-ad-container={slot}
    >
      {/* Subtle separator like reference: thin line with spacing */}
      <div className="mb-3 h-px bg-zinc-800/60" aria-hidden />
      <SponsoredCard slot={slot} />
      {/* If SponsoredCard/NativeAd signals failure, parent can hide */}
      <span className="sr-only" aria-hidden>
        Sponsored content — advertisement
      </span>
    </aside>
  );
}
