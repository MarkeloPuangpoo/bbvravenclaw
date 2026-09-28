# Phase 4 — โครงเรื่องหน้าแรก

ตรวจเมื่อ 27 ก.ย. 2026

หน้าแรกเรียง Invitation → Hero → Sorting → Manifesto → Eagle / Values → People → Cheerleaders → Athletes → Schedule → Moments → Cheer Book → Venue → Final Scene. House Standing จะปรากฏเฉพาะเมื่อมีคะแนนที่เผยแพร่แล้ว ส่วน House Wall ยังไม่เปิดเพราะยังไม่มีระบบ moderation และ rate limiting

`src/lib/public-content.ts` เป็นจุดรวม type และ provider ของข้อมูลที่ผู้ดูแลจะแก้ผ่าน Supabase ใน Phase 4A ขณะนี้คืนรายการว่างทั้งหมดเพื่อไม่ให้ตัวอย่างบุคคล กำหนดการ คะแนน หรือภาพกิจกรรมหลุดเป็นข้อมูลจริง เมื่อยังไม่มีข้อมูล หน้า People, Cheerleaders, Athletes, Schedule, Moments, Cheer Book และ Venue ใช้ waiting state ที่ระบุชัดเจน ภาพบุคคลต้นแบบยังอยู่เฉพาะ development preview

Invitation แสดงครั้งแรกในหนึ่ง browser session ประมาณ 1.25 วินาที และข้ามเมื่อกลับมา Reduced motion ปิดชั้นนี้และทุกฉากที่ pin กลับไปแสดงเนื้อหาตามลำดับปกติ เราแก้การชนกันระหว่าง React กับ ScrollTrigger pin ด้วยการคง element ของ Invitation ไว้ใน DOM แล้วสลับการมองเห็น

ตรวจหน้าใน browser ที่ desktop 1440×900 และ mobile 375×812: navigation ไป People, Games, Schedule, Moments และ Cheer Book ได้; ไม่มี horizontal overflow ใน mobile; ลำดับสี Archive → Arena → Archive และฉากจบเห็นชัด ตรวจ fresh tab กับ returning navigation แล้วไม่พบ runtime error หลังแก้ Invitation ผล `npm run lint`, `npx tsc --noEmit` และ `npm run build` ผ่าน

ยังต้องรอภาพบุคคล/ชื่อจริง ชนิดกีฬาและนักกีฬา โปรแกรมแข่ง เพลงเชียร์ ภาพกิจกรรม และผังพื้นที่จากผู้ดูแล จึงยังตรวจองค์ประกอบของฉากที่มีข้อมูลจริงไม่ได้ งานนี้อยู่กับ Phase 4A และ Phase 5
