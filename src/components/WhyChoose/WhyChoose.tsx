"use client";

import { motion } from "framer-motion";
import { Sparkles, CheckCircle2 } from "lucide-react";
import styles from "./WhyChoose.module.scss";
import whyus from "../../assets/images/whyUs.jpg";
import whyus2 from "../../assets/images/whyUs2.jpg";
import whyus3 from "../../assets/images/whyUs3.jpg";
import whyus4 from "../../assets/images/whyUs4.jpg";

const WhyChoose = () => {
  const items = [
    {
      img: whyus,
      reasonTitle: "Atención humana y cercana",
      reason:
        "Acompañamiento personalizado en cada instancia del tratamiento para que te sientas cómodo y seguro.",
      details: [
        "Consultas sin apuro",
        "Seguimiento post-tratamiento",
        "Atención personalizada",
      ],
      icon: "heart",
    },
    {
      img: whyus2,
      reasonTitle: "Tecnología de vanguardia",
      reason:
        "Equipamiento digital para diagnósticos más precisos y tratamientos mínimamente invasivos.",
      details: [
        "Escáner intraoral 3D",
        "Radiografía digital",
        "Tratamientos láser",
      ],
      icon: "tech",
    },
    {
      img: whyus3,
      reasonTitle: "Diagnóstico integral",
      reason:
        "Plan de tratamiento basado en evidencia, priorizando salud, función y estética.",
      details: [
        "Evaluación completa",
        "Plan personalizado",
        "Enfoque preventivo",
      ],
      icon: "check",
    },
    {
      img: whyus4,
      reasonTitle: "Resultados estéticos",
      reason:
        "Acabados naturales y armoniosos para una sonrisa saludable y confiable.",
      details: [
        "Diseño de sonrisa",
        "Materiales premium",
        "Resultados duraderos",
      ],
      icon: "star",
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.splitHero}>
        <motion.h2
          className={styles.heroTitle}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          ¿POR QUÉ ELEGIR ODONTOLOGÍA LAVALLE?
        </motion.h2>

        <div className={styles.columns}>
          {items.map((it, i) => (
            <motion.figure
              key={i}
              className={styles.col}
              style={{ backgroundImage: `url(${it.img})` }}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <div className={styles.baseOverlay} />

              <div className={styles.cornerAccents}>
                <span className={styles.cornerTL}></span>
                <span className={styles.cornerTR}></span>
                <span className={styles.cornerBL}></span>
                <span className={styles.cornerBR}></span>
              </div>

              <div className={styles.glowBorder}></div>

              <figcaption className={styles.reason}>
                <div className={styles.iconBadge}>
                  {it.icon === "heart" && <Sparkles size={20} />}
                  {it.icon === "tech" && <Sparkles size={20} />}
                  {it.icon === "check" && <CheckCircle2 size={20} />}
                  {it.icon === "star" && <Sparkles size={20} />}
                </div>

                <h3>{it.reasonTitle}</h3>
                <p>{it.reason}</p>

                <div className={styles.detailsList}>
                  {it.details.map((detail, idx) => (
                    <motion.div
                      key={idx}
                      className={styles.detailItem}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <CheckCircle2 size={14} className={styles.checkIcon} />
                      <span>{detail}</span>
                    </motion.div>
                  ))}
                </div>

                
              </figcaption>

              <div className={styles.shineEffect}></div>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
