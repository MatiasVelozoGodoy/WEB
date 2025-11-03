"use client";

import type { ReactNode } from "react";
import styles from "./Modal.module.scss";

interface ModalProps {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

const Modal = ({ open, title, onClose, children, footer }: ModalProps) => {
  if (!open) return null;
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        {title && <h3 className={styles.title}>{title}</h3>}
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
        <button className={styles.close} onClick={onClose} aria-label="Cerrar">×</button>
      </div>
    </div>
  );
};

export default Modal;
