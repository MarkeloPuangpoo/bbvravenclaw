import Link from "next/link";
import { BrandMark } from "@/components/ui/BrandMark";

type Props = {
  title: string;
  lead: string;
  children: React.ReactNode;
  /** Optional link under the form, e.g. back to login. */
  footer?: React.ReactNode;
};

export function AuthFrame({ title, lead, children, footer }: Props) {
  return (
    <div className="adm adm-auth">
      <div className="adm-auth__brand">
        <BrandMark kind="crest" tone="bronze" className="adm-auth__crest" />
        <p className="adm-auth__name">Blue House</p>
        <p className="adm-auth__school">โรงเรียนบางปะกง “บวรวิทยายน” · Sports Day 2026</p>
      </div>
      <main className="adm-auth__panel" id="main-content" tabIndex={-1}>
        <h1>{title}</h1>
        <p className="adm-auth__lead">{lead}</p>
        {children}
        <p className="adm-auth__footer">
          {footer}
          <Link href="/">กลับไปหน้าเว็บ</Link>
        </p>
      </main>
    </div>
  );
}
