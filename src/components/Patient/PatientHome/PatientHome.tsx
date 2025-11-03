"use client"

import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import { Calendar, MessageSquare, FileText, LogOut } from "lucide-react"
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout"
import styles from "./PatientHome.module.scss"
import tooth from "../../../assets/images/tooth.png"
import { useAuth } from "../../../context/AuthContext"

const PatientHome = () => {
  const { currentUser, isLoggedIn, logout } = useAuth()
  const navigate = useNavigate()

  console.log('currentUser:', currentUser)
  console.log('currentUser.fullName:', currentUser?.fullName)

  const handleLogout = async () => {
    try {
      await logout()
      navigate("/")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  if (!isLoggedIn || !currentUser) {
    return (
      <DashboardLayout userType="cliente" userRole="cliente" userName="Invitado">
        <div className={styles.wrap}>
          <p>Por favor inicia sesión para ver tu información.</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout 
      userType="cliente" 
      userRole="cliente" 
      userName={currentUser.fullName || "Francisco"}
    >
      <div className={styles.wrap}>
        {/* BOTÓN DE LOGOUT */}
        <button 
          onClick={handleLogout}
          className={styles.logoutButton}
        >
          <LogOut size={18} />
          Cerrar Sesión
        </button>

        <section className={styles.welcomeSection}>
          <motion.div className={styles.welcomeCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className={styles.welcomeContent}>
              <h1>¡HOLA, {currentUser.fullName?.toUpperCase() || "Fracisco"}!</h1>
              <p>¿Qué vamos a hacer hoy?</p>
              <div className={styles.quickActions}>
                <Link to="/dashboard/paciente/tratamiento">
                  <FileText size={18} /> 
                  Revisar Tratamiento
                </Link>
                <Link to="/dashboard/paciente/turnos">
                  <Calendar size={18} /> 
                  Ver Turnos
                </Link>
                <Link to="/dashboard/paciente/mensajes">
                  <MessageSquare size={18} /> 
                  Enviar Mensaje
                </Link>
              </div>
            </div>
            <div className={styles.mascot}>
              <img src={tooth} alt="Mascota" />
            </div>
          </motion.div>

          <motion.div className={styles.notifications} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h3>NOTIFICACIONES</h3>
            <div className={styles.notificationList}>
              <div className={styles.notification}>
                <div className={styles.notifIcon}>📅</div>
                <div>
                  <p className={styles.notifTitle}>Próximo turno confirmado</p>
                  <p className={styles.notifDate}>16/12/2025</p>
                </div>
              </div>
              <div className={styles.notification}>
                <div className={styles.notifIcon}>💬</div>
                <div>
                  <p className={styles.notifTitle}>Tenés un mensaje nuevo</p>
                  <p className={styles.notifDate}>Hace 2 horas</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </DashboardLayout>
  )
}

export default PatientHome