"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Rate-limit cooldown — counts down from `durationSeconds` to 0.
 *
 * Implementation: a single setTimeout to expiry, then a 1s interval purely
 * for the live countdown. Cheaper and more accurate than a 1s setInterval
 * loop tied to React state.
 */
export const useRateLimitCooldown = (durationSeconds = 120) => {
  const [cooldown, setCooldown] = useState<number>(0);
  const expiresAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (cooldown <= 0) {
      expiresAtRef.current = null;
      return;
    }

    // One-shot timer for the actual expiry — the source of truth.
    const expiresAt = expiresAtRef.current ?? Date.now() + cooldown * 1000;
    expiresAtRef.current = expiresAt;

    const tick = () => {
      const remainingMs = expiresAt - Date.now();
      if (remainingMs <= 0) {
        setCooldown(0);
        return;
      }
      setCooldown(Math.ceil(remainingMs / 1000));
    };

    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const startCooldown = useCallback(() => {
    expiresAtRef.current = Date.now() + durationSeconds * 1000;
    setCooldown(durationSeconds);
  }, [durationSeconds]);

  return {
    startCooldown,
    isCooldownActive: cooldown > 0,
    /** Seconds remaining. 0 when no cooldown is active. */
    cooldownSeconds: cooldown,
    isButtonDisabled: cooldown > 0,
  };
};
