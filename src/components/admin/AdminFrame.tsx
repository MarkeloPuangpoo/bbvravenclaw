import Link from "next/link";
import { logout } from "@/app/admin/actions";
import { sections, type SectionKey } from "@/lib/admin/sections";
import { getSectionCounts, sectionKeys, type AdminClient } from "@/lib/admin/content";
import { BrandMark } from "@/components/ui/BrandMark";

type Props = {
  supabase: AdminClient;
  active: "overview" | SectionKey;
  children: React.ReactNode;
};

export async function AdminFrame({ supabase, active, children }: Props) {
  const counts = await getSectionCounts(supabase);
  return (
    <div className="adm adm-console">
      <aside className="adm-rail">
        <div className="adm-rail__top">
          <Link href="/admin" className="adm-brand">
            <BrandMark kind="mini" tone="moonlight" className="adm-brand__mark" />
            <span><strong>Blue House</strong><small>จัดการเนื้อหา</small></span>
          </Link>
          <form action={logout} className="adm-rail__logout">
            <button type="submit" className="adm-rail__link">ออกจากระบบ</button>
          </form>
        </div>
        <nav className="adm-nav" aria-label="หมวดจัดการเนื้อหา">
          <Link href="/admin" aria-current={active === "overview" ? "page" : undefined}><span>ภาพรวม</span></Link>
          {sectionKeys.map((key) => {
            const { published, draft } = counts[key];
            return (
              <Link key={key} href={`/admin/${key}`} aria-current={active === key ? "page" : undefined}>
                <span>{sections[key].label}</span>
                <small aria-label={`เผยแพร่ ${published} จากทั้งหมด ${published + draft} รายการ`}>{published}/{published + draft}</small>
              </Link>
            );
          })}
        </nav>
        <a className="adm-rail__link adm-rail__site" href="/" target="_blank" rel="noopener noreferrer">
          ดูหน้าเว็บ<span aria-hidden="true"> ↗</span><span className="sr-only"> (เปิดแท็บใหม่)</span>
        </a>
      </aside>
      <main className="adm-main" id="main-content" tabIndex={-1}>{children}</main>
    </div>
  );
}
