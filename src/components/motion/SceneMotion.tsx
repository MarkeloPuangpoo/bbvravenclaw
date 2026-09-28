"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SceneMotion() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add("(max-width: 899px) and (prefers-reduced-motion: no-preference)", () => {
      const hero = document.querySelector<HTMLElement>(".hero");
      if (!hero) return;

      const heroTimeline = gsap.timeline({
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.25 },
      });
      heroTimeline
        .to(".hero__title span:first-child", { xPercent: -9, yPercent: -8, opacity: 0.4, ease: "none" }, 0)
        .to(".hero__title span:last-child", { xPercent: 9, yPercent: 8, opacity: 0.4, ease: "none" }, 0)
        .to(".hero__artifact", { scale: 1.12, yPercent: -5, ease: "none" }, 0)
        .to(".hero__school, .hero__index, .hero__values, .hero__scroll", { opacity: 0, ease: "none" }, 0.35);

      return () => {
        gsap.set([".hero__title span", ".hero__artifact", ".hero__school", ".hero__index", ".hero__values", ".hero__scroll"], { clearProps: "all" });
      };
    });

    media.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      const hero = document.querySelector<HTMLElement>(".hero");
      const sorting = document.querySelector<HTMLElement>(".sorting");
      const values = document.querySelector<HTMLElement>(".values");
      if (!hero || !sorting || !values) return;

      const heroTimeline = gsap.timeline({
        scrollTrigger: { trigger: hero, start: "top top", end: "+=100%", pin: true, scrub: 0.7, anticipatePin: 1 },
      });
      heroTimeline
        .to(".hero__title span:first-child", { xPercent: -14, yPercent: -12, opacity: 0.18, ease: "none" }, 0)
        .to(".hero__title span:last-child", { xPercent: 14, yPercent: 12, opacity: 0.18, ease: "none" }, 0)
        .to(".hero__artifact", { scale: 1.3, yPercent: -7, ease: "none" }, 0)
        .to(".hero__school, .hero__index, .hero__values, .hero__scroll", { opacity: 0, ease: "none" }, 0.35)
        .to(hero, { opacity: 0, ease: "none" }, 0.75);

      gsap.fromTo(".sorting__first", { opacity: 0.25, y: 35 }, {
        opacity: 1, y: 0, ease: "none",
        scrollTrigger: { trigger: sorting, start: "top 75%", end: "top 30%", scrub: true },
      });
      gsap.fromTo(".sorting h2", { opacity: 0.25, y: 55 }, {
        opacity: 1, y: 0, ease: "none",
        scrollTrigger: { trigger: sorting, start: "top 40%", end: "center center", scrub: true },
      });

      const states = gsap.utils.toArray<HTMLElement>(".values__state");
      if (states.length !== 4) return;
      values.classList.add("values--motion");
      gsap.set(states.slice(1), { autoAlpha: 0 });
      const valuesTimeline = gsap.timeline({
        scrollTrigger: { trigger: values, start: "top top", end: "+=240%", pin: true, scrub: 0.6, anticipatePin: 1 },
      });
      const colors = ["#eee9dc", "#102a6b", "#050a18"];
      for (let index = 1; index < states.length; index++) {
        const position = index - 1;
        valuesTimeline
          .to(states[index - 1], { autoAlpha: 0, yPercent: -12, duration: 0.3 }, position)
          .to(values, { backgroundColor: colors[index - 1], duration: 0.5 }, position)
          .fromTo(states[index], { autoAlpha: 0, yPercent: 12 }, { autoAlpha: 1, yPercent: 0, duration: 0.4 }, position + 0.25)
          .to(".values__art", { xPercent: index === 1 ? 28 : index === 2 ? -20 : 0, scale: index === 2 ? 1.16 : 1, rotation: index === 3 ? 10 : index * 3, duration: 0.8 }, position);
      }
      valuesTimeline.to({}, { duration: 0.5 });

      gsap.fromTo(".manifesto__outline", { yPercent: -6 }, {
        yPercent: 6, ease: "none",
        scrollTrigger: { trigger: ".manifesto", start: "top bottom", end: "bottom top", scrub: true },
      });
      gsap.fromTo(".cheerleaders__rule", { xPercent: -4 }, {
        xPercent: 4, ease: "none",
        scrollTrigger: { trigger: ".cheerleaders", start: "top bottom", end: "bottom top", scrub: true },
      });
      gsap.fromTo(".final-scene h2 span, .final-scene h2 strong", { yPercent: 15, opacity: 0.35 }, {
        yPercent: 0, opacity: 1, stagger: 0.15, ease: "none",
        scrollTrigger: { trigger: ".final-scene", start: "top 80%", end: "center center", scrub: true },
      });

      return () => {
        values.classList.remove("values--motion");
        gsap.set(states, { clearProps: "all" });
        gsap.set([hero, values, ".hero__title span", ".hero__artifact", ".hero__school", ".hero__index", ".hero__values", ".hero__scroll", ".values__art", ".sorting__first", ".sorting h2"], { clearProps: "all" });
        gsap.set([".manifesto__outline", ".cheerleaders__rule", ".final-scene h2 span", ".final-scene h2 strong"], { clearProps: "all" });
      };
    });

    return () => media.revert();
  }, []);

  return null;
}
