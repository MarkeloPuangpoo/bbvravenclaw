"use client";

import { useActionState, useEffect, useId, useRef, useState, startTransition, type FormEvent } from "react";
import Image from "next/image";
import type { Field } from "@/lib/admin/sections";
import type { SaveState } from "@/app/admin/actions";

const MAX_IMAGE_BYTES = 12 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

type Values = Record<string, string | boolean>;

type Props = {
  section: string;
  noun: string;
  fields: readonly Field[];
  required: readonly string[];
  /** Initial input values, already formatted for the form controls. */
  values: Values;
  recordId: string | null;
  status: "draft" | "published";
  sortOrder: number;
  hasSortOrder: boolean;
  sports: { id: string; name: string }[];
  imageUrls: Record<string, string>;
  /** Homepage slots already held by another published person. */
  slotTaken: Record<string, string>;
  action: (previous: SaveState, form: FormData) => Promise<SaveState>;
};

export function RecordForm({ section, noun, fields, required, values, recordId, status, sortOrder, hasSortOrder, sports, imageUrls, slotTaken, action }: Props) {
  const formId = useId();
  const form = useRef<HTMLFormElement>(null);
  const alert = useRef<HTMLDivElement>(null);
  const dirty = useRef(false);
  const [state, formAction, isPending] = useActionState(action, { error: null });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dirtyShown, setDirtyShown] = useState(false);
  const [intent, setIntent] = useState<"draft" | "published" | null>(null);
  const [previews, setPreviews] = useState<Record<string, string>>({});

  const markDirty = () => {
    dirty.current = true;
    setDirtyShown(true);
  };

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (!dirty.current) return;
      event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);

  useEffect(() => {
    if (!state.error) return;
    dirty.current = true;
    alert.current?.focus();
  }, [state]);

  useEffect(() => () => Object.values(previews).forEach((url) => URL.revokeObjectURL(url)), [previews]);

  const label = (name: string) => fields.find((field) => field.name === name)?.label ?? name;

  function validate(data: FormData, next: "draft" | "published") {
    const found: Record<string, string> = {};
    for (const field of fields) {
      if (field.kind !== "image") continue;
      const file = data.get(field.name);
      if (file instanceof File && file.size > 0) {
        if (!IMAGE_TYPES.includes(file.type)) found[field.name] = "ไฟล์ต้องเป็น JPG, PNG, WebP หรือ AVIF";
        else if (file.size > MAX_IMAGE_BYTES) found[field.name] = "ไฟล์ใหญ่เกิน 12 MB ลดขนาดภาพแล้วเลือกใหม่";
      }
    }
    if (next === "published") {
      for (const name of required) {
        if (found[name]) continue;
        const field = fields.find((item) => item.name === name);
        if (!field) continue;
        if (field.kind === "image") {
          const file = data.get(name);
          const has = (file instanceof File && file.size > 0) || Boolean(values[name]);
          if (!has) found[name] = `เลือก${field.label}ก่อนเผยแพร่`;
        } else if (field.kind === "checkbox") {
          if (data.get(name) !== "on") found[name] = `ติ๊ก “${field.label}” ก่อนเผยแพร่`;
        } else if (!String(data.get(name) ?? "").trim()) {
          found[name] = `กรอก${field.label}ก่อนเผยแพร่`;
        }
      }
      if (section === "people") {
        if (data.get("is_demo") === "on") found.is_demo = "ข้อมูลตัวอย่างเผยแพร่ไม่ได้ ใส่ข้อมูลจริงแล้วเอาติ๊กนี้ออก";
        const slot = String(data.get("homepage_slot") ?? "");
        if (slot && slotTaken[slot]) found.homepage_slot = `ตำแหน่งนี้มี ${slotTaken[slot]} เผยแพร่อยู่ เปลี่ยนคนนั้นเป็นฉบับร่างก่อน หรือเลือกตำแหน่งอื่น`;
      }
    }
    return found;
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPending) return;
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const next = submitter?.value === "published" ? "published" : "draft";
    const data = new FormData(event.currentTarget, submitter);
    const found = validate(data, next);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    dirty.current = false;
    setIntent(next);
    startTransition(() => formAction(data));
  }

  function onPick(field: Field, file: File | undefined) {
    markDirty();
    setPreviews((current) => {
      if (current[field.name]) URL.revokeObjectURL(current[field.name]);
      const rest = without(current, field.name);
      return file && IMAGE_TYPES.includes(file.type) ? { ...rest, [field.name]: URL.createObjectURL(file) } : rest;
    });
    setErrors((current) => without(current, field.name));
  }

  function renderField(field: Field) {
    const id = `${formId}-${field.name}`;
    const noteId = `${id}-note`;
    const error = errors[field.name];
    const isRequired = required.includes(field.name);
    const common = { id, name: field.name, "aria-invalid": error ? true : undefined, "aria-describedby": error ? noteId : undefined } as const;
    const text = typeof values[field.name] === "string" ? (values[field.name] as string) : "";
    const requiredMark = isRequired ? <span className="adm-field__req">ต้องมีก่อนเผยแพร่</span> : null;

    if (field.kind === "checkbox") {
      const note = field.name === "is_demo"
        ? "ใช้กับข้อมูลทดลองเท่านั้น เผยแพร่ไม่ได้จนกว่าจะเอาติ๊กออก"
        : field.name === "is_official" ? "คะแนนจะแสดงบนเว็บเมื่อเผยแพร่และติ๊กข้อนี้เท่านั้น" : null;
      return (
        <div className="adm-field adm-field--wide" key={field.name}>
          <label className="adm-check">
            <input {...common} type="checkbox" defaultChecked={values[field.name] === true} onChange={markDirty} />
            <span>{field.label}</span>
          </label>
          {(error || note) && <p id={noteId} className={error ? "adm-field__error" : "adm-field__hint"}>{error ?? note}</p>}
        </div>
      );
    }

    if (field.kind === "image") {
      const shown = previews[field.name] ?? imageUrls[field.name];
      const current = Boolean(values[field.name]);
      return (
        <div className="adm-field adm-field--wide" key={field.name}>
          <label htmlFor={id}>{field.label}{requiredMark}</label>
          <div className="adm-image">
            <div className="adm-image__frame" data-empty={shown ? undefined : true}>
              {shown ? <Image src={shown} alt={previews[field.name] ? `ตัวอย่างภาพใหม่: ${field.label}` : `ภาพปัจจุบัน: ${field.label}`} width={480} height={360} unoptimized /> : <span>ยังไม่มีภาพ</span>}
            </div>
            <div className="adm-image__control">
              <input {...common} type="file" accept={IMAGE_TYPES.join(",")} onChange={(event) => onPick(field, event.currentTarget.files?.[0])} />
              <p className="adm-field__hint">
                {previews[field.name] ? "ภาพนี้ยังไม่ถูกบันทึก กดบันทึกเพื่ออัปโหลด" : current ? "เลือกไฟล์ใหม่ถ้าต้องการเปลี่ยนภาพ" : "JPG, PNG, WebP หรือ AVIF ขนาดไม่เกิน 12 MB"}
              </p>
              {error && <p id={noteId} className="adm-field__error">{error}</p>}
            </div>
          </div>
        </div>
      );
    }

    const counter = field.max && (field.kind === "textarea" || !field.kind) ? <Counter fieldId={id} max={field.max} initial={text.length} /> : null;
    const hint = error ? <p id={noteId} className="adm-field__error">{error}</p> : null;
    const heading = <label htmlFor={id}>{field.label}{requiredMark}</label>;

    if (field.name === "sport_id") {
      return (
        <div className="adm-field" key={field.name}>
          {heading}
          <select {...common} defaultValue={text} onChange={markDirty}>
            <option value="">ไม่ระบุ</option>
            {sports.map((sport) => <option key={sport.id} value={sport.id}>{sport.name}</option>)}
          </select>
        </div>
      );
    }

    if (field.kind === "select") {
      return (
        <div className={`adm-field${field.name === "homepage_slot" ? " adm-field--wide" : ""}`} key={field.name}>
          {heading}
          <select {...common} defaultValue={text} onChange={markDirty}>
            {field.allowEmpty && <option value="">ไม่แสดงบนหน้าเว็บ</option>}
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {field.optionLabels?.[option] ?? option}{slotTaken[option] ? ` (ใช้อยู่: ${slotTaken[option]})` : ""}
              </option>
            ))}
          </select>
          {field.name === "homepage_slot" && !error && <p className="adm-field__hint">เลือกตำแหน่งแล้วเผยแพร่ คนนี้จึงจะขึ้นบนหน้าเว็บ ถ้าไม่เลือก จะเก็บไว้ใน admin เท่านั้น</p>}
          {hint}
        </div>
      );
    }

    if (field.kind === "textarea") {
      return (
        <div className="adm-field adm-field--wide" key={field.name}>
          {heading}
          <textarea {...common} defaultValue={text} maxLength={field.max} rows={field.name === "lyrics" || field.name === "body" ? 10 : 4} onChange={markDirty} />
          {counter}
          {hint}
        </div>
      );
    }

    const inputType = field.kind === "datetime" ? "datetime-local" : field.kind ?? "text";
    return (
      <div className="adm-field" key={field.name}>
        {heading}
        <input
          {...common}
          type={inputType}
          defaultValue={text}
          maxLength={field.max}
          min={field.kind === "number" ? 0 : undefined}
          step={field.kind === "number" ? 1 : undefined}
          inputMode={field.kind === "number" ? "numeric" : undefined}
          onChange={markDirty}
        />
        {field.kind === "datetime" && <p className="adm-field__hint">เวลาประเทศไทย</p>}
        {counter}
        {hint}
      </div>
    );
  }

  const published = status === "published";
  const errorNames = Object.keys(errors);
  return (
    <form ref={form} onSubmit={onSubmit} noValidate className="adm-form" aria-busy={isPending}>
      <input type="hidden" name="section" value={section} />
      {recordId && <input type="hidden" name="id" value={recordId} />}

      <div ref={alert} tabIndex={-1} role="alert" className="adm-notice adm-notice--error" hidden={!state.error && errorNames.length === 0}>
        {state.error ? <p>{state.error}</p> : (
          <>
            <p>ยังบันทึกไม่ได้ มีข้อมูลที่ต้องแก้ {errorNames.length} จุด</p>
            <ul>{errorNames.map((name) => <li key={name}>{label(name)}: {errors[name]}</li>)}</ul>
          </>
        )}
      </div>

      <div className="adm-fields">{fields.map(renderField)}</div>

      {hasSortOrder && (
        <details className="adm-more">
          <summary>ตั้งค่าการเรียงลำดับ</summary>
          <div className="adm-field">
            <label htmlFor={`${formId}-sort`}>ลำดับการแสดง</label>
            <input id={`${formId}-sort`} name="sort_order" type="number" inputMode="numeric" defaultValue={sortOrder} onChange={markDirty} aria-describedby={`${formId}-sort-note`} />
            <p id={`${formId}-sort-note`} className="adm-field__hint">เลขน้อยขึ้นก่อน ถ้าเลขเท่ากัน รายการที่สร้างก่อนขึ้นก่อน</p>
          </div>
        </details>
      )}

      <div className="adm-actionbar">
        <p className="adm-actionbar__state" role="status">
          {isPending ? "กำลังบันทึก…" : dirtyShown ? "มีการแก้ไขที่ยังไม่ได้บันทึก" : published ? "รายการนี้แสดงบนเว็บอยู่" : recordId ? "ฉบับร่าง ยังไม่แสดงบนเว็บ" : `${noun}ใหม่ ยังไม่ได้บันทึก`}
        </p>
        <div className="adm-actionbar__buttons">
          {published ? (
            <>
              <button type="submit" name="status" value="draft" className="adm-btn" aria-disabled={isPending}>{isPending && intent === "draft" ? "กำลังบันทึก…" : "เปลี่ยนเป็นฉบับร่าง"}</button>
              <button type="submit" name="status" value="published" className="adm-btn adm-btn--primary" aria-disabled={isPending}>{isPending && intent === "published" ? "กำลังบันทึก…" : "บันทึกการแก้ไข"}</button>
            </>
          ) : (
            <>
              <button type="submit" name="status" value="draft" className="adm-btn" aria-disabled={isPending}>{isPending && intent === "draft" ? "กำลังบันทึก…" : "บันทึกฉบับร่าง"}</button>
              <button type="submit" name="status" value="published" className="adm-btn adm-btn--primary" aria-disabled={isPending}>{isPending && intent === "published" ? "กำลังเผยแพร่…" : "เผยแพร่"}</button>
            </>
          )}
        </div>
      </div>
    </form>
  );
}

function without<T>(record: Record<string, T>, key: string) {
  return Object.fromEntries(Object.entries(record).filter(([name]) => name !== key)) as Record<string, T>;
}

/** Live character count driven by DOM input events, so typing never re-renders the whole form. */
function Counter({ fieldId, max, initial }: { fieldId: string; max: number; initial: number }) {
  const [length, setLength] = useState(initial);
  useEffect(() => {
    const element = document.getElementById(fieldId) as HTMLInputElement | HTMLTextAreaElement | null;
    if (!element) return;
    const update = () => setLength(element.value.length);
    element.addEventListener("input", update);
    return () => element.removeEventListener("input", update);
  }, [fieldId]);
  return <p className="adm-field__count" data-near={length > max * 0.9 || undefined}>{length}/{max}</p>;
}
