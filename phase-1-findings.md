# Phase 1 findings — Ravenclaw / Blue House Sports Day

ตรวจเมื่อ 27 ก.ย. 2026 เอกสารนี้เป็นผลสำรวจเพื่อเริ่ม implementation; ข้อกำหนดหลักยังอยู่ใน [AGENTS.md](./AGENTS.md), รายละเอียดภาพอยู่ใน [design.md](./design.md), คำตอบเจ้าของโปรเจกต์อยู่ใน [knowledge.md](./knowledge.md)

## 1. สถานะ repo และ dependency

- โปรเจกต์เป็น App Router starter: `src/app/page.tsx`, `layout.tsx`, `globals.css` ยังเป็นหน้า Create Next App; หน้า starter อ้าง `/next.svg` และ `/vercel.svg` ซึ่งถูกลบออกแล้ว
- `package.json`: Next.js `16.3.6`, React `19.2.8`, TypeScript, Tailwind CSS `4`; ยังไม่มี GSAP, Lenis หรือ Supabase SDK
- `next.config.ts` ยังไม่มี image host / cache config; `.env*` ยังไม่มีใน root และ `.gitignore` ไม่ติดตามไฟล์ env
- `layout.tsx` ยังตั้ง `lang="en"` และ metadata แบบ starter; favicon starter ถูกลบแล้ว
- โครงสร้าง Git มีการแก้ `AGENTS.md`, ลบ starter assets และเพิ่ม `design.md`, `knowledge.md`, `phase.md`, `people/`, `public/hero/` อยู่ก่อน Phase 1; รักษาการเปลี่ยนแปลงนี้ไว้
- ไม่มีบุคคล กีฬา ตารางแข่ง แกลเลอรี หรือระบบ admin ในโค้ดปัจจุบัน

## 2. คู่มือ Next.js 16 ที่อ่านจากแพ็กเกจที่ติดตั้ง

คู่มืออยู่ใน `node_modules/next/dist/docs/` ของโปรเจกต์นี้ ไม่อาศัยความจำจาก Next.js เวอร์ชันเก่า

| เรื่อง | สิ่งที่ต้องใช้กับโปรเจกต์ | คู่มือในแพ็กเกจ |
| --- | --- | --- |
| App Router / โครงสร้าง | `src/app` ใช้ได้; `page.tsx` เปิด route, `layout.tsx` ครอบ route, `route.ts` ใช้ API และอยู่ระดับเดียวกับ `page.tsx` ไม่ได้ | `01-app/01-getting-started/02-project-structure.md`, `15-route-handlers.md` |
| Server / Client Components | หน้าและ layout เป็น Server Components โดยปริยาย; แยก GSAP, Lenis, เมนูและ form interactive เป็น client boundary เล็ก ๆ | `01-app/01-getting-started/05-server-and-client-components.md` |
| ดึงข้อมูล | ดึง published content ใน Server Components; `fetch` ไม่ cache โดยปริยาย; แยกงานช้าด้วย Suspense ตามความจำเป็น | `01-app/01-getting-started/06-fetching-data.md` |
| แก้ข้อมูล | Server Functions/Actions รับ POST จากภายนอกได้โดยตรง จึงต้องตรวจ auth และสิทธิ์ภายใน **ทุก** mutation | `01-app/01-getting-started/07-mutating-data.md`, `01-app/02-guides/authentication.md` |
| Auth / route guard | ใช้ data access layer ตรวจ session ใกล้ข้อมูล; layout หรือ Proxy อย่างเดียวไม่ป้องกันข้อมูล; `cookies()` เป็น async | `01-app/02-guides/authentication.md`, `01-app/01-getting-started/16-proxy.md`, `01-app/03-api-reference/04-functions/cookies.md` |
| Proxy | Next.js 16 เรียก Middleware ว่า Proxy และใช้ `proxy.ts`; เหมาะกับ redirect เบื้องต้น ไม่ใช่จุด authorization หลัก | `01-app/01-getting-started/16-proxy.md` |
| Cache | `cacheComponents` เป็น opt-in และยังไม่เปิดใน `next.config.ts`; จึงใช้แนวทาง caching แบบไม่เปิด Cache Components ก่อน และกำหนด revalidation ตามข้อมูลจริง | `01-app/01-getting-started/08-caching.md`, `01-app/02-guides/caching-without-cache-components.md` |
| ภาพ | static asset ใน `public/` อ้างด้วย `/...`; ภาพ Supabase ต้องกำหนด `images.remotePatterns` ให้เจาะจง host/path เมื่อทราบโปรเจกต์; ใส่ `sizes` ให้ภาพ responsive | `01-app/01-getting-started/12-images.md`, `01-app/03-api-reference/02-components/image.md`, `01-app/03-api-reference/03-file-conventions/public-folder.md` |
| Image deprecation | `next/image` ใน Next.js 16 เลิกแนะนำ `priority` ให้ใช้ `preload` หรือ `loading="eager"` / `fetchPriority="high"` ตามกรณี; `onLoadingComplete` deprecated ให้ใช้ `onLoad` | `01-app/03-api-reference/02-components/image.md` |
| Font / metadata | ใช้ `next/font` ที่ root layout; metadata export อยู่ใน Server Component; App Router ใช้ metadata file conventions สำหรับ favicon/OG | `01-app/01-getting-started/13-fonts.md`, `14-metadata-and-og-images.md` |

