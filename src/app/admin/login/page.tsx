import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AuthFrame } from "@/components/admin/AuthFrame";
import { PasswordField } from "@/components/admin/PasswordField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { login } from "../actions";

const notices: Record<string, string> = {
  access: "บัญชีนี้ไม่มีสิทธิ์จัดการเนื้อหา ติดต่อผู้ดูแลระบบเพื่อขอสิทธิ์",
  throttled: "ลองผิดหลายครั้งเกินไป รอประมาณ 15 นาทีแล้วลองใหม่",
  config: "ระบบยังไม่ได้ตั้งค่าอีเมลผู้ดูแล แจ้งผู้พัฒนาให้ตั้งค่า SUPABASE_ADMIN_EMAIL",
  link: "ลิงก์หมดอายุหรือใช้ไม่ได้ ขอลิงก์ใหม่ที่หน้าตั้งรหัสผ่าน",
};

export const metadata = { title: "เข้าสู่ระบบ" };

export default async function AdminLogin({ searchParams }: PageProps<"/admin/login">) {
  const supabase = await createSupabaseServerClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (claims?.claims?.sub) {
    const { data: allowed } = await supabase.rpc("is_house_admin");
    if (allowed) redirect("/admin");
  }
  const query = await searchParams;
  const error = typeof query.error === "string" ? query.error : null;
  return (
    <AuthFrame
      title="เข้าสู่ระบบ"
      lead="สำหรับทีมงานบ้านสีฟ้าที่ดูแลเนื้อหาบนเว็บ ใช้รหัสผ่านกลางที่ผู้ดูแลระบบให้ไว้"
      footer={<Link href="/admin/forgot-password">ตั้งรหัสผ่านครั้งแรกหรือลืมรหัสผ่าน</Link>}
    >
      {query.set && <p role="status" className="adm-notice adm-notice--ok">ตั้งรหัสผ่านใหม่แล้ว เข้าสู่ระบบด้วยรหัสนี้ได้เลย</p>}
      {error && notices[error] && <p role="alert" className="adm-notice adm-notice--error">{notices[error]}</p>}
      <form action={login} className="adm-auth__form">
        <PasswordField
          id="admin-password"
          name="password"
          label="รหัสผ่าน"
          autoComplete="current-password"
          error={error === "credentials" ? "รหัสผ่านไม่ถูกต้อง ตรวจรหัสที่ได้รับแล้วลองอีกครั้ง" : undefined}
        />
        <SubmitButton pendingLabel="กำลังเข้าสู่ระบบ…">เข้าสู่ระบบ</SubmitButton>
      </form>
    </AuthFrame>
  );
}
