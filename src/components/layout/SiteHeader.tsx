"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { navigation } from "@/data/navigation";
import { BrandMark } from "@/components/ui/BrandMark";
import { ConstellationNav } from "@/components/layout/ConstellationNav";

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const menuButton = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);
  const lastLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (pathname !== "/") return;
    const targets = navigation.map(({ href }) => document.getElementById(href.slice(1)));
    if (targets.some((target) => !target)) return;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const update = () => {
      frame = 0;
      const threshold = window.innerHeight * 0.42;
      const tops = targets.map((target) => target!.getBoundingClientRect().top);
      let current = 0;
      for (let index = 1; index < tops.length; index++) {
        if (tops[index] <= threshold) current = index;
      }
      setActiveChapter((previous) => previous === current ? previous : current);
      if (motionPreference.matches) return;
      const next = Math.min(current + 1, tops.length - 1);
      const distance = tops[next] - tops[current];
      const fraction = next === current || distance <= 0 ? 0 : Math.min(1, Math.max(0, (threshold - tops[current]) / distance));
      const progress = (current + fraction) / (tops.length - 1);
      document.querySelectorAll<HTMLElement>(".constellation-nav").forEach((chart) => chart.style.setProperty("--star-dash", String(progress * 100)));
    };
    const scheduleUpdate = () => { if (!frame) frame = requestAnimationFrame(update); };
    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("hashchange", scheduleUpdate);
    motionPreference.addEventListener("change", scheduleUpdate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("hashchange", scheduleUpdate);
      motionPreference.removeEventListener("change", scheduleUpdate);
    };
  }, [pathname, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    firstLink.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        menuButton.current?.focus();
      }
      if (event.key === "Tab") {
        const first = menuButton.current;
        const last = lastLink.current;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  const closeAndNavigate = (href: string) => {
    setIsOpen(false);
    if (pathname !== "/") {
      router.push(`/${href}`);
      return;
    }
    requestAnimationFrame(() => {
      if (window.location.hash !== href) window.location.hash = href;
      const target = document.getElementById(href.slice(1));
      target?.scrollIntoView({ behavior: "auto" });
      const heading = target?.querySelector<HTMLElement>("h1, h2");
      if (heading) {
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      }
    });
  };

  return (
    <header className="site-header">
      <a className="site-header__brand" href={pathname === "/" ? "#house" : "/#house"} onClick={(event) => { event.preventDefault(); closeAndNavigate("#house"); }} aria-label="Ravenclaw กลับไปหน้าแรก">
        <BrandMark kind="mini" tone="moonlight" className="site-header__brand-mark" />
        <span className="site-header__brand-rule" aria-hidden="true" />
        <span>26</span>
      </a>
      {pathname !== "/" && <nav className="site-header__nav" aria-label="นำทางหลัก">
        {navigation.map((item) => <a key={item.href} href={`/${item.href}`} onClick={(event) => { event.preventDefault(); closeAndNavigate(item.href); }}>{item.label}</a>)}
      </nav>}
      {pathname === "/" && <ConstellationNav variant="header" activeIndex={activeChapter} onNavigate={closeAndNavigate} isHomePage />}
      <button
        ref={menuButton}
        className="site-header__menu-button"
        type="button"
        aria-expanded={isOpen}
        aria-controls={isOpen ? "mobile-menu" : undefined}
        onClick={() => setIsOpen((value) => !value)}
      >
        <span>{isOpen ? "CLOSE" : "MENU"}</span>
        <span aria-hidden="true">{isOpen ? "×" : "+"}</span>
      </button>
      {isOpen && (
        <div className="site-header__menu" id="mobile-menu">
          <ConstellationNav variant="menu" activeIndex={pathname === "/" ? activeChapter : -1} onNavigate={closeAndNavigate} isHomePage={pathname === "/"} firstLinkRef={firstLink} lastLinkRef={lastLink} />
          <span className="editorial-label">RAVENCLAW / BLUE HOUSE / 2026</span>
        </div>
      )}
    </header>
  );
}
