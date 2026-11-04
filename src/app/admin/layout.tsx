import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: { default: "จัดการเนื้อหา · Blue House", template: "%s · Blue House" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
