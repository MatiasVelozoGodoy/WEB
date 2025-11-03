"use client"

import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import { Calendar, Users, FileText, Settings, TrendingUp, MessageSquare, LogOut } from "lucide-react"
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout"
import StatsCard from "@/components/StatsCard/StatsCard"
import { adminStats } from "../../../data/dashboardData"
import styles from "./AdminHome.module.scss"
import tooth from "../../../assets/images/tooth.png"
import { useAuth } from "../../../context/AuthContext"

const colorByIcon: Record<string, "primary" | "info" | "success" | "danger"> = {
  users: "primary",
  calendar: "info",
  dollar: "success",
  x: "danger",
}

const AdminHome = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate("/")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  return (
    <div className={styles.wrap}>
      {/* BOTÓN DE LOGOUT AGREGADO */}
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
            <h1>¡HOLA, ADMINISTRADOR!</h1>
            <p>Panel de control y gestión</p>
            <div className={styles.quickActions}>
              <Link to="/dashboard/admin/turnos">
                <Calendar size={18} />
                Gestionar Turnos
              </Link>
              <Link to="/dashboard/admin/pacientes">
                <Users size={18} />
                Ver Pacientes
              </Link>
              <Link to="/dashboard/admin/mensajes">
                <MessageSquare size={18} />
                Mensajes
              </Link>
              <Link to="/dashboard/admin/configuracion">
                <Settings size={18} />
                Configuración
              </Link>
            </div>
          </div>
          <div className={styles.mascot}>
            <img src={tooth || "/placeholder.svg"} alt="Mascota" />
          </div>
        </motion.div>

        <motion.div className={styles.notifications} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <h3>ACTIVIDAD RECIENTE</h3>
          <div className={styles.notificationList}>
            <div className={styles.notification}>
              <div className={styles.notifIcon}>📅</div>
              <div>
                <p className={styles.notifTitle}>Nuevo turno agendado</p>
                <p className={styles.notifDate}>Hace 15 minutos</p>
              </div>
            </div>
            <div className={styles.notification}>
              <div className={styles.notifIcon}>👤</div>
              <div>
                <p className={styles.notifTitle}>Paciente nuevo registrado</p>
                <p className={styles.notifDate}>Hace 1 hora</p>
              </div>
            </div>
            <div className={styles.notification}>
              <div className={styles.notifIcon}>💬</div>
              <div>
                <p className={styles.notifTitle}>3 mensajes sin leer</p>
                <p className={styles.notifDate}>Hace 2 horas</p>
              </div>
            </div>
            <div className={styles.notification}>
              <div className={styles.notifIcon}>⚠️</div>
              <div>
                <p className={styles.notifTitle}>Turno cancelado</p>
                <p className={styles.notifDate}>Hace 3 horas</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

     
    </div>
  )
}

export default AdminHome