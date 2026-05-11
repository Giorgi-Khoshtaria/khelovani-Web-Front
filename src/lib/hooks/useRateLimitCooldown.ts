"use client";

import { useState, useEffect } from "react";

export const useRateLimitCooldown = (durationSeconds: number = 120) => {
  const [cooldown, setCooldown] = useState<number>(0);

  useEffect(() => {
    if (cooldown <= 0) return;

    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldown]);

  const startCooldown = () => setCooldown(durationSeconds);

  return {
    startCooldown,
    isCooldownActive: cooldown > 0,
    /** Seconds remaining. 0 when no cooldown is active. */
    cooldownSeconds: cooldown,
    isButtonDisabled: cooldown > 0,
  };
};
