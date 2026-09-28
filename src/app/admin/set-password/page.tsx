import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { updatePassword } from "../actions";

export default async function SetPassword({ searchParams }: PageProps<"/admin/set-password">) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user || data.user.email?.toLowerCase() !== process.env.SUPABASE_ADMIN_EMAIL?.toLowerCase() || !data.user.email_confirmed_at) {
    redirect("/admin/login?error=link");
  }
  const { data: activeAdmin } = await supabase.rpc("is_house_admin");
  if (!activeAdmin) redirect("/admin/login?error=link");
  const query = await searchParams;
  return <main className="admin-shell" id="main-content">
    <p className="editorial-label">RAVENCLAW / CONTROL ROOM</p>
    <h1>ตั้งรหัสผ่านใหม่</h1>
    <p>ใช้รหัสผ่านอย่างน้อย 12 ตัวอักษร หลังบันทึกแล้วให้เข้าสู่ระบบอีกครั้ง</p>
    {query.error && <p role="alert" className="admin-alert">{query.error === "validation" ? "รหัสผ่านต้องยาว 12–128 ตัวอักษรและตรงกันทั้งสองช่อง" : `ตั้งรหัสผ่านไม่สำเร็จ: ${query.error}`}</p>}
    <form action={updatePassword} className="admin-login-form">
      <label>รหัสผ่านใหม่<input name="password" type="password" minLength={12} maxLength={128} autoComplete="new-password" required /></label>
      <label>ยืนยันรหัสผ่าน<input name="confirm" type="password" minLength={12} maxLength={128} autoComplete="new-password" required /></label>
      <button type="submit">บันทึกรหัสผ่าน →</button>
    </form>
  </main>;
}
