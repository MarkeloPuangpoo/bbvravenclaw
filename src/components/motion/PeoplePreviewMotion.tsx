"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function PeoplePreviewMotion() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(min-width: 900px) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const timeline = gsap.timeline({
        scrollTrigger: { trigger: ".people-preview__scene--president", start: "top top", end: "+=70%", pin: true, scrub: 0.7, anticipatePin: 1 },
      });
      timeline
        .fromTo(".people-preview__scene--president .people-preview__photo", { clipPath: "inset(0 0 0 0)" }, { clipPath: "inset(0 0 0 100%)", ease: "none" }, 0)
        .to(".people-preview__scene--president .people-preview__text", { xPercent: -8, ease: "none" }, 0);
      gsap.fromTo(".people-preview__scene--leadership .people-preview__cutout", { xPercent: 15 }, {
        xPercent: 0, ease: "none",
        scrollTrigger: { trigger: ".people-preview__scene--leadership", start: "top bottom", end: "top top", scrub: true },
      });
      return () => gsap.set([".people-preview__photo", ".people-preview__text", ".people-preview__cutout"], { clearProps: "all" });
    });
    return () => media.revert();
  }, []);
  return null;
}
