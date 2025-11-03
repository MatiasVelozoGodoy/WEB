"use client"

import { useState } from "react"
import type { JSX } from "react"
import {
  Calendar,
  FileText,
  MessageSquare,
  Settings,
  Bell,
  LifeBuoy,
  X,
  ArrowUpRight,
  User,
} from "lucide-react"
import styles from "./PatientSupport.module.scss"

type Topic = {
  id: string
  title: string
  summary: string
  details: string[]
  icon: JSX.Element
}

const WHATSAPP_URL =
  "https://wa.me/5490000000000?text=Hola%20equipo%20de%20soporte%2C%20necesito%20ayuda%20con%20mi%20dashboard%20de%20paciente."

const topics: Topic[] = [
  {
    id: "turnos",
    title: "Turnos",
    summary: "Sacá y gestioná tus turnos en segundos.",
    details: [
      "Ingresá a Mis Turnos para ver próximos y anteriores.",
      "Elegí servicio/profesional si corresponde y seleccioná fecha y hora.",
      "Confirmá la reserva y activá recordatorios.",
      "Podés reprogramar o cancelar desde la tarjeta del turno.",
    ],
    icon: <Calendar size={22} />,
  },
  {
    id: "tratamiento",
    title: "Mi Tratamiento",
    summary: "Seguimiento del plan y progreso.",
    details: [
      "Revisá el plan de tratamiento y su progreso.",
      "Consultá indicaciones y prescripciones vigentes.",
      "Verificá próximas sesiones relacionadas.",
      "Descargá adjuntos clínicos cuando estén disponibles.",
    ],
    icon: <FileText size={22} />,
  },
  {
    id: "historia",
    title: "Historia Clínica",
    summary: "Toda tu historia ordenada por fechas y archivos.",
    details: [
      "Entrá a Historia Clínica para ver consultas y procedimientos.",
      "Filtrá por tratamiento o período.",
      "Abrí cada archivo para ver entradas y notas.",
      "Descargá estudios o comprobantes adjuntos.",
    ],
    icon: <FileText size={22} />,
  },
  {
    id: "mensajes",
    title: "Mensajes",
    summary: "Chateá con la clínica cuando lo necesites.",
    details: [
      "Buscá una conversación o iniciá una nueva.",
      "Escribí tu consulta y adjuntá archivos si hace falta.",
      "Recibí respuestas y notificaciones en tiempo real.",
    ],
    icon: <MessageSquare size={22} />,
  },
  {
    id: "configuracion",
    title: "Configuración",
    summary: "Actualizá tus datos y preferencias.",
    details: [
      "Editá datos personales, contacto y obra social.",
      "Cambiá tu contraseña desde Seguridad.",
      "Definí preferencias de notificaciones (email/WhatsApp).",
    ],
    icon: <Settings size={22} />,
  },
  {
    id: "notificaciones",
    title: "Notificaciones",
    summary: "Recordatorios y avisos importantes.",
    details: [
      "Activá recordatorios para turnos y controles.",
      "Elegí el canal preferido (email/WhatsApp).",
      "Revisá el historial de avisos recibidos.",
    ],
    icon: <Bell size={22} />,
  },
  {
    id: "perfil",
    title: "Mi Perfil",
    summary: "Foto, nombre visible y DNI.",
    details: [
      "Actualizá tu foto de perfil.",
      "Asegurate que nombre, DNI y teléfono sean correctos.",
      "Guardá cambios antes de salir.",
    ],
    icon: <User size={22} />,
  },
]

const PatientSupport = () => {
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
              <h2 className={styles.title}>Ayuda del Paciente</h2>
              <p className={styles.subtitle}>Elegí un tema para ver los pasos</p>
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

export default PatientSupport
