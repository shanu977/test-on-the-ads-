/**
 * Deterministic client-side ad placement policy.
 * Keeps ads as UI-only insertions, never part of /api/chat payload.
 */

export const AD_CONFIG = {
  /** At most this many ads per conversation/session */
  MAX_ADS_PER_SESSION: 1,
  /** Minimum total messages before first ad can appear */
  MIN_MESSAGES_BEFORE_AD: 3,
  /** Cooldown between ads (in message count) for future multi-ad sessions */
  MIN_MESSAGES_BETWEEN_ADS: 5,
} as const;

export type PlacementInput = {
  /** Total rendered messages (user + assistant) */
  messageCount: number;
  /** Ads already inserted in this session */
  adsShown: number;
  /** Assistant is currently generating */
  isGenerating: boolean;
  /** Stable session id (use per-page-load id) */
  sessionId: string;
  /** Index of last ad insertion (null if none yet) */
  lastAdMessageIndex: number | null;
  /** Index of current message being evaluated */
  currentMessageIndex: number;
  /** Role of current message */
  currentMessageRole: "user" | "assistant";
};

/**
 * Deterministic placement - no Math.random().
 * Ad appears only after an assistant response, not at open,
 * not while generating, not inside text, not over input/nav.
 *
 * Minimal config surface: change AD_CONFIG to tune globally.
 */
export function shouldShowAd(input: PlacementInput): boolean {
  const {
    messageCount,
    adsShown,
    isGenerating,
    lastAdMessageIndex,
    currentMessageIndex,
    currentMessageRole,
  } = input;

  // 1. Never while generating
  if (isGenerating) return false;

  // 2. Never at open
  if (messageCount === 0) return false;
  if (messageCount < AD_CONFIG.MIN_MESSAGES_BEFORE_AD) return false;

  // 3. Session cap
  if (adsShown >= AD_CONFIG.MAX_ADS_PER_SESSION) return false;

  // 4. Only after assistant response (never inside user/assistant text)
  if (currentMessageRole !== "assistant") return false;

  // 5. Cooldown between ads
  if (lastAdMessageIndex !== null) {
    if (currentMessageIndex - lastAdMessageIndex < AD_CONFIG.MIN_MESSAGES_BETWEEN_ADS) {
      return false;
    }
  }

  // Deterministic single-insertion: once eligible, insert exactly once.
  // With MAX=1 this naturally lands after the first qualifying assistant message.
  // With higher MAX, it would insert every cooldown window after assistant.
  return true;
}

/**
 * Simpler conceptual API from spec:
 * shouldShowAd({ messageCount, adsShown, isGenerating, sessionId })
 * Useful for unit-testing generic session state.
 */
export function shouldShowAdForSession(args: {
  messageCount: number;
  adsShown: number;
  isGenerating: boolean;
  sessionId: string;
}): boolean {
  if (args.isGenerating) return false;
  if (args.messageCount < AD_CONFIG.MIN_MESSAGES_BEFORE_AD) return false;
  if (args.adsShown >= AD_CONFIG.MAX_ADS_PER_SESSION) return false;
  // sessionId is accepted for future per-session determinism; currently not used
  // to keep behavior stable across refresh (new session = new id = fresh ads).
  void args.sessionId;
  return true;
}