หมายเหตุ: ก่อนลงมือกับ API ที่เฉพาะเจาะจง เช่น Supabase SSR, Storage หรือ GSAP ให้ตรวจเอกสารของแพ็กเกจเวอร์ชันที่จะติดตั้งเพิ่มเติม ณ ขั้น implementation

## 3. Asset inventory

| ไฟล์ | ขนาดภาพ | ใช้ทำอะไร | สถานะ |
| --- | --- | --- | --- |
| `public/hero/eagle-master.png` | 1152×1536 RGB, ~2.0 MB | ภาพนกอินทรีพร้อมพื้นหลัง | เจ้าของโปรเจกต์อนุมัติเป็นภาพหลัก |
| `public/hero/eagle-master-rmbg.png` | 1152×1536 RGBA, ~1.5 MB | ภาพนกอินทรีตัดพื้นหลังสำหรับการซ้อนชั้น | อนุมัติ |
| `public/hero/eagle-close.png` | 1086×1448 RGB, ~2.4 MB | ภาพครอปใกล้พร้อมพื้นหลัง | อนุมัติ |
| `public/hero/eagle-close-rmbg.png` | 1086×1448 RGBA, ~2.1 MB | ภาพครอปใกล้ตัดพื้นหลัง | อนุมัติ |
| `people/people.jpg` | 6000×4000 JPEG, ~6.3 MB | ภาพบุคคลสำหรับ development preview | placeholder เท่านั้น; ไม่ใช่นักเรียนจริง; สิทธิ์ใช้เผยแพร่ยังไม่ยืนยัน |
| `people/peoplermbg.png` | 612×408 RGBA, ~256 KB | ภาพบุคคลตัดพื้นหลังสำหรับ development preview | placeholder เท่านั้น; ความละเอียดต่ำสำหรับองค์ประกอบขนาดใหญ่ |

`people/` อยู่ที่ root ไม่ใช่ `public/` จึงยังใช้เป็น public URL ตรง ๆ ไม่ได้ การทำ preview ใน Phase 3 ต้องเลือกวิธีนำภาพเข้า UI ที่ระบุสถานะ demo ชัดเจน โดยไม่คัดลอกเป็นไฟล์แยกตามบทบาท ภาพจริงของคนและ Moments จะอยู่ใน Supabase Storage; Hero และกราฟิกที่ล็อก composition อยู่ในโปรเจกต์

ยังไม่มี emblem/logo บ้านสีฟ้า, constellation SVG, texture ที่เลือกใช้, ภาพนักเรียนจริง, ภาพกีฬา, ภาพงาน, หรือผังโรงเรียน

## 4. Content inventory และพฤติกรรมบนหน้า public

