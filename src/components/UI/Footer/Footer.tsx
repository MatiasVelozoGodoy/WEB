import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";
import styles from "./Footer.module.scss";
import Logo from "../../../assets/images/Logo.png";
// import { goToBooking } from "../../utils/session";

const Footer = () => {

  // const path = bookingPath();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <div className={styles.logoIcon}>
                <img src={Logo} alt="Lavalle Odontología Integral" />
              </div>
              <div className={styles.logoText}>
                <span className={styles.logoName}>LAVALLE</span>
                <span className={styles.logoSubtitle}>ODONTOLOGÍA</span>
              </div>
            </div>
            <p className={styles.tagline}>
              Servicio dental integral, profesional y seguro, pensado para tu
              tranquilidad.
            </p>
            <div className={styles.social}>
              <a
                href="https://www.instagram.com/lavalle.odontologia/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            
            </div>
          </div>

          <div className={styles.links}>
            <h3 className={styles.linksTitle}>ENLACES</h3>
            <ul>
              <li>
                <Link to="/">Inicio</Link>
              </li>
              <li>
                <Link to="/not-found">Nosotros</Link>
              </li>
              <li>
                <Link to="/servicios">Servicios</Link>
              </li>
              <li>
                <Link to="/contacto">Contacto</Link>
              </li>
            </ul>
          </div>

          <div className={styles.links}>
            <h3 className={styles.linksTitle}>SERVICIOS</h3>
            <ul>
              <li>
                <Link to="/servicios">Ver Servicios</Link>
              </li>

              {/*<li><Link to={path}>Reservar Turno</Link></li> */}
              <li>
                <Link to="/tuno">Reservar Turno</Link>
              </li>
              <li>
                <Link to="/#obras-sociales">Obras Sociales</Link>
              </li>
            </ul>
          </div>

          <div className={styles.links}>
            <h3 className={styles.linksTitle}>CONTACTO</h3>
            <ul>
              <li>
                <Link to="/contacto">Formulario de Contacto</Link>
              </li>
              
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>Todos los derechos reservados © 2025</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
