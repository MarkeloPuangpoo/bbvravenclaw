import Image from "next/image";
import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/admin";
import { AdminFrame } from "@/components/admin/AdminFrame";
import { formatUpdated, getSectionCounts, signImages } from "@/lib/admin/content";
import { sections, type SectionKey } from "@/lib/admin/sections";

export const metadata = { title: "ภาพรวม" };

const slots = [
  { key: "president", label: "ประธานสี", scene: "ฉาก People" },
  { key: "vice_president_1", label: "รองประธานคนที่ 1", scene: "ฉาก People" },
  { key: "vice_president_2", label: "รองประธานคนที่ 2", scene: "ฉาก People" },
  { key: "stand_head", label: "หัวหน้าสแตนด์", scene: "ฉาก Blue Stand" },
  { key: "sports_head", label: "หัวหน้ากีฬา", scene: "ฉาก The Field" },
] as const;

const otherScenes: SectionKey[] = ["sports", "schedule", "cheers", "moments", "standings", "announcements"];

export default async function AdminHome() {
  const supabase = await requireAdmin();
  const [{ data: peopleRows }, counts] = await Promise.all([
    supabase.from("people").select("id,name,role,homepage_slot,status,is_demo,portrait_path,updated_at"),
    getSectionCounts(supabase),
  ]);
  const people = peopleRows ?? [];
  const signed = await signImages(supabase, people.filter((p) => p.status === "published" && p.portrait_path).map((p) => p.portrait_path as string));
  const demoCount = people.filter((person) => person.is_demo).length;

  return (
    <AdminFrame supabase={supabase} active="overview">
      <header className="adm-head">
        <div>
          <h1>ภาพรวม</h1>
          <p>ดูว่าหน้าเว็บแสดงอะไรอยู่ตอนนี้ และฉากไหนยังรอเนื้อหา</p>
        </div>
      </header>

      <section className="adm-block" aria-labelledby="slots-title">
        <h2 id="slots-title">ตำแหน่งบนหน้าเว็บ</h2>
        <p className="adm-block__lead">หน้าเว็บแสดงคนได้ 5 ตำแหน่งนี้เท่านั้น คนที่ไม่ได้เลือกตำแหน่งจะเก็บไว้ใน admin</p>
        <ol className="adm-spine">
          {slots.map((slot) => {
            const live = people.find((p) => p.homepage_slot === slot.key && p.status === "published" && !p.is_demo);
            const draft = people.find((p) => p.homepage_slot === slot.key && p.status !== "published");
            const state = live ? "live" : draft ? "draft" : "empty";
            const photo = live?.portrait_path ? signed.get(live.portrait_path) : undefined;
            return (
              <li key={slot.key} data-state={state}>
                <div className="adm-spine__who">
                  {photo ? <Image src={photo} alt="" width={96} height={96} unoptimized className="adm-thumb" /> : <span className="adm-thumb adm-thumb--empty" aria-hidden="true" />}
                  <div>
                    <p className="adm-spine__slot">{slot.label}<span>{slot.scene}</span></p>
                    <p className="adm-spine__name">{live?.name || draft?.name || "ยังไม่มีคนในตำแหน่งนี้"}</p>
                    <p className="adm-spine__state">
                      {live ? `แสดงบนเว็บอยู่ · แก้ล่าสุด ${formatUpdated(live.updated_at)}` : draft ? "มีฉบับร่าง ยังไม่แสดงบนเว็บ" : "ฉากนี้ยังแสดงข้อความรอข้อมูล"}
                    </p>
                  </div>
                </div>
                <Link className="adm-btn" href={live || draft ? `/admin/people?edit=${(live ?? draft)!.id}` : `/admin/people?new=1&slot=${slot.key}`}>
                  {live ? "แก้ไข" : draft ? "เปิดฉบับร่าง" : "เพิ่มคน"}<span className="sr-only"> {slot.label}</span>
                </Link>
              </li>
            );
          })}
        </ol>
        {demoCount > 0 && (
          <p className="adm-note">ยังมีรายการข้อมูลตัวอย่าง (DEMO) {demoCount} รายการใน <Link href="/admin/people">คนและบทบาท</Link> รายการเหล่านี้ไม่แสดงบนเว็บ ลบได้เมื่อไม่ใช้แล้ว</p>
        )}
      </section>

      <section className="adm-block" aria-labelledby="scenes-title">
        <h2 id="scenes-title">ฉากอื่นบนเว็บ</h2>
        <ul className="adm-ledger">
          {otherScenes.map((key) => {
            const { published, draft } = counts[key];
            return (
              <li key={key}>
                <div>
                  <p className="adm-ledger__title"><Link href={`/admin/${key}`}>{sections[key].label}</Link></p>
                  <p className="adm-ledger__hint">{sections[key].hint}</p>
                </div>
                <p className="adm-ledger__state" data-state={published ? "live" : "empty"}>
                  {published ? `แสดงอยู่ ${published} รายการ` : "ยังไม่มีที่เผยแพร่"}
                  {draft > 0 && <span>ฉบับร่าง {draft}</span>}
                </p>
                <Link className="adm-btn" href={published || draft ? `/admin/${key}` : `/admin/${key}?new=1`}>
                  {published || draft ? "จัดการ" : "เพิ่มรายการแรก"}<span className="sr-only"> {sections[key].label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </AdminFrame>
  );
}
