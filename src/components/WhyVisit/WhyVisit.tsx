"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { services } from "../../data/services";
import NewsletterForm from "../NewsletterForm/NewsletterForm";
import MoreInfoModal from "../MoreInfoModal/MoreInfoModal";
import styles from "./WhyVisit.module.scss";
import { useState } from "react";

type Service = (typeof services)[number];

const WhyVisit = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <motion.h2
              className={styles.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              ¿POR QUÉ VISITAR A TU ODONTÓLOGO CADA 6 MESES?
            </motion.h2>
            <p className={styles.description}>
              ¿No sabes cada cuánto hacer tu consulta odontológica para mantener una salud bucal óptima? Acá te contamos tres razones por las cuales una visita cada seis meses puede ser tu mejor opción.
            </p>
          </div>
          <motion.div
            className={styles.newsletter}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <NewsletterForm />
          </motion.div>
        </div>

        <div className={styles.content}>
          <div className={styles.cards}>
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                className={styles.card}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={styles.cardImage}>
                  <img src={service.image || "/placeholder.svg"} alt={service.title} />
                </div>
                <div className={styles.cardOverlay} />
                <button
                  className={styles.expandButton}
                  aria-label="Más información"
                  type="button"
                  onClick={() => setSelectedService(service)}
                >
                  <Plus size={20} />
                </button>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{service.title}</h3>
                  <p className={styles.cardDescription}>{service.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <MoreInfoModal open={!!selectedService} service={selectedService} onClose={() => setSelectedService(null)} />
    </section>
  );
};

export default WhyVisit;
