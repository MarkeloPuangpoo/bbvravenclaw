# แผนพัฒนา — Ravenclaw / Blue House Sports Day

เอกสารนี้ใช้ติดตามงานจากแนวทางใน [AGENTS.md](./AGENTS.md) และ [design.md](./design.md) โดย `AGENTS.md` เป็นหลักเมื่อข้อกำหนดขัดกัน ส่วน `design.md` กำหนดรายละเอียดการออกแบบและ motion

## วิธีใช้

- `[ ]` ยังไม่เสร็จ, `[x]` เสร็จและตรวจแล้ว
- ติ๊กงานย่อยเมื่อมีผลลัพธ์จริงในโปรเจกต์ ไม่ติ๊กจากการวางแผนอย่างเดียว
- ติ๊กหัวข้อ **ผ่านเกณฑ์จบ Phase** เมื่อเงื่อนไขทั้งหมดในหัวข้อนั้นผ่าน
- ถ้างานรอข้อมูลจากเจ้าของโปรเจกต์ ให้คง `[ ]` และระบุสิ่งที่ขาดในส่วน **ข้อมูลและ asset ที่ต้องได้รับ** ท้ายไฟล์
- อย่าใส่กำหนดการ คะแนน แผนที่ ชื่อบุคคล หรือภาพที่ยังไม่ยืนยันให้ดูเหมือนข้อมูลจริง

## สถานะล่าสุด (ตรวจเมื่อ 28 ก.ย. 2026)

- [x] อ่าน `AGENTS.md` และ `design.md`
- [x] ตรวจไฟล์หลักและ dependency ปัจจุบัน
- [x] ตรวจ asset ที่เพิ่มล่าสุด — มีภาพนกอินทรีใน `public/hero/` และภาพคนต้นแบบใน `people/`
- [x] ตรวจหน้าเว็บก่อนเริ่มงาน — ตอนนั้นยังเป็น starter page ของ Next.js
- [x] ตรวจแนวทาง Next.js 16 ที่เกี่ยวข้องใน `node_modules/next/dist/docs/` ก่อนเริ่มเขียนโค้ด; สรุปใน `phase-1-findings.md`

ปัจจุบันมี Next.js 16.3.6, React 19, TypeScript, Tailwind CSS 4, GSAP และ Lenis แล้ว หน้าเว็บมีเรื่องเล่าตั้งแต่ Invitation ถึง Final Scene พร้อม Hero → Sorting และ Eagle / Values ที่เลื่อนจริง, navigation และ waiting state สำหรับข้อมูลที่ยังไม่ยืนยัน People prototype อยู่ที่ `/preview/people` เฉพาะ development และ production ตอบ 404 ข้อมูล public ที่ admin จัดการแยกไว้ใน `src/lib/public-content.ts` ภาพคนใน `people/` เป็น placeholder สำหรับ preview ไม่ใช่ภาพนักเรียนจริง ภาพนกอินทรีใน `public/hero/` ได้รับอนุมัติให้ใช้เป็นภาพหลัก ข้อมูลและภาพบุคคลที่เปลี่ยนได้จัดการผ่าน admin + Supabase ตามรายละเอียดใน `knowledge.md`

เจ้าของโปรเจกต์ยืนยันเมื่อ 28 ก.ย. ว่าเตรียมข้อมูลและรูปที่ต้องใช้ครบแล้ว แต่ยังไม่ได้เพิ่มผ่าน admin และยังไม่มี URL ที่ deploy ตรวจฐานข้อมูลโปรเจกต์ `bbv-ravenclaw` ในวันเดียวกันพบคนเผยแพร่ที่ไม่ใช่ demo 3 รายการพร้อมภาพ (ประธาน, รองประธาน 1, หัวหน้ากีฬา), demo draft 9 รายการ และกีฬา 1 รายการ; ตารางแข่ง เพลงเชียร์ Moments คะแนน และประกาศยังไม่มี record ดังนั้น checklist การนำข้อมูลขึ้นเว็บและการตรวจผลจริงยังคง `[ ]`

