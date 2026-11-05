import Image from "next/image";
import type { PublicContent } from "@/lib/public-content";
import { siteContent } from "@/data/site";
import { BrandMark } from "@/components/ui/BrandMark";
import { CheerBookReader } from "@/components/sections/CheerBookReader";

export function Manifesto() {
  return <section className="manifesto" id="manifesto" aria-labelledby="manifesto-title">
    <p className="editorial-label">03 / OUR HOUSE</p>
    <div className="manifesto__outline" aria-hidden="true">WIT BEYOND<br />MEASURE</div>
    <h2 id="manifesto-title" className="sr-only">คำประกาศของบ้านสีฟ้า</h2>
    <blockquote>{siteContent.manifesto.map((line) => <span key={line}>{line}</span>)}</blockquote>
    <span className="manifesto__foot editorial-label">BBV / BLUE HOUSE / 2026</span>
  </section>;
}

export function People({ people }: { people: PublicContent["people"] }) {
  const leadership = (["president", "vice_president_1", "vice_president_2"] as const)
    .map((slot) => people.find((person) => person.slot === slot))
    .filter((person): person is PublicContent["people"][number] => Boolean(person));
  return <section className="people" id="people" aria-labelledby="people-title">
    <div className="people__top editorial-label"><span>05 / MEET THE HOUSE</span><span>THE PEOPLE BEHIND THE BLUE</span></div>
    <h2 id="people-title">THE<br /><span>HOUSE.</span></h2>
    {leadership.length > 0 ? <div className="people__list">{leadership.map((person, index) => <figure key={person.id} className={`people__figure${person.slot === "president" ? " people__figure--feature" : ""}`}>
      <figcaption><span className="editorial-label">FIG. {String(index + 1).padStart(3, "0")}</span><b className="people__role">{person.role}</b><strong>{person.name}</strong>{person.quote && <q>{person.quote}</q>}</figcaption>
      <div className="people__portrait"><Image src={person.portraitUrl} alt={`ภาพของ ${person.name}`} width={1200} height={1500} sizes="(max-width: 768px) 68vw, (max-width: 1400px) 40vw, 570px" /></div>
    </figure>)}</div> : <div className="people__pending"><span className="people__empty-frame" aria-hidden="true" /><p>รายชื่อและภาพผู้นำบ้านสีฟ้า<br />จะปรากฏเมื่อได้รับการยืนยัน</p><span className="editorial-label">PORTRAITS / PENDING</span></div>}
  </section>;
}

export function Cheerleaders({ people }: { people: PublicContent["people"] }) {
  const standHead = people.find((person) => person.slot === "stand_head");
  return <section className="cheerleaders" id="cheerleaders" aria-labelledby="cheerleaders-title">
    <p className="editorial-label">06 / BLUE STAND</p>
    <h2 id="cheerleaders-title">MAKE<br /><span>SOME</span><br />NOISE.</h2>
    <div className="cheerleaders__rule" aria-hidden="true">RAVENCLAW / RAVENCLAW / RAVENCLAW</div>
    {standHead ? <div className="cheerleaders__people"><figure><Image src={standHead.cutoutUrl ?? standHead.portraitUrl} alt={`ภาพของ ${standHead.name}`} width={900} height={1200} sizes="(max-width: 768px) 72vw, 300px" /><figcaption><span className="editorial-label">HEAD OF BLUE STAND</span><b className="people__role">{standHead.role}</b><strong>{standHead.name}</strong></figcaption></figure></div> : <p className="cheerleaders__pending">เสียงของบ้านสีฟ้ากำลังเตรียมพร้อม<br /><span>หัวหน้าสแตนด์ / รอการยืนยัน</span></p>}
  </section>;
}

export function Athletes({ sports, people }: { sports: PublicContent["sports"]; people: PublicContent["people"] }) {
  const sportsHead = people.find((person) => person.slot === "sports_head");
  return <section className="athletes" id="athletes" aria-labelledby="athletes-title">
    <div className="athletes__top editorial-label"><span>07 / THE FIELD</span><span>BLUE HOUSE / SPORTS DAY</span></div>
    <h2 id="athletes-title"><span>FASTER</span><span>HIGHER</span><strong>BLUE.</strong></h2>
    <div className="athletes__content">
      {sportsHead && <div className="athletes__people"><figure><Image src={sportsHead.portraitUrl} alt={`ภาพของ ${sportsHead.name}`} width={1200} height={1500} sizes="(max-width: 899px) 48vw, 300px" /><figcaption><span className="editorial-label">HEAD OF THE FIELD</span><b className="people__role">{sportsHead.role}</b><strong>{sportsHead.name}</strong></figcaption></figure></div>}
      {sports.length > 0 ? <div className="athletes__sports">{sports.map((sport, index) => <div key={sport.id}><span>{String(index + 1).padStart(2, "0")}</span><strong>{sport.name}</strong><span>{sport.description}</span></div>)}</div> : null}
    </div>
    <span className="athletes__number" aria-hidden="true">07</span>
  </section>;
}

