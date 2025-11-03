"use client";

import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { useForm } from "../../hooks/useForm";
import SuccessModal from "../../components/SuccessModal/SuccessModal";
import checkAnimation from "../../assets/animations/success.json";
import styles from "./NewsletterForm.module.scss";

type MessageFormData = { message: string };

const STORAGE_KEY = "newsletter_msg_rate";
const RATE_LIMIT = 3;
const WINDOW_MS = 60 * 60 * 1000;

function countWords(s: string) {
  const trimmed = s.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

const NewsletterForm = () => {
  const [blocked, setBlocked] = useState(false);
  const [rateError, setRateError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const rec = JSON.parse(raw) as { count: number; firstAt: number };
      const now = Date.now();

      if (now - rec.firstAt > WINDOW_MS) {
        localStorage.removeItem(STORAGE_KEY);
        setBlocked(false);
        setRateError(null);
      } else if (rec.count >= RATE_LIMIT) {
        setBlocked(true);
        setRateError("Demasiados mensajes. Podrás enviar otro en 60 minutos.");
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const initialValues: MessageFormData = { message: "" };

  const validationRules: Partial<
    Record<keyof MessageFormData, Array<(value: string) => boolean>>
  > = {
    message: [
      (value) => countWords(value) > 0,
      (value) => countWords(value) <= 150,
    ],
  };

  const handleSubmit = async (values: MessageFormData) => {
    const now = Date.now();
    let rec: { count: number; firstAt: number } | null = null;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) rec = JSON.parse(raw);
    } catch {
      // ignore parse errors
    }

    if (!rec || now - rec.firstAt > WINDOW_MS) {
      rec = { count: 0, firstAt: now };
    }

    if (rec.count >= RATE_LIMIT) {
      setBlocked(true);
      setRateError("Demasiados mensajes. Podrás enviar otro en 60 minutos.");
      return;
    }

    console.log("Mensaje enviado:", values.message.trim());

    rec.count += 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rec));

    if (rec.count >= RATE_LIMIT) {
      setBlocked(true);
      setRateError("Demasiados mensajes. Podrás enviar otro en 60 minutos.");
    } else {
      setRateError(null);
    }

    setFieldValue("message", "");
    setShowSuccess(true);
  };

  const {
    values,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit: onSubmit,
    setFieldValue,
  } = useForm<MessageFormData>(initialValues, validationRules, handleSubmit);

  const messageError = touched.message
    ? (() => {
        const words = countWords(values.message);
        if (words === 0) return "El mensaje es requerido";
        if (words > 150) return "Máximo 150 palabras";
        return null;
      })()
    : null;

  const hasContent = values.message.trim().length > 0;
  const disableSend = isSubmitting || blocked || !hasContent || !!messageError;

  return (
    <div className={styles.newsletter}>
      <h3 className={styles.title}>¡ESCRIBINOS!</h3>
      <p className={styles.description}>
        ¿Hay un tema que te interese que tratemos el próximo mes? ¡Dejanos tu
        idea!
      </p>

      <form onSubmit={onSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <textarea
            name="message"
            className={styles.textarea}
            placeholder="Escribí tu idea acá (máx. 150 palabras)"
            value={values.message}
            onChange={handleChange}
            onBlur={handleBlur}
            rows={4}
            maxLength={3000}
            disabled={isSubmitting || blocked}
          />
          <button
            type="submit"
            className={styles.submitButton}
            disabled={disableSend}
            aria-label="Enviar"
          >
            <Send size={20} />
          </button>
        </div>

        {messageError || rateError ? (
          <p className={styles.error}>{messageError ?? rateError}</p>
        ) : null}

        <div className={styles.helper}>
          {countWords(values.message)}/150 palabras
        </div>
      </form>
      <SuccessModal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="¡Gracias!"
        message="Tu idea fue enviada. La tendremos en cuenta para el próximo boletín."
        animationData={checkAnimation}
        autoCloseMs={2600}
      />
    </div>
  );
};

export default NewsletterForm;
