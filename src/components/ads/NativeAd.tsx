/**
 * NativeAd — Placeholder for future Adsterra Native Banner integration.
 *
 * DO NOT add Adsterra code yet. This component intentionally returns null
 * in production. In development you can enable a visual placeholder with
 * ENABLE_PLACEHOLDER=true (or NEXT_PUBLIC_ADS_DEBUG=1) to verify layout.
 *
 * Future integration:
 *   1. Receive official Adsterra Native Banner code (script + container div).
 *   2. Replace the placeholder inside the `enabled` branch below.
 *   3. Adsterra typically requires: a <div id="container-XXXX"> + <script src="...">
 *   4. Keep this component client-side safe; load scripts via useEffect if needed.
 *
 * Design: The Chat renderer calls <NativeAd /> between message groups.
 * See Chat.tsx → shouldShowAd(index) for insertion logic.
 */

type NativeAdProps = {
  /** Optional slot identifier for future multi-slot testing */
  slot?: string;
  /** Force show debug placeholder even in production (default: false) */
  debug?: boolean;
};

export default function NativeAd({ slot = "native-1", debug = false }: NativeAdProps) {
  const showPlaceholder =
    debug ||
    (typeof process !== "undefined" &&
      process.env.NEXT_PUBLIC_ADS_DEBUG === "1");

  // In production without debug flag → render nothing (no fake ads).
  if (!showPlaceholder) return null;

  // DEV-ONLY visual placeholder — disabled by default.
  return (
    <div
      data-ad-slot={slot}
      data-ad-placeholder="true"
      className="my-4 flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-900/60 px-4 py-6 text-center"
      role="complementary"
      aria-label="Advertisement placeholder"
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
        Ad placeholder
      </p>
      <p className="mt-1 text-sm text-zinc-400">
        Future Adsterra Native Banner will render here
      </p>
      <p className="mt-1 text-xs text-zinc-600">slot: {slot}</p>
    </div>
  );
}
