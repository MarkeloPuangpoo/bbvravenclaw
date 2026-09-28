import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/admin";
import { sections } from "@/lib/admin/sections";
import { logout } from "./actions";

export default async function AdminHome() {
  await requireAdmin();
  return <main className="admin-shell" id="main-content">
    <p className="editorial-label">RAVENCLAW / CONTROL ROOM</p>
    <div className="admin-heading"><h1>จัดการเนื้อหา</h1><form action={logout}><button type="submit">ออกจากระบบ</button></form></div>
    <p>รายการที่เป็นฉบับร่างจะไม่ปรากฏบนหน้าเว็บ ข้อมูลตัวอย่างเผยแพร่ไม่ได้</p>
    {process.env.NODE_ENV === "development" && <p><Link href="/preview/people">ดูภาพตัวอย่างสำหรับจัดองค์ประกอบคน →</Link></p>}
    <nav className="admin-menu" aria-label="หมวดจัดการเนื้อหา">
      {Object.entries(sections).map(([key, section], index) => <Link key={key} href={`/admin/${key}`}><span>{String(index + 1).padStart(2, "0")}</span>{section.label}<span aria-hidden="true">↗</span></Link>)}
    </nav>
  </main>;
}
