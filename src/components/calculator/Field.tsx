/**
 * Field — label, control, optional help and error text for calculator forms.
 */
import type { ReactNode } from 'react';

export function Field({
  label,
  htmlFor,
  help,
  error,
  aside,
  children,
}: {
  label: ReactNode;
  htmlFor?: string;
  help?: ReactNode;
  error?: ReactNode;
  /** Right-aligned element on the label row */
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        {htmlFor ? (
          <label className="label-micro" htmlFor={htmlFor}>
            {label}
          </label>
        ) : (
          <span className="label-micro">{label}</span>
        )}
        {aside}
      </div>
      {children}
      {error && <span className="text-[11px] text-down">{error}</span>}
      {help && <span className="text-[11px] leading-snug text-t3">{help}</span>}
    </div>
  );
}
