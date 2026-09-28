# Supabase สำหรับ Phase 4A

โปรเจกต์: `bbv-ravenclaw` (`fabyynuiijlfoogbvooo`), region Singapore. โค้ดใน `supabase/migrations/` ถูกนำไปใช้กับโปรเจกต์นี้แล้วตามลำดับไฟล์

## Environment

คัดลอก `.env.example` เป็น `.env.local` และใส่ URL, publishable key, อีเมลผู้ดูแล ห้ามใส่ service role key หรือรหัสผ่านในไฟล์ที่ commit ขึ้น Git

## บัญชีผู้ดูแล

อีเมลที่อนุญาตคือ `drvvdre@gmail.com` ใน `private.admin_emails` ผู้ดูแลต้องเป็นบัญชี Supabase Auth ที่ยืนยันอีเมลแล้วเท่านั้น จากนั้นเข้า `/admin/login` ด้วยรหัสผ่านของบัญชีนั้น หน้าเว็บไม่เปิดสมัครสมาชิกเอง

สร้างบัญชีผ่าน Supabase Dashboard → Authentication → Users → Add user → Send invitation ให้เจ้าของอีเมลตั้งรหัสผ่านผ่านลิงก์ในอีเมล การเปลี่ยนอีเมลผู้ดูแลให้แก้ allowlist ในฐานข้อมูลและ `SUPABASE_ADMIN_EMAIL` พร้อมกัน

ลิงก์เชิญ/กู้คืนของโปรเจกต์นี้กลับไปที่ Site URL และส่ง session ผ่าน URL fragment ฝั่งเบราว์เซอร์ `AuthHashHandler` จะลบ fragment ออกจาก URL ทันที รับ session เข้า cookie และพาไป `/admin/set-password` ห้ามส่งลิงก์ที่มี token ให้ผู้อื่น หากยังไม่ได้ตั้งรหัสผ่าน ให้เปิด `/admin/forgot-password` แล้วกดส่งลิงก์ใหม่ที่อีเมลผู้ดูแล การตั้งรหัสผ่านจะ sign out ทุก session จากนั้นล็อกอินด้วยรหัสที่ตั้งใหม่

บริการอีเมลเริ่มต้นของ Supabase จำกัด 2 ฉบับต่อชั่วโมง หากขึ้น `email rate limit exceeded` ให้รอประมาณ 1 ชั่วโมงหลังอีเมลล่าสุดก่อนกดขอใหม่ หน้า Dashboard ของบัญชีที่เชิญแล้วมีเพียงปุ่มส่ง recovery email ซึ่งใช้โควตาเดียวกัน

สิทธิ์ admin ตรวจทั้งอีเมลที่ยืนยันแล้วและ `auth.sessions` ที่ยังใช้งานอยู่ การยกเลิก session จึงตัดสิทธิ์ admin ทันที แม้ JWT เก่ายังไม่หมดอายุ

## ข้อมูลและภาพ

- ตารางทั้งเจ็ดใช้ `draft` / `published`; public อ่านเฉพาะรายการที่เผยแพร่
- รายการบุคคล `is_demo=true` เผยแพร่ไม่ได้ตาม database constraint
- คนบนหน้าเว็บหลักเลือกผ่าน `homepage_slot`: ประธาน, รองประธาน 1/2, หัวหน้าสแตนด์ และหัวหน้ากีฬา แต่ละตำแหน่งมีรายการเผยแพร่ได้หนึ่งคน คนที่ไม่เลือกตำแหน่งยังเก็บใน admin ได้
- คะแนนต้องทำเครื่องหมาย `is_official=true` จึงเผยแพร่ได้ และการเปลี่ยนคะแนนบันทึกใน `score_audit`
- bucket `event-media` เป็น private; ภาพบนหน้า public ใช้ signed URL เฉพาะไฟล์ที่อ้างอิงจากรายการที่เผยแพร่
- `seed.sql` ใช้เฉพาะการพัฒนาและใส่ 12 รายการ demo แบบ draft; ถูกใส่ในโปรเจกต์นี้แล้ว ไม่ต้องรันซ้ำ
- Hero อยู่ใน `public/hero/` และไม่อยู่ใน admin

ก่อน deploy ให้ตั้งค่า Auth Site URL / Redirect URLs ให้ตรงกับโดเมนจริง และกำหนด SMTP ของโปรเจกต์หากต้องการใช้อีเมลคำเชิญหรือรีเซ็ตรหัสผ่านในการใช้งานจริง
