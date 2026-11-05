import Link from "next/link";
import { AuthFrame } from "@/components/admin/AuthFrame";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { requestPasswordReset } from "../actions";

const errors: Record<string, string> = {
  throttled: "ขอลิงก์บ่อยเกินไป รอสักครู่ (ไม่เกิน 1 ชั่วโมง) แล้วลองใหม่",
  rate_limit: "ระบบอีเมลส่งได้ 2 ฉบับต่อชั่วโมง รอประมาณ 1 ชั่วโมงหลังอีเมลล่าสุด แล้วกดขอลิงก์อีกครั้ง",
  config: "ระบบยังไม่ได้ตั้งค่าอีเมลผู้ดูแล แจ้งผู้พัฒนาให้ตั้งค่า SUPABASE_ADMIN_EMAIL",
};

export const metadata = { title: "ตั้งหรือรีเซ็ตรหัสผ่าน" };

export default async function ForgotPassword({ searchParams }: PageProps<"/admin/forgot-password">) {
  const query = await searchParams;
  const error = typeof query.error === "string" ? query.error : null;
  return (
    <AuthFrame
      title="ตั้งหรือรีเซ็ตรหัสผ่าน"
      lead="ระบบจะส่งลิงก์ไปที่อีเมลของผู้ดูแล เปิดลิงก์นั้นบนเครื่องนี้เพื่อตั้งรหัสผ่านใหม่"
      footer={<Link href="/admin/login">กลับไปเข้าสู่ระบบ</Link>}
    >
      {query.sent && <p role="status" className="adm-notice adm-notice--ok">ส่งลิงก์แล้ว ดูในกล่องจดหมายของผู้ดูแล ถ้าไม่เจอให้ดูโฟลเดอร์สแปม</p>}
      {error && <p role="alert" className="adm-notice adm-notice--error">{errors[error] ?? "ส่งอีเมลไม่สำเร็จ ลองใหม่อีกครั้งภายหลัง"}</p>}
      <form action={requestPasswordReset} className="adm-auth__form">
        <SubmitButton pendingLabel="กำลังส่งลิงก์…">ส่งลิงก์ตั้งรหัสผ่าน</SubmitButton>
      </form>
    </AuthFrame>
  );
}
