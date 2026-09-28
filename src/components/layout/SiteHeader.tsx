"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { navigation } from "@/data/navigation";
import { BrandMark } from "@/components/ui/BrandMark";

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const menuButton = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);
  const lastLink = useRef<HTMLAnchorElement>(null);

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
      <nav className="site-header__nav" aria-label="นำทางหลัก">
        {navigation.map((item) => <a key={item.href} href={pathname === "/" ? item.href : `/${item.href}`} onClick={(event) => { event.preventDefault(); closeAndNavigate(item.href); }}>{item.label}</a>)}
      </nav>
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
        <nav className="site-header__menu" id="mobile-menu" aria-label="นำทางมือถือ">
          {navigation.map((item, index) => (
            <a
              key={item.href}
              ref={index === 0 ? firstLink : index === navigation.length - 1 ? lastLink : undefined}
              href={pathname === "/" ? item.href : `/${item.href}`}
              onClick={(event) => { event.preventDefault(); closeAndNavigate(item.href); }}
            >
              {item.label}
            </a>
          ))}
          <span className="editorial-label">RAVENCLAW / BLUE HOUSE / 2026</span>
        </nav>
      )}
    </header>
  );
}
