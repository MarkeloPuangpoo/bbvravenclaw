export type Field = {
  name: string;
  label: string;
  kind?: "text" | "textarea" | "number" | "date" | "time" | "datetime" | "checkbox" | "select" | "image";
  options?: readonly string[];
  optionLabels?: Record<string, string>;
  allowEmpty?: boolean;
  max?: number;
};

export const sections = {
  people: { label: "คนและบทบาท", table: "people", fields: [
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
    { name: "sport_id", label: "Sport ID (ถ้ามี)" },
    { name: "portrait_path", label: "ภาพบุคคล", kind: "image" },
    { name: "cutout_path", label: "ภาพลบพื้นหลัง", kind: "image" },
    { name: "quote", label: "คำพูด", kind: "textarea", max: 500 },
    { name: "is_demo", label: "ข้อมูลตัวอย่าง", kind: "checkbox" },
  ] },
  sports: { label: "กีฬา", table: "sports", fields: [
    { name: "name", label: "ชื่อกีฬา", max: 120 },
    { name: "description", label: "รายละเอียด", kind: "textarea", max: 500 },
  ] },
  schedule: { label: "ตารางแข่ง", table: "schedule_items", fields: [
    { name: "event_date", label: "วันที่", kind: "date" },
    { name: "event_time", label: "เวลา", kind: "time" },
    { name: "title", label: "รายการ", max: 200 },
    { name: "location", label: "สถานที่", max: 200 },
    { name: "sport_id", label: "Sport ID (ถ้ามี)" },
  ] },
  cheers: { label: "เพลงเชียร์", table: "cheers", fields: [
    { name: "title", label: "ชื่อเพลง", max: 160 },
    { name: "lyrics", label: "เนื้อเพลง", kind: "textarea", max: 10000 },
    { name: "cue_notes", label: "คิว / หมายเหตุ", kind: "textarea", max: 2000 },
  ] },
  moments: { label: "แกลเลอรี", table: "moments", fields: [
    { name: "image_path", label: "ภาพกิจกรรม", kind: "image" },
    { name: "caption", label: "คำบรรยาย", max: 500 },
    { name: "credit", label: "เครดิตภาพ", max: 200 },
    { name: "taken_at", label: "เวลาถ่าย", kind: "datetime" },
  ] },
  standings: { label: "คะแนน", table: "standings", fields: [
    { name: "house", label: "ชื่อบ้าน", max: 120 },
    { name: "score", label: "คะแนน", kind: "number" },
    { name: "is_official", label: "คะแนนทางการ", kind: "checkbox" },
  ] },
  announcements: { label: "ประกาศ", table: "announcements", fields: [
    { name: "title", label: "หัวข้อ", max: 200 },
    { name: "body", label: "เนื้อหา", kind: "textarea", max: 5000 },
    { name: "published_at", label: "เวลาเผยแพร่", kind: "datetime" },
  ] },
} as const satisfies Record<string, { label: string; table: string; fields: readonly Field[] }>;

export type SectionKey = keyof typeof sections;
export function isSectionKey(value: string): value is SectionKey { return value in sections; }
