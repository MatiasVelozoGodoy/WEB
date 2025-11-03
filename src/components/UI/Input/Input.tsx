"use client";

import React from "react";
import styles from "./Input.module.scss";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  type?: "text" | "email" | "tel" | "password" | "date" | "time";
  label?: string;
  name: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  error?: string;
  touched?: boolean;
  disabled?: boolean;
  required?: boolean;
  leftIcon?: React.ReactNode;
  id?: string;
}

const Input: React.FC<InputProps> = ({
  type = "text",
  label,
  name,
  id,
  value = "",
  onChange,
  onBlur,
  placeholder,
  error,
  touched,
  disabled = false,
  required,
  leftIcon,
  ...rest
}) => {
  const inputId = id || name;
  const showError = Boolean(error && (touched ?? true));

  return (
    <div className={[styles.inputWrapper, showError ? styles.hasError : ""].join(" ")}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required ? <span className={styles.required}>*</span> : null}
        </label>
      )}

      <div className={styles.control}>
        {leftIcon ? <span className={styles.leftIcon}>{leftIcon}</span> : null}
        <input
          id={inputId}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={showError}
          aria-describedby={showError ? `${inputId}-error` : undefined}
          className={[
            styles.input,
            leftIcon ? styles.withIcon : "",
            showError ? styles.error : "",
          ].join(" ")}
          required={required}
          {...rest}
        />
      </div>

      {showError && (
        <span id={`${inputId}-error`} className={styles.errorText}>
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
