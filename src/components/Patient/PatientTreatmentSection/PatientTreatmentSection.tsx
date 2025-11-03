"use client"

import { useState } from "react"
import DashboardLayout from "../../../components/DashboardLayout/DashboardLayout"
import { patientTreatment } from "../../../data/dashboardData"
import styles from "./PatientTreatmentSection.module.scss"

type ToothStatus = "sano" | "empaste" | "corona" | "tratamiento" | "extraccion"

const initialToothChart = [
  { number: 18, status: "sano" as ToothStatus },
  { number: 17, status: "sano" as ToothStatus },
  { number: 16, status: "empaste" as ToothStatus },
  { number: 15, status: "sano" as ToothStatus },
  { number: 14, status: "sano" as ToothStatus },
  { number: 13, status: "sano" as ToothStatus },
  { number: 12, status: "sano" as ToothStatus },
  { number: 11, status: "sano" as ToothStatus },
  { number: 21, status: "sano" as ToothStatus },
  { number: 22, status: "sano" as ToothStatus },
  { number: 23, status: "sano" as ToothStatus },
  { number: 24, status: "corona" as ToothStatus },
  { number: 25, status: "sano" as ToothStatus },
  { number: 26, status: "sano" as ToothStatus },
  { number: 27, status: "sano" as ToothStatus },
  { number: 28, status: "sano" as ToothStatus },
  { number: 38, status: "sano" as ToothStatus },
  { number: 37, status: "sano" as ToothStatus },
  { number: 36, status: "sano" as ToothStatus },
  { number: 35, status: "sano" as ToothStatus },
  { number: 34, status: "sano" as ToothStatus },
  { number: 33, status: "sano" as ToothStatus },
  { number: 32, status: "sano" as ToothStatus },
  { number: 31, status: "sano" as ToothStatus },
  { number: 41, status: "sano" as ToothStatus },
  { number: 42, status: "sano" as ToothStatus },
  { number: 43, status: "sano" as ToothStatus },
  { number: 44, status: "sano" as ToothStatus },
  { number: 45, status: "tratamiento" as ToothStatus },
  { number: 46, status: "sano" as ToothStatus },
  { number: 47, status: "sano" as ToothStatus },
  { number: 48, status: "extraccion" as ToothStatus },
]

const initialTimeline = [
  { date: "2024-01-15", title: "Consulta Inicial", status: "completed", description: "Examen oral completo" },
  { date: "2024-02-01", title: "Empaste Pieza #16", status: "completed", description: "Procedimiento de empaste compuesto" },
  { date: "2024-02-20", title: "Preparación Corona #24", status: "completed", description: "Preparación de corona y colocación temporal" },
  { date: "2024-03-10", title: "Colocación Corona #24", status: "in-progress", description: "Instalación de corona permanente" },
  { date: "2024-04-05", title: "Endodoncia #45", status: "scheduled", description: "Tratamiento endodóntico planificado" },
  { date: "2024-05-15", title: "Extracción #48", status: "scheduled", description: "Extracción de muela del juicio" },
]

const initialAppointments = [
  { date: "2024-03-10", time: "10:00", type: "Colocación de Corona", doctor: "Od. Hernández" },
  { date: "2024-04-05", time: "14:30", type: "Endodoncia", doctor: "Od. Cavaglia" },
  { date: "2024-05-15", time: "09:00", type: "Extracción", doctor: "Od. Cavaglia" },
]

interface PatientTreatmentProps {
  isAdmin?: boolean
}