export function Schedule({ schedule }: { schedule: PublicContent["schedule"] }) {
  return <section className="schedule-preview" id="schedule" aria-labelledby="schedule-title">
    <div className="schedule-preview__heading"><p className="editorial-label">08 / THE GAMES</p><h2 id="schedule-title">THE<br />SCHEDULE</h2></div>
    {schedule.length > 0 ? <ol className="schedule-preview__timeline">{schedule.map((item) => <li key={item.id}><time dateTime={`${item.date}T${item.time}`}>{item.time}</time><div><small>{item.date}</small><strong>{item.title}</strong><span>{item.location}</span></div></li>)}</ol> : <div className="schedule-preview__status" role="status"><span className="editorial-label">OFFICIAL PROGRAMME / PENDING</span><p>{siteContent.schedulePending}</p><span className="schedule-preview__figure editorial-label" aria-hidden="true">FIG. 08</span></div>}
  </section>;
}

export function Standing({ standings }: { standings: PublicContent["standings"] }) {
  if (standings.length === 0) return null;
  return <section className="standing" aria-labelledby="standing-title"><p className="editorial-label">09 / HOUSE STANDING</p><h2 id="standing-title">THE<br />STANDING</h2><ol>{standings.map((house) => <li key={house.id}><span>{String(house.rank).padStart(2, "0")}</span><strong>{house.house}</strong><span>{house.score}</span></li>)}</ol></section>;
}

export function Moments({ moments }: { moments: PublicContent["moments"] }) {
  return <section className="moments" id="moments" aria-labelledby="moments-title">
    <p className="editorial-label">10 / MOMENTS</p><h2 id="moments-title">FROM<br /><span>THE FIELD.</span></h2>
    {moments.length > 0 ? <div className={`moments__gallery${moments.length === 1 ? " moments__gallery--single" : ""}`} aria-label={`ภาพกิจกรรม ${moments.length} ภาพ`}>{moments.map((moment, index) => <figure key={moment.id}><Image src={moment.imageUrl} alt={moment.caption} width={1600} height={1100} sizes="(max-width: 768px) 90vw, (max-width: 1200px) 48vw, 700px" /><figcaption><span>FIG. {String(index + 1).padStart(3, "0")}</span><span>{moment.caption}</span>{moment.credit && <span>{moment.credit}</span>}</figcaption></figure>)}</div> : <div className="moments__pending"><span className="moments__frame" aria-hidden="true" /><p>ภาพจากวันงานจะถูกรวบรวมไว้ที่นี่</p><span className="editorial-label">THE ARCHIVE / WAITING FOR ITS FIRST FRAME</span></div>}
  </section>;
}

export function CheerBook({ cheers }: { cheers: PublicContent["cheers"] }) {
  return <section className="cheer-book" id="cheer-book" aria-labelledby="cheer-book-title"><div className="cheer-book__left"><p className="editorial-label">11 / BLUE STAND</p><h2 id="cheer-book-title">THE<br />CHEER<br /><span>BOOK.</span></h2></div><div className="cheer-book__right"><span className="editorial-label">SONGS / CHANTS / INSTRUCTIONS</span>{cheers.length > 0 ? <CheerBookReader cheers={cheers.toSorted((a, b) => a.order - b.order)} /> : <p>เพลงเชียร์และคำแนะนำสำหรับสแตนด์สีฟ้าจะเผยแพร่เมื่อได้รับข้อมูลที่ยืนยันแล้ว</p>}<span className="cheer-book__rule" aria-hidden="true" /></div></section>;
}

export function Announcements({ announcements }: { announcements: PublicContent["announcements"] }) {
  if (announcements.length === 0) return null;
  return <section className="announcements" id="announcements" aria-labelledby="announcements-title"><p className="editorial-label">BLUE HOUSE / BULLETIN</p><h2 id="announcements-title">ประกาศ</h2><div>{announcements.map((item) => <article key={item.id}><h3>{item.title}</h3><p>{item.body}</p>{item.publishedAt && <time dateTime={item.publishedAt}>{new Intl.DateTimeFormat("th-TH", { dateStyle: "medium", timeZone: "Asia/Bangkok" }).format(new Date(item.publishedAt))}</time>}</article>)}</div></section>;
}

export function FinalScene() {
  return <section className="final-scene" id="final" aria-labelledby="final-title"><div className="final-scene__top editorial-label"><span>14 / RAVENCLAW</span><span>THE HOUSE OF MINDS</span></div><BrandMark kind="crest" tone="bronze" className="final-scene__art" /><h2 id="final-title"><span>ONE HOUSE.</span><span>ONE BLUE.</span><strong>RAVENCLAW.</strong></h2><p className="editorial-label">BANGPAKONG &quot;BOWONWITTAYAYON&quot; SCHOOL / SPORTS DAY 2026</p></section>;
}
