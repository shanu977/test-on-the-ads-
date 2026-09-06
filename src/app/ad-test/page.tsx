/**
 * TEMPORARY raw Adsterra test — diagnostic only
 * Route: /ad-test
 * Purpose: isolate whether Adsterra can deliver creative on production Netlify domain
 * No chatbot UI, no SponsoredCard, no ad-placement logic
 * This file can be removed after diagnosis
 */

export default function AdTestPage() {
  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 20, fontFamily: "system-ui, sans-serif", background: "#09090b", color: "#fafafa", minHeight: "100vh" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Adsterra Raw Ad Test</h1>
      <p style={{ fontSize: 13, color: "#a1a1aa", marginBottom: 24 }}>
        Temporary debugging route — raw Adsterra test, no chatbot UI. Will be removed after diagnosis.
      </p>

      {/* Exact Adsterra container — ID must remain exactly as provided */}
      <div
        id="container-839a36ce65a197c2f9ac39c8e70ca81e"
        style={{ width: "100%", minHeight: 250, background: "#18181b", border: "1px solid #27272a", borderRadius: 12 }}
      />

      {/* Exact Adsterra script — do not modify URL, ID, async, data-cfasync */}
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script
        async
        data-cfasync="false"
        src="https://pl31209749.profitableratecpmnetwork.com/839a36ce65a197c2f9ac39c8e70ca81e/invoke.js"
      />
    </div>
  );
}
