"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Bell, Plus, X } from "lucide-react"
import Button from "@/components/UI/Button/Button"
import { adminReminders as seedReminders } from "../../../data/dashboardData"
import styles from "./AdminRemindersSection.module.scss"

type NewReminder = {
  title: string
  description: string
  dueAt: string
  type: "appointment" | "message" | "reminder"
}

type Reminder = {
  id: string
  type: "appointment" | "message" | "reminder"
  title: string
  description: string
  time?: string
  dueAt?: string
}

const parseDue = (r: Reminder | NewReminder): Date | null => {
  const s = ("dueAt" in r && r.dueAt) || ("time" in r ? r.time : "")
  if (!s) return null
  const iso = new Date(s)
  if (!isNaN(iso.getTime())) return iso
  const dmY = s.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?(?:\s+(\d{1,2}):(\d{2}))?$/)
  if (dmY) {
    const d = parseInt(dmY[1], 10)
    const m = parseInt(dmY[2], 10) - 1
    const y = dmY[3] ? parseInt(dmY[3], 10) : new Date().getFullYear()
    const hh = dmY[4] ? parseInt(dmY[4], 10) : 9
    const mm = dmY[5] ? parseInt(dmY[5], 10) : 0
    return new Date(y, m, d, hh, mm, 0)
  }
  const dRel = s.match(/^(\d+)\s*d$/i)
  if (dRel) {
    const n = parseInt(dRel[1], 10)
    const t = new Date()
    t.setDate(t.getDate() + n)
    return t
  }
  const hRel = s.match(/^(\d+)\s*h$/i)
  if (hRel) {
    const n = parseInt(hRel[1], 10)
    const t = new Date()
    t.setHours(t.getHours() + n)
    return t
  }
  if (s.toLowerCase() === "hoy") return new Date()
  return null
}

const daysLeft = (r: Reminder | NewReminder) => {
  const due = parseDue(r)
  if (!due) return null
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  const end = new Date(due)
  end.setHours(0, 0, 0, 0)
  const ms = end.getTime() - start.getTime()
  const d = Math.ceil(ms / (1000 * 60 * 60 * 24))
  return d < 0 ? 0 : d
}

const AdminRemindersSection = () => {
  const [reminders, setReminders] = useState<Reminder[]>(seedReminders)
  const [q, setQ] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [form, setForm] = useState<NewReminder>({
    title: "",
    description: "",
    dueAt: "",
    type: "reminder",
  })

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return reminders
    return reminders.filter(r =>
      [r.title, r.description, r.time ?? r.dueAt ?? ""].join(" ").toLowerCase().includes(term)
    )
  }, [q, reminders])

  const openAdd = () => {
    setForm({ title: "", description: "", dueAt: "", type: "reminder" })
    setIsAddOpen(true)
  }

  const saveAdd = (e: React.FormEvent) => {
    e.preventDefault()
    const next: Reminder = {
      id: String(Date.now()),
      type: form.type,
      title: form.title,
      description: form.description,
      dueAt: form.dueAt,
    }
    setReminders(prev => [next, ...prev])
    setIsAddOpen(false)
  }

  return (
    <section id="reminders" className={styles.section}>
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <input
            type="text"
            placeholder="Buscar recordatorios..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <button className={styles.addBtn} type="button" onClick={openAdd}>
          <span className={styles.addIcon}><Plus size={18} /></span>
          Agregar recordatorio
        </button>
      </div>

      <div className={styles.list}>
        {filtered.length === 0 && <div className={styles.empty}>Sin resultados</div>}

        {filtered.map((r) => {
          const d = daysLeft(r)
          const label = d === null ? "—" : d === 0 ? "Hoy" : `Faltan ${d} días`
          return (
            <motion.div
              key={r.id}
              className={styles.card}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className={styles.icon}><Bell /></div>
              <div className={styles.content}>
                <h4>{r.title}</h4>
                <p>{r.description}</p>
              </div>
              <div className={styles.badgeDays}>{label}</div>
            </motion.div>
          )
        })}
      </div>

      {isAddOpen && (
        <>
          <div className={styles.modalOverlay} onClick={() => setIsAddOpen(false)} />
          <div className={styles.modal} role="dialog" aria-modal="true">
            <div className={styles.modalHeader}>
              <h3>Nuevo recordatorio</h3>
              <button className={styles.iconClose} onClick={() => setIsAddOpen(false)} aria-label="Cerrar">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={saveAdd} className={styles.modalBody}>
              <label className={styles.field}>
                <span>Título</span>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </label>
              <label className={styles.field}>
                <span>Descripción</span>
                <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              </label>
              <div className={styles.inline}>
                <label className={styles.field}>
                  <span>Tipo</span>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as NewReminder["type"] })}
                  >
                    <option value="appointment">Turno</option>
                    <option value="message">Mensaje</option>
                    <option value="reminder">Recordatorio</option>
                  </select>
                </label>
                <label className={styles.field}>
                  <span>Fecha</span>
                  <input
                    type="date"
                    value={form.dueAt}
                    onChange={(e) => setForm({ ...form, dueAt: e.target.value })}
                    required
                  />
                </label>
              </div>
              <div className={styles.modalActions}>
                <Button variant="secondary" type="button" onClick={() => setIsAddOpen(false)}>Cancelar</Button>
                <Button variant="primary" type="submit">Guardar</Button>
              </div>
            </form>
          </div>
        </>
      )}
    </section>
  )
}

export default AdminRemindersSection

