# Phase 6 — ผลตรวจ polish, accessibility และ performance

ตรวจเมื่อ 27 ก.ย. 2026

## แก้แล้ว

- ลิงก์ฉากในเมนู desktop/mobile เปลี่ยน URL และเลื่อนถึงฉาก พร้อมย้าย keyboard focus ไปยังหัวข้อฉาก เมนูมือถือปิดและคืนการเลื่อนหน้า; กด Escape แล้ว focus กลับปุ่มเมนู
- skip link โฟกัส `<main>` ได้จริง
- แยกสีข้อความบรอนซ์สำหรับพื้นกระดาษ (`#76512e`) และพื้น Raven blue (`#c99b65`) เพื่อให้ป้ายตัวเล็กมี contrast อย่างน้อย 4.5:1; สีบรอนซ์เดิมยังใช้กับฉาก midnight และตรา
- Lenis เริ่มเฉพาะหน้าแรก จึงไม่มี GSAP ticker สำหรับ smooth scroll บนหน้า admin และหน้า preview

## ตรวจแล้ว

- Browser viewport 320, 375, 414, 768, 1024×650, 1440 และ 1728 พิกเซล: `documentElement.scrollWidth` เท่ากับ viewport ทุกขนาด; ตรวจภาพ Hero, Sorting, Values, Schedule และ Final Scene ในขนาดที่เกี่ยวข้อง
- ลำดับหัวข้อเป็น H1 เดียวใน Hero ตามด้วย H2 ของฉาก ภาพตกแต่งมี alt ว่าง; Hero มี alt บรรยาย และภาพข้อมูลที่เผยแพร่มี alt จากชื่อ/คำบรรยาย
- Hero ใช้ `fetchPriority=high` และ eager loading; ภาพต่ำกว่าหน้าแรก lazy load พร้อมกำหนด `sizes` และมิติใน `next/image` เพื่อลด layout shift ตัวอย่างคำขอ Hero ที่ `w=750&q=75` ส่งเป็น WebP ขนาด 74,858 bytes
- `npm run lint`, `npx tsc --noEmit`, `npm run build` ผ่าน

## ยังต้องตรวจต่อ

- ยังไม่มีภาพบุคคล ภาพกิจกรรม และข้อมูลจริง จึงต้องตรวจ crop, alt, captions และ contrast ของฉากเหล่านั้นอีกครั้งหลัง Phase 5 ได้ asset จริง
- ยังไม่ได้ทดสอบการสัมผัสบนโทรศัพท์จริงหรือเปิด reduced motion ในระบบปฏิบัติการจริง โค้ดมี media query และทางเดินไม่ใช้ pin แต่ต้องยืนยันด้วยอุปกรณ์ก่อนติ๊กเกณฑ์จบ
- ยังไม่ได้ตรวจ motion pacing ทั้งเส้นเรื่องแบบปิด animation และบนอุปกรณ์ที่สเปกต่ำ