---

## Phase 1 — สำรวจและกำหนดขอบเขตจริง

เป้าหมาย: รู้ว่าอะไรสร้างได้จากข้อมูลที่มี และอะไรต้องรอข้อมูลจริง โดยไม่ลดทอนแนวคิดของเว็บ ผลสำรวจและเหตุผลอยู่ใน [phase-1-findings.md](./phase-1-findings.md)

- [x] ตรวจโครงสร้างโค้ด, config, scripts, สถานะ Git และข้อจำกัดของโปรเจกต์อีกครั้งก่อนเริ่ม implementation
- [x] ตรวจเอกสาร Next.js 16 ในแพ็กเกจที่ติดตั้งสำหรับ API/รูปแบบไฟล์ที่จะใช้ และอ่าน deprecation notices
- [x] ทำรายการ asset ที่มี พร้อมขนาด สัดส่วน คุณภาพ สิทธิ์ใช้งาน และตำแหน่งไฟล์
- [x] ทำรายการเนื้อหาที่ได้รับการยืนยันแล้ว เทียบกับเนื้อหาที่ยังขาดในทุก section
- [x] กำหนดข้อมูลที่แสดงเป็น waiting state อย่างชัดเจน และ section ที่ควรซ่อนไว้จนมีข้อมูลจริง
- [x] ยืนยันขอบเขตหน้าแรกและลำดับฉากตาม `AGENTS.md`: ทำทุกฉาก; live score เตรียมระบบ admin แต่แสดง public เมื่อมีคะแนนจริง; House Wall ยัง optional
- [x] กำหนดจุดตรวจภาพรวมสำหรับ desktop, mobile และ reduced motion ก่อนขยายทั้งหน้า
- [x] สรุปขอบเขตข้อมูลที่ admin แก้ไขได้, วิธีเข้าสู่ระบบ และพฤติกรรม placeholder ก่อนมี record จริง

**ผ่านเกณฑ์จบ Phase 1**

- [x] มีรายการข้อมูล/asset ที่ใช้ได้จริงและที่ยังขาด โดยไม่มีข้อมูลสมมติที่อาจถูกเข้าใจว่าเป็นของจริง
- [x] ลำดับงาน prototype และ dependency สำหรับการทำต่อชัดเจน

## Phase 2 — Foundation

เป้าหมาย: วางระบบพื้นฐานให้รองรับเว็บแบบ editorial โดยไม่สร้างรูปแบบ marketing template

- [x] ติดตั้งและตั้งค่า GSAP, ScrollTrigger และ Lenis ตามการใช้งานจริง
- [x] ตั้งค่า font display, sans และ Thai พร้อมตรวจการตัดบรรทัดภาษาไทยใน browser
- [x] สร้าง semantic color, typography, spacing และ motion tokens จาก `design.md`
- [x] เปลี่ยน starter metadata, ภาษาเอกสาร, favicon/mark และ global styles ให้เป็นตัวตนของ Blue House
- [x] วาง shell ของหน้า, chapter anchors, skip link, focus states และ navigation ที่ใช้คีย์บอร์ดได้
- [x] แยกข้อมูลออกจาก presentation และแยก client motion orchestration จาก server content
- [x] กำหนด image strategy: `next/image`, `sizes`, eager เฉพาะภาพ Hero, lazy loading ตามค่าเริ่มต้นสำหรับภาพถัดไป และ interface สำหรับ asset ที่จะมาแทน
- [x] รองรับ `prefers-reduced-motion` ตั้งแต่ต้น: ปิด Lenis และลด CSS transitions; ยังต้อง QA preference นี้บนอุปกรณ์จริง
- [x] ตรวจ anchor navigation และ browser back/forward ใน browser
- [ ] ตรวจ touch scrolling บนอุปกรณ์สัมผัสจริง (โค้ดปิด Lenis เมื่อ `(pointer: coarse)`)
- [x] ตรวจ build, lint และ TypeScript หลังวาง foundation

