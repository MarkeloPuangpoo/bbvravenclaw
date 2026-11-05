"use server";

import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSectionKey, sections, type Field } from "@/lib/admin/sections";
import { clientKey, loginRule, resetRules, throttleClear, throttleHit, throttleWait } from "@/lib/auth-throttle";

const imageTypes = new Map([
  ["image/jpeg", "jpg"], ["image/png", "png"],
  ["image/webp", "webp"], ["image/avif", "avif"],
]);

function errorUrl(section: string, message: string) {
  return `/admin/${section}?error=${encodeURIComponent(message)}`;
}

export async function login(form: FormData) {
  const password = String(form.get("password") ?? "");
  const email = process.env.SUPABASE_ADMIN_EMAIL;
  if (!email || !password) redirect("/admin/login?error=config");
  const key = await clientKey();
  if (await throttleWait("login", key) > 0) redirect("/admin/login?error=throttled");
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    await throttleHit("login", key, loginRule);
    redirect("/admin/login?error=credentials");
  }
  const { data: allowed } = await supabase.rpc("is_house_admin");
  if (!allowed) {
    await supabase.auth.signOut();
    await throttleHit("login", key, loginRule);
    redirect("/admin/login?error=access");
  }
  await throttleClear("login", key);
  redirect("/admin");
}

export async function logout() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function requestPasswordReset() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const email = process.env.SUPABASE_ADMIN_EMAIL;
  if (!url || !key || !email) redirect("/admin/forgot-password?error=config");
  const client = await clientKey();
  const waits = await Promise.all([
    throttleWait("reset-burst", client), throttleWait("reset-hour", client), throttleWait("reset-all", "all"),
  ]);
  if (waits.some((seconds) => seconds > 0)) redirect("/admin/forgot-password?error=throttled");
  await Promise.all([
    throttleHit("reset-burst", client, resetRules.burst), throttleHit("reset-hour", client, resetRules.hourly), throttleHit("reset-all", "all", resetRules.global),
  ]);
  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false, flowType: "implicit" },
  });
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) redirect(`/admin/forgot-password?error=${error.status === 429 || /rate limit/i.test(error.message) ? "rate_limit" : "send"}`);
  redirect("/admin/forgot-password?sent=1");
}

export async function updatePassword(form: FormData) {
  const password = String(form.get("password") ?? "");
  const confirm = String(form.get("confirm") ?? "");
  if (password.length < 12 || password.length > 128 || password !== confirm) {
    redirect("/admin/set-password?error=validation");
  }
  const supabase = await createSupabaseServerClient();
  const { data, error: userError } = await supabase.auth.getUser();
  if (userError || !data.user || data.user.email?.toLowerCase() !== process.env.SUPABASE_ADMIN_EMAIL?.toLowerCase() || !data.user.email_confirmed_at) {
    redirect("/admin/login?error=link");
  }
  const { data: activeAdmin } = await supabase.rpc("is_house_admin");
  if (!activeAdmin) redirect("/admin/login?error=link");
  const { error } = await supabase.auth.updateUser({ password });
  if (error) redirect(`/admin/set-password?error=${encodeURIComponent(error.message)}`);
  await supabase.auth.signOut({ scope: "global" });
  redirect("/admin/login?set=1");
}

function parseField(field: Field, form: FormData): string | number | boolean | null {
  if (field.kind === "checkbox") return form.get(field.name) === "on";
  const value = String(form.get(field.name) ?? "").trim();
  if (field.max && value.length > field.max) throw new Error(`${field.label} ยาวเกินกำหนด`);
  if (field.kind === "select" && field.options && !(field.allowEmpty && !value) && !field.options.includes(value)) throw new Error(`${field.label} ไม่ถูกต้อง`);
  if (field.kind === "number") {
    const number = Number(value);
    if (!Number.isSafeInteger(number) || number < 0) throw new Error(`${field.label} ต้องเป็นจำนวนเต็มตั้งแต่ 0`);
    return number;
  }
  if (field.kind === "datetime") {
    if (!value) return null;
    const date = new Date(`${value}:00+07:00`);
    if (Number.isNaN(date.getTime())) throw new Error(`${field.label} ไม่ถูกต้อง`);
    return date.toISOString();
  }
  if (field.name === "sport_id" && value && !/^[0-9a-f-]{36}$/i.test(value)) throw new Error("Sport ID ไม่ถูกต้อง");
  return value || null;
}

export type SaveState = { error: string | null };

function messageOf(error: unknown) {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "message" in error && typeof error.message === "string") return error.message;
  return "บันทึกไม่สำเร็จ ลองอีกครั้ง";
}

