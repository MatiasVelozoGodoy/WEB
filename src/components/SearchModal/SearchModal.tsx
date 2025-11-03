"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Search, X, ChevronRight, Calendar, Phone, Info, Stethoscope, Sparkles, Clock } from "lucide-react"
import { FaTooth } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import styles from "./SearchModal.module.scss"

type Item = {
  title: string
  description?: string
  url: string
  category: "Servicio" | "Turnos" | "Contacto" | "Nosotros" | "Paciente"
  icon?: "tooth" | "stethoscope" | "calendar" | "phone" | "info"
  keywords?: string[]
}

const DEFAULT_DATA: Item[] = [
  {
    title: "Limpieza profesional",
    description: "Profilaxis y pulido para prevenir caries y gingivitis.",
    url: "/servicios",
    category: "Servicio",
    icon: "tooth",
    keywords: ["higiene", "profilaxis", "placa", "sarro"],
  },
  {
    title: "Ortodoncia",
    description: "Alineadores y brackets para corregir la mordida.",
    url: "/servicios",
    category: "Servicio",
    icon: "stethoscope",
    keywords: ["alineadores", "brackets", "mordida"],
  },
  {
    title: "Blanqueamiento dental",
    description: "Tratamiento estético para una sonrisa más luminosa.",
    url: "/servicios",
    category: "Servicio",
    icon: "tooth",
    keywords: ["estética", "manchas", "color"],
  },
  {
    title: "Implantes",
    description: "Reemplazo de piezas ausentes con implantes dentales.",
    url: "/servicios",
    category: "Servicio",
    icon: "stethoscope",
    keywords: ["implante", "prótesis"],
  },
  {
    title: "Solicitar turno",
    description: "Reservá tu consulta en minutos.",
    url: "/turno",
    category: "Turnos",
    icon: "calendar",
    keywords: ["agenda", "reserva", "cita"],
  },
  {
    title: "Urgencias y contacto",
    description: "Teléfono, WhatsApp, ubicación y horarios.",
    url: "/contacto",
    category: "Contacto",
    icon: "phone",
    keywords: ["urgencia", "llamar", "ubicación"],
  },
  {
    title: "Nosotros",
    description: "Equipo, filosofía y tecnología del consultorio.",
    url: "/servicios",
    category: "Nosotros",
    icon: "info",
    keywords: ["equipo", "tecnología", "filosofía"],
  },
  {
    title: "Área paciente",
    description: "Ingresá a tu panel para ver turnos y mensajes.",
    url: "/dashboard/paciente",
    category: "Paciente",
    icon: "info",
    keywords: ["panel", "historia", "mensajes"],
  },
]

const RECENTS_KEY = "lavalle_search_recents"
const SUGGESTIONS = ["Limpieza", "Ortodoncia", "Implantes", "Turno"]

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
}

function highlight(text: string, query: string) {
  if (!query) return text
  const q = normalize(query)
  const t = text
  const tn = normalize(text)
  const idx = tn.indexOf(q)
  if (idx === -1) return t
  const end = idx + q.length
  return (
    <>
      {t.slice(0, idx)}
      <mark>{t.slice(idx, end)}</mark>
      {t.slice(end)}
    </>
  )
}

type Props = {
  open: boolean
  onClose: () => void
  data?: Item[]
}

