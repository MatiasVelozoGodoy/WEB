"use client";

import { motion } from "framer-motion";
import { insuranceProviders, paymentMethods } from "../../data/insurance";
import styles from "./InsurancePayment.module.scss";

const InsurancePayment = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
       

        <div className={styles.infoSection}>
          {/* --- OBRAS SOCIALES --- */}
          <motion.section
            id="obras-sociales"
            aria-labelledby="heading-obras-sociales"
            className={styles.block}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 id="heading-obras-sociales" className={styles.blockTitle}>
              OBRAS SOCIALES
            </h2>

            <div className={styles.logoGrid}>
              {insuranceProviders.map((provider) => (
                <div key={provider.id} className={styles.logoCard}>
                  <div className={styles.logoPlaceholder}>
                    {provider.logo ? (
                      <img src={provider.logo} alt={provider.name} />
                    ) : (
                      provider.name
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* --- MÉTODOS DE PAGO --- */}
          <motion.section
            id="metodos-de-pago"
            aria-labelledby="heading-metodos-de-pago"
            className={styles.block}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 id="heading-metodos-de-pago" className={styles.blockTitle}>
              MÉTODOS DE PAGO
            </h2>

            <div className={styles.paymentGrid}>
              {paymentMethods.map((method) => (
                <div key={method.id} className={styles.paymentCard}>
                  <div className={styles.paymentPlaceholder}>
                    {method.logo ? (
                      <img src={method.logo} alt={method.name} />
                    ) : (
                      method.name
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        </div>
      </div>
    </section>
  );
};

export default InsurancePayment;
