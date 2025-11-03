"use client";

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { FaTooth } from "react-icons/fa";
import styles from "./NotFound.module.scss";

const NotFound = () => {
  return (
    <section className={styles.wrapper}>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className={styles.icon}>
          <FaTooth size={36} />
        </div>

        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>Página no encontrada</h2>
        <p className={styles.text}>
          Lo sentimos, no pudimos encontrar la página que buscás. Es posible que
          se haya movido o que el enlace sea incorrecto.
        </p>

        <div className={styles.actions}>
          <Link to="/" className={`${styles.btn} ${styles.primary}`}>
            <Home size={18} /> Ir al inicio
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default NotFound;
