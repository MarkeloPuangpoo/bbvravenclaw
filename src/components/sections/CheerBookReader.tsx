"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { PublicContent } from "@/lib/public-content";

type Cheer = PublicContent["cheers"][number];

export function CheerBookReader({ cheers }: { cheers: Cheer[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(cheers[0].id);
  const closeButton = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const selected = cheers.find((cheer) => cheer.id === selectedId) ?? cheers[0];

  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousBodyOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    const background = [document.querySelector("main"), document.querySelector("header.site-header")].filter((element): element is HTMLElement => element instanceof HTMLElement);
    const previousInert = background.map((element) => element.inert);
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    background.forEach((element) => { element.inert = true; });
    closeButton.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
      }
      if (event.key !== "Tab" || !dialog.current) return;
      const focusable = Array.from(dialog.current.querySelectorAll<HTMLElement>("button:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])"));
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
      background.forEach((element, index) => { element.inert = previousInert[index]; });
      previouslyFocused?.focus();
    };
  }, [isOpen]);

  return <>
    <p className="cheer-book__intro">เลือกเพลงแล้วเปิดอ่านเนื้อร้องในคู่มือสแตนด์สีฟ้า</p>
    <ol className="cheer-book__contents">{cheers.map((cheer, index) => <li key={cheer.id}><span>{String(index + 1).padStart(2, "0")}</span><strong>{cheer.title}</strong></li>)}</ol>
    <button className="cheer-book__open" type="button" onClick={() => setIsOpen(true)}>OPEN CHEER BOOK <span aria-hidden="true">↗</span></button>
    {isOpen && createPortal(<div className="cheer-reader" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsOpen(false); }}>
      <div className="cheer-reader__panel" role="dialog" aria-modal="true" aria-labelledby="cheer-reader-title" ref={dialog}>
        <div className="cheer-reader__top"><span className="editorial-label">RAVENCLAW / BLUE STAND / 2026</span><button type="button" ref={closeButton} onClick={() => setIsOpen(false)} aria-label="ปิดคู่มือเพลงเชียร์">CLOSE <span aria-hidden="true">×</span></button></div>
        <div className="cheer-reader__body">
          <div className="cheer-reader__index"><p className="editorial-label">SONG INDEX / {String(cheers.length).padStart(2, "0")}</p><h2 id="cheer-reader-title">CHEER<br />BOOK.</h2><ol>{cheers.map((cheer, index) => <li key={cheer.id}><button type="button" className={cheer.id === selected.id ? "cheer-reader__song--active" : undefined} aria-current={cheer.id === selected.id ? "true" : undefined} onClick={() => setSelectedId(cheer.id)}><span>{String(index + 1).padStart(2, "0")}</span>{cheer.title}</button></li>)}</ol></div>
          <article className="cheer-reader__page" key={selected.id} aria-live="polite"><span className="editorial-label">BLUE STAND / SONG {String(cheers.indexOf(selected) + 1).padStart(2, "0")}</span><h3>{selected.title}</h3><p>{selected.lyrics}</p></article>
        </div>
      </div>
    </div>, document.body)}
  </>;
}
