"use client";

import { useState } from "react";

type Props = {
  id: string;
  name: string;
  label: string;
  autoComplete: "current-password" | "new-password";
  hint?: string;
  error?: string;
  minLength?: number;
  maxLength?: number;
};

export function PasswordField({ id, name, label, autoComplete, hint, error, minLength, maxLength }: Props) {
  const [visible, setVisible] = useState(false);
  const noteId = `${id}-note`;
  return (
    <div className="adm-field">
      <label htmlFor={id}>{label}</label>
      <div className="adm-password">
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          required
          minLength={minLength}
          maxLength={maxLength}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? noteId : undefined}
          spellCheck={false}
          autoCapitalize="none"
        />
        <button
          type="button"
          className="adm-password__toggle"
          aria-pressed={visible}
          aria-controls={id}
          aria-label={`แสดง${label}`}
          onClick={() => setVisible((value) => !value)}
        >
          {visible ? "ซ่อน" : "แสดง"}
        </button>
      </div>
      {(error || hint) && <p id={noteId} role={error ? "alert" : undefined} className={error ? "adm-field__error" : "adm-field__hint"}>{error ?? hint}</p>}
    </div>
  );
}
