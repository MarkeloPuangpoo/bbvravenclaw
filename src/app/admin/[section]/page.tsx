import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin";
import { AdminFrame } from "@/components/admin/AdminFrame";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { RecordForm } from "@/components/admin/RecordForm";
import { formatMeta, formatUpdated, signImages, toBangkokInput } from "@/lib/admin/content";
import { isSectionKey, sections, type Field } from "@/lib/admin/sections";
import { deleteRecord, saveRecord } from "../actions";

type Row = Record<string, unknown> & { id: string; status: string };
type Filter = "all" | "published" | "draft";

const slotGroup: Record<string, string> = {
  president: "leadership",
  vice_president_1: "leadership",
  vice_president_2: "leadership",
  stand_head: "cheerleader",
  sports_head: "athlete",
};

export async function generateMetadata({ params }: PageProps<"/admin/[section]">) {
  const { section } = await params;
  return { title: isSectionKey(section) ? sections[section].label : "จัดการเนื้อหา" };
}

function toValues(fields: readonly Field[], record: Row | null, prefill: Record<string, string>) {
  const values: Record<string, string | boolean> = {};
  for (const field of fields) {
    const raw = record?.[field.name];
    if (field.kind === "checkbox") values[field.name] = raw === true;
    else if (field.kind === "datetime") values[field.name] = toBangkokInput(raw);
    else if (field.kind === "time") values[field.name] = typeof raw === "string" ? raw.slice(0, 5) : "";
    else values[field.name] = raw == null ? (prefill[field.name] ?? "") : String(raw);
  }
  return values;
}

