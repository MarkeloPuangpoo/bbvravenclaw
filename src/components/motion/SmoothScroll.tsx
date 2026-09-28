"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

export function SmoothScroll() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname !== "/") return;
    gsap.registerPlugin(ScrollTrigger);
    const noSmoothScroll = window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)");
    let lenis: Lenis | null = null;
    let ticker: ((time: number) => void) | null = null;

    const setScrollMode = () => {
      if (ticker) gsap.ticker.remove(ticker);
      lenis?.destroy();
      lenis = null;
      ticker = null;
      if (noSmoothScroll.matches) return;

      lenis = new Lenis({ anchors: true, autoRaf: false, stopInertiaOnNavigate: true });
      lenis.on("scroll", ScrollTrigger.update);
      ticker = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);
    };

    setScrollMode();
    noSmoothScroll.addEventListener("change", setScrollMode);
    return () => {
      noSmoothScroll.removeEventListener("change", setScrollMode);
      if (ticker) gsap.ticker.remove(ticker);
      lenis?.destroy();
    };
  }, [pathname]);
  return null;
}
