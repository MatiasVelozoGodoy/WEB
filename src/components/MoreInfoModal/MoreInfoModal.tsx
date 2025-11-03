"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CalendarCheck,
  Info,
  CheckCircle2,
  BookOpenText,
  HelpCircle,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import styles from "./MoreInfoModal.module.scss";

type Service = {
  id: string | number;
  title: string;
  description?: string;
  image?: string;
  details?: {
    benefits?: string[];
    steps?: string[];
    care?: string[];
    faqs?: { q: string; a: string }[];
  };
};

type Props = {
  open: boolean;
  service: Service | null;
  onClose: () => void;
};

const TABS = [
  { key: "overview", label: "Resumen", icon: Info },
  { key: "benefits", label: "Beneficios", icon: CheckCircle2 },
  { key: "procedure", label: "Procedimiento", icon: BookOpenText },
  { key: "care", label: "Cuidados", icon: CalendarCheck },
  { key: "faqs", label: "FAQs", icon: HelpCircle },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function MoreInfoModal({ open, service, onClose }: Props) {
  const [tab, setTab] = useState<TabKey>("overview");
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setTimeout(() => closeBtnRef.current?.focus(), 50);
      setTab("overview");
    }
  }, [open]);

  const content = useMemo(() => {
    const defaults = {
      benefits: [
        "Previene caries y enfermedad periodontal con limpiezas regulares.",
        "Detecta problemas a tiempo y reduce tratamientos costosos.",
        "Mejora el aliento y la estética del esmalte.",
      ],
      steps: [
        "Evaluación clínica y conversación breve sobre tu historia odontológica.",
        "Profilaxis: remoción de placa y sarro con instrumental específico.",
        "Pulido y recomendaciones personalizadas según tu caso.",
      ],
      care: [
        "Cepillado 2–3 veces al día con técnica adecuada.",
        "Uso de hilo dental o irrigadores diariamente.",
        "Evitar tabaco y exceso de bebidas azucaradas.",
      ],
      faqs: [
        {
          q: "¿Cada cuánto debo venir?",
          a: "Generalmente cada 6 meses; algunos casos requieren controles más frecuentes.",
        },
        {
          q: "¿Duele la limpieza?",
          a: "No debería doler; puede haber sensibilidad leve y transitoria.",
        },
        {
          q: "¿Puedo comer luego?",
          a: "Sí; si hubo flúor tópico, evitá comer por 30 minutos.",
        },
      ],
    };
    const d = service?.details;
    return {
      benefits: d?.benefits?.length ? d.benefits : defaults.benefits,
      steps: d?.steps?.length ? d.steps : defaults.steps,
      care: d?.care?.length ? d.care : defaults.care,
      faqs: d?.faqs?.length ? d.faqs : defaults.faqs,
    };
  }, [service]);

  return (
    <AnimatePresence>
      {open && service && (
        <motion.div
          className={styles.backdrop}
          role="dialog"
          aria-modal="true"
          aria-labelledby="moreinfo-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={onClose}
        >
          <motion.article
            className={styles.modal}
            initial={{ y: 40, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Hero Header */}
            <div className={styles.hero}>
              {service.image ? (
                <motion.img
                  src={service.image}
                  alt={service.title}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6 }}
                />
              ) : (
                <div className={styles.heroPlaceholder}>
                  <Sparkles className={styles.heroIcon} size={48} />
                </div>
              )}
              <div className={styles.heroOverlay} />
              <motion.div
                className={styles.heroContent}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <h2 id="moreinfo-title" className={styles.heroTitle}>
                  {service.title}
                </h2>
              </motion.div>
              <motion.button
                ref={closeBtnRef}
                className={styles.closeBtn}
                onClick={onClose}
                aria-label="Cerrar"
                type="button"
                whileHover={{ scale: 1.08, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <X size={20} strokeWidth={2.5} />
              </motion.button>
            </div>

            {/* Navigation Tabs */}
            <nav className={styles.nav}>
              <div className={styles.navScroll}>
                {TABS.map(({ key, label, icon: Icon }, idx) => (
                  <motion.button
                    key={key}
                    className={`${styles.navTab} ${
                      tab === key ? styles.navTabActive : ""
                    }`}
                    onClick={() => setTab(key)}
                    type="button"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Icon size={18} strokeWidth={2.2} />
                    <span>{label}</span>
                    {tab === key && (
                      <motion.div
                        className={styles.navIndicator}
                        layoutId="activeTab"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </nav>

            {/* Content Area */}
            <div className={styles.content}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className={styles.contentInner}
                >
                  {tab === "overview" && (
                    <div className={styles.overview}>
                      <p className={styles.lead}>
                        {service.description ||
                          "Chequeos periódicos y limpiezas profesionales ayudan a mantener una salud bucal óptima y a prevenir patologías frecuentes. Conocé cómo trabajamos y por qué una visita programada puede ahorrarte tratamientos complejos."}
                      </p>
                    </div>
                  )}

                  {tab === "benefits" && (
                    <ul className={styles.benefitsList}>
                      {content.benefits.map((b, i) => (
                        <motion.li
                          key={i}
                          className={styles.benefitItem}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08 }}
                        >
                          <div className={styles.benefitIcon}>
                            <CheckCircle2 size={20} strokeWidth={2.5} />
                          </div>
                          <span>{b}</span>
                        </motion.li>
                      ))}
                    </ul>
                  )}

                  {tab === "procedure" && (
                    <ol className={styles.stepsList}>
                      {content.steps.map((s, i) => (
                        <motion.li
                          key={i}
                          className={styles.stepItem}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <div className={styles.stepNumber}>{i + 1}</div>
                          <div className={styles.stepContent}>
                            <p>{s}</p>
                          </div>
                        </motion.li>
                      ))}
                    </ol>
                  )}

                  {tab === "care" && (
                    <ul className={styles.careList}>
                      {content.care.map((c, i) => (
                        <motion.li
                          key={i}
                          className={styles.careItem}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08 }}
                        >
                          <div className={styles.careBullet} />
                          <span>{c}</span>
                        </motion.li>
                      ))}
                    </ul>
                  )}

                  {tab === "faqs" && (
                    <div className={styles.faqsList}>
                      {content.faqs.map((f, i) => (
                        <motion.details
                          key={i}
                          className={styles.faqItem}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.08 }}
                        >
                          <summary className={styles.faqQuestion}>
                            <span>{f.q}</span>
                            <ChevronDown
                              className={styles.faqChevron}
                              size={20}
                              strokeWidth={2.5}
                            />
                          </summary>
                          <motion.div
                            className={styles.faqAnswer}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <p>{f.a}</p>
                          </motion.div>
                        </motion.details>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
