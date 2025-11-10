"use client";

import { useState } from "react";
import PageHero from "../../components/UI/PageHero/PageHero";
import { Phone, Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import Input from "../../components/UI/Input/Input";
import Textarea from "../../components/UI/Textarea/Textarea";
import Button from "../../components/UI/Button/Button";
import { contactInfo } from "../../data/contactInfo";
import decor2 from "./../../assets/images/dentalDecor2.png";
import hero from "./../../assets/images/contactHero.png";
import styles from "./ContactPage.module.scss";
import { Link } from "react-router-dom";
import SuccessModal from "../../components/SuccessModal/SuccessModal";
import checkAnimation from "../../assets/animations/success.json";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    reason: "",
    email: "",
    phone: "",
    message: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className={styles.contactPage}>
      <PageHero
        title="CONTÁCTANOS"
        subtitle="Estamos a tu disposición para resolver cualquier duda"
        backgroundImage={hero}
      />

      <section className={styles.contactSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.leftPanel}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.title}>VENÍ A CONOCERNOS</h2>
            <p className={styles.description}>
              ¿Tenés alguna consulta que quieras resolver personalmente? Avisanos de tu visita por cualquiera de las siguientes plataformas
              y te recibiremos con gusto.
            </p>

            <div className={styles.contactInfo}>
              <a href={`https://wa.me/${contactInfo.phone}`} className={styles.contactItem}>
                <div className={styles.iconWrapper}>
                  <Phone size={24} />
                </div>
                <span>{contactInfo.phone}</span>
              </a>

              <a href={`mailto:${contactInfo.email}`} className={styles.contactItem}>
                <div className={styles.iconWrapper}>
                  <Mail size={24} />
                </div>
                <span>{contactInfo.email}</span>
              </a>

              <div className={styles.contactItem}>
                <div className={styles.iconWrapper}>
                  <MapPin size={24} />
                </div>
                <span>{contactInfo.address}</span>
              </div>
            </div>

            <div className={styles.notes}>
              <p>NO se reciben visitas sin horario previamente acordado.</p>
              <p>Las consultas con ingreso al consultorio son un servicio y deben ser abonadas.</p>
            </div>
          </motion.div>

          <motion.div
            className={styles.rightPanel}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.title}>ENVIANOS TU CONSULTA</h2>

            <form
              action="https://formsubmit.co/85337ca98ed6203fb78f596ecdb59848"
              method="POST"
              className={styles.form}
              onSubmit={() => setShowSuccess(true)}
            >
              {/* Hidden inputs */}


              <div className={styles.row}>
                <div className={styles.field}>
                  <div className={styles.fieldLabel}>Nombre Completo *</div>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Juan Pérez"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <div className={styles.fieldLabel}>Motivo *</div>
                  <Input
                    type="text"
                    name="reason"
                    placeholder="Consulta brackets"
                    value={formData.reason}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <div className={styles.fieldLabel}>Correo Electrónico *</div>
                  <Input
                    type="email"
                    name="email"
                    placeholder="tucorreo@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <div className={styles.fieldLabel}>Teléfono (opcional)</div>
                  <Input
                    type="tel"
                    name="phone"
                    placeholder="3794532535"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <Textarea
                  label="Mensaje"
                  name="message"
                  placeholder="Escribí acá tu mensaje..."
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  required
                />
              </div>

              <Button type="submit" variant="primary">
                Enviar
              </Button>
                <input type="hidden" name="_next" value="http://localhost:5173/contacto"></input>
                <input type="hidden" name="_subject" value={formData.reason}></input>
                <input type="hidden" name="_captcha" value="false"></input>
                <input type="hidden" name="_template" value="table"></input>
            </form>
          </motion.div>
        </div>
      </section>

      <section className={styles.consultSection}>
        <div className={styles.consultContainer}>
          <motion.div
            className={styles.consultLeft}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="https://res.cloudinary.com/dcfkgepmp/image/upload/v1762121785/us-pic2_ewpzjv.jpg"
              alt="Consulta dental"
              className={styles.consultImage}
            />
            <div className={styles.consultContent}>
              <h2 className={styles.consultTitle}>AGENDÁ TU CONSULTA</h2>
              <p className={styles.consultText}>
                Para cuidarte bien, primero te vemos. En la consulta revisamos tu boca, despejamos dudas y, si hace falta, pedimos estudios.
                Así definimos el tratamiento ideal para vos. Por eso se agenda consulta; los tratamientos perfectos para vos se planifican luego.
              </p>
              <Link to="/turno">
                <Button variant="primary">RESERVAR</Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            className={styles.consultRight}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className={styles.faqTitle}>PREGUNTAS FRECUENTES</h2>
            <div className={styles.faqList}>
              {/** Aquí puedes mapear tus FAQs si lo deseas */}
            </div>
            <img src={decor2} alt="Herramientas dentales" className={styles.faqImage} />
          </motion.div>
        </div>
      </section>

      <SuccessModal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="¡Consulta enviada!"
        message="Gracias por escribirnos. Te responderemos a la brevedad."
        animationData={checkAnimation}
      />
    </div>
  );
};

<input type="hidden" name="_subject" value="hoooooooooooooola!"></input>;
<input type="hidden" name="_captcha" value="false"></input>;
<input type="hidden" name="_template" value="table"></input>;
<input type="hidden" name="_next" value="http://localhost:5173/contacto"></input>

export default ContactPage;
