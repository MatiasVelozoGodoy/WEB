"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Check,
  Award,
  Shield,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import styles from "./ServiceInfoModal.module.scss";
import Button from "../UI/Button/Button";

interface ServiceInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    id: string;
    title: string;
    description: string;
    image?: string;
    category: string;
  } | null;
}

const ServiceInfoModal = ({
  isOpen,
  onClose,
  service,
}: ServiceInfoModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!service) return null;

  const isConsulta = service.title.toLowerCase().includes("consulta");

  const benefits = getCategoryBenefits(service.category);
  const features = getCategoryFeatures(service.category);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Cerrar modal"
            >
              <X size={24} />
            </button>

            <motion.div
              className={styles.heroSection}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className={styles.imageContainer}>
                <img
                  src={service.image || "/placeholder.svg"}
                  alt={service.title}
                  className={styles.heroImage}
                />
                <div className={styles.imageOverlay} />
              </div>
              <motion.div
                className={styles.heroContent}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className={styles.categoryBadge}>{service.category}</span>
                <h2 className={styles.title}>{service.title}</h2>
              </motion.div>
            </motion.div>

            <div className={styles.content}>
              <motion.section
                className={styles.section}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className={styles.sectionHeader}>
                  <Sparkles className={styles.sectionIcon} />
                  <h3 className={styles.sectionTitle}>
                    Descripción del Servicio
                  </h3>
                </div>
                <p className={styles.description}>{service.description}</p>
              </motion.section>

              <motion.section
                className={styles.section}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className={styles.sectionHeader}>
                  <Award className={styles.sectionIcon} />
                  <h3 className={styles.sectionTitle}>Beneficios</h3>
                </div>
                <div className={styles.benefitsGrid}>
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      className={styles.benefitCard}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <div className={styles.checkIcon}>
                        <Check size={16} />
                      </div>
                      <span>{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              <motion.section
                className={styles.section}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className={styles.sectionHeader}>
                  <Shield className={styles.sectionIcon} />
                  <h3 className={styles.sectionTitle}>Características</h3>
                </div>
                <div className={styles.featuresList}>
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      className={styles.featureItem}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                    >
                      <div className={styles.featureDot} />
                      <span>{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {isConsulta && (
                <motion.div
                  className={styles.bookingSection}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <Link to="/turno">
                    <Button variant="primary" size="medium">
                      <span>Reservar Consulta</span>
                    </Button>
                  </Link>
                  <p className={styles.bookingNote}>
                    Agendá tu consulta y recibí atención personalizada
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Helper functions to generate dynamic content
function getCategoryBenefits(category: string): string[] {
  const benefitsMap: Record<string, string[]> = {
    estetica: [
      "Mejora la apariencia de tu sonrisa",
      "Aumenta tu confianza y autoestima",
      "Resultados naturales y duraderos",
      "Procedimientos mínimamente invasivos",
    ],
    cirugia: [
      "Soluciones definitivas y efectivas",
      "Tecnología de última generación",
      "Recuperación optimizada",
      "Atención especializada post-operatoria",
    ],
    ortodoncia: [
      "Corrige la alineación dental",
      "Mejora la función masticatoria",
      "Previene problemas futuros",
      "Opciones discretas disponibles",
    ],
    otros: [
      "Atención personalizada",
      "Profesionales altamente capacitados",
      "Equipamiento moderno",
      "Seguimiento continuo",
    ],
  };
  return benefitsMap[category] || benefitsMap.otros;
}

function getCategoryFeatures(category: string): string[] {
  const featuresMap: Record<string, string[]> = {
    estetica: [
      "Evaluación completa de tu sonrisa",
      "Plan de tratamiento personalizado",
      "Materiales de alta calidad",
      "Garantía de satisfacción",
    ],
    cirugia: [
      "Diagnóstico con tecnología 3D",
      "Anestesia y sedación disponible",
      "Protocolos de seguridad estrictos",
      "Seguimiento post-quirúrgico",
    ],
    ortodoncia: [
      "Estudio ortodóntico completo",
      "Múltiples opciones de tratamiento",
      "Controles periódicos incluidos",
      "Resultados predecibles",
    ],
    otros: [
      "Atención integral",
      "Tecnología avanzada",
      "Profesionales certificados",
      "Ambiente cómodo y seguro",
    ],
  };
  return featuresMap[category] || featuresMap.otros;
}

export default ServiceInfoModal;
