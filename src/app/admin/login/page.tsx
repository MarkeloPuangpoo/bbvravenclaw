import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { login } from "../actions";
import Link from "next/link";

export default async function AdminLogin({ searchParams }: PageProps<"/admin/login">) {
  const supabase = await createSupabaseServerClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (claims?.claims?.sub) {
    const { data: allowed } = await supabase.rpc("is_house_admin");
    if (allowed) redirect("/admin");
  }
  const { error } = await searchParams;
  const message = error === "credentials" ? "รหัสผ่านไม่ถูกต้อง" : error === "access" ? "บัญชีนี้ยังไม่มีสิทธิ์ผู้ดูแล" : error === "config" ? "ยังไม่ได้ตั้งค่าอีเมลผู้ดูแล" : error === "link" ? "ลิงก์หมดอายุหรือใช้ไม่ได้ กรุณาขอลิงก์ใหม่" : null;
  return <main className="admin-shell" id="main-content">
    <p className="editorial-label">RAVENCLAW / CONTROL ROOM</p>
    <h1>Admin access</h1>
    <p>เข้าสู่ระบบด้วยรหัสกลางของผู้ดูแล</p>
    {message && <p role="alert" className="admin-alert">{message}</p>}
    {Boolean((await searchParams).set) && <p role="status" className="admin-alert">ตั้งรหัสผ่านแล้ว กรุณาเข้าสู่ระบบ</p>}
    <form action={login} className="admin-login-form">
      <label htmlFor="admin-password">รหัสผ่าน</label>
      <input id="admin-password" name="password" type="password" autoComplete="current-password" required />
      <button type="submit">เข้าสู่ระบบ →</button>
    </form>
    <p><Link href="/admin/forgot-password">ตั้งรหัสผ่านครั้งแรก / ลืมรหัสผ่าน</Link></p>
  </main>;
}
