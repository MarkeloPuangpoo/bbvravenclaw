import Image from "next/image";
import { notFound } from "next/navigation";
import portrait from "../../../../people/people.jpg";
import cutout from "../../../../people/peoplermbg.png";
import { PeoplePreviewMotion } from "@/components/motion/PeoplePreviewMotion";

export default function PeoplePreview() {
  if (process.env.NODE_ENV !== "development") notFound();

  return (
    <main id="main-content" className="people-preview">
      <PeoplePreviewMotion />
      <div className="people-preview__notice editorial-label">DESIGN DEMO / ภาพสาธิต ไม่ดึงข้อมูลจาก admin</div>
      <section className="people-preview__scene people-preview__scene--president" aria-labelledby="preview-president">
        <p className="people-preview__index editorial-label">05 / MEET THE HOUSE · FIG. 001</p>
        <div className="people-preview__photo">
          <Image src={portrait} alt="ภาพบุคคลตัวอย่างสำหรับทดสอบองค์ประกอบ ยังไม่ใช่ภาพนักเรียนจริง" sizes="(max-width: 768px) 100vw, 65vw" priority />
        </div>
        <div className="people-preview__text">
          <span className="editorial-label">HOUSE LEADERSHIP / DEMO</span>
          <h1 id="preview-president">THE<br />PRESIDENT</h1>
          <p>รอชื่อและภาพบุคคลจริงจากผู้ดูแลระบบ</p>
        </div>
        <span className="people-preview__side editorial-label">BLUE HOUSE / MMXXVI</span>
      </section>
      <section className="people-preview__scene people-preview__scene--leadership" aria-labelledby="preview-leadership">
        <p className="people-preview__index editorial-label">05 / MEET THE HOUSE · FIG. 002</p>
        <div className="people-preview__word" aria-hidden="true">TOGETHER</div>
        <div className="people-preview__cutout">
          <Image src={cutout} alt="ภาพตัดพื้นหลังตัวอย่างสำหรับทดสอบเลเยอร์ ยังไม่ใช่ภาพนักเรียนจริง" sizes="(max-width: 768px) 190vw, 115vw" loading="eager" />
        </div>
        <div className="people-preview__text">
          <span className="editorial-label">LEADERSHIP / DEMO</span>
          <h2 id="preview-leadership">THE<br />TEAM</h2>
          <p>ภาพนี้ใช้ทดสอบการซ้อนตัวอักษรและภาพเท่านั้น</p>
        </div>
      </section>
    </main>
  );
}
