"use client";

import { useRef } from "react";
import { SubmitButton } from "@/components/admin/SubmitButton";

type Props = {
  action: (form: FormData) => void | Promise<void>;
  section: string;
  id: string;
  title: string;
  live: boolean;
};

export function ConfirmDelete({ action, section, id, title, live }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button type="button" className="adm-btn adm-btn--danger-quiet" onClick={() => dialog.current?.showModal()}>
        ลบรายการนี้
      </button>
      <dialog
        ref={dialog}
        className="adm-dialog"
        aria-labelledby={`delete-${id}`}
        onClick={(event) => { if (event.target === dialog.current) dialog.current?.close(); }}
      >
        <form action={action} className="adm-dialog__body">
          <input type="hidden" name="section" value={section} />
          <input type="hidden" name="id" value={id} />
          <h2 id={`delete-${id}`}>ลบ “{title}” หรือไม่</h2>
          <p>
            {live
              ? "รายการนี้แสดงบนเว็บอยู่ ถ้าลบ รายการจะหายจากเว็บทันทีและกู้คืนไม่ได้ ถ้าแค่ต้องการซ่อน ให้เปลี่ยนเป็นฉบับร่างแทน"
              : "รายการนี้ยังไม่แสดงบนเว็บ ถ้าลบ จะกู้คืนไม่ได้"}
          </p>
          <div className="adm-dialog__actions">
            <button type="button" className="adm-btn" autoFocus onClick={() => dialog.current?.close()}>ยกเลิก</button>
            <SubmitButton className="adm-btn adm-btn--danger" pendingLabel="กำลังลบ…">ลบรายการ</SubmitButton>
          </div>
        </form>
      </dialog>
    </>
  );
}