export async function saveRecord(_previous: SaveState, form: FormData): Promise<SaveState> {
  const supabase = await requireAdmin();
  const section = String(form.get("section") ?? "");
  if (!isSectionKey(section)) return { error: "ไม่พบหมวดที่ต้องการบันทึก" };
  const config = sections[section];
  const suppliedId = String(form.get("id") ?? "");
  const id = suppliedId || randomUUID();
  if (!/^[0-9a-f-]{36}$/i.test(id)) return { error: "รหัสรายการไม่ถูกต้อง" };
  const uploaded: string[] = [];
  const oldImages: string[] = [];
  let savedStatus = "draft";
  try {
    const imageFields = (config.fields as readonly Field[]).filter((field) => field.kind === "image");
    const { data: existing, error: readError } = suppliedId && imageFields.length > 0
      ? await supabase.from(config.table).select(imageFields.map((field) => field.name).join(",")).eq("id", id).single()
      : { data: null, error: null };
    if (readError) throw readError;
    const values: Record<string, string | number | boolean | null> = { id };
    for (const field of config.fields as readonly Field[]) {
      if (field.kind === "image") {
        const currentValue = existing?.[field.name as keyof typeof existing];
        const current = typeof currentValue === "string" ? currentValue : "";
        const file = form.get(field.name);
        if (file instanceof File && file.size > 0) {
          const ext = imageTypes.get(file.type);
          if (!ext || file.size > 12 * 1024 * 1024) throw new Error("ภาพต้องเป็น JPG, PNG, WebP หรือ AVIF ขนาดไม่เกิน 12 MB");
          const path = `${section}/${id}/${randomUUID()}.${ext}`;
          const { error } = await supabase.storage.from("event-media").upload(path, file, { contentType: file.type, upsert: false });
          if (error) throw error;
          uploaded.push(path);
          values[field.name] = path;
          if (current) oldImages.push(current);
        } else values[field.name] = current || null;
      } else values[field.name] = parseField(field, form);
    }
    const status = String(form.get("status") ?? "draft");
    if (!(["draft", "published"] as string[]).includes(status)) throw new Error("สถานะไม่ถูกต้อง");
    values.status = status;
    savedStatus = status;
    if (section !== "standings") {
      const order = Number(form.get("sort_order") ?? 0);
      if (!Number.isSafeInteger(order) || Math.abs(order) > 1000000) throw new Error("ลำดับไม่ถูกต้อง");
      values.sort_order = order;
    }
    if (section === "people" && values.is_demo === true && status === "published") throw new Error("รายการนี้ยังเป็น DEMO: ใส่ข้อมูลและภาพจริง แล้วเอาติ๊ก 'ข้อมูลตัวอย่าง' ออกก่อนเผยแพร่");
    if (section === "people" && values.homepage_slot) {
      const slot = values.homepage_slot;
      const group = values.group_name;
      const expectedGroup = slot === "stand_head" ? "cheerleader" : slot === "sports_head" ? "athlete" : "leadership";
      if (group !== expectedGroup) throw new Error("กลุ่มไม่ตรงกับตำแหน่งที่แสดงบนหน้าเว็บ");
    }
    const { error } = await supabase.from(config.table).upsert(values);
    if (error?.code === "23505" && error.message.includes("people_published_homepage_slot_unique")) throw new Error("ตำแหน่งนี้มีคนเผยแพร่แล้ว กรุณาเปลี่ยนรายการเดิมเป็นฉบับร่างหรือเลือกตำแหน่งอื่น");
    if (error) throw error;
    if (oldImages.length) await supabase.storage.from("event-media").remove(oldImages);
  } catch (error) {
    if (uploaded.length) await supabase.storage.from("event-media").remove(uploaded);
    return { error: messageOf(error) };
  }
  revalidatePath("/");
  revalidatePath(`/admin/${section}`);
  redirect(`/admin/${section}?edit=${id}&saved=${savedStatus}`);
}

export async function deleteRecord(form: FormData) {
  const supabase = await requireAdmin();
  const section = String(form.get("section") ?? "");
  const id = String(form.get("id") ?? "");
  if (!isSectionKey(section) || !/^[0-9a-f-]{36}$/i.test(id)) throw new Error("Invalid deletion request");
  const config = sections[section];
  const { data } = await supabase.from(config.table).select("*").eq("id", id).single();
  const { error } = await supabase.from(config.table).delete().eq("id", id);
  if (error) redirect(errorUrl(section, error.message));
  const paths = (config.fields as readonly Field[]).filter((f) => f.kind === "image").map((f) => data?.[f.name]).filter((p): p is string => typeof p === "string" && p.length > 0);
  if (paths.length) await supabase.storage.from("event-media").remove(paths);
  revalidatePath("/");
  revalidatePath(`/admin/${section}`);
  redirect(`/admin/${section}?deleted=1`);
}