| ฉาก | ข้อมูลที่ยืนยันแล้ว | ก่อนมีข้อมูลเพิ่ม |
| --- | --- | --- |
| Invitation / Hero | ชื่อแคมเปญ, โรงเรียน, ปี 2026, ภาพนกอินทรี 4 ไฟล์ | ทำได้จาก asset จริง; ไม่ระบุวันที่จัดที่ยังไม่ยืนยัน |
| Sorting / Values | ข้อความและคุณค่าตาม `AGENTS.md` / `design.md` | ทำเป็น content/editorial scene ได้ |
| Manifesto | เจ้าของโปรเจกต์ให้ข้อความไทย 3 บรรทัดแล้ว | ใช้ข้อความที่ให้มา |
| People | เป้าหมายจำนวน 1 ประธาน, 2 รอง, 3 ทีมงาน; ยังไม่มีชื่อ/ภาพจริง | ซ่อนรายชื่อที่ยังไม่มี published record; ใช้ seed 6 คนเฉพาะ demo preview |
| Cheerleaders | เป้าหมาย 3 คน; ยังไม่มีชื่อ/ภาพจริง | ซ่อนรายชื่อ; ใช้ seed 3 คนเฉพาะ demo preview |
| Athletes | เป้าหมาย 3 คน; ยังไม่มีชื่อ/กีฬา/ภาพจริง | ซ่อนรายชื่อและประเภทกีฬาที่ยังไม่ยืนยัน; ใช้ seed 3 คนเฉพาะ demo preview |
| Games / Schedule | ยังไม่ยืนยันวัน เวลา โปรแกรม และสถานที่ | แสดงสถานะ `รอกำหนดการอย่างเป็นทางการ`; ไม่มีรายการแข่งขันสมมติ |
| House Standing | ตั้งใจให้ admin กรอกคะแนน แต่ยังไม่มีคะแนนจริง | ซ่อน scoreboard จาก public; demo scores ดูได้ใน preview ที่ระบุว่า demo เท่านั้น |
| Moments | ยังไม่มีภาพกิจกรรม | แสดง waiting composition เช่น `MEMORIES LOADING…` |
| Cheer Book / Blue Stand | ยังไม่มีเพลง คำเชียร์ dress code หรือประกาศ | แสดงสถานะรอข้อมูล; ไม่ทำรายการปลอม |
| Venue Map | ยังไม่มีผังโรงเรียน/พื้นที่งาน | แสดงสถานะรอผังที่ยืนยัน; ไม่วาดตำแหน่งเอง |
| House Wall | ยังไม่มี workflow moderation; optional | ซ่อนจนมีระบบพร้อม |
| Final / Footer | ข้อความจบตาม design, ชื่อโรงเรียนที่ยืนยัน, Instagram `bbv_ravenclaw_blue` | ทำได้; เครดิตที่ยังไม่มีไม่แต่งขึ้น |

หน้า public มีลำดับฉากครบตามแนวคิด แต่ฉากที่ไม่มีข้อมูลจริงต้องใช้ waiting composition หรือซ่อนรายการภายในฉาก การไม่มี record ต้องไม่สร้าง 12 โปรไฟล์อัตโนมัติ Seed จำลองใช้หลังมีฐานข้อมูลเพื่อดู layout ใน development/demo preview และต้องแยกจากข้อมูลที่เผยแพร่จริง

## 5. Dependency ที่ยังเปิดอยู่

- Supabase project, URL, publishable key และการตั้งค่า Storage/Auth ยังไม่มี; อย่าเก็บ shared password หรือ secret ใน Markdown/Git
- วันจัดงานยังไม่ยืนยัน แม้ปีของแคมเปญคือ 2026
- รายชื่อจริง, ภาพบุคคลจริง, ชนิดกีฬา, ตารางแข่ง, เพลงเชียร์ และแผนที่ยังไม่มา
- Emblem/logo บ้านสีฟ้ายังไม่มี; ภาพ eagle หลักมีแล้ว
- Scoreboard ต้องมีคะแนนที่ผู้ดูแลรับรองก่อนแสดงบน public; House Wall ต้องมี moderation ก่อนเปิด
- การใช้ภาพ `people.jpg` นอก development preview ต้องได้รับการยืนยันสิทธิ์ก่อน

## 6. จุดตรวจและลำดับลงมือทำ

1. **Foundation:** font ไทย/อังกฤษ, token, metadata, navigation, reduced motion, image strategy, ขอบเขต server/client
2. **Prototype A — Hero → Sorting:** desktop 1440×900, mobile 375×812 และ 320×568; ตรวจ first frame, การ crop, scroll, reduced motion
3. **Prototype B — Eagle / Values:** desktop และ mobile; ตรวจ 4 สถานะที่ต่างกัน, ระยะ pin, fallback แบบไม่ pin
4. **Prototype C — People / Athletes:** ใช้ demo preview ที่ระบุชัด; ตรวจภาพทับ typography, crop, empty state และการสลับเป็นภาพจริง
5. **Full narrative:** ต่อทุกฉากโดยคง utility sections ให้อ่านได้ทันที
6. **Admin + Supabase:** ทำ content model, auth, Storage, seed demo, CRUD และ publication flow; ทดสอบว่าหน้า public ไม่เห็น draft/demo
7. **Real content + QA:** เปลี่ยนข้อมูลผ่าน admin, ตรวจหลายขนาดจอ, keyboard, reduced motion, performance และ production build

จุดตรวจทุก prototype: ทดสอบที่ 320, 375, 414, 768, 1024, 1440, 1728px เมื่อขยายไป full page; สำหรับ prototype ขั้นแรกใช้ desktop/mobile/จอเตี้ยที่ระบุข้างต้นและตรวจซ้ำหลังประกอบทุกฉาก
