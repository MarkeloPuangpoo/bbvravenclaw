# Phase 3 — ผลการทำ prototype

ตรวจเมื่อ 27 ก.ย. 2026

## ฉากที่ทำ

- **Hero → Sorting:** ภาพนกอินทรีที่อนุมัติแล้วเป็นแกนกลางของ poster ขนาด 100svh บน desktop ใช้ GSAP pin หนึ่งช่วงหน้าจอให้ตัวอักษรแยก ภาพขยับเชิงลึก และพื้น parchment ของ Sorting ปรากฏตามลำดับ มือถือใช้การเลื่อนปกติและองค์ประกอบที่จัดใหม่
- **Eagle / Values:** ฉาก desktop pin เดียว เปิด WISDOM → CREATIVITY → AMBITION → UNITY โดยเปลี่ยนสีพื้น ตำแหน่งตัวอักษร และขนาด/ตำแหน่งภาพ ต่างจากการสลับข้อความเฉย ๆ บนมือถือและ reduced motion ทุกค่าอยู่ในเอกสารตามลำดับโดยไม่ pin
- **People:** `/preview/people` เป็น preview เฉพาะ `next dev` เพื่อทดสอบภาพแนวนอน, ภาพตัดพื้นหลัง, ตัวอักษรทับภาพ, การ crop และ wipe ภาพ ใช้ `people/people.jpg` กับ `people/peoplermbg.png` ชุดเดียว ไม่สร้างไฟล์ต่อบทบาทและไม่แต่งชื่อจริง Production ตอบ 404 ที่ route นี้ หน้า public ไม่แสดงรายการบุคคลจนมี record เผยแพร่จาก admin

## การตรวจ

- เปิดตรวจใน browser ที่ 1440×900, 375×812 และ 320×568: ไม่มี horizontal overflow; Hero และ People preview อ่านได้บนมือถือ
- ยืนยันว่า desktop มี pin spacer 2 จุดและมือถือไม่มี pin spacer
- ตรวจสถานะทั้งสี่ของ Values ระหว่างเลื่อน; state ที่ไม่ active ถูกซ่อนจากการแสดงผลใน desktop
- ตรวจ fallback จากโค้ด: GSAP scene ทำงานเฉพาะ `(min-width: 900px)`, `(pointer: fine)` และ `prefers-reduced-motion: no-preference`; ถ้าไม่ตรงเงื่อนไข เนื้อหา Values ทั้งสี่แสดงเป็นลำดับปกติ
- `npm run lint`, `npx tsc --noEmit`, `npm run build` ผ่าน; production `/preview/people` ตอบ 404 และไม่แสดงลิงก์ demo

## ข้อสรุป

ใช้ **layered 2D** สำหรับภาพนกอินทรีที่อนุมัติแล้ว ภาพ PNG มีรายละเอียดพอสำหรับ parallax, scale และการซ้อนตัวอักษร ไม่จำเป็นต้องทำ 3D ในตอนนี้ ภาพคนตัดพื้นหลัง 612×408 ใช้พิสูจน์เลย์เอาต์เท่านั้น ต้องแทนด้วยภาพจริงความละเอียดสูงผ่าน admin ก่อนเผยแพร่ฉาก People

การทดสอบ reduced motion แบบเปิด preference ใน browser และการวัด frame rate บนอุปกรณ์จริงยังอยู่ใน Phase 6; Phase 3 ตรวจเงื่อนไขและ fallback จากโค้ดแล้ว
