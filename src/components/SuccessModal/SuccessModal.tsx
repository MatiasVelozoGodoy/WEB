"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Lottie from "lottie-react";
import styles from "./SuccessModal.module.scss";

type SuccessModalProps = {
  open: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
  autoCloseMs?: number;
  animationData: object;
};

export default function SuccessModal({
  open,
  title = "¡Mensaje enviado!",
  message,
  onClose,
  autoCloseMs,
  animationData,
}: SuccessModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open && autoCloseMs) {
      const id = setTimeout(onClose, autoCloseMs);
      return () => clearTimeout(id);
    }
  }, [open, autoCloseMs, onClose]);

  if (!open) return null;

  const content = (
    <div
      ref={overlayRef}
      className={styles.overlay}
      onMouseDown={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={styles.modal}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={styles.animation}>
          <Lottie animationData={animationData} loop={false} />
        </div>
        <h4 className={styles.title}>{title}</h4>
        {message ? <p className={styles.message}>{message}</p> : null}
        <button className={styles.button} onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
