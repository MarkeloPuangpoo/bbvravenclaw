import Image from "next/image";
import { connection } from "next/server";
import { heroArtwork } from "@/data/media";
import { siteContent } from "@/data/site";
import { SceneMotion } from "@/components/motion/SceneMotion";
import { Invitation } from "@/components/motion/Invitation";
import { Announcements, Athletes, CheerBook, Cheerleaders, FinalScene, Manifesto, Moments, People, Schedule, Standing, Venue } from "@/components/sections/Narrative";
import { BrandMark } from "@/components/ui/BrandMark";
import { HouseDiadem } from "@/components/three/HouseDiadem";
import { getPublicContent } from "@/lib/public-content";

export default async function Home() {
  await connection();
  const content = await getPublicContent();
  return (
    <main id="main-content" tabIndex={-1}>
      <Invitation />
      <SceneMotion />
      <section className="hero" id="house" aria-labelledby="hero-title">
        <div className="hero__fine-rule" aria-hidden="true" />
        <p className="hero__index editorial-label">01 / THE HOUSE OF MINDS</p>
        <div className="hero__school editorial-label">
          <span>{siteContent.school.th}</span>
          <span>BBV / SPORTS DAY 2026</span>
        </div>
        <div className="hero__composition">
          <span className="hero__star-chart" aria-hidden="true" />
          <h1 className="hero__title" id="hero-title">
            <span>RAVEN</span>
            <span>CLAW</span>
          </h1>
          <div className="hero__artifact">
            <Image
              src={heroArtwork.src}
              width={heroArtwork.width}
              height={heroArtwork.height}
              alt={heroArtwork.alt}
              sizes="(max-width: 768px) 84vw, 42vw"
              fetchPriority="high"
              loading="eager"
              className="hero__eagle"
            />
          </div>
        </div>
        <p className="hero__values editorial-label">WIT · LEARNING · WISDOM</p>
        <a className="hero__scroll editorial-label" href="#sorting">
          <span>ENTER THE HOUSE</span>
          <span aria-hidden="true">↓</span>
        </a>
        <p className="hero__year" aria-hidden="true">MMXXVI</p>
      </section>

      <section className="sorting" id="sorting" aria-labelledby="sorting-title">
        <span className="sorting__instrument" aria-hidden="true" />
        <p className="sorting__index editorial-label">02 / THE SORTING</p>
        <div className="sorting__crest" aria-hidden="true"><Image src="/assets/brand/ravenclaw-mark-primarycrest-rmbg.png?v=transparent" width={6250} height={6250} alt="" sizes="(max-width: 768px) 54vw, 26vw" loading="lazy" /></div>
        <div className="sorting__copy">
          <p className="sorting__first">NOT EVERYONE<br />BELONGS HERE.</p>
          <HouseDiadem className="sorting__diadem" />
          <h2 id="sorting-title"><span>YOU DO.</span><strong>RAVENCLAW</strong></h2>
        </div>
        <div className="sorting__metadata editorial-label">
          <span>HOUSE / BLUE</span><span>ELEMENT / AIR</span><span>VALUES / WIT · WISDOM · CREATIVITY</span>
        </div>
      </section>

      <Manifesto />

      <section className="values" id="values" aria-labelledby="values-title">
        <span className="values__tint values__tint--parchment" aria-hidden="true" />
        <span className="values__tint values__tint--raven" aria-hidden="true" />
        <span className="values__tint values__tint--midnight" aria-hidden="true" />
        <span className="values__diagram" aria-hidden="true" />
        <div className="values__top editorial-label"><span>04 / THE EAGLE</span><span>THE HOUSE OF MINDS</span></div>
        <h2 id="values-title" className="sr-only">หลักของบ้านสีฟ้า</h2>
        <div className="values__art" aria-hidden="true">
          <div className="values__orbit" />
          <Image src="/hero/eagle-close-rmbg.png" alt="" width={1086} height={1448} sizes="(max-width: 899px) 80vw, 48vw" loading="lazy" />
        </div>
        <div className="values__states">
          <div className="values__state values__state--wisdom"><span className="editorial-label">I / MIND</span><p>WISDOM</p><small>คิดให้ไกลกว่าขอบสนาม</small></div>
          <div className="values__state values__state--creativity"><span className="editorial-label">II / VISION</span><p>CREATIVITY</p><small>มองเห็นทางที่ยังไม่มีใครเห็น</small></div>
          <div className="values__state values__state--ambition"><span className="editorial-label">III / DRIVE</span><p>AMBITION</p><small>ก้าวต่อไปด้วยความตั้งใจ</small></div>
          <div className="values__state values__state--unity"><span className="editorial-label">IV / TOGETHER</span><p>UNITY</p><small>หนึ่งบ้าน หนึ่งเสียง หนึ่งสีฟ้า</small></div>
        </div>
        <span className="values__foot editorial-label" aria-hidden="true">RAVENCLAW / MMXXVI</span>
      </section>

      <People people={content.people} />
      <Cheerleaders people={content.people} />
      <Athletes sports={content.sports} people={content.people} />
      <Schedule schedule={content.schedule} />
      <Standing standings={content.standings} />
      <Moments moments={content.moments} />
      <CheerBook cheers={content.cheers} />
      <Announcements announcements={content.announcements} />
      <Venue />
      <FinalScene />

      <footer className="site-footer">
        <div className="site-footer__top editorial-label">
          <span>THE HOUSE OF MINDS</span>
          <span>BBV / SPORTS DAY 2026</span>
        </div>
        <div className="site-footer__main">
          <div className="site-footer__identity">
            <BrandMark kind="mini" tone="bronze" className="site-footer__mark" />
            <div>
              <p className="site-footer__name">Ravenclaw<span>BLUE HOUSE</span></p>
              <p className="site-footer__school">{siteContent.school.th}</p>
              <p className="site-footer__school-en">{siteContent.school.en}</p>
            </div>
          </div>
          <a className="site-footer__social" href={siteContent.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram ของ Ravenclaw Blue House (เปิดแท็บใหม่)">
            <span className="editorial-label">FOLLOW THE HOUSE</span>
            <span>INSTAGRAM <span aria-hidden="true">↗</span></span>
          </a>
        </div>
        <div className="site-footer__bottom editorial-label">
          <span>WIT · LEARNING · WISDOM</span>
          <span>SPORTS DAY / MMXXVI</span>
          <a href="#house">BACK TO TOP <span aria-hidden="true">↑</span></a>
        </div>
      </footer>
    </main>
  );
}