export default function SearchModal({ open, onClose, data = DEFAULT_DATA }: Props) {
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState(0)
  const [recents, setRecents] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const raw = localStorage.getItem(RECENTS_KEY)
    if (raw) setRecents(JSON.parse(raw))
  }, [])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
      setTimeout(() => inputRef.current?.focus(), 80)
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelected((s) => Math.min(s + 1, filtered.length - 1))
      }
      if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelected((s) => Math.max(s - 1, 0))
      }
      if (e.key === "Enter") {
        const item = filtered[selected] || null
        if (item) handleGo(item)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, selected]) // eslint-disable-line

  const filtered = useMemo(() => {
    const q = normalize(query)
    if (!q) return []
    return data
      .map((it) => {
        const haystack = [it.title, it.description || "", ...(it.keywords || []), it.category].map(normalize).join(" ")
        const score = haystack.includes(q) ? 1 : 0
        return { it, score }
      })
      .filter((r) => r.score > 0)
      .map((r) => r.it)
      .slice(0, 8)
  }, [query, data])

  function saveRecent(term: string) {
    const next = [term, ...recents.filter((r) => r !== term)].slice(0, 6)
    setRecents(next)
    localStorage.setItem(RECENTS_KEY, JSON.stringify(next))
  }

  function handleGo(item: Item) {
    saveRecent(query || item.title)
    onClose()
    navigate(item.url)
  }

  function iconFor(i?: Item["icon"]) {
    switch (i) {
      case "tooth":
        return <FaTooth size={18} />
      case "stethoscope":
        return <Stethoscope size={18} />
      case "calendar":
        return <Calendar size={18} />
      case "phone":
        return <Phone size={18} />
      default:
        return <Info size={18} />
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={onClose}
        >
          <motion.div
            className={styles.modal}
            initial={{ y: 40, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            onMouseDown={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className={styles.searchBar}>
              <div className={styles.searchInputWrapper}>
                <Search size={20} className={styles.searchIcon} />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setSelected(0)
                  }}
                  placeholder="Buscar tratamientos, servicios y ayuda..."
                  aria-label="Buscar"
                />
              </div>
              <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
                <X size={20} />
              </button>
            </div>

            <div className={styles.body}>
              {!query && (
                <motion.div
                  className={styles.empty}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className={styles.emptyIcon}>
                    <Sparkles size={40} strokeWidth={1.5} />
                  </div>
                  <h3>Descubrí nuestros servicios</h3>
                  <p>Encontrá tratamientos, agendá turnos y accedé a toda la información que necesitás</p>

                  <div className={styles.suggestions}>
                    <div className={styles.sectionHeader}>
                      <Sparkles size={16} />
                      <span>Búsquedas populares</span>
                    </div>
                    <div className={styles.chips}>
                      {SUGGESTIONS.map((s, i) => (
                        <motion.button
                          key={s}
                          className={styles.chip}
                          onClick={() => setQuery(s)}
                          type="button"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 + i * 0.05 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {s}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {recents.length > 0 && (
                    <div className={styles.recents}>
                      <div className={styles.sectionHeader}>
                        <Clock size={16} />
                        <span>Búsquedas recientes</span>
                      </div>
                      <div className={styles.tags}>
                        {recents.map((r, i) => (
                          <motion.button
                            key={r}
                            className={styles.tag}
                            onClick={() => setQuery(r)}
                            type="button"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + i * 0.04 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {r}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {query && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                  <ul className={styles.results} role="listbox">
                    {filtered.length === 0 && (
                      <motion.li
                        className={styles.noResults}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Search size={24} />
                        <p>No encontramos resultados para "{query}"</p>
                        <span>Intenta con otros términos de búsqueda</span>
                      </motion.li>
                    )}
                    {filtered.map((item, i) => (
                      <motion.li
                        key={item.url}
                        className={`${styles.result} ${i === selected ? styles.active : ""}`}
                        onMouseEnter={() => setSelected(i)}
                        onClick={() => handleGo(item)}
                        role="option"
                        aria-selected={i === selected}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className={styles.resultIcon}>{iconFor(item.icon)}</div>
                        <div className={styles.resultContent}>
                          <div className={styles.resultHeader}>
                            <h4 className={styles.title}>{highlight(item.title, query)}</h4>
                            <span className={styles.badge}>{item.category}</span>
                          </div>
                          {item.description && <p className={styles.desc}>{highlight(item.description, query)}</p>}
                        </div>
                        <ChevronRight size={20} className={styles.chev} />
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
