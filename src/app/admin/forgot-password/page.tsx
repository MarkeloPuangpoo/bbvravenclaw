import Link from "next/link";
import { requestPasswordReset } from "../actions";

export default async function ForgotPassword({ searchParams }: PageProps<"/admin/forgot-password">) {
  const query = await searchParams;
  return <main className="admin-shell" id="main-content">
    <p className="editorial-label">RAVENCLAW / CONTROL ROOM</p>
    <h1>ตั้งรหัสผ่าน</h1>
    <p>ระบบจะส่งลิงก์ตั้งรหัสผ่านไปยังอีเมลผู้ดูแลที่กำหนดไว้</p>
    {query.sent && <p role="status" className="admin-alert">ส่งอีเมลแล้ว กรุณาตรวจกล่องจดหมายและโฟลเดอร์สแปม แล้วเปิดลิงก์บนเครื่องนี้</p>}
    {query.error && <p role="alert" className="admin-alert">{query.error === "rate_limit" ? "Supabase จำกัดอีเมลจากระบบเริ่มต้นไว้ 2 ฉบับต่อชั่วโมง กรุณารอประมาณ 1 ชั่วโมงหลังอีเมลล่าสุดแล้วกดอีกครั้ง" : "ส่งอีเมลไม่สำเร็จ กรุณาลองใหม่ภายหลัง"}</p>}
    <form action={requestPasswordReset} className="admin-login-form"><button type="submit">ส่งลิงก์ตั้งรหัสผ่าน →</button></form>
    <p><Link href="/admin/login">← กลับหน้าเข้าสู่ระบบ</Link></p>
  </main>;
}
