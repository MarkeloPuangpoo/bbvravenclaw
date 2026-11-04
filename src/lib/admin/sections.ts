export type Field = {
  name: string;
  label: string;
  kind?: "text" | "textarea" | "number" | "date" | "time" | "datetime" | "checkbox" | "select" | "image";
  options?: readonly string[];
  optionLabels?: Record<string, string>;
  allowEmpty?: boolean;
  max?: number;
};

export type SectionMeta = {
  label: string;
  table: string;
  fields: readonly Field[];
  /** What the public site does with these records, in one plain sentence. */
  hint: string;
  /** Where the records appear on the public page. */
  liveHref: string;
  /** Field shown as the row title in lists. */
  titleKey: string;
  /** Fields shown beside the title, in order. */
  metaKeys: readonly string[];
  /** Fields the database requires before a record can be published. */
  required: readonly string[];
  noun: string;
};

export const sections = {
  people: { label: "คนและบทบาท", noun: "บุคคล", hint: "ประธาน รองประธาน หัวหน้าสแตนด์ และหัวหน้ากีฬาจะแสดงบนเว็บเมื่อเลือกตำแหน่งและเผยแพร่", liveHref: "/#people", titleKey: "name", metaKeys: ["role"], required: ["name", "role", "portrait_path"], table: "people", fields: [
    { name: "name", label: "ชื่อ", max: 120 },
    { name: "role", label: "บทบาท", max: 120 },
    { name: "group_name", label: "กลุ่ม", kind: "select", options: ["leadership", "cheerleader", "athlete"], optionLabels: { leadership: "ผู้นำบ้านสีฟ้า", cheerleader: "สแตนด์ / เชียร์", athlete: "กีฬา" } },
    { name: "homepage_slot", label: "ตำแหน่งที่แสดงบนหน้าเว็บ", kind: "select", allowEmpty: true, options: ["president", "vice_president_1", "vice_president_2", "stand_head", "sports_head"], optionLabels: {
      president: "ประธานสี · PEOPLE",
      vice_president_1: "รองประธานคนที่ 1 · PEOPLE",
      vice_president_2: "รองประธานคนที่ 2 · PEOPLE",
      stand_head: "หัวหน้าสแตนด์ · BLUE STAND",
      sports_head: "หัวหน้ากีฬา · THE FIELD",
    } },
    { name: "sport_id", label: "กีฬาที่เกี่ยวข้อง" },
    { name: "portrait_path", label: "ภาพบุคคล", kind: "image" },
    { name: "cutout_path", label: "ภาพลบพื้นหลัง", kind: "image" },
    { name: "quote", label: "คำพูด", kind: "textarea", max: 500 },
    { name: "is_demo", label: "ข้อมูลตัวอย่าง", kind: "checkbox" },
  ] },
  sports: { label: "กีฬา", noun: "กีฬา", hint: "ชื่อและคำอธิบายกีฬาในฉากสนามแข่ง", liveHref: "/#athletes", titleKey: "name", metaKeys: ["description"], required: ["name"], table: "sports", fields: [
    { name: "name", label: "ชื่อกีฬา", max: 120 },
    { name: "description", label: "รายละเอียด", kind: "textarea", max: 500 },
  ] },
  schedule: { label: "ตารางแข่ง", noun: "รายการแข่ง", hint: "ตารางแข่งเรียงตามวันและเวลา", liveHref: "/#schedule", titleKey: "title", metaKeys: ["event_date", "event_time", "location"], required: ["event_date", "event_time", "title"], table: "schedule_items", fields: [
    { name: "event_date", label: "วันที่", kind: "date" },
    { name: "event_time", label: "เวลา", kind: "time" },
    { name: "title", label: "รายการ", max: 200 },
    { name: "location", label: "สถานที่", max: 200 },
    { name: "sport_id", label: "กีฬาที่เกี่ยวข้อง" },
  ] },
  cheers: { label: "เพลงเชียร์", noun: "เพลง", hint: "เพลงและเนื้อร้องในคู่มือเชียร์", liveHref: "/#cheer-book", titleKey: "title", metaKeys: [], required: ["title", "lyrics"], table: "cheers", fields: [
    { name: "title", label: "ชื่อเพลง", max: 160 },
    { name: "lyrics", label: "เนื้อเพลง", kind: "textarea", max: 10000 },
    { name: "cue_notes", label: "คิว / หมายเหตุ", kind: "textarea", max: 2000 },
  ] },
  moments: { label: "แกลเลอรี", noun: "ภาพ", hint: "ภาพกิจกรรมในฉาก From the field", liveHref: "/#moments", titleKey: "caption", metaKeys: ["credit"], required: ["image_path", "caption"], table: "moments", fields: [
    { name: "image_path", label: "ภาพกิจกรรม", kind: "image" },
    { name: "caption", label: "คำบรรยาย", max: 500 },
    { name: "credit", label: "เครดิตภาพ", max: 200 },
    { name: "taken_at", label: "เวลาถ่าย", kind: "datetime" },
  ] },
  standings: { label: "คะแนน", noun: "คะแนนบ้าน", hint: "คะแนนบ้านจะแสดงเมื่อเผยแพร่และติ๊กว่าเป็นคะแนนทางการ", liveHref: "/", titleKey: "house", metaKeys: ["score"], required: ["house", "is_official"], table: "standings", fields: [
    { name: "house", label: "ชื่อบ้าน", max: 120 },
    { name: "score", label: "คะแนน", kind: "number" },
    { name: "is_official", label: "คะแนนทางการ", kind: "checkbox" },
  ] },
  announcements: { label: "ประกาศ", noun: "ประกาศ", hint: "ประกาศของบ้านสีฟ้าใต้ฉาก Cheer book", liveHref: "/#announcements", titleKey: "title", metaKeys: [], required: ["title", "body"], table: "announcements", fields: [
    { name: "title", label: "หัวข้อ", max: 200 },
    { name: "body", label: "เนื้อหา", kind: "textarea", max: 5000 },
    { name: "published_at", label: "เวลาเผยแพร่", kind: "datetime" },
  ] },
} as const satisfies Record<string, SectionMeta>;

export type SectionKey = keyof typeof sections;
export function isSectionKey(value: string): value is SectionKey { return value in sections; }
