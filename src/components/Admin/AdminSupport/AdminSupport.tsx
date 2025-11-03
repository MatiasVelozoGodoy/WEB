"use client"

import { useState } from "react"
import type { JSX } from "react"
import {
  Calendar,
  Users,
  Package,
  BarChart3,
  Bell,
  MessageSquare,
  Settings,
  LifeBuoy,
  X,
  ArrowUpRight,
} from "lucide-react"
import styles from "./AdminSupport.module.scss"

type Topic = {
  id: string
  title: string
  summary: string
  details: string[]
  icon: JSX.Element
}

const WHATSAPP_URL =
  "https://wa.me/5490000000000?text=Hola%20Equipo%20de%20Sistemas%2C%20necesito%20ayuda%20con%20la%20plataforma."

const topics: Topic[] = [
  {
    id: "turnos",
    title: "Turnos",
    summary: "Filtrá, bloqueá horarios y creá turnos rápidamente.",
    details: [
      "Usá las tarjetas de filtros para elegir mes, semana y hora.",
      "Bloqueá un día u horario desde el panel derecho.",
      "Agregá un turno con el botón principal y completá los datos.",
      "Desde la tabla, podés ver, editar o cancelar un turno.",
    ],
    icon: <Calendar size={22} />,
  },
  {
    id: "pacientes",
    title: "Pacientes",
    summary: "Buscá, visualizá y editá la ficha del paciente.",
    details: [
      "Utilizá la barra de búsqueda para filtrar por nombre o DNI.",
      "Abrí el modal de detalle para ver información completa.",
      "Editá datos y guardá cambios desde las acciones de la tabla.",
    ],
    icon: <Users size={22} />,
  },
  {
    id: "stock",
    title: "Gestión de Stock",
    summary: "Controlá insumos, precios y unidades.",
    details: [
      "Usá 'Añadir Stock' para crear nuevos registros.",
      "Editá cantidad, unidad y precio desde el modal de edición.",
      "Seleccioná filas para acciones masivas si es necesario.",
    ],
    icon: <Package size={22} />,
  },
  {
    id: "estadisticas",
    title: "Estadísticas",
    summary: "Visualizá indicadores clave del negocio.",
    details: [
      "Elegí la métrica desde el panel lateral.",
      "Abrí el editor para filtrar por mes y año.",
      "Interpretá los ejes para comparar semanas del mes.",
    ],
    icon: <BarChart3 size={22} />,
  },
  {
    id: "recordatorios",
    title: "Recordatorios",
    summary: "Creá recordatorios y seguí tus pendientes.",
    details: [
      "Usá 'Agregar recordatorio' para programar un evento.",
      "Los cards muestran los días restantes para el evento.",
      "Editá o eliminá recordatorios desde su tarjeta.",
    ],
    icon: <Bell size={22} />,
  },
  {
    id: "mensajes",
    title: "Mensajes",
    summary: "Gestioná conversaciones con pacientes.",
    details: [
      "Filtrá conversaciones por nombre o contenido.",
      "Seleccioná un chat para ver el hilo.",
      "Escribí y enviá mensajes para responder en tiempo real.",
    ],
    icon: <MessageSquare size={22} />,
  },
  {
    id: "configuracion",
    title: "Configuración",
    summary: "Ajustes generales y permisos.",
    details: [
      "Actualizá datos de la clínica y branding.",
      "Definí roles y permisos de usuarios.",
      "Configurá integraciones y notificaciones.",
    ],
    icon: <Settings size={22} />,
  },
]

const AdminSupport = () => {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<Topic | null>(null)

  const openTopic = (t: Topic) => {
    setActive(t)
    setOpen(true)
  }

  return (
    <section id="support" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleWrap}>
            <div className={styles.headerIcon}>
              <LifeBuoy size={24} />
            </div>
            <div>
              <h2 className={styles.title}>Centro de Soporte</h2>
              <p className={styles.subtitle}>Elegí una sección para ver cómo usarla paso a paso</p>
            </div>
          </div>
          <a className={styles.whatsapp} href={WHATSAPP_URL} target="_blank" rel="noreferrer">
            <span>WhatsApp Soporte</span>
            <ArrowUpRight size={18} />
          </a>
        </div>

        <div className={styles.cards}>
          {topics.map((t) => (
            <button key={t.id} type="button" className={styles.card} onClick={() => openTopic(t)}>
              <div className={styles.cardIcon}>{t.icon}</div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{t.title}</h3>
                <p className={styles.cardSummary}>{t.summary}</p>
              </div>
              <div className={styles.cardArrow}>
                <ArrowUpRight size={20} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {open && active && (
        <>
          <div className={styles.modalOverlay} onClick={() => setOpen(false)} />
          <div className={styles.modal} role="dialog" aria-modal="true">
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleWrap}>
                <div className={styles.modalIcon}>{active.icon}</div>
                <h4 className={styles.modalTitle}>{active.title}</h4>
              </div>
              <button className={styles.closeButton} onClick={() => setOpen(false)} aria-label="Cerrar" type="button">
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <ul className={styles.steps}>
                {active.details.map((d, i) => (
                  <li key={`${active.id}-${i}`} className={styles.step}>
                    <span className={styles.stepNumber}>{i + 1}</span>
                    <span className={styles.stepText}>{d}</span>
                  </li>
                ))}
              </ul>

              <a className={styles.modalCta} href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                <span>Contactar por WhatsApp</span>
                <ArrowUpRight size={18} />
              </a>
            </div>
          </div>
        </>
      )}
    </section>
  )
}

export default AdminSupport
