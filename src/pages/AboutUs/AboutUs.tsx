"use client";

import { motion } from "framer-motion";
import { Award, Heart, Users, Target, CheckCircle } from "lucide-react";
import Button from "../../components/UI/Button/Button";
import image1 from "../../assets/images/imagen1.jpg";
// import { goToBooking } from "../../utils/session";
import styles from "./AboutUs.module.scss";
import PageHero from "@/components/UI/PageHero/PageHero";
import hero from "../../assets/images/aboutUs.png";

const AboutUs = () => {
  const values = [
    {
      icon: <Heart />,
      title: "Cuidado Personalizado",
      description: "Cada paciente es único y merece atención individualizada",
    },
    {
      icon: <Award />,
      title: "Excelencia Profesional",
      description: "Equipo altamente capacitado con tecnología de vanguardia",
    },
    {
      icon: <Users />,
      title: "Enfoque Familiar",
      description: "Odontología para todas las edades en un ambiente cálido",
    },
    {
      icon: <Target />,
      title: "Resultados Garantizados",
      description: "Comprometidos con tu salud bucal y tu sonrisa perfecta",
    },
  ];

  const team = [
    {
      name: "Od. Paula Cavaglia",
      role: "Directora y Odontóloga General",
      image: "https://i.pravatar.cc/300?img=20",
      specialties: ["Estética Dental", "Rehabilitación Oral"],
    },
    {
      name: "Od. Florencia Hernández",
      role: "Directora y Endodoncista",
      image: "https://res.cloudinary.com/dcfkgepmp/image/upload/v1762121116/pfp-flor_poctqy.jpg",
      specialties: ["Tratamientos de Conducto", "Ortodoncia"],
    },
  ];

 

  return (
    <div className={styles.aboutUs}>
       <PageHero
        title="Nosotros"
        subtitle="Transformando sonrisas, cambiando vidas desde 2010"
        backgroundImage={hero}
      />

     

      <section className={styles.mission}>
        <div className={styles.missionContent}>
          <motion.div
            className={styles.missionText}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2>Nuestra Misión</h2>
            <p>
              Proporcionar servicios odontológicos integrales de la más alta
              calidad, utilizando tecnología avanzada y técnicas innovadoras,
              mientras creamos un ambiente cómodo y acogedor para nuestros
              pacientes.
            </p>
            <div className={styles.missionPoints}>
              <div className={styles.point}>
                <CheckCircle />
                <span>Atención personalizada y profesional</span>
              </div>
              <div className={styles.point}>
                <CheckCircle />
                <span>Tecnología de última generación</span>
              </div>
              <div className={styles.point}>
                <CheckCircle />
                <span>Tratamientos sin dolor</span>
              </div>
              <div className={styles.point}>
                <CheckCircle />
                <span>Planes de financiación accesibles</span>
              </div>
            </div>
          </motion.div>
          <motion.div
            className={styles.missionImage}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <img src="https://res.cloudinary.com/dcfkgepmp/image/upload/v1762121303/us-pic_dnusam.jpg" alt="Dental consultation" />
          </motion.div>
        </div>
      </section>

      <section className={styles.values}>
        <h2>Nuestros Valores</h2>
        <div className={styles.valuesGrid}>
          {values.map((value, idx) => (
            <motion.div
              key={idx}
              className={styles.valueCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className={styles.valueIcon}>{value.icon}</div>
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className={styles.team}>
        <h2>Nuestro Equipo</h2>
        <div className={styles.teamGrid}>
          {team.map((member, idx) => (
            <motion.div
              key={idx}
              className={styles.teamCard}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className={styles.teamImage}>
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                />
              </div>
              <div className={styles.teamInfo}>
                <h3>{member.name}</h3>
                <p className={styles.role}>{member.role}</p>
                <div className={styles.specialties}>
                  {member.specialties.map((specialty, i) => (
                    <span key={i} className={styles.specialty}>
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <motion.div
          className={styles.ctaContent}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>¿Listo para transformar tu sonrisa?</h2>
          <p>Agendá tu consulta hoy y descubrí la diferencia Lavalle</p>
          <div className={styles.ctaButtons}>
            {/*<Button variant="primary" size="large" onClick={() => goToBooking(navigate)}>
  Reservar Turno
</Button> */}
            <Button variant="primary" size="large">
              Reservar Turno
            </Button>
            <Button variant="secondary" size="large">
              Contactar
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutUs;