export default async function AdminSection({ params, searchParams }: PageProps<"/admin/[section]">) {
  const { section } = await params;
  if (!isSectionKey(section)) notFound();
  const supabase = await requireAdmin();
  const config = sections[section];
  const fields = config.fields as readonly Field[];
  const query = await searchParams;
  const text = (key: string) => (typeof query[key] === "string" ? (query[key] as string) : undefined);
  const filter: Filter = text("status") === "published" || text("status") === "draft" ? (text("status") as Filter) : "all";
  const editId = text("edit");
  const isNew = text("new") !== undefined;
  const slot = text("slot");

  const { data, error } = await supabase.from(config.table).select("*").order("created_at", { ascending: false });
  const all = ((data ?? []) as Row[]).sort((a, b) => Number(b.status === "published") - Number(a.status === "published"));
  const rows = filter === "all" ? all : all.filter((row) => (filter === "published") === (row.status === "published"));
  const selected = editId ? all.find((row) => row.id === editId) ?? null : null;
  const editing = Boolean(selected) || isNew;

  const imageFields = fields.filter((field) => field.kind === "image");
  const thumbField = imageFields[0];
  const paths = all.flatMap((row) => imageFields.map((field) => row[field.name]).filter((path): path is string => typeof path === "string" && path.length > 0));
  const signed = await signImages(supabase, paths);
  const imageUrls: Record<string, string> = {};
  for (const field of imageFields) {
    const path = selected?.[field.name];
    if (typeof path === "string" && signed.has(path)) imageUrls[field.name] = signed.get(path)!;
  }

  const needsSports = section === "people" || section === "schedule";
  const { data: sportRows } = needsSports ? await supabase.from("sports").select("id,name").order("name") : { data: [] };

  const slotTaken: Record<string, string> = {};
  if (section === "people") {
    for (const row of all) {
      if (row.id !== selected?.id && row.status === "published" && row.is_demo !== true && typeof row.homepage_slot === "string") {
        slotTaken[row.homepage_slot] = String(row.name ?? "");
      }
    }
  }

  const prefill: Record<string, string> = section === "people" && slot && slotGroup[slot] ? { homepage_slot: slot, group_name: slotGroup[slot] } : {};
  const slotLabels = (fields.find((field) => field.name === "homepage_slot")?.optionLabels ?? {}) as Record<string, string>;

  const href = (next: { edit?: string; isNew?: boolean; status?: Filter }) => {
    const search = new URLSearchParams();
    const status = next.status ?? filter;
    if (status !== "all") search.set("status", status);
    if (next.edit) search.set("edit", next.edit);
    if (next.isNew) search.set("new", "1");
    const qs = search.toString();
    return qs ? `/admin/${section}?${qs}` : `/admin/${section}`;
  };

  const titleOf = (row: Row) => String(row[config.titleKey] ?? "").trim() || `(ยังไม่ตั้งชื่อ${config.noun})`;
  const counts = { all: all.length, published: all.filter((row) => row.status === "published").length };
  const flash = text("saved") === "published" ? "เผยแพร่แล้ว รายการนี้แสดงบนเว็บ" : text("saved") === "draft" ? "บันทึกฉบับร่างแล้ว ยังไม่แสดงบนเว็บ" : text("deleted") ? "ลบแล้ว" : null;
  const failure = text("error");

  return (
    <AdminFrame supabase={supabase} active={section}>
      <header className="adm-head">
        <div>
          <h1>{config.label}</h1>
          <p>{config.hint}</p>
        </div>
        <div className="adm-head__actions">
          <a className="adm-btn" href={config.liveHref} target="_blank" rel="noopener noreferrer">ดูบนเว็บ<span aria-hidden="true"> ↗</span><span className="sr-only"> (เปิดแท็บใหม่)</span></a>
          <Link className="adm-btn adm-btn--primary" href={href({ isNew: true })}>เพิ่ม{config.noun}</Link>
        </div>
      </header>

      {flash && (
        <p role="status" className="adm-notice adm-notice--ok">
          {flash}
          {text("saved") === "published" && <> <a href={config.liveHref} target="_blank" rel="noopener noreferrer">ดูบนเว็บ<span className="sr-only"> (เปิดแท็บใหม่)</span></a></>}
        </p>
      )}
      {failure && <p role="alert" className="adm-notice adm-notice--error">{failure}</p>}
      {error && <p role="alert" className="adm-notice adm-notice--error">โหลดรายการไม่สำเร็จ: {error.message} ลองรีเฟรชหน้านี้</p>}

      <div className="adm-split" data-editing={editing || undefined}>
        <section className="adm-list" aria-labelledby="list-title">
          <h2 id="list-title" className="sr-only">รายการ{config.label}</h2>
          <nav className="adm-filter" aria-label="กรองตามสถานะ">
            <Link href={href({ status: "all" })} aria-current={filter === "all" ? "true" : undefined}>ทั้งหมด <small>{counts.all}</small></Link>
            <Link href={href({ status: "published" })} aria-current={filter === "published" ? "true" : undefined}>เผยแพร่ <small>{counts.published}</small></Link>
            <Link href={href({ status: "draft" })} aria-current={filter === "draft" ? "true" : undefined}>ฉบับร่าง <small>{counts.all - counts.published}</small></Link>
          </nav>
          {rows.length > 0 ? (
            <ul className="adm-rows">
              {rows.map((row) => {
                const thumbPath = thumbField ? row[thumbField.name] : null;
                const thumb = typeof thumbPath === "string" ? signed.get(thumbPath) : undefined;
                const meta = config.metaKeys.map((key) => formatMeta(key, row[key])).filter(Boolean);
                const slotName = typeof row.homepage_slot === "string" ? (slotLabels[row.homepage_slot] ?? row.homepage_slot).split(" · ")[0] : null;
                return (
                  <li key={row.id}>
                    <Link href={href({ edit: row.id })} className={`adm-row${thumbField ? " adm-row--thumb" : ""}`} aria-current={selected?.id === row.id ? "true" : undefined}>
                      {thumbField && (thumb ? <Image src={thumb} alt="" width={96} height={96} unoptimized className="adm-thumb" /> : <span className="adm-thumb adm-thumb--empty" aria-hidden="true" />)}
                      <span className="adm-row__text">
                        <strong>{titleOf(row)}</strong>
                        {meta.length > 0 && <span className="adm-row__meta">{meta.map((item) => <span key={item}>{item}</span>)}</span>}
                        <span className="adm-row__time">แก้ล่าสุด {formatUpdated(row.updated_at)}</span>
                      </span>
                      <span className="adm-row__tags">
                        <span className="adm-chip" data-status={row.status}>{row.status === "published" ? "เผยแพร่แล้ว" : "ฉบับร่าง"}</span>
                        {row.is_demo === true && <span className="adm-chip adm-chip--demo">ตัวอย่าง</span>}
                        {slotName && <span className="adm-chip adm-chip--slot">{slotName}</span>}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="adm-empty">
              {all.length === 0 ? (
                <>
                  <p>ยังไม่มี{config.noun}ในหมวดนี้</p>
                  <p>{config.hint}</p>
                  <Link className="adm-btn adm-btn--primary" href={href({ isNew: true })}>เพิ่ม{config.noun}แรก</Link>
                </>
              ) : (
                <>
                  <p>ไม่มีรายการ{filter === "published" ? "ที่เผยแพร่แล้ว" : "ที่เป็นฉบับร่าง"}</p>
                  <Link className="adm-btn" href={href({ status: "all" })}>ดูทั้งหมด</Link>
                </>
              )}
            </div>
          )}
        </section>

        <section className="adm-editor" aria-labelledby="editor-title">
          {editing ? (
            <>
              <Link className="adm-back" href={href({})}>← กลับไปรายการ{config.label}</Link>
              <div className="adm-editor__head">
                <h2 id="editor-title">{selected ? titleOf(selected) : `เพิ่ม${config.noun}ใหม่`}</h2>
                {selected && (
                  <p>
                    <span className="adm-chip" data-status={selected.status}>{selected.status === "published" ? "เผยแพร่แล้ว" : "ฉบับร่าง"}</span>
                    {selected.is_demo === true && <span className="adm-chip adm-chip--demo">ตัวอย่าง</span>}
                    <span>แก้ล่าสุด {formatUpdated(selected.updated_at)}</span>
                  </p>
                )}
              </div>
              <RecordForm
                key={selected?.id ?? `new-${slot ?? ""}`}
                section={section}
                noun={config.noun}
                fields={fields}
                required={config.required}
                values={toValues(fields, selected, prefill)}
                recordId={selected?.id ?? null}
                status={selected?.status === "published" ? "published" : "draft"}
                sortOrder={typeof selected?.sort_order === "number" ? selected.sort_order : 0}
                hasSortOrder={section !== "standings"}
                sports={sportRows ?? []}
                imageUrls={imageUrls}
                slotTaken={slotTaken}
                action={saveRecord}
              />
              {selected && (
                <div className="adm-danger">
                  <p>ลบรายการนี้ถาวร ถ้าแค่ต้องการซ่อนจากเว็บ ให้เปลี่ยนเป็นฉบับร่าง</p>
                  <ConfirmDelete action={deleteRecord} section={section} id={selected.id} title={titleOf(selected)} live={selected.status === "published"} />
                </div>
              )}
            </>
          ) : (
            <div className="adm-editor__idle">
              <h2 id="editor-title">เลือกรายการเพื่อแก้ไข</h2>
              <p>เลือกจากรายการทางซ้าย หรือเพิ่ม{config.noun}ใหม่</p>
            </div>
          )}
        </section>
      </div>
    </AdminFrame>
  );
}