**ผ่านเกณฑ์จบ Phase 2**

- [x] พื้นฐานการนำทางและ typography ใช้งานได้ทั้ง desktop/mobile โดยไม่มี scene animation
- [ ] QA reduced motion บนอุปกรณ์/เบราว์เซอร์ที่เปิด preference จริง และตรวจ touch scrolling บนอุปกรณ์สัมผัส
- [x] ไม่มี starter UI หรือ metadata ของ Next.js เหลือบนหน้าเว็บ

## Phase 3 — พิสูจน์ 3 ฉากหลัก

เป้าหมาย: พิสูจน์ทิศทางภาพและการเลื่อนหน้าที่มีความเสี่ยงสูง ก่อนขยายทุก section ผลตรวจและข้อสรุปอยู่ใน [phase-3-findings.md](./phase-3-findings.md)

### 3A — Hero → Sorting

- [x] ทำ hero แบบ `100svh` ที่ตัวอักษร RAVENCLAW และ eagle artifact เป็นองค์ประกอบหลัก
- [x] ใช้ original/approved artifact; หากยังไม่มี ให้ใช้ placeholder ที่บอกสถานะชัดเจนและคงสัดส่วนเป้าหมาย
- [x] ทำการเปลี่ยนจาก midnight ไป parchment ผ่าน scroll โดยมีเหตุผลด้านการเล่าเรื่อง
- [x] จัดองค์ประกอบมือถือใหม่ ไม่ย่อ desktop ตรง ๆ
- [x] ตรวจ first frame, การ crop, ระยะ scroll, performance เบื้องต้น และ fallback reduced motion; การวัดจริงบนอุปกรณ์อยู่ใน Phase 6

### 3B — Eagle / Values

- [x] ทำหนึ่ง pinned scene ที่ค่อย ๆ เปิด WISDOM, CREATIVITY, AMBITION, UNITY
- [x] แต่ละค่ามีองค์ประกอบต่างกัน ไม่ใช่สลับคำกลางจออย่างเดียว
- [x] ทำ mobile/reduced-motion fallback ที่แสดงเนื้อหาครบโดยไม่บังคับ pin ยาว
- [x] ตรวจความลื่นเบื้องต้นและ cleanup ของ ScrollTrigger

### 3C — People หรือ Athletes

- [x] เลือกฉากตามภาพจริงที่มี; ถ้ายังไม่มีภาพ ให้พิสูจน์ layout ด้วย placeholder ที่ระบุสัดส่วน
- [x] ใช้ภาพคน placeholder ชุดเดียวใน preview; ไม่คัดลอกไฟล์ตามชื่อบทบาทเป็นระบบหลัก
- [x] ทดสอบภาพทับตัวอักษร, mask/wipe, caption และ crop หลายขนาดจอ
- [x] ทดสอบว่าฉากยังสื่อสารได้เมื่อปิด animation

**ผ่านเกณฑ์จบ Phase 3**

- [x] ทั้งสาม prototype มีองค์ประกอบเฉพาะ อ่านได้ และแสดงผลดีบนมือถือ
- [x] motion ช่วยการเปลี่ยนฉากหรือเน้นลำดับเนื้อหา ไม่ใช่เติมพื้นที่ว่าง
- [x] ตัดสินใจใช้ layered 2D กับ eagle artwork ที่อนุมัติแล้ว; ไม่ใช้ 3D เพียงเพื่อให้ดูแพง

## Phase 4 — สร้างเรื่องเล่าทั้งหน้า

เป้าหมาย: ต่อ prototype เป็นเส้นเรื่องเดียว โดยฉากข้อมูลใช้งานจริงยังเข้าถึงได้รวดเร็ว ผลการทำและ dependency อยู่ใน [phase-4-findings.md](./phase-4-findings.md)

