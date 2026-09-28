import type { Metadata } from "next";
import { Cormorant_Garamond, Geist, IBM_Plex_Sans_Thai, Noto_Serif_Thai } from "next/font/google";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { AuthHashHandler } from "@/components/auth/AuthHashHandler";
import "lenis/dist/lenis.css";
import "./globals.css";

const displayFont = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
});
const latinFont = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});
const thaiBodyFont = IBM_Plex_Sans_Thai({
  variable: "--font-plex-thai",
  subsets: ["thai"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
const thaiDisplayFont = Noto_Serif_Thai({
  variable: "--font-noto-serif-thai",
  subsets: ["thai"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")),
  title: "Ravenclaw — Blue House | BBV Sports Day 2026",
  description: 'บ้านสีฟ้า Ravenclaw โรงเรียนบางปะกง "บวรวิทยายน" — Sports Day 2026',
  applicationName: "Ravenclaw / Blue House",
  icons: { icon: "/assets/brand/ravenclaw-mark-social.png" },
  openGraph: {
    type: "website",
    locale: "th_TH",
    siteName: "Ravenclaw / Blue House",
    images: [{ url: "/assets/brand/ravenclaw-mark-social.png", width: 1254, height: 1254, alt: "ตรานกอินทรีบ้านสีฟ้า Ravenclaw" }],
  },
  twitter: { card: "summary", images: ["/assets/brand/ravenclaw-mark-social.png"] },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="th"
      className={[displayFont.variable, latinFont.variable, thaiBodyFont.variable, thaiDisplayFont.variable].join(" ")}
    >
      <body>
        <AuthHashHandler />
        <a className="skip-link" href="#main-content">ข้ามไปยังเนื้อหา</a>
        <SmoothScroll />
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
