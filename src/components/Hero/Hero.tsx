"use client";

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Button from "../UI/Button/Button";
// import { goToBooking } from "../../utils/session";
import styles from "./Hero.module.scss";


const Hero = () => {
  const navigate = useNavigate();


  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className={styles.title}>
            CADA SONRISA QUE CUIDAMOS, CUENTA UNA HISTORIA
          </h1>
          <p className={styles.subtitle}>Odontología para la familia</p>
          <div className={styles.actions}>
           {/* // CÓDIGO PARA CUANDO ESTE EL AUTH !!!
//  <Button variant="primary" size="large" onClick={() => goToBooking(navigate)}>
//               RESERVAR TURNO
//             </Button>*/}
            <Button
              variant="primary"
              size="large"
              onClick={() => navigate("/turnos")}
            >
              RESERVAR TURNO
            </Button>
            <Button
              variant="outline"
              size="large"
              onClick={() => navigate("/servicios")}
            >
              VER SERVICIOS
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
