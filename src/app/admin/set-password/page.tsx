import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AuthFrame } from "@/components/admin/AuthFrame";
import { PasswordField } from "@/components/admin/PasswordField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { updatePassword } from "../actions";

export const metadata = { title: "ตั้งรหัสผ่านใหม่" };

export default async function SetPassword({ searchParams }: PageProps<"/admin/set-password">) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user || data.user.email?.toLowerCase() !== process.env.SUPABASE_ADMIN_EMAIL?.toLowerCase() || !data.user.email_confirmed_at) {
    redirect("/admin/login?error=link");
  }
  const { data: activeAdmin } = await supabase.rpc("is_house_admin");
  if (!activeAdmin) redirect("/admin/login?error=link");
  const query = await searchParams;
  const failure = typeof query.error === "string" ? query.error : null;
  return (
    <AuthFrame
      title="ตั้งรหัสผ่านใหม่"
      lead="หลังบันทึก ทุกอุปกรณ์จะถูกออกจากระบบ แล้วเข้าสู่ระบบอีกครั้งด้วยรหัสใหม่"
    >
      {failure && (
        <p role="alert" className="adm-notice adm-notice--error">
          {failure === "validation" ? "รหัสผ่านต้องยาว 12–128 ตัวอักษร และกรอกให้ตรงกันทั้งสองช่อง" : `ตั้งรหัสผ่านไม่สำเร็จ: ${failure}`}
        </p>
      )}
      <form action={updatePassword} className="adm-auth__form">
        <PasswordField id="new-password" name="password" label="รหัสผ่านใหม่" autoComplete="new-password" minLength={12} maxLength={128} hint="อย่างน้อย 12 ตัวอักษร" />
        <PasswordField id="confirm-password" name="confirm" label="ยืนยันรหัสผ่านใหม่" autoComplete="new-password" minLength={12} maxLength={128} />
        <SubmitButton pendingLabel="กำลังบันทึก…">บันทึกรหัสผ่าน</SubmitButton>
      </form>
    </AuthFrame>
  );
}
