/**
 * TEMPORARY — Raw Adsterra test
 * Route: /ad-test
 * Purpose: Verify if Adsterra Native Banner can render on this domain
 * No chatbot integration, no SponsoredCard, no placement logic
 * Remove after diagnosis
 */
export default function AdTestPage() {
  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 20 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Adsterra Test</h1>
      {/* Isolation test: Nexuss visual shell + DIRECT official Adsterra code, no loader/abstraction */}
      <div className="rounded-xl border bg-zinc-900/20 border-zinc-800/30 w-[260px] max-w-full min-h-[230px] p-2 sm:p-2.5">
        <div className="flex items-center gap-1.5 px-0.5 pb-2">
          <span className="text-[11px] font-normal tracking-wide text-zinc-500">Sponsored</span>
          <span className="text-zinc-600 text-[11px]" aria-hidden>
            ·
          </span>
          <span className="text-[11px] font-normal tracking-wide text-zinc-500">Advertisement</span>
        </div>
        <div className="rounded-lg border border-zinc-800/30 bg-zinc-900/10 overflow-hidden w-full min-h-[180px]">
          <script async data-cfasync="false" src="https://pl31209749.profitableratecpmnetwork.com/839a36ce65a197c2f9ac39c8e70ca81e/invoke.js"></script>
          <div id="container-839a36ce65a197c2f9ac39c8e70ca81e" className="w-[260px] max-w-full h-full [&_img]:max-w-full [&_img]:h-auto" />
        </div>
      </div>
    </div>
  );
}
