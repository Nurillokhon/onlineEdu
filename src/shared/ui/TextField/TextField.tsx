/** @format */

import type { ReactNode } from "react";
import { MdOutlinedTextField } from "../material/outlined-text-field";

interface TextFieldProps {
  /** Floating label. Omit it when a visible label sits above the field. */
  label?: string;
  /** Announced name when the visible label lives outside the field. */
  ariaLabel?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "password" | "tel";
  required?: boolean;
  errorText?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  /**
   * Masks the raw input before it reaches state. It is written back to the
   * element as well: when the masked text equals current state React skips the
   * re-render, and without that write the rejected characters would stay
   * visible in the field.
   */
  format?: (raw: string) => string;
}

export function TextField({
  label,
  ariaLabel,
  placeholder,
  value,
  onChange,
  type = "text",
  required,
  errorText,
  leadingIcon,
  trailingIcon,
  format,
}: TextFieldProps) {
  return (
    <div className="w-full">
      <MdOutlinedTextField
        className="w-full"
        label={label ?? ""}
        aria-label={ariaLabel}
        placeholder={placeholder ?? ""}
        value={value}
        type={type}
        required={required}
        error={Boolean(errorText)}
        errorText={errorText ?? ""}
        onInput={(event: Event) => {
          const field = event.target as HTMLElement & { value: string };
          const next = format ? format(field.value) : field.value;
          if (field.value !== next) field.value = next;
          onChange(next);
        }}
      >
        {leadingIcon ? (
          <span slot="leading-icon" className="flex items-center text-ink-muted">
            {leadingIcon}
          </span>
        ) : null}
        {trailingIcon ? (
          <span
            slot="trailing-icon"
            className="flex items-center text-ink-muted"
          >
            {trailingIcon}
          </span>
        ) : null}
      </MdOutlinedTextField>
    </div>
  );
}
