"use client";

import { useEffect, useRef, useState } from "react";
import { BrandMark } from "@/components/ui/BrandMark";

const storageKey = "ravenclaw-invitation-seen";

export function Invitation() {
  const [isVisible, setIsVisible] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    try {
      if (window.sessionStorage.getItem(storageKey) && !started.current) return;
      window.sessionStorage.setItem(storageKey, "1");
      started.current = true;
    } catch {
      return;
    }

    // A short first-visit title card. It never blocks a returning visit.
    const show = window.requestAnimationFrame(() => setIsVisible(true));
    const hide = window.setTimeout(() => setIsVisible(false), reducedMotion ? 350 : 1250);
    return () => {
      window.cancelAnimationFrame(show);
      window.clearTimeout(hide);
    };
  }, []);

  return (
    <div className="invitation" data-visible={isVisible} aria-hidden="true">
      <div className="invitation__mark"><BrandMark kind="mini" tone="bronze" /><i /></div>
      <p>AN INVITATION HAS ARRIVED</p>
      <span className="editorial-label">BBV · SPORTS DAY 2026</span>
    </div>
  );
}
