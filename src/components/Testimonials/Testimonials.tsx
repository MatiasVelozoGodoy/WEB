"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { testimonials } from "../../data/testimonials";
import styles from "./Testimonials.module.scss";

const Testimonials = () => {
  const [perPage, setPerPage] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const mqSm = window.matchMedia("(max-width: 640px)");
    const mqMd = window.matchMedia("(max-width: 1024px)");
    const calc = () => setPerPage(mqSm.matches ? 1 : mqMd.matches ? 2 : 3);
    calc();
    mqSm.addEventListener("change", calc);
    mqMd.addEventListener("change", calc);
    return () => {
      mqSm.removeEventListener("change", calc);
      mqMd.removeEventListener("change", calc);
    };
  }, []);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(testimonials.length / perPage)),
    [perPage]
  );

  useEffect(() => {
    setCurrentIndex((idx) => Math.min(idx, totalPages - 1));
  }, [totalPages]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % totalPages);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);

  const currentTestimonials = useMemo(
    () =>
      testimonials.slice(currentIndex * perPage, (currentIndex + 1) * perPage),
    [currentIndex, perPage]
  );

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <motion.h2
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          ¿QUÉ OPINAN NUESTROS PACIENTES?
        </motion.h2>
        <p className={styles.subtitle}>
          Te compartimos las reseñas que nos han dejado nuestros pacientes a lo largo de nuestra trayectoria.
        </p>

        <div className={styles.carouselWrapper}>
          <button className={`${styles.navButton} ${styles.navButtonLeft}`} onClick={prevSlide} aria-label="Anterior">
            <ChevronLeft size={24} />
          </button>

          <div className={styles.carousel}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentIndex}-${perPage}`}
                className={styles.testimonialGrid}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.35 }}
              >
                {currentTestimonials.map((t) => (
                  <div key={t.id} className={styles.testimonialCard}>
                    <Quote className={styles.quoteIcon} size={28} />
                    <p className={styles.testimonialText}>{t.text}</p>
                    <div className={styles.testimonialAuthor}>
                      <img
                        src={t.avatar || "/placeholder.svg"}
                        alt={t.name}
                        className={styles.avatar}
                      />
                      <div>
                        <p className={styles.authorName}>{t.name}</p>
                        <p className={styles.authorDate}>{t.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <button className={`${styles.navButton} ${styles.navButtonRight}`} onClick={nextSlide} aria-label="Siguiente">
            <ChevronRight size={24} />
          </button>
        </div>

        <div className={styles.dots}>
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ""}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Ir a página ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
