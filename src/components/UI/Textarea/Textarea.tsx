"use client";

import type { ChangeEvent, FocusEvent } from "react";
import styles from "./Textarea.module.scss";

interface TextareaProps {
  label?: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: FocusEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  error?: string;
  touched?: boolean;
  rows?: number;
  disabled?: boolean;
  required?: boolean;
}

const Textarea = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  touched,
  rows = 4,
  disabled = false,
  required,
}: TextareaProps) => {
  const showError = Boolean(error && touched);

  return (
    <div className={styles.textareaWrapper}>
      {label && (
        <label htmlFor={name} className={styles.label}>
          {label}
          {required ? " *" : ""}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={`${styles.textarea} ${showError ? styles.error : ""}`}
        aria-invalid={showError}
        aria-describedby={showError ? `${name}-error` : undefined}
      />
      {showError && (
        <span id={`${name}-error`} className={styles.errorText}>
          {error}
        </span>
      )}
    </div>
  );
};

export default Textarea;