- [x] Invitation สั้นประมาณ 1–1.5 วินาทีเฉพาะ first visit และเคารพ reduced motion
- [x] Sorting เป็นจังหวะเงียบบน parchment
- [x] Manifesto ใช้ข้อความไทยสั้นและ typography เป็นองค์ประกอบภาพ
- [ ] People ให้ประธานบ้านมี feature moment และบุคคลอื่นมีจังหวะภาพที่หลากหลาย
- [x] Cheerleaders เปลี่ยนพลังภาพสู่ Arena โดยไม่ใช้ profile cards; รายชื่อจริงยังรอข้อมูล
- [ ] Athletes เป็น sports editorial พร้อมข้อมูลกีฬาที่ได้รับการยืนยัน
- [x] Games / Schedule เป็น timeline ภาษาไทยที่อ่านเร็ว และแสดง waiting state เมื่อยังไม่มีโปรแกรมจริง
- [x] Moments ใช้ภาพงานจริงแบบ editorial หรือ waiting state หากภาพยังไม่พร้อม
- [x] Cheer Book แสดงเนื้อหาจริงที่อ่านง่าย หรือระบุว่ายังรอข้อมูล
- [x] Venue Map แสดงเฉพาะเมื่อมีผัง/ตำแหน่งที่ตรวจแล้ว; ระหว่างรอใช้ข้อความสถานะชัดเจน
- [x] Final Scene และ footer ปิดเรื่องอย่างตั้งใจ
- [x] เพิ่ม House Standing บนหน้า public เฉพาะเมื่อมีคะแนนจริงที่ผู้ดูแลกรอกผ่าน admin
- [ ] เพิ่ม House Wall เฉพาะเมื่อมีขอบเขต moderation, validation และ rate limiting พร้อม
- [x] ตรวจลำดับ Archive → Arena → Archive, ความแตกต่างของแต่ละฉาก และทางลัดไปข้อมูลสำคัญ
- [x] แยก content source ของข้อมูลที่แก้ผ่าน admin ออกจาก asset หลักที่ล็อกไว้ในโปรเจกต์
- [x] หน้า public ซ่อนรายการ People / Cheerleaders / Athletes ที่ยังไม่มี record เผยแพร่ โดยไม่สร้าง 12 คนสมมติอัตโนมัติ

**ผ่านเกณฑ์จบ Phase 4**

- [x] มีเรื่องเล่าต่อเนื่องตั้งแต่ Invitation ถึง Final Scene โดยไม่ทำทุก section เป็น template เดียว; ฉากบุคคล/กีฬาแสดง waiting state ระหว่างรอ record จริง
- [x] ตาราง, การเชียร์ และข้อมูลกิจกรรมที่มีจริงเข้าถึงได้โดย animation ไม่ขวาง
- [x] section optional ที่ยังไม่มีข้อมูลเชื่อถือได้ไม่แสดงข้อมูลปลอม

## Phase 4A — Supabase และหน้า admin

เป้าหมาย: ให้ผู้ดูแลเพิ่มและแก้เนื้อหาที่เปลี่ยนตามงานได้ โดยหน้า public อ่านเฉพาะข้อมูลที่เผยแพร่แล้ว

