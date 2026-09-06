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
      <script async data-cfasync="false" src="https://pl31209749.profitableratecpmnetwork.com/839a36ce65a197c2f9ac39c8e70ca81e/invoke.js"></script>
      <div id="container-839a36ce65a197c2f9ac39c8e70ca81e"></div>
    </div>
  );
}
