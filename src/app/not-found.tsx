import Link from "next/link";
import { BrandMark } from "@/components/ui/BrandMark";

export default function NotFound() {
  return (
    <main className="not-found" id="main-content" tabIndex={-1}>
      <div className="not-found__top editorial-label"><span>RAVENCLAW / BLUE HOUSE</span><span>ERROR / 404</span></div>
      <BrandMark kind="crest" tone="bronze" className="not-found__mark" />
      <h1>PAGE<br /><span>NOT FOUND.</span></h1>
      <div className="not-found__bottom">
        <p>ไม่พบหน้าที่คุณต้องการ</p>
        <Link href="/">กลับหน้าแรก <span aria-hidden="true">↗</span></Link>
      </div>
    </main>
  );
}