- [x] วาง content model และ schema สำหรับคน/บทบาท กีฬา ตารางแข่ง เพลงเชียร์ แกลเลอรี คะแนน และประกาศ
- [x] ตั้งค่า Supabase project, Storage buckets, environment variables และ migrations โดยไม่ใส่ secret ลง repository
- [ ] ทำ login ด้วยรหัสกลางหนึ่งชุดผ่าน shared Supabase Auth account และ server-managed session; เพิ่มหน้ารับลิงก์เชิญ/กู้คืนและตั้งรหัสผ่านแล้ว รอเจ้าของอีเมลตั้งรหัสผ่านและทดสอบบัญชีจริง
- [x] ป้องกัน admin routes, mutations และ uploads ด้วย server checks รวมถึง RLS/Storage policies; รอทดสอบฝั่งบัญชี admin จริง
- [ ] ทำหน้ารายการ เพิ่ม แก้ไข ลบ และสถานะ draft/published สำหรับข้อมูลที่ตกลงกัน; โค้ดและ build ผ่าน รอทดสอบ end-to-end ฝั่ง admin
- [ ] อัปโหลดภาพต้นฉบับ/ภาพตัดพื้นหลังให้ผูกกับ record เดียวกัน และจัดการ fallback เมื่อยังไม่มีภาพ; โค้ดพร้อม รอทดสอบ upload จริง
- [x] ทำ development seed จำลอง 12 ตำแหน่ง (1/2/3/3/3) พร้อมป้าย demo; ไม่เผยแพร่เป็นข้อมูลจริงบน production
- [x] ป้องกันข้อมูลที่ยังไม่ยืนยันไม่ให้ปรากฏเป็นข้อมูลจริงบนหน้า public
- [x] จำกัดคนที่แสดงในสามฉากหลักด้วยตำแหน่งจาก admin: PEOPLE 3 คน, หัวหน้าสแตนด์ 1 คน, หัวหน้ากีฬา 1 คน; ตำแหน่งที่เผยแพร่ซ้ำไม่ได้
- [ ] ถ้าทำ live score: กำหนดผู้แก้คะแนน, บันทึกการเปลี่ยนแปลง และ fallback เมื่อข้อมูลไม่พร้อม; schema/audit/fallback พร้อม รอทดสอบการแก้คะแนนด้วยบัญชี admin
- [ ] ถ้าทำ House Wall: กำหนด moderation, validation และ rate limiting ก่อนเปิดให้ส่งข้อความ
- [ ] ตรวจสิทธิ์จริงทั้งผู้ใช้ทั่วไปและผู้ดูแล รวมถึงการอัปโหลด/ลบไฟล์

**ผ่านเกณฑ์จบ Phase 4A**

- [ ] ผู้ดูแลจัดการข้อมูลที่ตกลงกันผ่าน admin ได้โดยไม่ต้องแก้ source code
- [x] ผู้ใช้ทั่วไปไม่สามารถเขียนข้อมูลหรือเข้าถึงหน้าจัดการได้ (ทดสอบ anonymous insert และ HTTP redirect)
- [ ] หน้า public แสดงเฉพาะข้อมูลที่เผยแพร่แล้ว; ไม่มี record ให้ซ่อนรายการบุคคล และใช้ waiting state สำหรับข้อมูลจำเป็น

## Phase 5 — ใส่ asset และเนื้อหาที่อนุมัติ

เป้าหมาย: เปลี่ยน placeholder เป็นตัวตนของนักเรียนและงานจริงผ่าน admin/Cloud Storage พร้อมปรับองค์ประกอบตามภาพ

