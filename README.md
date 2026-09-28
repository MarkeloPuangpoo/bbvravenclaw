# Ravenclaw / Blue House Sports Day

เว็บไซต์กิจกรรมบ้านสีฟ้า โรงเรียนบางปะกง "บวรวิทยายน" สร้างด้วย Next.js 16, TypeScript, GSAP, Lenis และ Supabase อ่านแนวทางผลิตภัณฑ์ใน `AGENTS.md`, รายละเอียดภาพใน `design.md` และสถานะแต่ละช่วงใน `phase.md`

## รันในเครื่อง

```bash
npm install
cp .env.example .env.local
npm run dev
```

ใส่ค่า Supabase ของโปรเจกต์ `bbv-ravenclaw` ใน `.env.local` ตาม `supabase/README.md` โดยไม่เก็บรหัสผ่านหรือ service-role key ใน repository หน้าเว็บอยู่ที่ `http://localhost:3000`

## ตรวจคุณภาพ

```bash
npm run lint
npx tsc --noEmit
npm run build
```

ภาพนกอินทรีและตราที่ล็อกองค์ประกอบไว้เก็บใน `public/` ข้อมูลคน กีฬา ตารางแข่ง เพลงเชียร์ ภาพกิจกรรม คะแนน และประกาศแก้ผ่าน `/admin` แล้วเก็บใน Supabase ข้อมูล demo เป็น draft เท่านั้นและไม่แสดงบนหน้า public

## ก่อนเผยแพร่

1. ตั้ง `NEXT_PUBLIC_SITE_URL` เป็น URL จริงแบบ `https://...` เพื่อให้ลิงก์ภาพแชร์ถูกต้อง และตั้งค่า Supabase Auth Site URL / Redirect URLs ให้ตรงกัน
2. ตั้งรหัสผ่านบัญชี admin แล้วทดสอบการเพิ่ม แก้ไข เผยแพร่ และลบข้อมูลกับภาพจริง
3. ใส่ข้อมูลบุคคล กำหนดการแข่งขัน เพลงเชียร์ ภาพกิจกรรม และแผนที่ที่ผ่านการยืนยันเท่านั้น ตรวจชื่อ เครดิต และสิทธิ์ใช้ภาพก่อนเผยแพร่
4. ตรวจบนโทรศัพท์จริง โดยเฉพาะการเลื่อนหน้าด้วยการสัมผัสและ reduced motion
5. เปิด URL ที่ deploy แล้วเพื่อตรวจ metadata, ภาพแชร์, ลิงก์, หน้า 404, schedule และสิทธิ์ Supabase อีกครั้ง

รายการที่ยังขาดและหลักฐานการตรวจล่าสุดอยู่ใน `phase-5-findings.md`, `phase-6-findings.md` และ `phase-7-findings.md`
