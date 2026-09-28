# Phase 7 — ผลตรวจความพร้อมเผยแพร่

ตรวจวันที่ 27 กันยายน 2026 บนเครื่องพัฒนา ยังไม่มี URL ที่ deploy แล้วตามที่เจ้าของโครงการแจ้ง

## ผ่านการตรวจในเครื่อง

- `npm run lint`, `npx tsc --noEmit` และ `npm run build` ผ่าน
- ทดสอบ `next start` บนพอร์ต 3100: `/` และ `/admin/login` ตอบ 200, `/admin` ส่งไปหน้า login, URL ที่ไม่มีอยู่และ `/preview/people` ตอบ 404 ใน production
- หน้า 404 ใช้ภาพลักษณ์เว็บและมีลิงก์กลับหน้าแรก; ตรวจหน้าจอ desktop และ mobile จำลองแล้ว
- หน้าแรกมี title, description, OG image, Twitter summary card, favicon และภาษาไทย; หน้า admin มี `noindex`
- ลิงก์เมนู HOUSE, PEOPLE, GAMES, SCHEDULE, MOMENTS, CHEER ชี้ไปยัง section ที่มีอยู่; สถานะว่างของข้อมูลกิจกรรมไม่แสดงข้อมูลปลอม
- Supabase โปรเจกต์ `bbv-ravenclaw` มีสถานะทำงานปกติ; ตาราง public ทั้งเจ็ดเปิด RLS และ client แบบ anonymous อ่านข้อมูลที่ยังไม่เผยแพร่ไม่ได้; bucket `event-media` เป็น private
- หลังเจ้าของโครงการทดสอบ admin มีบุคคล 1 รายการ `published` ที่ไม่ใช่ DEMO และมีภาพ; demo ที่เหลือ 11 รายการยังเป็น draft กฎ Storage เดิมอ้าง `people.name` แทนชื่อไฟล์ใน `storage.objects` ทำให้ภาพไม่แสดง แก้ด้วย migration `20260927000500_fix_published_people_media_read.sql` แล้ว และตรวจว่า client แบบ anonymous สร้าง signed URL ของภาพรายการที่เผยแพร่ได้ หน้า `/#people` แสดงภาพตอบ HTTP 200
- `/preview/people` เป็นตัวอย่างองค์ประกอบแบบคงที่ใน development ไม่ดึงข้อมูลจาก admin; ปรับป้ายอธิบายให้ชัดแล้ว

## ต้องทำก่อนเผยแพร่

1. ตั้ง `NEXT_PUBLIC_SITE_URL` เป็น URL HTTPS จริงใน deployment และตั้ง Supabase Auth Site URL / Redirect URLs ให้ตรงกัน จากนั้นตรวจหน้าเว็บและภาพแชร์ผ่าน URL จริง
2. เจ้าของโครงการได้ลองบันทึกและเผยแพร่คนพร้อมภาพแล้ว; ยังต้องตรวจขั้นตอนแก้ไข ลบ และการอัปโหลดหมวดอื่นด้วยบัญชี admin จริง
3. รับและตรวจข้อมูลบุคคล/ภาพจริง โปรแกรมแข่งขัน วันเวลา สถานที่ เพลงเชียร์ แผนที่ ภาพกิจกรรม เครดิตภาพ และกติกาจากเจ้าของข้อมูลก่อนเผยแพร่ ตรวจด้วยว่ารายการคนที่เผยแพร่เพื่อทดสอบเป็นข้อมูลจริงหรือควรเปลี่ยนกลับเป็น draft; demo draft ไม่แสดงบนหน้า public
4. ตรวจการใช้งานบนโทรศัพท์จริง โดยเฉพาะ touch scroll, mobile menu, schedule, crop ภาพ และ reduced motion
5. Supabase security advisor แจ้งว่า leaked password protection ยังไม่เปิด; [เอกสาร Supabase](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection) ระบุว่าฟีเจอร์นี้อยู่ในแผน Pro ขึ้นไป

## ข้อสรุป

โค้ดผ่านการ build และตรวจเส้นทางหลักในเครื่อง แต่ Phase 7 ยังไม่ผ่านเกณฑ์เผยแพร่ เพราะยังไม่มี deployment URL, ข้อมูลกิจกรรมที่ยืนยัน และผลทดสอบ admin ทุกหมวด