- [x] ใส่ original Blue House emblem/eagle artifact และเวอร์ชันสีที่จำเป็น — ใช้ตราที่เจ้าของเพิ่มใน header, Invitation, Sorting, favicon และภาพแชร์; Hero ยังใช้นกอินทรีที่อนุมัติแล้ว
- [x] สร้างชุดกราฟิกดาราศาสตร์สมมติ, ขนนกแบบภาพแกะสลัก, texture และ registration marks โดยใช้ SVG/CSS ต้นฉบับ; ใช้กราฟิกที่ไม่รบกวนข้อความใน Hero, Sorting, Eagle, People และ Final Scene (เก็บไฟล์ขนนกไว้สำหรับฉากที่มีพื้นที่ว่างเหมาะสม)
- [x] ใส่ manifesto ภาษาไทยฉบับที่เจ้าของให้ไว้ใน `knowledge.md`
- [x] ให้หน้า admin แสดงภาพที่ผูกกับ record อยู่แล้ว เพื่อเทียบภาพต้นฉบับ/ภาพตัดพื้นหลังก่อนแทนไฟล์จริง
- [ ] อัปโหลดภาพประธาน ผู้นำ เชียร์ลีดเดอร์ และนักกีฬา พร้อมชื่อ/บทบาทที่ตรวจแล้วผ่าน admin
- [ ] ปรับ crop, ขนาดตัวอักษร, overlay และลำดับภาพตาม asset จริง
- [ ] ใส่วัน เวลา รายการแข่งขัน สถานที่ และกติกาจากข้อมูลทางการ
- [ ] ใส่ Cheer Book ฉบับที่เจ้าของโปรเจกต์ยืนยัน
- [ ] ใส่แผนที่จากผังโรงเรียน/พื้นที่งานที่ตรวจแล้ว หากต้องใช้
- [ ] ใส่ภาพ Moments ผ่าน admin พร้อม caption/เครดิตที่ถูกต้องเมื่อได้รับภาพ
- [ ] ตรวจสิทธิ์การใช้ภาพและแยก asset ทางการของแฟรนไชส์ออกให้เปลี่ยนได้ง่าย หากมีการให้มา
- [ ] ลบ placeholder และ TODO ที่หมดหน้าที่; คง waiting state เฉพาะข้อมูลที่ยังไม่มา

**ผ่านเกณฑ์จบ Phase 5**

- [ ] ทุกข้อมูลที่นำเสนอเหมือนข้อเท็จจริงผ่านการยืนยันแล้ว
- [ ] ภาพจริงเป็นส่วนขององค์ประกอบ ไม่ใช่เพียงแทนรูป placeholder ในกรอบเดิม

## Phase 6 — Polish, accessibility และ performance

เป้าหมาย: ทำให้ฉากต่าง ๆ ใช้งานได้จริงอย่างลื่นไหลและรักษาคุณภาพภาพรวม

- [ ] รีวิวหน้าแบบปิด animation: typography, negative space, ความต่างของฉาก, การอ่านข้อมูล
- [ ] รีวิว motion: scroll pacing, transition, pin length และเหตุผลของทุก animation สำคัญ
- [x] ทดสอบ 320, 375, 414, 768, 1024, 1440 และ 1728px รวมถึงจอ laptop ที่เตี้ย; ไม่พบ horizontal overflow
- [x] ทดสอบ keyboard, focus, heading order, alt text, contrast และ skip link; แก้ focus หลังเลือกฉากและสีตัวอักษรบรอนซ์ขนาดเล็ก
- [ ] ทดสอบ reduced motion ว่ามีเนื้อหาครบและไม่ติดในฉาก pinned
- [x] ตรวจ responsive sizes, lazy loading, critical image priority และ layout shift; Next Image ส่ง Hero เป็น WebP ขนาด 74,858 bytes ในตัวอย่างที่ตรวจ
- [x] จำกัด Lenis ให้ทำงานบนหน้าแรก และตรวจ cleanup ของ ScrollTrigger/Lenis เมื่อถอด component หรือเปลี่ยน media query
- [x] ตรวจการนำทางไป anchor ทั้งเมนู desktop/mobile พร้อมโฟกัสหัวข้อฉาก
- [ ] ตรวจ mobile touch scrolling บนอุปกรณ์สัมผัสจริง
- [x] รัน lint, type check และ production build; แก้ปัญหาที่พบ
- [x] ตรวจหน้าใน browser จริงทั้ง desktop และ mobile viewport พร้อมแก้ข้อบกพร่องที่เห็น

**ผ่านเกณฑ์จบ Phase 6**

- [ ] หน้าเว็บยังมีเอกลักษณ์และอ่านได้เมื่อปิด animation
- [ ] mobile และ reduced motion ใช้งานได้ครบ
- [x] lint, type check และ production build ผ่าน
- [ ] ไม่มีข้อมูลปลอม, ภาพแฟรนไชส์ที่ไม่ได้รับสิทธิ์ หรือรูปแบบ UI สำเร็จรูปที่ขัดกับ `AGENTS.md`

