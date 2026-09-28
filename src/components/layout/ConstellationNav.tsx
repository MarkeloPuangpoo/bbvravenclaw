"use client";

import type { Ref } from "react";
import { navigation } from "@/data/navigation";

const stars = [
  { x: 10, y: 30 },
  { x: 45, y: 12 },
  { x: 80, y: 26 },
  { x: 118, y: 9 },
  { x: 153, y: 28 },
  { x: 190, y: 11 },
] as const;

const menuStars = navigation.map((_, index) => ({ x: index % 2 ? 31 : 18, y: 34 + index * 68 }));

type Props = {
  activeIndex: number;
  variant: "header" | "menu";
  onNavigate: (href: string) => void;
  isHomePage: boolean;
  firstLinkRef?: Ref<HTMLAnchorElement>;
  lastLinkRef?: Ref<HTMLAnchorElement>;
};

export function ConstellationNav({ activeIndex, variant, onNavigate, isHomePage, firstLinkRef, lastLinkRef }: Props) {
  const points = variant === "header" ? stars : menuStars;
  const route = `M ${points.map(({ x, y }) => `${x} ${y}`).join(" L ")}`;
  return (
    <nav className={`constellation-nav constellation-nav--${variant}`} aria-label="แผนที่ดาวนำทางบท">
      <svg className="constellation-nav__chart" viewBox={variant === "header" ? "0 0 200 40" : "0 0 60 408"} fill="none" aria-hidden="true" focusable="false">
        <path className="constellation-nav__guide" d={route} />
        <path className="constellation-nav__trace" d={route} pathLength="100" />
        {points.map(({ x, y }, index) => (
          <g key={index} className={index === activeIndex ? "constellation-nav__star--active" : undefined}>
            <circle className="constellation-nav__orbit" cx={x} cy={y} r="7" />
            <circle className="constellation-nav__star" cx={x} cy={y} r="2.4" />
          </g>
        ))}
      </svg>
      <div className="constellation-nav__links">
        {navigation.map((item, index) => (
          <a
            key={item.href}
            className={index === activeIndex ? "constellation-nav__link--active" : undefined}
            href={isHomePage ? item.href : `/${item.href}`}
            aria-current={index === activeIndex ? "location" : undefined}
            ref={index === 0 ? firstLinkRef : index === navigation.length - 1 ? lastLinkRef : undefined}
            onClick={(event) => { event.preventDefault(); onNavigate(item.href); }}
            style={variant === "header" ? { left: `${stars[index].x / 2}%`, top: `${stars[index].y / 0.4}%` } : undefined}
          >
            <span className="constellation-nav__hit" aria-hidden="true" />
            <span className="constellation-nav__label">{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
