"use client"

import { useMemo, useState } from "react"
import { Eye, X, Pencil, Ban, CheckCircle2, Clock3, XCircle, Filter as FilterIcon } from "lucide-react"
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout"
import DataTable from "@/components/DataTable/DataTable"
import { patientAppointments as seed, patientTreatment } from "../../../data/dashboardData"
import styles from "./PatientAppointmentSection.module.scss"
import Button from "@/components/UI/Button/Button"

type Row = {
  id: string
  date: string
  time: string
  reason: string
  insurance: string 
  payment: string
  status: "Completado" | "Pendiente" | "Cancelado"
  receipt?: string
}

type Filters = {
  q: string
  estado: "" | "Completado" | "Pendiente" | "Cancelado"
  pago: "" | "Completo" | "Pendiente" | "Cancelado"
}

const columns = [
  { key: "date", label: "Fecha" },
  { key: "time", label: "Hora" },
  { key: "reason", label: "Motivo" },
  { key: "payment", label: "Pago" },
  { key: "status", label: "Estado" },
]

const PatientAppointments = () => {
  const [rows, setRows] = useState<Row[]>((seed as any[]).map((r, i) => ({ id: r.id ?? String(i + 1), ...r })))
  const [filters, setFilters] = useState<Filters>({ q: "", estado: "", pago: "" })
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [showCancel, setShowCancel] = useState<{ open: boolean; ids: string[] }>({ open: false, ids: [] })
  const [showFilters, setShowFilters] = useState(false)

  const [viewRow, setViewRow] = useState<Row | null>(null)
  const [editRow, setEditRow] = useState<Row | null>(null)
  const [editDraft, setEditDraft] = useState<Partial<Row>>({})

  const stats = useMemo(() => {
    const completed = rows.filter((a) => a.status === "Completado").length
    const pending = rows.filter((a) => a.status === "Pendiente").length
    const cancelled = rows.filter((a) => a.status === "Cancelado").length
    return { completed, pending, cancelled }
  }, [rows])

  const filteredData = useMemo(() => {
    const q = filters.q.trim().toLowerCase()
    return rows.filter((r) => {
      const matchQ =
        !q ||
        r.date.toLowerCase().includes(q) ||
        r.time.toLowerCase().includes(q) ||
        r.reason.toLowerCase().includes(q) ||
        r.payment.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q)
      const matchE = !filters.estado || r.status === filters.estado
      const matchP = !filters.pago || r.payment === filters.pago
      return matchQ && matchE && matchP
    })
  }, [rows, filters])

  const openCancelSelected = () => {
    if (selectedIds.length === 0) return
    setShowCancel({ open: true, ids: selectedIds })
  }
  const openCancelSingle = (id: string) => setShowCancel({ open: true, ids: [id] })
  const confirmCancel = (reason: string) => {
    void reason
    setRows((prev) => prev.map((r) => (showCancel.ids.includes(r.id) ? { ...r, status: "Cancelado" } : r)))
    setSelectedIds([])
    setShowCancel({ open: false, ids: [] })
  }

  const openEdit = (row: Row) => {
    setEditRow(row)
    setEditDraft({ ...row })
  }
  const saveEdit = () => {
    if (!editRow) return
    setRows((prev) => prev.map((r) => (r.id === editRow.id ? { ...(r as Row), ...(editDraft as Row) } : r)))
    setEditRow(null)
    setEditDraft({})
  }

  return (
    <DashboardLayout userType="cliente" userRole="patient" userName={patientTreatment.patientName ?? "Francisco"}>
      <div className={styles.page}>
        <div className={styles.headerRow}>
        
          <button
            className={`${styles.cancelBulkBtn} ${selectedIds.length === 0 ? styles.disabled : ""}`}
            onClick={openCancelSelected}
            disabled={selectedIds.length === 0}
            type="button"
            title={selectedIds.length === 0 ? "Selecciona uno o más turnos" : "Cancelar turno(s)"}
          >
            <Ban size={20} />
            <span>Cancelar Turno</span>
          </button>
        </div>

        <div className={styles.summaryRow}>
          <div className={styles.summaryCard}>
            <CheckCircle2 size={26} />
            <div className={styles.summaryNumber}>{stats.completed}</div>
            <div className={styles.summaryLabel}>Completos</div>
          </div>
          <div className={styles.summaryCard}>
            <Clock3 size={26} />
            <div className={styles.summaryNumber}>{stats.pending}</div>
            <div className={styles.summaryLabel}>Pendientes</div>
          </div>
          <div className={styles.summaryCard}>
            <XCircle size={26} />
            <div className={styles.summaryNumber}>{stats.cancelled}</div>
            <div className={styles.summaryLabel}>Cancelados</div>
          </div>
        </div>

      
        <div className={styles.tableCard}>
          <DataTable
            columns={columns}
            data={filteredData}
            selectable
            onSelectionChange={(ids: string[]) => setSelectedIds(ids)}
            actions={[
              { icon: <Eye />, label: "Ver", onClick: (row: Row) => setViewRow(row) },
              { icon: <Pencil />, label: "Editar", onClick: (row: Row) => openEdit(row) },
              { icon: <X />, label: "Cancelar", onClick: (row: Row) => openCancelSingle(row.id) },
            ]}
          />
        </div>

        {viewRow && (
          <>
            <div className={styles.modalOverlay} onClick={() => setViewRow(null)} />
            <div className={styles.modalWrap}>
              <div className={styles.modal}>
                <div className={styles.modalHead}>
                  <h4>Detalle del Turno</h4>
                  <button className={styles.iconBtn} onClick={() => setViewRow(null)} aria-label="Cerrar">✕</button>
                </div>
                <div className={styles.modalBody}>
                  <div className={styles.field}><label>Fecha</label><div className={styles.note}>{viewRow.date}</div></div>
                  <div className={styles.field}><label>Hora</label><div className={styles.note}>{viewRow.time}</div></div>
                  <div className={styles.field}><label>Motivo</label><div className={styles.note}>{viewRow.reason}</div></div>
                  <div className={styles.field}><label>Pago</label><div className={styles.note}>{viewRow.payment}</div></div>
                  <div className={styles.field}><label>Estado</label><div className={styles.note}>{viewRow.status}</div></div>
                </div>
                <div className={styles.modalFoot}>
                  <Button variant="secondary" size="small" onClick={() => setViewRow(null)}>Cerrar</Button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* EDIT MODAL */}
        {editRow && (
          <>
            <div className={styles.modalOverlay} onClick={() => setEditRow(null)} />
            <div className={styles.modalWrap}>
              <div className={styles.modal}>
                <div className={styles.modalHead}>
                  <h4>Editar Turno</h4>
                  <button className={styles.iconBtn} onClick={() => setEditRow(null)} aria-label="Cerrar">✕</button>
                </div>
                <div className={styles.modalBody}>
                  <div className={styles.field}>
                    <label>Fecha</label>
                    <input
                      type="text"
                      value={editDraft.date ?? ""}
                      onChange={(e) => setEditDraft((d) => ({ ...d, date: e.target.value }))}
                      placeholder="dd/mm/aaaa"
                    />
                  </div>
                  <div className={styles.field}>
                    <label>Hora</label>
                    <input
                      type="text"
                      value={editDraft.time ?? ""}
                      onChange={(e) => setEditDraft((d) => ({ ...d, time: e.target.value }))}
                      placeholder="hh:mm"
                    />
                  </div>
                  <div className={styles.field}>
                    <label>Motivo</label>
                    <input
                      type="text"
                      value={editDraft.reason ?? ""}
                      onChange={(e) => setEditDraft((d) => ({ ...d, reason: e.target.value }))}
                    />
                  </div>
                </div>
                <div className={styles.modalFoot}>
                  <Button variant="primary" size="small" onClick={() => setEditRow(null)} type="button">
                    Cancelar
                  </Button>
                  <Button variant="secondary" size="small" onClick={saveEdit} type="button">
                    Guardar cambios
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}

        {showCancel.open && (
          <>
            <div className={styles.modalOverlay} onClick={() => setShowCancel({ open: false, ids: [] })} />
            <div className={styles.modalWrap}>
              <div className={styles.modal}>
                <div className={styles.modalHead}>
                  <h4>Cancelar turno{showCancel.ids.length > 1 ? "s" : ""}</h4>
                <button className={styles.iconBtn}  onClick={() => setShowCancel({ open: false, ids: [] })} aria-label="Cerrar">✕</button>
                </div>
                
                <div className={styles.modalBody}>
                  <div className={styles.field}>
                    <label>Motivo de cancelación</label>
                    <input id="reasonCancel" placeholder="(opcional)" />
                  </div>
                  <div className={styles.note}>
                    Se marcarán como <strong>Cancelado</strong> {showCancel.ids.length} turno(s).
                  </div>
                </div>
                <div className={styles.modalFoot}>
                  <Button  variant="primary" onClick={() => setShowCancel({ open: false, ids: [] })} type="button">
                    Volver
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      confirmCancel((document.getElementById("reasonCancel") as HTMLInputElement | null)?.value ?? "")
                    }
                    type="button"
                  >
                    Confirmar cancelación
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

export default PatientAppointments