## Phase 7 — ตรวจความพร้อมเผยแพร่

เป้าหมาย: ส่งมอบเว็บไซต์ที่พร้อมใช้งาน พร้อมบันทึกสิ่งที่ยังรอข้อมูล

- [x] ตรวจ title, description, social preview, favicon และข้อมูลโรงเรียน/ช่องทางติดต่อในเครื่อง (รอตรวจภาพแชร์ผ่าน URL จริง)
- [x] ตรวจลิงก์นำทาง, anchor, หน้า 404, สถานะว่าง และ schedule ใน production build ที่รันในเครื่อง
- [ ] ตรวจการเข้าถึง schedule และการเลื่อนหน้าบนอุปกรณ์จริง
- [x] ตรวจ environment variables ที่ตั้งไว้, RLS และสิทธิ์อ่านแบบ anonymous ของ Supabase
- [ ] ทดสอบการเข้าสู่ระบบและสิทธิ์เขียน/อัปโหลดของ admin ด้วยบัญชีจริง
- [ ] ตรวจข้อมูลกิจกรรมครั้งสุดท้ายกับเจ้าของข้อมูลก่อนเผยแพร่
- [x] สรุป asset/เนื้อหาที่ยังค้างและผลกระทบต่อการเปิดเว็บใน `phase-7-findings.md`
- [x] ตรวจ lint, type check และ production build พร้อม smoke test บน localhost
- [ ] ตรวจหน้าที่ deploy แล้ว, metadata, social preview และลิงก์บนโดเมนจริง

**ผ่านเกณฑ์จบ Phase 7**

- [ ] ผ่านเกณฑ์ Definition of done ใน `AGENTS.md` และ visual success ใน `design.md`
- [ ] ข้อมูลกิจกรรมที่เผยแพร่ตรงกับข้อมูลที่ยืนยันล่าสุด

---

## ข้อมูลและ asset ที่ต้องได้รับ

เจ้าของโปรเจกต์แจ้งว่าเตรียมรายการข้อมูลและรูปไว้ครบแล้ว แต่ยังไม่ได้ส่งไฟล์/รายละเอียดเข้ามาในโปรเจกต์หรือเพิ่มผ่าน admin ช่อง `[ ]` ในส่วนนี้หมายถึงยังไม่ได้รับหรือตรวจรายการนั้นในระบบ ไม่ได้หมายความว่าเจ้าของยังไม่ได้เตรียม

- [x] Eagle artifact หลักที่อนุมัติ (`public/hero/` 4 ไฟล์)
- [x] Emblem / logo บ้านสีฟ้าที่อนุมัติ (`public/assets/brand/` 6 ไฟล์; `primarycrest-rmbg.png` โปร่งใสแล้ว และมี SVG สำหรับปรับสีตามฉาก)
- [ ] ภาพและชื่อ/บทบาทของประธาน ผู้นำ เชียร์ลีดเดอร์ นักกีฬา
- [ ] วัน เวลา โปรแกรมกีฬา สถานที่ กติกา และรายละเอียดนัดพบที่ยืนยันแล้ว
- [x] ข้อความ manifesto ภาษาไทยฉบับที่เจ้าของให้ไว้ใน `knowledge.md`
- [ ] เพลงเชียร์ ลำดับเพลง cue, dress code และข้อปฏิบัติ
- [ ] ผังโรงเรียนหรือแผนที่งานที่ตรวจแล้ว
- [ ] ภาพกิจกรรมและเครดิตภาพสำหรับ Moments
- [ ] แหล่งข้อมูลคะแนนและผู้รับผิดชอบอัปเดต หากต้องการ live score
- [ ] กติกา moderation/ผู้ดูแล หากต้องการ House Wall
- [ ] ตั้งรหัสผ่านของบัญชี Supabase Auth `drvvdre@gmail.com` ผ่าน `/admin/forgot-password` แล้วทดสอบการเข้า admin จริง