const Content = ({ isAdmin = false }: PatientTreatmentProps) => {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<"overview" | "timeline" | "appointments">("overview")
  const [teeth, setTeeth] = useState(initialToothChart)
  const [progressGeneral, setProgressGeneral] = useState({ completed: 8, total: 12 })
  const [phaseProgress, setPhaseProgress] = useState({ percentage: 40, label: "Procedimientos restaurativos en progreso" })
  const [conditions, setConditions] = useState(patientTreatment.conditions ?? [])
  const [medications, setMedications] = useState(patientTreatment.medications ?? [])
  const [timeline, setTimeline] = useState(initialTimeline)
  const [appointments, setAppointments] = useState(initialAppointments)

  const generalPct = Math.max(0, Math.min(100, Math.round((progressGeneral.completed / Math.max(1, progressGeneral.total)) * 100)))

  const [toothModal, setToothModal] = useState(false)
  const [toothForm, setToothForm] = useState<{ number: number; status: ToothStatus }>({
    number: teeth[0].number,
    status: teeth[0].status,
  })

  const [progressModal, setProgressModal] = useState(false)
  const [progressForm, setProgressForm] = useState({
    completed: progressGeneral.completed,
    total: progressGeneral.total,
    phasePercentage: phaseProgress.percentage,
    phaseLabel: phaseProgress.label,
  })

  const [conditionsModal, setConditionsModal] = useState(false)
  const [conditionsDraft, setConditionsDraft] = useState(conditions)

  const [medicationsModal, setMedicationsModal] = useState(false)
  const [medicationsDraft, setMedicationsDraft] = useState(medications)

  const [timelineModal, setTimelineModal] = useState(false)
  const [timelineEditingIndex, setTimelineEditingIndex] = useState<number | null>(null)
  const [timelineForm, setTimelineForm] = useState({ date: "", title: "", status: "scheduled", description: "" })

  const [appointmentModal, setAppointmentModal] = useState(false)
  const [appointmentEditingIndex, setAppointmentEditingIndex] = useState<number | null>(null)
  const [appointmentForm, setAppointmentForm] = useState({ date: "", time: "", type: "", doctor: "" })

  const openToothEditor = () => {
    const baseNumber = selectedTooth ?? teeth[0].number
    const current = teeth.find(t => t.number === baseNumber) || teeth[0]
    setToothForm({ number: current.number, status: current.status })
    setToothModal(true)
  }

  const saveTooth = () => {
    setTeeth(prev => prev.map(t => (t.number === toothForm.number ? { ...t, status: toothForm.status } : t)))
    setSelectedTooth(toothForm.number)
    setToothModal(false)
  }

  const openProgressEditor = () => {
    setProgressForm({
      completed: progressGeneral.completed,
      total: progressGeneral.total,
      phasePercentage: phaseProgress.percentage,
      phaseLabel: phaseProgress.label,
    })
    setProgressModal(true)
  }

  const saveProgress = () => {
    const c = Math.max(0, Number(progressForm.completed) || 0)
    const t = Math.max(1, Number(progressForm.total) || 1)
    const p = Math.max(0, Math.min(100, Number(progressForm.phasePercentage) || 0))
    setProgressGeneral({ completed: Math.min(c, t), total: t })
    setPhaseProgress({ percentage: p, label: progressForm.phaseLabel })
    setProgressModal(false)
  }

  const openConditionsEditor = () => {
    setConditionsDraft(conditions.map(c => ({ ...c })))
    setConditionsModal(true)
  }

  const saveConditions = () => {
    setConditions(conditionsDraft.filter((c: any) => c.name && String(c.name).trim() !== ""))
    setConditionsModal(false)
  }

  const addConditionRow = () => setConditionsDraft((prev: any[]) => [...prev, { name: "", diagnosis: "", date: "" }])
  const removeConditionRow = (idx: number) => setConditionsDraft((prev: any[]) => prev.filter((_, i) => i !== idx))

  const openMedicationsEditor = () => {
    setMedicationsDraft(medications.map(m => ({ ...m })))
    setMedicationsModal(true)
  }

  const saveMedications = () => {
    setMedications(medicationsDraft.filter((m: any) => m.name && String(m.name).trim() !== ""))
    setMedicationsModal(false)
  }

  const addMedicationRow = () => setMedicationsDraft((prev: any[]) => [...prev, { name: "", dosage: "" }])
  const removeMedicationRow = (idx: number) => setMedicationsDraft((prev: any[]) => prev.filter((_, i) => i !== idx))

  const openTimelineAdd = () => {
    setTimelineEditingIndex(null)
    setTimelineForm({ date: "", title: "", status: "scheduled", description: "" })
    setTimelineModal(true)
  }

  const openTimelineEdit = (idx: number) => {
    const item = timeline[idx]
    setTimelineEditingIndex(idx)
    setTimelineForm({ date: item.date, title: item.title, status: item.status, description: item.description })
    setTimelineModal(true)
  }

  const saveTimeline = () => {
    if (!timelineForm.title || !timelineForm.date) return
    if (timelineEditingIndex === null) {
      setTimeline(prev => [{ ...timelineForm }, ...prev])
    } else {
      setTimeline(prev => prev.map((it, i) => (i === timelineEditingIndex ? { ...timelineForm } : it)))
    }
    setTimelineModal(false)
    setTimelineEditingIndex(null)
  }

  const openAppointmentAdd = () => {
    setAppointmentEditingIndex(null)
    setAppointmentForm({ date: "", time: "", type: "", doctor: "" })
    setAppointmentModal(true)
  }

  const openAppointmentEdit = (idx: number) => {
    const a = appointments[idx]
    setAppointmentEditingIndex(idx)
    setAppointmentForm({ ...a })
    setAppointmentModal(true)
  }

  const saveAppointment = () => {
    if (!appointmentForm.type || !appointmentForm.date || !appointmentForm.time) return
    if (appointmentEditingIndex === null) {
      setAppointments(prev => [{ ...appointmentForm }, ...prev])
    } else {
      setAppointments(prev => prev.map((a, i) => (i === appointmentEditingIndex ? { ...appointmentForm } : a)))
    }
    setAppointmentModal(false)
    setAppointmentEditingIndex(null)
  }

  const safeMonth = (d: string) =>
    d ? new Date(d).toLocaleDateString("es-AR", { month: "short" }) : "-"

  return (
    <div className={styles.wrap}>
      <section className={styles.patientHeader}>
        <div className={styles.patientInfo}>
          <img
            src="https://i.pravatar.cc/150?img=12"
            alt={patientTreatment.patientName ? `Paciente ${patientTreatment.patientName}` : "Paciente"}
          />
          <div className={styles.patientDetails}>
            <div className={styles.nameRow}>
              <h1>{patientTreatment.patientName ?? "Usuario"}</h1>
              <span className={styles.statusBadge}>Tratamiento Activo</span>
            </div>
            <div className={styles.patientMeta}>
              <span>DNI: {patientTreatment.dni}</span>
              <span>•</span>
              <span>{patientTreatment.gender}</span>
              <span>•</span>
              <span>{patientTreatment.age} años</span>
            </div>
          </div>
        </div>

        <div className={styles.quickStats}>
          <div className={styles.statCard} aria-label="Próximos turnos">
            <div className={styles.statIcon}>📅</div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{appointments.length}</span>
              <span className={styles.statLabel}>Próximos</span>
            </div>
          </div>
          <div className={styles.statCard} aria-label="Tratamientos completados">
            <div className={styles.statIcon}>✓</div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{timeline.filter(t => t.status === "completed").length}</span>
              <span className={styles.statLabel}>Completados</span>
            </div>
          </div>
          <div className={styles.statCard} aria-label="Piezas en tratamiento">
            <div className={styles.statIcon}>🦷</div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{teeth.filter(t => t.status !== "sano").length}</span>
              <span className={styles.statLabel}>En Tratamiento</span>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.tabNav} role="tablist" aria-label="Secciones de tratamiento">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "overview"}
          aria-controls="panel-overview"
          className={`${styles.tab} ${activeTab === "overview" ? styles.active : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          Resumen
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "timeline"}
          aria-controls="panel-timeline"
          className={`${styles.tab} ${activeTab === "timeline" ? styles.active : ""}`}
          onClick={() => setActiveTab("timeline")}
        >
          Línea de Tiempo
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "appointments"}
          aria-controls="panel-appointments"
          className={`${styles.tab} ${activeTab === "appointments" ? styles.active : ""}`}
          onClick={() => setActiveTab("appointments")}
        >
          Turnos
        </button>
      </div>

      {activeTab === "overview" && (
        <div id="panel-overview" role="tabpanel" aria-labelledby="Resumen">
          {isAdmin && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Odontograma</h2>
                <button type="button" className={styles.editBtn} onClick={openToothEditor}>Editar</button>
              </div>

              <div className={styles.dentalChart}>
                <div className={styles.chartLegend} aria-label="Leyenda de estados dentales">
                  <div className={styles.legendItem}><span className={`${styles.legendDot} ${styles.sano}`} /><span>Sano</span></div>
                  <div className={styles.legendItem}><span className={`${styles.legendDot} ${styles.empaste}`} /><span>Empaste</span></div>
                  <div className={styles.legendItem}><span className={`${styles.legendDot} ${styles.corona}`} /><span>Corona</span></div>
                  <div className={styles.legendItem}><span className={`${styles.legendDot} ${styles.tratamiento}`} /><span>En Tratamiento</span></div>
                  <div className={styles.legendItem}><span className={`${styles.legendDot} ${styles.extraccion}`} /><span>Extracción Planificada</span></div>
                </div>

                <div className={styles.teethGrid}>
                  <div className={styles.teethRow}>
                    {teeth.slice(0, 8).map(t => (
                      <div
                        key={t.number}
                        role="button"
                        tabIndex={0}
                        aria-label={`Pieza ${t.number}, estado ${t.status}`}
                        className={`${styles.tooth} ${styles[t.status]} ${selectedTooth === t.number ? styles.selected : ""}`}
                        onClick={() => setSelectedTooth(t.number)}
                        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelectedTooth(t.number)}
                      >
                        <span className={styles.toothNumber}>{t.number}</span>
                      </div>
                    ))}
                    {teeth.slice(8, 16).map(t => (
                      <div
                        key={t.number}
                        role="button"
                        tabIndex={0}
                        aria-label={`Pieza ${t.number}, estado ${t.status}`}
                        className={`${styles.tooth} ${styles[t.status]} ${selectedTooth === t.number ? styles.selected : ""}`}
                        onClick={() => setSelectedTooth(t.number)}
                        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelectedTooth(t.number)}
                      >
                        <span className={styles.toothNumber}>{t.number}</span>
                      </div>
                    ))}
                  </div>
                  <div className={styles.teethRow}>
                    {teeth.slice(16, 24).map(t => (
                      <div
                        key={t.number}
                        role="button"
                        tabIndex={0}
                        aria-label={`Pieza ${t.number}, estado ${t.status}`}
                        className={`${styles.tooth} ${styles[t.status]} ${selectedTooth === t.number ? styles.selected : ""}`}
                        onClick={() => setSelectedTooth(t.number)}
                        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelectedTooth(t.number)}
                      >
                        <span className={styles.toothNumber}>{t.number}</span>
                      </div>
                    ))}
                    {teeth.slice(24, 32).map(t => (
                      <div
                        key={t.number}
                        role="button"
                        tabIndex={0}
                        aria-label={`Pieza ${t.number}, estado ${t.status}`}
                        className={`${styles.tooth} ${styles[t.status]} ${selectedTooth === t.number ? styles.selected : ""}`}
                        onClick={() => setSelectedTooth(t.number)}
                        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelectedTooth(t.number)}
                      >
                        <span className={styles.toothNumber}>{t.number}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedTooth && (
                  <div className={styles.toothDetails}>
                    <h4>Pieza #{selectedTooth}</h4>
                    <p>Estado: {teeth.find(x => x.number === selectedTooth)?.status}</p>
                  </div>
                )}
              </div>
            </section>
          )}

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Progreso del Tratamiento</h2>
              {isAdmin && <button type="button" className={styles.editBtn} onClick={openProgressEditor}>Editar</button>}
            </div>

            <div className={styles.progressCards}>
              <div className={styles.progressCard}>
                <div className={styles.progressHeader}>
                  <h3>Tratamiento General</h3>
                  <span className={styles.percentage}>{generalPct}%</span>
                </div>
                <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: `${generalPct}%` }} /></div>
                <p className={styles.progressLabel}>{progressGeneral.completed} de {progressGeneral.total} procedimientos completados</p>
              </div>

              <div className={styles.progressCard}>
                <div className={styles.progressHeader}>
                  <h3>Fase Actual</h3>
                  <span className={styles.percentage}>{phaseProgress.percentage}%</span>
                </div>
                <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: `${phaseProgress.percentage}%` }} /></div>
                <p className={styles.progressLabel}>{phaseProgress.label}</p>
              </div>
            </div>
          </section>

          <div className={styles.detailsGrid}>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Condiciones Médicas</h2>
                {isAdmin && <button type="button" className={styles.editBtn} onClick={openConditionsEditor}>Editar</button>}
              </div>
              <ul className={styles.detailsList}>
                {conditions.map((c: any, i: number) => (
                  <li key={i} className={styles.detailItem}>
                    <div className={styles.itemIcon}>⚕️</div>
                    <div className={styles.itemContent}>
                      <strong>{c.name}</strong>
                      {c.diagnosis && <span className={styles.itemMeta}>{c.diagnosis}</span>}
                      {c.date && <span className={styles.itemDate}>{c.date}</span>}
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Medicación Actual</h2>
                {isAdmin && <button type="button" className={styles.editBtn} onClick={openMedicationsEditor}>Editar</button>}
              </div>
              <ul className={styles.detailsList}>
                {medications.map((m: any, i: number) => (
                  <li key={i} className={styles.detailItem}>
                    <div className={styles.itemIcon}>💊</div>
                    <div className={styles.itemContent}>
                      <strong>{m.name}</strong>
                      {m.dosage && <span className={styles.itemMeta}>{m.dosage}</span>}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      )}

      {activeTab === "timeline" && (
        <section id="panel-timeline" role="tabpanel" aria-labelledby="Línea de Tiempo" className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Línea de Tiempo del Tratamiento</h2>
            {isAdmin && <button type="button" className={styles.addBtn} onClick={openTimelineAdd}>Agregar Entrada</button>}
          </div>

          <div className={styles.timeline}>
            {timeline.map((item, index) => (
              <div key={`${item.title}-${item.date}-${index}`} className={`${styles.timelineItem} ${styles[item.status as "completed" | "in-progress" | "scheduled"]}`}>
                <div className={styles.timelineMarker}>
                  {item.status === "completed" && "✓"}
                  {item.status === "in-progress" && "⟳"}
                  {item.status === "scheduled" && "○"}
                </div>
                <div className={styles.timelineContent}>
                  <div className={styles.timelineHeader}>
                    <h3>{item.title}</h3>
                    <div className={styles.timelineActions}>
                      <span className={`${styles.timelineStatus} ${styles[item.status as "completed" | "in-progress" | "scheduled"]}`}>
                        {item.status === "completed" && "Completado"}
                        {item.status === "in-progress" && "En Progreso"}
                        {item.status === "scheduled" && "Programado"}
                      </span>
                      {isAdmin && <button type="button" className={styles.editIconBtn} onClick={() => openTimelineEdit(index)} aria-label={`Editar ${item.title}`}>✏️</button>}
                    </div>
                  </div>
                  <p className={styles.timelineDate}>{item.date}</p>
                  <p className={styles.timelineDescription}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === "appointments" && (
        <section id="panel-appointments" role="tabpanel" aria-labelledby="Turnos" className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Próximos Turnos</h2>
            {isAdmin && <button type="button" className={styles.addBtn} onClick={openAppointmentAdd}>Agregar Turno</button>}
          </div>

          <div className={styles.appointmentsList}>
            {appointments.map((apt, index) => {
              const d = apt.date ? new Date(apt.date) : null
              const day = d && !isNaN(d.getTime()) ? d.getDate() : "-"
              const month = d && !isNaN(d.getTime()) ? safeMonth(apt.date) : "-"
              return (
                <div key={`${apt.type}-${apt.date}-${index}`} className={styles.appointmentCard}>
                  <div className={styles.appointmentDate} aria-label={`Fecha ${apt.date || "-"}`}>
                    <div className={styles.dateDay}>{day as any}</div>
                    <div className={styles.dateMonth}>{month}</div>
                  </div>
                  <div className={styles.appointmentDetails}>
                    <h3>{apt.type || "-"}</h3>
                    <p className={styles.appointmentTime}>⏰ {apt.time || "-"}</p>
                    <p className={styles.appointmentDoctor}>👨‍⚕️ {apt.doctor || "-"}</p>
                  </div>
                  <div className={styles.appointmentActions}>
                    {isAdmin && <button type="button" className={styles.editIconBtn} onClick={() => openAppointmentEdit(index)} aria-label={`Editar turno ${apt.type}`}>✏️</button>}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Modals */}
      {toothModal && (
        <div className={styles.modalOverlay} onClick={() => setToothModal(false)}>
          <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Editar Odontograma" onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Editar Odontograma</h2>
              <button type="button" className={styles.closeBtn} onClick={() => setToothModal(false)} aria-label="Cerrar">✕</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Pieza</label>
                  <select className={styles.input} value={toothForm.number} onChange={e => setToothForm(f => ({ ...f, number: Number(e.target.value) }))}>
                    {teeth.map(t => <option key={t.number} value={t.number}>{t.number}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Estado</label>
                  <select className={styles.input} value={toothForm.status} onChange={e => setToothForm(f => ({ ...f, status: e.target.value as ToothStatus }))}>
                    <option value="sano">Sano</option>
                    <option value="empaste">Empaste</option>
                    <option value="corona">Corona</option>
                    <option value="tratamiento">En Tratamiento</option>
                    <option value="extraccion">Extracción Planificada</option>
                  </select>
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button type="button" className={styles.cancelBtn} onClick={() => setToothModal(false)}>Cancelar</button>
              <button type="button" className={styles.saveBtn} onClick={saveTooth}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {progressModal && (
        <div className={styles.modalOverlay} onClick={() => setProgressModal(false)}>
          <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Editar Progreso" onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Editar Progreso</h2>
              <button type="button" className={styles.closeBtn} onClick={() => setProgressModal(false)} aria-label="Cerrar">✕</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Completados</label>
                  <input className={styles.input} type="number" min={0} inputMode="numeric" value={progressForm.completed} onChange={e => setProgressForm(f => ({ ...f, completed: Number(e.target.value) }))} />
                </div>
                <div className={styles.formGroup}>
                  <label>Total</label>
                  <input className={styles.input} type="number" min={1} inputMode="numeric" value={progressForm.total} onChange={e => setProgressForm(f => ({ ...f, total: Number(e.target.value) }))} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>% Fase Actual</label>
                  <input className={styles.input} type="number" min={0} max={100} inputMode="numeric" value={progressForm.phasePercentage} onChange={e => setProgressForm(f => ({ ...f, phasePercentage: Number(e.target.value) }))} />
                </div>
                <div className={styles.formGroup}>
                  <label>Descripción Fase</label>
                  <input className={styles.input} value={progressForm.phaseLabel} onChange={e => setProgressForm(f => ({ ...f, phaseLabel: e.target.value }))} />
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button type="button" className={styles.cancelBtn} onClick={() => setProgressModal(false)}>Cancelar</button>
              <button type="button" className={styles.saveBtn} onClick={saveProgress}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {conditionsModal && (
        <div className={styles.modalOverlay} onClick={() => setConditionsModal(false)}>
          <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Editar Condiciones" onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Editar Condiciones</h2>
              <button type="button" className={styles.closeBtn} onClick={() => setConditionsModal(false)} aria-label="Cerrar">✕</button>
            </div>
            <div className={styles.modalBody}>
              {conditionsDraft.map((c: any, i: number) => (
                <div key={`cond-${i}`} className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Nombre</label>
                    <input className={styles.input} value={c.name || ""} onChange={e => setConditionsDraft((prev: any[]) => prev.map((x, idx) => (idx === i ? { ...x, name: e.target.value } : x)))} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Diagnóstico</label>
                    <input className={styles.input} value={c.diagnosis || ""} onChange={e => setConditionsDraft((prev: any[]) => prev.map((x, idx) => (idx === i ? { ...x, diagnosis: e.target.value } : x)))} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Fecha</label>
                    <input className={styles.input} type="date" value={c.date || ""} onChange={e => setConditionsDraft((prev: any[]) => prev.map((x, idx) => (idx === i ? { ...x, date: e.target.value } : x)))} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>&nbsp;</label>
                    <button type="button" className={styles.cancelBtn} onClick={() => removeConditionRow(i)}>Eliminar</button>
                  </div>
                </div>
              ))}
              <button type="button" className={styles.addBtn} onClick={addConditionRow}>Agregar Condición</button>
            </div>
            <div className={styles.modalFooter}>
              <button type="button" className={styles.cancelBtn} onClick={() => setConditionsModal(false)}>Cancelar</button>
              <button type="button" className={styles.saveBtn} onClick={saveConditions}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {medicationsModal && (
        <div className={styles.modalOverlay} onClick={() => setMedicationsModal(false)}>
          <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Editar Medicación" onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Editar Medicación</h2>
              <button type="button" className={styles.closeBtn} onClick={() => setMedicationsModal(false)} aria-label="Cerrar">✕</button>
            </div>
            <div className={styles.modalBody}>
              {medicationsDraft.map((m: any, i: number) => (
                <div key={`med-${i}`} className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Nombre</label>
                    <input className={styles.input} value={m.name || ""} onChange={e => setMedicationsDraft((prev: any[]) => prev.map((x, idx) => (idx === i ? { ...x, name: e.target.value } : x)))} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Dosificación</label>
                    <input className={styles.input} value={m.dosage || ""} onChange={e => setMedicationsDraft((prev: any[]) => prev.map((x, idx) => (idx === i ? { ...x, dosage: e.target.value } : x)))} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>&nbsp;</label>
                    <button type="button" className={styles.cancelBtn} onClick={() => removeMedicationRow(i)}>Eliminar</button>
                  </div>
                </div>
              ))}
              <button type="button" className={styles.addBtn} onClick={addMedicationRow}>Agregar Medicación</button>
            </div>
            <div className={styles.modalFooter}>
              <button type="button" className={styles.cancelBtn} onClick={() => setMedicationsModal(false)}>Cancelar</button>
              <button type="button" className={styles.saveBtn} onClick={saveMedications}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {timelineModal && (
        <div className={styles.modalOverlay} onClick={() => setTimelineModal(false)}>
          <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Editar Línea de Tiempo" onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{timelineEditingIndex === null ? "Agregar Entrada" : "Editar Entrada"}</h2>
              <button type="button" className={styles.closeBtn} onClick={() => setTimelineModal(false)} aria-label="Cerrar">✕</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Título</label>
                <input className={styles.input} value={timelineForm.title} onChange={e => setTimelineForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Fecha</label>
                  <input className={styles.input} type="date" value={timelineForm.date} onChange={e => setTimelineForm(f => ({ ...f, date: e.target.value }))} />
                </div>
                <div className={styles.formGroup}>
                  <label>Estado</label>
                  <select className={styles.input} value={timelineForm.status} onChange={e => setTimelineForm(f => ({ ...f, status: e.target.value }))}>
                    <option value="scheduled">Programado</option>
                    <option value="in-progress">En Progreso</option>
                    <option value="completed">Completado</option>
                  </select>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Descripción</label>
                <textarea className={styles.textarea} rows={3} value={timelineForm.description} onChange={e => setTimelineForm(f => ({ ...f, description: e.target.value }))} />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button type="button" className={styles.cancelBtn} onClick={() => setTimelineModal(false)}>Cancelar</button>
              <button type="button" className={styles.saveBtn} onClick={saveTimeline}>{timelineEditingIndex === null ? "Agregar" : "Guardar"}</button>
            </div>
          </div>
        </div>
      )}

      {appointmentModal && (
        <div className={styles.modalOverlay} onClick={() => setAppointmentModal(false)}>
          <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Editar Turno" onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{appointmentEditingIndex === null ? "Agregar Turno" : "Editar Turno"}</h2>
              <button type="button" className={styles.closeBtn} onClick={() => setAppointmentModal(false)} aria-label="Cerrar">✕</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Procedimiento</label>
                <input className={styles.input} value={appointmentForm.type} onChange={e => setAppointmentForm(f => ({ ...f, type: e.target.value }))} />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Fecha</label>
                  <input className={styles.input} type="date" value={appointmentForm.date} onChange={e => setAppointmentForm(f => ({ ...f, date: e.target.value }))} />
                </div>
                <div className={styles.formGroup}>
                  <label>Hora</label>
                  <input className={styles.input} type="time" value={appointmentForm.time} onChange={e => setAppointmentForm(f => ({ ...f, time: e.target.value }))} />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Profesional</label>
                <input className={styles.input} value={appointmentForm.doctor} onChange={e => setAppointmentForm(f => ({ ...f, doctor: e.target.value }))} />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button type="button" className={styles.cancelBtn} onClick={() => setAppointmentModal(false)}>Cancelar</button>
              <button type="button" className={styles.saveBtn} onClick={saveAppointment}>{appointmentEditingIndex === null ? "Agregar" : "Guardar"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const PatientTreatmentSection = ({ isAdmin = false }: PatientTreatmentProps) => {
  if (isAdmin) return <Content isAdmin />
  return (
    <DashboardLayout
      userType="cliente"
      userRole="cliente"
      userName={patientTreatment.patientName ?? "Usuario"}
    >
      <Content />
    </DashboardLayout>
  )
}

export default PatientTreatmentSection
