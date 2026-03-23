"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export function SecretVaultTrigger({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const tapCountRef = useRef(0);
  const lastTapRef = useRef(0);
  const holdTimerRef = useRef<number | null>(null);
  const lockRef = useRef(false);

  function clearHoldTimer() {
    if (holdTimerRef.current) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  }

  function openVault() {
    if (lockRef.current) return;
    lockRef.current = true;
    tapCountRef.current = 0;
    clearHoldTimer();
    router.push("/vault/login");
    window.setTimeout(() => {
      lockRef.current = false;
    }, 1200);
  }

  function handleTap() {
    const now = Date.now();
    if (now - lastTapRef.current > 1500) {
      tapCountRef.current = 0;
    }
    lastTapRef.current = now;
    tapCountRef.current += 1;

    if (tapCountRef.current >= 5) {
      openVault();
    }
  }

  function handlePressStart() {
    clearHoldTimer();
    holdTimerRef.current = window.setTimeout(() => openVault(), 10000);
  }

  function handlePressEnd() {
    clearHoldTimer();
  }

  useEffect(() => {
    return () => clearHoldTimer();
  }, []);

  return (
    <button
      type="button"
      onClick={handleTap}
      onPointerDown={handlePressStart}
      onPointerUp={handlePressEnd}
      onPointerCancel={handlePressEnd}
      onPointerLeave={handlePressEnd}
      className="text-start touch-manipulation"
      aria-label="Güzel"
    >
      {children}
    </button>
  );
}
