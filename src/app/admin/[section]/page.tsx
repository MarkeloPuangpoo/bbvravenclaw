import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin";
import { isSectionKey, sections, type Field } from "@/lib/admin/sections";
import { deleteRecord, saveRecord } from "../actions";

function FieldInput({ field, value, sports, previewUrl }: { field: Field; value: unknown; sports: { id: string; name: string }[]; previewUrl?: string }) {
  const text = value == null ? "" : String(value);
  if (field.name === "sport_id") return <label>{field.label}<select name="sport_id" defaultValue={text}><option value="">ไม่ระบุ</option>{sports.map((sport) => <option key={sport.id} value={sport.id}>{sport.name}</option>)}</select></label>;
  if (field.kind === "checkbox") return <div><label className="admin-check"><input name={field.name} type="checkbox" defaultChecked={value === true} />{field.label}</label>{field.name === "is_demo" && <small>ติ๊กไว้สำหรับข้อมูลทดลองเท่านั้น หากจะเผยแพร่ ให้ใช้ชื่อและภาพจริง แล้วเอาติ๊กนี้ออก</small>}</div>;
  if (field.kind === "image") return <label>{field.label}{previewUrl && <Image className="admin-image-preview" src={previewUrl} alt={`ภาพปัจจุบัน: ${field.label}`} width={480} height={320} sizes="(max-width: 768px) 100vw, 480px" unoptimized />}{text && !previewUrl && <small>ไม่สามารถโหลดภาพปัจจุบันได้</small>}<input type="file" name={field.name} accept="image/jpeg,image/png,image/webp,image/avif" /><small>{text ? "เลือกไฟล์ใหม่เพื่อแทนภาพปัจจุบัน" : "JPG, PNG, WebP หรือ AVIF ไม่เกิน 12 MB"}</small></label>;
  if (field.kind === "select") return <label>{field.label}<select name={field.name} defaultValue={text || (field.allowEmpty ? "" : field.options?.[0])}>{field.allowEmpty && <option value="">ไม่แสดงบนหน้าเว็บ</option>}{field.options?.map((option) => <option value={option} key={option}>{field.optionLabels?.[option] ?? option}</option>)}</select></label>;
  if (field.kind === "textarea") return <label>{field.label}<textarea name={field.name} defaultValue={text} maxLength={field.max} rows={field.name === "lyrics" ? 8 : 3} /></label>;
  const display = field.kind === "datetime" && text ? new Date(new Date(text).getTime() + 7 * 60 * 60 * 1000).toISOString().slice(0, 16) : text;
  return <label>{field.label}<input name={field.name} type={field.kind === "datetime" ? "datetime-local" : field.kind ?? "text"} defaultValue={display} maxLength={field.max} min={field.kind === "number" ? 0 : undefined} step={field.kind === "number" ? 1 : undefined} /></label>;
}

export default async function AdminSection({ params, searchParams }: PageProps<"/admin/[section]">) {
  const { section } = await params;
  if (!isSectionKey(section)) notFound();
  const supabase = await requireAdmin();
  const config = sections[section];
  const homepageSlotField = (config.fields as readonly Field[]).find((field) => field.name === "homepage_slot");
  const { data, error } = await supabase.from(config.table).select("*").order("created_at", { ascending: false });
  const imageFields = (config.fields as readonly Field[]).filter((field) => field.kind === "image");
  const imagePaths = [...new Set((data ?? []).flatMap((record) => imageFields.map((field) => record[field.name]).filter((path): path is string => typeof path === "string" && path.length > 0)))];
  const signedImages = new Map<string, string>();
  await Promise.all(imagePaths.map(async (path) => {
    const { data: signed } = await supabase.storage.from("event-media").createSignedUrl(path, 60 * 15);
    if (signed?.signedUrl) signedImages.set(path, signed.signedUrl);
  }));
  const { data: sportRows } = section === "people" || section === "schedule" ? await supabase.from("sports").select("id,name").order("name") : { data: [] };
  const sports = sportRows ?? [];
  const query = await searchParams;
  const message = query.saved ? "บันทึกแล้ว" : query.deleted ? "ลบแล้ว" : typeof query.error === "string" ? query.error : null;
  return <main className="admin-shell" id="main-content">
    <p className="editorial-label"><Link href="/admin">← CONTROL ROOM</Link> / {config.label}</p>
    <h1>{config.label}</h1>
    {section === "people" && <p className="admin-publish-guide">เลือกตำแหน่งที่แสดงบนหน้าเว็บ: PEOPLE มีประธานและรองประธาน 2 คน, BLUE STAND มีหัวหน้าสแตนด์ 1 คน, THE FIELD มีหัวหน้ากีฬา 1 คน รายการที่ไม่เลือกตำแหน่งจะอยู่ใน admin เท่านั้น แม้เลือกสถานะเผยแพร่ หน้า <Link href="/preview/people">ภาพสาธิต</Link> ไม่ดึงข้อมูลจาก admin</p>}
    {message && <p role="status" className="admin-alert">{message}</p>}
    {error && <p role="alert" className="admin-alert">อ่านข้อมูลไม่สำเร็จ: {error.message}</p>}
    <details className="admin-editor" open={!data?.length}><summary>เพิ่มรายการใหม่</summary>
      <form action={saveRecord}>
        <input type="hidden" name="section" value={section} />
        <div className="admin-fields">{config.fields.map((field) => <FieldInput key={field.name} field={field} value={null} sports={sports} />)}</div>
        {section !== "standings" && <label>ลำดับ<input type="number" name="sort_order" defaultValue={0} /></label>}
        <label>สถานะ<select name="status" defaultValue="draft"><option value="draft">ฉบับร่าง</option><option value="published">เผยแพร่</option></select></label>
        <button type="submit">บันทึกรายการ</button>
      </form>
    </details>
    <div className="admin-records">
      {(data ?? []).map((record) => <details className="admin-editor" key={record.id}>
        <summary><span>{String(record.name ?? record.title ?? record.house ?? record.caption ?? record.event_date ?? record.id)}</span><small>{record.status}{record.is_demo ? " · DEMO" : ""}{record.homepage_slot ? ` · ${homepageSlotField?.optionLabels?.[record.homepage_slot] ?? record.homepage_slot}` : ""}</small></summary>
        <form action={saveRecord}>
          <input type="hidden" name="section" value={section} /><input type="hidden" name="id" value={record.id} />
          <div className="admin-fields">{config.fields.map((field) => <FieldInput key={field.name} field={field} value={record[field.name]} sports={sports} previewUrl={typeof record[field.name] === "string" ? signedImages.get(record[field.name]) : undefined} />)}</div>
          {section !== "standings" && <label>ลำดับ<input type="number" name="sort_order" defaultValue={record.sort_order ?? 0} /></label>}
          <label>สถานะ<select name="status" defaultValue={record.status}><option value="draft">ฉบับร่าง</option><option value="published">เผยแพร่</option></select></label>
          <button type="submit">บันทึกการแก้ไข</button>
        </form>
        <form action={deleteRecord} className="admin-delete"><input type="hidden" name="section" value={section} /><input type="hidden" name="id" value={record.id} /><button type="submit">ลบรายการนี้</button></form>
      </details>)}
      {!data?.length && <p>ยังไม่มีรายการในหมวดนี้</p>}
    </div>
  </main>;
}
