"use client";

import { useFormStatus } from "react-dom";

type Props = {
  children: React.ReactNode;
  pendingLabel: string;
  className?: string;
};

/** Submit button that reports progress without losing keyboard focus. */
export function SubmitButton({ children, pendingLabel, className = "adm-btn adm-btn--primary" }: Props) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={className}
      aria-disabled={pending}
      data-pending={pending || undefined}
      onClick={(event) => { if (pending) event.preventDefault(); }}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
